import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(projectRoot, "dist");
const domain = "https://www.rvan.me";

const staticPages = [
  {
    path: "/",
    title: "Ravan Mammadov — Senior Creative Designer & Art Director",
    description: "Senior Creative Designer based in Baku, Azerbaijan, specializing in motion design, brand identity, graphic design, and performance creative.",
    type: "website",
  },
  {
    path: "/work",
    title: "Creative Portfolio — Motion, Brand & Graphic Design | Ravan Mammadov",
    description: "Explore selected motion design, brand identity, graphic design, and marketing creative case studies by Ravan Mammadov in Baku, Azerbaijan.",
    type: "website",
  },
  {
    path: "/contact",
    title: "Contact — Creative Design & Motion Projects | Ravan Mammadov",
    description: "Contact Ravan Mammadov in Baku, Azerbaijan for motion design, brand identity, graphic design, and digital campaign projects.",
    type: "website",
  },
  {
    path: "/blog",
    title: "Design & Motion Insights Blog — Ravan Mammadov",
    description: "Original insights about motion design, graphic design, brand identity, marketing creative, and creative technology.",
    type: "website",
  },
  {
    path: "/news",
    title: "Creative Industry News & Design Insights — Ravan Mammadov",
    description: "Curated creative industry, design, technology, and marketing news with original editorial context.",
    type: "website",
  },
  {
    path: "/tools",
    title: "Designer Tools & Creative Stack — Ravan Mammadov",
    description: "A practical creative stack for motion designers, graphic designers, brand designers, and digital creatives.",
    type: "website",
  },
  {
    path: "/about",
    title: "About Rvan.me — Creative Ecosystem & Platform Vision",
    description: "Learn about Rvan.me, a curated creative ecosystem for designers, marketers and developers. Discover our mission, core pillars, and studio vision.",
    type: "website",
  },
  {
    path: "/profile",
    title: "Ravan Mammadov — Founder & Senior Creative Designer",
    description: "Professional profile, career timeline, brand experience, and selected creative portfolio of Senior Creative Designer Ravan Mammadov.",
    type: "profile",
  },


  {
    path: "/resources",
    title: "Creative Resources — Rvan.me",
    description: "Discover open-source font families, developer tools, vector assets, mockups, and UI kits.",
    type: "website",
  },

  {
    path: "/ai-tools",
    title: "AI Tools & Automation Directory — Ravan Mammadov",
    description: "Curated directory of high-utility AI generators, prompt systems, and design workflow automation tools.",
    type: "website",
  },
  {
    path: "/opportunities",
    title: "Remote Jobs, Scholarships & Contests — Ravan Mammadov",
    description: "Curated global remote design jobs, tech opportunities, academic scholarships, and creative competitions.",
    type: "website",
  },
  {
    path: "/tools/css-grid-generator",
    title: "Free Visual CSS Grid Generator — Online Layout Builder",
    description: "Create responsive CSS Grid layouts visually. Adjust columns, rows, gaps, and export clean CSS grid template code instantly.",
    type: "website",
  },
  {
    path: "/tools/svg-wave-generator",
    title: "Free Gradient SVG Wave Generator — Customizable Wave Dividers",
    description: "Generate smooth SVG wave dividers for website heroes and section breaks with customizable colors, gradients, and curve complexity.",
    type: "website",
  },
  {
    path: "/tools/fluid-typography-generator",
    title: "Fluid Typography clamp() Generator — Responsive CSS Type Scale",
    description: "Calculate smooth fluid typography using CSS clamp(). Input min/max font sizes and viewports for responsive type scaling without media queries.",
    type: "website",
  },
  {
    path: "/tools/box-shadow-generator",
    title: "Smooth Multi-Layer Box-Shadow Generator — Realistic Elevation CSS",
    description: "Generate layered, realistic CSS box shadows for cards and modals with smooth opacity falloff, blur radius, and offset control.",
    type: "website",
  },
  {
    path: "/tools/color-converter-palette",
    title: "Color Converter & WCAG Contrast Checker — HEX, RGB, HSL",
    description: "Convert HEX, RGB, and HSL colors instantly while checking WCAG 2.1 AA and AAA contrast compliance for text and UI elements.",
    type: "website",
  },
  {
    path: "/tools/seo-meta-generator",
    title: "SEO Meta Tag Generator — OpenGraph & Twitter Card Preview",
    description: "Generate production-ready HTML SEO meta tags, OpenGraph protocol tags, and Twitter Cards with real-time Google search snippet previews.",
    type: "website",
  },
  { path: "/privacy-policy", title: "Privacy Policy — Ravan Mammadov", description: "Privacy policy for the Ravan Mammadov portfolio and publication.", type: "website" },
  { path: "/cookie-policy", title: "Cookie Policy — Ravan Mammadov", description: "Cookie policy for the Ravan Mammadov portfolio and publication.", type: "website" },
  { path: "/terms", title: "Terms of Service — Ravan Mammadov", description: "Terms of service for the Ravan Mammadov portfolio and publication.", type: "website" },
  { path: "/admin/linkedin", title: "LinkedIn Admin Control Panel — Rvan.me", description: "LinkedIn OAuth 2.0 and personal profile publishing admin control panel.", type: "website" },

  { path: "/work/wuling-creative-campaign", title: "Wuling Creative Campaign — Motion Design Case Study | Ravan Mammadov", description: "Explore the Wuling creative campaign case study combining automotive art direction, motion design, and marketing campaign assets.", type: "website" },
  { path: "/work/limitless-drive", title: "Limitless Drive — 3D Brand Identity Case Study | Ravan Mammadov", description: "Explore the Limitless Drive automotive brand identity and 3D design case study by Ravan Mammadov.", type: "website" },
  { path: "/work/omoda-jaecoo", title: "Omoda & Jaecoo — Motion Design Case Study | Ravan Mammadov", description: "Explore the Omoda and Jaecoo creative suite and motion system case study by Ravan Mammadov.", type: "website" },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function canonicalFor(routePath) {
  return `${domain}${routePath === "/" ? "/" : routePath.replace(/\/+$/, "")}`;
}

function createGraph(page) {
  const canonical = canonicalFor(page.path);
  const personId = `${domain}/#person`;
  const websiteId = `${domain}/#website`;
  const graph = [
    {
      "@type": "Person",
      "@id": personId,
      name: "Ravan Mammadov",
      jobTitle: "Senior Creative Designer & Art Director",
      url: `${domain}/ravan-mammadov`,
      image: `${domain}/og-image.jpg`,
      sameAs: [
        "https://www.behance.net/mammadovravan",
        "https://www.linkedin.com/in/ravanmammadov1/",
        "https://www.instagram.com/ravanimate/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: "Ravan Mammadov Portfolio",
      url: `${domain}/`,
      publisher: { "@id": personId },
    },
    {
      "@type": page.type === "profile" ? "ProfilePage" : "WebPage",
      "@id": `${canonical}#webpage`,
      name: page.title,
      description: page.description,
      url: canonical,
      isPartOf: { "@id": websiteId },
      about: { "@id": personId },
    },
  ];

  if (page.path !== "/" && page.path !== "/ravan-mammadov") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${domain}/` },
        { "@type": "ListItem", position: 2, name: page.title.split(" — ")[0], item: canonical },
      ],
    });
  }

  if (page.type === "article") {
    graph.push({
      "@type": page.schemaType || "BlogPosting",
      "@id": `${canonical}#article`,
      headline: page.title,
      description: page.description,
      url: canonical,
      mainEntityOfPage: { "@id": `${canonical}#webpage` },
      author: { "@id": personId },
      publisher: { "@id": personId },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function applyPageMetadata(html, page) {
  const canonical = canonicalFor(page.path);
  const replacements = [
    [/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`],
    [/name="description" content="[^"]*"/i, `name="description" content="${escapeHtml(page.description)}"`],
    [/property="og:url" content="[^"]*"/i, `property="og:url" content="${canonical}"`],
    [/property="og:title" content="[^"]*"/i, `property="og:title" content="${escapeHtml(page.title)}"`],
    [/property="og:description" content="[^"]*"/i, `property="og:description" content="${escapeHtml(page.description)}"`],
    [/name="twitter:url" content="[^"]*"/i, `name="twitter:url" content="${canonical}"`],
    [/name="twitter:title" content="[^"]*"/i, `name="twitter:title" content="${escapeHtml(page.title)}"`],
    [/name="twitter:description" content="[^"]*"/i, `name="twitter:description" content="${escapeHtml(page.description)}"`],
    [/link rel="canonical" href="[^"]*"/i, `link rel="canonical" href="${canonical}"`],
  ];

  let output = html;
  for (const [pattern, replacement] of replacements) output = output.replace(pattern, replacement);

  const schema = `<script id="seo-json-ld" type="application/ld+json">${escapeJson(createGraph(page))}</script>`;
  output = output.replace(/<script id="seo-json-ld" type="application\/ld\+json">[\s\S]*?<\/script>/i, schema);
  return output;
}

async function fetchDynamicPages() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg";
  const dataset = process.env.VITE_SANITY_DATASET || "production";
  const query = `*[defined(slug.current) && (( _type == "blog" && (status == "published" || !defined(status)) && (!defined(publishDate) || publishDate <= now())) || (_type == "news" && (status == "published" || !defined(status)) && defined(publishedAt) && publishedAt <= now()) || (_type == "projects" && (status == "published" || !defined(status))) || (_type == "resource" && status == "published"))]{_type,"slug":slug.current,title,excerpt,description,publishDate,publishedAt}`;
  const endpoint = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return [];
    const payload = await response.json();
    return (payload.result || []).map((item) => {
      const type = item._type;
      const prefix = type === "blog" ? "/blog" : type === "news" ? "/news" : type === "projects" ? "/work" : "/resources";
      return {
        path: `${prefix}/${item.slug}`,
        title: `${item.title || "Creative resource"} — Ravan Mammadov`,
        description: item.excerpt || item.description || `Explore ${item.title || "this page"} from Ravan Mammadov.`,
        type: type === "blog" || type === "news" ? "article" : "website",
        schemaType: type === "news" ? "NewsArticle" : "BlogPosting",
      };
    });
  } catch (error) {
    console.warn("SEO prerender skipped dynamic CMS pages:", error?.message || error);
    return [];
  }
}

async function fetchFontPages() {
  try {
    const catalogPath = path.join(projectRoot, "src", "lib", "googleFontsCatalog.json");
    const raw = await fs.readFile(catalogPath, "utf8");
    const catalog = JSON.parse(raw);
    return catalog.map((font) => {
      const slug = font.family
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return {
        path: `/fonts/${slug}`,
        title: `${font.family} Font Family — Free Download & Specimen | Rvan.me`,
        description: font.description || `${font.family} is a ${font.category?.toLowerCase() || "typography"} typeface family designed by ${font.designer || "Open Source Foundry"}. Explore live specimen previews, styles, license details, and free download.`,
        type: "website",
      };
    });
  } catch (error) {
    console.warn("SEO prerender skipped font pages:", error?.message || error);
    return [];
  }
}

const template = await fs.readFile(path.join(distRoot, "index.html"), "utf8");
const fontPages = await fetchFontPages();
const cmsPages = await fetchDynamicPages();

const curatedNewsPages = [
  "designing-for-spatial-computing-visionos",
  "state-of-ux-2026-ai-copilots",
  "design-acme",
  "figma-variables-2-token-studio-guide",
  "google-deepmind-gemini-robotics-er2",
  "openai-acquires-nextslide-ai-presentation",
  "what-star-trek-got-wrong-about-ai-so-far",
  "hugging-face-agent-canvas-open-source",
  "vercel-ai-gateway-hermes-agent",
  "react-19-compiler-deep-dive",
  "css-baseline-2026-container-queries-subgrid",
  "noir-qatsi-studio-motion-breakdown",
  "blender-4-2-lts-eevee-next-gpu-raytracing",
  "rive-runtime-2026-interactive-vector-animation",
  "ideally-research-creative-process",
  "death-of-generic-performance-ads-creative-strategy",
  "hyper-personalized-video-campaigns-brand-identity"
].map((slug) => ({
  path: `/news/${slug}`,
  title: `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} — Industry News | Rvan.me`,
  description: `Read editorial breakdown and key insights for ${slug} on Rvan.me Industry News.`,
  type: "article",
  schemaType: "NewsArticle",
}));

const pages = [...staticPages, ...cmsPages, ...curatedNewsPages, ...fontPages];
const azPages = pages.map((p) => ({
  ...p,
  path: p.path === "/" ? "/az" : `/az${p.path}`,
  title: `${p.title} — Rvan.me (AZ)`,
}));

const allPages = [...pages, ...azPages];

for (const page of allPages) {
  const pageDirectory = page.path === "/" ? distRoot : path.join(distRoot, ...page.path.split("/").filter(Boolean));
  await fs.mkdir(pageDirectory, { recursive: true });
  await fs.writeFile(path.join(pageDirectory, "index.html"), applyPageMetadata(template, page), "utf8");
}

console.log(`Generated SEO-ready HTML for ${allPages.length} routes (EN + AZ).`);

// Generate dist/sitemap.xml automatically
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((p) => {
    const url = `${domain}${p.path === "/" ? "/" : p.path.replace(/\/+$/, "")}`;
    return `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p.path === "/" || p.path === "/az" ? "1.0" : p.path.includes("/fonts/") ? "0.7" : "0.8"}</priority>\n  </url>`;
  })
  .join("\n")}
</urlset>`;

await fs.writeFile(path.join(distRoot, "sitemap.xml"), sitemapXml.trim(), "utf8");
console.log(`Generated sitemap.xml with ${allPages.length} URLs.`);

