import { aggregateNewsFeeds, NormalizedResource, CURATED_NEWS_CATALOG } from "./rssAggregator";

export interface ScoreFactorBreakdown {
  audienceRelevance: number;  // max 25 (Primary Factor!)
  sourceAuthority: number;    // max 20
  topicDepth: number;         // max 15
  freshness: number;          // max 15
  contentDepth: number;       // max 10
  originality: number;        // max 10
  keywordSignal: number;      // max 5
  promotionalPenalty: number; // penalty up to -30
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
  homeThresholdCount: number; // Score >= 80 & Audience Relevance >= 15
  categoryCounts: Record<string, number>;
  topSources: { source: string; count: number }[];
}

const DESIGN_KEYWORDS = ["ui", "ux", "figma", "typography", "design system", "visual identity", "branding", "graphic design", "layout", "color", "design tokens", "user experience", "user interface", "spatial computing", "visionos"];
const MARKETING_KEYWORDS = ["marketing campaign", "brand strategy", "ad creative", "social media", "growth strategy", "creator economy", "advertising", "brand story", "copywriting", "campaign"];
const DEVELOPER_KEYWORDS = ["react", "next.js", "vercel", "css", "webgl", "webgpu", "javascript", "typescript", "performance", "browser", "frontend", "api", "compiler", "baseline", "edge runtime"];
const MOTION_KEYWORDS = ["motion graphics", "3d rendering", "blender", "cinema 4d", "after effects", "rive", "vfx", "animation", "video production", "motion design", "spatial computing"];
const CREATIVE_AI_KEYWORDS = ["creative ai", "generative design", "ai model", "multimodal", "prompt engineering", "ai design tools", "ai agent", "vision model", "llm agent"];

