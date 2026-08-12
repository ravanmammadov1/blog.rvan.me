import { client, urlFor } from "./sanityClient";
import { parsePubDate, formatPublicationTimestamp, recordFeedHealth, generateAIJobSummary, AIJobSummary } from "./contentEngine";

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
  imageUrl?: string;
  isRss: boolean;
  analyticsId?: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  // Job-specific metadata
  companyName?: string;
  salaryRange?: string;
  employmentType?: "Full-time" | "Contract" | "Part-time" | "Freelance";
  seniorityLevel?: "Junior" | "Mid" | "Senior" | "Lead / Executive";
  jobTags?: string[];
  jobSummary?: AIJobSummary;
}

// ─────────────────────────────────────────────────────────────────────────────
// XML Entity Normalization & Image Resolution Engine
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decodes HTML and XML entities including decimal and hexadecimal character codes
 */
export function cleanPublisherUrl(url?: string): string {
  if (!url) return "https://www.rvan.me/news";
  if (url.startsWith("/")) return url;
  
  // Strip raw RSS / XML feed paths
  if (url.includes(".xml") || url.includes("/feed") || url.includes("/rss") || url.includes("/atom") || url.includes("feedburner")) {
    try {
      const parsed = new URL(url);
      return parsed.origin;
    } catch {
      return "https://www.rvan.me/news";
    }
  }
  return url;
}

export function decodeXmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&copy;/g, "©")
    .replace(/&reg;/g, "®")
    .replace(/&trade;/g, "™")
    .trim();
}

/**
 * Multi-tier Image Resolution Pipeline for RSS feeds
 * 1. media:content (url)
 * 2. media:thumbnail (url)
 * 3. enclosure (image url)
 * 4. content:encoded img src
 * 5. description / content img src
 * 6. Neutral Publisher Fallback
 */
export function resolveRssCoverImage(
  itemNode: Element | any,
  rawContentHtml: string = "",
  publisherName: string = ""
): { imageUrl?: string; method: string } {
  if (!itemNode) return { method: "fallback" };

  // 1. media:content
  const mediaContent = itemNode.querySelector("media\\:content, content");
  if (mediaContent) {
    const url = mediaContent.getAttribute("url") || mediaContent.getAttribute("href");
    const type = mediaContent.getAttribute("type") || "";
    const medium = mediaContent.getAttribute("medium") || "";
    if (url && (medium === "image" || type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)/i.test(url))) {
      return { imageUrl: url, method: "media:content" };
    }
  }

  // 2. media:thumbnail
  const mediaThumb = itemNode.querySelector("media\\:thumbnail, thumbnail");
  if (mediaThumb) {
    const url = mediaThumb.getAttribute("url") || mediaThumb.getAttribute("href");
    if (url) return { imageUrl: url, method: "media:thumbnail" };
  }

  // 3. enclosure (type image/*)
  const enclosure = itemNode.querySelector("enclosure");
  if (enclosure) {
    const url = enclosure.getAttribute("url");
    const type = enclosure.getAttribute("type") || "";
    if (url && (type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)/i.test(url))) {
      return { imageUrl: url, method: "enclosure" };
    }
  }

  // Helper to extract first <img> src attribute
  const extractImgSrc = (html: string): string | null => {
    if (!html) return null;
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1] && !match[1].includes("gravatar.com") && !match[1].includes("feeds.feedburner.com") && !match[1].includes("pixel.wp.com")) {
      return match[1];
    }
    return null;
  };

  // 4. content:encoded
  const contentEncoded = itemNode.querySelector("content\\:encoded, encoded")?.textContent || "";
  const imgFromContent = extractImgSrc(contentEncoded);
  if (imgFromContent) {
    return { imageUrl: imgFromContent, method: "content:encoded img" };
  }

  // 5. description / content
  const description = itemNode.querySelector("description, summary, content")?.textContent || rawContentHtml;
  const imgFromDesc = extractImgSrc(description);
  if (imgFromDesc) {
    return { imageUrl: imgFromDesc, method: "description img" };
  }

  return { method: "fallback" };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE CURATED NEWS DATABASE
