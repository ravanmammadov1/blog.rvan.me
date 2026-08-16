import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(projectRoot, "dist");
const domain = "https://www.rvan.me";
const todayIso = new Date().toISOString().split("T")[0];

const staticPages = [
  {
    path: "/",
    title: "Ravan Mammadov — Senior Creative Designer & Art Director",
    description: "Senior Creative Designer based in Baku, Azerbaijan, specializing in motion design, brand identity, graphic design, and performance creative.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/work",
    title: "Creative Portfolio — Motion, Brand & Graphic Design | Ravan Mammadov",
    description: "Explore selected motion design, brand identity, graphic design, and marketing creative case studies by Ravan Mammadov in Baku, Azerbaijan.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/contact",
    title: "Contact — Creative Design & Motion Projects | Ravan Mammadov",
    description: "Contact Ravan Mammadov in Baku, Azerbaijan for motion design, brand identity, graphic design, and digital campaign projects.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/blog",
    title: "Design & Motion Insights Blog — Ravan Mammadov",
    description: "Original insights about motion design, graphic design, brand identity, marketing creative, and creative technology.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/tools",
    title: "Designer Tools & Creative Stack — Ravan Mammadov",
    description: "A practical creative stack for motion designers, graphic designers, brand designers, and digital creatives.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/about",
    title: "About Rvan.me — Creative Ecosystem & Platform Vision",
    description: "Learn about Rvan.me, a curated creative ecosystem for designers, marketers and developers. Discover our mission, core pillars, and studio vision.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/ravan-mammadov",
    title: "Ravan Mammadov — Founder & Senior Creative Designer",
    description: "Professional profile, career timeline, brand experience, and selected creative portfolio of Senior Creative Designer Ravan Mammadov.",
    type: "profile",
    lastmod: todayIso,
  },
  {
    path: "/ravanmammadov",
    title: "Ravan Mammadov — Founder & Senior Creative Designer",
    description: "Professional profile, career timeline, brand experience, and selected creative portfolio of Senior Creative Designer Ravan Mammadov.",
    type: "profile",
    lastmod: todayIso,
  },
  {
    path: "/profile",
    title: "Ravan Mammadov — Founder & Senior Creative Designer",
    description: "Professional profile, career timeline, brand experience, and selected creative portfolio of Senior Creative Designer Ravan Mammadov.",
    type: "profile",
    lastmod: todayIso,
  },
  {
    path: "/resources",
    title: "Creative Resources — Open Source Fonts, Icons & Tools | Rvan.me",
    description: "Discover open-source font families, developer tools, vector assets, mockups, and UI kits for designers and developers.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/ai-tools",
    title: "AI Tools & Automation Directory — Ravan Mammadov",
    description: "Curated directory of high-utility AI generators, prompt systems, and design workflow automation tools.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/opportunities",
    title: "Remote Jobs, Scholarships & Contests — Ravan Mammadov",
    description: "Curated global remote design jobs, tech opportunities, academic scholarships, and creative competitions.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/tools/open-peeps",
    title: "Open Peeps Character Builder — Free Vector Avatar & Illustration Generator",
    description: "Create custom hand-drawn character illustrations with Open Peeps. Mix facial expressions, hairstyles, poses, clothing, and export clean SVG or high-res PNG.",
    type: "website",
    lastmod: todayIso,
  },
  {
    path: "/tools/grapesjs-web-builder",
    title: "GrapesJS Visual Web Builder — Free Online Drag & Drop HTML/CSS Editor",
    description: "Build responsive web pages and landing pages visually with GrapesJS. Drag components, edit typography, customize styles, and export clean HTML/CSS code.",
    type: "website",
    lastmod: todayIso,
  },
  { path: "/privacy-policy", title: "Privacy Policy — Ravan Mammadov", description: "Privacy policy and user data protections for the Ravan Mammadov portfolio and publication.", type: "website", lastmod: todayIso },
  { path: "/cookie-policy", title: "Cookie Policy — Ravan Mammadov", description: "Cookie policy and consent preferences for the Ravan Mammadov portfolio and publication.", type: "website", lastmod: todayIso },
  { path: "/terms", title: "Terms of Service — Ravan Mammadov", description: "Terms of service and intellectual property notice for the Ravan Mammadov portfolio and publication.", type: "website", lastmod: todayIso },
  { path: "/admin/linkedin", title: "LinkedIn Admin Control Panel — Rvan.me", description: "LinkedIn OAuth 2.0 and personal profile publishing admin control panel.", type: "website", lastmod: todayIso },

  { path: "/work/wuling-creative-campaign", title: "Wuling Creative Campaign — Motion Design Case Study | Ravan Mammadov", description: "Explore the Wuling creative campaign case study combining automotive art direction, motion design, and marketing campaign assets.", type: "website", lastmod: "2026-07-15" },
  { path: "/work/limitless-drive", title: "Limitless Drive — 3D Brand Identity Case Study | Ravan Mammadov", description: "Explore the Limitless Drive automotive brand identity and 3D design case study by Ravan Mammadov.", type: "website", lastmod: "2026-07-20" },
  { path: "/work/omoda-jaecoo", title: "Omoda & Jaecoo — Motion Design Case Study | Ravan Mammadov", description: "Explore the Omoda and Jaecoo creative suite and motion system case study by Ravan Mammadov.", type: "website", lastmod: "2026-07-25" },
];

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
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

