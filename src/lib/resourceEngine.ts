import { client } from "./sanityClient";
import { loadStaticFontCatalog, FontItem, getFontSlug } from "./fontEngine";
import { fetchUniversalContentItems } from "./sanityQueries";
import { INTERACTIVE_TOOLS } from "../app/lib/toolsRegistry";
import { APPROVED_DISCOVERY_REPOS } from "./githubDiscoveryEngine";
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
    id: "gh-drei",
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

export const CURATED_INSPIRATION_RESOURCES: SharedResourceItem[] = [
  {
    id: "insp-awwwards",
    title: "Awwwards — Site of the Day",
    description: "The awards that recognize the talent and effort of the best web designers, developers and agencies in the world.",
    category: "inspiration",
    type: "Design Awards",
    source: "Awwwards",
    url: "https://www.awwwards.com/",
    publishedAt: "2026-02-08T10:00:00Z",
    qualityScore: 99,
    trendingScore: 98,
  },
  {
    id: "insp-siteinspire",
    title: "Siteinspire — Web Design Showcase",
    description: "A showcase of the finest web and interactive design. Filtering by style, type, subject, and platform.",
    category: "inspiration",
    type: "Web Showcase",
    source: "Siteinspire",
    url: "https://www.siteinspire.com/",
    publishedAt: "2026-02-07T12:00:00Z",
    qualityScore: 97,
    trendingScore: 95,
  },
  {
    id: "insp-godly",
    title: "Godly Website — Astronomically Good Web Design",
    description: "Curated web design inspiration from the best creative design studios and independent web developers.",
    category: "inspiration",
    type: "Curated Gallery",
    source: "Godly",
    url: "https://godly.website/",
    publishedAt: "2026-02-06T15:00:00Z",
    qualityScore: 98,
    trendingScore: 97,
  },
  {
    id: "insp-underconsideration",
    title: "Brand New by UnderConsideration",
    description: "Opinions on corporate and visual identity redesign work. In-depth brand system breakdowns.",
    category: "inspiration",
    type: "Brand Identity",
    source: "UnderConsideration",
    url: "https://www.underconsideration.com/brandnew/",
    publishedAt: "2026-02-05T09:00:00Z",
    qualityScore: 96,
    trendingScore: 94,
  },
  {
    id: "insp-mindsparkle",
    title: "Mindsparkle Mag — Design & Architecture",
    description: "Online magazine showcasing the most beautiful projects in graphic design, web design, and architecture.",
    category: "inspiration",
    type: "Design Magazine",
    source: "Mindsparkle Mag",
    url: "https://mindsparklemag.com/",
    publishedAt: "2026-02-04T11:00:00Z",
    qualityScore: 95,
    trendingScore: 92,
  },
  {
    id: "insp-behance-curated",
    title: "Behance Curated Galleries",
    description: "World class portfolios, 3D motion design breakdowns, and graphic identity case studies.",
    category: "inspiration",
    type: "Portfolio Showcase",
    source: "Behance",
    url: "https://www.behance.net/galleries",
    publishedAt: "2026-02-03T14:00:00Z",
    qualityScore: 94,
    trendingScore: 91,
  },
  {
    id: "insp-dribbble",
    title: "Dribbble Shots & UI Mechanics",
    description: "Discover the world’s top designers & creative professionals. Visual shots, vector UI, and 3D graphics.",
    category: "inspiration",
    type: "Visual Design",
    source: "Dribbble",
    url: "https://dribbble.com/shots",
    publishedAt: "2026-02-02T16:00:00Z",
    qualityScore: 93,
    trendingScore: 90,
  },
  {
    id: "insp-muzli",
    title: "Muzli Inspiration Feed",
    description: "Secret source for design inspiration. Cutting-edge web designs, UI trends, and motion concepts.",
    category: "inspiration",
    type: "Daily Digest",
    source: "Muzli",
    url: "https://muz.li/",
    publishedAt: "2026-02-01T08:00:00Z",
    qualityScore: 95,
    trendingScore: 93,
  },
  {
    id: "insp-hoverstates",
    title: "Hoverstat.es — Experimental Web Design",
    description: "The home of experimental web design and creative interactive mechanics.",
    category: "inspiration",
    type: "Experimental UX",
    source: "Hoverstat.es",
    url: "https://hoverstat.es/",
    publishedAt: "2026-01-29T10:00:00Z",
    qualityScore: 96,
    trendingScore: 92,
  },
  {
    id: "insp-minimal-gallery",
    title: "Minimal Gallery — Clean Website Directory",
    description: "Curated archive of minimal web design, refined typography, and spatial web layouts.",
    category: "inspiration",
    type: "Minimal Web",
    source: "Minimal Gallery",
    url: "https://minimal.gallery/",
    publishedAt: "2026-01-28T11:00:00Z",
    qualityScore: 94,
    trendingScore: 89,
  },
  {
    id: "insp-lapa-ninja",
    title: "Lapa Ninja — Landing Page Gallery",
    description: "Best landing page design inspiration for startups, micro-SaaS, and digital creators.",
    category: "inspiration",
    type: "Landing Pages",
    source: "Lapa Ninja",
    url: "https://www.lapa.ninja/",
    publishedAt: "2026-01-27T13:00:00Z",
    qualityScore: 93,
    trendingScore: 88,
  },
  {
    id: "insp-dead-simple",
    title: "Dead Simple Sites",
    description: "Minimalist web design gallery celebrating functional typography and fast execution.",
    category: "inspiration",
    type: "Minimalist Design",
    source: "Dead Simple Sites",
    url: "https://deadsimplesites.com/",
    publishedAt: "2026-01-25T15:00:00Z",
    qualityScore: 92,
    trendingScore: 87,
  }
];

