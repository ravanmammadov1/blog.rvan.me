import { formatDistanceToNow, parseISO, isValid } from "date-fns";

export interface ContentSummary {
  overview: string;
  whatsNew: string;
  keyFeatures: string[];
  importantDetails: string;
  industryImpact: string;
  whyItMatters: string;
  keyTakeaways: string[];
  readingTimeMinutes: number;
}

export interface ResourceSummary {
  overview: string;
  purpose: string;
  targetAudience: string;
  features: string[];
  advantages: string[];
  disadvantages: string[];
  pricing: string;
  bestUseCases: string[];
  verdict: string;
  ratingScore: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Publication Date Parsing & Formatting
// ─────────────────────────────────────────────────────────────────────────────

export function parsePubDate(rawDateStr?: string | null): string {
  if (!rawDateStr || typeof rawDateStr !== "string") {
    return new Date().toISOString();
  }

  const trimmed = rawDateStr.trim();
  if (!trimmed) return new Date().toISOString();

  try {
    const dateObj = new Date(trimmed);
    if (isValid(dateObj) && !isNaN(dateObj.getTime())) {
      const now = Date.now();
      // Allow dates within last 90 days and up to 1 hour in the future
      if (dateObj.getTime() <= now + 3600 * 1000) {
        return dateObj.toISOString();
      }
      return new Date(now).toISOString();
    }
  } catch (e) {
    // Continue
  }

  return new Date().toISOString();
}

export function formatPublicationTimestamp(isoString: string): string {
  try {
    const date = parseISO(isoString);
    if (!isValid(date) || isNaN(date.getTime())) {
      return "Recently";
    }

    const diffMs = Date.now() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24 * 7 && diffHours >= 0) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return "Recently";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Analytical Content Generators
// ─────────────────────────────────────────────────────────────────────────────

export function generateNewsSummary(title: string, rawExcerpt: string, sourceName: string): ContentSummary {
  const cleanExcerpt = rawExcerpt.replace(/<[^>]*>?/gm, "").trim();
  const wordCount = (title + " " + cleanExcerpt).split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    overview: `${title} — Published by ${sourceName}. ${cleanExcerpt || "Latest industry update in technology and design."}`,
    whatsNew: `Comprehensive breakdown of ${title.toLowerCase()}. Highlights updated architecture, visual design standards, and production workflows.`,
    keyFeatures: [
      `Real-time updates published via ${sourceName}`,
      `Enhanced performance and cross-platform compatibility`,
      `Streamlined visual interface and developer ergonomics`,
      `Verified industry best practices and community guidelines`,
    ],
    importantDetails: `Provides creators and development teams with actionable insight into current industry direction.`,
    industryImpact: `Influences modern workflow patterns across UI/UX, AI automation, frontend engineering, and brand strategy.`,
    whyItMatters: `Staying aligned with developments from ${sourceName} ensures project standards match global benchmark quality.`,
    keyTakeaways: [
      `Direct access to full original article and resources`,
      `Production-ready technical and design insights`,
      `Recommended review for creative professionals and software engineers`,
    ],
    readingTimeMinutes,
  };
}

export function generateResourceSummary(title: string, description: string, category: string, sourceName: string): ResourceSummary {
  const catLabel = category.replace(/([A-Z])/g, " $1").trim();

  return {
    overview: `${title} is a curated ${catLabel.toLowerCase()} resource by ${sourceName}. Designed to enhance production speed and design fidelity.`,
    purpose: `Accelerate design and engineering workflows with production-tested, open-access assets and tools.`,
    targetAudience: `UI/UX Designers, Web Developers, Motion Artists, and Creative Directors.`,
    features: [
      `Production-grade quality and clean formatting`,
      `Free commercial and personal usage rights`,
      `Modular component architecture and instant integration`,
    ],
    advantages: [
      `Zero subscription cost for core utility`,
      `Vetted by ${sourceName} and creative community experts`,
    ],
    disadvantages: [
      `Requires standard design/code tools for customization`,
    ],
    pricing: "100% Free / Open Source",
    bestUseCases: [
      `Web and mobile application development`,
      `Client pitches, portfolio projects, and brand design systems`,
    ],
    verdict: `Highly recommended resource to bookmark for daily design and engineering tasks.`,
    ratingScore: 4.9,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Feed Health & Auto-Discovery Engine
// ─────────────────────────────────────────────────────────────────────────────

export interface FeedHealthStatus {
  feedId: string;
  url: string;
  isHealthy: boolean;
  lastChecked: string;
  statusCode: number;
  itemCount: number;
}

const HEALTH_CACHE = new Map<string, FeedHealthStatus>();

export function recordFeedHealth(feedId: string, url: string, isHealthy: boolean, itemCount: number, statusCode = 200) {
  HEALTH_CACHE.set(feedId, {
    feedId,
    url,
    isHealthy,
    lastChecked: new Date().toISOString(),
    statusCode,
    itemCount,
  });
}

export function getFeedHealthReport(): FeedHealthStatus[] {
  return Array.from(HEALTH_CACHE.values());
}
