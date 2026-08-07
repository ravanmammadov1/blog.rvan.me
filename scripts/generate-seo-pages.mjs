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
    path: "/ravan-mammadov",
    title: "Ravan Mammadov — Motion, Brand & Graphic Designer in Baku",
    description: "Professional profile, experience, skills, and selected work of senior creative designer Ravan Mammadov in Baku, Azerbaijan.",
    type: "profile",
  },
  {
    path: "/resources",
    title: "Free Design Resources, Fonts & Creative Tools — Ravan Mammadov",
    description: "A curated directory of free fonts, design assets, creative tools, and useful resources for designers.",
    type: "website",
  },
  { path: "/privacy-policy", title: "Privacy Policy — Ravan Mammadov", description: "Privacy policy for the Ravan Mammadov portfolio and publication.", type: "website" },
  { path: "/cookie-policy", title: "Cookie Policy — Ravan Mammadov", description: "Cookie policy for the Ravan Mammadov portfolio and publication.", type: "website" },
  { path: "/terms", title: "Terms of Service — Ravan Mammadov", description: "Terms of service for the Ravan Mammadov portfolio and publication.", type: "website" },
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

const template = await fs.readFile(path.join(distRoot, "index.html"), "utf8");
const pages = [...staticPages, ...(await fetchDynamicPages())];

for (const page of pages) {
  const pageDirectory = page.path === "/" ? distRoot : path.join(distRoot, ...page.path.split("/").filter(Boolean));
  await fs.mkdir(pageDirectory, { recursive: true });
  await fs.writeFile(path.join(pageDirectory, "index.html"), applyPageMetadata(template, page), "utf8");
}

console.log(`Generated SEO-ready HTML for ${pages.length} routes.`);