function getSanityImageUrl(coverImage) {
  if (!coverImage) return `${domain}/og-image.jpg`;
  if (typeof coverImage === "string" && coverImage.startsWith("http")) return coverImage;
  const ref = coverImage?.asset?._ref || (typeof coverImage === "string" ? coverImage : null);
  if (!ref || !ref.startsWith("image-")) return `${domain}/og-image.jpg`;
  const parts = ref.split("-");
  if (parts.length >= 4) {
    const assetId = parts[1];
    const dimensions = parts[2];
    const extension = parts[3];
    return `https://cdn.sanity.io/images/0lqwkcmg/production/${assetId}-${dimensions}.${extension}?w=1200&auto=format`;
  }
  return `${domain}/og-image.jpg`;
}

function calculateWordCount(body, description) {
  if (Array.isArray(body)) {
    const text = body
      .filter((b) => b && b._type === "block" && Array.isArray(b.children))
      .flatMap((b) => b.children.map((c) => c?.text || ""))
      .join(" ");
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    if (count > 0) return count;
  }
  if (typeof body === "string" && body.trim()) {
    return body.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  }
  return (description || "").trim().split(/\s+/).filter(Boolean).length || 450;
}

function createGraph(page) {
  const canonical = canonicalFor(page.path);
  const isAz = page.path === "/az" || page.path.startsWith("/az/");
  const personId = `${domain}/#person`;
  const orgId = `${domain}/#organization`;
  const websiteId = `${domain}/#website`;

  const graph = [
    {
      "@type": "Person",
      "@id": personId,
      name: "Ravan Mammadov",
      jobTitle: "Senior Creative Designer & Art Director",
      url: `${domain}/ravan-mammadov`,
      image: `${domain}/og-image.jpg`,
      description: "Senior Creative Designer based in Baku, Azerbaijan, specializing in motion design, brand identity, graphic design, and performance creative.",
      knowsAbout: [
        "Motion Design",
        "Art Direction",
        "Brand Identity",
        "UI/UX Design",
        "Creative Strategy",
        "3D Product Visualization"
      ],
      worksFor: {
        "@id": orgId
      },
      sameAs: [
        "https://www.behance.net/mammadovravan",
        "https://www.linkedin.com/in/ravanmammadov1/",
        "https://www.instagram.com/ravanimate/",
        "https://github.com/ravanmammadov1",
      ],
    },
    {
      "@type": "Organization",
      "@id": orgId,
      name: "Rvan.me",
      url: `${domain}`,
      logo: {
        "@type": "ImageObject",
        url: `${domain}/favicon.svg`,
      },
      founder: { "@id": personId },
      sameAs: [
        "https://www.linkedin.com/in/ravanmammadov1/",
        "https://www.instagram.com/ravanimate/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: "Rvan.me — Creative Studio & Ecosystem",
      url: `${domain}/`,
      inLanguage: isAz ? "az-AZ" : "en-US",
      publisher: { "@id": orgId },
    },
    {
      "@type": page.type === "profile" ? "ProfilePage" : "WebPage",
      "@id": `${canonical}#webpage`,
      name: page.title,
      description: page.description,
      url: canonical,
      inLanguage: isAz ? "az-AZ" : "en-US",
      isPartOf: { "@id": websiteId },
      about: { "@id": personId },
    },
  ];

  if (page.path !== "/" && page.path !== "/az" && page.path !== "/ravan-mammadov") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isAz ? "Ana Səhifə" : "Home", item: `${domain}${isAz ? "/az" : "/"}` },
        { "@type": "ListItem", position: 2, name: page.title.split(" — ")[0].split(" | ")[0], item: canonical },
      ],
    });
  }

  if (page.type === "article") {
    const imageUrl = getSanityImageUrl(page.coverImage);
    const wordCount = calculateWordCount(page.body, page.description);
    const pubDate = page.publishDate || page.publishedAt || "2026-07-01";
    const modDate = page.modifiedDate || page.publishDate || page.publishedAt || "2026-08-16";

    graph.push({
      "@type": page.schemaType || "BlogPosting",
      "@id": `${canonical}#article`,
      headline: page.title,
      description: page.description,
      url: canonical,
      image: imageUrl,
      datePublished: pubDate,
      dateModified: modDate,
      wordCount: wordCount,
      inLanguage: isAz ? "az-AZ" : "en-US",
      mainEntityOfPage: { "@id": `${canonical}#webpage` },
      author: {
        "@type": "Person",
        name: "Ravan Mammadov",
        url: `${domain}/ravan-mammadov`,
        sameAs: [
          "https://www.linkedin.com/in/ravanmammadov1/",
          "https://www.behance.net/mammadovravan",
        ],
      },
      publisher: {
        "@type": "Organization",
        name: "Rvan.me",
        url: `${domain}`,
        logo: {
          "@type": "ImageObject",
          url: `${domain}/favicon.svg`,
        },
      },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function getHreflangTags(pagePath) {
  const isAz = pagePath === "/az" || pagePath.startsWith("/az/");
  const cleanPath = isAz ? pagePath.replace(/^\/az/, "") || "/" : pagePath;
  const enUrl = `${domain}${cleanPath === "/" ? "/" : cleanPath.replace(/\/+$/, "")}`;
  const azUrl = `${domain}${cleanPath === "/" ? "/az" : `/az${cleanPath.replace(/\/+$/, "")}`}`;

  return [
    `<link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `<link rel="alternate" hreflang="az" href="${azUrl}" />`,
    `<link rel="alternate" hreflang="x-default" href="${enUrl}" />`,
  ].join("\n    ");
}

function applyPageMetadata(html, page) {
  const canonical = canonicalFor(page.path);
  const hreflangs = getHreflangTags(page.path);
  const imageUrl = getSanityImageUrl(page.coverImage);

  const replacements = [
    [/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`],
    [/name="description" content="[^"]*"/i, `name="description" content="${escapeHtml(page.description)}"`],
    [/property="og:url" content="[^"]*"/i, `property="og:url" content="${canonical}"`],
    [/property="og:title" content="[^"]*"/i, `property="og:title" content="${escapeHtml(page.title)}"`],
    [/property="og:description" content="[^"]*"/i, `property="og:description" content="${escapeHtml(page.description)}"`],
    [/property="og:image" content="[^"]*"/i, `property="og:image" content="${imageUrl}"`],
    [/name="twitter:url" content="[^"]*"/i, `name="twitter:url" content="${canonical}"`],
    [/name="twitter:title" content="[^"]*"/i, `name="twitter:title" content="${escapeHtml(page.title)}"`],
    [/name="twitter:description" content="[^"]*"/i, `name="twitter:description" content="${escapeHtml(page.description)}"`],
    [/name="twitter:image" content="[^"]*"/i, `name="twitter:image" content="${imageUrl}"`],
    [/link rel="canonical" href="[^"]*"/i, `link rel="canonical" href="${canonical}"`],
  ];

  let output = html;
  for (const [pattern, replacement] of replacements) output = output.replace(pattern, replacement);

  // Inject hreflang alternate tags right after canonical tag
  if (!output.includes('hreflang="az"')) {
    output = output.replace(
      `<link rel="canonical" href="${canonical}" />`,
      `<link rel="canonical" href="${canonical}" />\n    ${hreflangs}`
    );
  }

  const schema = `<script id="seo-json-ld" type="application/ld+json">${escapeJson(createGraph(page))}</script>`;
  output = output.replace(/<script id="seo-json-ld" type="application\/ld\+json">[\s\S]*?<\/script>/i, schema);
  return output;
}

async function fetchDynamicPages() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg";
  const dataset = process.env.VITE_SANITY_DATASET || "production";
  const query = `*[defined(slug.current) && (( _type == "blog" && (status == "published" || !defined(status)) && (!defined(publishDate) || publishDate <= now())) || (_type == "news" && (status == "published" || !defined(status)) && defined(publishedAt) && publishedAt <= now()) || (_type == "projects" && (status == "published" || !defined(status))) || (_type == "resource" && status == "published"))]{
    _type,
    "slug": slug.current,
    "slug_az": slug_az.current,
    title,
    title_az,
    excerpt,
    excerpt_az,
    description,
    description_az,
    type,
    type_az,
    publishDate,
    publishedAt,
    _updatedAt,
    coverImage,
    body,
    body_az
  }`;
  const endpoint = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return { enPages: [], azPages: [] };
    const payload = await response.json();
    const enPages = [];
    const azPages = [];

    for (const item of (payload.result || [])) {
      const type = item._type;
      const prefix = type === "blog" ? "/blog" : type === "news" ? "/news" : type === "projects" ? "/work" : "/resources";
      const lastmodDate = (item._updatedAt || item.publishDate || item.publishedAt || todayIso).split("T")[0];

      // EN Page
      enPages.push({
        path: `${prefix}/${item.slug}`,
        title: `${item.title || "Creative resource"} — Ravan Mammadov`,
        description: item.excerpt || item.description || `Explore ${item.title || "this resource"} by Senior Creative Designer Ravan Mammadov.`,
        type: type === "blog" || type === "news" ? "article" : "website",
        schemaType: type === "news" ? "NewsArticle" : "BlogPosting",
        publishDate: item.publishDate || item.publishedAt,
        modifiedDate: item._updatedAt ? item._updatedAt.split("T")[0] : undefined,
        coverImage: item.coverImage,
        body: item.body,
        lastmod: lastmodDate,
      });

      // AZ Page (Localized)
      const azTitle = item.title_az || item.title || "Yaradıcı resurs";
      const azDesc = item.excerpt_az || item.description_az || item.excerpt || item.description || `${azTitle} haqqında ətraflı oxuyun.`;
      const azSlug = item.slug_az || item.slug;

      azPages.push({
        path: `/az${prefix}/${azSlug}`,
        title: `${azTitle} — Rəvan Məmmədov`,
        description: azDesc,
        type: type === "blog" || type === "news" ? "article" : "website",
        schemaType: type === "news" ? "NewsArticle" : "BlogPosting",
        publishDate: item.publishDate || item.publishedAt,
        modifiedDate: item._updatedAt ? item._updatedAt.split("T")[0] : undefined,
        coverImage: item.coverImage,
        body: item.body_az || item.body,
        lastmod: lastmodDate,
      });

      // If AZ slug is different from EN slug, also generate the /az/blog/original-slug route as alias
      if (item.slug_az && item.slug_az !== item.slug) {
        azPages.push({
          path: `/az${prefix}/${item.slug}`,
          title: `${azTitle} — Rəvan Məmmədov`,
          description: azDesc,
          type: type === "blog" || type === "news" ? "article" : "website",
          schemaType: type === "news" ? "NewsArticle" : "BlogPosting",
          publishDate: item.publishDate || item.publishedAt,
          modifiedDate: item._updatedAt ? item._updatedAt.split("T")[0] : undefined,
          coverImage: item.coverImage,
          body: item.body_az || item.body,
          lastmod: lastmodDate,
        });
      }
    }

    return { enPages, azPages };
  } catch (error) {
    console.warn("SEO prerender skipped dynamic CMS pages:", error?.message || error);
    return { enPages: [], azPages: [] };
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
        lastmod: "2026-08-01",
      };
    });
  } catch (error) {
    console.warn("SEO prerender skipped font pages:", error?.message || error);
    return [];
  }
}

