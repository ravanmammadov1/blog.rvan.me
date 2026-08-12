import React from "react";

export interface FilterOption {
  key: string;
  label: string;
  icon?: string;
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
    <div className={`flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar ${className}`}>
      {options.map((opt) => {
        const isActive = activeKey === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onSelect(opt.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
              isActive
                ? "text-white font-extrabold shadow-[0_0_20px_rgba(97,197,173,0.35)]"
                : "border border-white/10 bg-white/5 hover:border-[#61c5ad]/50 text-muted-foreground hover:text-foreground glass-sm"
            }`}
            style={
              isActive
                ? { background: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)" }
                : {}
            }
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
