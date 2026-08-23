import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  BadgeCheck,
  Type,
  ArrowLeft,
  ArrowRight,
  Sliders,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
  BookOpen,
  Compass,
} from "lucide-react";

import {
  loadStaticFontCatalog,
  FontItem,
  getFontSlug,
  findFontBySlug,
  resolveDirectFontDownloadUrl,
} from "../../lib/fontEngine";
import { loadFontOnDemand } from "../../lib/fontLoader";
import { fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { Button } from "../components/ui/Button";
import { FontSpecimenCard } from "../components/content/FontSpecimenCard";
import { useLanguage } from "../../lib/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

export default function FontDetailPage() {
  const { fontSlug } = useParams<{ fontSlug: string }>();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [catalog, setCatalog] = useState<FontItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, getLocalizedPath, language, isAz } = useLanguage();

  // Live Specimen Tester State
  const [previewText, setPreviewText] = useState(
    t("defaultSpecimenText", "Design systems engineered for precision, legibility, and elegance.")
  );
  const [fontSizePx, setFontSizePx] = useState(36);
  const [selectedWeight, setSelectedWeight] = useState<number>(400);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then(setSiteSettings);

    loadStaticFontCatalog()
      .then((items) => {
        setCatalog(items || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const font = useMemo(() => {
    if (!fontSlug || catalog.length === 0) return undefined;
    return findFontBySlug(fontSlug, catalog);
  }, [fontSlug, catalog]);

  // Load font binary on demand when detail page opens
  useEffect(() => {
    if (font) {
      loadFontOnDemand(font);
    }
  }, [font]);

  // Similar fonts in the same category
  const similarFonts = useMemo(() => {
    if (!font) return [];
    return catalog
      .filter((f) => f.category === font.category && getFontSlug(f) !== getFontSlug(font))
      .slice(0, 6);
  }, [font, catalog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!font) {
    return (
      <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
        <SEO title="Font Not Found — Rvan.me" description="The requested font family could not be found." url="https://www.rvan.me/resources" />
        <SiteHeader siteSettings={siteSettings} />
        <div className="mx-auto max-w-4xl px-6 py-32 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Font Family Not Found</h1>
          <p className="mt-4 text-muted-foreground">The font family you are looking for does not exist in our catalog.</p>
          <Link to="/resources?category=fonts" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-black uppercase tracking-wider">
            <ArrowLeft size={14} /> BACK TO FONTS CATALOG
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const currentSlug = getFontSlug(font);
  const canonicalUrl = `https://www.rvan.me/fonts/${currentSlug}`;
  const directDownloadUrl = resolveDirectFontDownloadUrl(font);

  // Structured JSON-LD Data for Font Family
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${canonicalUrl}#fontfamily`,
        "name": `${font.family} Font Family`,
        "alternateName": font.name,
        "creator": {
          "@type": "Person",
          "name": font.designer,
        },
        "publisher": {
          "@type": "Organization",
          "name": font.foundry,
          "url": "https://www.rvan.me",
        },
        "genre": font.category,
        "license": font.license,
        "url": canonicalUrl,
        "description": font.description,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": language === "az" ? "Ana Səhifə" : "Home",
            "item": language === "az" ? "https://www.rvan.me/az" : "https://www.rvan.me",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": language === "az" ? "Şriftlər Kataloqu" : "Fonts Directory",
            "item": language === "az" ? "https://www.rvan.me/az/resources?category=fonts" : "https://www.rvan.me/resources?category=fonts",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": font.family,
            "item": canonicalUrl,
          },
        ],
      },
    ],
  };

  const seoTitle = language === "az"
    ? `${font.family} Şrift Ailəsi: Nümunə, CSS və Pulsuz Yüklə — Rvan.me`
    : `${font.family} Font Family: Specimen, CSS & Free Download — Rvan.me`;

  const seoDescription = language === "az"
    ? `${font.family} şrift ailəsini pulsuz yükləyin (${font.license || "SIL Açıq Şrift Lisenziyası"}). ${font.stylesCount || 1} şrift çəkisi${font.isVariable ? ", variativ oxlar" : ""}, canlı nümayiş redaktoru, CSS kodları və elastik clamp() kalkulyatoru ilə.`
    : `Download ${font.family} font family for free (${font.license || "SIL Open Font License"}). Features ${font.stylesCount || 1} style${(font.stylesCount || 1) > 1 ? "s" : ""}${font.isVariable ? ", variable axes" : ""}, live specimen tester, Fontsource/Google Fonts CSS code snippets, and fluid clamp() scale calculator.`;

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={seoTitle}
        description={seoDescription}
        url={canonicalUrl}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Unified Hero */}
      <PageHero
        eyebrow={
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
            <Link to={getLocalizedPath("/resources?category=fonts")} className="hover:underline flex items-center gap-1">
              <ArrowLeft size={12} /> {t("fontsCatalog", "FONTS CATALOG")}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{font.category}</span>
          </nav>
        }
        title={font.family}
        accentText={t("typefaceSpecimen", "Typeface Specimen.")}
        gradientVariant="creative"
        description={font.description}
      >
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            href={directDownloadUrl}
            external
            variant="primary"
            size="md"
            icon={<Download size={14} />}
          >
            {t("downloadZip", "DOWNLOAD ZIP")}
          </Button>
          {font.officialUrl && (
            <Button
              href={font.officialUrl}
              external
              variant="secondary"
              size="md"
              icon={<ExternalLink size={13} />}
            >
              {t("officialHomepage", "OFFICIAL HOMEPAGE")}
            </Button>
          )}
        </div>
      </PageHero>

      {/* Interactive Specimen Tester */}
      <section className="px-6 py-10 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px] space-y-10">
          <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 glass space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase">
                <Type size={16} /> {t("liveSpecimenTester", "LIVE SPECIMEN TESTER")}
              </div>

              <div className="flex items-center gap-6">
                {/* Font Size Slider */}
                <div className="flex items-center gap-3 text-xs font-bold mono">
                  <span className="text-muted-foreground">{t("size", "SIZE:")}</span>
                  <input
                    type="range"
                    min="14"
                    max="96"
                    value={fontSizePx}
                    onChange={(e) => setFontSizePx(Number(e.target.value))}
                    className="w-32 accent-primary cursor-pointer"
                  />
                  <span className="text-primary w-8 text-right">{fontSizePx}px</span>
                </div>

                {/* Weight Presets */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold mono">
                  {[400, 500, 600, 700, 800].map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-2.5 py-1 rounded-full border transition-all ${
                        selectedWeight === w
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-white/10 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder={t("specimenPlaceholder", "Type your custom specimen text here...")}
                className="w-full rounded-xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-all glass-sm"
              />
            </div>

            {/* Authentic Live Specimen Paragraph */}
            <div className="my-6 p-6 rounded-2xl border border-white/5 bg-background/90 min-h-[160px] flex items-center overflow-hidden">
              <p
                style={{
                  fontFamily: `"${font.family}", "${font.family.replace(/\s+(Pro|Display|Extra|Variable|Math|Code|Sans|Mono|Serif)$/i, "").trim()}", system-ui, sans-serif`,
                  fontSize: `${fontSizePx}px`,
                  fontWeight: selectedWeight,
                  lineHeight: 1.25,
                }}
                className="text-foreground transition-all duration-300 break-words w-full"
              >
                {previewText || font.sampleText}
              </p>
            </div>
          </div>

          {/* Character Set & Glyphs Preview */}
          <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 glass space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-primary mono uppercase">{t("glyphOverview", "CHARACTER SET & GLYPH OVERVIEW")}</h2>
            <div className="p-6 rounded-2xl border border-white/5 bg-background/90 font-medium space-y-4 overflow-hidden">
              <div>
                <p className="text-[10px] text-muted-foreground mono mb-1 uppercase">{t("uppercaseAlphabet", "Uppercase Alphabet")}</p>
                <p
                  style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
                  className="text-2xl md:text-3xl text-foreground tracking-wider break-words"
                >
                  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mono mb-1 uppercase">{t("lowercaseAlphabet", "Lowercase Alphabet")}</p>
                <p
                  style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
                  className="text-2xl md:text-3xl text-foreground tracking-wider break-words"
                >
                  a b c d e f g h i j k l m n o p q r s t u v w x y z
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mono mb-1 uppercase">{t("numeralsSymbols", "Numerals & Symbols")}</p>
                <p
                  style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
                  className="text-2xl md:text-3xl text-foreground tracking-wider break-words"
                >
                  0 1 2 3 4 5 6 7 8 9 ! @ # $ % ^ & * ( ) _ + - = [ ]
                </p>
              </div>

              {/* Azerbaijani Latin Special Glyphs */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[10px] text-muted-foreground mono uppercase">
                    {language === "az" ? "Azərbaycan Latın Əlifbası (Xüsusi Qliflər)" : "Azerbaijani Latin Special Glyphs"}
                  </p>
                  {font.supportsAzerbaijani ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mono">
                      <CheckCircle2 size={11} /> {language === "az" ? "Dəstəklənir (100% Tam Dəstək)" : "Azerbaijani Supported"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400/80 mono">
                      {language === "az" ? "Standart Latın Qlifləri" : "Standard Latin Coverage"}
                    </span>
                  )}
                </div>
                <p
                  style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
                  className="text-2xl md:text-3xl text-foreground tracking-wider break-words"
                >
                  Ə ə · Ğ ğ · İ ı · Ö ö · Ş ş · Ü ü · Ç ç
                </p>
              </div>
            </div>
          </div>

          {/* Metadata & Technical Specs Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 glass">
              <span className="text-[10px] font-bold text-muted-foreground mono uppercase">{t("designerFoundry", "DESIGNER & FOUNDRY")}</span>
              <p className="mt-2 text-base font-bold text-foreground">{font.designer}</p>
              <p className="text-xs text-muted-foreground mono mt-0.5">{font.foundry}</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 glass">
              <span className="text-[10px] font-bold text-muted-foreground mono uppercase">{t("categoryStyles", "CATEGORY & STYLES")}</span>
              <p className="mt-2 text-base font-bold text-primary">{font.category}</p>
              <p className="text-xs text-muted-foreground mono mt-0.5">{font.stylesCount} {t("includedStyles", "Included Styles")}</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 glass">
              <span className="text-[10px] font-bold text-muted-foreground mono uppercase">
                {language === "az" ? "AZƏRBAYCAN DİLİ" : "AZERBAIJANI LANGUAGE"}
              </span>
              <p className={`mt-2 text-base font-bold ${font.supportsAzerbaijani ? "text-emerald-400" : "text-amber-400"}`}>
                {font.supportsAzerbaijani
                  ? (language === "az" ? "Tam Dəstək (Ə, ğ, ı, ö, ş, ü, ç)" : "Verified (Ə, ğ, ı, ö, ş, ü, ç)")
                  : (language === "az" ? "Standart Latın" : "Standard Latin")}
              </p>
              <p className="text-xs text-muted-foreground mono mt-0.5">
                {font.supportsAzerbaijani ? "Schwa (Ə/ə) + Latin-Ext A" : "Basic Latin"}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 glass">
              <span className="text-[10px] font-bold text-muted-foreground mono uppercase">{t("commercialLicense", "COMMERCIAL LICENSE")}</span>
              <p className="mt-2 text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <BadgeCheck size={16} /> {t("freeCommercialUse", "Free Commercial Use")}
              </p>
              <p className="text-xs text-muted-foreground mono mt-0.5">{font.license}</p>
            </div>
          </div>

          {/* Developer Integration & CDN Code Snippets */}
          <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 glass space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest text-primary mono uppercase flex items-center gap-2">
                <Sparkles size={14} /> DEVELOPER INTEGRATION & SOURCES
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground">Google Fonts • Fontsource • Bunny Fonts • Open Foundry</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* 1. Fontsource NPM */}
              <div className="p-4 rounded-2xl bg-background/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-primary">Fontsource (NPM / Self-Hosted)</span>
                  <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded text-white">NPM</span>
                </div>
                <pre className="p-2.5 rounded-xl bg-black/60 font-mono text-xs text-zinc-300 overflow-x-auto select-all">
                  npm install @fontsource/{getFontSlug(font)}
                </pre>
                <p className="text-[10px] text-muted-foreground font-mono">
                  Import in React/Next.js: <code className="text-primary">import "@fontsource/{getFontSlug(font)}";</code>
                </p>
              </div>

              {/* 2. Google Fonts HTML */}
              <div className="p-4 rounded-2xl bg-background/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-cyan-400">Google Fonts CDN</span>
                  <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded text-white">HTML LINK</span>
                </div>
                <pre className="p-2.5 rounded-xl bg-black/60 font-mono text-xs text-zinc-300 overflow-x-auto select-all">
                  {`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family).replace(/%20/g, "+")}:wght@400;600;700&display=swap" />`}
                </pre>
                <p className="text-[10px] text-muted-foreground font-mono">
                  CSS rule: <code className="text-cyan-400">font-family: '{font.family}', sans-serif;</code>
                </p>
              </div>

              {/* 3. Bunny Fonts Privacy CDN */}
              <div className="p-4 rounded-2xl bg-background/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-400">Bunny Fonts (Zero-Tracking CDN)</span>
                  <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded text-white">GDPR COMPLIANT</span>
                </div>
                <pre className="p-2.5 rounded-xl bg-black/60 font-mono text-xs text-zinc-300 overflow-x-auto select-all">
                  {`<link rel="stylesheet" href="https://fonts.bunny.net/css?family=${getFontSlug(font)}:400,600,700" />`}
                </pre>
                <p className="text-[10px] text-muted-foreground font-mono">
                  100% privacy-first EU CDN with zero user telemetry.
                </p>
              </div>

              {/* 4. Open Foundry & Direct Source */}
              <div className="p-4 rounded-2xl bg-background/80 border border-white/10 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-purple-400">Open Foundry & Releases</span>
                    <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded text-white">OFFICIAL</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Open-source licensed under <strong className="text-white">{font.license}</strong>. Direct download includes all TTF, OTF, and WOFF2 family binaries.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    href={resolveDirectFontDownloadUrl(font)}
                    download={`${font.family}.zip`}
                    external
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={<Download size={14} />}
                  >
                    {t("downloadFontFamilyZip", "DOWNLOAD FONT FAMILY (ZIP)")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Resource -> Tool Discovery Bridge */}
          <div className="p-6 md:p-8 rounded-3xl border border-sky-500/30 bg-sky-500/5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mono">
                  {language === "az" ? "TİPOQRAFİYA ALƏTİ" : "PRACTICAL TYPOGRAPHY WORKBENCH"}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {language === "az"
                    ? `${font.family} üçün Elastik CSS clamp() Miqyası Qurun`
                    : `Calculate Fluid CSS clamp() Scale for ${font.family}`}
                </h3>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  {language === "az"
                    ? `Bu şrift ailəsini riyazi modul miqyasda sınaqdan keçirin və canlı ekran simulyatoru ilə responsiv CSS tokenləri əldə edin.`
                    : `Test ${font.family} across harmonic modular scales and export production-ready fluid typography tokens with live viewport simulation.`}
                </p>
              </div>
              <Link
                to={getLocalizedPath("/tools/typography-scale")}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider mono shrink-0 hover:bg-sky-300 transition-colors"
              >
                <span>{language === "az" ? "Clamp Kalkulyatorunu Aç" : "Launch Scale Tool"}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Contextual Topic Hub & Editorial Ecosystem Links */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Topic Hub Link */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] glass flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mono uppercase">
                  <Compass size={14} /> {language === "az" ? "MÖVZU MƏRKƏZİ" : "TOPIC ECOSYSTEM HUB"}
                </div>
                <h4 className="text-base font-bold text-foreground">
                  {language === "az" ? "Tipoqrafiya Sistemləri və Şrift Uyğunlaşdırması" : "Typography Systems & Font Scale Hub"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === "az"
                    ? "Elastik şrift miqyası, şrift cütləşdirməsi və tipoqrafik ritm üzrə elmi tədqiqatlar və interaktiv alətlər toplusu."
                    : "Deep research on typographic semantics, mathematical modular scales, CSS clamp() calculation, and variable font engineering."}
                </p>
              </div>
              <Link
                to={getLocalizedPath("/resources?category=fonts")}
                className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 mono uppercase hover:underline"
              >
                <span>{language === "az" ? "Şrift Resurslarını Kəşf Et" : "Explore Font Resources"}</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Pillar Guide Link */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] glass flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase">
                  <BookOpen size={14} /> {language === "az" ? "ƏSAS BƏLƏDÇİ" : "FLAGSHIP PILLAR STUDY"}
                </div>
                <h4 className="text-base font-bold text-foreground">
                  {language === "az" ? "CSS clamp() ilə Responsiv Elastik Tipoqrafiyanın Tam Bələdçisi" : "Complete Guide to Responsive Fluid Typography with CSS clamp()"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === "az"
                    ? "Xətti interpolyasiya riyaziyyatı, harmonik modul miqyaslar və CSS clamp() ilə media query tullanışlarına son qoyun."
                    : "How linear interpolation equations, modular harmonic scales, and CSS clamp() eliminate breakpoint jumps."}
                </p>
              </div>
              <Link
                to={getLocalizedPath("/blog/guide-responsive-fluid-typography-css-clamp")}
                className="inline-flex items-center gap-2 text-xs font-bold text-primary mono uppercase hover:underline"
              >
                <span>{language === "az" ? "Bələdçini Oxu" : "Read Full Guide"}</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Similar Fonts Section */}
          {similarFonts.length > 0 && (
            <div className="pt-8 border-t border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("similarTypefaces", "Similar Typefaces")} ({font.category})</h2>
                  <p className="text-xs text-muted-foreground mono mt-1">{t("similarTypefacesDesc", "Explore alternative type families with similar visual characteristics.")}</p>
                </div>
                <Link to={getLocalizedPath("/resources?category=fonts")} className="text-xs font-bold text-primary mono uppercase hover:underline">
                  {t("viewAllFonts", "VIEW ALL FONTS")} →
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarFonts.map((simFont, idx) => (
                  <FontSpecimenCard
                    key={simFont.id || idx}
                    font={simFont}
                    previewText={t("defaultSpecimenText", "Design systems & typography.")}
                    fontSizePx={24}
                    idx={idx}
                    fadeUpVariants={fadeUp}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <ScrollToTopButton />
    </main>
  );
}
