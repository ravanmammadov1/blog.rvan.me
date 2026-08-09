import { aggregateNewsFeeds, NormalizedResource } from "./rssAggregator";

export interface CuratedArticle extends NormalizedResource {
  relevanceScore: number;
  sourceReferences?: string[];
  isPrimaryStory?: boolean;
}

export interface NewsPipelineAuditResult {
  totalRaw: number;
  afterDeduplication: number;
  afterQualityGate: number;
  newsThresholdCount: number; // Score >= 60
  homeThresholdCount: number; // Score >= 80
  categoryCounts: Record<string, number>;
  topSources: { source: string; count: number }[];
}

const HIGH_IMPACT_KEYWORDS = [
  "figma", "adobe", "openai", "deepmind", "gemini", "gpt", "sora", "react", "next.js",
  "vercel", "css", "webgpu", "visionos", "rive", "motion", "blender", "three.js",
  "design system", "typography", "launch", "model", "architecture", "ai agent",
  "brand campaign", "ux", "ui", "framework", "baseline", "vector", "web design",
  "creative", "marketing", "developer", "animation", "vfx", "component", "interface"
];

const REJECT_PR_SPAM_KEYWORDS = [
  "press release", "sponsored post", "advertisement", "quarterly results",
  "earnings call", "make money online", "discount code", "promo code",
  "top 10 cheap", "unbelievable secret", "affiliate link", "buy now"
];

const TIER_ONE_SOURCES = [
  "Smashing Magazine", "UX Collective", "OpenAI", "Google DeepMind",
  "Hugging Face", "React Blog", "Vercel", "Codrops", "Motionographer",
  "Blender Dev", "Stash Magazine", "MIT Tech Review", "web.dev", "Sidebar.io"
];

/**
 * Hard Quality Gate: Rejects stubs, explicit spam PRs, and clickbait
 */
export function passesQualityGate(article: NormalizedResource): boolean {
  if (!article.title || article.title.trim().length < 8) return false;

  const text = `${article.title} ${article.description || ""}`.toLowerCase();

  // Reject explicit PR spam / affiliate clickbait
  if (REJECT_PR_SPAM_KEYWORDS.some((kw) => text.includes(kw))) {
    return false;
  }

  // Reject stubs without description or title length
  if (!article.description || article.description.trim().length < 15) {
    return false;
  }

  return true;
}

/**
 * Calculates a dynamic relevance score for an article (0 - 100+)
 */
export function calculateRelevanceScore(article: NormalizedResource): number {
  let score = 55;

  const text = `${article.title} ${article.description || ""}`.toLowerCase();

  // 1. High Impact Keyword Hits (+30 pts max)
  let hits = 0;
  HIGH_IMPACT_KEYWORDS.forEach((kw) => {
    if (text.includes(kw)) hits++;
  });
  score += Math.min(hits * 7, 30);

  // 2. Publisher Tier Bonus (+20 pts)
  if (TIER_ONE_SOURCES.some((src) => article.sourceName?.toLowerCase().includes(src.toLowerCase()))) {
    score += 20;
  }

  // 3. Freshness Scoring
  const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  if (ageHours <= 24) {
    score += 20;
  } else if (ageHours <= 48) {
    score += 10;
  } else if (ageHours > 168) {
    score -= 15;
  }

  return Math.max(score, 0);
}

/**
 * De-duplicates stories across multiple sources and groups references
 */
export function deduplicateStories(articles: CuratedArticle[]): CuratedArticle[] {
  const map = new Map<string, CuratedArticle>();

  articles.forEach((art) => {
    const cleanTitle = art.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 6)
      .join(" ");

    if (!cleanTitle) {
      map.set(art.id, art);
      return;
    }

    let existingKey: string | undefined;
    for (const key of map.keys()) {
      if (key.includes(cleanTitle) || cleanTitle.includes(key)) {
        existingKey = key;
        break;
      }
    }

    if (existingKey) {
      const existing = map.get(existingKey)!;
      const refs = existing.sourceReferences || [existing.sourceName];
      if (!refs.includes(art.sourceName)) {
        refs.push(art.sourceName);
      }
      existing.sourceReferences = refs;

      if (art.relevanceScore > existing.relevanceScore) {
        map.set(existingKey, { ...art, sourceReferences: refs });
      }
    } else {
      map.set(cleanTitle, { ...art, sourceReferences: [art.sourceName] });
    }
  });

  return Array.from(map.values());
}

