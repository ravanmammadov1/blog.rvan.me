import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Building2,
  MapPin,
} from "lucide-react";

import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";
import { fetchAboutSection, fetchSiteSettings } from "../../lib/sanityQueries";
import { AboutSection, SiteSettings } from "../../types/cms";
import { urlFor } from "../../lib/sanityClient";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { PORTFOLIO_FALLBACK_PROJECTS } from "../../lib/portfolioFallback";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { Button } from "../components/ui/Button";

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

// ── Verified Career Experience (Timeless — No dates) ──
const realExperience = [
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

export default function FounderProfilePage() {
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

  const sanityPortraitUrl = aboutData?.profilePhoto
    ? urlFor(aboutData.profilePhoto)?.width(1200).height(1200).url()
    : null;

  const activeExperience = (aboutData?.experience && aboutData.experience.length > 0)
    ? aboutData.experience
    : realExperience;

  const displayProjects = PORTFOLIO_FALLBACK_PROJECTS.map((project) => ({
    _id: project.slug,
    title: project.title,
    slug: { current: project.slug },
    type: project.type,
    description: project.description,
    tags: project.tags,
    year: project.year,
    behanceCoverUrl: project.image,
  }));

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="Ravan Mammadov — Founder & Creative Director"
        description="Founder profile, strategic focus, brand experience, and creative portfolio of Ravan Mammadov, Founder & Creative Director of Rvan.me."
        url="https://www.rvan.me/ravanmammadov"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30" aria-hidden="true">
        <div
          className="absolute -top-[15%] left-[10%] h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(97,197,173,0.1) 0%, rgba(66,111,186,0.04) 50%, transparent 75%)",
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
                <Sparkles size={14} /> FOUNDER & CREATIVE DIRECTOR
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-[-.06em] md:text-6xl lg:text-7xl leading-none">
                Ravan Mammadov <br />
                <span className="text-primary font-bold">Creative Director & Strategist</span>
              </h1>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold tracking-wider text-muted-foreground mono uppercase">
                <span className="text-foreground">Brand Architecture</span> •
                <span className="text-foreground">Motion Graphics</span> •
                <span className="text-foreground">Creative Strategy</span> •
                <span className="text-foreground">AI Products</span> •
                <span className="text-foreground">FMCG Packaging</span>
              </div>

              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg font-medium">
                I pair a designer's aesthetic eye with a strategist's commercial clarity: building cohesive visual identities, motion graphics, and integrated marketing campaigns designed to perform.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  href="mailto:mammadovravan1@gmail.com?subject=Project%20Inquiry"
                  variant="outline"
                  size="lg"
                  icon={<ArrowUpRight size={16} />}
                >
                  Get in Touch
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
                    View Behance
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
              <div className="group/profile relative p-8 md:p-10 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-500 overflow-hidden aurora-card">
                {/* Header: Photo & Name */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-white/10 pb-8">
                  <div className="h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-3xl border-2 border-[#61c5ad]/50 bg-black p-1 shadow-[0_0_30px_rgba(97,197,173,0.25)] shrink-0">
                    <picture>
                      {sanityPortraitUrl ? (
                        <img
                          src={sanityPortraitUrl}
                          alt="Ravan Mammadov — Founder of Rvan.me"
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
                            alt="Ravan Mammadov — Founder of Rvan.me"
                            width={1200}
                            height={1200}
                            className="h-full w-full object-cover object-center rounded-2xl"
                          />
                        </>
                      )}
                    </picture>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                      Ravan Mammadov
                    </h3>
                    <p className="text-xs font-bold text-primary tracking-widest uppercase mono">
                      Founder & Creative Director
                    </p>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 pt-1">
                      <MapPin size={13} className="text-primary/70" /> Baku, Azerbaijan
                    </p>
                  </div>
                </div>

                {/* Founder Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-b border-white/10">
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                    <span className="text-[9.5px] font-bold text-primary mono uppercase tracking-wider block mb-1">
                      CURRENTLY BUILDING
                    </span>
                    <p className="text-sm font-extrabold text-foreground tracking-tight">
                      Rvan.me Ecosystem
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                    <span className="text-[9.5px] font-bold text-primary mono uppercase tracking-wider block mb-1">
                      CORE MISSION
                    </span>
                    <p className="text-xs font-bold text-foreground leading-snug">
                      High-Utility Creative & Developer Tools
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                    <span className="text-[9.5px] font-bold text-primary mono uppercase tracking-wider block mb-1">
                      INDUSTRY TRACK RECORD
                    </span>
                    <p className="text-xs font-bold text-foreground leading-snug">
                      Automotive · Luxury · FMCG · Tech
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                    <span className="text-[9.5px] font-bold text-primary mono uppercase tracking-wider block mb-1">
                      LOCATION
                    </span>
                    <p className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                      <MapPin size={13} className="text-primary" /> Baku, Azerbaijan
                    </p>
                  </div>
                </div>

                {/* Direct Action Inside Card */}
                <div className="pt-8 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    to={getLocalizedPath("/contact")}
                    variant="primary"
                    size="md"
                    className="w-full sm:w-1/2"
                    icon={<ArrowUpRight size={14} />}
                  >
                    Get in Touch
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
          2. AUTHENTIC PROFESSIONAL EXPERIENCE
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12">
            <span className="text-xs font-bold tracking-widest text-primary mono uppercase">CAREER TIMELINE</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              Professional Experience
            </h2>
          </div>

          <div className="space-y-5">
            {activeExperience.map((exp, idx) => (
              <div
                key={idx}
                className="p-6 md:p-7 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl aurora-card transition-all duration-300 hover:border-primary/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5 mb-5">
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
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-foreground/80 mono uppercase"
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
          3. SELECTED PORTFOLIO CASE STUDIES
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-white/10 bg-white/[0.01]">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-primary mono uppercase">PORTFOLIO CASE STUDIES</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
                Selected Work
              </h2>
            </div>
            <a
              href="https://www.behance.net/mammadovravan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-3 text-xs font-bold text-primary mono uppercase hover:bg-primary hover:text-black transition-colors"
            >
              <BehanceIcon size={14} /> VIEW BEHANCE <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project) => (
              <a
                key={project._id}
                href={`https://www.behance.net/mammadovravan`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-primary/40 transition-all duration-300 aurora-card flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-black mb-4 border border-white/10">
                    <img
                      src={project.behanceCoverUrl}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider">{project.type}</span>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mt-1 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 font-medium">
                    {project.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold mono">
                  <span className="text-[10px] text-muted-foreground">{project.year}</span>
                  <span className="text-[10px] text-primary flex items-center gap-1">VIEW PROJECT <ArrowUpRight size={12} /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
