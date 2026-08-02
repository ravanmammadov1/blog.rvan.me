import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ArrowUpRight, Globe, MapPin,
  BadgeCheck, Users, Award, ExternalLink, Download,
  Clock, Sparkles, Filter, ChevronDown, Flame, Rocket, Star, Gem, Gift, Bot, Copy, Check, Briefcase, DollarSign, Type, Sliders
} from "lucide-react";

import { fetchResources, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { SiteSettings } from "../types/cms";
import { aggregateAllResources, NormalizedResource } from "../lib/rssAggregator";
import { formatPublicationTimestamp, generateResourceSummary, generateAIJobSummary } from "../lib/contentEngine";
import { fetchLiveFontCatalog, FontItem, resolveDirectFontDownloadUrl } from "../lib/fontEngine";
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

export const CATEGORY_MAP: Record<string, { label: string; icon: string; description: string }> = {
  all: { label: "All Directory", icon: "⚡", description: "Every practical resource, font, and job in one view" },
  freeFonts: { label: "Free Fonts Library", icon: "🔤", description: "1,000+ open-source & free commercial font families" },
  jobs: { label: "Remote Jobs", icon: "💼", description: "100% curated remote design, AI, frontend & marketing jobs" },
  freeDesignAssets: { label: "Free Assets", icon: "🎁", description: "Fonts, icons, mockups, UI kits, templates" },
  freeMockups: { label: "Free Mockups", icon: "📐", description: "High-resolution device & product mockups" },
  freeIcons: { label: "Free Icons", icon: "⭐", description: "SVG icon sets and vector libraries" },
  freeUIKits: { label: "Free UI Kits", icon: "📱", description: "Figma UI kits and design systems" },
  aiTools: { label: "AI Tools", icon: "🤖", description: "Curated AI design, dev, & productivity utilities" },
  tools: { label: "Tools", icon: "🛠️", description: "Design, dev, and productivity software" },
  learning: { label: "Learning", icon: "📚", description: "Courses, tutorials, and case studies" },
  podcasts: { label: "Podcasts", icon: "🎙️", description: "Top design & technology podcasts" },
};

function ResourceCard({ resource, index, isFeatured = false, onSelectModal }: { resource: NormalizedResource; index: number; isFeatured?: boolean; onSelectModal: (r: NormalizedResource) => void }) {
  const isJob = resource.category === "jobs";
  const catConfig = CATEGORY_MAP[resource.category] || { label: resource.category, icon: "📦" };
  const officialSources = ["We Work Remotely", "Remote OK", "Himalayas", "Authentic Jobs", "AIJobs.net", "Smashing Magazine", "Product Hunt AI", "Google Fonts", "Fontshare"];
  const isOfficial = officialSources.includes(resource.sourceName);
  const isVerified = !resource.isRss;

  const badgeText = isOfficial ? "Verified Source" : isVerified ? "Curated" : "Community";
  const badgeColor = isOfficial 
    ? "text-blue-400 border-blue-500/30 bg-blue-500/5" 
    : isVerified 
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" 
      : "text-muted-foreground border-white/10 bg-white/5";
  const BadgeIcon = isOfficial ? BadgeCheck : isVerified ? Award : Users;

  const company = resource.companyName || resource.benefitSummary || "Remote Company";
  const salary = resource.salaryRange || "$95,000 – $145,000 USD";

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      custom={index * 0.04}
      className={`group relative flex flex-col p-6 aurora-card min-h-[340px] ${
        isFeatured ? "border-primary/40 shadow-[0_0_25px_rgba(232,253,82,0.03)]" : ""
      }`}
    >
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Card Header metadata */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-primary mono glass-sm">
            <span className="text-sm">{catConfig.icon}</span>
            {isJob ? "Remote Job" : catConfig.label}
          </span>

          <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground/80 mono">
            <Clock size={11} />
            {resource.formattedDate || formatPublicationTimestamp(resource.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-1 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Company / Source */}
        <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-muted-foreground mono">
          <span className="text-foreground/90">{isJob ? company : resource.sourceName}</span>
          {isJob && <span className="text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[9px]">100% Remote</span>}
        </div>

        {/* Snippet Description */}
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground/80 line-clamp-3 flex-1 font-medium">
          {resource.description}
        </p>

        {/* Job specifics */}
        {isJob && (
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] mono">
            <span className="text-primary font-bold flex items-center gap-1">
              <DollarSign size={12} /> {salary}
            </span>
            <span className="text-muted-foreground/70">{resource.employmentType || "Full-time"}</span>
          </div>
        )}

        {/* Meta / badging row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-muted-foreground">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${badgeColor}`}>
            <BadgeIcon size={11} />
            {badgeText}
          </span>

          {resource.sourceName && !isJob && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-muted-foreground">
              {resource.sourceName}
            </span>
          )}

          {!isJob && (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-primary font-bold">
              FREE
            </span>
          )}
        </div>
      </div>

      {/* CTA bottom row */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 mt-5">
        <button
          onClick={() => onSelectModal(resource)}
          className="text-[10px] font-bold text-primary hover:text-white uppercase mono tracking-wider transition-colors flex items-center gap-1"
        >
          <Sparkles size={11} /> {isJob ? "AI JOB ANALYSIS" : "AI BREAKDOWN"}
        </button>
        
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
        >
          <ExternalLink size={11} /> {isJob ? "APPLY JOB" : "OPEN RESOURCE"}
        </a>
      </div>
    </motion.article>
  );
}

export default function ResourcesArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [allResources, setAllResources] = useState<NormalizedResource[]>(() => getCachedAllResources());
  const [fontCatalog, setFontCatalog] = useState<FontItem[]>([]);
  const [loading, setLoading] = useState<boolean>(() => getCachedAllResources().length === 0);
  const [selectedResourceModal, setSelectedResourceModal] = useState<NormalizedResource | null>(null);

  // Interactive Font Specimen controls
  const [previewText, setPreviewText] = useState("Design systems engineered for precision & elegance.");
  const [fontSizePx, setFontSizePx] = useState(28);
  const [fontCategorySubfilter, setFontCategorySubfilter] = useState("all");
  const [visibleFontLimit, setVisibleFontLimit] = useState(40);

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("q") || "";
  const deferredSearch = useDeferredValue(searchQuery);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    // Load general resources & live font catalog
    Promise.all([
      fetchResources().then((cmsItems) => aggregateAllResources(cmsItems || [])),
      fetchLiveFontCatalog(),
    ])
      .then(([resItems, fontItems]) => {
        if (Array.isArray(resItems) && resItems.length > 0) {
          setAllResources(resItems || []);
          setCachedAllResources(resItems || []);
        }
        setFontCatalog(fontItems || []);
      })
      .catch((err) => console.error("Error loading resources & font catalog:", err))
      .finally(() => setLoading(false));
  }, []);

  const setParam = (key: string, val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const filteredResources = useMemo(() => {
    let list = allResources;

    if (activeCategory !== "all") {
      list = list.filter((r) => r.category === activeCategory);
    }

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.sourceName.toLowerCase().includes(q) ||
          (r.companyName && r.companyName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allResources, activeCategory, deferredSearch]);

  const filteredFonts = useMemo(() => {
    let list = fontCatalog;

    if (fontCategorySubfilter !== "all") {
      if (fontCategorySubfilter === "Variable") {
        list = list.filter((f) => f.isVariable);
      } else {
        list = list.filter((f) => f.category === fontCategorySubfilter);
      }
    }

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.family.toLowerCase().includes(q) ||
          f.designer.toLowerCase().includes(q) ||
          f.foundry.toLowerCase().includes(q) ||
          f.useCases.some((u) => u.toLowerCase().includes(q))
      );
    }

    return list;
  }, [fontCatalog, fontCategorySubfilter, searchQuery]);

  const counts: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = { all: allResources.length };
    allResources.forEach((r) => {
      map[r.category] = (map[r.category] || 0) + 1;
    });
    map["freeFonts"] = fontCatalog.length;
    return map;
  }, [allResources, fontCatalog]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="1,000+ Free Fonts & Remote Jobs Directory — Rvan.me"
        description="Explore 1,000+ free commercial font families (Geist, Inter, Satoshi, Poppins), remote jobs, vector assets, mockups, and AI software tools."
        url="https://www.rvan.me/resources"
      />

      {/* Ambient background blob */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30">
        <div
          className="absolute -top-[20%] left-[20%] h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.08) 0%, rgba(59,130,246,0.04) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Header */}
      <section className="px-6 pt-20 pb-12 md:px-10 md:pt-28 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.05}>
            <p className="eyebrow text-primary mb-4 flex items-center gap-2">
              <Globe size={13} /> CURATED DIRECTORY · 1,000+ FREE FONTS & REMOTE JOBS
            </p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-5xl leading-[0.9]">
              Creative Hub & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                Typography Library.
              </span>
            </h1>
            <p className="mt-8 text-base text-muted-foreground max-w-2xl leading-relaxed">
              Discover over 1,000+ SIL Open Source and commercial-free font families (Geist, Inter, Satoshi, Space Grotesk), remote jobs, vector icons, mockups, and AI software utilities. Updated daily.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-20 z-30 px-6 py-4 md:px-10 bg-background/80 backdrop-blur-xl border-y border-white/10">
        <div className="mx-auto max-w-[1600px] flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {Object.entries(CATEGORY_MAP).map(([key, config]) => {
            const count = counts[key] || 0;
            return (
              <button
                key={key}
                onClick={() => setParam("category", key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${
                  activeCategory === key
                    ? "bg-primary text-black shadow-[0_0_16px_rgba(232,253,82,0.3)]"
                    : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
                }`}
              >
                <span>{config.icon}</span>
                {config.label}
                {count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeCategory === key ? "bg-black/20 text-black" : "bg-white/10 text-muted-foreground"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1,000+ FREE FONTS INTERACTIVE SPECIMEN GALLERY (WHEN freeFonts IS ACTIVE)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "freeFonts" ? (
        <section className="px-6 py-12 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            {/* Interactive Type Tester Controls */}
            <div className="mb-10 p-6 rounded-2xl border border-white/10 bg-white/5 glass space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase">
                  <Type size={16} /> Interactive Font Specimen Controls
                </div>

                {/* Sub-category Filters */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {["all", "Sans Serif", "Serif", "Display", "Monospace", "Variable", "Handwriting"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFontCategorySubfilter(cat)}
                      className={`px-3 py-1 rounded-full border transition-all ${
                        fontCategorySubfilter === cat
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat === "all" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Text Input & Slider */}
              <div className="grid gap-4 md:grid-cols-12 items-center">
                <div className="md:col-span-8 relative">
                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="Type custom preview text..."
                    className="w-full rounded-xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none glass-sm"
                  />
                </div>
                <div className="md:col-span-4 flex items-center gap-3">
                  <Sliders size={14} className="text-muted-foreground shrink-0" />
                  <input
                    type="range"
                    min="16"
                    max="64"
                    value={fontSizePx}
                    onChange={(e) => setFontSizePx(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <span className="text-xs font-bold mono text-muted-foreground w-12 text-right">{fontSizePx}px</span>
                </div>
              </div>
            </div>

            {/* Font Grid */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-64 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : filteredFonts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center my-8 glass">
                <p className="text-muted-foreground">No font families found matching your criteria.</p>
                <button
                  onClick={() => { setFontCategorySubfilter("all"); setParam("q", ""); }}
                  className="mt-4 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white"
                >
                  RESET FONT FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-8 sm:grid-cols-2">
                  {filteredFonts.slice(0, visibleFontLimit).map((font, idx) => (
                    <motion.article
                      key={font.id || idx}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.05 }}
                      custom={(idx % 20) * 0.02}
                      className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 glass flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(232,253,82,0.1)]"
                    >
                      <div>
                        {/* Metadata header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-primary mono">
                            {font.category}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground mono">
                            {font.isVariable && <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-cyan-400">VARIABLE</span>}
                            <span>{font.stylesCount} Styles</span>
                          </div>
                        </div>

                        {/* Font Family Name & Designer */}
                        <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {font.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mono mt-1">
                          Designed by <span className="text-foreground/90 font-semibold">{font.designer}</span> · {font.foundry}
                        </p>

                        {/* Specimen Live Preview */}
                        <div className="my-6 p-4 rounded-xl border border-white/5 bg-background/60 overflow-hidden">
                          <p
                            style={{
                              fontFamily: `"${font.family}", system-ui, sans-serif`,
                              fontSize: `${fontSizePx}px`,
                              lineHeight: 1.25,
                            }}
                            className="text-foreground transition-all duration-300 break-words line-clamp-3"
                          >
                            {previewText || font.sampleText}
                          </p>
                        </div>

                        {/* Use cases & License */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-4">
                          {font.useCases.map((uc) => (
                            <span key={uc} className="text-[9px] font-semibold text-muted-foreground/80 border border-white/10 bg-white/5 rounded-full px-2.5 py-0.5">
                              {uc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom CTA */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold mono">
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <BadgeCheck size={12} /> {font.license}
                        </span>
                        <a
                          href={resolveDirectFontDownloadUrl(font)}
                          download={`${font.family}.zip`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                        >
                          DOWNLOAD ZIP <Download size={12} />
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Load More Button */}
                {visibleFontLimit < filteredFonts.length && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setVisibleFontLimit((prev) => prev + 40)}
                      className="inline-flex items-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm"
                    >
                      LOAD MORE FONTS (SHOWING {Math.min(visibleFontLimit, filteredFonts.length)} OF {filteredFonts.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      ) : (
        /* ─────────────────────────────────────────────────────────────────────────────
            MAIN GENERAL DIRECTORY LIST (JOBS, ASSETS, MOCKUPS, ICONS, AI TOOLS)
        ───────────────────────────────────────────────────────────────────────────── */
        <section className="px-6 py-12 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
                <input
                  type="text"
                  placeholder="Search remote jobs, design assets, fonts, AI tools…"
                  value={searchQuery}
                  onChange={(e) => setParam("q", e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
                />
                {searchQuery && (
                  <button onClick={() => setParam("q", "")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={13} />
                  </button>
                )}
              </div>

              <span className="text-xs text-muted-foreground mono">
                Showing {filteredResources.length} curated listings
              </span>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-64 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center my-8 glass">
                <p className="text-muted-foreground">No resources found matching your filter.</p>
                <button
                  onClick={() => { setParam("category", "all"); setParam("q", ""); }}
                  className="mt-4 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resItem, idx) => (
                  <ResourceCard key={resItem.id || idx} resource={resItem} index={idx} onSelectModal={setSelectedResourceModal} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* AI Breakdown & Job Analysis Modal */}
      {selectedResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/15 bg-background/95 p-6 shadow-2xl glass">
            <button
              onClick={() => setSelectedResourceModal(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase mb-2">
              <Sparkles size={14} /> {selectedResourceModal.category === "jobs" ? "AI Job Role Analysis" : "AI Analytical Resource Breakdown"}
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              {selectedResourceModal.title}
            </h2>

            {selectedResourceModal.category === "jobs" ? (
              (() => {
                const company = selectedResourceModal.companyName || selectedResourceModal.benefitSummary || "Remote Studio";
                const jobSummary = selectedResourceModal.jobSummary || generateAIJobSummary(selectedResourceModal.title, company, selectedResourceModal.description);

                return (
                  <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-foreground">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-primary text-sm">{company}</span>
                        <span className="text-xs font-bold text-emerald-400 mono">{jobSummary.salaryRange}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{jobSummary.roleOverview}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-2">⚡ Required Skills & Expertise</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {jobSummary.requiredSkills.map((sk, i) => <li key={i}>{sk}</li>)}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-1">🎯 Target Candidate Profile</h4>
                      <p>{jobSummary.targetCandidate}</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <h4 className="font-bold uppercase mono text-[11px] mb-1 text-foreground">💡 Why This Position Is Interesting</h4>
                      <p>{jobSummary.whyInteresting}</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] mono text-muted-foreground">100% Remote · Verified Listing</span>
                      <a
                        href={selectedResourceModal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-colors"
                      >
                        APPLY FOR THIS JOB <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })()
            ) : (
              (() => {
                const summary = generateResourceSummary(selectedResourceModal.title, selectedResourceModal.description, selectedResourceModal.category, selectedResourceModal.sourceName);
                return (
                  <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-1">📌 Overview & Purpose</h4>
                      <p>{summary.overview}</p>
                      <p className="mt-2">{summary.purpose}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-1">🎯 Target Audience</h4>
                      <p>{summary.targetAudience}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-2">⚡ Key Advantages</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {summary.advantages.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-primary font-medium">
                      <h4 className="font-bold uppercase mono text-[11px] mb-1 text-primary">Verdict</h4>
                      <p>{summary.verdict}</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] mono text-muted-foreground">Pricing: {summary.pricing}</span>
                      <a
                        href={selectedResourceModal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-colors"
                      >
                        OPEN RESOURCE <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
