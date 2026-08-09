import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, X, Download, Type, Sliders, BadgeCheck
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
import { ContentCard, formatHumanTitle } from "./components/content/ContentCard";
import { ToolCard } from "./components/content/ToolCard";
import { JobCard } from "./components/content/JobCard";
import { ScholarshipCard } from "./components/content/ScholarshipCard";
import { FontSpecimenCard } from "./components/content/FontSpecimenCard";
import PageHero from "./components/PageHero";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

export const CATEGORY_MAP: Record<string, { label: string; icon: string }> = {
  all: { label: "All Resources", icon: "⚡" },
  fonts: { label: "Fonts", icon: "🔤" },
  tools: { label: "Tools", icon: "🛠️" },
  assets: { label: "Assets", icon: "🎁" },
  learning: { label: "Learning", icon: "📚" },
  inspiration: { label: "Inspiration", icon: "✨" },
};

export default function ResourcesArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [fontCatalog, setFontCatalog] = useState<FontItem[]>([]);
  const [fontsLoading, setFontsLoading] = useState<boolean>(true);

  // Unified Content Store
  const { items: rawContentItems, loading: contentLoading } = useContentItems();

  // Interactive Font Specimen controls
  const [previewText, setPreviewText] = useState("Design systems engineered for precision & elegance.");
  const [fontSizePx, setFontSizePx] = useState(28);
  const [fontCategorySubfilter, setFontCategorySubfilter] = useState("all");
  const [visibleFontLimit, setVisibleFontLimit] = useState(40);

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("q") || "";
  const deferredSearch = useDeferredValue(searchQuery);

  // Search filter hook
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

  useEffect(() => {
    if (searchQuery !== query) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleSearchChange = (newQuery: string) => {
    setQuery(newQuery);
    setParam("q", newQuery);
  };

  // Broad consolidated category filtering
  const displayedContentItems = useMemo(() => {
    if (activeCategory === "all") return flexFilteredItems;
    
    return flexFilteredItems.filter((item) => {
      const catSlug = typeof item.category?.slug === "string" ? item.category.slug : item.category?.slug?.current;
      const catName = typeof item.category?.name === "string" ? item.category.name.toLowerCase() : "";

      if (activeCategory === "tools") {
        return item.contentType === "aiTool" || catSlug === "tools" || catName.includes("tool");
      }
      if (activeCategory === "assets") {
        return (
          item.contentType === "designAsset" ||
          item.contentType === "resource" ||
          item.contentType === "template" ||
          catSlug === "freeDesignAssets" ||
          catSlug === "freeMockups" ||
          catSlug === "freeIcons" ||
          catSlug === "freeUIKits"
        );
      }
      if (activeCategory === "learning") {
        return item.contentType === "freeCourse" || catSlug === "learning" || catName.includes("learn") || catName.includes("course");
      }
      if (activeCategory === "inspiration") {
        return catSlug === "inspiration" || catName.includes("inspiration") || catName.includes("gallery");
      }
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
      {/* Tab Title: Never begin browser titles with numbers */}
      <SEO
        title="Creative Resources — Rvan.me"
        description="Discover open-source font families, developer tools, vector assets, mockups, and UI kits."
        url="https://www.rvan.me/resources"
      />

      {/* Ambient background blob */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30">
        <div
          className="absolute -top-[20%] left-[20%] h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.06) 0%, rgba(59,130,246,0.03) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Unified Page Hero */}
      <PageHero
        eyebrow="⚡ CREATIVE RESOURCES & DEV TOOLS"
        title="Creative Resources &"
        accentText="Developer Toolkit."
        gradientVariant="creative"
        description="Explore open-source font families, developer tools, vector icons, device mockups, and UI kits."
      />

      {/* Consolidated Category Navigation (5 Broad Categories) */}
      <section className="sticky top-20 z-30 px-6 py-3.5 md:px-10 bg-background/80 backdrop-blur-xl border-y border-white/10">
        <div className="mx-auto max-w-[1600px] flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {Object.entries(CATEGORY_MAP).map(([key, config]) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setParam("category", key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${
                  isActive
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
          1. FONTS CATEGORY (OPEN-SOURCE & FREE COMMERCIAL FONT CATALOG)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "fonts" ? (
        <section className="px-6 py-10 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            {/* Type Tester Controls */}
            <div className="mb-8 p-5 rounded-2xl border border-white/10 bg-white/5 glass space-y-5">
              {/* Search Input */}
              <div className="relative w-full">
                <label htmlFor="font-search" className="sr-only">Search fonts</label>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
                <input
                  id="font-search"
                  type="search"
                  placeholder="Search font families by name or designer (e.g. Geist, Inter, Satoshi)..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-background/90 pl-11 pr-10 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
                />
                {searchQuery && (
                  <button onClick={() => handleSearchChange("")} aria-label="Clear font search" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase">
                  <Type size={16} /> Specimen Controls
                </div>

                {/* Sub-category Filters */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {["all", "Sans Serif", "Serif", "Display", "Monospace", "Variable"].map((cat) => (
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

              {/* Preview Text & Slider */}
              <div className="grid gap-4 md:grid-cols-12 items-center">
                <div className="md:col-span-8 relative">
                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="Type custom preview text..."
                    className="w-full rounded-xl border border-white/10 bg-background/80 px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none glass-sm"
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
                  <div key={n} className="h-48 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : filteredFonts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center my-6 glass">
                <p className="text-muted-foreground text-xs">No font families found matching your search.</p>
                <button
                  onClick={() => { setFontCategorySubfilter("all"); handleSearchChange(""); }}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {filteredFonts.slice(0, visibleFontLimit).map((font, idx) => (
                    <FontSpecimenCard
                      key={font.id || `${font.family}-${idx}`}
                      font={font}
                      previewText={previewText}
                      fontSizePx={fontSizePx}
                      idx={idx}
                      fadeUpVariants={fadeUp}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleFontLimit < filteredFonts.length && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setVisibleFontLimit((prev) => prev + 40)}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-7 py-3.5 text-xs font-bold tracking-[.15em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black glass-sm"
                    >
                      LOAD MORE FONTS ({filteredFonts.length - visibleFontLimit} REMAINING)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      ) : (
        /* ─────────────────────────────────────────────────────────────────────────────
            2. UNIFIED RESOURCE GRID (TOOLS, ASSETS, LEARNING, INSPIRATION, ALL)
        ───────────────────────────────────────────────────────────────────────────── */
        <section className="px-6 py-10 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            {/* Search Input */}
            <div className="mb-8 relative max-w-md">
              <label htmlFor="resource-search" className="sr-only">Search resources</label>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
              <input
                id="resource-search"
                type="search"
                placeholder="Search fonts, tools, mockups & assets..."
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

            {contentLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-48 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : displayedContentItems.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center my-6 glass">
                <p className="text-muted-foreground text-xs font-medium">No resources found matching your search.</p>
                <button
                  onClick={() => { setParam("category", "all"); handleSearchChange(""); }}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white"
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
