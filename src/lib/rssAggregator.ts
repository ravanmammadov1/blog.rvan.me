import { client } from "./sanityClient";
import { parsePubDate, formatPublicationTimestamp, recordFeedHealth } from "./contentEngine";

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
  formattedDate: string;
  category: string;
  country: string;
  workType: "remote" | "hybrid" | "onsite" | "na";
  isFree: boolean;
  difficulty?: string;
  logoUrl?: string;
  isRss: boolean;
  analyticsId?: string;
  isTrending?: boolean;
  isFeatured?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE EXPANDED NEWS RSS FEEDS CATALOG
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
  },
  {
    _id: "news-uxcollective",
    name: "UX Collective",
    url: "https://uxdesign.cc/feed",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "UX Collective",
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
  },
  {
    _id: "news-abduzeedo",
    name: "Abduzeedo",
    url: "https://feeds.feedburner.com/abduzeedo",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Abduzeedo",
  },
  {
    _id: "news-codrops",
    name: "Codrops",
    url: "https://tympanus.net/codrops/feed/",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Codrops",
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
  },
  {
    _id: "news-alistapart",
    name: "A List Apart",
    url: "https://alistapart.com/main/feed/",
    category: "designNews",
    refreshInterval: "daily",
    enabled: true,
    priority: 8,
    sourceName: "A List Apart",
  },
  {
    _id: "news-speckyboy",
    name: "Speckyboy Design",
    url: "https://speckyboy.com/feed/",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "Speckyboy",
  },
  {
    _id: "news-designmodo",
    name: "Designmodo",
    url: "https://designmodo.com/feed/",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "Designmodo",
  },
  {
    _id: "news-itsnicethat",
    name: "It's Nice That",
    url: "https://www.itsnicethat.com/rss",
    category: "designNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "It's Nice That",
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
  },
  {
    _id: "news-technologyreview",
    name: "MIT Technology Review — AI",
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
    category: "aiNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "MIT Tech Review",
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
  },
  {
    _id: "news-deepmind",
    name: "Google DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    category: "aiNews",
    refreshInterval: "daily",
    enabled: true,
    priority: 10,
    sourceName: "Google DeepMind",
  },
  {
    _id: "news-techcrunch-ai",
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "aiNews",
    refreshInterval: "hourly",
    enabled: true,
    priority: 9,
    sourceName: "TechCrunch AI",
  },
  {
    _id: "news-importai",
    name: "Import AI",
    url: "https://importai.substack.com/feed",
    category: "aiNews",
    refreshInterval: "daily",
    enabled: true,
    priority: 8,
    sourceName: "Import AI",
  },

  // ── Frontend & Web Engineering ──
  {
    _id: "news-reactblog",
    name: "React Official Blog",
    url: "https://react.dev/rss.xml",
    category: "frontendNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "React Blog",
  },
  {
    _id: "news-vercelblog",
    name: "Vercel Blog",
    url: "https://vercel.com/atom",
    category: "frontendNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "Vercel",
  },
  {
    _id: "news-chromedevelopers",
    name: "Chrome Developers",
    url: "https://developer.chrome.com/feeds/blog.xml",
    category: "frontendNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Chrome Devs",
  },
  {
    _id: "news-css-tricks-news",
    name: "CSS-Tricks",
    url: "https://css-tricks.com/feed/",
    category: "frontendNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "CSS-Tricks",
  },

  // ── Development & Software ──
  {
    _id: "news-devto",
    name: "Dev.to Top Posts",
    url: "https://dev.to/feed",
    category: "devNews",
    refreshInterval: "hourly",
    enabled: true,
    priority: 9,
    sourceName: "Dev.to",
  },
  {
    _id: "news-hackernews",
    name: "Hacker News Top",
    url: "https://news.ycombinator.com/rss",
    category: "devNews",
    refreshInterval: "hourly",
    enabled: true,
    priority: 10,
    sourceName: "Hacker News",
  },
  {
    _id: "news-githubblog",
    name: "GitHub Official Blog",
    url: "https://github.blog/feed/",
    category: "devNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "GitHub",
  },
  {
    _id: "news-infoq",
    name: "InfoQ Architecture",
    url: "https://feed.infoq.com/",
    category: "devNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "InfoQ",
  },

  // ── Marketing & Growth ──
  {
    _id: "news-hubspot",
    name: "HubSpot Marketing",
    url: "https://blog.hubspot.com/marketing/rss.xml",
    category: "marketingNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "HubSpot",
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
  },

  // ── Motion Design ──
  {
    _id: "news-schoolofmotion",
    name: "School of Motion",
    url: "https://www.schoolofmotion.com/blog/rss.xml",
    category: "motionNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "School of Motion",
  },
  {
    _id: "news-motionographer",
    name: "Motionographer",
    url: "https://motionographer.com/feed/",
    category: "motionNews",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "Motionographer",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE EXPANDED RESOURCE FEEDS CATALOG
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
    defaultWorkType: "remote",
  },
  {
    _id: "res-remoteok-design",
    name: "Remote OK — Design Jobs",
    url: "https://remoteok.com/remote-design-jobs.rss",
    category: "jobs",
    refreshInterval: "hourly",
    enabled: true,
    priority: 9,
    sourceName: "Remote OK",
    defaultWorkType: "remote",
  },
  {
    _id: "res-remoteok-marketing",
    name: "Remote OK — Marketing Jobs",
    url: "https://remoteok.com/remote-marketing-jobs.rss",
    category: "jobs",
    refreshInterval: "hourly",
    enabled: true,
    priority: 9,
    sourceName: "Remote OK",
    defaultWorkType: "remote",
  },

  // ── Free Design Assets ──
  {
    _id: "res-spoongraphics",
    name: "Spoon Graphics Assets",
    url: "https://feeds.feedburner.com/SpoonGraphics",
    category: "freeDesignAssets",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Spoon Graphics",
  },
  {
    _id: "res-graphicburger",
    name: "Graphic Burger Freebies",
    url: "https://graphicburger.com/feed/",
    category: "freeDesignAssets",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Graphic Burger",
  },
  {
    _id: "res-sketchappsources",
    name: "Sketch App Sources",
    url: "https://www.sketchappsources.com/feed",
    category: "freeDesignAssets",
    refreshInterval: "6hours",
    enabled: true,
    priority: 8,
    sourceName: "Sketch App Sources",
  },
  {
    _id: "res-freebiesbug",
    name: "Freebies Bug",
    url: "https://freebiesbug.com/feed/",
    category: "freeDesignAssets",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Freebies Bug",
  },

  // ── Free Mockups ──
  {
    _id: "res-mockupworld",
    name: "Mockup World",
    url: "https://www.mockupworld.co/feed/",
    category: "freeMockups",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "Mockup World",
  },

  // ── Free Fonts ──
  {
    _id: "res-fontsquirrel",
    name: "Font Squirrel",
    url: "https://www.fontsquirrel.com/blog/feed",
    category: "freeFonts",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Font Squirrel",
  },

  // ── AI Tools ──
  {
    _id: "res-producthunt-ai",
    name: "Product Hunt — AI Tools",
    url: "https://www.producthunt.com/feed?category=artificial-intelligence",
    category: "aiTools",
    refreshInterval: "hourly",
    enabled: true,
    priority: 10,
    sourceName: "Product Hunt AI",
  },

  // ── Developer & Design Tools ──
  {
    _id: "res-producthunt-design",
    name: "Product Hunt — Design Tools",
    url: "https://www.producthunt.com/feed?category=design-tools",
    category: "tools",
    refreshInterval: "hourly",
    enabled: true,
    priority: 10,
    sourceName: "Product Hunt Design",
  },

  // ── Learning & Courses ──
  {
    _id: "res-freecodecamp",
    name: "freeCodeCamp News",
    url: "https://www.freecodecamp.org/news/rss/",
    category: "learning",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "freeCodeCamp",
  },
  {
    _id: "res-webdev",
    name: "web.dev Articles",
    url: "https://web.dev/feed.xml",
    category: "learning",
    refreshInterval: "6hours",
    enabled: true,
    priority: 10,
    sourceName: "web.dev",
  },

  // ── Podcasts ──
  {
    _id: "res-designbetter",
    name: "Design Better Podcast",
    url: "https://feeds.simplecast.com/dh4tA13e",
    category: "podcasts",
    refreshInterval: "daily",
    enabled: true,
    priority: 9,
    sourceName: "Design Better",
  },
  {
    _id: "res-syntaxfm",
    name: "Syntax FM Podcast",
    url: "https://feed.syntax.fm/rss",
    category: "podcasts",
    refreshInterval: "daily",
    enabled: true,
    priority: 9,
    sourceName: "Syntax FM",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Cache TTL map
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_TTL_MAP: Record<string, number> = {
  hourly: 15 * 60 * 1000,   // Refresh every 15 min for live content
  "6hours": 2 * 60 * 60 * 1000,
  daily: 6 * 60 * 60 * 1000,
};

function cleanText(html: string): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent || "";
  return text.replace(/\s+/g, " ").trim().slice(0, 320);
}

