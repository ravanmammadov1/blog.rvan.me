import { useEffect, useState, lazy, Suspense } from "react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import SiteHeader from "./components/SiteHeader";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import HeroSearchSection from "./components/home/HeroSearchSection";
import GlobalFaqSection from "./components/GlobalFaqSection";
import { HOMEPAGE_FAQS } from "../data/faqData";
import { useLanguage } from "../lib/i18n/LanguageContext";

import CuratedGuidesSection from "./components/home/CuratedGuidesSection";
import BlogSection from "./components/home/BlogSection";
import TopicsSection from "./components/home/TopicsSection";
import HomeAboutSection from "./components/home/HomeAboutSection";
import ResourcesSection from "./components/home/ResourcesSection";
import ContactSection from "./components/home/ContactSection";

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

      {/* ── 1. HERO EDITORIAL KNOWLEDGE PLATFORM (STRICT REFERENCE COMPOSITION) ── */}
      <HeroSearchSection />

      {/* ── 2. CURATED TOPICS & CONCEPT GUIDES ── */}
      <CuratedGuidesSection />

      {/* ── 3. LATEST ARTICLES ── */}
      <BlogSection />

      {/* ── 3. TOPICS (EDITORIAL INDEX) ── */}
      <TopicsSection />

      {/* ── 4. ABOUT RVAN.ME & FOUNDER ── */}
      <HomeAboutSection />

      {/* ── 5. RESOURCES (CURATED SHOWCASE) ── */}
      <ResourcesSection />

      {/* ── 6. COLLABORATE & CONTACT ── */}
      <ContactSection />

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
