import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, X, ArrowUpRight, Globe, MapPin,
  BadgeCheck, Users, Award, ExternalLink,
  Layers, ChevronDown, SlidersHorizontal
} from "lucide-react";

import { fetchResources, fetchResourceCategories, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ResourceItem, ResourceCategory, SiteSettings } from "../types/cms";
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

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  studentPack: "Student Pack",
  aiCredits: "AI Credits",
  software: "Free Software",
  roadmap: "Learning Roadmap",
  scholarship: "Scholarship",
  internship: "Internship",
  job: "Remote Job",
  hackathon: "Hackathon",
  startupProgram: "Startup Program",
};

const RESOURCE_TYPE_ICONS: Record<string, string> = {
  studentPack: "🎒",
  aiCredits: "🤖",
  software: "💻",
  roadmap: "🗺️",
  scholarship: "🎓",
  internship: "🏢",
  job: "💼",
  hackathon: "⚡",
  startupProgram: "🚀",
};

const BADGE_COLORS: Record<string, string> = {
  Free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Popular: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Trending: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Partner: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Hot: "bg-red-500/10 text-red-400 border-red-500/20",
  Limited: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const VERIFICATION_CONFIG = {
  official: { label: "Official", icon: BadgeCheck, color: "text-blue-400" },
  verified: { label: "Verified", icon: Award, color: "text-emerald-400" },
  community: { label: "Community", icon: Users, color: "text-muted-foreground" },
};

function ResourceCard({ resource, index }: { resource: ResourceItem; index: number }) {
  const logoUrl = resource.logo ? urlFor(resource.logo)?.width(80).url() : null;
  const slug = resource.slug?.current || resource._id;
  const typeLabel = RESOURCE_TYPE_LABELS[resource.resourceType] || resource.resourceType;
  const typeIcon = RESOURCE_TYPE_ICONS[resource.resourceType] || "📦";
  const verification = VERIFICATION_CONFIG[resource.verificationStatus] ?? VERIFICATION_CONFIG.community;
  const VerifyIcon = verification.icon;

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index * 0.05}
      className="group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Badges row */}
      {resource.badges && resource.badges.length > 0 && (
        <div className="absolute top-4 right-4 flex flex-wrap gap-1 justify-end">
          {resource.badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase ${BADGE_COLORS[badge] ?? "bg-surface text-muted-foreground border-border"}`}
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Header: logo + type */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={resource.title}
              className="h-11 w-11 rounded-xl object-contain border border-border bg-background p-1.5"
            />
          ) : (
            <div className="h-11 w-11 rounded-xl border border-border bg-background flex items-center justify-center text-xl">
              {typeIcon}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono">{typeLabel}</span>
          <h3 className="mt-0.5 text-base font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors pr-14">
            {resource.title}
          </h3>
        </div>
      </div>

      {/* Benefit summary callout */}
      {resource.benefitSummary && (
        <div className="mb-3 rounded-lg bg-primary/8 border border-primary/15 px-3 py-2">
          <p className="text-xs font-bold text-primary">{resource.benefitSummary}</p>
        </div>
      )}

      {/* Description */}
      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 mb-4 flex-1">
        {resource.description}
      </p>

      {/* Meta: verification + geo */}
      <div className="flex items-center gap-3 mb-4 text-[10px] font-semibold text-muted-foreground">
        <span className={`flex items-center gap-1 ${verification.color}`}>
          <VerifyIcon size={11} />
          {verification.label}
        </span>
        <span className="w-px h-3 bg-border" />
        <span className="flex items-center gap-1">
          {resource.isGlobal ? (
            <><Globe size={11} /> Global</>
          ) : (
            <><MapPin size={11} /> {resource.countries?.slice(0, 3).join(", ") || "Select Countries"}</>
          )}
        </span>
        {/* Difficulty for roadmaps */}
        {resource.difficultyLevel && resource.difficultyLevel !== "all" && (
          <>
            <span className="w-px h-3 bg-border" />
            <span className="capitalize">{resource.difficultyLevel}</span>
          </>
        )}
      </div>

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {resource.tags.slice(0, 4).map((tag) => (
            <span
              key={tag._id}
              className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center justify-between border-t border-border/50 pt-4">
        <Link
          to={`/resources/${slug}`}
          className="text-[10px] font-bold tracking-widest text-primary mono uppercase hover:underline flex items-center gap-1"
        >
          VIEW RESOURCE <ArrowUpRight size={12} />
        </Link>
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (resource.analyticsId) {
              // Analytics hook point — replace with your tracker
              console.debug("[resource-click]", resource.analyticsId);
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground transition-all hover:border-primary hover:text-primary"
        >
          <ExternalLink size={10} />
          ACCESS
        </a>
      </div>
    </motion.article>
  );
}

export default function ResourcesArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // State from URL params for shareable filters
  const searchQuery = searchParams.get("q") || "";
  const activeType = searchParams.get("type") || "all";
  const activeCat = searchParams.get("category") || "all";
  const activeCountry = searchParams.get("country") || "all";

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
    Promise.all([fetchResources(), fetchResourceCategories()])
      .then(([res, cats]) => {
        setResources(res);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  // Derive all countries from resources
  const allCountries = useMemo(() => {
    const seen = new Set<string>();
    resources.forEach((r) => {
      if (!r.isGlobal && r.countries) r.countries.forEach((c) => seen.add(c));
    });
    return Array.from(seen).sort();
  }, [resources]);

  const resourceTypes = useMemo(() => {
    const types = [...new Set(resources.map((r) => r.resourceType))];
    return types;
  }, [resources]);

  const filtered = useMemo(() => {
    let result = resources;

    if (activeType !== "all") result = result.filter((r) => r.resourceType === activeType);
    if (activeCat !== "all") result = result.filter((r) => r.category?.slug === activeCat);
    if (activeCountry !== "all") {
      result = result.filter((r) => r.isGlobal || r.countries?.includes(activeCountry));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.benefitSummary?.toLowerCase().includes(q) ||
          r.company?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.name?.toLowerCase().includes(q))
      );
    }
    return result;
  }, [resources, activeType, activeCat, activeCountry, searchQuery]);

  const hasActiveFilters = activeType !== "all" || activeCat !== "all" || activeCountry !== "all" || !!searchQuery;

  const resetAll = () => setSearchParams({}, { replace: true });

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <SEO
        title="Free Resources for Designers, Students & Creators — Rvan.me"
        description="Curated directory of free AI credits, student packs, scholarships, remote jobs, hackathons, learning roadmaps, and startup programs. Globally sourced and verified."
        url="https://www.rvan.me/resources"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Free Resources — Rvan.me",
          description: "Free resources for designers, students and creators.",
          url: "https://www.rvan.me/resources",
          publisher: { "@type": "Person", name: "Ravan Mammadov", url: "https://www.rvan.me" }
        }}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero */}
      <section className="px-6 pt-20 pb-10 md:px-10 md:pt-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <p className="eyebrow text-primary mb-4">CURATED KNOWLEDGE PLATFORM</p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-5xl">
              Free Resources.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Scholarships, AI credits, student packs, remote jobs, hackathons, and learning roadmaps — all free, all verified, globally sourced.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8"
          >
            {[
              { label: "Resources", value: resources.length.toString() },
              { label: "Types", value: Object.keys(RESOURCE_TYPE_LABELS).length.toString() },
              { label: "Countries", value: allCountries.length > 0 ? `${allCountries.length}+` : "Global" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-foreground">{value}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search + Filter Bar */}
      <section className="sticky top-[64px] z-20 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 md:px-10">
        <div className="mx-auto max-w-[1600px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              type="text"
              placeholder="Search resources, companies, tags…"
              value={searchQuery}
              onChange={(e) => setParam("q", e.target.value)}
              className="w-full rounded-full border border-border bg-surface pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setParam("q", "")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-xs font-bold text-foreground tracking-wide"
            >
              <SlidersHorizontal size={13} />
              Filters
              {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-primary" />}
            </button>

            {/* Desktop filters inline */}
            <div className="hidden md:flex items-center gap-3">
              {/* Resource Type */}
              <div className="relative">
                <select
                  value={activeType}
                  onChange={(e) => setParam("type", e.target.value)}
                  className="appearance-none rounded-full border border-border bg-surface pl-4 pr-8 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>{RESOURCE_TYPE_LABELS[type] || type}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>

              {/* Category */}
              {categories.length > 0 && (
                <div className="relative">
                  <select
                    value={activeCat}
                    onChange={(e) => setParam("category", e.target.value)}
                    className="appearance-none rounded-full border border-border bg-surface pl-4 pr-8 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.slug ?? cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              )}

              {/* Country */}
              {allCountries.length > 0 && (
                <div className="relative">
                  <select
                    value={activeCountry}
                    onChange={(e) => setParam("country", e.target.value)}
                    className="appearance-none rounded-full border border-border bg-surface pl-4 pr-8 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Countries</option>
                    <option value="global">Global Only</option>
                    {allCountries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              )}

              {hasActiveFilters && (
                <button
                  onClick={resetAll}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filter dropdown */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden md:hidden"
            >
              <div className="mx-auto max-w-[1600px] pt-4 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select value={activeType} onChange={(e) => setParam("type", e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-surface pl-3 pr-8 py-2.5 text-xs font-medium text-foreground focus:outline-none">
                      <option value="all">All Types</option>
                      {resourceTypes.map((type) => (
                        <option key={type} value={type}>{RESOURCE_TYPE_LABELS[type] || type}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                  {categories.length > 0 && (
                    <div className="relative">
                      <select value={activeCat} onChange={(e) => setParam("category", e.target.value)}
                        className="w-full appearance-none rounded-xl border border-border bg-surface pl-3 pr-8 py-2.5 text-xs font-medium text-foreground focus:outline-none">
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.slug ?? cat._id}>{cat.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  )}
                </div>
                {hasActiveFilters && (
                  <button onClick={resetAll} className="text-xs font-bold text-primary hover:underline text-left">
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Type chip tabs */}
      <section className="px-6 pt-6 pb-2 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setParam("type", "all")}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${activeType === "all" ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/50"}`}
            >
              All Resources
            </button>
            {Object.entries(RESOURCE_TYPE_LABELS).map(([key, label]) => {
              const count = resources.filter((r) => r.resourceType === key).length;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setParam("type", activeType === key ? "all" : key)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${activeType === key ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/50"}`}
                >
                  <span>{RESOURCE_TYPE_ICONS[key]}</span>
                  {label}
                  <span className={`text-[9px] font-bold ${activeType === key ? "opacity-70" : "text-muted-foreground"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results grid */}
      <section className="px-6 py-10 pb-28 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          {/* Result count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground mono uppercase tracking-widest">
              {loading ? "Loading…" : `${filtered.length} Resource${filtered.length !== 1 ? "s" : ""}`}
              {hasActiveFilters && !loading && " · Filtered"}
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl border border-border bg-surface animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-surface p-16 text-center my-12"
            >
              <div className="text-5xl mb-6">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery
                  ? `No resources match "${searchQuery}".`
                  : "No resources match your current filters."}
              </p>
              <button
                onClick={resetAll}
                className="text-xs font-bold tracking-widest text-primary uppercase mono hover:underline"
              >
                RESET ALL FILTERS
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((resource, index) => (
                <ResourceCard key={resource._id} resource={resource} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA bottom band */}
      {!loading && resources.length === 0 && (
        <section className="px-6 pb-24 md:px-10">
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
              className="rounded-2xl border border-border bg-surface p-12 text-center"
            >
              <div className="text-5xl mb-6">📦</div>
              <h3 className="text-2xl font-semibold mb-3 tracking-tight">Resources Coming Soon</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                We're actively curating a world-class free resource library. Check back soon or subscribe for updates.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-opacity"
              >
                SUGGEST A RESOURCE <ArrowUpRight size={13} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