export const CURATED_ASSETS_RESOURCES: SharedResourceItem[] = [
  {
    id: "asset-unsplash-3d",
    title: "Unsplash 3D & Abstract Render Assets",
    description: "Free high-resolution 3D renders, abstract geometric objects, and modern wallpaper textures.",
    category: "assets",
    type: "3D Renders",
    source: "Unsplash",
    url: "https://unsplash.com/t/3d-renders",
    publishedAt: "2026-02-08T09:00:00Z",
    qualityScore: 98,
    trendingScore: 96,
  },
  {
    id: "asset-iconoir",
    title: "Iconoir — Open Source Vector Icons",
    description: "1,300+ clean SVG vector icons. Free for commercial design and front-end development.",
    category: "assets",
    type: "Icon Pack",
    source: "Iconoir",
    url: "https://iconoir.com/",
    publishedAt: "2026-02-07T11:00:00Z",
    qualityScore: 97,
    trendingScore: 95,
  },
  {
    id: "asset-haikei",
    title: "Haikei SVG Wave & Blob Generator",
    description: "Generate unique SVG shapes, waves, layered blobs, and abstract background patterns.",
    category: "assets",
    type: "SVG Generator",
    source: "Haikei",
    url: "https://haikei.app/",
    publishedAt: "2026-02-06T14:00:00Z",
    qualityScore: 98,
    trendingScore: 97,
  },
  {
    id: "asset-reshot",
    title: "Reshot Free Vector Illustrations",
    description: "Handpicked free vector illustrations and icons for commercial marketing and app UI.",
    category: "assets",
    type: "Vector Graphics",
    source: "Reshot",
    url: "https://www.reshot.com/",
    publishedAt: "2026-02-05T10:00:00Z",
    qualityScore: 95,
    trendingScore: 92,
  },
  {
    id: "asset-coolors",
    title: "Coolors Palette Engine",
    description: "Generate harmonious color palettes for branding, UI design, and visual identities.",
    category: "assets",
    type: "Color Tools",
    source: "Coolors",
    url: "https://coolors.co/",
    publishedAt: "2026-02-04T12:00:00Z",
    qualityScore: 99,
    trendingScore: 98,
  },
  {
    id: "asset-spline-community",
    title: "Spline 3D Community Library",
    description: "Free interactive 3D web scenes, glassmorphism objects, and vector assets for web.",
    category: "assets",
    type: "3D Models",
    source: "Spline",
    url: "https://spline.design/community",
    publishedAt: "2026-02-03T15:00:00Z",
    qualityScore: 96,
    trendingScore: 94,
  },
  {
    id: "asset-rive-community",
    title: "Rive Interactive Animation Assets",
    description: "State-machine interactive vector animations ready for web apps and game UI.",
    category: "assets",
    type: "Vector Animations",
    source: "Rive",
    url: "https://rive.app/community/",
    publishedAt: "2026-02-02T11:00:00Z",
    qualityScore: 97,
    trendingScore: 95,
  },
  {
    id: "asset-fontshare-specimen",
    title: "Fontshare Free Typeface Library",
    description: "Free, high-quality fonts for commercial use by Indian Type Foundry.",
    category: "assets",
    type: "Free Fonts",
    source: "Fontshare",
    url: "https://www.fontshare.com/",
    publishedAt: "2026-02-01T09:00:00Z",
    qualityScore: 99,
    trendingScore: 97,
  }
];

