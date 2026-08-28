import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Sliders, Sparkles, Layers, ChevronDown, Palette, RefreshCw } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { fetchLiveFontCatalog, FontItem } from "../lib/fontEngine";
import {
  searchLucideIcons,
  ICON_CATEGORIES,
  IconCategory,
} from "../lib/iconEngine";
import {
  searchIllustrations,
  ILLUSTRATION_CATEGORIES,
  IllustrationCategory,
} from "../lib/illustrationsData";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import GlobalFaqSection from "./components/GlobalFaqSection";
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

export const CATEGORY_MAP: Record<ResourceCategoryKey, { label: string; icon: React.ReactNode }> = {
  fonts: { label: "Fonts", icon: <Type size={14} className="shrink-0" /> },
  icons: { label: "Icons", icon: <Sparkles size={14} className="shrink-0" /> },
  illustrations: { label: "Illustrations", icon: <Palette size={14} className="shrink-0" /> },
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
  const { t, language } = useLanguage();
  const isAz = language === "az";

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
  const [visibleIllustrationLimit, setVisibleIllustrationLimit] = useState(24);
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
    illustrations: isAz ? "İllüstrasiyalar" : "Illustrations",
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

  const handleSearchChange = (val: string) => {
    setParam("q", val);
  };

  // Filtered Fonts Catalog
  const filteredFonts = useMemo(() => {
    let list = fontCatalog;

    if (fontCategorySubfilter === "azerbaijani") {
      list = list.filter((f) => f.supportsAzerbaijani);
    } else if (fontCategorySubfilter !== "all") {
      const target = fontCategorySubfilter.toLowerCase().replace(/[^a-z0-9]/g, "");
      list = list.filter((f) => f.category?.toLowerCase().replace(/[^a-z0-9]/g, "") === target);
    }

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase().trim();
      const qNorm = q.replace(/[^a-z0-9]/g, "");
      list = list.filter(
        (f) =>
          f.family.toLowerCase().includes(q) ||
          f.name.toLowerCase().includes(q) ||
          f.designer?.toLowerCase().includes(q) ||
          f.category?.toLowerCase().includes(q) ||
          (qNorm.length >= 3 && f.category?.toLowerCase().replace(/[^a-z0-9]/g, "").includes(qNorm)) ||
          f.foundry?.toLowerCase().includes(q) ||
          f.aliases?.some((a) => a.toLowerCase().includes(q)) ||
          (q === "calibri" && f.family.toLowerCase() === "carlito")
      );
    }

    return list;
  }, [fontCatalog, fontCategorySubfilter, deferredSearch]);

  // Filtered Lucide Icons Catalog
  const filteredIcons = useMemo(() => {
    return searchLucideIcons(deferredSearch, iconCategorySubfilter);
  }, [deferredSearch, iconCategorySubfilter]);

  // Filtered Open-Source Vector Illustrations Catalog
  const filteredIllustrations = useMemo(() => {
    return searchIllustrations(deferredSearch, illustrationCategorySubfilter);
  }, [deferredSearch, illustrationCategorySubfilter]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${t("resourcesArchiveTitle", "Open-Source Fonts, Vector Icons & Illustrations")} — Rvan.me`}
        description={t("resourcesArchiveSubtitle", "Curated open-source Google Font families, SVG/React vector icons, and open-source illustration catalog.")}
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

      {/* Master Page Hero */}
      <PageHero
        eyebrow={isAz ? "RESURSLAR · EKOSİSTEM" : "RESOURCES · ECOSYSTEM"}
        title={isAz ? "ALƏTLƏR. AKTİVLƏR." : "TOOLS. ASSETS."}
        accentText={isAz ? "MƏNBƏLƏR." : "REFERENCES."}
        description={t(
          "resourcesArchiveSubtitle",
          "Curated open-source Google Font families, SVG/React vector icons, and open-source illustration catalog."
        )}
      />

      {/* Primary Category Filter Bar (FONTS | ICONS) */}
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
            ? "Search vector icons..."
            : "Search open-source illustrations..."
        }
        searchId="resources-search"
      />

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. FONTS CATALOG SECTION
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "fonts" && (
        <section className="px-4 py-8 sm:px-6 md:px-8 relative z-10">
          <div className="mx-auto max-w-[1280px]">
            {/* Font Toolbar */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-4 backdrop-blur-md shadow-xs">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 min-w-0">
                {[
                  { key: "all", label: isAz ? "HAMISI" : "ALL" },
                  { key: "azerbaijani", label: isAz ? "AZƏRBAYCAN DİLİ (Ə)" : "AZERBAIJANI (Ə)" },
                  { key: "sans-serif", label: "SANS SERIF" },
                  { key: "serif", label: "SERIF" },
                  { key: "display", label: "DISPLAY" },
                  { key: "monospace", label: "MONOSPACE" },
                  { key: "handwriting", label: "HANDWRITING" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setFontCategorySubfilter(item.key);
                      if (item.key === "azerbaijani" && !previewText) {
                        setPreviewText("Dizayn sistemləri və tipoqrafiya arxitekturası — Ə, ğ, ı, ö, ş, ü, ç.");
                      }
                    }}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      fontCategorySubfilter === item.key
                        ? item.key === "azerbaijani"
                          ? "bg-emerald-400 text-black font-extrabold"
                          : "bg-primary text-black"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Custom Preview Text & Size */}
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <input
                  type="text"
                  autoComplete="off"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Type preview text..."
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none w-full sm:w-56 md:w-72"
                />

                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mono uppercase shrink-0">
                  <span>{fontSizePx}px</span>
                  <input
                    type="range"
                    min="18"
                    max="64"
                    value={fontSizePx}
                    onChange={(e) => setFontSizePx(Number(e.target.value))}
                    className="h-1.5 w-24 cursor-pointer accent-primary bg-white/10 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Font Grid */}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : filteredFonts.length === 0 ? (
              <div className="rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 text-center my-6 glass">
                <p className="text-muted-foreground text-xs">
                  {isAz ? "Axtarışınıza və ya seçilmiş filtrə uyğun şrift tapılmadı." : "No Google Fonts found matching your criteria."}
                </p>
                <button
                  onClick={() => {
                    setFontCategorySubfilter("all");
                    handleSearchChange("");
                  }}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white cursor-pointer"
                >
                  {isAz ? "FİLTERLƏRİ SIFIRLA" : "RESET FILTERS"}
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {filteredFonts.slice(0, visibleFontLimit).map((font, idx) => (
                    <FontSpecimenCard
                      key={font.family}
                      font={font}
                      previewText={previewText}
                      fontSizePx={fontSizePx}
                      idx={idx}
                      fadeUpVariants={fadeUp}
                    />
                  ))}
                </div>

                {visibleFontLimit < filteredFonts.length && (
                  <div className="mt-10 text-center">
                    <Button
                      onClick={() => setVisibleFontLimit((prev) => prev + 12)}
                      variant="outline"
                      size="md"
                    >
                      LOAD MORE FONTS
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. ICONS CATALOG SECTION
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "icons" && (
        <section className="px-4 py-8 sm:px-6 md:px-8 relative z-10">
          <div className="mx-auto max-w-[1280px]">
            {/* Single-Line Toolbar with Dropdown Category & Slider Controls */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/10 bg-white/5 p-4 glass">
              
              {/* Category Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIconCategoryDropdownOpen(!iconCategoryDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-mono font-bold text-foreground hover:border-[#61c5ad]/50 hover:bg-white/10 transition-all cursor-pointer select-none"
                >
                  <Sparkles size={14} className="text-primary" />
                  <span>Category: {iconCategorySubfilter}</span>
                  <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${iconCategoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {iconCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 z-50 w-64 rounded-2xl border border-white/15 bg-neutral-900/95 p-2 backdrop-blur-2xl shadow-2xl space-y-1"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/70">
                        Select Category
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

            {/* Reset Filters Option if filtered */}
            {(deferredSearch || iconCategorySubfilter !== "All") && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => {
                    setIconCategorySubfilter("All");
                    handleSearchChange("");
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono text-primary hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} /> Reset Filters
                </button>
              </div>
            )}

            {/* Icon Specimen Grid */}
            {filteredIcons.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center my-6 glass">
                <p className="text-muted-foreground text-xs">No vector icons found matching your search query.</p>
                <button
                  onClick={() => {
                    setIconCategorySubfilter("All");
                    handleSearchChange("");
                  }}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white cursor-pointer"
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

                {visibleIconLimit < filteredIcons.length && (
                  <div className="mt-10 text-center">
                    <Button
                      onClick={() => setVisibleIconLimit((prev) => prev + 36)}
                      variant="outline"
                      size="md"
                    >
                      LOAD MORE ICONS
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. ILLUSTRATIONS CATALOG SECTION
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "illustrations" && (
        <section className="px-4 py-8 sm:px-6 md:px-8 relative z-10">
          <div className="mx-auto max-w-[1280px]">
            {/* Single-Line Toolbar with Category Pills & Color Customizer */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
              {/* Category Pills with Brand Gradient Active State */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 min-w-0">
                {ILLUSTRATION_CATEGORIES.map((cat) => {
                  const isSelected = illustrationCategorySubfilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setIllustrationCategorySubfilter(cat)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                        isSelected
                          ? "text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface border border-border"
                      }`}
                      style={
                        isSelected
                          ? { backgroundImage: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)" }
                          : undefined
                      }
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Color Customization Presets */}
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Palette size={14} className="text-primary shrink-0" />
                  <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase shrink-0">Accent:</span>
                  <div className="flex items-center gap-1.5 bg-surface border border-border p-1 rounded-xl">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setIllustrationColor(color)}
                        className={`h-5 w-5 rounded-lg transition-transform cursor-pointer ${
                          illustrationColor === color ? "scale-110 border-2 border-primary shadow-md" : "hover:scale-105 opacity-80"
                        }`}
                        style={{ backgroundColor: color }}
                        title={`Color: ${color}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={illustrationColor}
                      onChange={(e) => setIllustrationColor(e.target.value)}
                      className="h-5 w-5 rounded-lg border-0 bg-transparent cursor-pointer opacity-80 hover:opacity-100"
                      title="Custom Hex Color"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Counter & Reset Option */}
            <div className="mb-6 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>
                {filteredIllustrations.length} {filteredIllustrations.length === 1 ? "illustration" : "illustrations"} found
              </span>

              {(deferredSearch || illustrationCategorySubfilter !== "All") && (
                <button
                  onClick={() => {
                    setIllustrationCategorySubfilter("All");
                    handleSearchChange("");
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono text-primary hover:underline transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} /> Reset Filters
                </button>
              )}
            </div>

            {/* Illustration Specimen Grid */}
            {filteredIllustrations.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center my-6 glass">
                <p className="text-muted-foreground text-xs">No vector illustrations found matching your search query.</p>
                <button
                  onClick={() => {
                    setIllustrationCategorySubfilter("All");
                    handleSearchChange("");
                  }}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white cursor-pointer"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredIllustrations.slice(0, visibleIllustrationLimit).map((illItem) => (
                    <IllustrationSpecimenCard
                      key={illItem.id}
                      illustration={illItem}
                      accentColor={illustrationColor}
                    />
                  ))}
                </div>

                {visibleIllustrationLimit < filteredIllustrations.length && (
                  <div className="mt-10 text-center">
                    <Button
                      onClick={() => setVisibleIllustrationLimit((prev) => prev + 24)}
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

      {/* ── Global FAQ Section ── */}
      <GlobalFaqSection />

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
