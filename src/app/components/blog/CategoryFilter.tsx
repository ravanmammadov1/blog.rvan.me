interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  counts?: Record<string, number>;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onChange,
  counts,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3" role="tablist" aria-label="Filter articles by category">
      {categories.map((category) => {
        const active = activeCategory === category;
        const count = counts?.[category];

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            role="tab"
            aria-selected={active}
            className={`rounded-full border px-5 py-2.5 text-[11px] font-bold tracking-[.14em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {category.toUpperCase()}
            {count !== undefined && (
              <span
                className={`ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}