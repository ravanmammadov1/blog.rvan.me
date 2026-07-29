import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ArrowUpRight, Globe, MapPin,
  BadgeCheck, Users, Award, ExternalLink,
  Layers, ChevronDown, SlidersHorizontal, Rss, Clock, Sparkles
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
  all: { label: "All Opportunities", icon: "⚡" },
  scholarships: { label: "Scholarships", icon: "🎓" },
  remoteJobs: { label: "Remote Jobs", icon: "💼" },
  juniorJobs: { label: "Junior Jobs", icon: "🧑‍💻" },
  designJobs: { label: "Design Jobs", icon: "🎨" },
  marketingJobs: { label: "Marketing Jobs", icon: "📈" },
  aiNews: { label: "AI News", icon: "🤖" },
  techNews: { label: "Tech News", icon: "📰" },
  startupNews: { label: "Startup News", icon: "🚀" },
  freeCourses: { label: "Free Courses", icon: "📚" },
  tutorials: { label: "Tutorials", icon: "🎥" },
  designResources: { label: "Design Resources", icon: "🛠" },
  freeAssets: { label: "Free Assets", icon: "🎁" },
  grants: { label: "Grants", icon: "💰" },
  competitions: { label: "Competitions", icon: "🏆" },
  conferences: { label: "Conferences", icon: "🌍" },
  events: { label: "Events", icon: "📅" },
};

function formatPubDate(isoStr: string): string {
  try {
    const d = parseISO(isoStr);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch (e) {
    return "Recently";
  }
}

function ResourceCard({ resource, index }: { resource: NormalizedResource; index: number }) {
  const catConfig = CATEGORY_MAP[resource.category] || { label: resource.category, icon: "📦" };

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      custom={index * 0.04}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 glass transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5 overflow-hidden min-h-[300px]"
    >
      {/* Dynamic Aurora Glow */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: "radial-gradient(circle at top right, rgba(6,182,212,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Source & Date Bar */}
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

        {/* Source Badge */}
        <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-muted-foreground mono">
          <span className="text-foreground/90">{resource.sourceName}</span>
          {resource.isRss && (
            <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">
              <Rss size={9} /> RSS
            </span>
          )}
        </div>

        {/* Summary Description */}
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground/80 line-clamp-3 flex-1 font-medium">
          {resource.description}
        </p>

        {/* Badges / Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-muted-foreground">
          {resource.workType && resource.workType !== "na" && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400 capitalize">
              {resource.workType}
            </span>
          )}
          {resource.country && (
            <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-foreground/80">
              <Globe size={10} />
              {resource.country}
            </span>
          )}
          {resource.isFree && (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-primary font-bold">
              FREE
            </span>
          )}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 mt-5">
        <span className="text-[10px] font-semibold text-muted-foreground/60 mono">
          VERIFIED SOURCE
        </span>
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
        >
          <ExternalLink size={11} />
          ACCESS
        </a>
      </div>
    </motion.article>
  );
}

export default function ResourcesArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [resources, setResources] = useState<NormalizedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter params
  const searchQuery = searchParams.get("q") || "";
  const activeCategory = searchParams.get("category") || "all";
  const activeCountry = searchParams.get("country") || "all";
  const activeWorkType = searchParams.get("workType") || "all";
  const activeDateRange = searchParams.get("date") || "all";
  const activeSource = searchParams.get("source") || "all";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all" || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
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

  // Filter options derived from current resources
  const sourcesList = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.sourceName))).sort();
  }, [resources]);

  const countriesList = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.country))).filter(Boolean).sort();
  }, [resources]);

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

    return result;
  }, [resources, activeCategory, activeCountry, activeWorkType, activeDateRange, activeSource, searchQuery]);

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeCountry !== "all" ||
    activeWorkType !== "all" ||
    activeDateRange !== "all" ||
    activeSource !== "all" ||
    !!searchQuery;

  const resetAllFilters = () => setSearchParams({}, { replace: true });

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <SEO
        title="Dynamic Opportunities & Resources Directory — Rvan.me"
        description="Auto-updating directory of scholarships, remote jobs, AI updates, tech news, free courses, grants, and startup competitions."
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
      <section className="px-6 pt-20 pb-10 md:px-10 md:pt-28 relative z-10">
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
              Dynamic Resources.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Auto-updating feed of scholarships, remote jobs, AI updates, startup news, free courses, and creative assets. Sourced globally, updated hourly.
            </p>
          </motion.div>

          {/* Dynamic Category Chips Scroll */}
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

      {/* Multi-Facet Search & Filter Bar */}
      <section className="sticky top-[64px] z-20 bg-background/85 backdrop-blur-md border-y border-white/10 px-6 py-4 md:px-10">
        <div className="mx-auto max-w-[1600px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Global Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
            <input
              type="text"
              placeholder="Search opportunities, sources, titles…"
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

          {/* Multi-Facet Filter Selectors */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {/* Work Type Filter */}
            <select
              value={activeWorkType}
              onChange={(e) => setParam("workType", e.target.value)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 glass-sm cursor-pointer"
            >
              <option value="all">Work Type: All</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>

            {/* Country Filter */}
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

            {/* Source Filter */}
            {sourcesList.length > 0 && (
              <select
                value={activeSource}
                onChange={(e) => setParam("source", e.target.value)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 glass-sm cursor-pointer hidden lg:block"
              >
                <option value="all">Source: All</option>
                {sourcesList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mono"
              >
                <X size={12} /> Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Directory Content Grid */}
      <section className="px-6 py-12 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl border border-white/10 bg-white/5 animate-pulse glass" />
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="py-20 text-center glass rounded-2xl border border-white/10 p-12">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-xl font-bold">No opportunities found</h3>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
              <button
                onClick={resetAllFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-black uppercase mono"
              >
                CLEAR ALL FILTERS
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between text-xs font-bold text-muted-foreground mono">
                <span>SHOWING {filteredResources.length} OPPORTUNITIES</span>
                <span>SORTED BY RECENT</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resItem, idx) => (
                  <ResourceCard key={resItem.id} resource={resItem} index={idx} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
