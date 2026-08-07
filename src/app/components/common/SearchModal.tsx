import React, { useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { ContentCard } from "../content/ContentCard";
import { ToolCard } from "../content/ToolCard";
import { JobCard } from "../content/JobCard";
import { ScholarshipCard } from "../content/ScholarshipCard";
import { UniversalContentItem } from "../../../types/cms";
import { useSearchFilter } from "../../hooks/useSearchFilter";
import { X, Sparkles } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: UniversalContentItem[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, items }) => {
  const { query, setQuery, filteredItems, resultCount } = useSearchFilter(items);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl border border-white/10 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden aurora-card">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Instant search across 11 verticals (AI tools, jobs, courses, fonts)..."
            />
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Counter */}
        <div className="px-6 py-2.5 bg-white/[0.01] border-b border-white/5 flex items-center justify-between text-xs text-muted-foreground mono">
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-primary" /> {resultCount} CURATED ITEMS MATCHED
          </span>
          <span>PRESS ESC TO CLOSE</span>
        </div>

        {/* Results Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-130px)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-scrollbar">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              if (item.contentType === "aiTool") {
                return <ToolCard key={item._id} item={item} />;
              }
              if (item.contentType === "remoteJob") {
                return <JobCard key={item._id} item={item} />;
              }
              if (item.contentType === "scholarship") {
                return <ScholarshipCard key={item._id} item={item} />;
              }
              return <ContentCard key={item._id} item={item} />;
            })
          ) : (
            <div className="col-span-full py-16 text-center text-muted-foreground">
              <p className="text-sm font-medium mb-1">No matching resources found.</p>
              <p className="text-xs text-muted-foreground/60">Try searching for "Figma", "Remote", "AI", "Scholarship", or "Design".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
