import { client } from "./sanityClient";
import { loadStaticFontCatalog, FontItem, getFontSlug } from "./fontEngine";
import { aggregateAllResources, NormalizedResource } from "./rssAggregator";
import { fetchUniversalContentItems } from "./sanityQueries";
import { INTERACTIVE_TOOLS } from "../app/lib/toolsRegistry";
import { UniversalContentItem } from "../types/cms";

export type ResourceCategoryKey =
  | "fonts"
  | "githubRepos"
  | "tools"
  | "assets"
  | "learning"
  | "inspiration";

export interface SharedResourceItem {
  id: string;
  title: string;
  description: string;
  category: ResourceCategoryKey;
  type: string;
  source: string;
  url: string;
  image?: string;
  icon?: string;
  starsCount?: number;
  language?: string;
  license?: string;
  publishedAt: string;
  qualityScore?: number;
  trendingScore?: number;
  authorName?: string;
  isFont?: boolean;
  fontSlug?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HIGH-UTILITY CURATED GITHUB REPOSITORIES DATASET
// Real, open-source developer & designer GitHub repositories
// ─────────────────────────────────────────────────────────────────────────────
export const CURATED_GITHUB_REPOS: SharedResourceItem[] = [
  {
    id: "gh-lucide-icons",
    title: "lucide-icons / lucide",
    description: "Beautiful & consistent open-source icon toolkit with 1,500+ clean vector icons for React, Vue, and Web.",
    category: "githubRepos",
    type: "Icon Library",
    source: "GitHub",
    url: "https://github.com/lucide-icons/lucide",
    starsCount: 14200,
    language: "TypeScript",
    license: "ISC License",
    publishedAt: "2026-01-15T12:00:00Z",
    qualityScore: 98,
    trendingScore: 95,
  },
  {
    id: "gh-framer-motion",
    title: "framer / motion",
    description: "A production-ready motion library for React. Power smooth animations, gestures, and fluid layout transitions.",
    category: "githubRepos",
    type: "Animation Library",
    source: "GitHub",
    url: "https://github.com/framer/motion",
    starsCount: 26500,
    language: "TypeScript",
    license: "MIT License",
    publishedAt: "2026-02-01T10:00:00Z",
    qualityScore: 99,
    trendingScore: 98,
  },
  {
    id: "gh-tailwindlabs-tailwindcss",
    title: "tailwindlabs / tailwindcss",
    description: "A utility-first CSS framework for rapid UI development and modern responsive design systems.",
    category: "githubRepos",
    type: "CSS Framework",
    source: "GitHub",
    url: "https://github.com/tailwindlabs/tailwindcss",
    starsCount: 81400,
    language: "Rust / TypeScript",
    license: "MIT License",
    publishedAt: "2026-01-20T08:00:00Z",
    qualityScore: 99,
    trendingScore: 97,
  },
  {
    id: "gh-shadcn-ui",
    title: "shadcn-ui / ui",
    description: "Beautifully designed components that you can copy and paste into your apps. Accessible, customizable, open source.",
    category: "githubRepos",
    type: "UI Components",
    source: "GitHub",
    url: "https://github.com/shadcn-ui/ui",
    starsCount: 68900,
    language: "TypeScript",
    license: "MIT License",
    publishedAt: "2026-02-05T14:00:00Z",
    qualityScore: 100,
    trendingScore: 99,
  },
  {
    id: "gh-threejs",
    title: "mrdoob / three.js",
    description: "JavaScript 3D Library for WebGL. Create immersive interactive 3D web experiences and particle systems.",
    category: "githubRepos",
    type: "3D Web Library",
    source: "GitHub",
    url: "https://github.com/mrdoob/three.js",
    starsCount: 99500,
    language: "JavaScript",
    license: "MIT License",
    publishedAt: "2026-01-10T16:00:00Z",
    qualityScore: 98,
    trendingScore: 94,
  },
  {
    id: "gh-tabler-icons",
    title: "tabler / tabler-icons",
    description: "Over 5,200 pixel-perfect vector SVG icons for modern web design and UI prototyping.",
    category: "githubRepos",
    type: "SVG Icons",
    source: "GitHub",
    url: "https://github.com/tabler/tabler-icons",
    starsCount: 16800,
    language: "HTML / SVG",
    license: "MIT License",
    publishedAt: "2026-01-28T09:00:00Z",
    qualityScore: 96,
    trendingScore: 90,
  },
  {
    id: "gh-unocss",
    title: "unocss / unocss",
    description: "The instant atomic CSS engine. Lightweight, blazingly fast design token compiler.",
    category: "githubRepos",
    type: "Atomic CSS Engine",
    source: "GitHub",
    url: "https://github.com/unocss/unocss",
    starsCount: 16200,
    language: "TypeScript",
    license: "MIT License",
    publishedAt: "2026-01-25T11:00:00Z",
    qualityScore: 95,
    trendingScore: 89,
  },
  {
    id: "gh-pmndrs-drei",
    title: "pmndrs / drei",
    description: "Useful helpers and abstractions for React Three Fiber to build 3D scenes effortlessly.",
    category: "githubRepos",
    type: "3D React Helpers",
    source: "GitHub",
    url: "https://github.com/pmndrs/drei",
    starsCount: 7800,
    language: "TypeScript",
    license: "MIT License",
    publishedAt: "2026-02-02T13:00:00Z",
    qualityScore: 94,
    trendingScore: 88,
  },
];

let cachedUnifiedResources: SharedResourceItem[] | null = null;
let unifiedResourcesPromise: Promise<SharedResourceItem[]> | null = null;

/**
 * Single Source of Truth Engine
 * Fetches and unifies all resource items across Fonts, GitHub Repos, Tools, Assets, Learning, and Inspiration.
 */
export async function fetchUnifiedResources(): Promise<SharedResourceItem[]> {
  if (cachedUnifiedResources) return cachedUnifiedResources;
  if (unifiedResourcesPromise) return unifiedResourcesPromise;

  unifiedResourcesPromise = (async () => {
    try {
      const [cmsResources, fontCatalog, universalItems] = await Promise.all([
        client.fetch(`*[_type == "resource" && status == "published"] | order(_createdAt desc)`).catch(() => []),
        loadStaticFontCatalog().catch(() => [] as FontItem[]),
        fetchUniversalContentItems().catch(() => [] as UniversalContentItem[]),
      ]);

      const rssItems = await aggregateAllResources(cmsResources || []);

      const list: SharedResourceItem[] = [];

      // 1. Convert Google Font Catalog to SharedResourceItem
      (fontCatalog || []).forEach((font) => {
        const slug = getFontSlug(font);
        list.push({
          id: `font-${slug}`,
          title: font.family,
          description: font.description || `${font.family} is a high-legibility ${font.category.toLowerCase()} open-source typeface family.`,
          category: "fonts",
          type: font.category,
          source: font.foundry || "Google Fonts",
          url: `/fonts/${slug}`,
          fontSlug: slug,
          isFont: true,
          authorName: font.designer,
          license: font.license || "SIL Open Font License",
          publishedAt: font.createdAt || "2026-01-01T00:00:00Z",
          qualityScore: 95,
          trendingScore: font.trendingScore || 90,
        });
      });

      // 2. Add Curated GitHub Repositories
      CURATED_GITHUB_REPOS.forEach((repo) => {
        list.push(repo);
      });

      // 3. Add Interactive Developer Tools
      INTERACTIVE_TOOLS.forEach((tool) => {
        list.push({
          id: `tool-${tool.id}`,
          title: tool.name,
          description: tool.description,
          category: "tools",
          type: "Interactive Utility",
          source: "Rvan.me Tools",
          url: tool.path,
          icon: tool.icon,
          publishedAt: "2026-01-01T00:00:00Z",
          qualityScore: 99,
          trendingScore: 97,
        });
      });

      // 4. Map Aggregated RSS & Sanity Resources
      (rssItems || []).forEach((r: NormalizedResource) => {
        let catKey: ResourceCategoryKey = "assets";
        if (r.category === "freeFonts") catKey = "fonts";
        else if (r.category === "learning") catKey = "learning";
        else if (r.category === "tools" || r.category === "aiTools") catKey = "tools";
        else if (r.category === "inspiration") catKey = "inspiration";

        list.push({
          id: r.id || `rss-${Math.random()}`,
          title: r.title,
          description: r.description || r.benefitSummary || "Curated design resource.",
          category: catKey,
          type: r.resourceType || "Design Asset",
          source: r.sourceName || "Curated",
          url: r.link,
          image: r.imageUrl || r.logoUrl,
          publishedAt: r.publishedAt || new Date().toISOString(),
          qualityScore: 90,
          trendingScore: r.isTrending ? 96 : 85,
        });
      });

      // 5. Map Sanity Universal Content Items
      (universalItems || []).forEach((item: UniversalContentItem) => {
        let catKey: ResourceCategoryKey = "tools";
        if (item.contentType === "aiTool") catKey = "tools";
        else if (item.githubDetails) catKey = "githubRepos";
        else if (item.category?.slug === "learning") catKey = "learning";

        list.push({
          id: item._id,
          title: item.title,
          description: item.summary || item.whyItMatters || "Curated resource item.",
          category: catKey,
          type: item.contentType || "Resource",
          source: item.sourceName || "Rvan.me Directory",
          url: item.link || `/resources/${item.slug}`,
          image: item.coverImage ? (item as any).coverImage : undefined,
          publishedAt: item.publishedAt || item._createdAt || new Date().toISOString(),
          qualityScore: item.qualityScore || 90,
          trendingScore: item.trendingScore || 88,
          starsCount: item.githubDetails?.starsCount,
          language: item.githubDetails?.primaryLanguage,
        });
      });

      // 6. Canonical URL & Title Deduplication Mapping
      const dedupedMap = new Map<string, SharedResourceItem>();

      list.forEach((item) => {
        // Normalize URL key (strip trailing slashes & utm query parameters)
        const cleanUrl = (item.url || "")
          .toLowerCase()
          .replace(/\/+$/, "")
          .replace(/\?utm_[^&]+(&utm_[^&]+)*/g, "")
          .trim();

        // Normalize Title key
        const cleanTitle = (item.title || "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .trim();

        const canonicalKey = cleanUrl || cleanTitle || item.id;

        if (!dedupedMap.has(canonicalKey)) {
          dedupedMap.set(canonicalKey, item);
        } else {
          // If existing entry has fewer details (e.g. missing stars or icon), enrich it
          const existing = dedupedMap.get(canonicalKey)!;
          if (!existing.starsCount && item.starsCount) existing.starsCount = item.starsCount;
          if (!existing.image && item.image) existing.image = item.image;
        }
      });

      const finalUnifiedList = Array.from(dedupedMap.values());
      cachedUnifiedResources = finalUnifiedList;
      return finalUnifiedList;
    } catch (err) {
      console.error("Error in fetchUnifiedResources:", err);
      return [];
    }
  })();

  return unifiedResourcesPromise;
}

/**
 * Selects top featured resources for the Home Page from the Single Source of Truth
 */
export async function getFeaturedResourcesForHome(limit = 6): Promise<SharedResourceItem[]> {
  const all = await fetchUnifiedResources();
  // Filter diverse items across categories for maximum visual impact
  const topRepos = all.filter((r) => r.category === "githubRepos").slice(0, 2);
  const topTools = all.filter((r) => r.category === "tools").slice(0, 2);
  const topAssets = all.filter((r) => r.category === "assets").slice(0, 2);

  return [...topRepos, ...topTools, ...topAssets].slice(0, limit);
}
