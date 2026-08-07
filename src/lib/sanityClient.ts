import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg";
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2025-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: import.meta.env.PROD,
});

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: any) {
  if (!source) return null;
  // If it's an object with an asset property or direct ref
  if (typeof source === "object" && !source.asset && !source._ref) {
    return null;
  }
  try {
    return builder.image(source);
  } catch (error) {
    console.warn("Sanity image builder error:", error);
    return null;
  }
}

/**
 * Generate responsive image URLs for Sanity images
 * Returns srcSet for different widths and formats (WebP, AVIF)
 */
export function getResponsiveImageUrls(source: any, options: {
  widths?: number[];
  aspectRatio?: number;
  fit?: "crop" | "fill" | "max" | "min";
} = {}) {
  const image = urlFor(source);
  if (!image) return null;

  const widths = options.widths || [400, 800, 1200, 1600];
  const aspectRatio = options.aspectRatio || 16/10;
  const fit = options.fit || "crop";

  const webpUrls = widths.map(w => {
    const h = Math.round(w / aspectRatio);
    return `${image.width(w).height(h).fit(fit).format("webp").auto("format").url()} ${w}w`;
  }).join(", ");

  const avifUrls = widths.map(w => {
    const h = Math.round(w / aspectRatio);
    return `${image.width(w).height(h).fit(fit).format("avif" as any).auto("format").url()} ${w}w`;
  }).join(", ");

  const fallbackUrl = image.width(widths[1]).height(Math.round(widths[1] / aspectRatio)).fit(fit).url();

  return {
    webp: webpUrls,
    avif: avifUrls,
    fallback: fallbackUrl,
    widths,
    aspectRatio,
  };
}

/**
 * Get a single optimized image URL with specific dimensions
 */
export function getOptimizedImageUrl(source: any, width: number, height?: number, options: {
  fit?: "crop" | "fill" | "max" | "min";
  format?: "webp" | "avif" | "auto";
  quality?: number;
} = {}) {
  const image = urlFor(source);
  if (!image) return null;

  const { fit = "crop", format = "auto", quality = 85 } = options;
  
  let urlBuilder = image.width(width);
  if (height) urlBuilder = urlBuilder.height(height);
  urlBuilder = urlBuilder.fit(fit).quality(quality);
  
  if (format !== "auto") {
    urlBuilder = urlBuilder.format(format as any);
  } else {
    urlBuilder = urlBuilder.auto("format");
  }

  return urlBuilder.url();
}
