import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";
import crypto from "crypto";
import { executeGenerateCandidateDraft } from "./linkedin/pipeline.js";

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

// ─────────────────────────────────────────────────────────────────
// RSS Feed Sources — Official, verified, high-quality
// ─────────────────────────────────────────────────────────────────
const feeds = [
  // ── AI / Major Tech Companies ──
  { category: "AI", url: "https://openai.com/blog/rss.xml", sourceName: "OpenAI", format: "rss" },
  { category: "AI", url: "https://blog.google/technology/ai/rss/", sourceName: "Google AI Blog", format: "rss" },
  { category: "AI", url: "https://deepmind.google/blog/rss.xml", sourceName: "Google DeepMind", format: "rss" },
  { category: "AI", url: "https://machinelearning.apple.com/rss.xml", sourceName: "Apple Machine Learning", format: "rss" },
  { category: "AI", url: "https://www.microsoft.com/en-us/research/feed/", sourceName: "Microsoft Research", format: "rss" },
  { category: "AI", url: "https://blogs.nvidia.com/feed/", sourceName: "NVIDIA Blog", format: "rss" },
  { category: "AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/", sourceName: "MIT Technology Review AI", format: "rss" },
  { category: "AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", sourceName: "TechCrunch AI", format: "rss" },
  { category: "AI", url: "https://www.wired.com/feed/tag/ai/latest/rss", sourceName: "WIRED AI", format: "rss" },

  // ── Design & UX & Inspiration ──
  { category: "Design", url: "https://uxdesign.cc/feed", sourceName: "UX Collective", format: "rss" },
  { category: "Design", url: "https://www.awwwards.com/blog/feed/", sourceName: "Awwwards", format: "rss" },
  { category: "Design", url: "https://www.creativebloq.com/feed", sourceName: "Creative Bloq", format: "rss" },
  { category: "Design", url: "https://dribbble.com/stories.rss", sourceName: "Dribbble", format: "rss" },
  { category: "Design", url: "https://www.nngroup.com/feed/rss/", sourceName: "Nielsen Norman Group", format: "rss" },
  { category: "Design", url: "https://tympanus.net/codrops/feed/", sourceName: "Codrops", format: "rss" },
  { category: "Design", url: "https://www.designweek.co.uk/feed/", sourceName: "Design Week", format: "rss" },
  { category: "Design", url: "https://www.apple.com/newsroom/rss-feed.rss", sourceName: "Apple Newsroom", format: "atom" },

  // ── Marketing & Growth ──
  { category: "Marketing", url: "https://blog.hubspot.com/marketing/rss.xml", sourceName: "HubSpot Marketing", format: "rss" },
  { category: "Marketing", url: "https://buffer.com/resources/feed/", sourceName: "Buffer Blog", format: "rss" },
  { category: "Marketing", url: "https://www.searchenginejournal.com/feed/", sourceName: "Search Engine Journal", format: "rss" },
  { category: "Marketing", url: "https://www.socialmediaexaminer.com/feed/", sourceName: "Social Media Examiner", format: "rss" },

  // ── Development & Frontend ──
  { category: "Development", url: "https://www.smashingmagazine.com/feed/", sourceName: "Smashing Magazine", format: "rss" },
  { category: "Development", url: "https://css-tricks.com/feed/", sourceName: "CSS-Tricks", format: "rss" },
  { category: "Development", url: "https://alistapart.com/main/feed/", sourceName: "A List Apart", format: "rss" },

  // ── Motion Design ──
  { category: "Motion Design", url: "https://motionographer.com/feed/", sourceName: "Motionographer", format: "rss" },
];

const blacklistedKeywords = [
  "bug fix", "patch note", "changelog", "weekly digest", "documentation update",
  "release note", "minor release", "hotfix", "update v", "weekly wrap",
  "monthly newsletter", "monthly wrap", "digest", "newsletter", "v1.", "v2.", "v3.",
  "sponsored content", "partner content", "advertisement",
];

// ─────────────────────────────────────────────────────────────────
// XML Parsing Helpers (RSS + Atom)
// ─────────────────────────────────────────────────────────────────

function extractCdataOrText(xmlStr: string, tag: string): string {
  const regex = new RegExp(`<${tag}>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*?))</${tag}>`, "i");
  const match = xmlStr.match(regex);
  if (match) {
    return (match[1] || match[2] || "").trim();
  }
  return "";
}

/** Extract <link href="..."/> from Atom entries */
function extractAtomLink(entryXml: string): string {
  // Prefer rel="alternate" link
  const altMatch = entryXml.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i);
  if (altMatch) return altMatch[1];
  // Fallback to any link with href
  const linkMatch = entryXml.match(/<link[^>]*href=["']([^"']+)["']/i);
  if (linkMatch) return linkMatch[1];
  return "";
}

/** Extract date from Atom entries (published or updated) */
function extractAtomDate(entryXml: string): string {
  const published = extractCdataOrText(entryXml, "published");
  if (published) return published;
  const updated = extractCdataOrText(entryXml, "updated");
  if (updated) return updated;
  return "";
}