/**
 * Prevents any single publisher from dominating the top listings
 */
export function applySourceDiversity(articles: CuratedArticle[], maxPerSource = 3): CuratedArticle[] {
  const sourceCount: Record<string, number> = {};
  const result: CuratedArticle[] = [];

  articles.forEach((art) => {
    const src = art.sourceName || "Unknown";
    const current = sourceCount[src] || 0;

    if (current < maxPerSource) {
      sourceCount[src] = current + 1;
      result.push(art);
    }
  });

  return result;
}

let cachedNewsPipeline: CuratedArticle[] | null = null;
let cachedAuditMetrics: NewsPipelineAuditResult | null = null;

/**
 * Runs the full Content Quality Pipeline and returns empirical audit stats
 */
export async function runNewsPipelineAudit(cmsNews: any[] = []): Promise<{ articles: CuratedArticle[]; audit: NewsPipelineAuditResult }> {
  const rawItems = await aggregateNewsFeeds(cmsNews);
  const totalRaw = rawItems.length;

  // 1. Quality Gate Filter
  const qualityItems = rawItems.filter(passesQualityGate);
  const afterQualityGate = qualityItems.length;

  // 2. Score Articles
  const scoredItems: CuratedArticle[] = qualityItems.map((item) => ({
    ...item,
    relevanceScore: calculateRelevanceScore(item),
  }));

  // 3. De-duplicate Stories
  const dedupedItems = deduplicateStories(scoredItems);
  const afterDeduplication = dedupedItems.length;

  // 4. Threshold Filters
  const newsThresholdItems = dedupedItems.filter((i) => i.relevanceScore >= 60);
  const homeThresholdItems = dedupedItems.filter((i) => i.relevanceScore >= 80);

  // 5. Apply Source Diversity
  const diverseNews = applySourceDiversity(newsThresholdItems, 3);
  diverseNews.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Category Distribution Stats
  const categoryCounts: Record<string, number> = {
    designNews: 0,
    aiNews: 0,
    marketingNews: 0,
    frontendNews: 0,
    motionNews: 0,
  };

  const sourceCounts: Record<string, number> = {};

  rawItems.forEach((item) => {
    const cat = item.category || "designNews";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    const src = item.sourceName || "Unknown";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const topSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const audit: NewsPipelineAuditResult = {
    totalRaw,
    afterDeduplication,
    afterQualityGate,
    newsThresholdCount: newsThresholdItems.length,
    homeThresholdCount: homeThresholdItems.length,
    categoryCounts,
    topSources,
  };

  cachedNewsPipeline = diverseNews;
  cachedAuditMetrics = audit;

  return { articles: diverseNews, audit };
}

/**
 * Main News Engine API for News Page (Score >= 60)
 */
export async function fetchCuratedNewsEngine(cmsNews: any[] = []): Promise<CuratedArticle[]> {
  if (cachedNewsPipeline) return cachedNewsPipeline;
  const { articles } = await runNewsPipelineAudit(cmsNews);
  return articles;
}

/**
 * Main News Engine API for Home Page Showcase (Score >= 80, max 6 diverse items, max 1 per publisher)
 */
export async function fetchHomeNewsEngine(cmsNews: any[] = []): Promise<CuratedArticle[]> {
  const all = await fetchCuratedNewsEngine(cmsNews);
  const homeEligible = all.filter((item) => item.relevanceScore >= 80);

  // Ensure 1 article per publisher and diverse categories
  const seenSources = new Set<string>();
  const result: CuratedArticle[] = [];

  for (const item of homeEligible) {
    if (!seenSources.has(item.sourceName)) {
      seenSources.add(item.sourceName);
      result.push(item);
    }
    if (result.length >= 6) break;
  }

  // Fallback if less than 6 meet score >= 80
  if (result.length < 6) {
    for (const item of all) {
      if (!seenSources.has(item.sourceName)) {
        seenSources.add(item.sourceName);
        result.push(item);
      }
      if (result.length >= 6) break;
    }
  }

  return result;
}
