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

// Lazy-loaded section components matching exact requested hierarchy
const HeroPortrait = lazy(() => import("./components/HeroPortrait"));
const HeroParticles = lazy(() => import("./components/HeroParticles"));
const NewsSection = lazy(() => import("./components/home/NewsSection"));
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
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary mono uppercase mb-6">
                <Sparkles size={13} /> {t("heroBadge", "STUDIO VISION & CREATIVE ENGINE")}
              </div>

              <h1
                className="font-bold tracking-[-.04em] leading-[1.05] text-foreground mb-8 w-full"
                style={{ fontSize: "clamp(2.4rem, 5.8vw, 6rem)" }}
              >
                {t("heroTitle1", "Design that moves.")}<br />
                {t("heroTitle2", "Ideas that matter.")}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 font-medium max-w-2xl leading-relaxed mb-10">
                {t("heroSubtitle", "A creative studio and digital platform exploring design, marketing, technology, and the tools shaping the digital world.")}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={getLocalizedPath("/resources")}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-[0_0_25px_rgba(232,253,82,0.25)]"
                >
                  {t("btnExploreResources", "EXPLORE RESOURCES")} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  to={getLocalizedPath("/news")}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-xs font-bold tracking-[.18em] text-foreground uppercase transition-all duration-300 hover:border-primary/50 hover:bg-white/10 glass"
                >
                  {t("btnReadNews", "READ INDUSTRY NEWS")} <ArrowDownRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </Link>
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

      {/* ── 3. LATEST NEWS (3 cards) ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING LATEST NEWS...</div>}>
        <NewsSection />
      </Suspense>

      {/* ── 4. EDITORIAL / BLOG (3 best articles) ── */}
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
