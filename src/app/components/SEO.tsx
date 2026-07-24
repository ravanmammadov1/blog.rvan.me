import { useEffect } from "react";
import { urlFor } from "../../lib/sanityClient";

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
}

const SITE_DOMAIN = "https://rvan.me";

export default function SEO({
  title = "Ravan Mammadov — Senior Creative Designer & Art Director",
  description = "Senior Creative Designer based in Baku, blending motion design, brand worlds, and performance creative into high-impact digital experiences.",
  image,
  url,
  type = "website",
  publishDate,
  modifiedDate,
  authorName = "Ravan Mammadov",
  favicon,
  noIndex = false,
  jsonLd,
}: SEOProps) {
  const resolvedUrl = url || (typeof window !== "undefined" ? window.location.href : SITE_DOMAIN);

  useEffect(() => {
    // Document Title
    document.title = title;

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

    // Robots
    updateMeta('meta[name="robots"]', noIndex ? "noindex, nofollow" : "index, follow");

    // Core meta
    updateMeta('meta[name="description"]', description);

    // Open Graph
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:url"]', resolvedUrl);
    updateMeta('meta[property="og:type"]', type);
    updateMeta('meta[property="og:site_name"]', "Ravan Mammadov");

    // Twitter/X Card
    updateMeta('meta[name="twitter:card"]', "summary_large_image");
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
    updateMeta('meta[name="twitter:url"]', resolvedUrl);
    updateMeta('meta[name="twitter:creator"]', "@ravanimate");
    updateMeta('meta[name="twitter:site"]', "@ravanimate");

    // OG Image
    const ogImage = image || `${SITE_DOMAIN}/og-image.jpg`;
    updateMeta('meta[property="og:image"]', ogImage);
    updateMeta('meta[property="og:image:width"]', "1200");
    updateMeta('meta[property="og:image:height"]', "630");
    updateMeta('meta[name="twitter:image"]', ogImage);

    // Article-specific
    if (type === "article") {
      if (publishDate) updateMeta('meta[property="article:published_time"]', publishDate);
      if (modifiedDate) updateMeta('meta[property="article:modified_time"]', modifiedDate);
      updateMeta('meta[property="article:author"]', authorName);
    }

    // Canonical URL
    let canonical: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = resolvedUrl;

    // Favicon — dynamic from Sanity if available, otherwise keep static files
    const sanityFaviconUrl = favicon ? urlFor(favicon)?.url() : null;
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
            headline: title,
            description: description,
            image: ogImage ? [ogImage] : [],
            datePublished: publishDate,
            dateModified: modifiedDate || publishDate,
            url: resolvedUrl,
            author: {
              "@type": "Person",
              name: authorName,
              jobTitle: "Senior Creative Designer & Marketer",
              url: SITE_DOMAIN,
            },
            publisher: {
              "@type": "Person",
              name: "Ravan Mammadov",
              url: SITE_DOMAIN,
            },
          }
        : {
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Ravan Mammadov",
            url: SITE_DOMAIN,
            jobTitle: "Senior Creative Designer & Art Director",
            description: "Senior Creative Designer based in Baku, specializing in motion design, brand worlds, and performance creative.",
            sameAs: [
              "https://www.behance.net/mammadovravan",
              "https://www.linkedin.com/in/ravanmammadov1/",
              "https://www.instagram.com/ravanimate/",
            ],
            knowsAbout: ["Motion Design", "Art Direction", "Brand Identity", "3D Design", "Performance Creative"],
          });

    scriptElement.text = JSON.stringify(defaultJsonLd, null, 0);
  }, [title, description, image, resolvedUrl, type, publishDate, modifiedDate, authorName, noIndex, jsonLd]);

  return null;
}


