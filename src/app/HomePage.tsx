import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, ArrowDownRight, Layers, Newspaper, BookOpen, Zap } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import SiteHeader from "./components/SiteHeader";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

import HeroAtmosphere from "./components/HeroAtmosphere";

// Lazy-loaded section components matching exact requested hierarchy
const HeroPortrait = lazy(() => import("./components/HeroPortrait"));
const HeroParticles = lazy(() => import("./components/HeroParticles"));
const BlogSection = lazy(() => import("./components/home/BlogSection"));
const ResourcesSection = lazy(() => import("./components/home/ResourcesSection"));
const FeaturedInteractiveTools = lazy(() => import("./components/home/FeaturedInteractiveTools").then(m => ({ default: m.FeaturedInteractiveTools })));
const ContactSection = lazy(() => import("./components/home/ContactSection"));

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

import { useLanguage } from "../lib/i18n/LanguageContext";

export default function HomePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { t, getLocalizedPath } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Ravan Mammadov — Senior Creative Designer & Art Director"
        description="Senior Creative Designer specializing in motion design, brand identity, graphic design, and performance creative."
        url="https://www.rvan.me"
      />

      {/* ── 1. NAVBAR ── */}
      <SiteHeader siteSettings={siteSettings} />

      {/* ── 2. HERO SECTION ── */}
      <section className="relative min-h-[70vh] lg:min-h-[90vh] flex flex-col justify-center px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28">
        <HeroAtmosphere />
        <Suspense fallback={null}>
          <HeroParticles />
        </Suspense>

        <div className="mx-auto w-full max-w-[1600px] relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Hero Left Content */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="col-span-full lg:col-span-7 flex flex-col items-start"
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#61c5ad]/40 bg-gradient-to-r from-[#61c5ad]/15 via-[#426fba]/15 to-[#984f9f]/15 px-4 py-2 text-xs font-bold mono uppercase backdrop-blur-md shadow-[0_0_20px_rgba(97,197,173,0.15)]">
                  <Sparkles size={14} className="text-[#61c5ad]" />
                  <span className="bg-gradient-to-r from-[#61c5ad] via-[#5b87d6] to-[#b15eb8] bg-clip-text text-transparent font-bold tracking-wider">
                    {t("heroBadge", "STUDIO VISION & CREATIVE ENGINE")}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium mono text-muted-foreground glass-sm">
                  <span className="h-2 w-2 rounded-full bg-[#61c5ad] badge-pulse-dot" />
                  <span>{t("heroAvailability", "AVAILABLE FOR Q3/Q4 PROJECTS")}</span>
                </div>
              </div>

              <h1
                className="font-bold tracking-[-.04em] leading-[1.05] text-foreground mb-8 w-full"
                style={{ fontSize: "clamp(2.5rem, 6vw, 6.2rem)" }}
              >
                {t("heroTitle1", "Design that moves.")}<br />
                <span className="bg-gradient-to-r from-[#61c5ad] via-[#6099df] to-[#bc66c5] bg-clip-text text-transparent">
                  {t("heroTitle2", "Ideas that matter.")}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 font-medium max-w-2xl leading-relaxed mb-10">
                {t("heroSubtitle", "A creative studio and digital platform exploring design, marketing, technology, and the tools shaping the digital world.")}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Link
                  to={getLocalizedPath("/resources")}
                  className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-xs font-bold tracking-[.18em] text-white uppercase transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(97,197,173,0.35)] hover:shadow-[0_0_40px_rgba(152,79,159,0.5)]"
                  style={{
                    background: "linear-gradient(135deg, #61c5ad 0%, #426fba 48%, #984f9f 100%)",
                  }}
                >
                  {t("btnExploreResources", "EXPLORE RESOURCES")} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  to={getLocalizedPath("/blog")}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-xs font-bold tracking-[.18em] text-foreground uppercase transition-all duration-300 hover:border-[#61c5ad]/50 hover:bg-white/10 glass"
                >
                  {t("exploreAllArticles", "READ BLOG & ARTICLES")} <ArrowDownRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </Link>
              </div>

              {/* Studio Quick Stats */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-xl pt-6 border-t border-white/10">
                <div className="glass-stat p-3.5 rounded-2xl">
                  <div className="text-xl md:text-2xl font-bold tracking-tight text-foreground mono">10+</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mono mt-0.5">{t("statExperience", "YRS ART DIRECTION")}</div>
                </div>
                <div className="glass-stat p-3.5 rounded-2xl">
                  <div className="text-xl md:text-2xl font-bold tracking-tight text-foreground mono">40+</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mono mt-0.5">{t("statBrands", "GLOBAL BRANDS")}</div>
                </div>
                <div className="glass-stat p-3.5 rounded-2xl">
                  <div className="text-xl md:text-2xl font-bold tracking-tight text-foreground mono">200+</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mono mt-0.5">{t("statAssets", "CURATED ASSETS")}</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visual Portrait — hidden on mobile, visible on lg+ */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end"
            >
              <Suspense fallback={<div className="h-[420px] w-full rounded-2xl border border-white/10 bg-white/5 animate-pulse" />}>
                <HeroPortrait />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. EDITORIAL / BLOG (3 best articles) ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING EDITORIAL BLOG...</div>}>
        <BlogSection />
      </Suspense>

      {/* ── 5. RESOURCES (6 best showcase cards from all categories) ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING SHOWCASE RESOURCES...</div>}>
        <ResourcesSection />
      </Suspense>

      {/* ── 6. TOOLS (3-4 best useful utilities) ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING INTERACTIVE UTILITIES...</div>}>
        <FeaturedInteractiveTools />
      </Suspense>

      {/* ── 7. FINAL CTA ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING CONTACT CTA...</div>}>
        <ContactSection />
      </Suspense>

      {/* ── 8. FOOTER ── */}
      <Footer siteSettings={siteSettings} />

      <ScrollToTopButton />
    </main>
  );
}
