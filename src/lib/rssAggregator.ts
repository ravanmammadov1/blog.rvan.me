import { client } from "./sanityClient";

export interface RssFeedConfig {
  _id: string;
  name: string;
  url: string;
  category: string;
  refreshInterval: "hourly" | "6hours" | "daily";
  enabled: boolean;
  priority: number;
  sourceName?: string;
  defaultCountry?: string;
  defaultWorkType?: "remote" | "hybrid" | "onsite" | "na";
}

export interface NormalizedResource {
  id: string;
  title: string;
  slug: string;
  resourceType: string;
  description: string;
  benefitSummary?: string;
  link: string;
  sourceName: string;
  publishedAt: string;
  category: string;
  country: string;
  workType: "remote" | "hybrid" | "onsite" | "na";
  isFree: boolean;
  difficulty?: string;
  logoUrl?: string;
  isRss: boolean;
  analyticsId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWS FEEDS — Design / AI / Marketing industry news (News Page only)
// ─────────────────────────────────────────────────────────────────────────────
export const NEWS_RSS_FEEDS: RssFeedConfig[] = [
  // ── Design News ──
  {
    _id: "news-smashingmagazine",
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "Smashing Magazine",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-uxcollective",
    name: "UX Collective",
    url: "https://uxdesign.cc/feed",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "UX Collective",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-creativebloq",
    name: "Creative Bloq",
    url: "https://www.creativebloq.com/feeds/all.xml",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Creative Bloq",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-abduzeedo",
    name: "Abduzeedo",
    url: "https://feeds.feedburner.com/abduzeedo",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "Abduzeedo",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-webdesignerdepot",
    name: "Webdesigner Depot",
    url: "https://www.webdesignerdepot.com/feed/",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "Webdesigner Depot",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-codrops",
    name: "Codrops",
    url: "https://tympanus.net/codrops/feed/",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "Codrops",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-alistapart",
    name: "A List Apart",
    url: "https://alistapart.com/main/feed/",
    category: "designNews",
    refreshInterval: "daily",
    enabled: true,
    priority: 7,
    sourceName: "A List Apart",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-speckyboy",
    name: "Speckyboy Design",
    url: "https://speckyboy.com/feed/",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 7,
    sourceName: "Speckyboy",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-designmodo",
    name: "Designmodo",
    url: "https://designmodo.com/feed/",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 7,
    sourceName: "Designmodo",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },

  // ── AI News ──
  {
    _id: "news-huggingface",
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    category: "aiNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "Hugging Face",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-verge-ai",
    name: "The Verge — AI",
    url: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    category: "aiNews",
    refreshInterval: "hourly",
    enabled: true,
    priority: 10,
    sourceName: "The Verge",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-technologyreview",
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    category: "aiNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "MIT Tech Review",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-venturebeat-ai",
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "aiNews",
    refreshInterval: "hourly",
    enabled: true,
    priority: 9,
    sourceName: "VentureBeat",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-arxiv-cs-ai",
    name: "Arxiv CS — AI Papers",
    url: "https://rss.arxiv.org/rss/cs.AI",
    category: "aiNews",
    refreshInterval: "daily",
    enabled: true,
    priority: 8,
    sourceName: "Arxiv",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-deepmind",
    name: "Google DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    category: "aiNews",
    refreshInterval: "daily",
    enabled: true,
    priority: 9,
    sourceName: "Google DeepMind",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-aiweekly",
    name: "Import AI (Jack Clark)",
    url: "https://importai.substack.com/feed",
    category: "aiNews",
    refreshInterval: "daily",
    enabled: true,
    priority: 8,
    sourceName: "Import AI",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },

  // ── Marketing News ──
  {
    _id: "news-hubspot",
    name: "HubSpot Marketing Blog",
    url: "https://blog.hubspot.com/marketing/rss.xml",
    category: "marketingNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "HubSpot",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-searchenginejournal",
    name: "Search Engine Journal",
    url: "https://www.searchenginejournal.com/feed/",
    category: "marketingNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "Search Engine Journal",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-moz",
    name: "Moz Blog",
    url: "https://moz.com/blog/feed",
    category: "marketingNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Moz",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-semrush",
    name: "Semrush Blog",
    url: "https://www.semrush.com/blog/feed/",
    category: "marketingNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Semrush",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-contentmarketinginstitute",
    name: "Content Marketing Institute",
    url: "https://contentmarketinginstitute.com/feed/",
    category: "marketingNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "CMI",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-neilpatel",
    name: "Neil Patel Blog",
    url: "https://neilpatel.com/blog/feed/",
    category: "marketingNews",
    refreshInterval: "daily",
    enabled: true,
    priority: 8,
    sourceName: "Neil Patel",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "news-backlinko",
    name: "Backlinko",
    url: "https://backlinko.com/feed",
    category: "marketingNews",
    refreshInterval: "daily",
    enabled: true,
    priority: 8,
    sourceName: "Backlinko",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCE FEEDS — Practical resources (Resources Page only)
// ─────────────────────────────────────────────────────────────────────────────
export const RESOURCE_RSS_FEEDS: RssFeedConfig[] = [
  // ── Jobs ──
  {
    _id: "res-weworkremotely-design",
    name: "We Work Remotely — Design Jobs",
    url: "https://weworkremotely.com/categories/remote-design-jobs.rss",
    category: "jobs",
    refreshInterval: "hourly",
    enabled: true,
    priority: 10,
    sourceName: "We Work Remotely",
    defaultCountry: "Global",
    defaultWorkType: "remote",
  },
  {
    _id: "res-weworkremotely-marketing",
    name: "We Work Remotely — Marketing Jobs",
    url: "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss",
    category: "jobs",
    refreshInterval: "hourly",
    enabled: true,
    priority: 10,
    sourceName: "We Work Remotely",
    defaultCountry: "Global",
    defaultWorkType: "remote",
  },
  {
    _id: "res-remoteok-design",
    name: "Remote OK — Design",
    url: "https://remoteok.com/remote-design-jobs.rss",
    category: "jobs",
    refreshInterval: "hourly",
    enabled: true,
    priority: 9,
    sourceName: "Remote OK",
    defaultCountry: "Global",
    defaultWorkType: "remote",
  },
  {
    _id: "res-remoteok-marketing",
    name: "Remote OK — Marketing",
    url: "https://remoteok.com/remote-marketing-jobs.rss",
    category: "jobs",
    refreshInterval: "hourly",
    enabled: true,
    priority: 9,
    sourceName: "Remote OK",
    defaultCountry: "Global",
    defaultWorkType: "remote",
  },

  // ── Free Design Assets ──
  {
    _id: "res-spoongraphics",
    name: "Spoon Graphics",
    url: "https://feeds.feedburner.com/SpoonGraphics",
    category: "freeDesignAssets",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Spoon Graphics",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "res-graphicburger",
    name: "Graphic Burger",
    url: "https://graphicburger.com/feed/",
    category: "freeDesignAssets",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "Graphic Burger",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "res-sketchappsources",
    name: "Sketch App Sources",
    url: "https://www.sketchappsources.com/feed",
    category: "freeDesignAssets",
    refreshInterval: "6hours",
    enabled: true,
    priority: 7,
    sourceName: "Sketch App Sources",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "res-freebiesbug",
    name: "Freebies Bug",
    url: "https://freebiesbug.com/feed/",
    category: "freeDesignAssets",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "Freebies Bug",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },

  // ── Tools ──
  {
    _id: "res-producthunt",
    name: "Product Hunt — Design Tools",
    url: "https://www.producthunt.com/feed?category=design-tools",
    category: "tools",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Product Hunt",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },

  // ── Learning ──
  {
    _id: "res-css-tricks",
    name: "CSS-Tricks",
    url: "https://css-tricks.com/feed/",
    category: "learning",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "CSS-Tricks",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "res-smashing-tutorials",
    name: "Smashing Magazine — Tutorials",
    url: "https://www.smashingmagazine.com/tag/tutorial/feed/",
    category: "learning",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "Smashing Magazine",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "res-designpodcasts",
    name: "Design Better Podcast",
    url: "https://feeds.simplecast.com/dh4tA13e",
    category: "learning",
    refreshInterval: "daily",
    enabled: true,
    priority: 7,
    sourceName: "Design Better",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Cache TTL map
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_TTL_MAP: Record<string, number> = {
  hourly: 60 * 60 * 1000,
  "6hours": 6 * 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
};

// Fetch enabled RSS feeds from Sanity — filtered by purpose
export async function fetchRssFeedsFromSanity(purpose?: "news" | "resources"): Promise<RssFeedConfig[]> {
  try {
    let query = `*[_type == "rssFeed" && enabled == true]`;
    if (purpose === "news") {
      query += ` && category in ["designNews","aiNews","marketingNews"]`;
    } else if (purpose === "resources") {
      query += ` && !(category in ["designNews","aiNews","marketingNews","latestDesignNews"])`;
    }
    query += ` | order(priority desc){ _id, name, url, category, refreshInterval, enabled, priority, sourceName, defaultCountry, defaultWorkType }`;

    const feeds = await client.fetch(query);
    if (feeds && feeds.length > 0) {
      return feeds;
    }
  } catch (err) {
    console.warn("Sanity RSS feeds fetch failed, using defaults:", err);
  }
  // Return appropriate static fallback
  if (purpose === "news") return NEWS_RSS_FEEDS;
  if (purpose === "resources") return RESOURCE_RSS_FEEDS;
  return [...NEWS_RSS_FEEDS, ...RESOURCE_RSS_FEEDS];
}

// ─────────────────────────────────────────────────────────────────────────────
// Core RSS fetch + parse
// ─────────────────────────────────────────────────────────────────────────────

// Clean HTML tags from RSS item excerpt strings
function cleanText(html: string): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent || "";
  return text.replace(/\s+/g, " ").trim().slice(0, 280);
}

async function fetchAndParseSingleFeed(feed: RssFeedConfig): Promise<NormalizedResource[]> {
  const ttl = CACHE_TTL_MAP[feed.refreshInterval] || CACHE_TTL_MAP["6hours"];
  const cacheKey = `rss_cache_v2_${feed._id}`;

  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (Date.now() - cached.timestamp < ttl && Array.isArray(cached.items) && cached.items.length > 0) {
        return cached.items;
      }
    }
  } catch (e) {
    // Ignore storage errors
  }

  const proxies = [
    (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  let rawXml = "";
  for (const proxyFn of proxies) {
    try {
      const proxyUrl = proxyFn(feed.url);
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(7000) });
      if (!res.ok) continue;

      if (proxyUrl.includes("allorigins.win")) {
        const json = await res.json();
        rawXml = json.contents;
      } else {
        rawXml = await res.text();
      }
      if (rawXml && (rawXml.includes("<rss") || rawXml.includes("<feed") || rawXml.includes("<item"))) {
        break;
      }
    } catch (_err) {
      // Try next proxy
    }
  }

  if (!rawXml) return [];

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rawXml, "text/xml");
  const items: NormalizedResource[] = [];

  const itemNodes = Array.from(xmlDoc.querySelectorAll("item, entry")).slice(0, 15);

  itemNodes.forEach((node, idx) => {
    const title = node.querySelector("title")?.textContent?.trim() || "";
    const rawLink =
      node.querySelector("link")?.textContent?.trim() ||
      node.querySelector("link")?.getAttribute("href") ||
      "";
    const description =
      node.querySelector("description")?.textContent ||
      node.querySelector("content\\:encoded")?.textContent ||
      node.querySelector("summary")?.textContent ||
      "";
    const pubDateStr =
      node.querySelector("pubDate")?.textContent ||
      node.querySelector("published")?.textContent ||
      node.querySelector("updated")?.textContent ||
      new Date().toISOString();

    if (!title || !rawLink) return;

    const publishedAt = new Date(pubDateStr).toISOString();
    const cleanDesc = cleanText(description) || title;
    const slugId = `rss-${feed._id}-${idx}`;

    items.push({
      id: slugId,
      title,
      slug: slugId,
      resourceType: feed.category,
      description: cleanDesc,
      benefitSummary: feed.sourceName || feed.name,
      link: rawLink,
      sourceName: feed.sourceName || feed.name,
      publishedAt,
      category: feed.category,
      country: feed.defaultCountry || "Global",
      workType: feed.defaultWorkType || "na",
      isFree: true,
      difficulty: "all",
      isRss: true,
      analyticsId: feed._id,
    });
  });

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), items }));
  } catch (e) {
    // Ignore storage quota
  }

  return items;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public aggregation functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Aggregate all News feeds (Design / AI / Marketing) — for the News page
 */
