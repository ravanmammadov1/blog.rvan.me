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
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
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

      {/* ── 1. EDITORIAL HERO — Living gradient atmosphere provided by global GalaxyAtmosphere ── */}
      <section className="relative flex min-h-[80vh] md:min-h-[85vh] flex-col justify-center px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28 overflow-hidden">
        <div className="mx-auto w-full max-w-[1600px] relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Hero Left: Editorial Headline & Actions */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="col-span-full lg:col-span-7 flex flex-col items-start"
            >
              {/* Micro-label */}
              <Eyebrow className="mb-5 text-primary tracking-[.22em] font-semibold">
                {isAz
                  ? "YARADICI NƏŞR · BİLİK · MƏDƏNİYYƏT"
                  : "CREATIVE PUBLICATION · KNOWLEDGE · CULTURE"}
              </Eyebrow>

              {/* Dominant Brand Gradient Headline */}
              <h1
                className="font-extrabold tracking-tight leading-[1.04] mb-7 w-full"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.6rem)" }}
              >
                <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] dark:from-[#61c5ad] dark:via-[#6099df] dark:to-[#bc66c5] bg-clip-text text-transparent inline-block">
                  {isAz ? (
                    <>DİZAYN. STRATEGİYA.<br />FİKİRLƏR.</>
                  ) : (
                    <>DESIGN. STRATEGY.<br />IDEAS.</>
                  )}
                </span>
              </h1>

              {/* Single Short Paragraph Description */}
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-normal max-w-xl leading-relaxed mb-10">
                {isAz
                  ? "Dizayn, marketinq, brendinq, süni intellekt və vizual mədəniyyət haqqında yaradıcı nəşr."
                  : "A creative publication about design, marketing, branding, AI and visual culture."}
              </p>

              {/* 2-Button CTA System */}
              <div className="flex flex-wrap items-center gap-4">
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
              </div>
            </motion.div>

            {/* Hero Right: Negative space — the animated gradient atmosphere fills this area naturally */}
            <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />
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
