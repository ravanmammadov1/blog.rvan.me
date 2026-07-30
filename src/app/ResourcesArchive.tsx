import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ArrowUpRight, Globe, MapPin,
  BadgeCheck, Users, Award, ExternalLink,
  Clock, Sparkles, Filter, ChevronDown, Flame, Rocket, Star, Gem, Gift, Bot, Copy, Check
} from "lucide-react";

import { fetchResources, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { SiteSettings } from "../types/cms";
import { aggregateAllResources, NormalizedResource } from "../lib/rssAggregator";
import { formatPublicationTimestamp, generateResourceSummary } from "../lib/contentEngine";
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
  all: { label: "All Directory", icon: "⚡", description: "Every practical resource in one view" },
  jobs: { label: "Jobs", icon: "💼", description: "Remote design, marketing, and freelance jobs" },
  freeDesignAssets: { label: "Free Assets", icon: "🎁", description: "Fonts, icons, mockups, UI kits, templates" },
  freeMockups: { label: "Free Mockups", icon: "📐", description: "High-resolution device & product mockups" },
  freeFonts: { label: "Free Fonts", icon: "🔤", description: "Open source & free commercial typography" },
  freeIcons: { label: "Free Icons", icon: "⭐", description: "SVG icon sets and vector libraries" },
  freeUIKits: { label: "Free UI Kits", icon: "📱", description: "Figma UI kits and design systems" },
  aiTools: { label: "AI Tools", icon: "🤖", description: "Curated AI design, dev, & productivity utilities" },
  tools: { label: "Tools", icon: "🛠️", description: "Design, dev, and productivity software" },
  learning: { label: "Learning", icon: "📚", description: "Courses, tutorials, and case studies" },
  podcasts: { label: "Podcasts", icon: "🎙️", description: "Top design & technology podcasts" },
};

function ResourceCard({ resource, index, isFeatured = false, onSelectModal }: { resource: NormalizedResource; index: number; isFeatured?: boolean; onSelectModal: (r: NormalizedResource) => void }) {
  const catConfig = CATEGORY_MAP[resource.category] || { label: resource.category, icon: "📦" };
  const officialSources = ["Smashing Magazine", "We Work Remotely", "UX Collective", "Mockup World", "Font Squirrel", "Product Hunt AI"];
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
      className={`group relative flex flex-col p-6 aurora-card min-h-[340px] ${
        isFeatured ? "border-primary/40 shadow-[0_0_25px_rgba(232,253,82,0.03)]" : ""
      }`}
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
            {resource.formattedDate || formatPublicationTimestamp(resource.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-1 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Publisher / Source */}
        <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-muted-foreground mono">
          <span className="text-foreground/90">{resource.sourceName}</span>
        </div>

        {/* Snippet Description */}
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground/80 line-clamp-3 flex-1 font-medium">
          {resource.description}
        </p>

        {/* Meta / badging row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-muted-foreground">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${badgeColor}`}>
            <BadgeIcon size={11} />
            {badgeText}
          </span>

          {resource.workType && resource.workType !== "na" && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400 capitalize">
              {resource.workType}
            </span>
          )}

          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-primary font-bold">
            FREE
          </span>
        </div>
      </div>

      {/* CTA bottom row */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 mt-5">
        <button
          onClick={() => onSelectModal(resource)}
          className="text-[10px] font-bold text-primary hover:text-white uppercase mono tracking-wider transition-colors flex items-center gap-1"
        >
          <Sparkles size={11} /> AI BREAKDOWN
        </button>
        
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
        >
          <ExternalLink size={11} /> OPEN RESOURCE
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
  const [selectedResourceModal, setSelectedResourceModal] = useState<NormalizedResource | null>(null);

  const searchQuery = searchParams.get("q") || "";
  const activeCategory = searchParams.get("category") || "all";
  const activeSort = searchParams.get("sort") || "latest";

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

  const filteredResources = useMemo(() => {
    let result = resources;
    if (activeCategory !== "all") {
      result = result.filter((r) => r.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.sourceName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [resources, activeCategory, searchQuery]);

  const trendingResources = useMemo(() => resources.slice(0, 3), [resources]);
  const newFreeResources = useMemo(() => resources.filter(r => r.category === "freeDesignAssets" || r.category === "freeMockups" || r.category === "freeFonts").slice(0, 3), [resources]);
  const aiToolsResources = useMemo(() => resources.filter(r => r.category === "aiTools" || r.category === "tools").slice(0, 3), [resources]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Practical Resources Directory — Jobs, Assets, Fonts, AI Tools — Rvan.me"
        description="Curated practical directory for creative professionals: remote jobs, free design assets, fonts, mockups, AI tools, and learning materials."
        url="https://www.rvan.me/resources"
      />

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
                LIVE CURATED DIRECTORY · AUTO-SYNCHRONIZED
              </span>
            </div>
            
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-5xl">
              Resources.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Practical resources for creative professionals — remote jobs, free design assets, AI tools, fonts, mockups, learning materials, and career opportunities.
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

      {/* Curated Highlight Sections */}
      {!searchQuery && activeCategory === "all" && (
        <>
          {/* 🔥 Trending Today */}
          <section className="px-6 py-6 md:px-10 relative z-10 border-t border-white/10 pt-10">
            <div className="mx-auto max-w-[1600px]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Flame size={18} className="text-orange-400" /> Trending Today
                </h2>
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mono">AUTOMATED SELECTION</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingResources.map((resItem, idx) => (
                  <ResourceCard key={`trend-${resItem.id}`} resource={resItem} index={idx} isFeatured={true} onSelectModal={setSelectedResourceModal} />
                ))}
              </div>
            </div>
          </section>

          {/* 🤖 Latest AI Tools */}
          {aiToolsResources.length > 0 && (
            <section className="px-6 py-6 md:px-10 relative z-10 border-t border-white/10 pt-10">
              <div className="mx-auto max-w-[1600px]">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Bot size={18} className="text-cyan-400" /> Latest AI Tools
                  </h2>
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mono">CURATED AI UTILITIES</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aiToolsResources.map((resItem, idx) => (
                    <ResourceCard key={`aitool-${resItem.id}`} resource={resItem} index={idx} onSelectModal={setSelectedResourceModal} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Main Directory List */}
      <section className="px-6 py-12 md:px-10 relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
              <input
                type="text"
                placeholder="Search jobs, assets, fonts, AI tools…"
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
              Showing {filteredResources.length} curated resources
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

      {/* AI Breakdown Modal */}
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
              <Sparkles size={14} /> AI Analytical Resource Breakdown
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              {selectedResourceModal.title}
            </h2>

            {(() => {
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

                  <div>
                    <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-2">💡 Best Use Cases</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {summary.bestUseCases.map((u, i) => <li key={i}>{u}</li>)}
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
            })()}
          </div>
        </div>
      )}

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