export async function aggregateNewsFeeds(): Promise<NormalizedResource[]> {
  const feedConfigs = NEWS_RSS_FEEDS; // always use static catalog for news (fast + reliable)

  const feedResults = await Promise.allSettled(
    feedConfigs.filter((f) => f.enabled !== false).map((feed) => fetchAndParseSingleFeed(feed))
  );

  const items: NormalizedResource[] = [];
  feedResults.forEach((res) => {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      items.push(...res.value);
    }
  });

  // Sort by date descending and deduplicate
  const dedupedMap = new Map<string, NormalizedResource>();
  items.forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    if (!dedupedMap.has(key)) dedupedMap.set(key, item);
  });

  return Array.from(dedupedMap.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Aggregate all practical resource feeds (Jobs / Assets / Tools / Learning / Opportunities)
 * Also merges CMS static resource documents.
 * Does NOT include any news categories.
 */
export async function aggregateAllResources(cmsResources: any[] = []): Promise<NormalizedResource[]> {
  const feedResults = await Promise.allSettled(
    RESOURCE_RSS_FEEDS.filter((f) => f.enabled !== false).map((feed) => fetchAndParseSingleFeed(feed))
  );

  const rssItems: NormalizedResource[] = [];
  feedResults.forEach((res) => {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      rssItems.push(...res.value);
    }
  });

  // Map CMS static resources to NormalizedResource format — exclude news types
  const newsCategories = new Set(["latestDesignNews", "designNews", "aiNews", "marketingNews", "techNews"]);

  const mappedCms: NormalizedResource[] = cmsResources
    .filter((item) => !newsCategories.has(item.resourceType) && !newsCategories.has(item.category))
    .map((item) => {
      const cat = mapResourceTypeToCategory(item.resourceType);
      return {
        id: item._id,
        title: item.title,
        slug: item.slug || item._id,
        resourceType: item.resourceType || "freeDesignAssets",
        description: item.description || "",
        benefitSummary: item.benefitSummary || "Curated Resource",
        link: item.link,
        sourceName: item.benefitSummary || "Rvan.me Curated",
        publishedAt: item._createdAt || new Date().toISOString(),
        category: cat,
        country: item.isGlobal ? "Global" : (item.countries && item.countries[0]) || "Global",
        workType: item.workType || (["jobs", "remoteDesignJobs", "remoteMarketingJobs"].includes(cat) ? "remote" : "na"),
        isFree: true,
        difficulty: item.difficultyLevel || "all",
        logoUrl: item.logoUrl,
        isRss: false,
        analyticsId: item._id,
      };
    });

  const combinedMap = new Map<string, NormalizedResource>();
  [...mappedCms, ...rssItems].forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    if (!combinedMap.has(key)) combinedMap.set(key, item);
  });

  const merged = Array.from(combinedMap.values());
  merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return merged;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function mapResourceTypeToCategory(resourceType: string): string {
  const map: Record<string, string> = {
    // New categories
    jobs: "jobs",
    freeDesignAssets: "freeDesignAssets",
    freeMockups: "freeDesignAssets",
    freeFonts: "freeDesignAssets",
    freeIcons: "freeDesignAssets",
    freeUIKits: "freeDesignAssets",
    tools: "tools",
    learning: "learning",
    opportunities: "opportunities",
    designPodcasts: "learning",
    // Legacy mappings
    remoteDesignJobs: "jobs",
    remoteMarketingJobs: "jobs",
    studentPack: "opportunities",
    aiCredits: "tools",
    software: "tools",
    roadmap: "learning",
    scholarship: "opportunities",
    internship: "jobs",
    job: "jobs",
    hackathon: "opportunities",
    startupProgram: "opportunities",
  };
  return map[resourceType] || "freeDesignAssets";
}
