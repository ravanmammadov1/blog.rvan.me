import { useState, useMemo, useCallback, useEffect } from "react";

export interface ProgressiveRenderingOptions {
  initialBatchSize: number;
  stepBatchSize: number;
  resetDependencies?: any[];
}

export function useProgressiveRendering<T>(
  items: T[],
  options: ProgressiveRenderingOptions
) {
  const { initialBatchSize, stepBatchSize, resetDependencies = [] } = options;
  const [visibleCount, setVisibleCount] = useState<number>(initialBatchSize);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Reset visible count back to initial batch size whenever search / tab filter changes
  useEffect(() => {
    setVisibleCount(initialBatchSize);
  }, [initialBatchSize, ...resetDependencies]);

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);

  const hasMore = visibleCount < items.length;
  const remainingCount = Math.max(0, items.length - visibleCount);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    // Smooth UI batch load delay to prevent double clicks and provide visual feedback
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + stepBatchSize, items.length));
      setIsLoadingMore(false);
    }, 150);
  }, [isLoadingMore, hasMore, stepBatchSize, items.length]);

  return {
    visibleItems,
    hasMore,
    remainingCount,
    loadMore,
    isLoadingMore,
    totalCount: items.length,
    renderedCount: visibleItems.length,
  };
}
