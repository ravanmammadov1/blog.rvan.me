import { useEffect, useState } from "react";
import { urlFor } from "../../lib/sanityClient";
import { fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";

type SeoType = "website" | "article" | "profile";
type ArticleSchemaType = "BlogPosting" | "NewsArticle";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: SeoType;
  articleSchemaType?: ArticleSchemaType;
  publishDate?: string;
  modifiedDate?: string;
  authorName?: string;
  favicon?: any;
  noIndex?: boolean;
  jsonLd?: Record<string, any>;
  siteSettings?: SiteSettings | null;
}

export const DEFAULT_SITE_DOMAIN = "https://www.rvan.me";

function getSiteOrigin(value: string): string {
  try {
    return new URL(value, DEFAULT_SITE_DOMAIN).origin.replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_DOMAIN;
  }
}

/** Canonical URLs never contain tracking parameters, searches, or fragments. */
function normalizeCanonicalUrl(value: string, siteDomain: string): string {
  try {
    const parsed = new URL(value, siteDomain);
    const origin = getSiteOrigin(siteDomain);
    const pathname = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
    return `${origin}${pathname}`;
  } catch {
    return `${getSiteOrigin(siteDomain)}/`;
  }
}

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  articleSchemaType = "BlogPosting",
  publishDate,
  modifiedDate,
  authorName,
  favicon,
  noIndex = false,
  jsonLd,
  siteSettings: siteSettingsProp,
}: SEOProps) {
  const [fetchedSettings, setFetchedSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (!siteSettingsProp) {
      fetchSiteSettings().then((data) => {
        if (data) setFetchedSettings(data);
      });
    }
  }, [siteSettingsProp]);

  const activeSettings = siteSettingsProp || fetchedSettings;
  const seoConfig = activeSettings?.seo;
  const siteDomain = getSiteOrigin(seoConfig?.canonicalUrl || DEFAULT_SITE_DOMAIN);
  const resolvedTitle = title || seoConfig?.metaTitle || "Rvan.me — Creative Studio, Design Resources & Tools";
  const resolvedDescription =
    description ||
    seoConfig?.metaDescription ||
    "Rvan.me is a curated creative hub by Ravan Mammadov for design thinking, resources, developer tools, and industry insights.";
  const resolvedAuthor = authorName || seoConfig?.author || "Ravan Mammadov";
  const resolvedSiteName = seoConfig?.siteName || "Rvan.me";

  const resolvedTwitterHandle = seoConfig?.twitterHandle || "@ravanimate";

  const sanityOgImageUrl = seoConfig?.ogImage ? urlFor(seoConfig.ogImage)?.url() : null;
  const sanityTwitterImageUrl = seoConfig?.twitterImage ? urlFor(seoConfig.twitterImage)?.url() : null;
  const resolvedOgImage = image || sanityOgImageUrl || `${siteDomain}/og-image.jpg`;
  const resolvedTwitterImage = image || sanityTwitterImageUrl || sanityOgImageUrl || `${siteDomain}/og-image.jpg`;
  const rawUrl = url || (typeof window !== "undefined" ? window.location.href : siteDomain);
  const resolvedUrl = normalizeCanonicalUrl(rawUrl, siteDomain);
  const personId = `${siteDomain}/#person`;
  const websiteId = `${siteDomain}/#website`;
  const isAz = resolvedUrl.includes("/az/") || resolvedUrl.endsWith("/az") || (typeof window !== "undefined" && window.location.pathname.startsWith("/az"));

  useEffect(() => {
    document.title = resolvedTitle;

    const updateMeta = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        const meta = document.createElement("meta");
        if (selector.includes('name="')) {
          meta.name = selector.match(/name="([^"]+)"/)?.[1] || "";
        } else if (selector.includes('property="')) {
          meta.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
        }
        document.head.appendChild(meta);
        element = meta;
      }
      element.setAttribute("content", content);
    };

    // The keywords meta tag has no ranking value and is deliberately removed.
    document.querySelector('meta[name="keywords"]')?.remove();
    updateMeta(
      'meta[name="robots"]',
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );
    updateMeta('meta[name="description"]', resolvedDescription);
    updateMeta('meta[name="author"]', resolvedAuthor);

    updateMeta('meta[property="og:title"]', resolvedTitle);
    updateMeta('meta[property="og:description"]', resolvedDescription);
    updateMeta('meta[property="og:url"]', resolvedUrl);
    updateMeta('meta[property="og:type"]', type === "profile" ? "profile" : type);
    updateMeta('meta[property="og:site_name"]', resolvedSiteName);
    updateMeta('meta[property="og:locale"]', "en_US");

    updateMeta('meta[name="twitter:card"]', "summary_large_image");
    updateMeta('meta[name="twitter:title"]', resolvedTitle);
    updateMeta('meta[name="twitter:description"]', resolvedDescription);
    updateMeta('meta[name="twitter:url"]', resolvedUrl);
    updateMeta('meta[name="twitter:creator"]', resolvedTwitterHandle);
    updateMeta('meta[name="twitter:site"]', resolvedTwitterHandle);
    updateMeta('meta[name="twitter:image"]', resolvedTwitterImage);
    updateMeta('meta[name="twitter:image:alt"]', resolvedTitle);

    updateMeta('meta[property="og:image"]', resolvedOgImage);
    updateMeta('meta[property="og:image:secure_url"]', resolvedOgImage);
    updateMeta('meta[property="og:image:type"]', "image/jpeg");
    updateMeta('meta[property="og:image:width"]', "1200");
    updateMeta('meta[property="og:image:alt"]', resolvedTitle);

    if (type === "article") {
      if (publishDate) updateMeta('meta[property="article:published_time"]', publishDate);
      if (modifiedDate) updateMeta('meta[property="article:modified_time"]', modifiedDate);
      updateMeta('meta[property="article:author"]', resolvedAuthor);
    }
    
    const isAz = resolvedUrl.includes("/az/") || resolvedUrl.endsWith("/az");
    updateMeta('meta[property="og:locale"]', isAz ? "az_AZ" : "en_US");

    // Hreflang alternate links
    const isAzPath = resolvedUrl.includes("/az/") || resolvedUrl.endsWith("/az");
    const enCanonical = isAzPath
      ? resolvedUrl.replace(`${siteDomain}/az`, siteDomain).replace(/\/\/$/, "/")
      : resolvedUrl;
    const azCanonical = isAzPath
      ? resolvedUrl
      : (resolvedUrl === `${siteDomain}/` ? `${siteDomain}/az` : resolvedUrl.replace(`${siteDomain}/`, `${siteDomain}/az/`));

    const updateLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        const link = document.createElement("link");
        link.rel = rel;
        if (hreflang) link.setAttribute("hreflang", hreflang);
        document.head.appendChild(link);
        element = link;
      }
      element.setAttribute("href", href);
    };

    updateLink("canonical", resolvedUrl);
    updateLink("alternate", enCanonical, "en");
    updateLink("alternate", azCanonical, "az");
    updateLink("alternate", enCanonical, "x-default");

    const sanityFaviconUrl = (favicon || activeSettings?.favicon)
      ? urlFor(favicon || activeSettings?.favicon)?.url()
      : null;
    const ensureLink = (rel: string, href: string, linkType?: string, sizes?: string) => {
      let link: HTMLLinkElement | null = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
      if (linkType) link.type = linkType;
      if (sizes) link.sizes = sizes;
    };

    ensureLink("icon", sanityFaviconUrl || "/favicon.ico", sanityFaviconUrl ? "image/webp" : "image/x-icon", sanityFaviconUrl ? "" : "any");
    ensureLink("apple-touch-icon", "/apple-touch-icon.png", "image/png", "180x180");
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifest = document.createElement("link");
      manifest.rel = "manifest";
      manifest.href = "/site.webmanifest";
      document.head.appendChild(manifest);
    }

    const baseGraph: Record<string, any>[] = [
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
        url: `${siteDomain}/ravan-mammadov`,
        jobTitle: isAz ? "Aparıcı Kreativ Dizayner və Art Direktor" : "Senior Creative Designer & Art Director",
        image: {
          "@type": "ImageObject",
          "@id": `${siteDomain}/#portrait`,
          url: `${siteDomain}/og-image.jpg`,
          caption: "Rəvan Məmmədov (Ravan Mammadov) — Senior Creative Designer & Art Director",
          representativeOfPage: true,
        },
        sameAs: [
          activeSettings?.socialLinks?.behance || "https://www.behance.net/mammadovravan",
          activeSettings?.socialLinks?.linkedin || "https://www.linkedin.com/in/ravanmammadov1/",
          activeSettings?.socialLinks?.instagram || "https://www.instagram.com/ravanimate/",
          "https://github.com/ravanmammadov1",
          "https://twitter.com/ravanimate",
        ],
        knowsAbout: [
          "Motion Design",
          "Brand Architecture",
          "Graphic Design",
          "Art Direction",
          "Creative Strategy",
          "UI/UX Design",
          "3D Product Visualization",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${siteDomain}/`,
        name: resolvedSiteName,
        publisher: { "@id": personId },
      },
      {
        "@type": type === "profile" ? "ProfilePage" : "WebPage",
        "@id": `${resolvedUrl}#webpage`,
        url: resolvedUrl,
        name: resolvedTitle,
        description: resolvedDescription,
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
      },
    ];

    if (type === "article") {
      baseGraph.push({
        "@type": articleSchemaType,
        "@id": `${resolvedUrl}#article`,
        headline: resolvedTitle,
        description: resolvedDescription,
        image: resolvedOgImage ? [resolvedOgImage] : [],
        datePublished: publishDate,
        dateModified: modifiedDate || publishDate,
        url: resolvedUrl,
        mainEntityOfPage: { "@id": `${resolvedUrl}#webpage` },
        author: { "@id": personId },
        publisher: { "@id": personId },
      });
    }

    const structuredData = jsonLd || {
      "@context": "https://schema.org",
      "@graph": baseGraph,
    };

    let scriptElement: HTMLScriptElement | null = document.querySelector("#seo-json-ld");
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = "seo-json-ld";
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }
    scriptElement.text = JSON.stringify(structuredData);
  }, [
    resolvedTitle,
    resolvedDescription,
    resolvedOgImage,
    resolvedTwitterImage,
    resolvedUrl,
    type,
    articleSchemaType,
    publishDate,
    modifiedDate,
    resolvedAuthor,
    resolvedSiteName,
    resolvedTwitterHandle,
    noIndex,
    jsonLd,
    activeSettings,
    favicon,
    siteDomain,
    personId,
    websiteId,
  ]);

  return null;
}
