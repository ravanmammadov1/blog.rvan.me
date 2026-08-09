import { aggregateNewsFeeds, NormalizedResource } from "./rssAggregator";

export interface CuratedArticle extends NormalizedResource {
  relevanceScore: number;
  sourceReferences?: string[];
  isPrimaryStory?: boolean;
}

const HIGH_IMPACT_KEYWORDS = [
  "figma", "adobe", "openai", "deepmind", "gemini", "gpt", "sora", "react", "next.js",
  "vercel", "css", "webgpu", "visionos", "rive", "motion", "blender", "three.js",
  "design system", "typography", "launch", "model", "architecture", "ai agent",
  "brand campaign", "ux", "ui", "framework", "baseline", "vector", "web design"
];

const LOW_VALUE_PENALTY_KEYWORDS = [
  "10 tips", "how to make money", "press release", "sponsored", "affiliate",
  "top 5 secret", "click here", "unbelievable secret", "cheap", "discount"
];

const TIER_ONE_SOURCES = [
  "Smashing Magazine", "UX Collective", "OpenAI", "Google DeepMind",
  "Hugging Face", "React Blog", "Vercel", "Codrops", "Motionographer",
  "Blender Dev", "Stash Magazine", "MIT Tech Review"
];

/**
 * Calculates a dynamic relevance score for an article (0 - 100+)
 */
export function calculateRelevanceScore(article: NormalizedResource): number {
  let score = 50;

  const titleLower = article.title.toLowerCase();
  const descLower = (article.description || "").toLowerCase();
  const text = `${titleLower} ${descLower}`;

  // 1. High Impact Keyword Matching (+25 pts max)
  let keywordHits = 0;
  HIGH_IMPACT_KEYWORDS.forEach((kw) => {
    if (text.includes(kw)) keywordHits++;
  });
  score += Math.min(keywordHits * 8, 25);

  // 2. Low Value / Clickbait Penalty (-40 pts)
  LOW_VALUE_PENALTY_KEYWORDS.forEach((kw) => {
    if (text.includes(kw)) score -= 20;
  });

  // 3. Publisher Tier Rating (+20 pts)
  if (TIER_ONE_SOURCES.some((src) => article.sourceName?.includes(src))) {
    score += 20;
  }

  // 4. Freshness Scoring
  const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  if (ageHours <= 24) {
    score += 20;
  } else if (ageHours <= 48) {
    score += 10;
  } else if (ageHours > 168) {
    score -= 20;
  }

  return Math.max(score, 0);
}

/**
 * De-duplicates stories across multiple sources and groups references
 */
export function deduplicateStories(articles: CuratedArticle[]): CuratedArticle[] {
  const map = new Map<string, CuratedArticle>();

  articles.forEach((art) => {
    // Clean title for fuzzy matching
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
      // Merge source reference
      const refs = existing.sourceReferences || [existing.sourceName];
      if (!refs.includes(art.sourceName)) {
        refs.push(art.sourceName);
      }
      existing.sourceReferences = refs;
      // Keep higher scored item as primary
      if (art.relevanceScore > existing.relevanceScore) {
        map.set(existingKey, { ...art, sourceReferences: refs });
      }
    } else {
      map.set(cleanTitle, { ...art, sourceReferences: [art.sourceName] });
    }
  });

  return Array.from(map.values());
}

let cachedCuratedNews: CuratedArticle[] | null = null;

/**
 * Main News Engine API
 * Fetches, scores, de-duplicates, and caches live news items for News & Home pages
 */
export async function fetchCuratedNewsEngine(cmsNews: any[] = []): Promise<CuratedArticle[]> {
  if (cachedCuratedNews) return cachedCuratedNews;

  try {
    const rawNews = await aggregateNewsFeeds(cmsNews);

    const scored: CuratedArticle[] = rawNews.map((item) => {
      const relevanceScore = calculateRelevanceScore(item);
      return {
        ...item,
        relevanceScore,
      };
    });

    // Filter out low quality items (score < 50)
    const highQuality = scored.filter((item) => item.relevanceScore >= 50);

    // De-duplicate stories
    const deduped = deduplicateStories(highQuality);

    // Sort by relevance score & freshness
    deduped.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    cachedCuratedNews = deduped;
    return deduped;
  } catch (err) {
    console.error("Error in fetchCuratedNewsEngine:", err);
    return [];
  }
}
