import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "../../lib/i18n/LanguageContext";
import { fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";
import { TOPICS_CATALOG } from "../../lib/topicRegistry";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import ScrollToTopButton from "../components/ScrollToTopButton";
import GlobalFaqSection from "../components/GlobalFaqSection";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function TopicArchivePage() {
  const { language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${isAz ? "Mövzular İndeksi" : "Editorial Topics Index"} — Rvan.me`}
        description={
          isAz
            ? "Rvan.me nəşrinin 6 əsas redaksiya mövzusu: Dizayn, Marketinq, Brendinq, Sİ və Yaradıcılıq, Kreativ Sənaye və Strategiya."
            : "Explore our 6 core editorial verticals: Design, Marketing, Branding, AI & Creativity, Creative Industry, and Strategy."
        }
        url="https://www.rvan.me/topics"
      />

      <SiteHeader siteSettings={siteSettings} />

      <PageHero
        eyebrow={isAz ? "BİLİK İNDEKSİ · MÖVZULAR" : "KNOWLEDGE INDEX · TOPICS"}
        title={isAz ? "BÜTÜN REDAKSİYA" : "EDITORIAL TOPIC"}
        accentText={isAz ? "MÖVZULARI." : "PILLARS."}
        description={
          isAz
            ? "Məqalələrimizi 6 əsas redaksiya mövzusu üzrə kəşf edin."
            : "Explore our publications across 6 structured editorial pillars."
        }
      />

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS_CATALOG.map((topic, idx) => {
            const Icon = topic.icon;
            const topicName = isAz ? topic.name.az : topic.name.en;
            const topicDesc = isAz ? topic.description.az : topic.description.en;

            return (
              <motion.div
                key={topic.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={idx * 0.06}
              >
                <Link
                  to={getLocalizedPath(`/topics/${topic.slug}`)}
                  className="group p-6 md:p-8 rounded-3xl border border-border bg-card shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] dark:shadow-none dark:hover:shadow-primary/5 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${topic.accentColor} group-hover:scale-105 transition-transform`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider mono uppercase text-muted-foreground border border-border rounded-md px-2.5 py-0.5 bg-muted/40">
                        {topic.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors mb-2">
                      {topicName}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                      {topicDesc}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-primary mono uppercase">
                    <span>{isAz ? "Mövzuya Bax" : "Explore Topic"}</span>
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Global FAQ Section ── */}
      <GlobalFaqSection />

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
