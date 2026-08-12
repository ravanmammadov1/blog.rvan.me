import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  BadgeCheck,
  Type,
  ArrowLeft,
  Sliders,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
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
import { FontSpecimenCard } from "../components/content/FontSpecimenCard";

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

  // Live Specimen Tester State
  const [previewText, setPreviewText] = useState(
    "Design systems engineered for precision, legibility, and elegance."
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
    "@type": "CreativeWork",
    "name": `${font.family} Font Family`,
    "alternateName": font.name,
    "creator": {
      "@type": "Person",
      "name": font.designer,
    },
    "publisher": {
      "@type": "Organization",
      "name": font.foundry,
    },
    "genre": font.category,
    "license": font.license,
    "url": canonicalUrl,
    "description": font.description,
  };

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${font.family} Font Family — Free Download & Specimen | Rvan.me`}
        description={`${font.family} is an open-source ${font.category.toLowerCase()} typeface family designed by ${font.designer}. Live specimen preview, style weights, license info, and free ZIP download.`}
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
            <Link to="/resources?category=fonts" className="hover:underline flex items-center gap-1">
              <ArrowLeft size={12} /> FONTS CATALOG
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{font.category}</span>
          </nav>
        }
        title={font.family}
        accentText="Typeface Specimen."
        gradientVariant="creative"
        description={font.description}
      >
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={directDownloadUrl}
            download={`${font.family}.zip`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold text-white uppercase tracking-wider hover:scale-105 transition-all duration-300 mono cursor-pointer shadow-[0_0_25px_rgba(97,197,173,0.35)]"
            style={{
              background: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)",
            }}
          >
            DOWNLOAD ZIP <Download size={14} />
          </a>
          {font.officialUrl && (
            <a
              href={font.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-bold text-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 mono uppercase glass-sm"
            >
              OFFICIAL HOMEPAGE <ExternalLink size={13} />
            </a>
          )}
        </div>
      </PageHero>

      {/* Interactive Specimen Tester */}
      <section className="px-6 py-10 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px] space-y-10">
          <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 glass space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase">
                <Type size={16} /> LIVE SPECIMEN TESTER
              </div>

              <div className="flex items-center gap-6">
                {/* Font Size Slider */}
                <div className="flex items-center gap-3 text-xs font-bold mono">
                  <span className="text-muted-foreground">SIZE:</span>
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
                placeholder="Type your custom specimen text here..."
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
            <h2 className="text-xs font-bold tracking-widest text-primary mono uppercase">CHARACTER SET & GLYPH OVERVIEW</h2>
            <div className="p-6 rounded-2xl border border-white/5 bg-background/90 font-medium space-y-4 overflow-hidden">
              <div>
                <p className="text-[10px] text-muted-foreground mono mb-1 uppercase">Uppercase Alphabet</p>
                <p
                  style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
                  className="text-2xl md:text-3xl text-foreground tracking-wider break-words"
                >
                  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mono mb-1 uppercase">Lowercase Alphabet</p>
                <p
                  style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
                  className="text-2xl md:text-3xl text-foreground tracking-wider break-words"
                >
                  a b c d e f g h i j k l m n o p q r s t u v w x y z
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mono mb-1 uppercase">Numerals & Symbols</p>
                <p
                  style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
                  className="text-2xl md:text-3xl text-foreground tracking-wider break-words"
                >
                  0 1 2 3 4 5 6 7 8 9 ! @ # $ % ^ & * ( ) _ + - = [ ]
                </p>
              </div>
            </div>
          </div>

          {/* Metadata & Technical Specs Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 glass">
              <span className="text-[10px] font-bold text-muted-foreground mono uppercase">DESIGNER & FOUNDRY</span>
              <p className="mt-2 text-base font-bold text-foreground">{font.designer}</p>
              <p className="text-xs text-muted-foreground mono mt-0.5">{font.foundry}</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 glass">
              <span className="text-[10px] font-bold text-muted-foreground mono uppercase">CATEGORY & STYLES</span>
              <p className="mt-2 text-base font-bold text-primary">{font.category}</p>
              <p className="text-xs text-muted-foreground mono mt-0.5">{font.stylesCount} Included Styles</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 glass">
              <span className="text-[10px] font-bold text-muted-foreground mono uppercase">TYPE ARCHITECTURE</span>
              <p className="mt-2 text-base font-bold text-cyan-400">
                {font.isVariable ? "Variable Font (Axes Supported)" : "Static Family"}
              </p>
              <p className="text-xs text-muted-foreground mono mt-0.5">Format: WOFF2 / TTF / OTF</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 glass">
              <span className="text-[10px] font-bold text-muted-foreground mono uppercase">COMMERCIAL LICENSE</span>
              <p className="mt-2 text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <BadgeCheck size={16} /> Free Commercial Use
              </p>
              <p className="text-xs text-muted-foreground mono mt-0.5">{font.license}</p>
            </div>
          </div>

          {/* Similar Fonts Section */}
          {similarFonts.length > 0 && (
            <div className="pt-8 border-t border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Similar {font.category} Typefaces</h2>
                  <p className="text-xs text-muted-foreground mono mt-1">Explore alternative type families with similar visual characteristics.</p>
                </div>
                <Link to="/resources?category=fonts" className="text-xs font-bold text-primary mono uppercase hover:underline">
                  VIEW ALL FONTS →
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarFonts.map((simFont, idx) => (
                  <FontSpecimenCard
                    key={simFont.id || idx}
                    font={simFont}
                    previewText="Design systems & typography."
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
