import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import SiteHeader from "./components/SiteHeader";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Button } from "./components/ui/Button";
import { Eyebrow } from "./components/Eyebrow";
import HeroFeaturedPanel from "./components/home/HeroFeaturedPanel";

import { HOMEPAGE_FAQS } from "../data/faqData";
import FaqAccordion from "./components/ui/FaqAccordion";

// Lazy-loaded section components for optimal performance
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
  const { getLocalizedPath, language } = useLanguage();
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
        description="A creative publication about design, marketing, branding, AI and visual culture."
        url="https://www.rvan.me"
      />

      {/* ── NAVBAR ── */}
      <SiteHeader siteSettings={siteSettings} />

      {/* ══════════════════════════════════════════════════════════════════════
          1. IMMERSIVE HERO SECTION
          Full-viewport composition with animated gradient (via GalaxyAtmosphere),
          centered headline, supporting copy, CTAs, and featured editorial panel.
          The animated gradient background is rendered globally by GalaxyAtmosphere
          in App.tsx — it's visible through this section's transparent background.
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-5 pt-28 pb-12 md:px-8 md:pt-32 md:pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        {/* ── Upper Hero: Centered Headline Composition ── */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[1200px] mx-auto text-center">
          {/* Micro-label */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <Eyebrow className="mb-5 text-primary tracking-[.22em] font-semibold">
              {isAz
                ? "YARADICI NƏŞR · BİLİK · MƏDƏNİYYƏT"
                : "CREATIVE PUBLICATION · KNOWLEDGE · CULTURE"}
            </Eyebrow>
          </motion.div>

          {/* Large Brand Gradient Headline — dominant focal point */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="font-extrabold tracking-tight leading-[1.02] mb-6 w-full"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}
          >
            <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] dark:from-[#61c5ad] dark:via-[#6099df] dark:to-[#bc66c5] bg-clip-text text-transparent inline-block">
              {isAz ? (
                <>DİZAYN. STRATEGİYA.<br className="hidden sm:block" />FİKİRLƏR.</>
              ) : (
                <>DESIGN. STRATEGY.<br className="hidden sm:block" />IDEAS.</>
              )}
            </span>
          </motion.h1>

          {/* Short Description */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-base sm:text-lg md:text-xl text-muted-foreground font-normal max-w-2xl leading-relaxed mb-8 mx-auto"
          >
            {isAz
              ? "Dizayn, marketinq, brendinq, süni intellekt və vizual mədəniyyət haqqında yaradıcı nəşr."
              : "A creative publication about design, marketing, branding, AI and visual culture."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="flex flex-wrap items-center justify-center gap-4 mb-12 md:mb-16"
          >
            <Button
              to={getLocalizedPath("/blog")}
              variant="primary"
              size="lg"
              icon={<ArrowUpRight size={16} />}
            >
              {isAz ? "MƏQALƏLƏRƏ BAX" : "READ ARTICLES"}
            </Button>

            <Button
              to={getLocalizedPath("/contributor/dashboard")}
              variant="secondary"
              size="lg"
              icon={<ArrowUpRight size={16} />}
            >
              {isAz ? "BİZİMLƏ YAZ" : "WRITE WITH US"}
            </Button>
          </motion.div>
        </div>

        {/* ── Lower Hero: Large Featured Editorial Panel ── */}
        <div className="w-full">
          <HeroFeaturedPanel />
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

      {/* ── 6. CONTRIBUTOR COMMUNITY PROGRAM ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING CONTRIBUTOR NETWORK...</div>}>
        <ContributorSection />
      </Suspense>

      {/* ── 7. EDITORIAL & PLATFORM FAQ ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border bg-card/20">
        <div className="mx-auto max-w-[1200px]">
          <FaqAccordion
            items={HOMEPAGE_FAQS}
            eyebrow={isAz ? "TEZ-TEZ VERİLƏN SUALLAR" : "FREQUENTLY ASKED QUESTIONS"}
            title={isAz ? "Platforma və Nəşr Haqqında" : "Platform & Editorial Overview"}
            description={
              isAz
                ? "Rvan.me platforması, müəlliflik, resurslar və alətlər haqqında ən çox soruşulan suallar:"
                : "Answers to common questions regarding our publication, contributor program, resources, and workflows:"
            }
            viewAllHref="/faq"
            viewAllLabel={isAz ? "BÜTÜN SUALLARA BAX (10)" : "VIEW ALL FAQS (10)"}
            showNumbers={true}
          />
        </div>
      </section>

      {/* ── 8. COLLABORATE & CONTACT ── */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">LOADING CONTACT...</div>}>
        <ContactSection />
      </Suspense>

      {/* ── FOOTER & GLOBAL FLOATING CONTROLS ── */}
      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
