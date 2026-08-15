import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Sliders, Sparkles, Layers, ChevronDown, Palette, RefreshCw, Image as ImageIcon } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { fetchLiveFontCatalog, FontItem } from "../lib/fontEngine";
import {
  searchLucideIcons,
  ICON_CATEGORIES,
  IconCategory,
  getIconCategoryCounts,
} from "../lib/iconEngine";
import {
  searchIllustrations,
  ILLUSTRATION_CATEGORIES,
  IllustrationCategory,
  getIllustrationCategoryCounts,
} from "../lib/illustrationEngine";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { FontSpecimenCard } from "./components/content/FontSpecimenCard";
import { IconSpecimenCard } from "./components/content/IconSpecimenCard";
import { IllustrationSpecimenCard } from "./components/content/IllustrationSpecimenCard";
import PageHero from "./components/PageHero";
import PageFilterBar from "./components/PageFilterBar";
import { Button } from "./components/ui/Button";
import { useLanguage } from "../lib/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

export type ResourceCategoryKey = "fonts" | "icons" | "illustrations";

export const CATEGORY_MAP: Record<ResourceCategoryKey, { label: string; icon: string }> = {
  fonts: { label: "Fonts", icon: "🔤" },
  icons: { label: "Icons", icon: "🎨" },
  illustrations: { label: "Illustrations", icon: "🖼️" },
};

const COLOR_PRESETS = [
  "#61c5ad", // Mint (Default Brand)
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ffffff", // White
];

