import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowUpRight,
  Zap,
  Globe,
  Layers,
  Cpu,
  Newspaper,
  BookOpen,
  CheckCircle2,
  UserCheck,
  Compass,
  ArrowRight,
  MapPin,
  Quote
} from "lucide-react";
import { Button } from "./components/ui/Button";

import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";
import { fetchAboutSection, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { AboutSection, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
import ScrollToTopButton from "./components/ScrollToTopButton";

import { useLanguage } from "../lib/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

// Fallback values for Platform Values in case Sanity is offline
const FALLBACK_VALUES = [
  {
    title: "Value First",
    description: "Zero fluff and zero promotional noise. Every font family, tool, and article is curated for real commercial and creative utility.",
    icon: "CheckCircle2",
    color: "emerald",
  },
  {
    title: "Unified Ecosystem",
    description: "Open-source typography, AI automation tools, RSS news aggregation, and design essays connected under a single design system.",
    icon: "Layers",
    color: "cyan",
  },
  {
    title: "High Performance",
    description: "Engineered with modern web architecture, sub-second FlexSearch, instant static pre-rendering, and real-time synchronization.",
    icon: "Zap",
    color: "amber",
  },
  {
    title: "Design Precision",
    description: "Every pixel, spacing unit, and fluid typography clamp is calibrated for balance, accessibility, and visual excellence.",
    icon: "Sparkles",
    color: "rose",
  },
];

export default function AboutPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const { t, getLocalizedPath, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
    fetchAboutSection(language).then((data) => {
      if (data) setAboutData(data);
    });
  }, [language]);

  const platformValues = (aboutData?.platformValues && aboutData.platformValues.length > 0)
    ? aboutData.platformValues
    : FALLBACK_VALUES;

  const sanityPortraitUrl = aboutData?.profilePhoto
    ? urlFor(aboutData.profilePhoto)?.width(1200).height(1200).url()
    : null;

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={`${t("navAbout", "About")} Rvan.me — ${t("aboutHeroEyebrow", "PLATFORM VISION & MISSION")}`}
        description={t("aboutHeroDescription", "Rvan.me is a curated digital ecosystem engineered to bridge design thinking, developer tooling, and industry intelligence in a single high-performance workspace.")}
        url="https://www.rvan.me/about"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30" aria-hidden="true">
        <div
          className="absolute -top-[15%] left-[10%] h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.04) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute top-[40%] right-[-10%] h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(97,197,173,0.08) 0%, rgba(152,79,159,0.04) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      {/* Unified Page Hero */}
      <PageHero
        title={t("aboutHeroTitleMain", "Built for creative minds.")}
        accentText={t("aboutHeroTitleAccent", "Engineered for impact.")}
        gradientVariant="accent"
        description={t("aboutHeroDescription", "Rvan.me is a curated digital ecosystem engineered to bridge design thinking, developer tooling, and industry intelligence in a single high-performance workspace.")}
      >
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button
            to={getLocalizedPath("/resources")}
            variant="primary"
            size="md"
            icon={<ArrowRight size={15} />}
          >
            {t("btnExploreResources", "EXPLORE RESOURCES")}
          </Button>
          <Button
            to={getLocalizedPath("/news")}
            variant="secondary"
            size="md"
          >
            {t("btnReadNews", "READ INDUSTRY NEWS")}
          </Button>
        </div>
      </PageHero>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. THE PLATFORM MISSION & WHY RVAN.ME EXISTS (DYNAMICS FROM SANITY)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold tracking-widest text-primary mono uppercase">{t("aboutWhyExistsEyebrow", "WHY RVAN.ME EXISTS")}</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground leading-tight">
                {aboutData?.heading || t("aboutWhyExistsTitle", "Bringing Clarity & Speed to Creative Workflows.")}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground font-medium">
                {aboutData?.introParagraph1 || t("aboutWhyExistsDescription", "Modern digital creation is fragmented across hundreds of bookmarks, scattered tools, and noisy social feeds. Rvan.me eliminates visual noise by uniting high-density creative utilities, open-source typography, and verified industry news into one seamless hub.")}
              </p>
              {aboutData?.introParagraph2 && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80 font-medium">
                  {aboutData.introParagraph2}
                </p>
              )}
            </div>

            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
              {platformValues.map((val, idx) => {
                const isEmerald = val.color === "emerald" || idx === 0;
                const isCyan = val.color === "cyan" || idx === 1;
                const isPurple = val.color === "purple" || idx === 2;

                const iconBorderBg = isEmerald
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : isCyan
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                  : isPurple
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                  : "border-primary/30 bg-primary/10 text-primary";

                const IconComponent =
                  val.icon === "Layers"
                    ? Layers
                    : val.icon === "Zap"
                    ? Zap
                    : val.icon === "Compass"
                    ? Compass
                    : CheckCircle2;

                return (
                  <motion.div
                    key={val.title || idx}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={idx * 0.1}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl aurora-card"
                  >
                    <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${iconBorderBg}`}>
                      <IconComponent size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{val.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {val.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. THE CORE ECOSYSTEM PILLARS (Resources, Tools, Blog)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-white/10 bg-white/[0.01]">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-primary mono uppercase">{t("aboutPlatformModulesEyebrow", "PLATFORM MODULES")}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {t("aboutPlatformModulesTitle", "What You Can Find Here.")}
            </h2>
            <p className="mt-4 text-sm text-muted-foreground font-medium">
              {t("aboutPlatformModulesSubtitle", "Explore the core verticals engineered to accelerate your creative & technical projects.")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Module 1: Resources */}
            <Link
              to={getLocalizedPath("/resources")}
              className="group p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-primary/50 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 aurora-card flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Globe size={22} />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {t("aboutModuleResourcesTitle", "Resources Directory")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {t("aboutModuleResourcesDesc", "Curated open-source font catalog, vector icon sets, 3D mockups, and Figma UI kits.")}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1 text-xs font-bold text-primary mono uppercase">
                <span>{t("btnExploreResources", "Explore Resources")}</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>

            {/* Module 2: AI Tools */}
            <Link
              to={getLocalizedPath("/ai-tools")}
              className="group p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-primary/50 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 aurora-card flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                  <Cpu size={22} />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {t("aboutModuleToolsTitle", "AI & Automation Directory")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {t("aboutModuleToolsDesc", "Verified AI utilities, motion animation scripts, and workflow automation extensions.")}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1 text-xs font-bold text-primary mono uppercase">
                <span>{t("aboutViewCreatorTools", "Browse AI Directory")}</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>

            {/* Module 3: Blog */}
            <Link
              to={getLocalizedPath("/blog")}
              className="group p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-primary/50 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 aurora-card flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <BookOpen size={22} />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {t("aboutModuleBlogTitle", "Editorial Essays")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {t("aboutModuleBlogDesc", "Original technical writeups on motion graphics, brand identity systems, and performance creative.")}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1 text-xs font-bold text-primary mono uppercase">
                <span>Read Blog Essays</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. BEHIND RVAN.ME — MEET THE FOUNDER SECTION (DYNAMIC FROM SANITY)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:px-10 md:py-28 relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1600px]">
          <div className="p-8 md:p-12 rounded-3xl border border-white/15 bg-white/[0.02] backdrop-blur-2xl aurora-card">
            <div className="grid gap-10 lg:grid-cols-12 items-center">
              {/* Left Founder Info */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold tracking-wider text-primary mono uppercase">
                  <UserCheck size={14} /> BEHIND RVAN.ME
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-foreground">
                  Created & Curated by <span className="text-primary">Ravan Mammadov</span>
                </h2>

                <p className="text-base leading-relaxed text-muted-foreground font-medium max-w-2xl">
                  {aboutData?.introParagraph1 || "Rvan.me was conceived, engineered, and curated by Ravan Mammadov — Founder & Creative Director specializing in brand architecture, motion graphics, creative strategy, and AI products."}
                </p>

                <p className="text-xs md:text-sm leading-relaxed text-muted-foreground/80 font-medium max-w-2xl">
                  {aboutData?.introParagraph2 || "Built to bridge design thinking and technical execution, the platform reflects a dedication to high-utility design systems, friction-free creator tools, and modern web aesthetics."}
                </p>

                <div className="pt-2">
                  <Button
                    to={getLocalizedPath("/ravan-mammadov")}
                    variant="outline"
                    size="md"
                    icon={<ArrowUpRight size={15} />}
                  >
                    VIEW FULL PROFILE & EXPERIENCE
                  </Button>
                </div>
              </div>

              {/* Right Founder Photo */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative group/founder">
                  <div className="h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-96 lg:w-96 overflow-hidden rounded-3xl border-2 border-[#61c5ad]/50 bg-black p-1.5 shadow-[0_0_35px_rgba(97,197,173,0.25)] group-hover/founder:border-[#61c5ad] group-hover/founder:shadow-[0_0_50px_rgba(152,79,159,0.4)] transition-all duration-500">
                    <picture>
                      {sanityPortraitUrl ? (
                        <img
                          src={sanityPortraitUrl}
                          alt="Ravan Mammadov — Founder of Rvan.me"
                          width={1200}
                          height={1200}
                          className="h-full w-full object-cover object-center rounded-2xl group-hover/founder:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <>
                          <source
                            srcSet={`${RavanPortrait400} 400w, ${RavanPortrait800} 800w, ${RavanPortrait1200} 1200w`}
                            type="image/webp"
                          />
                          <img
                            src={RavanPortrait1200}
                            alt="Ravan Mammadov — Founder of Rvan.me"
                            width={1200}
                            height={1200}
                            className="h-full w-full object-cover object-center rounded-2xl group-hover/founder:scale-105 transition-transform duration-500"
                          />
                        </>
                      )}
                    </picture>
                  </div>
                  <div className="absolute -bottom-3 -right-3 rounded-2xl border border-white/20 bg-background/90 px-4 py-2 text-xs font-bold text-primary mono uppercase backdrop-blur-md shadow-lg">
                    FOUNDER
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
