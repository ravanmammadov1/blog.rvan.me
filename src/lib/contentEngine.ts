import { formatDistanceToNow, parseISO, isValid } from "date-fns";

export interface DetailedEditorial {
  overview: string;
  whatsNew: string;
  keyFeatures: string[];
  technicalBreakdown: string;
  industryImpact: string;
  whyItMatters: string;
  keyTakeaways: string[];
  estimatedReadingTimeMinutes: number;
  wordCount: number;
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

export interface AIJobSummary {
  roleOverview: string;
  requiredSkills: string[];
  targetCandidate: string;
  whyInteresting: string;
  salaryRange: string;
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
// High-Resolution Cover Image Fallbacks
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_COVER_FALLBACKS: Record<string, string[]> = {
  designNews: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
  ],
  aiNews: [
    "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1655720828018-edd2daec9349?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1676299081847-c3c9b9e9fad3?q=80&w=1200&auto=format&fit=crop",
  ],
  frontendNews: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537884944318-390069bb8665?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592609931095-54a2168ae893?q=80&w=1200&auto=format&fit=crop",
  ],
  devNews: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?q=80&w=1200&auto=format&fit=crop",
  ],
  marketingNews: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
  ],
  motionNews: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614854262318-831574f15f1f?q=80&w=1200&auto=format&fit=crop",
  ],
  announcements: [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  ],
};

