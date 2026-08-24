import React from "react";

export interface FilterOption {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterChipsProps {
  options: FilterOption[];
  activeKey: string;
  onSelect: (key: string) => void;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  activeKey,
  onSelect,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth touch-pan-x min-w-0 ${className}`}>
      {options.map((opt) => {
        const isActive = activeKey === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onSelect(opt.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              isActive
                ? "text-white font-extrabold shadow-md shadow-primary/20"
                : "border border-[#DDE1E0] dark:border-white/10 bg-white/90 dark:bg-white/5 hover:border-primary/50 text-foreground dark:text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/10 shadow-2xs"
            }`}
            style={
              isActive
                ? { background: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)" }
                : {}
            }
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