const staticAzTranslations = {
  "/": {
    title: "Rəvan Məmmədov — Kreativ Dizayner & Art Direktor | Rvan.me",
    description: "Bakıda fəaliyyət göstərən aparıcı kreativ dizayner: motion dizayn, brend kimliyi, qrafik dizayn və performans kreativləri.",
  },
  "/work": {
    title: "Kreativ Portfolio — Motion, Brendinq və Qrafik Dizayn | Rəvan Məmmədov",
    description: "Rəvan Məmmədovun seçilmiş motion dizayn, brend şəxsiyyəti və qrafik dizayn layihələri ilə tanış olun.",
  },
  "/contact": {
    title: "Əlaqə — Kreativ Dizayn və Motion Layihələri | Rəvan Məmmədov",
    description: "Motion dizayn, brend identikliyi və rəqəmsal kampaniya layihələri üçün Rəvan Məmmədov ilə əlaqə saxlayın.",
  },
  "/blog": {
    title: "Dizayn, Motion və AI Məqalələri — Rəvan Məmmədov Bloq",
    description: "Motion dizayn, qrafik dizayn, brend strategiyası və süni intellekt alətləri haqqında dərin analitik məqalələr.",
  },
  "/tools": {
    title: "Dizayner Alətləri və Kreativ Dəst — Rəvan Məmmədov",
    description: "Motion dizaynerlər, qrafik dizaynerlər və developerlər üçün brauzerdaxili praktik dizayn və CSS alətləri.",
  },
  "/about": {
    title: "Haqqında — Rvan.me Rəqəmsal Ekosistem və Missiya",
    description: "Dizaynerlər, marketoloqlar və developerlər üçün qurulmuş vahid yaradıcı ekosistem və studiya vizyonu.",
  },
  "/ravan-mammadov": {
    title: "Rəvan Məmmədov — Kreativ Direktor & CV Portfeli",
    description: "Aparıcı kreativ dizayner Rəvan Məmmədovun peşəkar təcrübəsi, karyera xronologiyası və brend layihələri.",
  },
  "/ravanmammadov": {
    title: "Rəvan Məmmədov — Kreativ Direktor & CV Portfeli",
    description: "Aparıcı kreativ dizayner Rəvan Məmmədovun peşəkar təcrübəsi, karyera xronologiyası və brend layihələri.",
  },
  "/profile": {
    title: "Rəvan Məmmədov — Kreativ Direktor & CV Portfeli",
    description: "Aparıcı kreativ dizayner Rəvan Məmmədovun peşəkar təcrübəsi, karyera xronologiyası və brend layihələri.",
  },
  "/resources": {
    title: "Kreativ Resurslar — Açıq Mənbəli Şriftlər, İkonlar və Alətlər | Rvan.me",
    description: "Dizaynerlər və proqramçılar üçün açıq mənbəli şrift ailələri, vektor aktivləri və UI dəstləri.",
  },
  "/tools/grapesjs-web-builder": {
    title: "GrapesJS Veb Quraşdırıcı — Pulsuz Onlayn Drag & Drop HTML/CSS Redaktoru",
    description: "GrapesJS ilə vizual olaraq responsiv veb səhifələr və açılış səhifələri qurun. Blokları sürükləyin, üslubları redaktə edin və təmiz kod ixrac edin.",
  },
};

