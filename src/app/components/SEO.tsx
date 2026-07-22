import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishDate?: string;
  authorName?: string;
}

export default function SEO({
  title = "Ravan Mammadov — Senior Creative Designer & Art Director",
  description = "Senior Creative Designer based in Baku, blending motion design, brand worlds, and performance creative into high-impact digital experiences.",
  image,
  url = window.location.href,
  type = "website",
  publishDate,
  authorName = "Ravan Mammadov",
}: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper for updating meta tags
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

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:url"]', url);
    updateMeta('meta[property="og:type"]', type);
    updateMeta('meta[property="twitter:title"]', title);
    updateMeta('meta[property="twitter:description"]', description);
    updateMeta('meta[property="twitter:url"]', url);

    if (image) {
      updateMeta('meta[property="og:image"]', image);
      updateMeta('meta[property="twitter:image"]', image);
    }

    // Article schema insertion if type is article
    let scriptElement: HTMLScriptElement | null = null;
    if (type === "article") {
      scriptElement = document.createElement("script");
      scriptElement.type = "application/ld+json";
      scriptElement.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: description,
        image: image ? [image] : [],
        datePublished: publishDate,
        author: {
          "@type": "Person",
          name: authorName,
        },
      });
      document.head.appendChild(scriptElement);
    }

    return () => {
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [title, description, image, url, type, publishDate, authorName]);

  return null;
}
