import rawCatalog from "./illustrationsIndex.json";
import { isFuzzyMatch } from "./fuzzySearch";

export interface IllustrationItem {
  id: string;
  title: string;
  slug: string;
  collection: "unDraw" | "Open Doodles" | string;
  category: string;
  tags: string[];
  format: "svg" | "png";
  src: string;
  pngSrc?: string;
  author: string;
  license: string;
  sourceUrl: string;
  hash?: string;
}

export const ILLUSTRATION_CATEGORIES = [
  "All",
  "Design & Creative",
  "Business & Startup",
  "People & Work",
  "Technology",
  "Marketing",
  "Education",
  "Lifestyle",
  "Communication",
  "Abstract",
  "3D / Modeling",
] as const;

export type IllustrationCategory = (typeof ILLUSTRATION_CATEGORIES)[number];

export const ILLUSTRATION_COLLECTIONS = ["All", "unDraw"] as const;
export type IllustrationCollection = (typeof ILLUSTRATION_COLLECTIONS)[number];

// Cast typed catalog
export const ILLUSTRATIONS_CATALOG: IllustrationItem[] = rawCatalog as IllustrationItem[];

/**
 * Fast client-side fuzzy search and filtering across titles, categories, and tags.
 */
export function searchIllustrations(
  query: string = "",
  category: string = "All",
  collection: string = "All"
): IllustrationItem[] {
  let list = ILLUSTRATIONS_CATALOG;

  if (category && category !== "All") {
    const catLower = category.toLowerCase().trim();
    list = list.filter((item) => item.category.toLowerCase() === catLower);
  }

  if (collection && collection !== "All") {
    const colLower = collection.toLowerCase().trim();
    list = list.filter((item) => item.collection.toLowerCase() === colLower);
  }

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return list;

  return list.filter((item) => {
    if (item.title.toLowerCase().includes(cleanQuery)) return true;
    if (isFuzzyMatch(cleanQuery, item.title)) return true;
    if (item.category.toLowerCase().includes(cleanQuery)) return true;
    if (item.collection.toLowerCase().includes(cleanQuery)) return true;
    return item.tags.some(
      (tag) => tag.toLowerCase().includes(cleanQuery) || isFuzzyMatch(cleanQuery, tag)
    );
  });
}
