import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ArrowUpRight, Globe, MapPin,
  BadgeCheck, Users, Award, ExternalLink,
  SlidersHorizontal, Rss, Clock, Sparkles, Filter, ChevronDown
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

import { fetchResources, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { SiteSettings } from "../types/cms";
import { aggregateAllResources, NormalizedResource } from "../lib/rssAggregator";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export const CATEGORY_MAP: Record<string, { label: string; icon: string }> = {
  all: { label: "All Resources", icon: "⚡" },
  remoteDesignJobs: { label: "Remote Design Jobs", icon: "🎨" },
  remoteMarketingJobs: { label: "Remote Marketing Jobs", icon: "📈" },
  freeDesignAssets: { label: "Free Design Assets", icon: "🎁" },
  freeMockups: { label: "Free Mockups", icon: "📐" },
  freeFonts: { label: "Free Fonts", icon: "🔤" },
  freeIcons: { label: "Free Icons", icon: "⭐" },
  freeUIKits: { label: "Free UI Kits", icon: "📱" },
  designPodcasts: { label: "Design Podcasts", icon: "🎙️" },
};

function formatPubDate(isoStr: string): string {
  try {
    const d = parseISO(isoStr);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch (e) {
    return "Recently";
  }
}

function ResourceCard({ resource, index, isFeatured = false }: { resource: NormalizedResource; index: number; isFeatured?: boolean }) {
  const catConfig = CATEGORY_MAP[resource.category] || { label: resource.category, icon: "📦" };

  // Calculate Verification Badges dynamically
  const officialSources = ["Smashing Magazine", "We Work Remotely", "UX Collective", "Abduzeedo"];
  const isOfficial = officialSources.includes(resource.sourceName);
  const isVerified = !resource.isRss;

  const badgeText = isOfficial ? "Official" : isVerified ? "Verified" : "Community";
  const badgeColor = isOfficial 
    ? "text-blue-400 border-blue-500/30 bg-blue-500/5" 
    : isVerified 
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" 
      : "text-muted-foreground border-white/10 bg-white/5";
  const BadgeIcon = isOfficial ? BadgeCheck : isVerified ? Award : Users;

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      custom={index * 0.04}
      className={cn(
        "group relative flex flex-col p-6 aurora-card min-h-[320px]",
        isFeatured ? "border-primary/35 shadow-[0_0_20px_rgba(232,253,82,0.02)]" : ""
      )}
    >

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Card Header metadata */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-primary mono glass-sm">
            <span className="text-sm">{catConfig.icon}</span>
            {catConfig.label}
          </span>

          <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground/80 mono">
            <Clock size={11} />
            {formatPubDate(resource.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-1 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Publisher / Source */}
        <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-muted-foreground mono">
          <span className="text-foreground/90">{resource.sourceName}</span>
          {resource.isRss && (
            <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">
              <Rss size={9} /> RSS
            </span>
          )}
        </div>

        {/* Snippet Description */}
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground/80 line-clamp-3 flex-1 font-medium">
          {resource.description}
        </p>

        {/* Meta / badging row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-muted-foreground">
          {/* Verification Badge */}
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${badgeColor}`}>
            <BadgeIcon size={11} />
            {badgeText}
          </span>

          {/* Work Type Badge */}
          {resource.workType && resource.workType !== "na" && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400 capitalize">
              {resource.workType}
            </span>
          )}

          {/* Country / Region Badge */}
          {resource.country && (
            <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-foreground/80">
              <Globe size={10} />
              {resource.country}
            </span>
          )}

          {/* Price badge */}
          {resource.isFree && (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-primary font-bold">
              FREE
            </span>
          )}
        </div>
      </div>

      {/* CTA bottom row */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 mt-5">
        <span className="text-[10px] font-semibold text-muted-foreground/60 mono">
          {isFeatured ? "🔥 FEATURED" : "OPPORTUNITY"}
        </span>
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
        >
          <ExternalLink size={11} />
          OPEN RESOURCE
        </a>
      </div>
    </motion.article>
  );
}

// Utility class merger helper function locally to ensure zero import issues
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ResourcesArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [resources, setResources] = useState<NormalizedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Lazy loading pagination state
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter params
  const searchQuery = searchParams.get("q") || "";
  const activeCategory = searchParams.get("category") || "all";
  const activeCountry = searchParams.get("country") || "all";
  const activeWorkType = searchParams.get("workType") || "all";
  const activeDateRange = searchParams.get("date") || "all";
  const activeSource = searchParams.get("source") || "all";
  const activeSort = searchParams.get("sort") || "latest";
  const activePricing = searchParams.get("price") || "all";
  const activeBadge = searchParams.get("badge") || "all";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all" || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
    // Reset visible count on filter updates
    setVisibleCount(12);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((d) => { if (d) setSiteSettings(d); });

    fetchResources()
      .then(async (cmsItems) => {
        const aggregated = await aggregateAllResources(cmsItems);
        setResources(aggregated);
      })
      .catch((err) => console.error("Error loading resources:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter options derived from aggregated resource set
  const sourcesList = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.sourceName))).sort();
  }, [resources]);

  const countriesList = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.country))).filter(Boolean).sort();
  }, [resources]);

  // Derived filter matching operations
  const filteredResources = useMemo(() => {
    let result = resources;

    if (activeCategory !== "all") {
      result = result.filter((r) => r.category === activeCategory);
    }

    if (activeCountry !== "all") {
      result = result.filter((r) => r.country.toLowerCase() === activeCountry.toLowerCase());
    }

    if (activeWorkType !== "all") {
      result = result.filter((r) => r.workType === activeWorkType);
    }

    if (activeSource !== "all") {
      result = result.filter((r) => r.sourceName === activeSource);
    }

    if (activePricing === "free") {
      result = result.filter((r) => r.isFree);
    } else if (activePricing === "paid") {
      result = result.filter((r) => !r.isFree);
    }

    if (activeBadge !== "all") {
      const officialSources = ["Smashing Magazine", "We Work Remotely", "UX Collective", "Abduzeedo"];
      result = result.filter((r) => {
        const isOfficial = officialSources.includes(r.sourceName);
        const isVerified = !r.isRss;
        if (activeBadge === "official") return isOfficial;
        if (activeBadge === "verified") return isVerified && !isOfficial;
        if (activeBadge === "community") return r.isRss && !isOfficial;
        return true;
      });
    }

    if (activeDateRange !== "all") {
      const now = Date.now();
      result = result.filter((r) => {
        const itemTime = new Date(r.publishedAt).getTime();
        const diffHours = (now - itemTime) / (1000 * 60 * 60);
        if (activeDateRange === "today") return diffHours <= 24;
        if (activeDateRange === "week") return diffHours <= 24 * 7;
        if (activeDateRange === "month") return diffHours <= 24 * 30;
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.sourceName?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q)
      );
    }

    // Apply Sorting Options
    const sorted = [...result];
    if (activeSort === "latest") {
      sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (activeSort === "popular") {
      // Sort by RSS priority or custom ordering
      sorted.sort((a, b) => (b.isFree ? 1 : 0) - (a.isFree ? 1 : 0));
    } else if (activeSort === "alphabetical") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [resources, activeCategory, activeCountry, activeWorkType, activeDateRange, activeSource, searchQuery, activeSort, activePricing, activeBadge]);

  // Featured Today: Top 3 high priority items, or the 3 newest items from the active set
  const featuredResources = useMemo(() => {
    const pool = resources.filter((r) => {
      const officialSources = ["Smashing Magazine", "We Work Remotely", "UX Collective", "Abduzeedo"];
      return officialSources.includes(r.sourceName);
    });
    const selectFrom = pool.length >= 3 ? pool : resources;
    return selectFrom.slice(0, 3);
  }, [resources]);

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeCountry !== "all" ||
    activeWorkType !== "all" ||
    activeDateRange !== "all" ||
    activeSource !== "all" ||
    activeSort !== "latest" ||
    activePricing !== "all" ||
    activeBadge !== "all" ||
    !!searchQuery;

  const resetAllFilters = () => setSearchParams({}, { replace: true });

  const loadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Dynamic Opportunities & Resources Directory — Rvan.me"
        description="Auto-updating directory of design news, remote jobs, assets, mockups, fonts, icons, UI kits, and podcasts."
        url="https://www.rvan.me/resources"
      />

      {/* ── Background blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%", left: "-10%",
            width: "60%", height: "70%",
            background: "radial-gradient(ellipse at 40% 40%, rgba(6,182,212,0.08) 0%, rgba(59,130,246,0.04) 45%, transparent 72%)",
            filter: "blur(64px)",
          }}
        />
        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "0%", right: "-12%",
            width: "55%", height: "65%",
            background: "radial-gradient(ellipse at 65% 30%, rgba(139,92,246,0.05) 0%, rgba(59,130,246,0.03) 50%, transparent 78%)",
            filter: "blur(72px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero Header */}
      <section className="px-6 pt-20 pb-6 md:px-10 md:pt-28 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-400 uppercase mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE RSS AGGREGATION ACTIVE
              </span>
            </div>
            
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-5xl">
              Design Resources.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Fully automated creative publication directory. Real-time news, remote design & marketing jobs, mockups, fonts, assets, and design podcasts. Updated hourly.
            </p>
          </motion.div>

          {/* Categories Chip Carousel */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2} className="mt-10 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex items-center gap-2.5 min-w-max">
              {Object.entries(CATEGORY_MAP).map(([key, item]) => {
                const isActive = activeCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => setParam("category", key)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "border-primary bg-primary text-black shadow-[0_0_15px_rgba(232,253,82,0.25)]"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/50 hover:text-foreground glass-sm"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section: 🔥 Featured Today */}
      {!searchQuery && activeCategory === "all" && featuredResources.length > 0 && (
        <section className="px-6 py-6 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px] border-t border-white/10 pt-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>🔥</span> Featured Today
              </h2>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mono">
                Editor's Choice
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredResources.map((resItem, idx) => (
                <ResourceCard key={`feat-${resItem.id}`} resource={resItem} index={idx} isFeatured={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Multi-Facet Filter Bar */}
      <section className="sticky top-[64px] z-20 bg-background/85 backdrop-blur-md border-y border-white/10 px-6 py-4 md:px-10">
        <div className="mx-auto max-w-[1600px] flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Global Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
            <input
              type="text"
              placeholder="Search news, jobs, assets, podcasts…"
              value={searchQuery}
              onChange={(e) => setParam("q", e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setParam("q", "")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Facets & Sorting */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {/* Sorting */}
            <select
              value={activeSort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 glass-sm cursor-pointer"
            >
              <option value="latest">Sort: Latest</option>
              <option value="popular">Sort: Popular</option>
              <option value="alphabetical">Sort: A-Z</option>
            </select>

            {/* Verification Status Badges */}
            <select
              value={activeBadge}
              onChange={(e) => setParam("badge", e.target.value)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 glass-sm cursor-pointer"
            >
              <option value="all">Badge: All</option>
              <option value="official">Official Sources</option>
              <option value="verified">Verified Hubs</option>
              <option value="community">Community Submissions</option>
            </select>

            {/* Price Filter */}
            <select
              value={activePricing}
              onChange={(e) => setParam("price", e.target.value)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 glass-sm cursor-pointer"
            >
              <option value="all">Price: All</option>
              <option value="free">Free Only</option>
              <option value="paid">Paid</option>
            </select>

            {/* Work Type Filter */}
            <select
              value={activeWorkType}
              onChange={(e) => setParam("workType", e.target.value)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 glass-sm cursor-pointer"
            >
              <option value="all">Type: All</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-Site</option>
            </select>

            {/* Country / Region Filter */}
            <select
              value={activeCountry}
              onChange={(e) => setParam("country", e.target.value)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 glass-sm cursor-pointer"
            >
              <option value="all">Region: All</option>
              {countriesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              value={activeDateRange}
              onChange={(e) => setParam("date", e.target.value)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 glass-sm cursor-pointer"
            >
              <option value="all">Date: Any Time</option>
              <option value="today">Past 24 Hours</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mono whitespace-nowrap"
              >
                <X size={12} /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Directory Grid Content */}
      <section className="px-6 py-12 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl border border-white/10 bg-white/5 animate-pulse glass" />
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            /* Beautiful empty state */
            <div className="py-20 text-center glass rounded-2xl border border-white/10 p-12 max-w-xl mx-auto shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none opacity-50" />
              <p className="text-5xl mb-4 relative z-10">🔍</p>
              <h3 className="text-xl font-semibold relative z-10">No opportunities found</h3>
              <p className="text-sm text-muted-foreground mt-2 relative z-10">We couldn't find matching opportunities for the active filters.</p>
              <button
                onClick={resetAllFilters}
                className="mt-6 relative z-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-black uppercase mono hover:scale-105 transition-transform"
              >
                CLEAR FILTER RULES
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between text-xs font-bold text-muted-foreground mono">
                <span>Latest Updates ({filteredResources.length} Found)</span>
                <span>Sorted by {activeSort.toUpperCase()}</span>
              </div>

              {/* Render limited visible resources for performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.slice(0, visibleCount).map((resItem, idx) => (
                  <ResourceCard key={resItem.id} resource={resItem} index={idx} />
                ))}
              </div>

              {/* Load More Button */}
              {filteredResources.length > visibleCount && (
                <div className="mt-16 flex justify-center">
                  <button
                    onClick={loadMore}
                    className="group inline-flex items-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm"
                  >
                    SHOW MORE RESOURCES
                    <ChevronDown size={14} className="transition-transform group-hover:translate-y-0.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
