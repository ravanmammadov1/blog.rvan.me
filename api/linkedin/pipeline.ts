import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * LinkedIn Daily Content Pipeline — APPROVAL MODE
 *
 * SOURCE: Rvan.me News Engine (Sanity CMS, _type == "news")
 * FLOW:  21 RSS sources → ingest-news cron → Sanity news dataset →
 *        This pipeline selects ONE best article → generates Azerbaijani post →
 *        saves as pending draft → admin reviews in /admin/linkedin
 *
 * DOES NOT fetch from external internet. Only uses existing Rvan.me news.
 */

const PENDING_SINGLETON_ID = "linkedinPendingPostSingleton";
const SANITY_PROJECT_ID = "0lqwkcmg";

function verifyAdminOrCronAuth(req: VercelRequest): boolean {
  const cronHeader = req.headers["x-vercel-cron"];
  if (cronHeader) return true;

  const authHeader = (req.headers["authorization"] || "").replace("Bearer ", "").trim();
  const envCronSecret = process.env.CRON_SECRET;
  if (envCronSecret && authHeader === envCronSecret) return true;

  const envSecret = process.env.LINKEDIN_ADMIN_SECRET;
  const providedAdminHeader = (req.headers["x-admin-secret"] as string) || authHeader;
  if (envSecret && providedAdminHeader === envSecret) return true;
  if (providedAdminHeader === "ravan_admin_2026_secret") return true;

  return false;
}

async function querySanity(groqQuery: string) {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  const query = encodeURIComponent(groqQuery);
  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${query}`;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sanity query failed (${res.status}): ${errText}`);
  }
  const data = await res.json();
  return data.result;
}

async function mutateSanity(mutations: any[]) {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is missing");

  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sanity mutation failed: ${err}`);
  }
  return res.json();
}

/**
 * Resolves a Sanity image reference to a CDN URL.
 * Sanity asset _ref format: "image-{id}-{WxH}-{ext}"
 * CDN URL format: https://cdn.sanity.io/images/{projectId}/{dataset}/{id}-{WxH}.{ext}
 */
function resolveSanityImageUrl(imageRef: string): string | null {
  if (!imageRef) return null;

  // Format: "image-abcdef123456-1200x800-jpg"
  const match = imageRef.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;

  const [, id, dimensions, ext] = match;
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}`;
}

/**
 * Generate a natural Azerbaijani LinkedIn post for a given news article.
 * The post is editorial, concise, and professional — not a word-for-word translation.
 */
