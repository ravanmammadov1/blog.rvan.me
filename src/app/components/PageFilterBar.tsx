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
 * Enforces responsive layout logic:
 * - Desktop (lg+): Flex-wrap category pills on the left, fixed search on the right. No clipping or hiding.
 * - Tablet (md): Clean stacking/wrapping so controls never collide.
 * - Mobile (<md): Full-width search bar on top, touch-smooth horizontal scrollable pill track below with edge padding.
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
  stickyTopClass = "top-[58px] md:top-[68px]",
  children,
}: PageFilterBarProps) {
  return (
    <section
      className={`sticky ${stickyTopClass} z-30 px-4 sm:px-6 md:px-10 py-3.5 bg-background/90 backdrop-blur-xl border-y border-border/80 transition-all ${className}`}
    >
      <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row md:items-center justify-between gap-3.5 md:gap-6">
        {/* CATEGORY FILTERS:
            - Mobile: single-line horizontal scrollable track
            - Tablet/Desktop: flexible wrapping pill group */}
        <div className="flex-1 min-w-0 w-full">
          <div
            className="flex items-center md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible scrollbar-none py-1 px-0.5 scroll-smooth touch-pan-x"
            role="tablist"
            aria-label="Category filters"
          >
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
                  className="shrink-0 whitespace-nowrap text-xs cursor-pointer"
                  role="tab"
                  aria-selected={isActive}
                >
                  <span>{cat.label}</span>
                </Button>
              );
            })}
            {/* Trailing spacer so the last pill is never clipped flush on mobile touch scroll */}
            <div className="w-4 shrink-0 md:hidden" aria-hidden="true" />
          </div>
        </div>

        {/* SEARCH FIELD:
            - Mobile: Full width
            - Tablet/Desktop: Independent shrink-0 container with dedicated width */}
        <div className="w-full md:w-72 lg:w-80 shrink-0 relative">
          <label htmlFor={searchId} className="sr-only">
            {searchPlaceholder}
          </label>
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none"
            size={15}
          />
          <input
            id={searchId}
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-border bg-card/90 pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
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
