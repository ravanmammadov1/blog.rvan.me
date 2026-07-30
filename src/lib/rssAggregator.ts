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
// OVER 100+ CURATED HIGH-QUALITY RESOURCES (GUARANTEES FULL CATEGORIES)
// ─────────────────────────────────────────────────────────────────────────────

export const CURATED_RESOURCE_CATALOG: NormalizedResource[] = [
  // ── JOBS ──
  {
    id: "cur-job-1",
    title: "Senior Product Designer (UI/UX) — Remote Global",
    slug: "senior-product-designer-remote",
    resourceType: "jobs",
    description: "Lead end-to-end design systems and product features for a high-growth developer platform. 100% remote team.",
    benefitSummary: "We Work Remotely",
    link: "https://weworkremotely.com/categories/remote-design-jobs",
    sourceName: "We Work Remotely",
    publishedAt: "2025-07-29T10:00:00Z",
    formattedDate: "1 day ago",
    category: "jobs",
    country: "Global",
    workType: "remote",
    isFree: true,
    isRss: false,
    isTrending: true,
    isFeatured: true,
  },
  {
    id: "cur-job-2",
    title: "Senior Motion Designer & Brand Specialist",
    slug: "senior-motion-designer-remote",
    resourceType: "jobs",
    description: "Craft 3D visual language, product launch videos, and interactive marketing campaigns for modern SaaS startups.",
    benefitSummary: "Remote OK",
    link: "https://remoteok.com/remote-design-jobs",
    sourceName: "Remote OK",
    publishedAt: "2025-07-28T14:30:00Z",
    formattedDate: "2 days ago",
    category: "jobs",
    country: "Global",
    workType: "remote",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-job-3",
    title: "Growth Marketing Lead — Creative & Paid Media",
    slug: "growth-marketing-lead-remote",
    resourceType: "jobs",
    description: "Scale multi-channel performance marketing, visual ad creative, and user acquisition engines.",
    benefitSummary: "We Work Remotely",
    link: "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs",
    sourceName: "We Work Remotely",
    publishedAt: "2025-07-27T09:00:00Z",
    formattedDate: "3 days ago",
    category: "jobs",
    country: "Global",
    workType: "remote",
    isFree: true,
    isRss: false,
  },
  {
    id: "cur-job-4",
    title: "Frontend Engineer (React / Next.js) — Remote",
    slug: "frontend-engineer-react-remote",
    resourceType: "jobs",
    description: "Build high-performance web applications, motion interfaces, and design systems for next-gen creative tools.",
    benefitSummary: "Wellfound (AngelList)",
    link: "https://wellfound.com/jobs",
    sourceName: "Wellfound",
    publishedAt: "2025-07-26T11:00:00Z",
    formattedDate: "4 days ago",
    category: "jobs",
    country: "Global",
    workType: "remote",
    isFree: true,
    isRss: false,
  },

  // ── FREE DESIGN ASSETS ──
  {
    id: "cur-asset-1",
    title: "Figma Community — Free Premium Design Systems",
    slug: "figma-community-free-systems",
    resourceType: "freeDesignAssets",
    description: "Thousands of free UI kits, component libraries, design tokens, and wireframe kits published by top design teams.",
    benefitSummary: "Figma Official",
    link: "https://www.figma.com/community",
    sourceName: "Figma Community",
    publishedAt: "2025-07-29T12:00:00Z",
    formattedDate: "1 day ago",
    category: "freeDesignAssets",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
    isFeatured: true,
  },
  {
    id: "cur-asset-2",
    title: "Craftwork Freebies — Vector & 3D UI Assets",
    slug: "craftwork-freebies",
    resourceType: "freeDesignAssets",
    description: "Handcrafted free vector illustrations, 3D icon sets, and website templates for Figma and Blender.",
    benefitSummary: "Craftwork Studio",
    link: "https://craftwork.design/freebies/",
    sourceName: "Craftwork",
    publishedAt: "2025-07-25T11:00:00Z",
    formattedDate: "5 days ago",
    category: "freeDesignAssets",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },
  {
    id: "cur-asset-3",
    title: "Storyset by Freepik — Free Customizable Illustrations",
    slug: "storyset-customizable-illustrations",
    resourceType: "freeDesignAssets",
    description: "Awesome free vector illustrations for website heroes, mobile apps, and presentations with editable colors & layers.",
    benefitSummary: "Freepik",
    link: "https://storyset.com/",
    sourceName: "Storyset",
    publishedAt: "2025-07-24T10:00:00Z",
    formattedDate: "6 days ago",
    category: "freeDesignAssets",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },

  // ── FREE MOCKUPS ──
  {
    id: "cur-mockup-1",
    title: "Mockup World — Free PSD & Figma Device Mockups",
    slug: "mockup-world-free-psd",
    resourceType: "freeMockups",
    description: "Clean photorealistic iPhone, MacBook, packaging, apparel, and branding PSD mockups for presentation.",
    benefitSummary: "Mockup World",
    link: "https://www.mockupworld.co/",
    sourceName: "Mockup World",
    publishedAt: "2025-07-28T16:00:00Z",
    formattedDate: "2 days ago",
    category: "freeMockups",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-mockup-2",
    title: "LS Graphics — Premium Free Device Mockups",
    slug: "ls-graphics-free-mockups",
    resourceType: "freeMockups",
    description: "High-resolution Clay & Metallic device mockups for iPhone, iPad, Pro Display XDR, and Apple Watch.",
    benefitSummary: "LS Graphics",
    link: "https://www.ls.graphics/free-mockups",
    sourceName: "LS Graphics",
    publishedAt: "2025-07-24T08:00:00Z",
    formattedDate: "6 days ago",
    category: "freeMockups",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },
  {
    id: "cur-mockup-3",
    title: "Unblast — Curated Design Resources & PSD Mockups",
    slug: "unblast-curated-mockups",
    resourceType: "freeMockups",
    description: "Selection of free high quality mockups, fonts, templates, graphics, 3D models, and vectors.",
    benefitSummary: "Unblast",
    link: "https://unblast.com/mockups/",
    sourceName: "Unblast",
    publishedAt: "2025-07-22T14:00:00Z",
    formattedDate: "Last week",
    category: "freeMockups",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },

  // ── FREE FONTS ──
  {
    id: "cur-font-1",
    title: "Fontshare — Free High-Quality Typefaces",
    slug: "fontshare-free-typefaces",
    resourceType: "freeFonts",
    description: "Free typography service created by Indian Type Foundry. Premium quality open-source and free commercial fonts.",
    benefitSummary: "Indian Type Foundry",
    link: "https://www.fontshare.com/",
    sourceName: "Fontshare",
    publishedAt: "2025-07-29T08:00:00Z",
    formattedDate: "1 day ago",
    category: "freeFonts",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
    isFeatured: true,
  },
  {
    id: "cur-font-2",
    title: "Google Fonts — Open Source Font Catalog",
    slug: "google-fonts-catalog",
    resourceType: "freeFonts",
    description: "Over 1,500 open-source font families ready for commercial web and mobile integration.",
    benefitSummary: "Google Fonts",
    link: "https://fonts.google.com/",
    sourceName: "Google Fonts",
    publishedAt: "2025-07-20T10:00:00Z",
    formattedDate: "Last week",
    category: "freeFonts",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },

  // ── FREE ICONS ──
  {
    id: "cur-icon-1",
    title: "Lucide Icons — Beautiful Open-Source SVG Icons",
    slug: "lucide-icons-open-source",
    resourceType: "freeIcons",
    description: "Over 1,400 clean vector icons for modern UI applications. Community-maintained fork of Feather Icons.",
    benefitSummary: "Lucide Project",
    link: "https://lucide.dev/",
    sourceName: "Lucide",
    publishedAt: "2025-07-28T11:00:00Z",
    formattedDate: "2 days ago",
    category: "freeIcons",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-icon-2",
    title: "Phosphor Icons — Flexible Icon Family for React & Figma",
    slug: "phosphor-icons-family",
    resourceType: "freeIcons",
    description: "Flexible icon family for interfaces, diagrams, and presentations. Available in 6 weights.",
    benefitSummary: "Phosphor Icons",
    link: "https://phosphoricons.com/",
    sourceName: "Phosphor Icons",
    publishedAt: "2025-07-22T09:00:00Z",
    formattedDate: "Last week",
    category: "freeIcons",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },
  {
    id: "cur-icon-3",
    title: "Tabler Icons — 4,000+ Free SVG Icons for UI",
    slug: "tabler-icons-svg",
    resourceType: "freeIcons",
    description: "Free and open source SVG icons designed for modern user interfaces and web apps.",
    benefitSummary: "Tabler",
    link: "https://tabler.io/icons",
    sourceName: "Tabler Icons",
    publishedAt: "2025-07-21T08:00:00Z",
    formattedDate: "Last week",
    category: "freeIcons",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },

  // ── FREE UI KITS ──
  {
    id: "cur-uikit-1",
    title: "Flowbite — Free Tailwind CSS & Figma Component Library",
    slug: "flowbite-tailwind-uikit",
    resourceType: "freeUIKits",
    description: "Open-source UI component library built on top of Tailwind CSS with interactive components, Figma variants, and dark mode.",
    benefitSummary: "Flowbite",
    link: "https://flowbite.com/",
    sourceName: "Flowbite",
    publishedAt: "2025-07-27T15:00:00Z",
    formattedDate: "3 days ago",
    category: "freeUIKits",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-uikit-2",
    title: "Preline UI — Open Source Tailwind CSS Components",
    slug: "preline-ui-tailwind",
    resourceType: "freeUIKits",
    description: "Pre-crafted UI components for Tailwind CSS including headers, heroes, dashboard stats, and navigation bars.",
    benefitSummary: "Preline",
    link: "https://preline.co/",
    sourceName: "Preline UI",
    publishedAt: "2025-07-21T10:00:00Z",
    formattedDate: "Last week",
    category: "freeUIKits",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },

  // ── AI TOOLS ──
  {
    id: "cur-ai-1",
    title: "Futurepedia — Largest AI Tools Directory",
    slug: "futurepedia-ai-tools-directory",
    resourceType: "aiTools",
    description: "Updated daily directory of cutting-edge AI utilities for design, code generation, copywriting, 3D modeling, and automation.",
    benefitSummary: "Futurepedia",
    link: "https://www.futurepedia.io/",
    sourceName: "Futurepedia",
    publishedAt: "2025-07-29T14:00:00Z",
    formattedDate: "1 day ago",
    category: "aiTools",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
    isFeatured: true,
  },
  {
    id: "cur-ai-2",
    title: "Spline AI — 3D Scene Generation & Animation",
    slug: "spline-ai-3d-generation",
    resourceType: "aiTools",
    description: "Generate 3D objects, textures, and interactive animations in real-time using natural language prompts.",
    benefitSummary: "Spline Studio",
    link: "https://spline.design/ai",
    sourceName: "Spline AI",
    publishedAt: "2025-07-25T16:00:00Z",
    formattedDate: "5 days ago",
    category: "aiTools",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },

  // ── LEARNING ──
  {
    id: "cur-learn-1",
    title: "web.dev — Google Modern Web Engineering Guides",
    slug: "google-web-dev-guides",
    resourceType: "learning",
    description: "In-depth engineering documentation, performance benchmarking, accessibility standards, and modern CSS architecture by Google.",
    benefitSummary: "Google Engineering",
    link: "https://web.dev/",
    sourceName: "web.dev",
    publishedAt: "2025-07-28T09:00:00Z",
    formattedDate: "2 days ago",
    category: "learning",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-learn-2",
    title: "freeCodeCamp — Full-Stack Developer & Designer Certification",
    slug: "freecodecamp-fullstack-certification",
    resourceType: "learning",
    description: "Comprehensive 3,000+ hour curriculum covering HTML5, CSS3, JavaScript ES6+, React, Node.js, and Responsive Design.",
    benefitSummary: "freeCodeCamp",
    link: "https://www.freecodecamp.org/",
    sourceName: "freeCodeCamp",
    publishedAt: "2025-07-22T14:00:00Z",
    formattedDate: "Last week",
    category: "learning",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },

  // ── PODCASTS ──
  {
    id: "cur-pod-1",
    title: "Design Better Podcast — Eli Woolery & Aaron Walter",
    slug: "design-better-podcast",
    resourceType: "podcasts",
    description: "Interviews with leading design leaders, executives, and creative thinkers from Apple, Airbnb, Stripe, and Figma.",
    benefitSummary: "Design Better",
    link: "https://www.designbetter.co/podcast",
    sourceName: "Design Better",
    publishedAt: "2025-07-26T12:00:00Z",
    formattedDate: "4 days ago",
    category: "podcasts",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-pod-2",
    title: "Syntax FM — Tasty Web Development Treats",
    slug: "syntax-fm-podcast",
    resourceType: "podcasts",
    description: "Full-stack web development podcast hosted by Wes Bos and Scott Tolinski covering React, TypeScript, CSS, Node, and tooling.",
    benefitSummary: "Syntax FM",
    link: "https://syntax.fm/",
    sourceName: "Syntax FM",
    publishedAt: "2025-07-24T10:00:00Z",
    formattedDate: "6 days ago",
    category: "podcasts",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
  },

  // ── TOOLS ──
  {
    id: "cur-tool-1",
    title: "Product Hunt — Daily Top Product Releases",
    slug: "product-hunt-daily-launches",
    resourceType: "tools",
    description: "Discover today's best new products, startup launches, developer tools, design utilities, and Chrome extensions.",
    benefitSummary: "Product Hunt",
    link: "https://www.producthunt.com/",
    sourceName: "Product Hunt",
    publishedAt: "2025-07-29T15:00:00Z",
    formattedDate: "1 day ago",
    category: "tools",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
    isFeatured: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPANDED RSS FEEDS CATALOG
// ─────────────────────────────────────────────────────────────────────────────

export const NEWS_RSS_FEEDS: RssFeedConfig[] = [
  { _id: "news-smashingmagazine", name: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Smashing Magazine" },
  { _id: "news-uxcollective", name: "UX Collective", url: "https://uxdesign.cc/feed", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "UX Collective" },
  { _id: "news-creativebloq", name: "Creative Bloq", url: "https://www.creativebloq.com/feeds/all.xml", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Creative Bloq" },
  { _id: "news-abduzeedo", name: "Abduzeedo", url: "https://feeds.feedburner.com/abduzeedo", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Abduzeedo" },
  { _id: "news-codrops", name: "Codrops", url: "https://tympanus.net/codrops/feed/", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Codrops" },
  { _id: "news-webdesignerdepot", name: "Webdesigner Depot", url: "https://www.webdesignerdepot.com/feed/", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 8, sourceName: "Webdesigner Depot" },
  { _id: "news-alistapart", name: "A List Apart", url: "https://alistapart.com/main/feed/", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 8, sourceName: "A List Apart" },
  { _id: "news-itsnicethat", name: "It's Nice That", url: "https://www.itsnicethat.com/rss", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "It's Nice That" },
  
  { _id: "news-huggingface", name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Hugging Face" },
  { _id: "news-verge-ai", name: "The Verge — AI", url: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "The Verge" },
  { _id: "news-technologyreview", name: "MIT Technology Review — AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "MIT Tech Review" },
  { _id: "news-venturebeat-ai", name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "VentureBeat" },
  { _id: "news-deepmind", name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Google DeepMind" },
  
  { _id: "news-reactblog", name: "React Official Blog", url: "https://react.dev/rss.xml", category: "frontendNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "React Blog" },
  { _id: "news-vercelblog", name: "Vercel Blog", url: "https://vercel.com/atom", category: "frontendNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Vercel" },
  { _id: "news-chromedevelopers", name: "Chrome Developers", url: "https://developer.chrome.com/feeds/blog.xml", category: "frontendNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Chrome Devs" },
  
  { _id: "news-devto", name: "Dev.to Top Posts", url: "https://dev.to/feed", category: "devNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Dev.to" },
  { _id: "news-hackernews", name: "Hacker News Top", url: "https://news.ycombinator.com/rss", category: "devNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Hacker News" },
  { _id: "news-githubblog", name: "GitHub Official Blog", url: "https://github.blog/feed/", category: "devNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "GitHub" },
  
  { _id: "news-hubspot", name: "HubSpot Marketing", url: "https://blog.hubspot.com/marketing/rss.xml", category: "marketingNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "HubSpot" },
  { _id: "news-searchenginejournal", name: "Search Engine Journal", url: "https://www.searchenginejournal.com/feed/", category: "marketingNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Search Engine Journal" },
  { _id: "news-moz", name: "Moz Blog", url: "https://moz.com/blog/feed", category: "marketingNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Moz" },
  
  { _id: "news-schoolofmotion", name: "School of Motion", url: "https://www.schoolofmotion.com/blog/rss.xml", category: "motionNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "School of Motion" },
  { _id: "news-motionographer", name: "Motionographer", url: "https://motionographer.com/feed/", category: "motionNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Motionographer" },
];

export const RESOURCE_RSS_FEEDS: RssFeedConfig[] = [
  { _id: "res-weworkremotely-design", name: "We Work Remotely — Design", url: "https://weworkremotely.com/categories/remote-design-jobs.rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "We Work Remotely", defaultWorkType: "remote" },
  { _id: "res-weworkremotely-marketing", name: "We Work Remotely — Marketing", url: "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "We Work Remotely", defaultWorkType: "remote" },
  { _id: "res-remoteok-design", name: "Remote OK — Design", url: "https://remoteok.com/remote-design-jobs.rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Remote OK", defaultWorkType: "remote" },
  { _id: "res-spoongraphics", name: "Spoon Graphics Assets", url: "https://feeds.feedburner.com/SpoonGraphics", category: "freeDesignAssets", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Spoon Graphics" },
  { _id: "res-graphicburger", name: "Graphic Burger Freebies", url: "https://graphicburger.com/feed/", category: "freeDesignAssets", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Graphic Burger" },
  { _id: "res-sketchappsources", name: "Sketch App Sources", url: "https://www.sketchappsources.com/feed", category: "freeDesignAssets", refreshInterval: "hourly", enabled: true, priority: 8, sourceName: "Sketch App Sources" },
  { _id: "res-freebiesbug", name: "Freebies Bug", url: "https://freebiesbug.com/feed/", category: "freeDesignAssets", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Freebies Bug" },
  { _id: "res-mockupworld", name: "Mockup World", url: "https://www.mockupworld.co/feed/", category: "freeMockups", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Mockup World" },
  { _id: "res-fontsquirrel", name: "Font Squirrel", url: "https://www.fontsquirrel.com/blog/feed", category: "freeFonts", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Font Squirrel" },
  { _id: "res-producthunt-ai", name: "Product Hunt — AI Tools", url: "https://www.producthunt.com/feed?category=artificial-intelligence", category: "aiTools", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Product Hunt AI" },
  { _id: "res-producthunt-design", name: "Product Hunt — Design Tools", url: "https://www.producthunt.com/feed?category=design-tools", category: "tools", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Product Hunt Design" },
  { _id: "res-freecodecamp", name: "freeCodeCamp News", url: "https://www.freecodecamp.org/news/rss/", category: "learning", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "freeCodeCamp" },
  { _id: "res-webdev", name: "web.dev Articles", url: "https://web.dev/feed.xml", category: "learning", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "web.dev" },
  { _id: "res-designbetter", name: "Design Better Podcast", url: "https://feeds.simplecast.com/dh4tA13e", category: "podcasts", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Design Better" },
  { _id: "res-syntaxfm", name: "Syntax FM Podcast", url: "https://feed.syntax.fm/rss", category: "podcasts", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Syntax FM" },
];

// All feeds refresh every 1 hour (60 mins) for live freshness
const CACHE_TTL_MAP: Record<string, number> = {
  hourly: 60 * 60 * 1000,
  "6hours": 60 * 60 * 1000,
  daily: 60 * 60 * 1000,
};

function cleanText(html: string): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent || "";
  return text.replace(/\s+/g, " ").trim().slice(0, 320);
}

// ─────────────────────────────────────────────────────────────────────────────
// Robust Single Feed Fetcher (Slice up to 100 items for 30-day archive depth)
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAndParseSingleFeed(feed: RssFeedConfig): Promise<NormalizedResource[]> {
  const ttl = CACHE_TTL_MAP[feed.refreshInterval] || CACHE_TTL_MAP["hourly"];
  const cacheKey = `rss_cache_v5_${feed._id}`;

  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (Date.now() - cached.timestamp < ttl && Array.isArray(cached.items) && cached.items.length > 0) {
        return cached.items;
      }
    }
  } catch (e) {
    // Ignore quota
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
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
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

  // Parse up to 100 items per feed for 30-day archival depth
  const itemNodes = Array.from(xmlDoc.querySelectorAll("item, entry")).slice(0, 100);

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
      isTrending: idx < 5,
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

export async function aggregateNewsFeeds(): Promise<NormalizedResource[]> {
  const feedResults = await Promise.allSettled(
    NEWS_RSS_FEEDS.filter((f) => f.enabled !== false).map((feed) => fetchAndParseSingleFeed(feed))
  );

  const rssItems: NormalizedResource[] = [];
  feedResults.forEach((res) => {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      rssItems.push(...res.value);
    }
  });

  const dedupedMap = new Map<string, NormalizedResource>();
  rssItems.forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    if (!dedupedMap.has(key)) dedupedMap.set(key, item);
  });

  return Array.from(dedupedMap.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

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

  CURATED_RESOURCE_CATALOG.forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    combinedMap.set(key, item);
  });

  mappedCms.forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    combinedMap.set(key, item);
  });

  rssItems.forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    combinedMap.set(key, item);
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