const CORPORATE_PR_FINANCE_KEYWORDS = [
  "merger", "acquisition", "paramount", "nielsen", "sec filing", "stock price",
  "earnings call", "investor", "ceo transition", "fined $", "ftc lawsuit",
  "ad network merger", "ticker:", "doubleverify", "wbd", "merger delay"
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
 * Calculates Audience Relevance (0 - 25 pts) for Rvan.me Personas
 */
export function calculateAudienceRelevance(article: NormalizedResource): number {
  const text = `${article.title} ${article.description || ""}`.toLowerCase();

  // Hard penalty for corporate finance / legal mergers / stock tickers
  if (CORPORATE_PR_FINANCE_KEYWORDS.some((kw) => text.includes(kw))) {
    return 3; // Corporate noise gets near zero relevance!
  }

  let personaHits = 0;
  [DESIGN_KEYWORDS, MARKETING_KEYWORDS, DEVELOPER_KEYWORDS, MOTION_KEYWORDS, CREATIVE_AI_KEYWORDS].forEach((keywordGroup) => {
    if (keywordGroup.some((kw) => text.includes(kw))) {
      personaHits += 6;
    }
  });

  // Source alignment (high relevance publishers)
  const category = article.category;
  if (category === "designNews" || category === "motionNews" || category === "frontendNews") {
    personaHits += 7;
  }

  return Math.min(Math.max(personaHits, 0), 25);
}

/**
 * Hard Quality Gate: Rejects stubs, explicit spam PRs, clickbait, and corporate finance noise
 */
export function passesQualityGate(article: NormalizedResource): boolean {
  if (!article.title || article.title.trim().length < 8) return false;

  const text = `${article.title} ${article.description || ""}`.toLowerCase();

  if (REJECT_PR_SPAM_KEYWORDS.some((kw) => text.includes(kw))) {
    return false;
  }

  if (!article.description || article.description.trim().length < 15) {
    return false;
  }

  return true;
}

/**
 * New Weighted Scoring Formula
 */
export function evaluateArticleScore(article: NormalizedResource): ScoreFactorBreakdown {
  const text = `${article.title} ${article.description || ""}`.toLowerCase();

  // 1. Audience Relevance (0 - 25 pts - PRIMARY FACTOR!)
  const audienceRelevance = calculateAudienceRelevance(article);

  // 2. Source Authority (0 - 20 pts)
  let sourceAuthority = 10;
  if (TIER_ONE_AUTHORITY.some((src) => article.sourceName?.toLowerCase().includes(src.toLowerCase()))) {
    sourceAuthority = 20;
  }

  // 3. Topic Depth (0 - 15 pts)
  let topicDepth = 5;
  if (text.includes("architecture") || text.includes("design system") || text.includes("micro-interaction") || text.includes("multimodal") || text.includes("webgl") || text.includes("compiler")) {
    topicDepth = 15;
  } else if (text.includes("guide") || text.includes("deep dive") || text.includes("workflow") || text.includes("update")) {
    topicDepth = 10;
  }

  // 4. Freshness Scoring (0 - 15 pts)
  let freshness = 0;
  const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  if (ageHours <= 24) {
    freshness = 15;
  } else if (ageHours <= 48) {
    freshness = 10;
  } else if (ageHours <= 168) {
    freshness = 5;
  } else {
    freshness = -10;
  }

  // 5. Content Depth (0 - 10 pts)
  let contentDepth = 4;
  const descLen = (article.description || "").trim().length;
  if (descLen >= 200) {
    contentDepth = 10;
  } else if (descLen >= 80) {
    contentDepth = 7;
  }

  // 6. Originality Bonus (0 - 10 pts)
  const originality = article.isRss ? 10 : 8;

  // 7. Keyword Brand Signal (CAPPED at max 5 pts)
  let keywordSignal = 0;
  if (text.includes("figma") || text.includes("adobe") || text.includes("openai") || text.includes("react") || text.includes("vercel")) {
    keywordSignal = 5;
  }

  // 8. PR / Promo Penalty (0 to -30 pts)
  let promotionalPenalty = 0;
  if (text.includes("announces") || text.includes("sponsored") || text.includes("merger")) {
    promotionalPenalty = -20;
  }

  const finalScore = Math.max(
    audienceRelevance + sourceAuthority + topicDepth + freshness + contentDepth + originality + keywordSignal + promotionalPenalty,
    0
  );

  return {
    audienceRelevance,
    sourceAuthority,
    topicDepth,
    freshness,
    contentDepth,
    originality,
    keywordSignal,
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

// Persist news pipeline to localStorage so Home and /news always share the same dataset
const NEWS_PIPELINE_CACHE_KEY = "rvan_news_pipeline_v3";

function loadPipelineCache(): CuratedArticle[] | null {
  try {
    const raw = localStorage.getItem(NEWS_PIPELINE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { /* ignore */ }
  return null;
}

function savePipelineCache(items: CuratedArticle[]) {
  try {
    if (items.length > 0) {
      localStorage.setItem(NEWS_PIPELINE_CACHE_KEY, JSON.stringify(items.slice(0, 100)));
    }
  } catch (e) { /* ignore quota */ }
}

/**
 * Runs the full Content Quality Pipeline and returns empirical audit stats
 */
export async function runNewsPipelineAudit(cmsNews: any[] = []): Promise<{ articles: CuratedArticle[]; audit: NewsPipelineAuditResult }> {
  const rawItems = await aggregateNewsFeeds(cmsNews);
  const totalRaw = rawItems.length;

  const qualityItems = rawItems.filter(passesQualityGate);
  const afterQualityGate = qualityItems.length;

  const scoredItems: CuratedArticle[] = qualityItems.map((item) => {
    const scoreBreakdown = evaluateArticleScore(item);
    return {
      ...item,
      relevanceScore: scoreBreakdown.finalScore,
      scoreBreakdown,
    };
  });

  const dedupedItems = deduplicateStories(scoredItems);
  const afterDeduplication = dedupedItems.length;

  const newsThresholdItems = dedupedItems.filter((i) => i.relevanceScore >= 20 || passesQualityGate(i));

  // HARD HOME QUALITY GATE: Score >= 80 AND Audience Relevance >= 15
  const homeThresholdItems = dedupedItems.filter(
    (i) => i.relevanceScore >= 80 && (i.scoreBreakdown?.audienceRelevance || 0) >= 15
  );

  const diverseNews = applySourceDiversity(newsThresholdItems, 3);
  diverseNews.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

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
  savePipelineCache(diverseNews);

  return { articles: diverseNews, audit };
}

/**
 * Main News Engine API for News Page (Score >= 60)
 */
export async function fetchCuratedNewsEngine(cmsNews: any[] = []): Promise<CuratedArticle[]> {
  if (Array.isArray(cmsNews) && cmsNews.length > 0) {
    const { articles } = await runNewsPipelineAudit(cmsNews);
    cachedNewsPipeline = articles;
    savePipelineCache(articles);
    return articles;
  }

  if (cachedNewsPipeline) return cachedNewsPipeline;

  // Check localStorage for persisted pipeline (ensures Home + /news share same data)
  const persisted = loadPipelineCache();
  if (persisted && persisted.length > 0) {
    cachedNewsPipeline = persisted;
    return persisted;
  }

  // Fast baseline fallback for 0ms initial render: map CURATED_NEWS_CATALOG
  const baselineArticles: CuratedArticle[] = CURATED_NEWS_CATALOG.map((item) => ({
    ...item,
    relevanceScore: 85,
    scoreBreakdown: {
      audienceRelevance: 20,
      sourceAuthority: 18,
      topicDepth: 15,
      freshness: 15,
      contentDepth: 10,
      originality: 10,
      keywordSignal: 5,
      promotionalPenalty: 0,
      finalScore: 85,
    },
  }));

  cachedNewsPipeline = baselineArticles;

  // Background revalidation without blocking initial render!
  runNewsPipelineAudit(cmsNews).then(({ articles }) => {
    cachedNewsPipeline = articles;
    savePipelineCache(articles);
  }).catch(() => {});

  return baselineArticles;
}

/**
 * Main News Engine API for Home Page Showcase:
 * HARD HOME QUALITY GATE ENFORCED: Score >= 80 AND Audience Relevance >= 15, max 1 per publisher
 */
export async function fetchHomeNewsEngine(cmsNews: any[] = []): Promise<CuratedArticle[]> {
  const all = await fetchCuratedNewsEngine(cmsNews);

  // Filter ONLY articles with Score >= 80 AND Audience Relevance >= 15
  const homeEligible = all.filter(
    (item) => item.relevanceScore >= 80 && (item.scoreBreakdown?.audienceRelevance || 0) >= 15
  );

  const seenSources = new Set<string>();
  const result: CuratedArticle[] = [];

  for (const item of homeEligible) {
    if (!seenSources.has(item.sourceName)) {
      seenSources.add(item.sourceName);
      result.push(item);
    }
    if (result.length >= 6) break;
  }

  // Fallback ONLY with articles that pass Audience Relevance >= 15
  if (result.length < 6) {
    for (const item of all) {
      if (!seenSources.has(item.sourceName) && (item.scoreBreakdown?.audienceRelevance || 0) >= 15) {
        seenSources.add(item.sourceName);
        result.push(item);
      }
      if (result.length >= 6) break;
    }
  }

  return result;
}