// ─────────────────────────────────────────────────────────────────────────────

export const CURATED_NEWS_CATALOG: NormalizedResource[] = [
  {
    id: "cur-news-1",
    title: "Designing for Spatial Computing: UI Patterns for VisionOS & AR",
    slug: "designing-for-spatial-computing-visionos",
    resourceType: "designNews",
    description: "Deep dive into 3D spatial interfaces, glassmorphism UI depth tokens, and eye-tracking gesture targets for modern AR environments.",
    benefitSummary: "Smashing Magazine",
    link: "https://www.smashingmagazine.com",
    sourceName: "Smashing Magazine",
    publishedAt: "2026-08-08T10:00:00Z",
    formattedDate: formatPublicationTimestamp("2026-08-08T10:00:00Z"),
    category: "designNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
    isFeatured: true,
  },
  {
    id: "cur-news-2",
    title: "State of UX 2026: AI Co-Pilots, Micro-Interactions & Adaptive Systems",
    slug: "state-of-ux-2026-ai-copilots",
    resourceType: "designNews",
    description: "UX Collective annual report exploring generative layout engines, hyper-personalized interfaces, and modern design ethics.",
    benefitSummary: "UX Collective",
    link: "https://uxdesign.cc",
    sourceName: "UX Collective",
    publishedAt: "2026-08-09T08:20:00Z",
    formattedDate: "2 hours ago",
    category: "designNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-news-3",
    title: "Design @ ACME: Creative Systems, Guidelines & Brand Evolution",
    slug: "design-acme",
    resourceType: "designNews",
    description: "Learning from mishaps, misfortunes, and sidesplitting calamities. Detailed case study of scale, layout, and visual rhythm.",
    benefitSummary: "UX Collective",
    link: "https://uxdesign.cc",
    sourceName: "UX Collective",
    publishedAt: "2026-08-07T14:00:00Z",
    formattedDate: "2 days ago",
    category: "designNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-news-4",
    title: "Figma Variables 2.0 & Token Studio Integration Best Practices",
    slug: "figma-variables-2-token-studio-guide",
    resourceType: "designNews",
    description: "Comprehensive guide to managing multi-brand design tokens, dark mode primitives, and automated Figma-to-code pipelines.",
    benefitSummary: "Sidebar.io",
    link: "https://sidebar.io",
    sourceName: "Sidebar.io",
    publishedAt: "2026-08-07T10:00:00Z",
    formattedDate: "2 days ago",
    category: "designNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-ai-news-1",
    title: "Google DeepMind Releases Gemini Robotics ER 2 & Video Understanding Engine",
    slug: "google-deepmind-gemini-robotics-er2",
    resourceType: "aiNews",
    description: "Flagship model architecture featuring ultra-fast real-time audio latency, 4K visual document reasoning, and multi-agent coordination.",
    benefitSummary: "Google DeepMind",
    link: "https://deepmind.google/blog",
    sourceName: "Google DeepMind",
    publishedAt: "2026-08-09T09:00:00Z",
    formattedDate: "1 hour ago",
    category: "aiNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
    isFeatured: true,
  },
  {
    id: "cur-ai-news-2",
    title: "OpenAI Acquires NextSlide to Transform AI Presentation Design Workflows",
    slug: "openai-acquires-nextslide-ai-presentation",
    resourceType: "aiNews",
    description: "OpenAI expands creative tool ecosystem to automate pitch decks, vector layouts, and real-time canvas generation.",
    benefitSummary: "OpenAI",
    link: "https://openai.com/news",
    sourceName: "OpenAI",
    publishedAt: "2026-08-08T18:00:00Z",
    formattedDate: "Yesterday",
    category: "aiNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-ai-news-3",
    title: "What Star Trek got wrong about AI (so far)",
    slug: "what-star-trek-got-wrong-about-ai-so-far",
    resourceType: "aiNews",
    description: "The show imagined one kind of AI. We built the other kind, by the million. We got something stranger — copyable, fluent, confidently wrong.",
    benefitSummary: "MIT Tech Review",
    link: "https://www.technologyreview.com",
    sourceName: "MIT Tech Review",
    publishedAt: "2026-08-07T18:00:00Z",
    formattedDate: "2 days ago",
    category: "aiNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-ai-news-4",
    title: "Hugging Face Launches Open Source Autonomous Agent Canvas & Visual Workflow Builder",
    slug: "hugging-face-agent-canvas-open-source",
    resourceType: "aiNews",
    description: "Open-source visual node graph engine for chaining local LLMs, Stable Diffusion WebUI, and vector memory stores.",
    benefitSummary: "Hugging Face",
    link: "https://huggingface.co/blog",
    sourceName: "Hugging Face",
    publishedAt: "2026-08-06T12:00:00Z",
    formattedDate: "3 days ago",
    category: "aiNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-fe-news-1",
    title: "Vercel AI Gateway & Hermes Agent Container Registry Features Launched",
    slug: "vercel-ai-gateway-hermes-agent",
    resourceType: "frontendNews",
    description: "Next.js architecture updates introducing public container repositories, edge caching, and serverless AI model gateways.",
    benefitSummary: "Vercel",
    link: "https://vercel.com/blog",
    sourceName: "Vercel",
    publishedAt: "2026-08-09T07:00:00Z",
    formattedDate: "3 hours ago",
    category: "frontendNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
    isFeatured: true,
  },
  {
    id: "cur-fe-news-2",
    title: "React 19 & React Compiler: Automated Memoization & Server Actions Guide",
    slug: "react-19-compiler-deep-dive",
    resourceType: "frontendNews",
    description: "Deep dive into how the new React Compiler eliminates manual useMemo and useCallback hooks while boosting rendering performance.",
    benefitSummary: "React Blog",
    link: "https://react.dev/blog",
    sourceName: "React Blog",
    publishedAt: "2026-08-08T14:00:00Z",
    formattedDate: "Yesterday",
    category: "frontendNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-fe-news-3",
    title: "CSS Baseline 2026: Container Queries, Subgrid & View Transitions Standardized",
    slug: "css-baseline-2026-container-queries-subgrid",
    resourceType: "frontendNews",
    description: "Interop 2026 results confirm 100% cross-browser support across Chrome, Safari, Firefox, and Edge for modern CSS features.",
    benefitSummary: "web.dev",
    link: "https://web.dev",
    sourceName: "web.dev",
    publishedAt: "2026-08-06T09:00:00Z",
    formattedDate: "3 days ago",
    category: "frontendNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-motion-news-1",
    title: "NOIR | Qatsi Studio Motion Design & 3D Visual Language Breakdown",
    slug: "noir-qatsi-studio-motion-breakdown",
    resourceType: "motionNews",
    description: "In-depth case study exploring 3D Cinema 4D particle systems, Octane lighting, and fluid motion graphics for brand films.",
    benefitSummary: "Motionographer",
    link: "https://motionographer.com",
    sourceName: "Motionographer",
    publishedAt: "2026-08-08T20:00:00Z",
    formattedDate: "Yesterday",
    category: "motionNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-motion-news-2",
    title: "Blender 4.2 LTS: Real-Time EEVEE Next & GPU Raytracing Performance",
    slug: "blender-4-2-lts-eevee-next-gpu-raytracing",
    resourceType: "motionNews",
    description: "Major release breakdown covering displacement nodes, light linking, real-time subsurface scattering, and metal performance updates.",
    benefitSummary: "Blender Dev",
    link: "https://code.blender.org",
    sourceName: "Blender Dev",
    publishedAt: "2026-08-05T15:00:00Z",
    formattedDate: "4 days ago",
    category: "motionNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-motion-news-3",
    title: "Rive Runtime 2026: Interactive Vector Animations in WebGL & React Native",
    slug: "rive-runtime-2026-interactive-vector-animation",
    resourceType: "motionNews",
    description: "State machine architecture guide for embedding 60fps responsive UI animations with zero asset bloat.",
    benefitSummary: "Stash Magazine",
    link: "https://www.stashmedia.tv",
    sourceName: "Stash Magazine",
    publishedAt: "2026-08-04T11:00:00Z",
    formattedDate: "5 days ago",
    category: "motionNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-mkt-news-1",
    title: "Data Specialist Ideally Advances Research Integration in Creative Agency Workflows",
    slug: "ideally-research-creative-process",
    resourceType: "marketingNews",
    description: "How modern brand strategists and creative directors utilize real-time audience feedback loops at the start of campaign design.",
    benefitSummary: "Digiday",
    link: "https://digiday.com",
    sourceName: "Digiday",
    publishedAt: "2026-08-08T16:00:00Z",
    formattedDate: "Yesterday",
    category: "marketingNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-mkt-news-2",
    title: "The Death of Generic Performance Ads: Why High-Concept Creative Rules 2026",
    slug: "death-of-generic-performance-ads-creative-strategy",
    resourceType: "marketingNews",
    description: "Adweek agency report detailing why story-first video creative outperforms algorithmic micro-targeting across major platforms.",
    benefitSummary: "Adweek",
    link: "https://www.adweek.com",
    sourceName: "Adweek",
    publishedAt: "2026-08-05T14:00:00Z",
    formattedDate: "4 days ago",
    category: "marketingNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  },
  {
    id: "cur-mkt-news-3",
    title: "Hyper-Personalized Video Campaigns: Scaling Brand Identity Across Channels",
    slug: "hyper-personalized-video-campaigns-brand-identity",
    resourceType: "marketingNews",
    description: "Analysis of generative video production pipelines for multi-language ad variants and localized visual assets.",
    benefitSummary: "Social Media Today",
    link: "https://www.socialmediatoday.com",
    sourceName: "Social Media Today",
    publishedAt: "2026-08-03T10:00:00Z",
    formattedDate: "6 days ago",
    category: "marketingNews",
    country: "Global",
    workType: "na",
    isFree: true,
    isRss: false,
    isTrending: true,
  }
];
// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE CURATED RESOURCE & JOB DATABASE
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
    companyName: "Vercel Ecosystem Partner",
    salaryRange: "$130,000 – $180,000 USD / yr",
    employmentType: "Full-time",
    seniorityLevel: "Senior",
    jobTags: ["UI/UX", "Design Systems", "Figma", "100% Remote"],
    jobSummary: generateAIJobSummary("Senior Product Designer (UI/UX)", "Vercel Partner", "Lead end-to-end design systems and product features for developer platform."),
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
    companyName: "Rive Studio Labs",
    salaryRange: "$115,000 – $160,000 USD / yr",
    employmentType: "Full-time",
    seniorityLevel: "Senior",
    jobTags: ["Motion Design", "3D", "After Effects", "Cinema 4D"],
    jobSummary: generateAIJobSummary("Senior Motion Designer", "Rive Studio Labs", "Craft 3D visual language and launch videos for SaaS startups."),
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
    companyName: "Supabase Growth",
    salaryRange: "$125,000 – $165,000 USD / yr",
    employmentType: "Full-time",
    seniorityLevel: "Lead / Executive",
    jobTags: ["Growth Marketing", "Paid Media", "Analytics"],
    jobSummary: generateAIJobSummary("Growth Marketing Lead", "Supabase Growth", "Scale multi-channel performance marketing and user acquisition engines."),
  },
  {
    id: "cur-job-4",
    title: "Senior AI Product Designer & Prompt Engineer",
    slug: "senior-ai-product-designer",
    resourceType: "jobs",
    description: "Shape intuitive interfaces for generative AI models, multimodal agent canvas tools, and adaptive design systems.",
    benefitSummary: "Himalayas",
    link: "https://himalayas.app/jobs",
    sourceName: "Himalayas",
    publishedAt: "2025-07-29T15:00:00Z",
    formattedDate: "1 day ago",
    category: "jobs",
    country: "Global",
    workType: "remote",
    isFree: true,
    isRss: false,
    isTrending: true,
    companyName: "Anthropic Ecosystem",
    salaryRange: "$140,000 – $195,000 USD / yr",
    employmentType: "Full-time",
    seniorityLevel: "Senior",
    jobTags: ["AI/ML", "UI/UX", "Prompt Design", "100% Remote"],
    jobSummary: generateAIJobSummary("Senior AI Product Designer", "Anthropic Ecosystem", "Shape intuitive interfaces for generative AI models and canvas tools."),
  },
  {
    id: "cur-job-5",
    title: "Creative Frontend Engineer (React / WebGL / Three.js)",
    slug: "creative-frontend-engineer-threejs",
    resourceType: "jobs",
    description: "Build immersive 3D web experiences, shader micro-interactions, and high-performance React component libraries.",
    benefitSummary: "Authentic Jobs",
    link: "https://authenticjobs.com/",
    sourceName: "Authentic Jobs",
    publishedAt: "2025-07-28T11:00:00Z",
    formattedDate: "2 days ago",
    category: "jobs",
    country: "Global",
    workType: "remote",
    isFree: true,
    isRss: false,
    isTrending: true,
    companyName: "Spline 3D Labs",
    salaryRange: "$130,000 – $170,000 USD / yr",
    employmentType: "Full-time",
    seniorityLevel: "Senior",
    jobTags: ["Frontend", "React", "Three.js", "WebGL"],
    jobSummary: generateAIJobSummary("Creative Frontend Engineer", "Spline 3D Labs", "Build immersive 3D web experiences and shader micro-interactions."),
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
// EXPANDED RSS FEEDS CATALOG (INCLUDING MULTIPLE JOB FEEDS)
// ─────────────────────────────────────────────────────────────────────────────

export const NEWS_RSS_FEEDS: RssFeedConfig[] = [
  // DESIGN
  { _id: "news-smashingmagazine", name: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Smashing Magazine" },
  { _id: "news-sidebar", name: "Sidebar.io", url: "https://sidebar.io/feed.xml", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Sidebar.io" },
  { _id: "news-uxcollective", name: "UX Collective", url: "https://uxdesign.cc/feed", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "UX Collective" },
  { _id: "news-creativeboom", name: "Creative Boom", url: "https://www.creativeboom.com/feed/", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Creative Boom" },
  { _id: "news-codrops", name: "Codrops", url: "https://tympanus.net/codrops/feed/", category: "designNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Codrops" },

  // AI & ML
  { _id: "news-openai", name: "OpenAI News", url: "https://openai.com/news/rss.xml", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "OpenAI" },
  { _id: "news-deepmind", name: "Google DeepMind Blog", url: "https://deepmind.google/blog/rss.xml", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Google DeepMind" },
  { _id: "news-huggingface", name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Hugging Face" },
  { _id: "news-technologyreview", name: "MIT Technology Review — AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "MIT Tech Review" },
  { _id: "news-techcrunch-ai", name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", category: "aiNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "TechCrunch AI" },

  // MARKETING
  { _id: "news-adweek", name: "Adweek", url: "https://www.adweek.com/feed/", category: "marketingNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Adweek" },
  { _id: "news-digiday", name: "Digiday", url: "https://digiday.com/feed/", category: "marketingNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Digiday" },
  { _id: "news-socialmediatoday", name: "Social Media Today", url: "https://www.socialmediatoday.com/feeds/news/", category: "marketingNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Social Media Today" },

  // FRONTEND
  { _id: "news-reactblog", name: "React Official Blog", url: "https://react.dev/rss.xml", category: "frontendNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "React Blog" },
  { _id: "news-vercelblog", name: "Vercel Blog", url: "https://vercel.com/atom", category: "frontendNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Vercel" },
  { _id: "news-webdev", name: "web.dev", url: "https://web.dev/feed.xml", category: "frontendNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "web.dev" },
  { _id: "news-csstricks", name: "CSS-Tricks", url: "https://css-tricks.com/feed/", category: "frontendNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "CSS-Tricks" },
  { _id: "news-mozillahacks", name: "Mozilla Hacks", url: "https://hacks.mozilla.org/feed/", category: "frontendNews", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Mozilla Hacks" },

  // MOTION
  { _id: "news-motionographer", name: "Motionographer", url: "https://motionographer.com/feed/", category: "motionNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Motionographer" },
  { _id: "news-blenderdev", name: "Blender Developer Blog", url: "https://code.blender.org/feed/", category: "motionNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Blender Dev" },
  { _id: "news-stashmedia", name: "Stash Magazine", url: "https://www.stashmedia.tv/feed/", category: "motionNews", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Stash Magazine" },
];

export const RESOURCE_RSS_FEEDS: RssFeedConfig[] = [
  // ── MULTIPLE TRUSTED REMOTE JOB SOURCES ──
  { _id: "res-weworkremotely-design", name: "We Work Remotely — Design", url: "https://weworkremotely.com/categories/remote-design-jobs.rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "We Work Remotely", defaultWorkType: "remote" },
  { _id: "res-weworkremotely-marketing", name: "We Work Remotely — Marketing", url: "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "We Work Remotely", defaultWorkType: "remote" },
  { _id: "res-weworkremotely-frontend", name: "We Work Remotely — Frontend", url: "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "We Work Remotely", defaultWorkType: "remote" },
  { _id: "res-remoteok-design", name: "Remote OK — Design", url: "https://remoteok.com/remote-design-jobs.rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Remote OK", defaultWorkType: "remote" },
  { _id: "res-remoteok-marketing", name: "Remote OK — Marketing", url: "https://remoteok.com/remote-marketing-jobs.rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Remote OK", defaultWorkType: "remote" },
  { _id: "res-remoteok-dev", name: "Remote OK — Frontend Dev", url: "https://remoteok.com/remote-dev-jobs.rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Remote OK", defaultWorkType: "remote" },
  { _id: "res-himalayas-jobs", name: "Himalayas — Remote Jobs", url: "https://himalayas.app/jobs/rss", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Himalayas", defaultWorkType: "remote" },
  { _id: "res-authentic-jobs", name: "Authentic Jobs", url: "https://authenticjobs.com/feed/", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Authentic Jobs", defaultWorkType: "remote" },
  { _id: "res-aijobs-net", name: "AIJobs.net — AI & Machine Learning Jobs", url: "https://aijobs.net/feed/", category: "jobs", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "AIJobs.net", defaultWorkType: "remote" },

  // ── ASSETS / MOCKUPS / FONTS / AI TOOLS / LEARNING / PODCASTS ──
  { _id: "res-spoongraphics", name: "Spoon Graphics Assets", url: "https://feeds.feedburner.com/SpoonGraphics", category: "freeDesignAssets", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Spoon Graphics" },
  { _id: "res-graphicburger", name: "Graphic Burger Freebies", url: "https://graphicburger.com/feed/", category: "freeDesignAssets", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Graphic Burger" },
  { _id: "res-mockupworld", name: "Mockup World", url: "https://www.mockupworld.co/feed/", category: "freeMockups", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Mockup World" },
  { _id: "res-fontsquirrel", name: "Font Squirrel", url: "https://www.fontsquirrel.com/blog/feed", category: "freeFonts", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Font Squirrel" },
  { _id: "res-producthunt-ai", name: "Product Hunt — AI Tools", url: "https://www.producthunt.com/feed?category=artificial-intelligence", category: "aiTools", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Product Hunt AI" },
  { _id: "res-producthunt-design", name: "Product Hunt — Design Tools", url: "https://www.producthunt.com/feed?category=design-tools", category: "tools", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "Product Hunt Design" },
  { _id: "res-freecodecamp", name: "freeCodeCamp News", url: "https://www.freecodecamp.org/news/rss/", category: "learning", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "freeCodeCamp" },
  { _id: "res-webdev", name: "web.dev Articles", url: "https://web.dev/feed.xml", category: "learning", refreshInterval: "hourly", enabled: true, priority: 10, sourceName: "web.dev" },
  { _id: "res-designbetter", name: "Design Better Podcast", url: "https://feeds.simplecast.com/dh4tA13e", category: "podcasts", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Design Better" },
  { _id: "res-syntaxfm", name: "Syntax FM Podcast", url: "https://feed.syntax.fm/rss", category: "podcasts", refreshInterval: "hourly", enabled: true, priority: 9, sourceName: "Syntax FM" },
];

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
// Robust Single Feed Fetcher
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAndParseSingleFeed(feed: RssFeedConfig): Promise<NormalizedResource[]> {
  const ttl = CACHE_TTL_MAP[feed.refreshInterval] || CACHE_TTL_MAP["hourly"];
  const cacheKey = `rss_cache_v8_${feed._id}`;

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
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
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

  const itemNodes = Array.from(xmlDoc.querySelectorAll("item, entry")).slice(0, 100);

  itemNodes.forEach((node, idx) => {
    const rawTitle = node.querySelector("title")?.textContent?.trim() || "";
    const title = decodeXmlEntities(rawTitle);
    const rawLink =
      node.querySelector("link")?.textContent?.trim() ||
      node.querySelector("link")?.getAttribute("href") ||
      "";
    const descriptionRaw =
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

    // Filter relevant creative & tech job titles if parsing a jobs feed
    if (feed.category === "jobs") {
      const lowerT = title.toLowerCase();
      const isRelevantJob =
        lowerT.includes("design") ||
        lowerT.includes("ui") ||
        lowerT.includes("ux") ||
        lowerT.includes("motion") ||
        lowerT.includes("3d") ||
        lowerT.includes("brand") ||
        lowerT.includes("creative") ||
        lowerT.includes("marketing") ||
        lowerT.includes("growth") ||
        lowerT.includes("frontend") ||
        lowerT.includes("react") ||
        lowerT.includes("web") ||
        lowerT.includes("ai") ||
        lowerT.includes("prompt");

      if (!isRelevantJob) return; // Ignore unrelated categories
    }

    const publishedAt = parsePubDate(rawPubDate);
    const formattedDate = formatPublicationTimestamp(publishedAt);
    const cleanDesc = decodeXmlEntities(cleanText(descriptionRaw) || title);
    const slugId = `rss-${feed._id}-${idx}`;

    // Image Resolution Pipeline: media:content -> media:thumbnail -> enclosure -> content:encoded img -> description img
    const imageResolution = resolveRssCoverImage(node, descriptionRaw, feed.sourceName || feed.name);

    // Extract company name if available in title or source
    let companyName = decodeXmlEntities(feed.sourceName || feed.name);
    if (title.includes(" is hiring ") || title.includes(" at ") || title.includes(" — ")) {
      const parts = title.split(/ is hiring | at | — | - /i);
      if (parts.length > 1) {
        companyName = decodeXmlEntities(parts[parts.length - 1].trim());
      }
    }

    const jobSummary = feed.category === "jobs" ? generateAIJobSummary(title, companyName, cleanDesc) : undefined;

    items.push({
      id: slugId,
      title,
      slug: slugId,
      resourceType: feed.category,
      description: cleanDesc,
      benefitSummary: companyName,
      link: rawLink,
      sourceName: feed.sourceName || feed.name,
      publishedAt,
      formattedDate,
      category: feed.category,
      country: feed.defaultCountry || "Global",
      workType: "remote", // Force 100% remote for curated jobs
      isFree: true,
      imageUrl: imageResolution.imageUrl,
      difficulty: "all",
      isRss: true,
      analyticsId: feed._id,
      isTrending: idx < 5,
      isFeatured: idx === 0,
      companyName,
      salaryRange: jobSummary?.salaryRange || "$95,000 – $145,000 USD",
      employmentType: "Full-time",
      seniorityLevel: title.toLowerCase().includes("senior") ? "Senior" : "Mid",
      jobTags: feed.category === "jobs" ? ["100% Remote", "Verified Publisher"] : undefined,
      jobSummary,
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

export function normalizeNewsCategory(cat?: string): string {
  if (!cat) return "designNews";
  const c = cat.toLowerCase();
  if (c.includes("ai") || c.includes("machine learning") || c.includes("ml")) return "aiNews";
  if (c.includes("market") || c.includes("growth") || c.includes("brand")) return "marketingNews";
  if (c.includes("frontend") || c.includes("dev") || c.includes("code") || c.includes("react")) return "frontendNews";
  if (c.includes("motion") || c.includes("3d") || c.includes("animation")) return "motionNews";
  if (c.includes("design") || c.includes("ux") || c.includes("ui")) return "designNews";
  return "designNews";
}

export async function aggregateNewsFeeds(cmsNews: any[] = []): Promise<NormalizedResource[]> {
  const feedResults = await Promise.allSettled(
    NEWS_RSS_FEEDS.filter((f) => f.enabled !== false).map((feed) => fetchAndParseSingleFeed(feed))
  );

  const rssItems: NormalizedResource[] = [];
  feedResults.forEach((res) => {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      rssItems.push(...res.value);
    }
  });

  const mappedCms: NormalizedResource[] = (cmsNews || []).map((item) => {
    const slugStr = item.slug?.current || item.slug || item._id;
    const pubIso = parsePubDate(item.publishedAt || item._createdAt);
    const itemLink = item.sourceUrl || item.link || `https://www.rvan.me/news/${slugStr}`;
    const publisherName = item.sourceName || item.benefitSummary || "Rvan Studio";

    return {
      id: item._id,
      title: item.title,
      slug: slugStr,
      resourceType: "news",
      description: item.excerpt || item.title,
      benefitSummary: publisherName,
      link: itemLink,
      sourceName: publisherName,
      publishedAt: pubIso,
      formattedDate: formatPublicationTimestamp(pubIso),
      category: normalizeNewsCategory(item.category),
      country: "Global",
      workType: "na",
      isFree: true,
      imageUrl: item.coverImage ? urlFor(item.coverImage)?.url() : item.imageUrl || item.logoUrl,
      isRss: true,
      analyticsId: item._id,
      isTrending: true,
      isFeatured: true,
    };
  });

  const dedupedMap = new Map<string, NormalizedResource>();

  CURATED_NEWS_CATALOG.forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    dedupedMap.set(key, item);
  });

  mappedCms.forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    dedupedMap.set(key, item);
  });

  rssItems.forEach((item) => {
    const key = (item.title + item.link).toLowerCase();
    dedupedMap.set(key, item);
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
        companyName: item.benefitSummary,
        jobSummary: cat === "jobs" ? generateAIJobSummary(item.title, item.benefitSummary || "Curated Company", item.description || "") : undefined,
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

// ─────────────────────────────────────────────────────────────────────────────
// STALE-WHILE-REVALIDATE CACHING ENGINE FOR INSTANT PERCEIVED PERFORMANCE
// ─────────────────────────────────────────────────────────────────────────────

const NEWS_CACHE_KEY = "rvan_news_cache_v2";
const RESOURCE_CACHE_KEY = "rvan_resources_cache_v2";

export function getCachedNewsFeeds(): NormalizedResource[] {
  try {
    const cached = localStorage.getItem(NEWS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage issues
  }
  return CURATED_NEWS_CATALOG;
}

export function setCachedNewsFeeds(items: NormalizedResource[]) {
  try {
    if (Array.isArray(items) && items.length > 0) {
      localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(items.slice(0, 150)));
    }
  } catch (e) {
    // Storage quota fallback
  }
}

export function getCachedAllResources(): NormalizedResource[] {
  try {
    const cached = localStorage.getItem(RESOURCE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage issues
  }
  return CURATED_RESOURCE_CATALOG;
}

export function setCachedAllResources(items: NormalizedResource[]) {
  try {
    if (Array.isArray(items) && items.length > 0) {
      localStorage.setItem(RESOURCE_CACHE_KEY, JSON.stringify(items.slice(0, 150)));
    }
  } catch (e) {
    // Storage quota fallback
  }
}
