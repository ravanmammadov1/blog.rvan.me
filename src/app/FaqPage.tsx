import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, HelpCircle } from "lucide-react";
import { GLOBAL_FAQS } from "../data/faqData";
import FaqAccordion from "./components/ui/FaqAccordion";
import { Eyebrow } from "./components/Eyebrow";
import { Button } from "./components/ui/Button";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import PageHero from "./components/PageHero";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function FaqPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  // Generate FAQPage JSON-LD schema dynamically
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": GLOBAL_FAQS.map((faq) => {
      const q = isAz ? faq.qAz : faq.qEn;
      const a = isAz ? faq.aAz : faq.aEn;
      const bullets = isAz ? faq.bulletsAz : faq.bulletsEn;
      const fullAnswer = Array.isArray(a) ? a.join(" ") : a;
      const bulletText = bullets ? " " + bullets.join(". ") : "";
      return {
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${fullAnswer}${bulletText}`
        }
      };
    })
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={isAz ? "Tez-tez Verilən Suallar (FAQ) — Rvan.me" : "Frequently Asked Questions (FAQ) — Rvan.me"}
        description={
          isAz
            ? "Rvan.me nəşr prosesi, müəlliflik qaydaları, redaksiya meyarları və süni intellekt siyasəti haqqında ən vacib 10 sualın ətraflı cavabları."
            : "Detailed answers to the 10 most essential questions about Rvan.me, publishing, contributor onboarding, editorial review, and AI policies."
        }
        url={isAz ? "https://www.rvan.me/az/faq" : "https://www.rvan.me/faq"}
        jsonLd={faqSchema}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Master Page Hero */}
      <PageHero
        eyebrow={isAz ? "BİLİK BAZASI VƏ SUALLAR" : "KNOWLEDGE BASE & GUIDELINES"}
        title={isAz ? "TEZ-TEZ VERİLƏN" : "FREQUENTLY ASKED"}
        accentText={isAz ? "SUALLAR." : "QUESTIONS."}
        description={isAz
          ? "Rvan.me platformasının fəaliyyət prinsipləri, məqalə qəbulu, redaksiya baxışı, dil və müəlliflik qaydaları ilə bağlı ən mühüm sualların ətraflı cavabları:"
          : "Clear, structured answers to the 10 most essential questions regarding our publication standards, contributor onboarding, language choices, and editorial review."}
      />

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:px-8 space-y-12">
        <div className="mx-auto max-w-[1200px]">
          <FaqAccordion
            items={GLOBAL_FAQS}
            showNumbers={true}
            defaultOpenIndex={0}
          />
        </div>
      </div>

      {/* Editorial Invitation Call to Action */}
      <section className="relative px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-b from-card to-background p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "REDAKSİYA DƏVƏTİ" : "EDITORIAL INVITATION"}
            </Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isAz ? "Paylaşmağa dəyər bir fikriniz var?" : "Have an idea worth exploring?"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {isAz
                ? "Dizayn, yaradıcılıq, texnologiya, marketinq və kreativ sənayeni formalaşdıran ideyalar haqqında maraqlı fikirləriniz varsa, onları bizimlə bölüşün."
                : "We're always interested in thoughtful perspectives on design, creativity, technology, marketing, culture and the ideas shaping the creative industry."}
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              to={getLocalizedPath("/write")}
              variant="primary"
              size="lg"
              icon={<ArrowRight size={16} />}
            >
              {isAz ? "FİKRİNİZİ BİZİMLƏ PAYLAŞIN" : "SHARE YOUR IDEAS"}
            </Button>
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
