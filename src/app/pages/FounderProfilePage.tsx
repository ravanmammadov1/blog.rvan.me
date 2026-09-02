import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Building2,
  MapPin,
  Briefcase,
  BookOpen,
  Mail,
  Layers,
  Award,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";
import { fetchAboutSection, fetchSiteSettings, fetchAllBlogs } from "../../lib/sanityQueries";
import { AboutSection, SiteSettings } from "../../types/cms";
import { BlogPost } from "../../types/blog";
import { urlFor } from "../../lib/sanityClient";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { PORTFOLIO_FALLBACK_PROJECTS } from "../../lib/portfolioFallback";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { Button } from "../components/ui/Button";
import GlobalFaqSection from "../components/GlobalFaqSection";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

// SVG Behance Logo Component
const BehanceIcon = ({ size = 15, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.105 0-5-2.28-5-5 0-2.887 1.854-5 4.821-5 3.007 0 4.679 2.051 4.679 4.792 0 .343-.031.708-.063.868h-7.371c.134 1.302 1.155 2.116 2.502 2.116 1.13 0 1.944-.45 2.378-1.206h2.78zm-4.793-4.887c-1.12 0-1.897.674-2.072 1.637h4.095c-.097-.932-.871-1.637-2.023-1.637zm-10.933 7.887h-8v-14h8.315c2.99 0 4.685 1.549 4.685 3.738 0 1.523-.811 2.766-2.148 3.328 1.748.513 2.648 1.91 2.648 3.784 0 2.531-1.993 3.15-5.5 3.15zm-4.5-8.5h4.15c1.229 0 2.15-.472 2.15-1.579 0-1.14-.863-1.421-2.15-1.421h-4.15v3zm0 6h4.383c1.385 0 2.417-.468 2.417-1.741 0-1.258-1.032-1.759-2.417-1.759h-4.383v3.5z" />
  </svg>
);

// ── Verified Career Experience ──
const realExperienceEn = [
  {
    role: "Senior Creative Designer",
    company: "RAM Holding",
    brands: ["Omoda", "Jaecoo", "JMC", "Wuling", "Otodok Service", "Prior Leasing"],
    responsibilities: [
      "Brand Identity & Visual Architecture",
      "Integrated Marketing Campaigns",
      "2D/3D Motion Graphics & Animation",
      "Creative & Content Strategy",
      "Digital Advertising & Social Media Assets",
      "Print Design & Collateral Production",
      "Video Production & Photography Direction",
      "Campaign Planning & Cross-Functional Team Leadership",
    ],
  },
  {
    role: "Senior Creative Designer",
    company: "My Group Holding",
    brands: ["MyShop", "Vertu", "Xor", "MyGrocery", "MyPerfume", "YoKoSun", "Dry Idea"],
    responsibilities: [
      "Brand Identity & Systems Design",
      "Product Packaging & FMCG Visuals",
      "Digital & Retail Advertising Visuals",
      "Marketing Visual Communication",
      "Omnichannel Creative Campaigns",
    ],
  },
  {
    role: "Graphic Designer",
    company: "Inmotion Trading Co., LTD",
    brands: ["EV Parts", "EV Motors", "Salam Baku", "Nihao Travel"],
    responsibilities: [
      "Motion Graphics & Promotional Animation",
      "Social Media Content & Ad Creatives",
      "Video Editing & Post-Production",
      "Digital Marketing Visuals",
    ],
  },
  {
    role: "Graphic & Motion Designer",
    company: "Zafar Limited LLC",
    brands: ["Inomarka.az", "Loadstar Logistics", "Uni Cleaning"],
    responsibilities: [
      "Corporate Identity & Branding",
      "Executive Pitch Decks & Presentations",
      "Web Graphics & User Interface Assets",
      "Marketing Collateral & Promotional Assets",
    ],
  },
  {
    role: "Motion Designer",
    company: "MOF Agency",
    brands: ["Ontop Bowling", "Ferma Art", "Nude Glass", "Avto Element"],
    responsibilities: [
      "2D Motion Graphics & Keyframe Animation",
      "Commercial Storyboarding & Concepts",
      "Social Media Video Assets & VFX",
    ],
  },
];

const realExperienceAz = [
  {
    role: "Aparıcı Kreativ Dizayner",
    company: "RAM Holding",
    brands: ["Omoda", "Jaecoo", "JMC", "Wuling", "Otodok Service", "Prior Leasing"],
    responsibilities: [
      "Brend Kimliyi və Vizual Arxitektura",
      "İnteqrasiya Olunmuş Marketinq Kampaniyaları",
      "2D/3D Motion Qrafika və Animasiya",
      "Kreativ və Kontent Strategiyası",
      "Rəqəmsal Reklam və Sosial Media Materialları",
      "Çap Dizaynı və Poliqrafiya İstehsalı",
      "Video İstehsalı və Fotoqrafiya Rəhbərliyi",
      "Kampaniya Planlaması və Komanda Liderliyi",
    ],
  },
  {
    role: "Aparıcı Kreativ Dizayner",
    company: "My Group Holding",
    brands: ["MyShop", "Vertu", "Xor", "MyGrocery", "MyPerfume", "YoKoSun", "Dry Idea"],
    responsibilities: [
      "Brend Kimliyi və Sistem Dizaynı",
      "Məhsul Qablaşdırması və FMCG Vizual Dizayn",
      "Rəqəmsal və Pərakəndə Satış Reklam Vizualları",
      "Marketinq Vizual Kommunikasiyası",
      "Omnichannel Yaradıcı Kampaniyalar",
    ],
  },
  {
    role: "Qrafik Dizayner",
    company: "Inmotion Trading Co., LTD",
    brands: ["EV Parts", "EV Motors", "Salam Baku", "Nihao Travel"],
    responsibilities: [
      "Motion Qrafika və Promo Animasiyalar",
      "Sosial Media Kontenti və Reklam Kreativləri",
      "Video Montaj və Post-Prodakşn",
      "Rəqəmsal Marketinq Vizualları",
    ],
  },
  {
    role: "Qrafik və Motion Dizayner",
    company: "Zafar Limited LLC",
    brands: ["Inomarka.az", "Loadstar Logistics", "Uni Cleaning"],
    responsibilities: [
      "Korporativ Kimlik və Brendinq",
      "Rəhbərlik üçün Təqdimatlar və Pitch Deck-lər",
      "Veb Qrafika və İstifadəçi İnterfeysi Aktivləri",
      "Marketinq Materialları və Reklam Dəstləri",
    ],
  },
  {
    role: "Motion Dizayner",
    company: "MOF Agency",
    brands: ["Ontop Bowling", "Ferma Art", "Nude Glass", "Avto Element"],
    responsibilities: [
      "2D Motion Qrafika və Keyframe Animasiya",
      "Kommersiya Storyboard və Konseptlər",
      "Sosial Media Video Materialları və VFX",
    ],
  },
];

export default function FounderProfilePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const [founderArticles, setFounderArticles] = useState<BlogPost[]>([]);
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
    fetchAboutSection(language).then((data) => {
      if (data) setAboutData(data);
    });
    fetchAllBlogs(language).then((blogs) => {
      if (blogs && blogs.length > 0) {
        const filtered = blogs.filter(
          (b) =>
            b.authorName?.toLowerCase().includes("ravan") ||
            b.authorName?.toLowerCase().includes("mammadov")
        );
        setFounderArticles(filtered.length > 0 ? filtered.slice(0, 3) : blogs.slice(0, 3));
      }
    });
  }, [language]);

  const sanityPortraitUrl = aboutData?.profilePhoto
    ? urlFor(aboutData.profilePhoto)?.width(1200).height(1200).url()
    : null;

  const activeExperience =
    aboutData?.experience && aboutData.experience.length > 0
      ? aboutData.experience
      : isAz
      ? realExperienceAz
      : realExperienceEn;

  const displayProjects = PORTFOLIO_FALLBACK_PROJECTS.map((project) => ({
    _id: project.slug,
    title: project.title,
    slug: { current: project.slug },
    type: isAz
      ? project.slug === "wuling-creative-campaign"
        ? "Art Direksiya · Motion · Kampaniya"
        : project.slug === "limitless-drive"
        ? "Brend Kimliyi · 3D · Avtomobil"
        : "Kreativ Dəst · Motion Sistemi"
      : project.type,
    description: isAz
      ? project.slug === "wuling-creative-campaign"
        ? "Avtomobil sahəsində art direksiya, motion qrafika və ardıcıl brend təcrübəsi üçün rəqəmsal kampaniya vizual sistemi."
        : project.slug === "limitless-drive"
        ? "Güclü vizual kimlik, kinematik məhsul təqdimatı və kampaniyaya hazır brend aktivləri üzərində qurulmuş 3D avtomobil vizual istiqaməti."
        : "Avtomobil brendləri üçün rəqəmsal buraxılış və performans reklamlarını vahid vizual dildə saxlayan çevik kreativ və motion sistemi."
      : project.description,
    tags: project.tags,
    year: project.year,
    behanceCoverUrl: project.image,
  }));

  // Human-facing Display Name: Ravan Mammadov in EN, Rəvan Məmmədov in AZ
  const founderName = isAz ? "Rəvan Məmmədov" : "Ravan Mammadov";
  const founderRole = isAz
    ? "Kreativ Strateq · Dizayner · Marketoloq"
    : "Creative Strategist · Designer · Marketer";
  const founderBadge = isAz
    ? "TƏSİSÇİ VƏ KREATİV STRATEQ"
    : "FOUNDER & CREATIVE STRATEGIST";
  const founderLocation = isAz ? "Bakı, Azərbaycan" : "Baku, Azerbaijan";

  const expertisePillars = isAz
    ? [
        { title: "Brend Arxitekturası & Dizayn", desc: "Kommersiya biznesləri üçün unikal vizual kimlik, sistem dizaynı və tipoqrafik struktur." },
        { title: "Kreativ Strategiya & Kampaniyalar", desc: "Çoxkanallı reklam, məzmun planlaması və performans yönümlü kreativ həllər." },
        { title: "Marketinq Vizual Kommunikasiyası", desc: "Rəqəmsal reklam aktivləri, qablaşdırma (FMCG) və brend təqdimatları." },
        { title: "Motion Qrafika & Video İstehsalı", desc: "Kinematik 2D/3D animasiya, kommersiya video montajı və vizual effektlər (VFX)." },
        { title: "Müasir Rəqəmsal Texnologiyalar & AI", desc: "Yüksək faydalı veb ekosistemləri, alətlər və süni intellekt yönümlü təcrübələr." },
      ]
    : [
        { title: "Brand Architecture & Design", desc: "Distinctive visual identities, design systems, and typographic hierarchy for commercial brands." },
        { title: "Creative Strategy & Campaigns", desc: "Cross-platform advertising, content architecture, and performance-driven creative strategy." },
        { title: "Marketing Visual Communication", desc: "Digital advertising assets, product packaging (FMCG), and executive presentation design." },
        { title: "Motion Graphics & Video Direction", desc: "Kinematic 2D/3D animation, commercial video editing, and visual effects (VFX)." },
        { title: "Emerging Technologies & AI", desc: "High-utility digital ecosystems, interactive creative tools, and AI workflows." },
      ];

  const positioningStatement = isAz
    ? "Rəvan Məmmədov dizayn, marketinq, vizual kommunikasiya və müasir rəqəmsal texnologiyalar sahəsində fəaliyyət göstərən yaradıcı peşəkardır."
    : "Ravan Mammadov is a creative professional working across design, marketing, visual communication and emerging digital technologies.";

  const biographyText = isAz
    ? "Dizaynerin estetik həssaslığını strateqin kommersiya dəqiqliyi ilə birləşdirərək güclü brend kimlikləri, təsirli motion qrafikalar və inteqrasiya olunmuş marketinq kampaniyaları formalaşdırır. Avtomobil, lüks, FMCG və texnologiya sektorlarında aparıcı holdinqlər və brendlərlə çoxillik iş təcrübəsinə malikdir."
    : "Pairing a designer's aesthetic sensibility with a strategist's commercial clarity to construct cohesive visual identities, impactful motion graphics, and integrated marketing campaigns. Bringing extensive creative experience across automotive, luxury, FMCG, and technology enterprises.";

  const rvanPlatformStatement = isAz
    ? "Rvan.me dizayn, yaradıcılıq, texnologiya, marketinq və kreativ sənayeni formalaşdıran ideyaları araşdıran müstəqil redaksiya platformasıdır."
    : "Rvan.me is an independent editorial platform exploring design, creativity, technology, marketing and the ideas shaping the creative industry.";

  // JSON-LD Person Schema for SEO Authority
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founderName,
    alternateName: [
      "Rəvan Məmmədov",
      "Ravan Mammadov",
      "Ravan Mammadov Studio",
      "Rəvan Məmmədov Dizayner",
      "ravanimate",
    ],
    url: isAz ? "https://www.rvan.me/az/about/ravan-mammadov" : "https://www.rvan.me/about/ravan-mammadov",
    image: {
      "@type": "ImageObject",
      url: "https://www.rvan.me/imports/ravan_1-1200.webp",
      caption: isAz ? "Rəvan Məmmədov (Ravan Mammadov)" : "Ravan Mammadov (Rəvan Məmmədov)",
      representativeOfPage: true,
    },
    jobTitle: isAz ? "Kreativ Strateq, Dizayner, Marketoloq" : "Creative Strategist, Designer, Marketer",
    worksFor: {
      "@type": "Organization",
      name: "Rvan.me",
      url: "https://www.rvan.me",
    },
    sameAs: [
      "https://www.linkedin.com/in/ravanmammadov1/",
      "https://www.instagram.com/ravanimate/",
      "https://www.behance.net/mammadovravan",
      "https://github.com/ravanmammadov1",
      "https://twitter.com/ravanimate",
    ],
    description: positioningStatement,
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={isAz ? "Rəvan Məmmədov — Kreativ Strateq, Dizayner, Marketoloq" : "Ravan Mammadov — Creative Strategist, Designer, Marketer"}
        description={positioningStatement}
        url={isAz ? "https://www.rvan.me/az/about/ravan-mammadov" : "https://www.rvan.me/about/ravan-mammadov"}
      />

      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30" aria-hidden="true">
        <div
          className="absolute -top-[15%] left-[10%] h-[700px] w-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(97,197,173,0.1) 0%, rgba(66,111,186,0.04) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HERO & FOUNDER PROFILE CARD
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-24 pb-16 md:px-10 md:pt-32 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Hero Column */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Sparkles size={14} /> {founderBadge}
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-[-.06em] md:text-6xl lg:text-7xl leading-none">
                {founderName} <br />
                <span className="text-primary font-bold text-2xl md:text-4xl lg:text-5xl block mt-2 tracking-tight">
                  {founderRole}
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground md:text-lg font-medium">
                {positioningStatement}
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {biographyText}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  href="mailto:mammadovravan1@gmail.com?subject=Project%20Inquiry"
                  variant="outline"
                  size="lg"
                  icon={<Mail size={16} />}
                >
                  {isAz ? "Əlaqə Saxla" : "Get in Touch"}
                </Button>

                <Button
                  href="https://www.linkedin.com/in/ravanmammadov1/"
                  external
                  variant="primary"
                  size="lg"
                  icon={<ArrowUpRight size={14} />}
                >
                  LinkedIn
                </Button>

                <Button
                  href="https://www.behance.net/mammadovravan"
                  external
                  variant="secondary"
                  size="lg"
                  icon={<ArrowUpRight size={14} />}
                >
                  <span className="flex items-center gap-2">
                    <BehanceIcon size={15} />
                    {isAz ? "Behance Portfeli" : "Behance Portfolio"}
                  </span>
                </Button>
              </div>
            </motion.div>

            {/* Right Founder Profile Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="lg:col-span-5"
            >
              <div className="group/profile relative p-8 md:p-10 rounded-3xl border border-[#DDE1E0] dark:border-white/15 bg-white dark:bg-white/5 backdrop-blur-2xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-2xl transition-all duration-500 overflow-hidden aurora-card">
                {/* Header: Photo & Identity */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-[#DDE1E0] dark:border-white/10 pb-8">
                  <div className="h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-3xl border-2 border-[#61c5ad]/50 bg-black p-1 shadow-[0_0_30px_rgba(97,197,173,0.25)] shrink-0">
                    <picture>
                      {sanityPortraitUrl ? (
                        <img
                          src={sanityPortraitUrl}
                          alt={`${founderName} — ${isAz ? "Rvan.me Təsisçisi" : "Founder of Rvan.me"}`}
                          width={1200}
                          height={1200}
                          className="h-full w-full object-cover object-center rounded-2xl"
                        />
                      ) : (
                        <>
                          <source
                            srcSet={`${RavanPortrait400} 400w, ${RavanPortrait800} 800w, ${RavanPortrait1200} 1200w`}
                            type="image/webp"
                          />
                          <img
                            src={RavanPortrait1200}
                            alt={`${founderName} — ${isAz ? "Rvan.me Təsisçisi" : "Founder of Rvan.me"}`}
                            width={1200}
                            height={1200}
                            className="h-full w-full object-cover object-center rounded-2xl"
                          />
                        </>
                      )}
                    </picture>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                      {founderName}
                    </h3>
                    <p className="text-xs font-bold text-primary tracking-wider uppercase mono">
                      {isAz ? "Təsisçi · Rvan.me" : "Founder · Rvan.me"}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 pt-1">
                      <MapPin size={13} className="text-primary/70" /> {founderLocation}
                    </p>
                  </div>
                </div>

                {/* Connection Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6 border-b border-[#DDE1E0] dark:border-white/10">
                  <div className="p-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/5 backdrop-blur-md">
                    <span className="text-[9.5px] font-bold text-primary mono uppercase tracking-wider block mb-1">
                      {isAz ? "REDAKSİYA PLATFORMASI" : "EDITORIAL PLATFORM"}
                    </span>
                    <p className="text-xs font-bold text-foreground">
                      Rvan.me
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/5 backdrop-blur-md">
                    <span className="text-[9.5px] font-bold text-primary mono uppercase tracking-wider block mb-1">
                      {isAz ? "PEŞƏKAR STATUS" : "PROFESSIONAL FOCUS"}
                    </span>
                    <p className="text-xs font-bold text-foreground">
                      {isAz ? "Kreativ Strateq & Dizayner" : "Creative Strategist"}
                    </p>
                  </div>

                  <div className="sm:col-span-2 p-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/5 backdrop-blur-md">
                    <span className="text-[9.5px] font-bold text-primary mono uppercase tracking-wider block mb-1">
                      {isAz ? "PLATFORMA HAQQINDA" : "ABOUT RVAN.ME"}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {rvanPlatformStatement}
                    </p>
                  </div>
                </div>

                {/* Direct Action Inside Card */}
                <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    to={getLocalizedPath("/contact")}
                    variant="primary"
                    size="md"
                    className="w-full sm:w-1/2"
                    icon={<ArrowUpRight size={14} />}
                  >
                    {isAz ? "Əlaqə Saxla" : "Get in Touch"}
                  </Button>
                  <Button
                    href="https://www.linkedin.com/in/ravanmammadov1/"
                    external
                    variant="secondary"
                    size="md"
                    className="w-full sm:w-1/2"
                    icon={<ArrowUpRight size={13} />}
                  >
                    LinkedIn
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. CORE EXPERTISE PILLARS
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-[#DDE1E0] dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12">
            <span className="text-xs font-bold tracking-widest text-primary mono uppercase">
              {isAz ? "EKSPERTİZA VƏ SAHƏLƏR" : "AREAS OF EXPERTISE"}
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Əsas Peşəkar İstiqamətlər" : "Core Professional Pillars"}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {expertisePillars.map((pillar, pIdx) => (
              <div
                key={pIdx}
                className="p-6 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl space-y-2 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary">
                  <span>0{pIdx + 1}</span>
                  <span>/</span>
                  <span className="uppercase">{isAz ? "İstiqamət" : "Pillar"}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. AUTHENTIC PROFESSIONAL EXPERIENCE
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-[#DDE1E0] dark:border-white/10">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12">
            <span className="text-xs font-bold tracking-widest text-primary mono uppercase">
              {isAz ? "KARYERA XRONOLOGİYASI" : "CAREER TIMELINE"}
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Peşəkar Təcrübə" : "Professional Experience"}
            </h2>
          </div>

          <div className="space-y-5">
            {activeExperience.map((exp, idx) => (
              <div
                key={idx}
                className="p-6 md:p-7 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl aurora-card transition-all duration-300 hover:border-primary/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#DDE1E0] dark:border-white/10 pb-5 mb-5">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-primary flex items-center gap-2 mt-1">
                      <Building2 size={15} className="text-primary" /> {exp.company}
                    </p>
                  </div>
                  {exp.brands && exp.brands.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.brands.map((b) => (
                        <span
                          key={b}
                          className="rounded-full border border-[#DDE1E0] dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-[10px] font-bold text-foreground mono uppercase shadow-2xs"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground font-medium">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. SELECTED PORTFOLIO CASE STUDIES
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-[#DDE1E0] dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-primary mono uppercase">
                {isAz ? "PORTFOLİO VƏ LAYİHƏLƏR" : "PORTFOLIO CASE STUDIES"}
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
                {isAz ? "Seçilmiş İşlər" : "Selected Work"}
              </h2>
            </div>
            <a
              href="https://www.behance.net/mammadovravan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-3 text-xs font-bold text-primary mono uppercase hover:bg-primary hover:text-black transition-colors"
            >
              <BehanceIcon size={14} /> {isAz ? "BEHANCE-DƏ BAX" : "VIEW BEHANCE"} <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project) => (
              <a
                key={project._id}
                href="https://www.behance.net/mammadovravan"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl hover:border-primary/40 transition-all duration-300 aurora-card flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black mb-4 border border-[#DDE1E0] dark:border-white/10">
                    <img
                      src={project.behanceCoverUrl}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider">
                    {project.type}
                  </span>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mt-1 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 font-medium">
                    {project.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#DDE1E0] dark:border-white/10 flex items-center justify-between text-xs font-bold mono">
                  <span className="text-[10px] text-muted-foreground">{project.year}</span>
                  <span className="text-[10px] text-primary flex items-center gap-1">
                    {isAz ? "LAYİHƏYƏ BAX" : "VIEW PROJECT"} <ArrowUpRight size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. WRITING ON RVAN.ME
      ───────────────────────────────────────────────────────────────────────────── */}
      {founderArticles.length > 0 && (
        <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-[#DDE1E0] dark:border-white/10">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold tracking-widest text-primary mono uppercase">
                  {isAz ? "MƏQALƏLƏR VƏ YAZILAR" : "WRITING & PERSPECTIVES"}
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
                  {isAz ? "Rvan.me Üzərində Nəşrlər" : "Articles on Rvan.me"}
                </h2>
              </div>
              <Link
                to={getLocalizedPath("/blog")}
                className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-3 text-xs font-bold text-primary mono uppercase hover:bg-primary hover:text-black transition-colors"
              >
                <BookOpen size={14} /> {isAz ? "BÜTÜN BLOQ ARXİVİ" : "VIEW ALL ARTICLES"} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {founderArticles.map((article) => (
                <Link
                  key={article._id}
                  to={getLocalizedPath(`/blog/${article.slug?.current || article._id}`)}
                  className="group p-6 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl hover:border-primary/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                      <span className="font-bold text-primary uppercase">{article.category}</span>
                      <span>•</span>
                      <span>{article.readTime || "4 min read"}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#DDE1E0] dark:border-white/10 flex items-center justify-between text-xs font-bold mono text-primary">
                    <span>{isAz ? "MƏQALƏNİ OXU" : "READ ARTICLE"}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          6. EDITORIAL INVITATION (SHARE YOUR IDEAS)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-20 relative z-10 border-t border-[#DDE1E0] dark:border-white/10 bg-gradient-to-b from-transparent to-primary/[0.03]">
        <div className="mx-auto max-w-[1200px] text-center space-y-6">
          <span className="text-xs font-bold tracking-widest text-primary mono uppercase">
            {isAz ? "REDAKSİYA İLƏ ƏLAQƏ" : "CONNECT WITH RVAN.ME"}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            {isAz ? "Fikrinizi və ya Məqalənizi Bizimlə Paylaşın" : "Share Your Ideas or Submit an Article"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {isAz
              ? "Dizayn, marketinq, texnologiya və yaradıcı sənaye mövzularında orijinal ideyanız və ya yazınız varsa, ictimai portalımız vasitəsilə redaksiyamıza göndərin."
              : "If you have an original perspective, article, or research piece on design, technology, or creative strategy, submit it directly to our editorial board."}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button
              to={getLocalizedPath("/write")}
              variant="primary"
              size="lg"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              {isAz ? "FİKRİNİZİ BİZİMLƏ PAYLAŞIN" : "SHARE YOUR IDEAS"}
            </Button>
            <Button
              to={getLocalizedPath("/contact")}
              variant="outline"
              size="lg"
              icon={<Mail size={16} />}
            >
              {isAz ? "ƏLAQƏ" : "CONTACT"}
            </Button>
          </div>
        </div>
      </section>

      {/* ── 7. GLOBAL FAQ SECTION (IMMEDIATELY BEFORE FOOTER) ── */}
      <GlobalFaqSection />

      {/* ── 8. GLOBAL FOOTER ── */}
      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
