import { useEffect, useState } from "react";
import { urlFor } from "../../lib/sanityClient";
import { fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishDate?: string;
  modifiedDate?: string;
  authorName?: string;
  favicon?: any;
  noIndex?: boolean;
  jsonLd?: Record<string, any>;
  siteSettings?: SiteSettings | null;
}

const DEFAULT_SITE_DOMAIN = "https://www.rvan.me";

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
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

  // Resolve defaults from Sanity CMS Site Settings
  const siteDomain = seoConfig?.canonicalUrl || DEFAULT_SITE_DOMAIN;
  const resolvedTitle = title || seoConfig?.metaTitle || "Ravan Mammadov — Senior Creative Designer & Art Director";
  const resolvedDescription =
    description ||
    seoConfig?.metaDescription ||
    "Senior Creative Designer blending 3D motion design, brand worlds, and high-performing digital marketing ideas into work that commands attention.";
  const resolvedAuthor = authorName || seoConfig?.author || "Ravan Mammadov";
  const resolvedSiteName = seoConfig?.siteName || "Ravan Mammadov";
  const resolvedTwitterHandle = seoConfig?.twitterHandle || "@ravanimate";
  const defaultKeywords =
    seoConfig?.defaultKeywords ||
    "Ravan Mammadov, Creative Designer, Motion Design, Art Direction, Brand Identity, 3D Design, Baku, Portfolio";

  // OG & Twitter Images from Sanity or fallback
  const sanityOgImageUrl = seoConfig?.ogImage ? urlFor(seoConfig.ogImage)?.url() : null;
  const sanityTwitterImageUrl = seoConfig?.twitterImage ? urlFor(seoConfig.twitterImage)?.url() : null;
  const resolvedOgImage = image || sanityOgImageUrl || `${siteDomain}/og-image.jpg`;
  const resolvedTwitterImage = image || sanityTwitterImageUrl || sanityOgImageUrl || `${siteDomain}/og-image.jpg`;

  const rawUrl = url || (typeof window !== "undefined" ? window.location.href : siteDomain);
  const resolvedUrl = rawUrl.replace(/^https?:\/\/(www\.)?rvan\.me/i, "https://www.rvan.me");

  useEffect(() => {
    // Document Title
    document.title = resolvedTitle;

    // Helper for updating or creating meta tags
    const updateMeta = (selector: string, content: string, attrName = "content") => {
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
      element.setAttribute(attrName, content);
    };

    // Robots & Rich Directives
    updateMeta('meta[name="robots"]', noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Core meta
    updateMeta('meta[name="description"]', resolvedDescription);
    updateMeta('meta[name="author"]', resolvedAuthor);
    updateMeta('meta[name="keywords"]', defaultKeywords);

    // Open Graph
    updateMeta('meta[property="og:title"]', resolvedTitle);
    updateMeta('meta[property="og:description"]', resolvedDescription);
    updateMeta('meta[property="og:url"]', resolvedUrl);
    updateMeta('meta[property="og:type"]', type);
    updateMeta('meta[property="og:site_name"]', resolvedSiteName);
    updateMeta('meta[property="og:locale"]', "en_US");

    // Twitter/X Card
    updateMeta('meta[name="twitter:card"]', "summary_large_image");
    updateMeta('meta[name="twitter:title"]', resolvedTitle);
    updateMeta('meta[name="twitter:description"]', resolvedDescription);
    updateMeta('meta[name="twitter:url"]', resolvedUrl);
    updateMeta('meta[name="twitter:creator"]', resolvedTwitterHandle);
    updateMeta('meta[name="twitter:site"]', resolvedTwitterHandle);
    updateMeta('meta[name="twitter:image:alt"]', resolvedTitle);

    // Images
    updateMeta('meta[property="og:image"]', resolvedOgImage);
    updateMeta('meta[property="og:image:secure_url"]', resolvedOgImage);
    updateMeta('meta[property="og:image:type"]', "image/jpeg");
    updateMeta('meta[property="og:image:width"]', "1200");
    updateMeta('meta[property="og:image:height"]', "630");
    updateMeta('meta[property="og:image:alt"]', resolvedTitle);
    updateMeta('meta[name="twitter:image"]', resolvedTwitterImage);

    // Article-specific
    if (type === "article") {
      if (publishDate) updateMeta('meta[property="article:published_time"]', publishDate);
      if (modifiedDate) updateMeta('meta[property="article:modified_time"]', modifiedDate);
      updateMeta('meta[property="article:author"]', resolvedAuthor);
    }

    // Canonical URL
    let canonical: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = resolvedUrl;

    // Favicon — dynamic from Sanity if available
    const sanityFaviconUrl = (favicon || activeSettings?.favicon) ? urlFor(favicon || activeSettings?.favicon)?.url() : null;
    if (sanityFaviconUrl) {
      let favLink: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
      if (!favLink) {
        favLink = document.createElement("link");
        favLink.rel = "icon";
        document.head.appendChild(favLink);
      }
      favLink.href = sanityFaviconUrl;
      favLink.type = "image/webp";
    }

    // JSON-LD Structured Data
    let scriptElement: HTMLScriptElement | null = document.querySelector("#seo-json-ld");
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = "seo-json-ld";
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }

    const defaultJsonLd =
      jsonLd ||
      (type === "article"
        ? {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: resolvedTitle,
            description: resolvedDescription,
            image: resolvedOgImage ? [resolvedOgImage] : [],
            datePublished: publishDate,
            dateModified: modifiedDate || publishDate,
            url: resolvedUrl,
            author: {
              "@type": "Person",
              name: resolvedAuthor,
              jobTitle: "Senior Creative Designer & Art Director",
              url: siteDomain,
            },
            publisher: {
              "@type": "Person",
              name: resolvedAuthor,
              url: siteDomain,
            },
          }
        : {
            "@context": "https://schema.org",
            "@type": "Person",
            name: resolvedAuthor,
            url: siteDomain,
            jobTitle: "Senior Creative Designer & Art Director",
            description: resolvedDescription,
            sameAs: [
              activeSettings?.socialLinks?.behance || "https://www.behance.net/mammadovravan",
              activeSettings?.socialLinks?.linkedin || "https://www.linkedin.com/in/ravanmammadov1/",
              activeSettings?.socialLinks?.instagram || "https://www.instagram.com/ravanimate/",
            ],
            knowsAbout: ["Motion Design", "Art Direction", "Brand Identity", "3D Design", "Performance Creative"],
          });

    scriptElement.text = JSON.stringify(defaultJsonLd, null, 0);
  }, [
    resolvedTitle,
    resolvedDescription,
    resolvedOgImage,
    resolvedTwitterImage,
    resolvedUrl,
    type,
    publishDate,
    modifiedDate,
    resolvedAuthor,
    resolvedSiteName,
    resolvedTwitterHandle,
    defaultKeywords,
    noIndex,
    jsonLd,
    activeSettings,
    favicon,
    siteDomain,
  ]);

  return null;
}
