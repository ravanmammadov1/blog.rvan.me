import { useState, useEffect } from "react";
import { UniversalContentItem } from "../../types/cms";
import { fetchUniversalContentItems } from "../../lib/sanityQueries";

export interface UseContentItemsResult {
  items: UniversalContentItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * React hook to fetch universal content items with caching and loading states.
 * @param contentType Optional vertical content type (e.g. 'aiTool', 'remoteJob', 'scholarship')
 */
export function useContentItems(contentType?: string): UseContentItemsResult {
  const [items, setItems] = useState<UniversalContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUniversalContentItems(contentType);
      setItems(data || []);
    } catch (err: any) {
      console.error("Error in useContentItems hook:", err);
      setError(err?.message || "Failed to load content items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [contentType]);

  return {
    items,
    loading,
    error,
    refetch: loadData,
  };
}
