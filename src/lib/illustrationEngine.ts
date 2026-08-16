import { isFuzzyMatch } from "./fuzzySearch";
import { RAW_ILLUSTRATION_CATALOG } from "./illustrationCatalog";
import { OPEN_DOODLE_SVGS } from "./openDoodleSvgs";

export interface IllustrationItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  doodleKey: string;
  svgTemplate: (accentColor: string) => string;
}

export const ILLUSTRATION_CATEGORIES = [
  "All",
  "Tech & Coding",
  "Design & Creative",
  "Business & Startup",
  "Data & Analytics",
  "Security & Cloud",
  "People & Work",
  "Finance & E-Commerce",
  "Marketing & Growth",
  "Science & Education",
  "Lifestyle & Wellness",
] as const;

export type IllustrationCategory = (typeof ILLUSTRATION_CATEGORIES)[number];

// Placeholder tokens used during build-time pre-render
const ACCENT_PLACEHOLDER = "__ACCENT__";
const INK_PLACEHOLDER = "__INK__";

/**
 * Swaps placeholder colors in a pre-rendered Open Doodle SVG template.
 * No ReactDOMServer needed — pure string replacement at runtime.
 */
function colorize(svgTemplate: string, accentColor: string, inkColor: string = "#ffffff"): string {
  return svgTemplate.replaceAll(ACCENT_PLACEHOLDER, accentColor).replaceAll(INK_PLACEHOLDER, inkColor);
}

// ── BUILD COMPLETE CATALOG ──
export const ILLUSTRATION_CATALOG: IllustrationItem[] = RAW_ILLUSTRATION_CATALOG.map((raw) => ({
  id: raw.id,
  title: raw.title,
  category: raw.category,
  tags: raw.tags,
  doodleKey: raw.doodleKey,
  svgTemplate: (accentColor: string) => {
    const template = OPEN_DOODLE_SVGS[raw.doodleKey];
    if (!template) return "";
    return colorize(template, accentColor);
  },
}));

/**
 * Searches the illustration catalog by query and category filter.
 */
export function searchIllustrations(
  query: string,
  category: string = "All"
): IllustrationItem[] {
  let results = ILLUSTRATION_CATALOG;

  if (category && category !== "All") {
    results = results.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return results;

  return results.filter((item) => {
    if (isFuzzyMatch(cleanQuery, item.title)) return true;
    if (isFuzzyMatch(cleanQuery, item.category)) return true;
    return item.tags.some((tag) => isFuzzyMatch(cleanQuery, tag));
  });
}
