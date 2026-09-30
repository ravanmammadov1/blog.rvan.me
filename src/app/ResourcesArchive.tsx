import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import { Type, Sparkles, Palette, Search, X } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { fetchLiveFontCatalog, FontItem } from "../lib/fontEngine";
import { searchLucideIcons } from "../lib/iconEngine";
import { searchIllustrations } from "../lib/illustrationsData";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import GlobalFaqSection from "./components/GlobalFaqSection";
import { FontSpecimenCard } from "./components/content/FontSpecimenCard";
import { IconSpecimenCard } from "./components/content/IconSpecimenCard";
import { IllustrationSpecimenCard } from "./components/content/IllustrationSpecimenCard";
import PageHero from "./components/PageHero";
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

export default function ResourcesArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [fontCatalog, setFontCatalog] = useState<FontItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t, language } = useLanguage();
  const isAz = language === "az";

  // Limits for pagination
  const [visibleFontLimit, setVisibleFontLimit] = useState(12);
  const [visibleIconLimit, setVisibleIconLimit] = useState(36);
  const [visibleIllustrationLimit, setVisibleIllustrationLimit] = useState(24);

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
    fonts: isAz ? "Şriftlər" : "Fonts",
    icons: isAz ? "İkonlar" : "Icons",
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
  }, [fontCatalog, deferredSearch]);

  // Filtered Lucide Icons Catalog
  const filteredIcons = useMemo(() => {
    return searchLucideIcons(deferredSearch, "All");
  }, [deferredSearch]);

  // Filtered Open-Source Vector Illustrations Catalog
  const filteredIllustrations = useMemo(() => {
    return searchIllustrations(deferredSearch, "All");
  }, [deferredSearch]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${t("resourcesArchiveTitle", "Open-Source Fonts, Vector Icons & Illustrations")} — Rvan.me`}
        description={t("resourcesArchiveSubtitle", "Curated open-source Google Font families, SVG/React vector icons, and open-source illustration catalog.")}
        url="https://blog.rvan.me/resources"
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

      {/* ── SINGLE STICKY RESOURCE TOOLBAR (TOP: 0, ONE COMPACT ROW) ── */}
      <div className="sticky top-0 z-30 w-full bg-background/95 dark:bg-background/95 backdrop-blur-2xl border-y border-border/80 shadow-xs transition-all">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Category Navigation (Fonts | Icons | Illustrations) */}
          <div
            className="flex items-center gap-2 overflow-x-auto md:overflow-x-visible scrollbar-none py-0.5 scroll-smooth touch-pan-x"
            role="tablist"
            aria-label="Resource Categories"
          >
            {Object.entries(CATEGORY_MAP).map(([key, config]) => {
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setParam("category", key)}
                  role="tab"
                  aria-selected={isActive}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer shrink-0 select-none ${
                    isActive
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-white/5 border border-border/60"
                  }`}
                >
                  {config.icon}
                  <span>{categoryLabels[key as ResourceCategoryKey] || config.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input Field on the Right */}
          <div className="w-full md:w-72 lg:w-80 shrink-0 relative">
            <label htmlFor="resources-search" className="sr-only">
              {activeCategory === "fonts"
                ? "Search fonts..."
                : activeCategory === "icons"
                ? "Search vector icons..."
                : "Search illustrations..."}
            </label>
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none"
              size={14}
            />
            <input
              id="resources-search"
              type="search"
              autoComplete="off"
              placeholder={
                activeCategory === "fonts"
                  ? isAz ? "Şrift və ya dizayner axtar..." : "Search fonts by family or designer..."
                  : activeCategory === "icons"
                  ? isAz ? "Vektor ikon axtar..." : "Search vector icons..."
                  : isAz ? "İllüstrasiya axtar..." : "Search open-source illustrations..."
              }
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-full border border-border bg-card/90 dark:bg-card/70 pl-9 pr-9 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. FONTS CATALOG SECTION
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeCategory === "fonts" && (
        <section className="px-4 py-8 sm:px-6 md:px-8 relative z-10">
          <div className="mx-auto max-w-[1280px]">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : filteredFonts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center my-6 shadow-sm">
                <p className="text-muted-foreground text-xs">
                  {isAz ? "Axtarışınıza uyğun şrift tapılmadı." : "No Google Fonts found matching your search."}
                </p>
                <button
                  onClick={() => handleSearchChange("")}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:underline cursor-pointer"
                >
                  {isAz ? "AXTARIŞI SIFIRLA" : "CLEAR SEARCH"}
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {filteredFonts.slice(0, visibleFontLimit).map((font, idx) => (
                    <FontSpecimenCard
                      key={font.family}
                      font={font}
                      previewText={isAz ? "Dizayn sistemləri və tipoqrafiya arxitekturası — Ə, ğ, ı, ö, ş, ü, ç." : "Design systems engineered for precision & elegance."}
                      fontSizePx={28}
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
                      {isAz ? "DAHA ÇOX ŞRİFT YÜKLƏ" : "LOAD MORE FONTS"}
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
            {filteredIcons.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center my-6 shadow-sm">
                <p className="text-muted-foreground text-xs">
                  {isAz ? "Axtarışınıza uyğun vektor ikon tapılmadı." : "No vector icons found matching your search query."}
                </p>
                <button
                  onClick={() => handleSearchChange("")}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:underline cursor-pointer"
                >
                  {isAz ? "AXTARIŞI SIFIRLA" : "CLEAR SEARCH"}
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredIcons.slice(0, visibleIconLimit).map((iconItem) => (
                    <IconSpecimenCard
                      key={iconItem.id}
                      iconItem={iconItem}
                      iconSize={28}
                      strokeWidth={2}
                      iconColor="#61c5ad"
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
                      {isAz ? "DAHA ÇOX İKON YÜKLƏ" : "LOAD MORE ICONS"}
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
            {filteredIllustrations.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center my-6 shadow-sm">
                <p className="text-muted-foreground text-xs">
                  {isAz ? "Axtarışınıza uyğun illüstrasiya tapılmadı." : "No vector illustrations found matching your search query."}
                </p>
                <button
                  onClick={() => handleSearchChange("")}
                  className="mt-3 text-xs font-bold tracking-widest text-primary uppercase mono hover:underline cursor-pointer"
                >
                  {isAz ? "AXTARIŞI SIFIRLA" : "CLEAR SEARCH"}
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredIllustrations.slice(0, visibleIllustrationLimit).map((illItem) => (
                    <IllustrationSpecimenCard
                      key={illItem.id}
                      illustration={illItem}
                      accentColor="#61c5ad"
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
                      {isAz
                        ? `DAHA ÇOX İLLÜSTRASİYA YÜKLƏ (${filteredIllustrations.length - visibleIllustrationLimit} QALIB)`
                        : `LOAD MORE ILLUSTRATIONS (${filteredIllustrations.length - visibleIllustrationLimit} REMAINING)`}
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
