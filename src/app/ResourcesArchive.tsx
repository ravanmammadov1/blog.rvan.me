import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, X, Globe, Download, Type, Sliders, Sparkles, BadgeCheck
} from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings, UniversalContentItem } from "../types/cms";
import { fetchLiveFontCatalog, FontItem, resolveDirectFontDownloadUrl } from "../lib/fontEngine";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useContentItems } from "./hooks/useContentItems";
import { useSearchFilter } from "./hooks/useSearchFilter";
import { ContentCard } from "./components/content/ContentCard";
import { ToolCard } from "./components/content/ToolCard";
import { JobCard } from "./components/content/JobCard";
import { ScholarshipCard } from "./components/content/ScholarshipCard";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export const CATEGORY_MAP: Record<string, { label: string; icon: string; description: string }> = {
  all: { label: "All Directory", icon: "⚡", description: "Every free font family and creative asset in one view" },
  freeFonts: { label: "Free Fonts Library", icon: "🔤", description: "1,000+ open-source & free commercial font families" },
  freeDesignAssets: { label: "Free Assets", icon: "🎁", description: "Fonts, icons, mockups, UI kits, templates" },
  freeMockups: { label: "Free Mockups", icon: "📐", description: "High-resolution device & product mockups" },
  freeIcons: { label: "Free Icons", icon: "⭐", description: "SVG icon sets and vector libraries" },
  freeUIKits: { label: "Free UI Kits", icon: "📱", description: "Figma UI kits and design systems" },
  learning: { label: "Learning", icon: "📚", description: "Courses, tutorials, and case studies" },
};

