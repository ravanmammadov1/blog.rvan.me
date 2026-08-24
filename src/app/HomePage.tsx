import { useEffect, useState, lazy, Suspense } from "react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import SiteHeader from "./components/SiteHeader";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import HeroSearchSection from "./components/home/HeroSearchSection";

import { HOMEPAGE_FAQS } from "../data/faqData";
import FaqAccordion from "./components/ui/FaqAccordion";
import { useLanguage } from "../lib/i18n/LanguageContext";

// Lazy-loaded section components for optimal performance
const BlogSection = lazy(() => import("./components/home/BlogSection"));
const TopicsSection = lazy(() => import("./components/home/TopicsSection"));
const HomeAboutSection = lazy(() => import("./components/home/HomeAboutSection"));
const ResourcesSection = lazy(() => import("./components/home/ResourcesSection"));
const ContributorSection = lazy(() => import("./components/home/ContributorSection"));
const ContactSection = lazy(() => import("./components/home/ContactSection"));

export default function HomePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { language } = useLanguage();
  const isAz = language === "az";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  return (
    <main
      className="relative min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="Rvan.me — Creative Publication & Knowledge Platform"
        description="A creative publication about design, marketing, branding, AI and visual culture."
        url="https://www.rvan.me"
      />

      {/* ── NAVBAR ── */}
      <SiteHeader siteSettings={siteSettings} />

      {/* ── 1. HERO SEARCH-FIRST KNOWLEDGE PLATFORM ── */}
      <HeroSearchSection />

      {/* ── 2. LATEST ARTICLES ── */}
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">
            LOADING LATEST ARTICLES...
          </div>
        }
      >
        <BlogSection />
      </Suspense>

      {/* ── 3. TOPICS (EDITORIAL INDEX) ── */}
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">
            LOADING TOPICS INDEX...
          </div>
        }
      >
        <TopicsSection />
      </Suspense>

      {/* ── 4. ABOUT RVAN.ME & FOUNDER ── */}
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">
            LOADING ABOUT SECTION...
          </div>
        }
      >
        <HomeAboutSection />
      </Suspense>

      {/* ── 5. RESOURCES (CURATED SHOWCASE) ── */}
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">
            LOADING SHOWCASE RESOURCES...
          </div>
        }
      >
        <ResourcesSection />
      </Suspense>

      {/* ── 6. CONTRIBUTOR COMMUNITY PROGRAM ── */}
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">
            LOADING CONTRIBUTOR NETWORK...
          </div>
        }
      >
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
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">
            LOADING CONTACT...
          </div>
        }
      >
        <ContactSection />
      </Suspense>

      {/* ── FOOTER & GLOBAL FLOATING CONTROLS ── */}
      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
