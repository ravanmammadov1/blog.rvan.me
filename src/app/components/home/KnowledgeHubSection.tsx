import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Search } from "lucide-react";
import { useContentItems } from "../../hooks/useContentItems";
import { useSearchFilter } from "../../hooks/useSearchFilter";
import { SearchBar } from "../common/SearchBar";
import { FilterChips, FilterOption } from "../common/FilterChips";
import { ContentCard } from "../content/ContentCard";
import { ToolCard } from "../content/ToolCard";
import { JobCard } from "../content/JobCard";
import { ScholarshipCard } from "../content/ScholarshipCard";
import { SearchModal } from "../common/SearchModal";

const VERTICAL_FILTERS: FilterOption[] = [
  { key: "all", label: "All Hub", icon: "⚡" },
  { key: "aiTool", label: "AI Tools", icon: "🤖" },
  { key: "remoteJob", label: "Remote Jobs", icon: "💼" },
  { key: "scholarship", label: "Scholarships", icon: "🎓" },
  { key: "designAsset", label: "Free Assets", icon: "🎨" },
  { key: "freeCourse", label: "Free Courses", icon: "📚" },
  { key: "githubProject", label: "Open Source", icon: "🧑‍💻" },
];

export const KnowledgeHubSection: React.FC = () => {
  const { items, loading } = useContentItems();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const {
    query,
    setQuery,
    selectedVertical,
    setSelectedVertical,
    filteredItems,
  } = useSearchFilter(items);

  const displayItems = filteredItems.slice(0, 8);

  return (
    <section id="knowledge-hub" className="px-6 py-28 md:px-10 md:py-36 border-t border-border relative bg-background/50">
      <div className="mx-auto max-w-[1600px]">
        {/* Section Header */}
        <div className="mb-12 border-b border-border pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mono flex items-center gap-1.5 mb-3">
                <Sparkles size={12} /> DAILY CURATED FEED
              </span>
              <h2 className="text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
                Knowledge & Opportunities.
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground/80 max-w-2xl font-medium leading-relaxed">
                Handpicked design resources, AI tools, global remote jobs, scholarships, and open-source projects—enriched with AI insights.
              </p>
            </div>

            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="group hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold tracking-[.14em] text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all duration-300 mono"
            >
              <Search size={14} className="text-primary" />
              GLOBAL SEARCH <span className="text-[9px] opacity-60">(CMD+K)</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="w-full md:w-96">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search tools, jobs, resources..."
              />
            </div>
            <FilterChips
              options={VERTICAL_FILTERS}
              activeKey={selectedVertical}
              onSelect={setSelectedVertical}
              className="w-full md:w-auto"
            />
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-[300px] rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : displayItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayItems.map((item) => {
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
            })}
          </div>
        ) : (
          <div className="py-16 text-center border border-white/10 rounded-2xl bg-white/[0.01]">
            <p className="text-sm font-medium text-muted-foreground mb-1">No items found for this filter.</p>
            <p className="text-xs text-muted-foreground/60">Try selecting "All Hub" or clearing your search term.</p>
          </div>
        )}

        {/* Bottom CTA to Vertical Hubs */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/resources"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold tracking-widest text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-xl"
          >
            EXPLORE RESOURCES ARCHIVE <ArrowUpRight size={14} />
          </Link>
          <Link
            to="/ai-tools"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-xs font-bold tracking-widest text-foreground uppercase transition-all duration-300 hover:border-primary/50 hover:bg-white/10 glass-sm"
          >
            AI TOOLS DIRECTORY <ArrowUpRight size={14} />
          </Link>
          <Link
            to="/opportunities"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-xs font-bold tracking-widest text-foreground uppercase transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 glass-sm"
          >
            JOBS & SCHOLARSHIPS <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        items={items}
      />
    </section>
  );
};
