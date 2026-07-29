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

// Default fallback RSS feeds in case Sanity CMS query fails
export const FALLBACK_RSS_FEEDS: RssFeedConfig[] = [
  {
    _id: "rss-smashingmagazine",
    name: "Smashing Magazine — Articles & Guides",
    url: "https://www.smashingmagazine.com/feed/",
    category: "latestDesignNews",
    refreshInterval: "hourly",
    enabled: true,
    priority: 10,
    sourceName: "Smashing Magazine",
    defaultCountry: "Global",
    defaultWorkType: "na",
  },
  {
    _id: "rss-weworkremotely-design-new",
    name: "We Work Remotely — Remote Design Opportunities",
    url: "https://weworkremotely.com/categories/remote-design-jobs.rss",
    category: "remoteDesignJobs",
    refreshInterval: "hourly",
    enabled: true,
    priority: 10,
    sourceName: "We Work Remotely",
    defaultCountry: "Global",
    defaultWorkType: "remote",
  },
  {
    _id: "rss-weworkremotely-marketing-new",
    name: "We Work Remotely — Sales & Marketing Jobs",
    url: "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss",
    category: "remoteMarketingJobs",
    refreshInterval: "hourly",
    enabled: true,
    priority: 10,
    sourceName: "We Work Remotely",
    defaultCountry: "Global",
    defaultWorkType: "remote",
  },
  {
    _id: "rss-spoongraphics",
    name: "Spoon Graphics — Design Templates & Textures",
    url: "https://feeds.feedburner.com/SpoonGraphics",
    category: "freeDesignAssets",
    refreshInterval: "6hours",
    enabled: true,
    priority: 9,
    sourceName: "Spoon Graphics",
    defaultCountry: "Global",
    defaultWorkType: "na",
  }
];

const CACHE_TTL_MAP: Record<string, number> = {
  hourly: 60 * 60 * 1000,
  "6hours": 6 * 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
};

// Fetch enabled RSS feeds from Sanity
export async function fetchRssFeedsFromSanity(): Promise<RssFeedConfig[]> {
  try {
    const feeds = await client.fetch(`
      *[_type == "rssFeed" && enabled == true] | order(priority desc){
        _id,
        name,
        url,
        category,
        refreshInterval,
        enabled,
        priority,
        sourceName,
        defaultCountry,
        defaultWorkType
      }
    `);
    if (feeds && feeds.length > 0) {
      return feeds;
    }
  } catch (err) {
    console.warn("Failed to fetch RSS feeds from Sanity, falling back to defaults:", err);
  }
  return FALLBACK_RSS_FEEDS;
}

// Clean HTML tags from RSS item excerpt strings
function cleanText(html: string): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent || "";
  return text.replace(/\s+/g, " ").trim().slice(0, 260);
}

// Fetch single RSS feed with CORS proxy & parse XML
async function fetchAndParseSingleFeed(feed: RssFeedConfig): Promise<NormalizedResource[]> {
  const ttl = CACHE_TTL_MAP[feed.refreshInterval] || CACHE_TTL_MAP.hourly;
  const cacheKey = `rss_cache_${feed.url}`;

  // Check local cache
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

  // Proxies to try in sequence
  const proxies = [
    (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  let rawXml = "";
  for (const proxyFn of proxies) {
    try {
      const proxyUrl = proxyFn(feed.url);
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) continue;

      if (proxyUrl.includes("allorigins.win")) {
        const json = await res.json();
        rawXml = json.contents;
      } else {
        rawXml = await res.text();
      }
      if (rawXml && rawXml.includes("<rss") || rawXml.includes("<feed") || rawXml.includes("<item")) {
        break;
      }
    } catch (err) {
      // Try next proxy
    }
  }

  if (!rawXml) {
    return [];
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rawXml, "text/xml");
  const items: NormalizedResource[] = [];

  // Parse RSS <item> elements
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
      workType: feed.defaultWorkType || "remote",
      isFree: true,
      difficulty: "all",
      isRss: true,
      analyticsId: feed._id,
    });
  });

  // Store in cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), items }));
  } catch (e) {
    // Ignore storage quota
  }

  return items;
}

// Fetch all feeds in parallel and merge with CMS static items
export async function aggregateAllResources(cmsResources: any[] = []): Promise<NormalizedResource[]> {
  const feedConfigs = await fetchRssFeedsFromSanity();
  const enabledFeeds = feedConfigs.filter((f) => f.enabled !== false);

  // Fetch all feeds in parallel
  const feedResults = await Promise.allSettled(
    enabledFeeds.map((feed) => fetchAndParseSingleFeed(feed))
  );

  const rssItems: NormalizedResource[] = [];
  feedResults.forEach((res) => {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      rssItems.push(...res.value);
    }
  });

  // Map CMS static resources to NormalizedResource format
  const mappedCms: NormalizedResource[] = cmsResources.map((item) => {
    const cat = (typeof item.category === 'object' && item.category?.slug) 
      ? item.category.slug 
      : mapResourceTypeToCategory(item.resourceType);

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
      workType: item.workType || (item.resourceType === "remoteDesignJobs" || item.resourceType === "remoteMarketingJobs" ? "remote" : "na"),
      isFree: true,
      difficulty: item.difficultyLevel || "all",
      logoUrl: item.logoUrl,
      isRss: false,
      analyticsId: item._id,
    };
  });

  // Merge and deduplicate by title / link
  const combinedMap = new Map<string, NormalizedResource>();
  [...mappedCms, ...rssItems].forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    if (!combinedMap.has(key)) {
      combinedMap.set(key, item);
    }
  });

  const merged = Array.from(combinedMap.values());
  // Sort by publishedAt date descending
  merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return merged;
}

function mapResourceTypeToCategory(resourceType: string): string {
  const map: Record<string, string> = {
    latestDesignNews: "latestDesignNews",
    remoteDesignJobs: "remoteDesignJobs",
    remoteMarketingJobs: "remoteMarketingJobs",
    freeDesignAssets: "freeDesignAssets",
    freeMockups: "freeMockups",
    freeFonts: "freeFonts",
    freeIcons: "freeIcons",
    freeUIKits: "freeUIKits",
    designPodcasts: "designPodcasts",
    // Legacy maps
    studentPack: "freeDesignAssets",
    aiCredits: "latestDesignNews",
    software: "freeDesignAssets",
    roadmap: "freeDesignAssets",
    scholarship: "freeDesignAssets",
    internship: "remoteDesignJobs",
    job: "remoteDesignJobs",
    hackathon: "freeDesignAssets",
    startupProgram: "latestDesignNews",
  };
  return map[resourceType] || "freeDesignAssets";
}
