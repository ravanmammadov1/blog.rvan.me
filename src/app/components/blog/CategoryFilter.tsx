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
            className={`rounded-full border px-5 py-2.5 text-[11px] font-bold tracking-[.14em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#61c5ad] ${
              active
                ? "text-white font-extrabold shadow-[0_0_20px_rgba(97,197,173,0.35)]"
                : "border-white/10 bg-white/5 text-muted-foreground hover:border-[#61c5ad]/50 hover:text-foreground glass-sm"
            }`}
            style={
              active
                ? { background: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)" }
                : {}
            }
          >
            {category.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}