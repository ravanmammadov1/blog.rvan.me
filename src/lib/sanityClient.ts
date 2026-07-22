import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg";
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2025-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
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