const template = await fs.readFile(path.join(distRoot, "index.html"), "utf8");
const fontPages = await fetchFontPages();
const { enPages: dynamicEnPages, azPages: dynamicAzPages } = await fetchDynamicPages();

const staticAzPages = staticPages.map((p) => {
  const azMeta = staticAzTranslations[p.path] || {
    title: `${p.title} — Rvan.me (AZ)`,
    description: p.description,
  };
  return {
    ...p,
    path: p.path === "/" ? "/az" : `/az${p.path}`,
    title: azMeta.title,
    description: azMeta.description,
  };
});

const fontAzPages = fontPages.map((p) => ({
  ...p,
  path: `/az${p.path}`,
  title: `${p.title} — Rvan.me (AZ)`,
}));

const allPages = [
  ...staticPages,
  ...staticAzPages,
  ...dynamicEnPages,
  ...dynamicAzPages,
  ...fontPages,
  ...fontAzPages,
];

for (const page of allPages) {
  const pageDirectory = page.path === "/" ? distRoot : path.join(distRoot, ...page.path.split("/").filter(Boolean));
  await fs.mkdir(pageDirectory, { recursive: true });
  await fs.writeFile(path.join(pageDirectory, "index.html"), applyPageMetadata(template, page), "utf8");
}

console.log(`Generated SEO-ready HTML for ${allPages.length} routes (EN + AZ).`);

