import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowRight, BookOpen, Wrench, Layers } from "lucide-react";

import { getAllTopicHubs } from "../../lib/topicHubs";
import { fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import PageHero from "../components/PageHero";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useLanguage } from "../../lib/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export default function TopicArchivePage() {
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  const topicHubs = getAllTopicHubs();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={isAz ? "Dizayn və Marketinq Mövzu Mərkəzləri — Rvan.me" : "Design & Marketing Topic Hubs — Rvan.me"}
        description={
          isAz
            ? "Tipoqrafiya, dizayn psixologiyası, marketinq konversiyası və rəqəmsal əlçatanlıq üzrə kurasiya edilmiş bilik mərkəzləri."
            : "Explore curated domain hubs across typography systems, design neuroscience, marketing psychology, and digital accessibility."
        }
        url="https://www.rvan.me/topics"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Page Hero */}
      <PageHero
        title={isAz ? "Kurasiya Edilmiş" : "Topical Knowledge"}
        accentText={isAz ? "Mövzu Mərkəzləri." : "Ecosystem Hubs."}
        gradientVariant="primary"
        description={
          isAz
            ? "Məqalələr, interaktiv alətlər və peşəkar dizayn resurslarını bir araya gətirən mövzu ekosistemləri."
            : "Structured domain pillars connecting deep research essays, interactive tools, and curated resources into cohesive learning paths."
        }
      />

      {/* Hubs Grid */}
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 space-y-12">
        <div className="grid gap-8 md:grid-cols-2">
          {topicHubs.map((hub, idx) => (
            <motion.div
              key={hub.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={idx * 0.15}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-primary/40 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{hub.icon}</span>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary mono">
                    {hub.featuredArticleSlugs.length} {isAz ? "Məqalə" : "Essays"} · {hub.toolIds.length} {isAz ? "Alət" : "Tools"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {isAz ? hub.name_az : hub.name}
                </h2>

                <p className="text-sm font-semibold text-primary/90 mono">
                  {isAz ? hub.headline_az : hub.headline}
                </p>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isAz ? hub.description_az : hub.description}
                </p>

                {/* Key Principles Pills */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {hub.keyPrinciples.map((p, pIdx) => (
                    <span
                      key={pIdx}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-muted-foreground mono"
                    >
                      {isAz ? p.title_az : p.title}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to={getLocalizedPath(`/topics/${hub.slug}`)}
                className="inline-flex items-center justify-between rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 mono"
              >
                <span>{isAz ? "Mövzu Mərkəzini Kəşf Et" : "Explore Topic Hub"}</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
