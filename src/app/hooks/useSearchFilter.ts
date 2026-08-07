import { useState, useMemo } from "react";
import { UniversalContentItem } from "../../types/cms";
import { filterContentItems, SearchFilterOptions } from "../../lib/flexSearch";

export interface UseSearchFilterResult {
  query: string;
  setQuery: (q: string) => void;
  selectedVertical: string;
  setSelectedVertical: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedTag: string;
  setSelectedTag: (t: string) => void;
  selectedPricing: string;
  setSelectedPricing: (p: string) => void;
  sortBy: "trending" | "newest" | "quality";
  setSortBy: (s: "trending" | "newest" | "quality") => void;
  filteredItems: UniversalContentItem[];
  resultCount: number;
  resetFilters: () => void;
}

/**
 * React hook for managing multi-facet search, vertical filters, and sorting state.
 */
export function useSearchFilter(initialItems: UniversalContentItem[] = []): UseSearchFilterResult {
  const [query, setQuery] = useState("");
  const [selectedVertical, setSelectedVertical] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [sortBy, setSortBy] = useState<"trending" | "newest" | "quality">("trending");

  const filterOptions: SearchFilterOptions = useMemo(
    () => ({
      query,
      contentType: selectedVertical,
      categorySlug: selectedCategory,
      tagSlug: selectedTag,
      pricingModel: selectedPricing,
      sortBy,
    }),
    [query, selectedVertical, selectedCategory, selectedTag, selectedPricing, sortBy]
  );

  const filteredItems = useMemo(() => {
    return filterContentItems(initialItems, filterOptions);
  }, [initialItems, filterOptions]);

  const resetFilters = () => {
    setQuery("");
    setSelectedVertical("all");
    setSelectedCategory("all");
    setSelectedTag("all");
    setSelectedPricing("all");
    setSortBy("trending");
  };

  return {
    query,
    setQuery,
    selectedVertical,
    setSelectedVertical,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    selectedPricing,
    setSelectedPricing,
    sortBy,
    setSortBy,
    filteredItems,
    resultCount: filteredItems.length,
    resetFilters,
  };
}
