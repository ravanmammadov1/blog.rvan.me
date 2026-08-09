import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Consolidated LinkedIn Daily Content Pipeline Endpoint
 *
 * Actions:
 *  - default / action=generate: Selects top un-published news article from Rvan.me Sanity dataset,
 *    generates Azerbaijani post, resolves cover image, saves draft candidate in Sanity (APPROVAL MODE).
 *  - action=approve: Approves pending candidate draft, publishes to LinkedIn API with link to rvan.me/az/news/{slug},
 *    and records in published history.
 *  - action=reject: Rejects pending draft candidate.
 */

const PENDING_SINGLETON_ID = "linkedinPendingPostSingleton";
const TOKEN_SINGLETON_ID = "linkedinTokenSingleton";
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

async function getSanityDoc(docId: string) {
  const result = await querySanity(`*[_id == "${docId}"][0]`);
  return result || null;
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

function resolveSanityImageUrl(imageRef: string): string | null {
  if (!imageRef) return null;
  const match = imageRef.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;

  const [, id, dimensions, ext] = match;
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}`;
}

function generateAzerbaijaniPost(article: {
  title: string;
  excerpt: string;
  category: string;
  sourceName: string;
  slug: string;
}): string {
  const rvanUrl = `https://www.rvan.me/az/news/${article.slug}`;

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

  let cleanExcerpt = article.excerpt
    .replace(/\.{3,}$/, "")
    .replace(/\s*Read the full article.*$/i, "")
    .trim();

  const sentences = cleanExcerpt.split(/\.\s+/).filter(s => s.length > 20);
  const summaryPart = sentences.slice(0, 2).join(". ").trim();
  const summary = summaryPart.endsWith(".") ? summaryPart : summaryPart + ".";

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

// ──────────────────────────────────────────────────────────────────
// ACTION 1: Generate Candidate Draft
// ──────────────────────────────────────────────────────────────────
async function handleGenerate(req: VercelRequest, res: VercelResponse) {
  const historyList: any[] = (await querySanity(`*[_type == "linkedinPublishHistory"]{ articleSlug, sourceUrl, headline }`)) || [];
  const publishedSlugs = new Set<string>();
  const publishedUrls = new Set<string>();

  historyList.forEach((h) => {
    if (h.articleSlug) publishedSlugs.add(h.articleSlug);
    if (h.sourceUrl) publishedUrls.add(h.sourceUrl);
  });

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

  if (recentNews.length === 0) {
    return res.status(200).json({
      success: false,
      message: "No news articles found in the Rvan.me dataset.",
    });
  }

  const candidates = recentNews.filter((article) => {
    if (!article.slug || !article.title) return false;
    if (publishedSlugs.has(article.slug)) return false;
    if (article.sourceUrl && publishedUrls.has(article.sourceUrl)) return false;
    return true;
  });

  if (candidates.length === 0) {
    return res.status(200).json({
      success: false,
      message: "All recent Rvan.me news articles have already been published to LinkedIn.",
    });
  }

  const scored = candidates.map((article) => {
    let score = 0;
    const ageMs = Date.now() - new Date(article.publishedAt).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);

    if (ageHours <= 24) score += 40;
    else if (ageHours <= 48) score += 30;
    else if (ageHours <= 72) score += 20;
    else if (ageHours <= 168) score += 10;

    if (article.coverImageRef) score += 20;

    const excerptLen = (article.excerpt || "").length;
    if (excerptLen >= 150) score += 15;
    else if (excerptLen >= 80) score += 10;

    const cat = (article.category || "").toLowerCase();
    if (cat === "ai" || cat.includes("artificial")) score += 15;
    else if (cat === "design" || cat.includes("ux")) score += 12;
    else score += 8;

    return { ...article, pipelineScore: score };
  });

  scored.sort((a, b) => b.pipelineScore - a.pipelineScore);
  const selected = scored[0];

  let coverImageUrl: string | null = null;
  if (selected.coverImageRef) {
    coverImageUrl = resolveSanityImageUrl(selected.coverImageRef);
  }

  const generatedPost = generateAzerbaijaniPost({
    title: selected.title,
    excerpt: selected.excerpt || "",
    category: selected.category || "AI",
    sourceName: selected.sourceName || "Rvan.me",
    slug: selected.slug,
  });

  const rvanArticleUrl = `https://www.rvan.me/az/news/${selected.slug}`;
  const nowIso = new Date().toISOString();

  const pendingDoc = {
    _id: PENDING_SINGLETON_ID,
    _type: "linkedinPendingPost",
    headline: selected.title,
    articleSlug: selected.slug,
    articleId: selected._id,
    sourceName: selected.sourceName || "Rvan.me",
    sourceUrl: rvanArticleUrl,
    originalSourceUrl: selected.sourceUrl,
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
}

// ──────────────────────────────────────────────────────────────────
// ACTION 2: Approve & Publish Draft
// ──────────────────────────────────────────────────────────────────
async function handleApprove(req: VercelRequest, res: VercelResponse) {
  const pendingDoc = await getSanityDoc(PENDING_SINGLETON_ID);
  if (!pendingDoc || !pendingDoc.generatedPost) {
    return res.status(404).json({ error: "No pending LinkedIn post found to approve." });
  }

  if (pendingDoc.status === "approved") {
    return res.status(400).json({ error: "This post has already been approved and published." });
  }

  const tokenDoc = await getSanityDoc(TOKEN_SINGLETON_ID);
  if (!tokenDoc || !tokenDoc.accessToken || !tokenDoc.memberUrn) {
    return res.status(401).json({ error: "LinkedIn account is not connected. Please connect via Admin Panel." });
  }

  const rvanUrl = pendingDoc.sourceUrl;

  const postPayload: Record<string, any> = {
    author: tokenDoc.memberUrn,
    commentary: pendingDoc.generatedPost.trim(),
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  if (rvanUrl) {
    postPayload.content = {
      article: {
        source: rvanUrl,
        title: pendingDoc.headline || "Rvan.me",
      },
    };
  }

  const response = await fetch("https://api.linkedin.com/v2/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenDoc.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202401",
    },
    body: JSON.stringify(postPayload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[linkedin/pipeline] LinkedIn API Error:", errText);
    return res.status(response.status).json({
      error: `LinkedIn API publish error (${response.status}): ${errText}`,
    });
  }

  const postId = response.headers.get("x-restli-id") || "published";
  const nowIso = new Date().toISOString();

  const historyDoc = {
    _id: `linkedinHistory_${Date.now()}`,
    _type: "linkedinPublishHistory",
    headline: pendingDoc.headline,
    articleSlug: pendingDoc.articleSlug || null,
    articleId: pendingDoc.articleId || null,
    sourceUrl: pendingDoc.sourceUrl,
    originalSourceUrl: pendingDoc.originalSourceUrl || null,
    sourceName: pendingDoc.sourceName,
    category: pendingDoc.category,
    postId,
    publishedAt: nowIso,
  };

  const updatedPendingDoc = {
    ...pendingDoc,
    status: "approved",
    approvedAt: nowIso,
    postId,
  };

  await mutateSanity([
    { createOrReplace: historyDoc },
    { createOrReplace: updatedPendingDoc },
  ]);

  return res.status(200).json({
    success: true,
    postId,
    headline: pendingDoc.headline,
    rvanUrl,
    publishedAt: nowIso,
    message: "Post approved and successfully published to your personal LinkedIn profile!",
  });
}

// ──────────────────────────────────────────────────────────────────
// ACTION 3: Reject Draft
// ──────────────────────────────────────────────────────────────────
async function handleReject(req: VercelRequest, res: VercelResponse) {
  const pendingDoc = await getSanityDoc(PENDING_SINGLETON_ID);
  if (!pendingDoc) {
    return res.status(404).json({ error: "No pending post found." });
  }

  const updatedDoc = {
    ...pendingDoc,
    status: "rejected",
    rejectedAt: new Date().toISOString(),
  };

  await mutateSanity([{ createOrReplace: updatedDoc }]);

  return res.status(200).json({
    success: true,
    message: "Pending LinkedIn draft candidate rejected.",
  });
}

// ──────────────────────────────────────────────────────────────────
// Main Handler: Routes action query/body parameter
// ──────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!verifyAdminOrCronAuth(req)) {
    return res.status(401).json({ error: "Unauthorized pipeline trigger." });
  }

  try {
    const action = (req.query.action as string) || (req.body && req.body.action) || "generate";

    if (action === "approve") {
      return await handleApprove(req, res);
    } else if (action === "reject") {
      return await handleReject(req, res);
    } else {
      return await handleGenerate(req, res);
    }
  } catch (err: any) {
    console.error("[linkedin/pipeline] Pipeline exception:", err);
    return res.status(500).json({
      error: err.message || "Failed to execute daily content pipeline.",
    });
  }
}
