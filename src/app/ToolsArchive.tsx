import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X, Zap, ArrowUpRight, Sparkles } from "lucide-react";

import { fetchTools, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ToolItem, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
import PageFilterBar from "./components/PageFilterBar";
import { INTERACTIVE_TOOLS } from "./lib/toolsRegistry";

const DesignerToolsPanel = lazy(() => import("./components/DesignerToolsPanel"));
const FeaturedInteractiveTools = lazy(() => import("./components/home/FeaturedInteractiveTools").then(m => ({ default: m.FeaturedInteractiveTools })));

import { useLanguage } from "../lib/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

export default function ToolsArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [toolsList, setToolsList] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { t, getLocalizedPath, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
    fetchTools()
      .then((data) => setToolsList(data))
      .finally(() => setLoading(false));
  }, []);

  const categoryLabelsMap: Record<string, string> = {
    All: t("categoryAll", "All"),
    Color: t("categoryColor", "Color"),
    Typography: t("categoryTypography", "Typography"),
    "Spacing & Grid": t("categorySpacingGrid", "Spacing & Grid"),
    "SVG & Code": t("categorySvgCode", "SVG & Code"),
    Shadows: t("categoryShadows", "Shadows"),
    SEO: t("categorySeo", "SEO"),
  };

  const toolCategories = ["All", "Color", "Typography", "Spacing & Grid", "SVG & Code", "Shadows", "SEO"];

  const filteredInteractiveTools = useMemo(() => {
    let result = INTERACTIVE_TOOLS;
    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={`${t("toolsArchiveTitle", "Tools & Interactive Toolkit.")} — Rvan.me`}
        description={t("toolsArchiveSubtitle", "Zero API dependencies, zero downloads. Copy clean production CSS, SVG, and HTML code instantly.")}
        url="https://www.rvan.me/tools"
      />

      {/* Global Unified Header */}
      <SiteHeader siteSettings={siteSettings} />

      {/* Unified Page Hero */}
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-primary mono uppercase">
            <Zap size={14} /> {t("toolsArchiveEyebrow", "FREE IN-BROWSER DEVELOPER & DESIGNER UTILITIES")}
          </span>
        }
        title={language === "az" ? "Alətlər və" : "Tools &"}
        accentText={language === "az" ? "interaktiv dəst." : "Interactive Toolkit."}
        gradientVariant="primary"
        description={t("toolsArchiveSubtitle", "Zero API dependencies, zero downloads. Copy clean production CSS, SVG, and HTML code instantly for CSS Grid, SVG Waves, Fluid Clamp(), Box Shadows, and SEO metadata.")}
      />
      {/* Master Page Filter Bar & Search */}
      <PageFilterBar
        categories={toolCategories.map((cat) => ({
          key: cat,
          label: categoryLabelsMap[cat] || cat,
        }))}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("toolsSearchPlaceholder", "Search tools...")}
        searchId="tools-search"
      />

      {/* Interactive Tools Showcase Grid */}
      <section className="px-6 py-12 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          {/* Interactive Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredInteractiveTools.map((tool) => (
              <motion.article
                key={tool.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full mono">
                      {categoryLabelsMap[tool.category] || tool.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium line-clamp-3 mb-4">
                    {tool.description}
                  </p>
                </div>

                <Link
                  to={getLocalizedPath(tool.path)}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-white/10 text-xs font-bold text-primary uppercase tracking-wider mono group-hover:text-white transition-colors"
                >
                  <span>{t("openTool", "LAUNCH UTILITY PAGE")}</span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Embedded Live Tool Studio */}
          <Suspense fallback={<div className="h-96 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />}>
            <FeaturedInteractiveTools />
          </Suspense>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
