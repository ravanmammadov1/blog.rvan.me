import React, { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useContentItems } from "../hooks/useContentItems";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { SearchBar } from "../components/common/SearchBar";
import { FilterChips, FilterOption } from "../components/common/FilterChips";
import { JobCard } from "../components/content/JobCard";
import { ScholarshipCard } from "../components/content/ScholarshipCard";
import { ContentCard } from "../components/content/ContentCard";
import { Briefcase, Sparkles, Globe, GraduationCap, Trophy } from "lucide-react";

const OPPORTUNITY_FILTERS: FilterOption[] = [
  { key: "all", label: "All Opportunities", icon: <Globe size={13} /> },
  { key: "remoteJob", label: "Remote Jobs", icon: <Briefcase size={13} /> },
  { key: "scholarship", label: "Scholarships & Grants", icon: <GraduationCap size={13} /> },
  { key: "competition", label: "Contests & Hackathons", icon: <Trophy size={13} /> },
];

export const OpportunityArchivePage: React.FC = () => {
  const { items, loading } = useContentItems();
  const {
    query,
    setQuery,
    selectedVertical,
    setSelectedVertical,
    filteredItems,
    resultCount,
  } = useSearchFilter(items);

  // Filter items specifically for opportunity types if 'all' is selected
  const opportunityItems = filteredItems.filter((item) =>
    selectedVertical === "all"
      ? ["remoteJob", "scholarship", "competition"].includes(item.contentType)
      : item.contentType === selectedVertical
  );

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <SEO
        title="Global Opportunities — Remote Jobs, Scholarships & Grants"
        description="Browse curated global remote design jobs, tech opportunities, academic scholarships, and hackathons."
      />
      <SiteHeader />

      <div className="pt-32 pb-24 px-6 md:px-10 max-w-[1600px] mx-auto">
        {/* Header Banner */}
        <div className="mb-12 border-b border-border pb-8">
          <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase mono flex items-center gap-1.5 mb-3">
            <Briefcase size={12} /> CAREER & FUNDING HUB
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-foreground">
            Jobs, Scholarships & Contests.
          </h1>
          <p className="mt-4 text-base text-muted-foreground/80 max-w-2xl font-medium leading-relaxed">
            Verified remote positions, creative grants, academic scholarships, and high-impact design challenges with active deadlines.
          </p>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="w-full md:w-96">
              <SearchBar value={query} onChange={setQuery} placeholder="Search jobs by role, salary, company, or grant name..." />
            </div>
            <FilterChips
              options={OPPORTUNITY_FILTERS}
              activeKey={selectedVertical}
              onSelect={setSelectedVertical}
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground mono">
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-400" /> {opportunityItems.length} OPPORTUNITIES AVAILABLE
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-[300px] rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : opportunityItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunityItems.map((item) => {
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
          <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/[0.01]">
            <p className="text-base font-medium text-muted-foreground mb-1">No opportunities match your filter.</p>
            <p className="text-xs text-muted-foreground/60">Try adjusting your query or selecting "All Opportunities".</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};
export default OpportunityArchivePage;
