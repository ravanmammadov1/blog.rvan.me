import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Type, Sliders, Sparkles, Layers } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { fetchLiveFontCatalog, FontItem } from "../lib/fontEngine";
import { searchLucideIcons, ICON_CATEGORIES, IconCategory } from "../lib/iconEngine";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { FontSpecimenCard } from "./components/content/FontSpecimenCard";
import { IconSpecimenCard } from "./components/content/IconSpecimenCard";
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

export type ResourceCategoryKey = "fonts" | "icons";

export const CATEGORY_MAP: Record<ResourceCategoryKey, { label: string; icon: string }> = {
  fonts: { label: "Fonts", icon: "🔤" },
  icons: { label: "Icons", icon: "🎨" },
};

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
  const [visibleIconLimit, setVisibleIconLimit] = useState(16);

  const activeCategory = (searchParams.get("category") as ResourceCategoryKey) === "icons" ? "icons" : "fonts";
  const searchQuery = searchParams.get("q") || "";
  const deferredSearch = useDeferredValue(searchQuery);

  const categoryLabels: Record<ResourceCategoryKey, string> = {
    fonts: t("fonts", "Fonts"),
    icons: t("icons", "Icons"),
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

  // Filtered Lucide Icons Catalog
  const filteredIcons = useMemo(() => {
    return searchLucideIcons(deferredSearch, iconCategorySubfilter);
  }, [deferredSearch, iconCategorySubfilter]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${t("resourcesArchiveTitle", "Open-Source Fonts & Vector Icons Directory")} — Rvan.me`}
        description={t("resourcesArchiveSubtitle", "Curated open-source Google Font families and SVG/React vector icon catalog.")}
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
        description={t("resourcesArchiveSubtitle", "Curated open-source Google Font families and SVG/React vector icon catalog.")}
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
        searchPlaceholder={activeCategory === "fonts" ? "Search fonts by family or designer..." : "Search icons by name, category, or tag..."}
        searchId="resources-search"
      />

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. FONTS CATALOG SECTION
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "fonts" ? (
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
      ) : (
        /* ─────────────────────────────────────────────────────────────────────────────
            2. ICONS CATALOG SECTION (Lucide Vectors & React Snippets)
        ───────────────────────────────────────────────────────────────────────────── */
        <section className="px-6 py-10 md:px-10 relative z-10">
          <div className="mx-auto max-w-[1600px]">
            {/* Icon Toolbar Controls (Size & Stroke Width Sliders) */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/10 bg-white/5 p-4 glass">
              <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase">
                <Sparkles size={16} />
                <span>LUCIDE VECTOR ICON SYSTEM</span>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mono uppercase">
                  <Sliders size={14} className="text-primary" />
                  <span>Size: {iconSize}px</span>
                  <input
                    type="range"
                    min="16"
                    max="56"
                    value={iconSize}
                    onChange={(e) => setIconSize(Number(e.target.value))}
                    className="h-1.5 w-24 cursor-pointer accent-primary bg-white/10 rounded-lg"
                  />
                </div>

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
                    className="h-1.5 w-20 cursor-pointer accent-primary bg-white/10 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Icon Category Subfilter Chips */}
            <div className="mb-8 flex flex-wrap gap-2">
              {ICON_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setIconCategorySubfilter(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider transition-all mono ${
                    iconCategorySubfilter === cat
                      ? "bg-primary text-black"
                      : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Icon Specimen Grid */}
            {filteredIcons.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center my-6 glass">
                <p className="text-muted-foreground text-xs">No vector icons found matching your search filter.</p>
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
                    />
                  ))}
                </div>

                {/* Load More Icons Button */}
                {visibleIconLimit < filteredIcons.length && (
                  <div className="mt-10 text-center">
                    <Button
                      onClick={() => setVisibleIconLimit((prev) => prev + 24)}
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

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