export default function ResourcesArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [fontCatalog, setFontCatalog] = useState<FontItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useLanguage();

  // Font Specimen Interactive Controls
  const [previewText, setPreviewText] = useState("Design systems engineered for precision & elegance.");
  const [fontSizePx, setFontSizePx] = useState(28);
  const [fontCategorySubfilter, setFontCategorySubfilter] = useState("all");
  const [visibleFontLimit, setVisibleFontLimit] = useState(12);

  // Icon Specimen Interactive Controls
  const [iconCategorySubfilter, setIconCategorySubfilter] = useState<IconCategory>("All");
  const [iconSize, setIconSize] = useState(28);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [iconColor, setIconColor] = useState("#61c5ad");
  const [visibleIconLimit, setVisibleIconLimit] = useState(36);
  const [iconCategoryDropdownOpen, setIconCategoryDropdownOpen] = useState(false);

  // Illustration Specimen Interactive Controls
  const [illustrationCategorySubfilter, setIllustrationCategorySubfilter] = useState<IllustrationCategory>("All");
  const [illustrationColor, setIllustrationColor] = useState("#61c5ad");
  const [visibleIllustrationLimit, setVisibleIllustrationLimit] = useState(8);
  const [illustrationCategoryDropdownOpen, setIllustrationCategoryDropdownOpen] = useState(false);

  const activeCategoryParam = searchParams.get("category") as ResourceCategoryKey;
  const activeCategory: ResourceCategoryKey =
    activeCategoryParam === "icons"
      ? "icons"
      : activeCategoryParam === "illustrations"
      ? "illustrations"
      : "fonts";

  const searchQuery = searchParams.get("q") || "";
  const deferredSearch = useDeferredValue(searchQuery);

  const categoryLabels: Record<ResourceCategoryKey, string> = {
    fonts: t("fonts", "Fonts"),
    icons: t("icons", "Icons"),
    illustrations: t("illustrations", "Illustrations"),
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    fetchLiveFontCatalog()
      .then((items) => {
        if (Array.isArray(items)) setFontCatalog(items);
      })
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

  // Filtered Font Catalog
  const filteredFonts = useMemo(() => {
    let list = fontCatalog;

    if (fontCategorySubfilter !== "all") {
      list = list.filter((f) => (f.category || "").toLowerCase() === fontCategorySubfilter.toLowerCase());
    }

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(
        (f) =>
          f.family.toLowerCase().includes(q) ||
          (f.category || "").toLowerCase().includes(q) ||
          (f.designer || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [fontCatalog, fontCategorySubfilter, deferredSearch]);

  const fontCountsBySubfilter = useMemo(() => {
    const counts: Record<string, number> = { all: fontCatalog.length };
    fontCatalog.forEach((f) => {
      const cat = (f.category || "sans-serif").toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [fontCatalog]);

  // Filtered Lucide Icons Catalog (1,500+ icons)
  const filteredIcons = useMemo(() => {
    return searchLucideIcons(deferredSearch, iconCategorySubfilter);
  }, [deferredSearch, iconCategorySubfilter]);

  const iconCategoryCounts = useMemo(() => {
    return getIconCategoryCounts();
  }, []);

  // Filtered Vector Illustrations Catalog
  const filteredIllustrations = useMemo(() => {
    return searchIllustrations(deferredSearch, illustrationCategorySubfilter);
  }, [deferredSearch, illustrationCategorySubfilter]);

  const illustrationCategoryCounts = useMemo(() => {
    return getIllustrationCategoryCounts();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${t("resourcesArchiveTitle", "Open-Source Fonts, 1,500+ Icons & Vector Illustrations")} — Rvan.me`}
        description={t("resourcesArchiveSubtitle", "Curated open-source Google Font families, full 1,500+ Lucide icon catalog, and customizable vector illustrations.")}
        url="https://www.rvan.me/resources"
      />

      {/* Aurora Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
        <div
          className="absolute -top-[20%] left-[20%] h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.08) 0%, rgba(59,130,246,0.04) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Page Hero */}
      <PageHero
        title={t("resourcesHeadingMain", "Creative")}
        accentText={t("resourcesHeadingAccent", "Resources.")}
        gradientVariant="primary"
        description={t("resourcesArchiveSubtitle", "Curated open-source Google Font families, full 1,500+ Lucide icon catalog, and customizable vector illustrations.")}
      />

      {/* Primary Category Filter Bar (FONTS | ICONS | ILLUSTRATIONS) */}
      <PageFilterBar
        categories={Object.entries(CATEGORY_MAP).map(([key, config]) => ({
          key,
          label: categoryLabels[key as ResourceCategoryKey] || config.label,
          icon: config.icon,
        }))}
        activeCategory={activeCategory}
        onSelectCategory={(key) => {
          setParam("category", key);
        }}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder={
          activeCategory === "fonts"
            ? "Search fonts by family or designer..."
            : activeCategory === "icons"
            ? "Search 1,500+ icons by name or category..."
            : "Search vector illustrations..."
        }
        searchId="resources-search"
      />

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. FONTS CATALOG SECTION
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "fonts" && (
        <section className="px-6 py-10 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            {/* Font Specimen Toolbar Controls */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/10 bg-white/5 p-4 glass">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-background/60 px-4 py-2">
                <Type size={16} className="text-primary shrink-0" />
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Type specimen text..."
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50 font-medium"
                />
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mono uppercase">
                  <Sliders size={14} className="text-primary" />
                  <span>{fontSizePx}px</span>
                  <input
                    type="range"
                    min="14"
                    max="72"
                    value={fontSizePx}
                    onChange={(e) => setFontSizePx(Number(e.target.value))}
                    className="h-1.5 w-24 cursor-pointer accent-primary bg-white/10 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Font Subfilter Tabs */}
            <div className="mb-8 flex flex-wrap gap-2">
              {["all", "sans-serif", "serif", "monospace", "display"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setFontCategorySubfilter(sub)}
                  className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider transition-all mono ${
                    fontCategorySubfilter === sub
                      ? "bg-primary text-black"
                      : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sub === "all" ? t("allNews", "All") : sub} ({(fontCountsBySubfilter[sub] || 0)})
                </button>
              ))}
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
                <p className="text-muted-foreground text-xs">{t("noArticlesFound", "No font families found matching your search.")}</p>
                <button
                  onClick={() => {
                    setFontCategorySubfilter("all");
                    handleSearchChange("");
                  }}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white"
                >
                  {t("resetFilters", "RESET FILTERS")}
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
                    <Button
                      onClick={() => setVisibleFontLimit((prev) => prev + 16)}
                      variant="outline"
                      size="md"
                    >
                      LOAD MORE FONTS ({filteredFonts.length - visibleFontLimit} REMAINING)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. ICONS CATALOG SECTION (1,500+ Lucide Vectors)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "icons" && (
        <section className="px-6 py-10 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            {/* Sleek Single-Line Icon Toolbar with Dropdown Category Selector */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/10 bg-white/5 p-4 glass">
              
              {/* Category Dropdown Selector (Compact Popover) */}
              <div className="relative">
                <button
                  onClick={() => setIconCategoryDropdownOpen(!iconCategoryDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-mono font-bold text-foreground hover:border-[#61c5ad]/50 hover:bg-white/10 transition-all cursor-pointer select-none"
                >
                  <Sparkles size={14} className="text-primary" />
                  <span>Category: {iconCategorySubfilter}</span>
                  <span className="ml-1 text-[10px] text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded-full">
                    {iconCategoryCounts[iconCategorySubfilter] || filteredIcons.length}
                  </span>
                  <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${iconCategoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {iconCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 z-50 w-72 rounded-2xl border border-white/15 bg-neutral-900/95 p-2 backdrop-blur-2xl shadow-2xl space-y-1"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/70">
                        Select Icon Category
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {ICON_CATEGORIES.map((cat) => {
                          const isSelected = iconCategorySubfilter === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setIconCategorySubfilter(cat);
                                setIconCategoryDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all text-left cursor-pointer ${
                                isSelected
                                  ? "bg-primary text-black font-bold"
                                  : "text-muted-foreground hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <span className="truncate">{cat}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? "bg-black/20 text-black font-bold" : "bg-white/5 text-muted-foreground/80"}`}>
                                {iconCategoryCounts[cat] || 0}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Color Customization & Size / Stroke Sliders */}
              <div className="flex flex-wrap items-center gap-5">
                {/* Icon Color Presets */}
                <div className="flex items-center gap-2">
                  <Palette size={14} className="text-primary shrink-0" />
                  <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase shrink-0">Color:</span>
                  <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setIconColor(color)}
                        className={`h-5 w-5 rounded-lg transition-transform cursor-pointer ${
                          iconColor === color ? "scale-110 border-2 border-white shadow-md" : "hover:scale-105 opacity-80"
                        }`}
                        style={{ backgroundColor: color }}
                        title={`Color: ${color}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={iconColor}
                      onChange={(e) => setIconColor(e.target.value)}
                      className="h-5 w-5 rounded-lg border-0 bg-transparent cursor-pointer opacity-80 hover:opacity-100"
                      title="Custom Hex Color"
                    />
                  </div>
                </div>

                {/* Size Slider */}
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mono uppercase">
                  <Sliders size={14} className="text-primary" />
                  <span>Size: {iconSize}px</span>
                  <input
                    type="range"
                    min="16"
                    max="56"
                    value={iconSize}
                    onChange={(e) => setIconSize(Number(e.target.value))}
                    className="h-1.5 w-20 cursor-pointer accent-primary bg-white/10 rounded-lg"
                  />
                </div>

                {/* Stroke Width Slider */}
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mono uppercase">
                  <Layers size={14} className="text-primary" />
                  <span>Stroke: {strokeWidth}px</span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.5"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="h-1.5 w-16 cursor-pointer accent-primary bg-white/10 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Icon Count & Results Summary */}
            <div className="mb-6 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Showing {Math.min(visibleIconLimit, filteredIcons.length)} of {filteredIcons.length} vector icons</span>
              {(deferredSearch || iconCategorySubfilter !== "All") && (
                <button
                  onClick={() => {
                    setIconCategorySubfilter("All");
                    handleSearchChange("");
                  }}
                  className="flex items-center gap-1 text-primary hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} /> Reset Filters
                </button>
              )}
            </div>

            {/* Icon Specimen Grid */}
            {filteredIcons.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center my-6 glass">
                <p className="text-muted-foreground text-xs">No vector icons found matching your search query.</p>
                <button
                  onClick={() => {
                    setIconCategorySubfilter("All");
                    handleSearchChange("");
                  }}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredIcons.slice(0, visibleIconLimit).map((iconItem) => (
                    <IconSpecimenCard
                      key={iconItem.id}
                      iconItem={iconItem}
                      iconSize={iconSize}
                      strokeWidth={strokeWidth}
                      iconColor={iconColor}
                    />
                  ))}
                </div>

                {/* Load More Icons Button */}
                {visibleIconLimit < filteredIcons.length && (
                  <div className="mt-10 text-center">
                    <Button
                      onClick={() => setVisibleIconLimit((prev) => prev + 36)}
                      variant="outline"
                      size="md"
                    >
                      LOAD MORE ICONS ({filteredIcons.length - visibleIconLimit} REMAINING)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. ILLUSTRATIONS CATALOG SECTION (unDraw Style Dynamic Vectors)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "illustrations" && (
        <section className="px-6 py-10 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            {/* Single-Line Toolbar with Dropdown Category & Color Palette */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/10 bg-white/5 p-4 glass">
              
              {/* Illustration Category Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIllustrationCategoryDropdownOpen(!illustrationCategoryDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-mono font-bold text-foreground hover:border-[#61c5ad]/50 hover:bg-white/10 transition-all cursor-pointer select-none"
                >
                  <ImageIcon size={14} className="text-primary" />
                  <span>Category: {illustrationCategorySubfilter}</span>
                  <span className="ml-1 text-[10px] text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded-full">
                    {illustrationCategoryCounts[illustrationCategorySubfilter] || filteredIllustrations.length}
                  </span>
                  <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${illustrationCategoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {illustrationCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 z-50 w-72 rounded-2xl border border-white/15 bg-neutral-900/95 p-2 backdrop-blur-2xl shadow-2xl space-y-1"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/70">
                        Select Illustration Category
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {ILLUSTRATION_CATEGORIES.map((cat) => {
                          const isSelected = illustrationCategorySubfilter === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setIllustrationCategorySubfilter(cat);
                                setIllustrationCategoryDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all text-left cursor-pointer ${
                                isSelected
                                  ? "bg-primary text-black font-bold"
                                  : "text-muted-foreground hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <span className="truncate">{cat}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? "bg-black/20 text-black font-bold" : "bg-white/5 text-muted-foreground/80"}`}>
                                {illustrationCategoryCounts[cat] || 0}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dynamic Brand Color Customizer for Vector Illustrations */}
              <div className="flex items-center gap-2">
                <Palette size={14} className="text-primary shrink-0" />
                <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase shrink-0">Brand Accent Color:</span>
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setIllustrationColor(color)}
                      className={`h-5 w-5 rounded-lg transition-transform cursor-pointer ${
                        illustrationColor === color ? "scale-110 border-2 border-white shadow-md" : "hover:scale-105 opacity-80"
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Brand Color: ${color}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={illustrationColor}
                    onChange={(e) => setIllustrationColor(e.target.value)}
                    className="h-5 w-5 rounded-lg border-0 bg-transparent cursor-pointer opacity-80 hover:opacity-100"
                    title="Custom Brand Hex Color"
                  />
                </div>
              </div>
            </div>

            {/* Illustration Grid */}
            {filteredIllustrations.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center my-6 glass">
                <p className="text-muted-foreground text-xs">No vector illustrations found matching your query.</p>
                <button
                  onClick={() => {
                    setIllustrationCategorySubfilter("All");
                    handleSearchChange("");
                  }}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {filteredIllustrations.slice(0, visibleIllustrationLimit).map((item) => (
                    <IllustrationSpecimenCard
                      key={item.id}
                      illustration={item}
                      accentColor={illustrationColor}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleIllustrationLimit < filteredIllustrations.length && (
                  <div className="mt-10 text-center">
                    <Button
                      onClick={() => setVisibleIllustrationLimit((prev) => prev + 6)}
                      variant="outline"
                      size="md"
                    >
                      LOAD MORE ILLUSTRATIONS ({filteredIllustrations.length - visibleIllustrationLimit} REMAINING)
                    </Button>
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
