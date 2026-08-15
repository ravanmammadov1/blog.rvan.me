import * as LucideIcons from "lucide-react";
import { isFuzzyMatch } from "./fuzzySearch";

export interface IconItem {
  id: string;
  name: string;
  componentName: string;
  category: string;
  tags: string[];
}

export const ICON_CATEGORIES = [
  "All",
  "Interface & Controls",
  "Navigation & Arrows",
  "Design & Media",
  "Communication & Mail",
  "Commerce & Finance",
  "Tech & Code",
  "Files & Documents",
  "Users & Security",
  "Time & Calendar",
  "Weather & Nature",
  "Miscellaneous",
] as const;

export type IconCategory = typeof ICON_CATEGORIES[number];

// Helper to determine category based on icon name keywords
function categorizeIcon(name: string): string {
  const lower = name.toLowerCase();

  if (
    lower.includes("arrow") ||
    lower.includes("chevron") ||
    lower.includes("corner") ||
    lower.includes("move") ||
    lower.includes("navigate") ||
    lower.includes("locate") ||
    lower.includes("map") ||
    lower.includes("compass")
  ) {
    return "Navigation & Arrows";
  }

  if (
    lower.includes("image") ||
    lower.includes("video") ||
    lower.includes("camera") ||
    lower.includes("music") ||
    lower.includes("audio") ||
    lower.includes("palette") ||
    lower.includes("brush") ||
    lower.includes("pen") ||
    lower.includes("paint") ||
    lower.includes("layer") ||
    lower.includes("figma") ||
    lower.includes("canvas")
  ) {
    return "Design & Media";
  }

  if (
    lower.includes("mail") ||
    lower.includes("message") ||
    lower.includes("send") ||
    lower.includes("inbox") ||
    lower.includes("phone") ||
    lower.includes("call") ||
    lower.includes("share") ||
    lower.includes("chat") ||
    lower.includes("bell")
  ) {
    return "Communication & Mail";
  }

  if (
    lower.includes("dollar") ||
    lower.includes("credit") ||
    lower.includes("card") ||
    lower.includes("coins") ||
    lower.includes("wallet") ||
    lower.includes("shopping") ||
    lower.includes("cart") ||
    lower.includes("bag") ||
    lower.includes("tag") ||
    lower.includes("percent") ||
    lower.includes("receipt")
  ) {
    return "Commerce & Finance";
  }

  if (
    lower.includes("code") ||
    lower.includes("terminal") ||
    lower.includes("cpu") ||
    lower.includes("database") ||
    lower.includes("server") ||
    lower.includes("cloud") ||
    lower.includes("git") ||
    lower.includes("wifi") ||
    lower.includes("monitor") ||
    lower.includes("laptop") ||
    lower.includes("sparkles") ||
    lower.includes("bot")
  ) {
    return "Tech & Code";
  }

  if (
    lower.includes("file") ||
    lower.includes("folder") ||
    lower.includes("document") ||
    lower.includes("clipboard") ||
    lower.includes("book") ||
    lower.includes("archive") ||
    lower.includes("paper")
  ) {
    return "Files & Documents";
  }

  if (
    lower.includes("user") ||
    lower.includes("person") ||
    lower.includes("users") ||
    lower.includes("shield") ||
    lower.includes("lock") ||
    lower.includes("key") ||
    lower.includes("fingerprint") ||
    lower.includes("eye") ||
    lower.includes("keyhole")
  ) {
    return "Users & Security";
  }

  if (
    lower.includes("clock") ||
    lower.includes("time") ||
    lower.includes("calendar") ||
    lower.includes("timer") ||
    lower.includes("watch") ||
    lower.includes("history") ||
    lower.includes("hourglass")
  ) {
    return "Time & Calendar";
  }

  if (
    lower.includes("sun") ||
    lower.includes("moon") ||
    lower.includes("cloud") ||
    lower.includes("rain") ||
    lower.includes("wind") ||
    lower.includes("zap") ||
    lower.includes("tree") ||
    lower.includes("leaf") ||
    lower.includes("flame")
  ) {
    return "Weather & Nature";
  }

  if (
    lower.includes("check") ||
    lower.includes("x") ||
    lower.includes("plus") ||
    lower.includes("minus") ||
    lower.includes("filter") ||
    lower.includes("search") ||
    lower.includes("grid") ||
    lower.includes("list") ||
    lower.includes("settings") ||
    lower.includes("sliders") ||
    lower.includes("help") ||
    lower.includes("info") ||
    lower.includes("alert")
  ) {
    return "Interface & Controls";
  }

  return "Miscellaneous";
}

// Format Lucide PascalCase component name into human-readable spaced title
function formatIconName(pascalName: string): string {
  return pascalName
    .replace(/([A-[Z])/g, " $1")
    .replace(/^ /, "")
    .trim();
}

// Generate tags for rich searchability
function generateIconTags(componentName: string, humanName: string, category: string): string[] {
  const words = humanName.toLowerCase().split(" ");
  return Array.from(new Set([...words, componentName.toLowerCase(), category.toLowerCase(), "lucide", "vector", "icon"]));
}

// Dynamically extract ALL 1,500+ vector icons exported by lucide-react at runtime
function buildFullLucideCatalog(): IconItem[] {
  const allExports = Object.keys(LucideIcons);
  const catalog: IconItem[] = [];

  const blacklist = new Set([
    "default",
    "createLucideIcon",
    "LucideIcon",
    "LucideProps",
    "Icon",
    "icons",
  ]);

  for (const expKey of allExports) {
    if (
      blacklist.has(expKey) ||
      !/^[A-Z]/.test(expKey) ||
      expKey.endsWith("Icon") ||
      typeof (LucideIcons as any)[expKey] !== "object" && typeof (LucideIcons as any)[expKey] !== "function"
    ) {
      continue;
    }

    const humanName = formatIconName(expKey);
    const category = categorizeIcon(expKey);
    const tags = generateIconTags(expKey, humanName, category);

    catalog.push({
      id: `lucide-${expKey.toLowerCase()}`,
      name: humanName,
      componentName: expKey,
      category,
      tags,
    });
  }

  return catalog;
}

// Singleton full catalog instance containing ALL 1,500+ Lucide icons
export const FULL_LUCIDE_CATALOG: IconItem[] = buildFullLucideCatalog();
export const LUCIDE_ICON_CATALOG = FULL_LUCIDE_CATALOG;

export function searchLucideIcons(
  query: string,
  category: IconCategory = "All"
): IconItem[] {
  let result = FULL_LUCIDE_CATALOG;

  if (category !== "All") {
    result = result.filter((icon) => icon.category === category);
  }

  if (query.trim()) {
    result = result.filter((icon) =>
      isFuzzyMatch(query, `${icon.name} ${icon.componentName}`, icon.tags)
    );
  }

  return result;
}

export function getIconCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = { All: FULL_LUCIDE_CATALOG.length };
  FULL_LUCIDE_CATALOG.forEach((icon) => {
    counts[icon.category] = (counts[icon.category] || 0) + 1;
  });
  return counts;
}
