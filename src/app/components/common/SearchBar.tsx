import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search resources, AI tools, remote jobs, courses...",
  className = "",
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search size={16} className="absolute left-4 text-muted-foreground/60 pointer-events-none" />
      <input
        type="text"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-10 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 backdrop-blur-xl focus:border-primary/60 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all duration-300 shadow-lg shadow-black/20"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
