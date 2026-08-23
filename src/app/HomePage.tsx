import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Sparkles, BookOpen, Layers, Newspaper } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import SiteHeader from "./components/SiteHeader";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Button } from "./components/ui/Button";
import { Eyebrow } from "./components/Eyebrow";

import HeroAtmosphere from "./components/HeroAtmosphere";

// Lazy-loaded section components for optimal performance and exact requested order
const HeroPortrait = lazy(() => import("./components/HeroPortrait"));
const HeroParticles = lazy(() => import("./components/HeroParticles"));
const BlogSection = lazy(() => import("./components/home/BlogSection"));
const TopicsSection = lazy(() => import("./components/home/TopicsSection"));
const HomeAboutSection = lazy(() => import("./components/home/HomeAboutSection"));
const ResourcesSection = lazy(() => import("./components/home/ResourcesSection"));
const ContributorSection = lazy(() => import("./components/home/ContributorSection"));
const ContactSection = lazy(() => import("./components/home/ContactSection"));

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

import { useLanguage } from "../lib/i18n/LanguageContext";

export default function HomePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Rvan.me — Creative Publication & Knowledge Platform"
        description="A creative publication and knowledge platform exploring design, marketing, branding, AI & creativity, and the creative industry."
        url="https://www.rvan.me"
      />

      {/* ── GLOBAL SEAMLESS ATMOSPHERIC BACKGROUND ── */}
      <HeroAtmosphere />

      {/* ── NAVBAR ── */}
      <SiteHeader siteSettings={siteSettings} />

      {/* ── 1. EDITORIAL HERO SECTION ── */}
      <section className="relative min-h-[60vh] lg:min-h-[75vh] flex flex-col justify-center px-6 pt-32 pb-16 md:px-10 md:pt-36 md:pb-20">
        <Suspense fallback={null}>
          <HeroParticles />
        </Suspense>

        <div className="mx-auto w-full max-w-[1600px] relative z-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Hero Left Editorial Copy */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="col-span-full lg:col-span-7 flex flex-col items-start"
            >
              <Eyebrow className="mb-5 text-primary tracking-[.2em]">
                {isAz
                  ? "KREATİV NƏŞR VA BİLİK PLATFORMASI"
                  : "CREATIVE PUBLICATION & KNOWLEDGE PLATFORM"}
              </Eyebrow>

              <h1
                className="font-bold tracking-[-.04em] leading-[1.06] text-foreground mb-6 w-full"
                style={{ fontSize: "clamp(2.4rem, 5vw, 5.2rem)" }}
              >
                {isAz ? "Vizual strategiyanın təhlili." : "Deconstructing visual strategy."}
                <br />
                <span className="bg-gradient-to-r from-[#61c5ad] via-[#6099df] to-[#bc66c5] bg-clip-text text-transparent">
                  {isAz ? "Brendlərin və mədəniyyətin mənası." : "Decoding brands & visual culture."}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground/90 font-medium max-w-2xl leading-relaxed mb-8">
                {isAz
                  ? "Rvan.me — dizayn, marketinq, brendinq, süni intellekt və yaradıcılıq, eləcə də kreativ sənayeni araşdıran müstəqil kreativ nəşr və bilik platformasıdır."
                  : "Rvan.me is a creative publication and knowledge platform exploring design, marketing, branding, AI & creativity, and the creative industry."}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  to={getLocalizedPath("/blog")}
                  variant="primary"
                  size="lg"
                  icon={<ArrowUpRight size={16} />}
                >
                  {isAz ? "SON MƏQALƏLƏRİ OXU" : "READ LATEST ARTICLES"}
                </Button>

                <Button
                  to={getLocalizedPath("/about")}
                  variant="secondary"
                  size="lg"
                  icon={<ArrowRight size={16} />}
                >
                  {isAz ? "RVAN.ME HAQQINDA" : "ABOUT RVAN.ME"}
                </Button>
              </div>
            </motion.div>

            {/* Hero Right Visual Portrait */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end"
            >
              <Suspense fallback={<div className="h-[380px] w-full rounded-2xl border border-white/10 bg-white/5 animate-pulse" />}>
                <HeroPortrait />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. LATEST ARTICLES ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING LATEST ARTICLES...</div>}>
        <BlogSection />
      </Suspense>

      {/* ── 3. TOPICS (EDITORIAL INDEX) ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING TOPICS INDEX...</div>}>
        <TopicsSection />
      </Suspense>

      {/* ── 4. ABOUT RVAN.ME & FOUNDER ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING ABOUT SECTION...</div>}>
        <HomeAboutSection />
      </Suspense>

      {/* ── 5. RESOURCES (CURATED SHOWCASE) ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING SHOWCASE RESOURCES...</div>}>
        <ResourcesSection />
      </Suspense>

      {/* ── 6. COMMUNITY CONTRIBUTOR INVITATION ── */}
      <Suspense fallback={<div className="h-80 flex items-center justify-center text-xs text-muted-foreground mono">LOADING COMMUNITY SECTION...</div>}>
        <ContributorSection />
      </Suspense>

      {/* ── 7. CONTACT ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING CONTACT SECTION...</div>}>
        <ContactSection />
      </Suspense>

      {/* ── FOOTER ── */}
      <Footer siteSettings={siteSettings} />

      <ScrollToTopButton />
    </main>
  );
}
