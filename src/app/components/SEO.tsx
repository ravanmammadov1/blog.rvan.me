import { useEffect } from "react";
import { urlFor } from "../../lib/sanityClient";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishDate?: string;
  authorName?: string;
  favicon?: any;
  jsonLd?: Record<string, any>;
}

export default function SEO({
  title = "Ravan Mammadov — Senior Creative Designer & Art Director",
  description = "Senior Creative Designer based in Baku, blending motion design, brand worlds, and performance creative into high-impact digital experiences.",
  image,
  url = typeof window !== "undefined" ? window.location.href : "https://ravanimate.com",
  type = "website",
  publishDate,
  authorName = "Ravan Mammadov",
  favicon,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // Document Title
    document.title = title;

    // Helper for updating or creating meta tags
    const updateMeta = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute("content", content);
      } else {
        const meta = document.createElement("meta");
        if (selector.startsWith('meta[name="')) {
          meta.name = selector.replace('meta[name="', "").replace('"]', "");
        } else if (selector.startsWith('meta[property="')) {
          meta.setAttribute("property", selector.replace('meta[property="', "").replace('"]', ""));
        }
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Helper for updating canonical link
    const updateCanonical = (hrefUrl: string) => {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = hrefUrl;
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:url"]', url);
    updateMeta('meta[property="og:type"]', type);
    updateMeta('meta[name="twitter:card"]', image ? "summary_large_image" : "summary");
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
    updateMeta('meta[name="twitter:url"]', url);

    if (image) {
      updateMeta('meta[property="og:image"]', image);
      updateMeta('meta[name="twitter:image"]', image);
    }

    updateCanonical(url);

    // Favicon link setup (dynamic from Sanity if available, or fallback to /favicon.webp)
    let favLink: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
    if (!favLink) {
      favLink = document.createElement("link");
      favLink.rel = "icon";
      favLink.type = "image/webp";
      document.head.appendChild(favLink);
    }
    const sanityFaviconUrl = favicon ? urlFor(favicon)?.url() : null;
    favLink.href = sanityFaviconUrl || "/favicon.webp";

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
            image: image ? [image] : [],
            datePublished: publishDate,
            author: {
              "@type": "Person",
              name: authorName,
              jobTitle: "Senior Creative Designer & Marketer",
            },
          }
        : {
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Ravan Mammadov",
            url: "https://ravanimate.com",
            jobTitle: "Senior Creative Designer & Marketer",
            sameAs: [
              "https://www.behance.net/mammadovravan",
              "https://www.linkedin.com/in/ravanmammadov1/",
              "https://www.instagram.com/ravanimate/",
            ],
          });

    scriptElement.text = JSON.stringify(defaultJsonLd);

    return () => {
      // Keep script cleaned or updated on unmount if needed
    };
  }, [title, description, image, url, type, publishDate, authorName, jsonLd]);

  return null;
}