function extractImageUrl(itemXml: string): string | null {
  const mediaMatch = itemXml.match(/<media:(?:content|thumbnail)[^>]*url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];

  const enclosureMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
  if (enclosureMatch) return enclosureMatch[1];

  const imgMatch = itemXml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return null;
}

function decodeHtmlEntities(str: string): string {
  let prev = "";
  let current = str || "";
  for (let i = 0; i < 3 && current !== prev; i++) {
    prev = current;
    current = current
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&nbsp;/gi, " ");
  }
  return current;
}

function cleanHtml(html: string): string {
  if (!html) return "";
  const decoded = decodeHtmlEntities(html);
  return decoded
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function isHighImpact(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  return !blacklistedKeywords.some((keyword) => text.includes(keyword));
}

/** Parse feed XML and return normalized article entries regardless of RSS/Atom format */
function parseFeedItems(xml: string, format: string): Array<{ title: string; link: string; pubDate: string; description: string; rawXml: string }> {
  const entries: Array<{ title: string; link: string; pubDate: string; description: string; rawXml: string }> = [];

  if (format === "atom") {
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
    let match;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[1];
      const title = extractCdataOrText(entryXml, "title");
      const link = extractAtomLink(entryXml);
      const pubDate = extractAtomDate(entryXml);
      const description = extractCdataOrText(entryXml, "summary") || extractCdataOrText(entryXml, "content");
      entries.push({ title, link, pubDate, description, rawXml: entryXml });
    }
  } else {
    // RSS format
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = extractCdataOrText(itemXml, "title");
      const link = extractCdataOrText(itemXml, "link");
      const pubDate = extractCdataOrText(itemXml, "pubDate") || extractCdataOrText(itemXml, "dc:date");
      const description = extractCdataOrText(itemXml, "description") || extractCdataOrText(itemXml, "content:encoded");
      entries.push({ title, link, pubDate, description, rawXml: itemXml });
    }
  }

  return entries;
}

// ─────────────────────────────────────────────────────────────────
// Main Handler
// ─────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("SANITY_API_WRITE_TOKEN is not configured.");
    return res.status(500).json({ error: "SANITY_API_WRITE_TOKEN is missing" });
  }

  try {
    console.log("🚀 Starting fast multi-feed ingestion...");

    // Parallel fetch across all feeds with 4s timeout
    const feedPromises = feeds.map(async (feed) => {
      try {
        const response = await fetch(feed.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; Rvan.me/1.0)" },
          signal: AbortSignal.timeout(4000),
        });
        if (!response.ok) return [];
        const text = await response.text();
        const items = parseFeedItems(text, feed.format);

        const validItems = [];
        for (const item of items.slice(0, 4)) {
          if (!item.title || !item.link) continue;
          if (!isHighImpact(item.title, item.description)) continue;

          const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
          const excerpt = cleanHtml(item.description).substring(0, 300) + "...";
          const docId = "news-" + crypto.createHash("sha256").update(item.link).digest("hex");
          const imageUrl = extractImageUrl(item.rawXml);

          validItems.push({
            _type: "news",
            _id: docId,
            title: item.title.substring(0, 150),
            slug: {
              _type: "slug",
              current: slugify(item.title).substring(0, 96),
            },
            excerpt,
            category: feed.category,
            publishedAt,
            sourceUrl: item.link,
            sourceName: feed.sourceName,
            imageUrl: imageUrl || undefined,
          });
        }
        return validItems;
      } catch (err) {
        return [];
      }
    });

    const feedResults = await Promise.all(feedPromises);
    const allDocs = feedResults.flat();

    console.log(`[ingest-news] Total valid fresh docs parsed: ${allDocs.length}`);

    // Batch upload to Sanity using fast createOrReplace mutations (takes ~1 sec)
    if (allDocs.length > 0) {
      const mutations = allDocs.map((doc) => ({ createOrReplace: doc }));
      // Split into batches of 30
      for (let i = 0; i < mutations.length; i += 30) {
        const batch = mutations.slice(i, i + 30);
        await client.mutate(batch);
      }
      console.log(`✅ [ingest-news] Batch mutated ${allDocs.length} articles into Sanity database.`);
    }

    // Trigger candidate draft & publication pipeline
    let pipelineResult = null;
    try {
      pipelineResult = await executeGenerateCandidateDraft();
      console.log("LinkedIn daily pipeline candidate executed via ingest-news:", pipelineResult);
    } catch (pipelineErr: any) {
      console.error("Failed to trigger LinkedIn daily pipeline from ingest-news:", pipelineErr);
    }

    return res.status(200).json({
      success: true,
      ingestedCount: allDocs.length,
      pipelineResult,
    });
  } catch (globalErr: any) {
    console.error("Global Ingestion Error:", globalErr);
    return res.status(500).json({ error: globalErr.message || "Unknown error occurred" });
  }
}