// Generate dist/sitemap.xml with <lastmod> and xhtml:link hreflangs
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages
  .map((p) => {
    const isAz = p.path === "/az" || p.path.startsWith("/az/");
    const cleanPath = isAz ? p.path.replace(/^\/az/, "") || "/" : p.path;
    const url = `${domain}${p.path === "/" ? "/" : p.path.replace(/\/+$/, "")}`;
    const enUrl = `${domain}${cleanPath === "/" ? "/" : cleanPath.replace(/\/+$/, "")}`;
    const azUrl = `${domain}${cleanPath === "/" ? "/az" : `/az${cleanPath.replace(/\/+$/, "")}`}`;
    const lastmod = p.lastmod || todayIso;
    const priority = p.path === "/" || p.path === "/az" ? "1.0" : p.path.startsWith("/blog") || p.path.startsWith("/work") ? "0.9" : p.path.includes("/fonts/") ? "0.7" : "0.8";
    const changefreq = p.path.startsWith("/blog") || p.path.startsWith("/news") ? "daily" : "weekly";

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="az" href="${azUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
  </url>`;
  })
  .join("\n")}
</urlset>`;

await fs.writeFile(path.join(distRoot, "sitemap.xml"), sitemapXml.trim(), "utf8");
console.log(`Generated sitemap.xml with ${allPages.length} URLs (including lastmod and hreflang tags).`);