// ─────────────────────────────────────────────────────────────────────────────
// Robust Single Feed Fetcher with Multi-Proxy Fallback
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAndParseSingleFeed(feed: RssFeedConfig): Promise<NormalizedResource[]> {
  const ttl = CACHE_TTL_MAP[feed.refreshInterval] || CACHE_TTL_MAP["6hours"];
  const cacheKey = `rss_cache_v3_${feed._id}`;

  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (Date.now() - cached.timestamp < ttl && Array.isArray(cached.items) && cached.items.length > 0) {
        return cached.items;
      }
    }
  } catch (e) {
    // Ignore storage quota
  }

  const proxies = [
    (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  let rawXml = "";
  let statusCode = 200;

  for (const proxyFn of proxies) {
    try {
      const proxyUrl = proxyFn(feed.url);
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) {
        statusCode = res.status;
        continue;
      }

      if (proxyUrl.includes("allorigins.win")) {
        const json = await res.json();
        rawXml = json.contents;
      } else {
        rawXml = await res.text();
      }

      if (rawXml && (rawXml.includes("<rss") || rawXml.includes("<feed") || rawXml.includes("<item") || rawXml.includes("<entry"))) {
        break;
      }
    } catch (_err) {
      // Try next proxy
    }
  }

  if (!rawXml) {
    recordFeedHealth(feed._id, feed.url, false, 0, statusCode);
    return [];
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rawXml, "text/xml");
  const items: NormalizedResource[] = [];

  const itemNodes = Array.from(xmlDoc.querySelectorAll("item, entry")).slice(0, 20);

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
    
    // Accurate publication date extraction
    const rawPubDate =
      node.querySelector("pubDate")?.textContent ||
      node.querySelector("published")?.textContent ||
      node.querySelector("updated")?.textContent ||
      node.querySelector("dc\\:date")?.textContent ||
      "";

    if (!title || !rawLink) return;

    const publishedAt = parsePubDate(rawPubDate);
    const formattedDate = formatPublicationTimestamp(publishedAt);
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
      formattedDate,
      category: feed.category,
      country: feed.defaultCountry || "Global",
      workType: feed.defaultWorkType || "na",
      isFree: true,
      difficulty: "all",
      isRss: true,
      analyticsId: feed._id,
      isTrending: idx < 3,
      isFeatured: idx === 0,
    });
  });

  recordFeedHealth(feed._id, feed.url, items.length > 0, items.length);

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), items }));
  } catch (e) {
    // Ignore quota
  }

  return items;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Aggregation Endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Aggregate all News feeds (Design / AI / Frontend / Dev / Marketing / Motion)
 */
