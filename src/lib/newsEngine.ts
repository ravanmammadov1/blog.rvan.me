import { aggregateNewsFeeds, NormalizedResource } from "./rssAggregator";

export interface ScoreFactorBreakdown {
  sourceAuthority: number;
  topicRelevance: number;
  freshness: number;
  contentQuality: number;
  originality: number;
  keywordMatch: number;
  promotionalPenalty: number;
  finalScore: number;
}

export interface CuratedArticle extends NormalizedResource {
  relevanceScore: number;
  scoreBreakdown?: ScoreFactorBreakdown;
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

const TOPIC_DEPTH_KEYWORDS = [
  "architecture", "design system", "micro-interaction", "multimodal", "webgl",
  "css grid", "compiler", "vfx", "motion design", "brand strategy", "framework",
  "performance", "accessibility", "usability", "spatial computing", "vector",
  "baseline", "edge runtime", "state management", "type safety", "typography"
];

const BRAND_KEYWORD_SIGNALS = [
  "figma", "adobe", "openai", "deepmind", "gemini", "gpt", "sora", "react", "next.js",
  "vercel", "css", "webgpu", "visionos", "rive", "motion", "blender", "three.js"
];

const REJECT_PR_SPAM_KEYWORDS = [
  "press release", "sponsored post", "advertisement", "quarterly results",
  "earnings call", "make money online", "discount code", "promo code",
  "top 10 cheap", "unbelievable secret", "affiliate link", "buy now"
];

const TIER_ONE_AUTHORITY = [
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
 * Multi-Factor Balanced Scoring Formula
 */
export function evaluateArticleScore(article: NormalizedResource): ScoreFactorBreakdown {
  const text = `${article.title} ${article.description || ""}`.toLowerCase();

  // 1. Source Authority (0 - 25 pts)
  let sourceAuthority = 12;
  if (TIER_ONE_AUTHORITY.some((src) => article.sourceName?.toLowerCase().includes(src.toLowerCase()))) {
    sourceAuthority = 25;
  }

  // 2. Topic Depth & Relevance (0 - 20 pts)
  let topicHits = 0;
  TOPIC_DEPTH_KEYWORDS.forEach((kw) => {
    if (text.includes(kw)) topicHits++;
  });
  const topicRelevance = Math.min(topicHits * 5 + 5, 20);

  // 3. Freshness Scoring (0 - 20 pts)
  let freshness = 0;
  const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  if (ageHours <= 24) {
    freshness = 20;
  } else if (ageHours <= 48) {
    freshness = 12;
  } else if (ageHours <= 168) {
    freshness = 5;
  } else {
    freshness = -10;
  }

  // 4. Content Quality / Depth (0 - 15 pts)
  let contentQuality = 5;
  const descLen = (article.description || "").trim().length;
  if (descLen >= 200) {
    contentQuality = 15;
  } else if (descLen >= 80) {
    contentQuality = 10;
  }

  // 5. Originality Bonus (0 - 10 pts)
  const originality = article.isRss ? 10 : 8;

  // 6. Keyword Brand Signal (CAPPED at max 10 pts)
  let brandHits = 0;
  BRAND_KEYWORD_SIGNALS.forEach((kw) => {
    if (text.includes(kw)) brandHits++;
  });
  const keywordMatch = Math.min(brandHits * 3, 10);

  // 7. Promotional / PR Penalty (0 to -30 pts)
  let promotionalPenalty = 0;
  if (text.includes("announces") || text.includes("launches new partner") || text.includes("sponsored")) {
    promotionalPenalty = -15;
  }

  const finalScore = Math.max(
    sourceAuthority + topicRelevance + freshness + contentQuality + originality + keywordMatch + promotionalPenalty,
    0
  );

  return {
    sourceAuthority,
    topicRelevance,
    freshness,
    contentQuality,
    originality,
    keywordMatch,
    promotionalPenalty,
    finalScore,
  };
}

export function calculateRelevanceScore(article: NormalizedResource): number {
  return evaluateArticleScore(article).finalScore;
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
        map.set(existingKey, { ...art, scoreBreakdown: art.scoreBreakdown, sourceReferences: refs });
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

  // 2. Score Articles with Multi-Factor Formula
  const scoredItems: CuratedArticle[] = qualityItems.map((item) => {
    const scoreBreakdown = evaluateArticleScore(item);
    return {
      ...item,
      relevanceScore: scoreBreakdown.finalScore,
      scoreBreakdown,
    };
  });

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
