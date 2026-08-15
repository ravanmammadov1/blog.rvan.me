import React from "react";
import { Search, X } from "lucide-react";
import { Button } from "./ui/Button";

export interface FilterOption {
  key: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface PageFilterBarProps {
  categories: FilterOption[];
  activeCategory: string;
  onSelectCategory: (key: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  searchId?: string;
  className?: string;
  stickyTopClass?: string;
  children?: React.ReactNode;
}

/**
 * Master PageFilterBar Component
 * Enforces standardized side-by-side (Categories Left, Search Right) layout logic
 * across News, Resources, Tools, and Blog listing pages.
 */
export function PageFilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  searchId = "page-filter-search",
  className = "",
  stickyTopClass = "top-20",
  children,
}: PageFilterBarProps) {
  return (
    <section
      className={`sticky ${stickyTopClass} z-30 px-6 py-4 md:px-10 bg-background/80 backdrop-blur-xl border-y border-border ${className}`}
    >
      <div className="mx-auto max-w-[1600px] flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
        {/* LEFT: Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <Button
                key={cat.key}
                variant="filter"
                size="sm"
                active={isActive}
                onClick={() => onSelectCategory(cat.key)}
                icon={cat.icon}
                iconPosition="left"
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span className={`text-[10px] ml-1 ${isActive ? "text-white/90" : "text-muted-foreground"}`}>
                    ({cat.count})
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* RIGHT: Standardized Search Field */}
        <div className="relative w-full md:w-80 shrink-0">
          <label htmlFor={searchId} className="sr-only">
            {searchPlaceholder}
          </label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" size={15} />
          <input
            id={searchId}
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-border bg-card pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {children && <div className="mx-auto max-w-[1600px] mt-3">{children}</div>}
    </section>
  );
}

export default PageFilterBar;
