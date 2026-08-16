import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
import { INTERACTIVE_TOOLS } from "./lib/toolsRegistry";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { buildPeepSvg, DEFAULT_PEEP_CONFIG } from "./components/tools/openpeeps/peepsAssets";

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
  const { t, getLocalizedPath, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

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
        description={t(
          "toolsArchiveSubtitle",
          "Powerful in-browser creative tools for designers, marketers, and developers. Character illustration builders and modular vector asset generators."
        )}
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

      {/* ── TOOLS WORKSPACE SECTION ── */}
      <section className="px-6 py-12 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px] space-y-10">
          {/* 1. FEATURED FLAGSHIP TOOL CARD */}
          {featuredTool && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] via-white/[0.015] to-transparent p-8 md:p-12 shadow-2xl backdrop-blur-2xl"
            >
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Information */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
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

                  <div className="pt-3 flex flex-wrap items-center gap-4">
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

                {/* Right Visual Preview Badge (Smiling Cheerful Character) */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="w-full max-w-[320px] aspect-square rounded-3xl border border-white/15 bg-white p-4 flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden group">
                    <div
                      className="w-48 h-48 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                      dangerouslySetInnerHTML={{
                        __html: buildPeepSvg(DEFAULT_PEEP_CONFIG, 220),
                      }}
                    />
                    <div className="w-full pt-2 border-t border-zinc-200 flex flex-col items-center">
                      <span className="text-[10px] font-mono text-zinc-500">
                        Modular Vector System • Zero Dependencies
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. COMING SOON SECTION (Matching Image 2) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.15}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] via-white/[0.015] to-transparent py-24 md:py-36 px-8 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-2xl"
          >
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white/90 font-sans">
              coming soon...
            </h3>
          </motion.div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
