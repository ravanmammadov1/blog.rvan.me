export function formatBlogDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function estimateReadingTime(body?: any[], specifiedReadTime?: string): string {
  if (specifiedReadTime && specifiedReadTime.trim().length > 0) {
    return specifiedReadTime;
  }
  if (!body || !Array.isArray(body)) return "3 min read";

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
  return `${minutes} min read`;
}

export const DEFAULT_AUTHOR = {
  name: "Ravan Mammadov",
  role: "Senior Creative Designer & Director",
  bio: "Crafting digital experiences, motion direction, and high-performance brand identities.",
  avatar: "/assets/Ravan-DAugJKGR.png",
};
