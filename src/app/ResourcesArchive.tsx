import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Type,
  Sliders,
  ExternalLink,
  GitFork,
  Star,
  Download,
  ArrowUpRight,
} from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { fetchLiveFontCatalog, FontItem } from "../lib/fontEngine";
import { fetchUnifiedResources, SharedResourceItem, ResourceCategoryKey } from "../lib/resourceEngine";
import { useProgressiveRendering } from "./hooks/useProgressiveRendering";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { FontSpecimenCard } from "./components/content/FontSpecimenCard";
import PageHero from "./components/PageHero";
import PageFilterBar from "./components/PageFilterBar";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

export const CATEGORY_MAP: Record<ResourceCategoryKey, { label: string; icon: string }> = {
  fonts: { label: "Fonts", icon: "🔤" },
  githubRepos: { label: "GitHub Repositories", icon: "🐙" },
  tools: { label: "Tools", icon: "🛠️" },
  assets: { label: "Assets", icon: "🎁" },
  learning: { label: "Learning", icon: "📚" },
  inspiration: { label: "Inspiration", icon: "✨" },
};

export default function ResourcesArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [fontCatalog, setFontCatalog] = useState<FontItem[]>([]);
  const [unifiedItems, setUnifiedItems] = useState<SharedResourceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Interactive Font Specimen controls
  const [previewText, setPreviewText] = useState("Design systems engineered for precision & elegance.");
  const [fontSizePx, setFontSizePx] = useState(28);
  const [fontCategorySubfilter, setFontCategorySubfilter] = useState("all");
  const [visibleFontLimit, setVisibleFontLimit] = useState(10);

  const activeCategory = (searchParams.get("category") as ResourceCategoryKey) || "fonts";
  const searchQuery = searchParams.get("q") || "";
  const deferredSearch = useDeferredValue(searchQuery);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    fetchLiveFontCatalog().then((items) => {
      if (Array.isArray(items)) setFontCatalog(items);
    });

    fetchUnifiedResources()
      .then((items) => setUnifiedItems(items || []))
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

  const handleSearchChange = (newQuery: string) => {
    setParam("q", newQuery);
  };

  // Filtered Unified Non-Font Resources
  const filteredCategoryItems = useMemo(() => {
    let list = unifiedItems.filter((item) => item.category === activeCategory);

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q)
      );
    }

    return list;
  }, [unifiedItems, activeCategory, deferredSearch]);

  // Filtered Fonts
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

  const {
    visibleItems: visibleCategoryItems,
    hasMore: hasMoreCategoryItems,
    remainingCount: remainingCategoryCount,
    loadMore: loadMoreCategoryItems,
    isLoadingMore: isLoadingMoreCategory,
  } = useProgressiveRendering(filteredCategoryItems, {
    initialBatchSize: 12,
    stepBatchSize: 12,
    resetDependencies: [activeCategory, deferredSearch],
  });

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Creative Resources & Developer Toolkit — Rvan.me"
        description="Discover open-source font families, curated GitHub repositories, developer tools, vector assets, mockups, and UI kits."
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
        description="Explore open-source font families, curated GitHub repositories, developer tools, vector icons, device mockups, and UI kits."
      />

      {/* Master Page Filter Bar & Search */}
      <PageFilterBar
        categories={Object.entries(CATEGORY_MAP).map(([key, config]) => ({
          key,
          label: config.label,
          icon: config.icon,
        }))}
        activeCategory={activeCategory}
        onSelectCategory={(key) => setParam("category", key)}
        searchQuery={searchQuery}
        onSearchChange={(q) => handleSearchChange(q)}
        searchPlaceholder={`Search ${CATEGORY_MAP[activeCategory]?.label || "resources"}...`}
        searchId="resource-search"
      />

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. FONTS CATEGORY (DEFAULT & FIRST TAB)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "fonts" ? (
        <section className="px-6 py-10 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            {/* Type Tester Controls */}
            <div className="mb-8 p-5 rounded-2xl border border-white/10 bg-white/5 glass space-y-4">
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
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-48 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : filteredFonts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center my-6 glass">
                <p className="text-muted-foreground text-xs">No font families found matching your search.</p>
                <button
                  onClick={() => {
                    setFontCategorySubfilter("all");
                    handleSearchChange("");
                  }}
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
                      onClick={() => setVisibleFontLimit((prev) => prev + 16)}
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
            2. UNIFIED RESOURCE CATEGORIES (GITHUB REPOS, TOOLS, ASSETS, LEARNING, INSPIRATION)
        ───────────────────────────────────────────────────────────────────────────── */
        <section className="px-6 py-10 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-48 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : filteredCategoryItems.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center my-6 glass">
                <p className="text-muted-foreground text-xs font-medium">No items found matching your filter or search.</p>
                <button
                  onClick={() => handleSearchChange("")}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white"
                >
                  RESET SEARCH
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleCategoryItems.map((item) => (
                    <motion.article
                      key={item.id}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full mono">
                            {item.type}
                          </span>
                          {item.starsCount && (
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mono">
                              <Star size={12} className="fill-amber-400" /> {item.starsCount.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {item.title}
                        </h3>

                        <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium line-clamp-3 mb-4">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold mono">
                        <span className="text-muted-foreground">{item.source} {item.language ? `· ${item.language}` : ""}</span>
                        {item.url.startsWith("/") ? (
                          <Link to={item.url} className="text-primary hover:text-white flex items-center gap-1">
                            VIEW <ArrowUpRight size={13} />
                          </Link>
                        ) : (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-white flex items-center gap-1"
                          >
                            VISIT <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Load More Pagination */}
                {hasMoreCategoryItems && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={loadMoreCategoryItems}
                      disabled={isLoadingMoreCategory}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.15em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black glass-sm disabled:opacity-50"
                    >
                      {isLoadingMoreCategory ? "LOADING BATCH..." : `LOAD MORE ITEMS (${remainingCategoryCount} REMAINING)`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
