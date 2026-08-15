import * as LucideIcons from "lucide-react";

export interface IconItem {
  id: string;
  name: string;
  category: string;
  tags: string[];
  componentName: string;
}

export const ICON_CATEGORIES = [
  "All",
  "Interface & UI",
  "Arrows & Navigation",
  "Communication & Social",
  "Code & Development",
  "Media & Audio",
  "Files & Folders",
  "E-Commerce & Finance",
  "Design & Shapes",
  "Security & System",
  "Weather & Nature",
  "User & People",
  "General & Objects",
] as const;

export type IconCategory = typeof ICON_CATEGORIES[number];

// Helper to separate camelCase into words ("ArrowUpRight" -> "Arrow Up Right")
function camelToWords(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
}

// Automatic category detection based on icon name keywords
function categorizeIcon(name: string): IconCategory {
  const lower = name.toLowerCase();

  if (
    /arrow|chevron|compass|map|pin|navigate|corner|external|expand|shrink|move|rotate|locate|direction|triangle-right|move-/.test(
      lower
    )
  ) {
    return "Arrows & Navigation";
  }

  if (
    /mail|message|chat|phone|send|share|globe|rss|radio|thumbs|heart|at|post|at-sign|inbox|contact|quote|hash|bell/.test(
      lower
    )
  ) {
    return "Communication & Social";
  }

  if (
    /code|terminal|cpu|database|git|layers|package|workflow|zap|bug|binary|command|qr|braces|brackets|script|server|variable|webhook|bot|ai/.test(
      lower
    )
  ) {
    return "Code & Development";
  }

  if (
    /monitor|smartphone|laptop|camera|image|video|music|mic|volume|play|pause|disc|tv|film|speaker|headphones|radio|cassette|clapperboard|aperture/.test(
      lower
    )
  ) {
    return "Media & Audio";
  }

  if (
    /file|folder|download|upload|copy|edit|trash|save|clipboard|archive|paperclip|document|notebook|receipt|history/.test(
      lower
    )
  ) {
    return "Files & Folders";
  }

  if (
    /shopping|cart|bag|card|dollar|euro|tag|percent|bank|coins|receipt|wallet|store|barcode|credit|currency|piggy|gem|gift/.test(
      lower
    )
  ) {
    return "E-Commerce & Finance";
  }

  if (
    /palette|type|grid|waves|circle|square|triangle|hexagon|pen|brush|crop|ruler|pipette|stamp|scaling|paint|sparkle|wand|blend|blend-/.test(
      lower
    )
  ) {
    return "Design & Shapes";
  }

  if (
    /shield|lock|unlock|key|alert|info|help|check|x|cross|slash|eye|fingerprint|server|wifi|battery|power|siren|ban|vault/.test(
      lower
    )
  ) {
    return "Security & System";
  }

  if (
    /sun|moon|cloud|rain|wind|snowflake|tree|leaf|flame|droplet|thermometer|umbrella|sunrise|sunset|zap|sparkle/.test(
      lower
    )
  ) {
    return "Weather & Nature";
  }

  if (
    /user|person|team|group|avatar|smile|frown|contact|badge|footprints|hand|biceps|face/.test(
      lower
    )
  ) {
    return "User & People";
  }

  if (
    /search|slider|cog|gear|setting|option|filter|menu|list|grid|table|check|plus|minus|star|flame|bookmark|calendar|clock|refresh|loader|spin/.test(
      lower
    )
  ) {
    return "Interface & UI";
  }

  return "General & Objects";
}

// Generate full catalog of ALL Lucide icons dynamically at runtime
function buildFullLucideCatalog(): IconItem[] {
  const catalog: IconItem[] = [];
  const keys = Object.keys(LucideIcons);

  keys.forEach((key) => {
    // Exclude internal non-icon exports
    if (
      !/^[A-Z]/.test(key) ||
      key === "LucideIcon" ||
      key === "LucideProps" ||
      key === "default" ||
      key === "createLucideIcon"
    ) {
      return;
    }

    const humanName = camelToWords(key);
    const category = categorizeIcon(key);
    const words = humanName.toLowerCase().split(" ");
    const tags = Array.from(new Set([key.toLowerCase(), ...words, category.toLowerCase()]));

    catalog.push({
      id: `lucide-${key.toLowerCase()}`,
      name: humanName,
      category,
      tags,
      componentName: key,
    });
  });

  return catalog;
}

// Singleton full catalog instance containing ALL 1,500+ Lucide icons
export const FULL_LUCIDE_CATALOG: IconItem[] = buildFullLucideCatalog();
export const LUCIDE_ICON_CATALOG = FULL_LUCIDE_CATALOG;

export function searchLucideIcons(
  query: string,
  activeCategory: string = "All"
): IconItem[] {
  let result = FULL_LUCIDE_CATALOG;

  if (activeCategory !== "All") {
    result = result.filter((item) => item.category === activeCategory);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.componentName.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q))
    );
  }

  return result;
}

export function getIconCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = { All: FULL_LUCIDE_CATALOG.length };
  FULL_LUCIDE_CATALOG.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });
  return counts;
}
