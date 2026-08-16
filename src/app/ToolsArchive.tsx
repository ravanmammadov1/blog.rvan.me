import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Search, X, Check, Dices, Layers } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
import PageFilterBar from "./components/PageFilterBar";
import { INTERACTIVE_TOOLS, TOOL_CATEGORIES, InteractiveToolDefinition, ToolCategory } from "./lib/toolsRegistry";
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
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { t, getLocalizedPath, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  const filteredTools = useMemo(() => {
    let list = INTERACTIVE_TOOLS;

    if (activeCategory !== "All") {
      list = list.filter((tool) => tool.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          (tool.name_az && tool.name_az.toLowerCase().includes(q)) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeCategory, searchQuery]);

  const featuredTool = useMemo(() => {
    return INTERACTIVE_TOOLS.find((t) => t.featured) || INTERACTIVE_TOOLS[0];
  }, []);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={`${t("toolsArchiveTitle", "Creative Tools & Interactive Suite.")} — Rvan.me`}
        description={t("toolsArchiveSubtitle", "Powerful in-browser creative tools for designers, marketers, and developers. Character illustration builders, visual web builders, and modular generators.")}
        url="https://www.rvan.me/tools"
      />

      {/* Global Unified Header */}
      <SiteHeader siteSettings={siteSettings} />

      {/* Unified Page Hero */}
      <PageHero
        title={language === "az" ? "Yaradıcı" : "Powerful"}
        accentText={language === "az" ? "Alətlər." : "Tools for Creators."}
        gradientVariant="primary"
        description={
          language === "az"
            ? "Dizaynerlər, marketoloqlar və developerlər üçün real iş axınlarını həll edən brauzerdaxili peşəkar yaradıcı alətlər ekosistemi."
            : "Powerful tools for people who create. In-browser modular character builders, visual landing page creators, and creative asset generators."
        }
      />

      {/* Master Page Filter Bar & Search */}
      <PageFilterBar
        categories={TOOL_CATEGORIES.map((cat) => ({
          key: cat.id,
          label: language === "az" ? cat.label_az : cat.label,
        }))}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={language === "az" ? "Yaradıcı alətləri axtarın..." : "Search creative tools..."}
        searchId="tools-search"
      />

      {/* ── TOOLS WORKSPACE SECTION ── */}
      <section className="px-6 py-12 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px] space-y-12">
          {/* 1. FEATURED TOOL SPOTLIGHT (When viewing All or Creative) */}
          {activeCategory === "All" && !searchQuery.trim() && featuredTool && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/[0.08] via-white/[0.02] to-transparent p-8 md:p-12 shadow-2xl backdrop-blur-2xl"
            >
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-primary uppercase border border-primary/30 bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Sparkles size={12} /> {language === "az" ? "FLAQMAN YARADICI ALƏT" : "FEATURED FLAGSHIP TOOL"}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full uppercase">
                      CC0 PUBLIC DOMAIN
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                    {language === "az" && featuredTool.name_az ? featuredTool.name_az : featuredTool.name}
                  </h2>

                  <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed font-medium">
                    {language === "az" && featuredTool.description_az
                      ? featuredTool.description_az
                      : featuredTool.description}
                  </p>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link
                      to={getLocalizedPath(featuredTool.path)}
                      className="px-6 py-3.5 rounded-full bg-primary text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(97,197,173,0.3)] hover:scale-105 transition-all duration-300"
                    >
                      <span>{language === "az" ? "PERSONAJI YARAT →" : "CREATE CHARACTER →"}</span>
                    </Link>

                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                      <Check size={14} className="text-primary" /> Live SVG & High-Res PNG Export
                    </span>
                  </div>
                </div>

                {/* Right Visual Preview Badge */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="w-full max-w-[320px] aspect-square rounded-3xl border border-white/15 bg-black/60 p-6 flex flex-col items-center justify-center text-center shadow-xl">
                    <div className="text-6xl mb-4 animate-bounce">🎨</div>
                    <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                      MODULAR ILLUSTRATION SUITE
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1">
                      1,000+ Combinations • Zero Dependencies
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. TOOLS DIRECTORY GRID */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                <Layers size={14} /> {language === "az" ? "BÜTÜN YARADICI ALƏTLƏR" : "ALL CREATIVE TOOLS"}
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {filteredTools.length} {language === "az" ? "alət mövcuddur" : "tools available"}
              </span>
            </div>

            {filteredTools.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center glass">
                <p className="text-muted-foreground text-sm font-mono mb-4">
                  {language === "az" ? "Axtarışa uyğun alət tapılmadı." : "No tools found matching your criteria."}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="px-5 py-2.5 rounded-full bg-primary text-black font-mono font-bold text-xs uppercase"
                >
                  {language === "az" ? "FİLTRLƏRİ SIFIRLA" : "RESET FILTERS"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool, idx) => (
                  <motion.article
                    key={tool.id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={idx * 0.08}
                    className="group p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:border-primary/50 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(97,197,173,0.15)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-3xl">{typeof tool.icon === "string" ? tool.icon : "🎨"}</span>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full">
                          {tool.category}
                        </span>
                      </div>

                      <h4 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors mb-2 tracking-tight">
                        {language === "az" && tool.name_az ? tool.name_az : tool.name}
                      </h4>

                      <p className="text-xs text-muted-foreground/90 leading-relaxed font-medium line-clamp-3 mb-6">
                        {language === "az" && tool.description_az ? tool.description_az : tool.description}
                      </p>
                    </div>

                    <Link
                      to={getLocalizedPath(tool.path)}
                      className="inline-flex items-center justify-between w-full pt-4 border-t border-white/10 text-xs font-mono font-bold text-primary uppercase tracking-wider group-hover:text-white transition-colors"
                    >
                      <span>{tool.id === "open-peeps" ? (language === "az" ? "PERSONAJI YARAT" : "CREATE CHARACTER") : (language === "az" ? "ALƏTİ AÇ" : "OPEN BUILDER")}</span>
                      <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-primary" />
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
