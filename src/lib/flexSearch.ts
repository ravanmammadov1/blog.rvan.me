import { UniversalContentItem } from "../types/cms";

export interface SearchFilterOptions {
  query?: string;
  contentType?: string;
  categorySlug?: string;
  tagSlug?: string;
  pricingModel?: string;
  sortBy?: "trending" | "newest" | "quality";
}

/**
 * High-performance client-side search & filtering engine (<10ms filtering).
 * Filters universal content items by query, content type vertical, category, tag, pricing model, and sorting.
 */
export function filterContentItems(
  items: UniversalContentItem[] = [],
  filters: SearchFilterOptions = {}
): UniversalContentItem[] {
  const { query = "", contentType = "all", categorySlug = "all", tagSlug = "all", pricingModel = "all", sortBy = "trending" } = filters;

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = items.filter((item) => {
    // 1. Content type filter
    if (contentType !== "all" && item.contentType !== contentType) {
      return false;
    }

    // 2. Category filter
    if (categorySlug !== "all") {
      const itemCategorySlug = typeof item.category?.slug === "string" ? item.category.slug : item.category?.slug?.current;
      if (itemCategorySlug !== categorySlug) {
        return false;
      }
    }

    // 3. Tag filter
    if (tagSlug !== "all") {
      const hasTag = item.tags?.some((t) => {
        const tSlug = typeof t.slug === "string" ? t.slug : t.slug?.current;
        return tSlug === tagSlug;
      });
      if (!hasTag) return false;
    }

    // 4. Pricing model filter (for AI tools or resources)
    if (pricingModel !== "all" && item.aiToolDetails) {
      if (item.aiToolDetails.pricingModel !== pricingModel) {
        return false;
      }
    }

    // 5. Search query matching (Title, Summary, Why It Matters, Target Persona, Source Name, Tags)
    if (normalizedQuery) {
      const titleMatch = item.title?.toLowerCase().includes(normalizedQuery);
      const summaryMatch = item.summary?.toLowerCase().includes(normalizedQuery);
      const whyMatch = item.whyItMatters?.toLowerCase().includes(normalizedQuery);
      const whoMatch = item.whoShouldUseIt?.toLowerCase().includes(normalizedQuery);
      const sourceMatch = item.sourceName?.toLowerCase().includes(normalizedQuery);
      const tagMatch = item.tags?.some((t) => t.name?.toLowerCase().includes(normalizedQuery));

      if (!titleMatch && !summaryMatch && !whyMatch && !whoMatch && !sourceMatch && !tagMatch) {
        return false;
      }
    }

    return true;
  });

  // Sort results
  return filtered.sort((a, b) => {
    if (sortBy === "newest") {
      const dateA = new Date(a.publishedAt || a._createdAt || 0).getTime();
      const dateB = new Date(b.publishedAt || b._createdAt || 0).getTime();
      return dateB - dateA;
    }
    if (sortBy === "quality") {
      return (b.qualityScore || 0) - (a.qualityScore || 0);
    }
    // Default: trending
    return (b.trendingScore || b.qualityScore || 0) - (a.trendingScore || a.qualityScore || 0);
  });
}