export default function ResourcesArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [fontCatalog, setFontCatalog] = useState<FontItem[]>([]);
  const [fontsLoading, setFontsLoading] = useState<boolean>(true);

  // Unified Sanity Polymorphic Content Store
  const { items: rawContentItems, loading: contentLoading } = useContentItems();

  // Interactive Font Specimen controls
  const [previewText, setPreviewText] = useState("Design systems engineered for precision & elegance.");
  const [fontSizePx, setFontSizePx] = useState(28);
  const [fontCategorySubfilter, setFontCategorySubfilter] = useState("all");
  const [visibleFontLimit, setVisibleFontLimit] = useState(40);

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("q") || "";
  const deferredSearch = useDeferredValue(searchQuery);

  // Connect FlexSearch filter hook to universal items
  const {
    query,
    setQuery,
    filteredItems: flexFilteredItems,
  } = useSearchFilter(rawContentItems);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    // Non-blocking sync of live Google fonts
    fetchLiveFontCatalog()
      .then((fontItems) => {
        if (Array.isArray(fontItems) && fontItems.length > 0) {
          setFontCatalog(fontItems);
        }
      })
      .catch((err) => console.error("Error syncing live fonts:", err))
      .finally(() => setFontsLoading(false));
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

  // Synchronize URL search parameter with FlexSearch hook state
  useEffect(() => {
    if (searchQuery !== query) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleSearchChange = (newQuery: string) => {
    setQuery(newQuery);
    setParam("q", newQuery);
  };

  // Filter content items by category selection
  const displayedContentItems = useMemo(() => {
    if (activeCategory === "all") return flexFilteredItems;
    
    return flexFilteredItems.filter((item) => {
      const catSlug = typeof item.category?.slug === "string" ? item.category.slug : item.category?.slug?.current;
      if (activeCategory === "freeDesignAssets") return item.contentType === "designAsset" || item.contentType === "resource" || catSlug === "freeDesignAssets";
      if (activeCategory === "freeMockups") return catSlug === "freeMockups" || item.contentType === "template";
      if (activeCategory === "freeIcons") return catSlug === "freeIcons";
      if (activeCategory === "freeUIKits") return catSlug === "freeUIKits" || item.contentType === "template";
      if (activeCategory === "learning") return item.contentType === "freeCourse" || catSlug === "learning";
      return catSlug === activeCategory;
    });
  }, [flexFilteredItems, activeCategory]);

  const filteredFonts = useMemo(() => {
    let list = fontCatalog || [];

    if (fontCategorySubfilter !== "all") {
      if (fontCategorySubfilter === "Variable") {
        list = list.filter((f) => f && f.isVariable);
      } else {
        list = list.filter((f) => f && f.category === fontCategorySubfilter);
      }
    }

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(
        (f) =>
          f &&
          ((f.family && f.family.toLowerCase().includes(q)) ||
            (f.name && f.name.toLowerCase().includes(q)) ||
            (f.designer && f.designer.toLowerCase().includes(q)) ||
            (f.foundry && f.foundry.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [fontCatalog, fontCategorySubfilter, deferredSearch]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="1,000+ Free Fonts & Curated Knowledge Directory — Rvan.me"
        description="Explore 1,000+ free commercial font families (Geist, Inter, Satoshi, Poppins), AI tools, vector assets, mockups, and UI kits."
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
              <Globe size={13} /> CURATED DIRECTORY · 1,000+ FREE FONTS & CREATIVE ASSETS
            </p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-5xl leading-[0.9]">
              Creative Hub & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                Typography Library.
              </span>
            </h1>
            <p className="mt-8 text-base text-muted-foreground max-w-2xl leading-relaxed font-medium">
              Discover over 1,000+ SIL Open Source and commercial-free font families (Geist, Inter, Satoshi, Space Grotesk), AI tools, vector icons, device mockups, and UI kits.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-20 z-30 px-6 py-4 md:px-10 bg-background/80 backdrop-blur-xl border-y border-white/10">
        <div className="mx-auto max-w-[1600px] flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {Object.entries(CATEGORY_MAP).map(([key, config]) => {
            return (
              <button
                key={key}
                onClick={() => setParam("category", key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${
                  activeCategory === key
                    ? "bg-primary text-black shadow-[0_0_16px_rgba(232,253,82,0.3)] font-bold"
                    : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
                }`}
              >
                <span>{config.icon}</span>
                {config.label}
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
            {/* Interactive Type Tester & Font Search Controls */}
            <div className="mb-10 p-6 rounded-2xl border border-white/10 bg-white/5 glass space-y-6">
              {/* Font Search Engine Input */}
              <div className="relative w-full">
                <label htmlFor="font-search" className="sr-only">Search fonts</label>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
                <input
                  id="font-search"
                  type="search"
                  placeholder="Search 1,000+ free font families by name, designer, or category (e.g. Geist, Inter, Satoshi, Serif)..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-background/90 pl-11 pr-10 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
                />
                {searchQuery && (
                  <button onClick={() => handleSearchChange("")} aria-label="Clear font search" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-white/5">
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
            {fontsLoading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-64 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : filteredFonts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center my-8 glass">
                <p className="text-muted-foreground">No font families found matching your criteria.</p>
                <button
                  onClick={() => { setFontCategorySubfilter("all"); handleSearchChange(""); }}
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
            POLYMORPHIC UNIFIED DIRECTORY GRID (DESIGN ASSETS, MOCKUPS, ICONS, AI TOOLS)
        ───────────────────────────────────────────────────────────────────────────── */
        <section className="px-6 py-12 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:w-96">
                <label htmlFor="resource-search" className="sr-only">Search resources</label>
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
                <input
                  id="resource-search"
                  type="search"
                  placeholder="Instant FlexSearch (<10ms) across all curated resources..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
                />
                {searchQuery && (
                  <button onClick={() => handleSearchChange("")} aria-label="Clear resource search" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={13} />
                  </button>
                )}
              </div>

              <span className="text-xs text-muted-foreground mono flex items-center gap-1">
                <Sparkles size={12} className="text-primary" /> Showing {displayedContentItems.length} curated polymorphic items
              </span>
            </div>

            {contentLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-64 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : displayedContentItems.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center my-8 glass">
                <p className="text-muted-foreground">No resources found matching your filter.</p>
                <button
                  onClick={() => { setParam("category", "all"); handleSearchChange(""); }}
                  className="mt-4 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayedContentItems.map((item: UniversalContentItem) => {
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
            )}
          </div>
        </section>
      )}

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
