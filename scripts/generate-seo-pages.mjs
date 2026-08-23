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
      name: isAz ? "Rəvan Məmmədov" : "Ravan Mammadov",
      alternateName: [
        "Rəvan Məmmədov",
        "Ravan Mammadov",
        "Ravan Mammadov Studio",
        "Rəvan Məmmədov Dizayner",
        "ravanimate",
      ],
      jobTitle: isAz ? "Aparıcı Kreativ Dizayner və Art Direktor" : "Senior Creative Designer & Art Director",
      url: `${domain}/ravan-mammadov`,
      image: {
        "@type": "ImageObject",
        "@id": `${domain}/#portrait`,
        url: `${domain}/og-image.jpg`,
        caption: "Rəvan Məmmədov (Ravan Mammadov) — Senior Creative Designer & Art Director",
        representativeOfPage: true,
      },
      description: isAz
        ? "Bakı, Azərbaycan mərkəzli aparıcı kreativ dizayner Rəvan Məmmədov: brend kimliyi, motion qrafika, art direksiya və marketinq kreativləri."
        : "Senior Creative Designer based in Baku, Azerbaijan, specializing in motion design, brand identity, graphic design, and performance creative.",
      knowsAbout: [
        "Motion Design",
        "Art Direction",
        "Brand Identity",
        "UI/UX Design",
        "Creative Strategy",
        "3D Product Visualization",
      ],
      worksFor: {
        "@id": orgId,
      },
      sameAs: [
        "https://www.behance.net/mammadovravan",
        "https://www.linkedin.com/in/ravanmammadov1/",
        "https://www.instagram.com/ravanimate/",
        "https://github.com/ravanmammadov1",
        "https://twitter.com/ravanimate",
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
      mainEntity: { "@id": personId },
    },
  ];

  if (page.path !== "/" && page.path !== "/az" && page.path !== "/ravan-mammadov" && page.path !== "/az/ravan-mammadov") {
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

let globalSiteFaviconUrl = null;
let globalSiteOgImageUrl = null;

function applyPageMetadata(html, page) {
  const canonical = canonicalFor(page.path);
  const hreflangs = getHreflangTags(page.path);
  const imageUrl = getSanityImageUrl(page.coverImage) || globalSiteOgImageUrl || `${domain}/og-image.jpg`;
  const robotsDirective = page.noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const replacements = [
    [/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`],
    [/name="description" content="[^"]*"/i, `name="description" content="${escapeHtml(page.description)}"`],
    [/name="robots" content="[^"]*"/i, `name="robots" content="${robotsDirective}"`],
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

  // If a live Sanity favicon exists, inject it into the HTML head
  if (globalSiteFaviconUrl) {
    output = output.replace(
      /<link rel="icon"[^>]*href="\/favicon\.(ico|svg)"[^>]*>/gi,
      `<link rel="icon" href="${globalSiteFaviconUrl}" />`
    );
  }

  // Inject hreflang alternate tags right after canonical tag (for indexable pages)
  if (!page.noindex && !output.includes('hreflang="az"')) {
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

  // Fetch live Site Settings (Favicon, OG Image) from Sanity
  try {
    const sQuery = `*[_type == "siteSettings"][0]{ favicon, "ogImage": seo.ogImage }`;
    const sEndpoint = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(sQuery)}`;
    const sResp = await fetch(sEndpoint, { signal: AbortSignal.timeout(10000) });
    if (sResp.ok) {
      const sJson = await sResp.json();
      if (sJson.result?.favicon) {
        globalSiteFaviconUrl = getSanityImageUrl(sJson.result.favicon);
      }
      if (sJson.result?.ogImage) {
        globalSiteOgImageUrl = getSanityImageUrl(sJson.result.ogImage);
      }
    }
  } catch (e) {
    console.warn("Could not fetch live Sanity siteSettings during prerender:", e?.message || e);
  }

  const query = `*[defined(slug.current) && (( _type == "blog" && (status == "published" || !defined(status)) && (!defined(publishDate) || publishDate <= now())) || (_type == "projects" && (status == "published" || !defined(status))) || (_type == "resource" && status == "published"))]{
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
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) return { enPages: [], azPages: [] };
    const payload = await response.json();
    const enPages = [];
    const azPages = [];

    for (const item of (payload.result || [])) {
      const type = item._type;
      const prefix = type === "blog" ? "/blog" : type === "projects" ? "/work" : "/resources";
      const lastmodDate = (item._updatedAt || item.publishDate || item.publishedAt || todayIso).split("T")[0];

      // EN Page
      enPages.push({
        path: `${prefix}/${item.slug}`,
        title: `${item.title || "Creative resource"} — Ravan Mammadov`,
        description: item.excerpt || item.description || `Explore ${item.title || "this resource"} by Senior Creative Designer Ravan Mammadov.`,
        type: type === "blog" ? "article" : "website",
        schemaType: "BlogPosting",
        publishDate: item.publishDate || item.publishedAt,
        modifiedDate: item._updatedAt ? item._updatedAt.split("T")[0] : undefined,
        coverImage: item.coverImage,
        body: item.body,
        lastmod: lastmodDate,
        noindex: false,
      });

      // AZ Page (Localized)
      const azTitle = item.title_az || item.title || "Yaradıcı resurs";
      const azDesc = item.excerpt_az || item.description_az || item.excerpt || item.description || `${azTitle} haqqında ətraflı oxuyun.`;
      const azSlug = item.slug_az || item.slug;

      azPages.push({
        path: `/az${prefix}/${azSlug}`,
        title: `${azTitle} — Rəvan Məmmədov`,
        description: azDesc,
        type: type === "blog" ? "article" : "website",
        schemaType: "BlogPosting",
        publishDate: item.publishDate || item.publishedAt,
        modifiedDate: item._updatedAt ? item._updatedAt.split("T")[0] : undefined,
        coverImage: item.coverImage,
        body: item.body_az || item.body,
        lastmod: lastmodDate,
        noindex: false,
      });

      // If AZ slug is different from EN slug, also generate the /az/blog/original-slug route as alias
      if (item.slug_az && item.slug_az !== item.slug) {
        azPages.push({
          path: `/az${prefix}/${item.slug}`,
          title: `${azTitle} — Rəvan Məmmədov`,
          description: azDesc,
          type: type === "blog" ? "article" : "website",
          schemaType: "BlogPosting",
          publishDate: item.publishDate || item.publishedAt,
          modifiedDate: item._updatedAt ? item._updatedAt.split("T")[0] : undefined,
          coverImage: item.coverImage,
          body: item.body_az || item.body,
          lastmod: lastmodDate,
          noindex: false,
        });
      }
    }

    return { enPages, azPages };
  } catch (error) {
    console.warn("SEO prerender dynamic CMS fetch fallback:", error?.message || error);
    const enPages = [];
    const azPages = [];
    try {
      const blogsDir = path.join(projectRoot, "src", "lib", "blogs");
      const files = await fs.readdir(blogsDir);
      for (const file of files) {
        if (!file.endsWith(".ts")) continue;
        const content = await fs.readFile(path.join(blogsDir, file), "utf8");
        const blogBlocks = content.split(/{\s*_id:\s*"/);
        for (let i = 1; i < blogBlocks.length; i++) {
          const b = blogBlocks[i];
          const title = (b.match(/title:\s*"([^"]+)"/) || [])[1];
          const title_az = (b.match(/title_az:\s*"([^"]+)"/) || [])[1];
          const slug = (b.match(/current:\s*"([^"]+)"/) || [])[1];
          const slug_azMatch = b.match(/slug_az:\s*\{\s*_type:\s*"slug",\s*current:\s*"([^"]+)"\s*\}/);
          const slug_az = slug_azMatch ? slug_azMatch[1] : slug;
          const excerpt = (b.match(/excerpt:\s*"([^"]+)"/) || [])[1];
          const excerpt_az = (b.match(/excerpt_az:\s*"([^"]+)"/) || [])[1];

          if (slug && title) {
            enPages.push({
              path: `/blog/${slug}`,
              title: `${title} — Ravan Mammadov`,
              description: excerpt || `Explore ${title} by Senior Creative Designer Ravan Mammadov.`,
              type: "article",
              schemaType: "BlogPosting",
              lastmod: todayIso,
              noindex: false,
            });
            if (slug_az) {
              azPages.push({
                path: `/az/blog/${slug_az}`,
                title: `${title_az || title} — Rəvan Məmmədov`,
                description: excerpt_az || excerpt || `${title_az || title} haqqında oxuyun.`,
                type: "article",
                schemaType: "BlogPosting",
                lastmod: todayIso,
                noindex: false,
              });
              if (slug_az !== slug) {
                azPages.push({
                  path: `/az/blog/${slug}`,
                  title: `${title_az || title} — Rəvan Məmmədov`,
                  description: excerpt_az || excerpt || `${title_az || title} haqqında oxuyun.`,
                  type: "article",
                  schemaType: "BlogPosting",
                  lastmod: todayIso,
                  noindex: false,
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Local blog fallback error:", e?.message || e);
    }
    return { enPages, azPages };
  }
}

async function fetchFontPages() {
  try {
    const catalogPath = path.join(projectRoot, "src", "lib", "googleFontsCatalog.json");
    const raw = await fs.readFile(catalogPath, "utf8");
    const catalog = JSON.parse(raw);

    // Sort by trending score and style count to identify Tier 1 curated fonts
    const sorted = [...catalog].sort((a, b) =>
      (b.trendingScore || 0) - (a.trendingScore || 0) ||
      (b.stylesCount || 0) - (a.stylesCount || 0)
    );

    const TOP_TIER_COUNT = 250;
    const tier1Set = new Set(sorted.slice(0, TOP_TIER_COUNT).map((f) => f.id));

    // Guarantee all Search Console high-intent performers are indexable
    const GSC_OPPORTUNITY_SLUGS = [
      "general-sans", "syne", "plus-jakarta-sans", "plus-jakarta-display",
      "montenegrin-gothic-one", "federo", "faustina", "karantina",
      "open-sans", "luckiest-guy", "pacifico", "playfair-display",
      "cormorant-garamond", "league-spartan", "inter", "roboto", "outfit"
    ];
    for (const f of catalog) {
      const s = f.family.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      if (GSC_OPPORTUNITY_SLUGS.includes(s) || GSC_OPPORTUNITY_SLUGS.includes(f.id)) {
        tier1Set.add(f.id);
      }
    }

    const enPages = [];
    const azPages = [];

    for (const font of sorted) {
      const slug = font.family
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const isTier1 = tier1Set.has(font.id);

      // EN Font Page
      const isVariable = font.isVariable;
      const stylesCount = font.stylesCount || 1;
      const category = font.category || "Sans Serif";

      enPages.push({
        path: `/fonts/${slug}`,
        title: font.supportsAzerbaijani
          ? `${font.family} Font Family (Azerbaijani Supported): Specimen, CSS & Free Download — Rvan.me`
          : `${font.family} Font Family: Specimen, CSS & Free Download — Rvan.me`,
        description: font.supportsAzerbaijani
          ? `Download ${font.family} font family with verified Azerbaijani Latin glyphs (Ə, ğ, ı, ö, ş, ü, ç) for free (${font.license || "SIL Open Font License"}). Features ${stylesCount} styles, live specimen tester, and CSS code snippets.`
          : `Download ${font.family} font family for free (${font.license || "SIL Open Font License"}). Features ${stylesCount} style${stylesCount > 1 ? "s" : ""}${isVariable ? ", variable axes" : ""}, live specimen tester, Fontsource/Google Fonts CSS code snippets, and fluid clamp() scale calculator.`,
        type: "website",
        lastmod: "2026-08-18",
        isTier1,
        noindex: !isTier1,
      });

      // AZ Font Page
      azPages.push({
        path: `/az/fonts/${slug}`,
        title: font.supportsAzerbaijani
          ? `${font.family} Şrift Ailəsi (Azərbaycan Dili Dəstəkli): Nümunə və Pulsuz Yüklə — Rvan.me`
          : `${font.family} Şrift Ailəsi: Nümunə, CSS və Pulsuz Yüklə — Rvan.me`,
        description: font.supportsAzerbaijani
          ? `${font.family} şrift ailəsini pulsuz yükləyin. Azərbaycan latın qlifləri (Ə, ğ, ı, ö, ş, ü, ç), ${stylesCount} şrift çəkisi, canlı nümayiş və CSS kodları ilə.`
          : `${font.family} şrift ailəsini pulsuz yükləyin (${font.license || "SIL Açıq Şrift Lisenziyası"}). ${stylesCount} şrift çəkisi${isVariable ? ", variativ oxlar" : ""}, canlı nümayiş redaktoru, CSS kodları və elastik clamp() kalkulyatoru ilə.`,
        type: "website",
        lastmod: "2026-08-18",
        isTier1,
        noindex: !isTier1,
      });
    }

    return { enPages, azPages };
  } catch (error) {
    console.warn("SEO prerender skipped font pages:", error?.message || error);
    return { enPages: [], azPages: [] };
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
  "/resources": {
    title: "Kreativ Resurslar — Açıq Mənbəli Şriftlər, İkonlar və Alətlər | Rvan.me",
    description: "Dizaynerlər və proqramçılar üçün açıq mənbəli şrift ailələri, vektor aktivləri və UI dəstləri.",
  },
  "/ai-tools": {
    title: "AI Alətləri və Avtomatlaşdırma Kataloqu — Rəvan Məmmədov",
    description: "Yüksək faydalı AI generatorları və dizayn iş axını avtomatlaşdırma alətləri kataloqu.",
  },
  "/opportunities": {
    title: "Distant İşlər, Təqaüdlər və Müsabiqələr — Rəvan Məmmədov",
    description: "Qlobal dizayn vakansiyaları, texnoloji imkanlar, akademik təqaüdlər və yaradıcı müsabiqələr.",
  },
  "/blog/guide-responsive-fluid-typography-css-clamp": {
    title: "CSS clamp() ilə Responsiv Elastik Tipoqrafiyanın Tam Bələdçisi — Rvan.me",
    description: "Müasir elastik tipoqrafiyanın hərtərəfli arxitektura bələdçisi: Xətti interpolyasiya riyaziyyatı, harmonik modul miqyaslar və CSS clamp() ilə media query tullanışlarına son qoyun.",
  },
  "/blog/apca-vs-wcag-contrast-accessibility-guide": {
    title: "APCA və WCAG 2.1: Kontrast və Əlçatanlığın Əsas Bələdçisi — Rvan.me",
    description: "WCAG 2.x nisbi parlaqlıq nisbətləri (4.5:1) ilə W3C Silver APCA-0.98G perseptual alqoritminin müqayisəsi: Məkan tezliyi, şrift çəkisi və qaranlıq rejim qütblüyü.",
  },
  "/blog/guide-cognitive-conversion-copywriting": {
    title: "Koqnitiv Konversiya Kopiraytinqi: Elmi Hevristik Bələdçi — Rvan.me",
    description: "Yüksək konversiyalı mətnlərin davranış psixologiyası: Koqnitiv axıcılıq, ölçülə bilən dəqiqlik, riskin ləğvi və itki qorxusunun qərar vermə sürtünməsini necə aradan qaldırması.",
  },
  "/blog/visual-hierarchy-framework-web-interfaces": {
    title: "Müasir Veb İnterfeyslər Üçün 3 Saniyəlik Vizual İyerarxiya Çərçivəsi — Rvan.me",
    description: "Vizual baxış trayektoriyalarının neyroelmi: Miqyas, Geştalt yaxınlığı, parlaqlıq kontrastı və fokus nöqtələrinin 3 saniyə ərzində istifadəçi diqqətini necə idarə etməsi.",
  },
  "/tools/persuasion-analyzer": {
    title: "Marketinq və Persuasiya Mətn Analizatoru — Rvan.me",
    description: "Başlıqlar, dəyər təklifləri və CTA düymələrini 8 koqnitiv marketinq psixologiyası meyarı üzrə analiz edin. Dəqiq təsir xalları və aydın tövsiyələr əldə edin.",
  },
  "/tools/contrast-matrix": {
    title: "APCA Kontrast Matrisi və Rəng Əlçatanlığı Yoxlayıcısı — Rvan.me",
    description: "APCA-0.98G alqoritmi və WCAG 2.1 nisbətləri ilə perseptual rəng kontrastını yoxlayın. 2D şrift matrisi, canlı interfeys nümunəsi və dizayn sistemi tokenləri auditi.",
  },
  "/tools/typography-scale": {
    title: "Elastik Tipoqrafiya Miqyası və CSS Clamp Kalkulyatoru — Rvan.me",
    description: "Riyazi modul miqyaslar və CSS clamp() ilə tam elastik tipoqrafiya iyerarxiyaları qurun. Canlı ekran simulyatoru və bir kliklə CSS dəyişənlərini kopyalama imkanı.",
  },
  "/tools/resume-builder": {
    title: "Pulsuz ATS CV Hazırlayıcı — HR Təsdiqli Vektor PDF Generatoru | Rvan.me",
    description: "Real vaxt rejimində sənəd üzərində birbaşa redaktə, ATS xal auditi və 1 kliklə yüksək keyfiyyətli vektor A4 PDF yükləmə imkanı verən peşəkar CV hazırlayıcı.",
  },
  "/tools/open-peeps": {
    title: "Personaj Quraşdırıcı Aləti — Pulsuz Vektor İllüstrasiya Generatoru | Rvan.me",
    description: "Modul personaj quraşdırıcı ilə xüsusi əl ilə çəkilmiş illüstrasiyalar yaradın. Üz ifadələri, saç düzümləri və geyimləri birləşdirin, təmiz SVG və PNG ixrac edin.",
  },
  "/privacy-policy": {
    title: "Məxfilik Siyasəti — Rəvan Məmmədov",
    description: "Rəvan Məmmədov platformasının istifadəçi məlumatlarının qorunması və məxfilik siyasəti.",
  },
  "/cookie-policy": {
    title: "Kuki Siyasəti — Rəvan Məmmədov",
    description: "Kuki siyasəti və razılıq tənzimləmələri.",
  },
  "/terms": {
    title: "İstifadə Şərtləri — Rəvan Məmmədov",
    description: "Rəvan Məmmədov platformasının rəsmi istifadə şərtləri və hüquqi bildirişləri.",
  },
  "/admin/linkedin": {
    title: "LinkedIn İdarəetmə Paneli — Rvan.me",
    description: "LinkedIn OAuth 2.0 və şəxsi profil nəşr idarəetmə paneli.",
    noindex: true,
  },
};

const template = await fs.readFile(path.join(distRoot, "index.html"), "utf8");
const { enPages: fontEnPages, azPages: fontAzPages } = await fetchFontPages();
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
    noindex: p.noindex || azMeta.noindex || false,
  };
});

const allPages = [
  ...staticPages,
  ...staticAzPages,
  ...dynamicEnPages,
  ...dynamicAzPages,
  ...fontEnPages,
  ...fontAzPages,
];

for (const page of allPages) {
  const pageDirectory = page.path === "/" ? distRoot : path.join(distRoot, ...page.path.split("/").filter(Boolean));
  await fs.mkdir(pageDirectory, { recursive: true });
  await fs.writeFile(path.join(pageDirectory, "index.html"), applyPageMetadata(template, page), "utf8");
}

console.log(`Generated SEO-ready HTML for ${allPages.length} routes (EN + AZ).`);

// Generate dist/sitemap.xml with canonical indexable routes only
// Excludes noindex routes (admin routes, tier-2 font routes)
const sitemapPages = allPages.filter((p) => !p.noindex && !p.path.includes("/admin") && p.isTier1 !== false);

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapPages
  .map((p) => {
    const isAz = p.path === "/az" || p.path.startsWith("/az/");
    const cleanPath = isAz ? p.path.replace(/^\/az/, "") || "/" : p.path;
    const url = `${domain}${p.path === "/" ? "/" : p.path.replace(/\/+$/, "")}`;
    const enUrl = `${domain}${cleanPath === "/" ? "/" : cleanPath.replace(/\/+$/, "")}`;
    const azUrl = `${domain}${cleanPath === "/" ? "/az" : `/az${cleanPath.replace(/\/+$/, "")}`}`;
    const lastmod = p.lastmod || todayIso;
    const priority =
      p.path === "/" || p.path === "/az"
        ? "1.0"
        : p.path.startsWith("/blog") || p.path.startsWith("/az/blog") || p.path.startsWith("/tools") || p.path.startsWith("/az/tools")
        ? "0.9"
        : p.path.startsWith("/work") || p.path.startsWith("/az/work") || p.path === "/ravan-mammadov" || p.path === "/az/ravan-mammadov"
        ? "0.8"
        : p.path.includes("/fonts/")
        ? "0.7"
        : "0.8";
    const changefreq =
      p.path.startsWith("/blog") || p.path.startsWith("/az/blog")
        ? "daily"
        : "weekly";

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
console.log(`Generated authoritative sitemap.xml with ${sitemapPages.length} indexable URLs (including lastmod and hreflang tags).`);