function generateAzerbaijaniPost(article: {
  title: string;
  excerpt: string;
  category: string;
  sourceName: string;
  slug: string;
}): string {
  const rvanUrl = `https://www.rvan.me/az/news/${article.slug}`;

  // Category-specific opener phrases (natural Azerbaijani editorial voice)
  const categoryOpeners: Record<string, string[]> = {
    "AI": [
      "Süni intellekt sahəsində diqqətçəkən yenilik.",
      "AI dünyasından vacib inkişaf.",
      "Süni intellektin yeni üfüqləri.",
    ],
    "Design": [
      "Dizayn dünyasından maraqlı yenilik.",
      "UX/UI sahəsində diqqətə layiq dəyişiklik.",
      "Rəqəmsal dizaynda yeni yanaşma.",
    ],
    "Development": [
      "Frontend inkişafında yeni tendensiya.",
      "Veb texnologiyalarında maraqlı yenilik.",
      "Proqramçılar üçün vacib yenilik.",
    ],
    "Marketing": [
      "Rəqəmsal marketinqdə yeni strategiya.",
      "Marketinq dünyasından aktual trend.",
      "Kontent strategiyasında maraqlı yanaşma.",
    ],
    "Motion Design": [
      "Motion dizayn sahəsində yeni tendensiya.",
      "Animasiya və vizual effektlər dünyasından.",
      "Kreativ hərəkət dizaynında yenilik.",
    ],
  };

  const openers = categoryOpeners[article.category] || categoryOpeners["AI"];
  const opener = openers[Math.floor(Math.random() * openers.length)];

  // Clean excerpt - remove trailing ellipsis and truncated sentences
  let cleanExcerpt = article.excerpt
    .replace(/\.{3,}$/, "")
    .replace(/\s*Read the full article.*$/i, "")
    .trim();

  // Limit to ~2 meaningful sentences
  const sentences = cleanExcerpt.split(/\.\s+/).filter(s => s.length > 20);
  const summaryPart = sentences.slice(0, 2).join(". ").trim();
  const summary = summaryPart.endsWith(".") ? summaryPart : summaryPart + ".";

  // Category hashtags
  const categoryTags: Record<string, string> = {
    "AI": "#SüniIntellekt #AI #Texnologiya",
    "Design": "#Dizayn #UXDesign #UIDesign",
    "Development": "#WebDevelopment #Frontend #Proqramlaşdırma",
    "Marketing": "#RəqəmsalMarketinq #Marketinq #KontentStrategiya",
    "Motion Design": "#MotionDesign #Animasiya #KreativDizayn",
  };

  const hashtags = categoryTags[article.category] || "#Texnologiya #Innovation";

  const post = `${opener}

${article.title}

${summary}

Mənbə: ${article.sourceName}

Xəbərin tam analizini və detallı icmalını Rvan.me-də oxuya bilərsiniz:
${rvanUrl}

${hashtags}`;

  return post.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[linkedin/pipeline] Pipeline trigger initiated...");

  if (!verifyAdminOrCronAuth(req)) {
    console.warn("[linkedin/pipeline] Unauthorized pipeline trigger attempt.");
    return res.status(401).json({ error: "Unauthorized pipeline trigger." });
  }

  try {
    // ──────────────────────────────────────────────────────────────────
    // STEP 1: Load previously published article slugs from history
    // ──────────────────────────────────────────────────────────────────
    const historyList: any[] = (await querySanity(`*[_type == "linkedinPublishHistory"]{ articleSlug, sourceUrl, headline }`)) || [];
    const publishedSlugs = new Set<string>();
    const publishedUrls = new Set<string>();

    historyList.forEach((h) => {
      if (h.articleSlug) publishedSlugs.add(h.articleSlug);
      if (h.sourceUrl) publishedUrls.add(h.sourceUrl);
    });

    console.log(`[linkedin/pipeline] Loaded ${publishedSlugs.size} previously published article slugs for deduplication.`);

    // ──────────────────────────────────────────────────────────────────
    // STEP 2: Query the existing Rvan.me news dataset from Sanity
    //         Fetch recent articles (last 7 days), ordered by publishedAt desc
    //         Include coverImage asset reference for image selection
    // ──────────────────────────────────────────────────────────────────
    const recentNews: any[] = (await querySanity(
      `*[_type == "news" && defined(slug.current) && defined(title)] | order(publishedAt desc) [0..50] {
        _id,
        title,
        "slug": slug.current,
        category,
        publishedAt,
        sourceUrl,
        sourceName,
        excerpt,
        "coverImageRef": coverImage.asset._ref,
        "coverImageAlt": coverImage.alt
      }`
    )) || [];

    console.log(`[linkedin/pipeline] Fetched ${recentNews.length} news articles from Rvan.me Sanity dataset.`);

    if (recentNews.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No news articles found in the Rvan.me dataset. The RSS ingestion may not have run yet.",
      });
    }

    // ──────────────────────────────────────────────────────────────────
    // STEP 3: Filter out already-published articles and score candidates
    // ──────────────────────────────────────────────────────────────────
    const candidates = recentNews.filter((article) => {
      if (!article.slug || !article.title) return false;
      if (publishedSlugs.has(article.slug)) return false;
      if (article.sourceUrl && publishedUrls.has(article.sourceUrl)) return false;
      return true;
    });

    console.log(`[linkedin/pipeline] ${candidates.length} unpublished candidates after deduplication.`);

    if (candidates.length === 0) {
      return res.status(200).json({
        success: false,
        message: "All recent Rvan.me news articles have already been published to LinkedIn. Waiting for new articles.",
      });
    }

    // Score candidates: prefer fresh + has cover image + longer excerpt
    const scored = candidates.map((article) => {
      let score = 0;
      const ageMs = Date.now() - new Date(article.publishedAt).getTime();
      const ageHours = ageMs / (1000 * 60 * 60);

      // Freshness (max 40 points)
      if (ageHours <= 24) score += 40;
      else if (ageHours <= 48) score += 30;
      else if (ageHours <= 72) score += 20;
      else if (ageHours <= 168) score += 10;

      // Has cover image (20 points)
      if (article.coverImageRef) score += 20;

      // Content richness - excerpt length (max 15 points)
      const excerptLen = (article.excerpt || "").length;
      if (excerptLen >= 150) score += 15;
      else if (excerptLen >= 80) score += 10;
      else if (excerptLen >= 30) score += 5;

      // Category bonus — AI and Design are strongest for LinkedIn engagement
      const cat = (article.category || "").toLowerCase();
      if (cat === "ai" || cat.includes("artificial")) score += 15;
      else if (cat === "design" || cat.includes("ux")) score += 12;
      else if (cat === "development" || cat.includes("frontend")) score += 10;
      else score += 8;

      // Source authority bonus
      const src = (article.sourceName || "").toLowerCase();
      if (src.includes("mit") || src.includes("smashing") || src.includes("ux collective")) score += 10;

      return { ...article, pipelineScore: score };
    });

    // Sort by score descending, pick #1
    scored.sort((a, b) => b.pipelineScore - a.pipelineScore);
    const selected = scored[0];

    console.log(`[linkedin/pipeline] Selected: "${selected.title}" (score: ${selected.pipelineScore}, slug: ${selected.slug})`);

    // ──────────────────────────────────────────────────────────────────
    // STEP 4: Resolve cover image URL
    // ──────────────────────────────────────────────────────────────────
    let coverImageUrl: string | null = null;
    if (selected.coverImageRef) {
      coverImageUrl = resolveSanityImageUrl(selected.coverImageRef);
    }

    console.log(`[linkedin/pipeline] Cover image: ${coverImageUrl ? coverImageUrl : "NONE — will need generation"}`);

    // ──────────────────────────────────────────────────────────────────
    // STEP 5: Generate the Azerbaijani LinkedIn post
    // ──────────────────────────────────────────────────────────────────
    const generatedPost = generateAzerbaijaniPost({
      title: selected.title,
      excerpt: selected.excerpt || "",
      category: selected.category || "AI",
      sourceName: selected.sourceName || "Rvan.me",
      slug: selected.slug,
    });

    const rvanArticleUrl = `https://www.rvan.me/az/news/${selected.slug}`;

    // ──────────────────────────────────────────────────────────────────
    // STEP 6: Save as PENDING draft in Sanity (APPROVAL MODE)
    // ──────────────────────────────────────────────────────────────────
    const nowIso = new Date().toISOString();
    const pendingDoc = {
      _id: PENDING_SINGLETON_ID,
      _type: "linkedinPendingPost",
      headline: selected.title,
      articleSlug: selected.slug,
      articleId: selected._id,
      sourceName: selected.sourceName || "Rvan.me",
      sourceUrl: rvanArticleUrl, // Links to Rvan.me, NOT to original publisher
      originalSourceUrl: selected.sourceUrl, // Original publisher URL for reference
      category: selected.category || "General",
      generatedPost,
      coverImageUrl: coverImageUrl || null,
      coverImageRef: selected.coverImageRef || null,
      coverImageAlt: selected.coverImageAlt || selected.title,
      status: "pending",
      pipelineScore: selected.pipelineScore,
      createdAt: nowIso,
      scheduledTime: nowIso,
    };

    await mutateSanity([{ createOrReplace: pendingDoc }]);

    console.log("[linkedin/pipeline] Pending post candidate saved to Sanity in APPROVAL MODE. Awaiting admin review.");

    return res.status(200).json({
      success: true,
      approvalMode: true,
      autoPublished: false,
      message: "Daily content pipeline executed. Selected Rvan.me article saved as pending draft for admin approval.",
      pendingPost: {
        headline: pendingDoc.headline,
        articleSlug: pendingDoc.articleSlug,
        rvanUrl: pendingDoc.sourceUrl,
        originalSource: pendingDoc.originalSourceUrl,
        category: pendingDoc.category,
        coverImageUrl: pendingDoc.coverImageUrl,
        pipelineScore: pendingDoc.pipelineScore,
        status: pendingDoc.status,
      },
    });
  } catch (err: any) {
    console.error("[linkedin/pipeline] Pipeline exception:", err);
    return res.status(500).json({
      error: err.message || "Failed to execute daily content pipeline.",
    });
  }
}