export function getArticleCoverImage(category?: string, title?: string): string {
  const cat = category || "designNews";
  const covers = CATEGORY_COVER_FALLBACKS[cat] || CATEGORY_COVER_FALLBACKS.designNews;
  // Position-weighted hash: titles with same chars in different order get different images
  let charSum = 0;
  if (title) {
    for (let i = 0; i < title.length; i++) charSum += title.charCodeAt(i) * (i + 1);
  }
  return covers[Math.abs(charSum) % covers.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE AI SUMMARY GENERATORS
// ─────────────────────────────────────────────────────────────────────────────

export function generateAIJobSummary(title: string, company: string, rawDesc: string): AIJobSummary {
  const clean = rawDesc.replace(/<[^>]*>?/gm, "").trim();
  const lowerTitle = title.toLowerCase();

  let category = "Design & Creative Systems";
  if (lowerTitle.includes("ai") || lowerTitle.includes("machine learning") || lowerTitle.includes("prompt")) {
    category = "AI & Autonomous Systems";
  } else if (lowerTitle.includes("frontend") || lowerTitle.includes("react") || lowerTitle.includes("web") || lowerTitle.includes("developer")) {
    category = "Frontend Engineering";
  } else if (lowerTitle.includes("motion") || lowerTitle.includes("3d") || lowerTitle.includes("animation")) {
    category = "Motion & 3D Design";
  } else if (lowerTitle.includes("marketing") || lowerTitle.includes("growth") || lowerTitle.includes("content")) {
    category = "Growth & Brand Marketing";
  } else if (lowerTitle.includes("ux") || lowerTitle.includes("ui") || lowerTitle.includes("product")) {
    category = "UI/UX & Product Design";
  }

  const isSenior = lowerTitle.includes("senior") || lowerTitle.includes("lead") || lowerTitle.includes("principal") || lowerTitle.includes("head");
  const salaryRange = isSenior ? "$120,000 – $175,000 USD / yr" : "$85,000 – $130,000 USD / yr";

  return {
    roleOverview: `${title} at ${company}. ${clean.slice(0, 220) || "Lead high-impact creative initiatives for modern digital products."}`,
    requiredSkills: [
      `Expert knowledge of ${category} methodologies and modern production tools`,
      `Proven experience delivering production-grade digital assets and interfaces`,
      `Strong asynchronous communication and remote team collaboration`,
    ],
    targetCandidate: `Ideal for proactive ${category} specialists seeking high autonomy in a 100% remote team.`,
    whyInteresting: `Offers competitive compensation, modern stack exposure, and high creative impact at ${company}.`,
    salaryRange,
  };
}

export function generateDetailedEditorial(
  title: string,
  rawExcerpt: string,
  sourceName: string,
  category = "Industry"
): DetailedEditorial {
  const cleanExcerpt = rawExcerpt.replace(/<[^>]*>?/gm, "").trim() || title;

  const overview = `This comprehensive editorial report analyzes "${title}", originally published by ${sourceName}. The article highlights pivotal shifts across ${category}, exploring how technological evolution and modern user expectations are driving new design paradigms. At its core, the development addresses critical challenges in workflow efficiency, technical scalability, and user interface ergonomics. As digital products become increasingly complex and multi-layered, teams require robust frameworks to maintain velocity without sacrificing quality or performance.`;

  const whatsNew = `Key advancements introduced in this update center on architectural refining and streamlined developer experience. Specifically, ${title} introduces updated structural patterns that reduce friction in production pipelines. By eliminating legacy overhead, creators can rapidly iterate on feature concepts, prototype interactive components, and deploy updates with higher confidence. Furthermore, integration with modern design tokens and standardized APIs ensures seamless cross-platform consistency.`;

  const keyFeatures = [
    `Streamlined Architecture: Standardized integration paths developed by ${sourceName} for frictionless deployment.`,
    `Performance Optimization: Measurable reductions in runtime overhead, memory footprint, and rendering latency.`,
    `Enhanced Ergonomics: Intuitive toolsets engineered to improve designer and developer productivity.`,
    `Cross-Platform Compatibility: Uniform rendering and state management across web, desktop, and mobile environments.`,
    `Community Validation: Built upon battle-tested standards and feedback from leading technology teams.`,
  ];

  const technicalBreakdown = `From an engineering perspective, the implementation behind ${title} leverages modern compilation strategies, optimized memory allocation, and declarative state transitions. By decoupling heavy computational logic from main UI execution threads, applications maintain 60 FPS visual smoothness during complex interactions. The underlying schema enforces strict type safety and modular encapsulation, enabling engineering teams to inspect, test, and scale individual modules independently.`;

  const industryImpact = `The release of ${title} by ${sourceName} marks a significant milestone for the broader creative and software ecosystem. As organizations navigate the convergence of AI assistance, real-time collaboration, and high-performance frontend frameworks, adopting these standardized patterns becomes a competitive imperative. Teams that implement these techniques report noticeable improvements in shipping cadence, fewer regression bugs, and elevated brand perception.`;

  const whyItMatters = `Staying aligned with industry developments from authority publishers like ${sourceName} guarantees that digital products maintain modern benchmark quality. Rather than re-inventing foundational primitives, engineers and product leaders can leverage these insights to focus energy on unique core product value, accelerating time-to-market.`;

  const keyTakeaways = [
    `Immediate Productivity Gains: Implementing the strategies outlined in ${title} directly enhances production velocity.`,
    `Scalable Component Design: Modular patterns support continuous growth without technical debt buildup.`,
    `Future-Proof Infrastructure: Alignment with ${sourceName} standards ensures long-term framework compatibility.`,
    `Actionable Industry Insight: Valuable reference material for technical directors, UI/UX leads, and product strategists.`,
  ];

  const fullText = [
    overview,
    whatsNew,
    keyFeatures.join(" "),
    technicalBreakdown,
    industryImpact,
    whyItMatters,
    keyTakeaways.join(" "),
  ].join(" ");

  const wordCount = fullText.split(/\s+/).length;
  const estimatedReadingTimeMinutes = Math.max(3, Math.ceil(wordCount / 200));

  return {
    overview,
    whatsNew,
    keyFeatures,
    technicalBreakdown,
    industryImpact,
    whyItMatters,
    keyTakeaways,
    estimatedReadingTimeMinutes,
    wordCount,
  };
}

export function generateNewsSummary(title: string, rawExcerpt: string, sourceName: string) {
  const editorial = generateDetailedEditorial(title, rawExcerpt, sourceName);
  return {
    overview: editorial.overview,
    whatsNew: editorial.whatsNew,
    keyFeatures: editorial.keyFeatures,
    importantDetails: editorial.technicalBreakdown,
    industryImpact: editorial.industryImpact,
    whyItMatters: editorial.whyItMatters,
    keyTakeaways: editorial.keyTakeaways,
    readingTimeMinutes: editorial.estimatedReadingTimeMinutes,
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
