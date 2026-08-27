/**
 * BLOG HELPERS & FORMATTING UTILITIES
 * Provides relative publication date calculation (EN & AZ), reading time estimates,
 * and canonical verified author information.
 */

const AZ_MONTHS: Record<string, string> = {
  yanvar: "January",
  fevral: "February",
  mart: "March",
  aprel: "April",
  may: "May",
  iyun: "June",
  i̇yun: "June",
  iyul: "July",
  i̇yul: "July",
  avqust: "August",
  sentyabr: "September",
  oktyabr: "October",
  noyabr: "November",
  dekabr: "December",
};

/**
 * Robust date parser supporting Azerbaijani, English, and ISO date strings.
 */
export function parseBlogDate(dateString?: string): Date | null {
  if (!dateString) return null;
  const str = String(dateString).trim();
  if (!str) return null;

  // 1. Direct standard parse
  const direct = new Date(str);
  if (!isNaN(direct.getTime())) return direct;

  // 2. Normalize Azerbaijani month names (e.g. "24 Avqust 2026", "22 İyul 2026")
  let normalized = str.toLowerCase();
  for (const [az, en] of Object.entries(AZ_MONTHS)) {
    if (normalized.includes(az)) {
      normalized = normalized.replace(az, en);
      break;
    }
  }

  const parsed = new Date(normalized);
  if (!isNaN(parsed.getTime())) return parsed;

  return null;
}

export function formatBlogDate(dateString?: string, language: string = "en"): string {
  if (!dateString) return "";
  try {
    const date = parseBlogDate(dateString);
    if (!date || isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const isAz = language === "az";

    // If future or less than 1 minute ago
    if (diffMs < 60 * 1000 && diffMs >= 0) {
      return isAz ? "İndicə dərc edildi" : "Published just now";
    }

    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    // Under 1 hour
    if (diffMinutes >= 0 && diffMinutes < 60) {
      return isAz
        ? `${diffMinutes} dəqiqə əvvəl`
        : `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
    }

    // Under 24 hours
    if (diffHours >= 0 && diffHours < 24) {
      return isAz
        ? `${diffHours} saat əvvəl`
        : `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    }

    // Yesterday
    if (diffDays === 1) {
      return isAz ? "Dünən" : "Yesterday";
    }

    // 2 to 6 days ago
    if (diffDays >= 2 && diffDays < 7) {
      return isAz ? `${diffDays} gün əvvəl` : `${diffDays} days ago`;
    }

    // 1 to 4 weeks ago
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks >= 1 && diffWeeks <= 4) {
      return isAz
        ? `${diffWeeks} həftə əvvəl`
        : `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
    }

    // Beyond 1 month: fallback to standard locale date string
    const locale = isAz ? "az-AZ" : "en-US";
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString || "";
  }
}

/**
 * Counts total words in a PortableText body or string content.
 */
export function countArticleWords(body?: any): number {
  if (!body) return 0;
  if (typeof body === "string") {
    return body.split(/\s+/).filter(Boolean).length;
  }
  if (!Array.isArray(body)) return 0;

  let count = 0;
  for (const block of body) {
    if (!block) continue;
    if (typeof block === "string") {
      count += block.split(/\s+/).filter(Boolean).length;
      continue;
    }
    if (block._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child && typeof child.text === "string") {
          count += child.text.split(/\s+/).filter(Boolean).length;
        }
      }
    } else if (typeof block.text === "string") {
      count += block.text.split(/\s+/).filter(Boolean).length;
    }
  }
  return count;
}

/**
 * Automatically calculates reading time in minutes based on 200 words = 1 minute.
 */
export function estimateReadingMinutes(body?: any, bodyAz?: any, language: string = "en"): number {
  const isAz = language === "az";
  const activeBody = (isAz && bodyAz && Array.isArray(bodyAz) && bodyAz.length > 0) ? bodyAz : (body || bodyAz);
  const words = countArticleWords(activeBody);
  if (words > 0) {
    return Math.max(1, Math.ceil(words / 200));
  }
  return 2;
}

/**
 * Estimates reading time formatted as string (e.g. "3 min read" or "3 dəq oxu").
 * Strictly applies the 200 words / minute formula when body content is present.
 */
export function estimateReadingTime(
  body?: any[],
  specifiedReadTime?: string,
  language: string = "en",
  bodyAz?: any[]
): string {
  const isAz = language === "az";
  const activeBody = (isAz && bodyAz && Array.isArray(bodyAz) && bodyAz.length > 0) ? bodyAz : (body || bodyAz);
  const words = countArticleWords(activeBody);

  if (words > 0) {
    const minutes = Math.max(1, Math.ceil(words / 200));
    return isAz ? `${minutes} dəq oxu` : `${minutes} min read`;
  }

  // Fallback if body content is not directly loaded
  if (specifiedReadTime && specifiedReadTime.trim().length > 0) {
    const parsedNum = parseInt(specifiedReadTime.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(parsedNum) && parsedNum > 0) {
      return isAz ? `${parsedNum} dəq oxu` : `${parsedNum} min read`;
    }
  }

  return isAz ? "2 dəq oxu" : "2 min read";
}

export const CANONICAL_AUTHOR = {
  id: "ravan-mammadov",
  name: "Ravan Mammadov",
  name_az: "Rəvan Məmmədov",
  role: "Senior Creative Designer & Visual Strategist",
  role_az: "Baş Kreativ Dizayner və Vizual Strateq",
  bio: "Specializing in brand visual architecture, motion dynamics, design systems, and behavioural psychology.",
  bio_az: "Brend vizual arxitekturası, hərəkət dinamikası, dizayn sistemləri və davranış psixologiyası üzrə ixtisaslaşmışdır.",
  avatar: "/imports/ravan_1-400.webp",
  profileUrl: "/ravan-mammadov",
  workplace: "RAM Holding",
  location: "Baku, Azerbaijan",
};

export const DEFAULT_AUTHOR = CANONICAL_AUTHOR;