export const CURATED_LEARNING_RESOURCES: SharedResourceItem[] = [
  {
    id: "learn-smashing-guides",
    title: "Smashing Magazine Design & Motion Guides",
    description: "Deep dive articles on UI architecture, motion mechanics, and accessibility standards.",
    category: "learning",
    type: "Editorial Guide",
    source: "Smashing Mag",
    url: "https://www.smashingmagazine.com/category/design/",
    publishedAt: "2026-02-08T08:00:00Z",
    qualityScore: 98,
    trendingScore: 96,
  },
  {
    id: "learn-webdev-css",
    title: "web.dev Learn CSS Course",
    description: "An evergreen CSS course and reference for modern web styling and container queries.",
    category: "learning",
    type: "Course",
    source: "Google web.dev",
    url: "https://web.dev/learn/css/",
    publishedAt: "2026-02-07T10:00:00Z",
    qualityScore: 99,
    trendingScore: 97,
  },
  {
    id: "learn-react-docs",
    title: "React Official Interactive Docs",
    description: "Master React 19, Server Components, and state management through interactive sandboxes.",
    category: "learning",
    type: "Interactive Docs",
    source: "React Dev",
    url: "https://react.dev/learn",
    publishedAt: "2026-02-06T12:00:00Z",
    qualityScore: 100,
    trendingScore: 99,
  },
  {
    id: "learn-book-of-shaders",
    title: "The Book of Shaders (WebGL & GLSL)",
    description: "Step-by-step guide through the abstract universe of Fragment Shaders and 3D graphics.",
    category: "learning",
    type: "WebGL Book",
    source: "Patricio Gonzalez Vivo",
    url: "https://thebookofshaders.com/",
    publishedAt: "2026-02-05T14:00:00Z",
    qualityScore: 99,
    trendingScore: 95,
  },
  {
    id: "learn-design-systems",
    title: "Design Systems Handbook",
    description: "Learn how to plan, build, and scale visual design systems across large creative teams.",
    category: "learning",
    type: "Design Handbook",
    source: "Design Systems",
    url: "https://www.designbetter.co/design-systems-handbook",
    publishedAt: "2026-02-04T16:00:00Z",
    qualityScore: 96,
    trendingScore: 93,
  },
  {
    id: "learn-refactoring-ui",
    title: "Refactoring UI Tactics",
    description: "Learn how to design awesome user interfaces using tactical developer-focused principles.",
    category: "learning",
    type: "UI Guide",
    source: "Refactoring UI",
    url: "https://www.refactoringui.com/",
    publishedAt: "2026-02-03T10:00:00Z",
    qualityScore: 97,
    trendingScore: 94,
  }
];

