import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Check, FileText, Printer, ShieldCheck } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
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

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={`${t("toolsArchiveTitle", "Creative & Career Tools Suite.")} — Rvan.me`}
        description={t(
          "toolsArchiveSubtitle",
          "Powerful in-browser tools: ATS-compliant resume builder, character illustration generators, and creative developer utilities."
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
            ? "Dizaynerlər, developerlər və mütəxəssislər üçün real iş axınlarını həll edən brauzerdaxili peşəkar alətlər ekosistemi."
            : "Powerful tools for people who build. ATS-compliant resume creators, modular character builders, and creative asset generators."
        }
      />

      {/* ── TOOLS WORKSPACE SECTION ── */}
      <section className="px-6 py-12 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px] space-y-10">
          {/* 1. FLAGSHIP TOOL: ATS RESUME & CV BUILDER */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-8 md:p-12 shadow-2xl backdrop-blur-2xl"
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Information */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-primary uppercase border border-primary/30 bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Sparkles size={12} /> {language === "az" ? "YENİ FLAQMAN ALƏT" : "FEATURED FLAGSHIP TOOL"}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    <ShieldCheck size={11} /> 100% ATS COMPLIANT
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  {language === "az" ? "ATS Resume & CV Quraşdırıcı" : "ATS Resume & CV Builder"}
                </h2>

                <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed font-medium">
                  {language === "az"
                    ? "HR və ATS sistemləri tərəfindən 100% oxunaqlı peşəkar rezyumelər hazırlayın. Canlı bölünmüş ekran redaktoru, 5 hazır şablon, ATS xal analizatoru və təmiz vektor PDF ixracı."
                    : "Create professional ATS-compliant resumes with real-time preview, 5 HR-approved templates, ATS score checker, and instant vector PDF export. Built for software engineers, designers, and executives."}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <Link
                    to={getLocalizedPath("/tools/resume-builder")}
                    className="px-6 py-3.5 rounded-full bg-primary text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(97,197,173,0.3)] hover:scale-105 transition-all duration-300"
                  >
                    <span>{language === "az" ? "CV YARATMAĞA BAŞLA →" : "BUILD YOUR RESUME →"}</span>
                  </Link>

                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                    <Check size={14} className="text-primary" /> Vector PDF • JSON Backup • Privacy First
                  </span>
                </div>
              </div>

              {/* Right Visual Preview Badge */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <Link
                  to={getLocalizedPath("/tools/resume-builder")}
                  className="w-full max-w-[320px] aspect-[4/5] rounded-3xl border border-white/15 bg-white p-5 flex flex-col justify-between text-neutral-900 shadow-2xl relative overflow-hidden group hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                >
                  {/* Miniature Resume Simulation */}
                  <div className="space-y-3">
                    <div className="border-b-2 border-primary pb-2">
                      <div className="h-3.5 w-36 bg-neutral-900 rounded font-bold" />
                      <div className="h-2 w-28 bg-primary mt-1 rounded" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-neutral-200 rounded" />
                      <div className="h-1.5 w-5/6 bg-neutral-200 rounded" />
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="h-2 w-20 bg-primary rounded" />
                      <div className="h-1.5 w-full bg-neutral-300 rounded" />
                      <div className="h-1.5 w-11/12 bg-neutral-200 rounded" />
                      <div className="h-1.5 w-4/5 bg-neutral-200 rounded" />
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="h-2 w-16 bg-primary rounded" />
                      <div className="h-1.5 w-full bg-neutral-300 rounded" />
                      <div className="h-1.5 w-3/4 bg-neutral-200 rounded" />
                    </div>
                  </div>

                  <div className="w-full pt-3 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono text-neutral-600">
                    <span className="flex items-center gap-1 font-bold text-primary">
                      <Printer size={12} /> A4 Print Ready
                    </span>
                    <span className="font-bold uppercase tracking-wider">Launch Tool →</span>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 2. CHARACTER BUILDER TOOL CARD */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] via-white/[0.015] to-transparent p-8 md:p-12 shadow-2xl backdrop-blur-2xl"
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Information */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-primary uppercase border border-primary/30 bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Sparkles size={12} /> {language === "az" ? "YARADICI ALƏT" : "CREATIVE UTILITY"}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full uppercase">
                    CC0 PUBLIC DOMAIN
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  {language === "az" ? "Personaj Quraşdırıcı Aləti" : "Character Builder Tool"}
                </h2>

                <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed font-medium">
                  {language === "az"
                    ? "Modul əl ilə çəkilmiş vektor illüstrasiya və personaj generatoru. Üz ifadələrini, saç düzümlərini, aksesuarları və geyimləri fərdiləşdirin, canlı SVG və PNG ixrac edin."
                    : "Modular hand-drawn vector illustration and character generator. Customize facial expressions, hair styles, accessories, clothing, and export clean SVG or high-res PNG."}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <Link
                    to={getLocalizedPath("/tools/open-peeps")}
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
                <Link
                  to={getLocalizedPath("/tools/open-peeps")}
                  className="w-full max-w-[320px] aspect-square rounded-3xl border border-white/15 bg-white p-4 flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden group hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                >
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
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 3. COMING SOON SECTION */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] via-white/[0.015] to-transparent py-20 md:py-28 px-8 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-2xl"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white/90 font-sans">
              more tools coming soon...
            </h3>
          </motion.div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
