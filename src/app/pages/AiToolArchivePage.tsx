import React, { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useContentItems } from "../hooks/useContentItems";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { SearchBar } from "../components/common/SearchBar";
import { FilterChips, FilterOption } from "../components/common/FilterChips";
import { ToolCard } from "../components/content/ToolCard";
import { Cpu, Sparkles } from "lucide-react";

const PRICING_FILTERS: FilterOption[] = [
  { key: "all", label: "All Pricing", icon: "💎" },
  { key: "free", label: "100% Free", icon: "🎁" },
  { key: "freemium", label: "Freemium", icon: "⚡" },
  { key: "paid", label: "Paid / Pro", icon: "💳" },
];

export const AiToolArchivePage: React.FC = () => {
  const { items, loading } = useContentItems("aiTool");
  const {
    query,
    setQuery,
    selectedPricing,
    setSelectedPricing,
    filteredItems,
    resultCount,
  } = useSearchFilter(items);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <SEO
        title="AI Tools Directory — Curated Generators & Utilities"
        description="Discover handpicked AI tools, motion generators, code assistants, and design automation utilities."
      />
      <SiteHeader />

      <div className="pt-32 pb-24 px-6 md:px-10 max-w-[1600px] mx-auto">
        {/* Header Banner */}
        <div className="mb-12 border-b border-border pb-8">
          <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mono flex items-center gap-1.5 mb-3">
            <Cpu size={12} /> CURATED DIRECTORY
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-foreground">
            AI Tools & Automation.
          </h1>
          <p className="mt-4 text-base text-muted-foreground/80 max-w-2xl font-medium leading-relaxed">
            High-utility AI generators, prompt systems, vector engines, and design workflow assistants—scored and verified for creative professionals.
          </p>

          {/* Search & Pricing Filters */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="w-full md:w-96">
              <SearchBar value={query} onChange={setQuery} placeholder="Search AI tools by name, persona, or capability..." />
            </div>
            <FilterChips
              options={PRICING_FILTERS}
              activeKey={selectedPricing}
              onSelect={setSelectedPricing}
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground mono">
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-primary" /> {resultCount} AI TOOLS FOUND
          </span>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-[300px] rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ToolCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/[0.01]">
            <p className="text-base font-medium text-muted-foreground mb-1">No AI tools match your search criteria.</p>
            <p className="text-xs text-muted-foreground/60">Try adjusting your query or selecting "All Pricing".</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};
export default AiToolArchivePage;
