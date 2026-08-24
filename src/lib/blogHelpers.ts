/**
 * BLOG HELPERS & FORMATTING UTILITIES
 * Provides relative publication date calculation (EN & AZ), reading time estimates,
 * and canonical verified author information.
 */

export function formatBlogDate(dateString?: string, language: string = "en"): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const isAz = language === "az";

    // If future or less than 1 minute ago
    if (diffMs < 60 * 1000) {
      return isAz ? "İndicə dərc edildi" : "Published just now";
    }

    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    // Under 1 hour
    if (diffMinutes < 60) {
      return isAz
        ? `${diffMinutes} dəqiqə əvvəl`
        : `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
    }

    // Under 24 hours
    if (diffHours < 24) {
      return isAz
        ? `${diffHours} saat əvvəl`
        : `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    }

    // Yesterday
    if (diffDays === 1) {
      return isAz ? "Dünən" : "Yesterday";
    }

    // 2 to 6 days ago
    if (diffDays < 7) {
      return isAz ? `${diffDays} gün əvvəl` : `${diffDays} days ago`;
    }

    // 1 to 4 weeks ago
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks <= 4) {
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
    return "";
  }
}

export function estimateReadingTime(body?: any[], specifiedReadTime?: string, language: string = "en"): string {
  const isAz = language === "az";
  if (specifiedReadTime && specifiedReadTime.trim().length > 0) {
    if (isAz && specifiedReadTime.includes("min read")) {
      return specifiedReadTime.replace("min read", "dəq oxu");
    }
    return specifiedReadTime;
  }
  if (!body || !Array.isArray(body)) return isAz ? "3 dəq oxu" : "3 min read";

  let wordCount = 0;
  for (const block of body) {
    if (block._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child.text) {
          wordCount += child.text.split(/\s+/).filter(Boolean).length;
        }
      }
    }
  }

  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return isAz ? `${minutes} dəq oxu` : `${minutes} min read`;
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
