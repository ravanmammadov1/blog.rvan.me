import { useEffect, useState, lazy, Suspense } from "react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import SiteHeader from "./components/SiteHeader";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import HeroSearchSection from "./components/home/HeroSearchSection";
import GlobalFaqSection from "./components/GlobalFaqSection";
import GradientLinesBackground from "./components/ui/GradientLinesBackground";
import { HOMEPAGE_FAQS } from "../data/faqData";
import { useLanguage } from "../lib/i18n/LanguageContext";

// Lazy-loaded section components for optimal performance
const BlogSection = lazy(() => import("./components/home/BlogSection"));
const TopicsSection = lazy(() => import("./components/home/TopicsSection"));
const HomeAboutSection = lazy(() => import("./components/home/HomeAboutSection"));
const ResourcesSection = lazy(() => import("./components/home/ResourcesSection"));
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

      {/* ── SUBTLE MOVING GRADIENT LINES & LIGHT BEAMS (rvan.me logo colors) ── */}
      <GradientLinesBackground />

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

      {/* ── 6. COLLABORATE & CONTACT ── */}
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center text-xs text-muted-foreground mono">
            LOADING CONTACT...
          </div>
        }
      >
        <ContactSection />
      </Suspense>

      {/* ── 7. GLOBAL FAQ SECTION (IMMEDIATELY BEFORE FOOTER) ── */}
      <GlobalFaqSection
        items={HOMEPAGE_FAQS}
        eyebrow={isAz ? "TEZ-TEZ VERİLƏN SUALLAR" : "FREQUENTLY ASKED QUESTIONS"}
        title={isAz ? "Platforma və Nəşr Haqqında" : "Platform & Editorial Overview"}
        description={
          isAz
            ? "Rvan.me platforması, məqalə qəbulu, resurslar və alətlər haqqında ən çox soruşulan suallar:"
            : "Answers to common questions regarding our publication, editorial submissions, resources, and workflows:"
        }
      />

      {/* ── 8. GLOBAL FOOTER ── */}
      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