export async function aggregateNewsFeeds(): Promise<NormalizedResource[]> {
  const feedResults = await Promise.allSettled(
    NEWS_RSS_FEEDS.filter((f) => f.enabled !== false).map((feed) => fetchAndParseSingleFeed(feed))
  );

  const items: NormalizedResource[] = [];
  feedResults.forEach((res) => {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      items.push(...res.value);
    }
  });

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
 * Aggregate all Resource feeds (Jobs / Assets / Mockups / Fonts / AI Tools / Learning / Podcasts)
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

  const newsCategories = new Set(["latestDesignNews", "designNews", "aiNews", "frontendNews", "devNews", "marketingNews", "motionNews"]);

  const mappedCms: NormalizedResource[] = cmsResources
    .filter((item) => !newsCategories.has(item.resourceType) && !newsCategories.has(item.category))
    .map((item) => {
      const cat = mapResourceTypeToCategory(item.resourceType);
      const pubIso = parsePubDate(item._createdAt || item.publishedAt);
      return {
        id: item._id,
        title: item.title,
        slug: item.slug || item._id,
        resourceType: item.resourceType || "freeDesignAssets",
        description: item.description || "",
        benefitSummary: item.benefitSummary || "Curated Resource",
        link: item.link,
        sourceName: item.benefitSummary || "Rvan.me Curated",
        publishedAt: pubIso,
        formattedDate: formatPublicationTimestamp(pubIso),
        category: cat,
        country: item.isGlobal ? "Global" : (item.countries && item.countries[0]) || "Global",
        workType: item.workType || (cat === "jobs" ? "remote" : "na"),
        isFree: true,
        difficulty: item.difficultyLevel || "all",
        logoUrl: item.logoUrl,
        isRss: false,
        analyticsId: item._id,
        isTrending: true,
        isFeatured: item.featuredScore && item.featuredScore > 5,
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

function mapResourceTypeToCategory(resourceType: string): string {
  const map: Record<string, string> = {
    jobs: "jobs",
    freeDesignAssets: "freeDesignAssets",
    freeMockups: "freeMockups",
    freeFonts: "freeFonts",
    freeIcons: "freeIcons",
    freeUIKits: "freeUIKits",
    freeIllustrations: "freeDesignAssets",
    free3D: "freeDesignAssets",
    aiTools: "aiTools",
    tools: "tools",
    learning: "learning",
    podcasts: "podcasts",
    opportunities: "opportunities",
    remoteDesignJobs: "jobs",
    remoteMarketingJobs: "jobs",
  };
  return map[resourceType] || "freeDesignAssets";
}