export const HOME_SHOWCASE_FONTS: SharedResourceItem[] = [
  {
    id: "font-inter",
    title: "Inter",
    description: "Inter is a variable font family carefully crafted & designed for computer screens.",
    category: "fonts",
    type: "Sans Serif",
    source: "Google Fonts",
    url: "/fonts/inter",
    fontSlug: "inter",
    isFont: true,
    authorName: "Rasmus Andersson",
    publishedAt: "2026-01-01T00:00:00Z",
    qualityScore: 100,
    trendingScore: 99,
  },
  {
    id: "font-space-grotesk",
    title: "Space Grotesk",
    description: "Space Grotesk is a proportional sans-serif typeface family based on Space Mono.",
    category: "fonts",
    type: "Display",
    source: "Google Fonts",
    url: "/fonts/space-grotesk",
    fontSlug: "space-grotesk",
    isFont: true,
    authorName: "Florian Karsten",
    publishedAt: "2026-01-01T00:00:00Z",
    qualityScore: 98,
    trendingScore: 97,
  },
  {
    id: "font-geist",
    title: "Geist",
    description: "Geist is a font family created by Vercel for developers and designers.",
    category: "fonts",
    type: "Sans Serif",
    source: "Vercel",
    url: "/fonts/geist",
    fontSlug: "geist",
    isFont: true,
    authorName: "Vercel",
    publishedAt: "2026-01-01T00:00:00Z",
    qualityScore: 99,
    trendingScore: 98,
  },
  {
    id: "font-syne",
    title: "Syne",
    description: "Syne is an expressive display font family designed for art centers and design studios.",
    category: "fonts",
    type: "Display",
    source: "Bonjour Monde",
    url: "/fonts/syne",
    fontSlug: "syne",
    isFont: true,
    authorName: "Bonjour Monde",
    publishedAt: "2026-01-01T00:00:00Z",
    qualityScore: 96,
    trendingScore: 95,
  },
  {
    id: "font-plus-jakarta-sans",
    title: "Plus Jakarta Sans",
    description: "A fresh take on neo-grotesque sans serif with friendly open apertures.",
    category: "fonts",
    type: "Sans Serif",
    source: "Tokyo Type",
    url: "/fonts/plus-jakarta-sans",
    fontSlug: "plus-jakarta-sans",
    isFont: true,
    authorName: "Gethin Levien",
    publishedAt: "2026-01-01T00:00:00Z",
    qualityScore: 97,
    trendingScore: 96,
  },
  {
    id: "font-outfit",
    title: "Outfit",
    description: "Outfit is a geometric sans-serif typeface designed for modern digital products.",
    category: "fonts",
    type: "Geometric Sans",
    source: "Outfit Type",
    url: "/fonts/outfit",
    fontSlug: "outfit",
    isFont: true,
    authorName: "Outfit",
    publishedAt: "2026-01-01T00:00:00Z",
    qualityScore: 96,
    trendingScore: 94,
  },
];

/**
 * Lightweight instant showcase endpoint for Home page (0ms initial render)
 * Returns the 6 showcase items needed per category without parsing 2,009 font files or fetching RSS feeds.
 */
export async function fetchHomeShowcaseResources(): Promise<SharedResourceItem[]> {
  const showcase: SharedResourceItem[] = [
    ...HOME_SHOWCASE_FONTS,
    ...CURATED_GITHUB_REPOS,
    ...CURATED_INSPIRATION_RESOURCES,
    ...CURATED_ASSETS_RESOURCES,
    ...CURATED_LEARNING_RESOURCES,
  ];
  return showcase;
}

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

      // 2. Add Curated & Approved Discovery GitHub Repositories (125 Curated + 18 Discovery)
      CURATED_GITHUB_REPOS.forEach((repo) => {
        list.push(repo);
      });
      APPROVED_DISCOVERY_REPOS.forEach((repo) => {
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

      // 3b. Add Curated Inspiration Baseline Dataset
      CURATED_INSPIRATION_RESOURCES.forEach((item) => list.push(item));

      // 3c. Add Curated Assets Baseline Dataset
      CURATED_ASSETS_RESOURCES.forEach((item) => list.push(item));

      // 3d. Add Curated Learning Baseline Dataset
      CURATED_LEARNING_RESOURCES.forEach((item) => list.push(item));

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

        // Canonical URL is the PRIMARY identifier. Title is ONLY a secondary fallback if URL is empty.
        const canonicalKey = cleanUrl ? `url:${cleanUrl}` : cleanTitle ? `title:${cleanTitle}` : item.id;

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
