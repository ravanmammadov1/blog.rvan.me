import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Zap,
  GraduationCap,
  Building2,
  Layers,
  Compass,
  BrainCircuit,
  MonitorPlay,
  Target,
  Cpu,
  BadgeCheck,
  Globe,
  Mail,
} from "lucide-react";

import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";
import { client, urlFor } from "../lib/sanityClient";
import { fetchAboutSection, fetchSiteSettings } from "../lib/sanityQueries";
import { AboutSection as IAboutSection, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

// ── Real Work Experience (From Verified CV) ──
const realExperience = [
  {
    period: "05.2026 — PRESENT",
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
    period: "12.2025 — 05.2026",
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
    period: "08.2025 — 12.2025",
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
    period: "01.2024 — 08.2025",
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
    period: "09.2023 — 01.2024",
    role: "Motion Designer",
    company: "MOF Agency",
    brands: ["Ontop Bowling", "Ferma Art", "Nude Glass", "Avto Element"],
    responsibilities: [
      "2D Motion Graphics & Micro-Animations",
      "Logo Animation & Kinetic Typography",
      "Commercial Motion Graphics",
      "Advertising Video Content & Editing",
    ],
  },
];

// ── All Real Brands Worked With ──
const featuredBrandsList = [
  "Omoda", "Jaecoo", "JMC", "Wuling", "Vertu", "Xor",
  "MyShop", "MyGrocery", "MyPerfume", "YoKoSun", "Dry Idea",
  "EV Parts", "EV Motors", "Inomarka.az", "Loadstar Logistics",
  "Uni Cleaning", "Otodok Service", "Prior Leasing",
  "Ontop Bowling", "Ferma Art", "Nude Glass", "Avto Element",
];

// ── Multi-Industry Coverage ──
const industryList = [
  { name: "Automotive & EV Mobility", desc: "Global EV brands, dealership networks, and auto service ecosystems." },
  { name: "Retail & FMCG", desc: "Hypermarket networks, personal care, and household consumer products." },
  { name: "Luxury & High-End Tech", desc: "Bespoke luxury smartphones and premium hardware brands." },
  { name: "E-commerce & Digital Retail", desc: "Omnichannel e-commerce platforms and digital marketplaces." },
  { name: "Technology & Software", desc: "SaaS products, developer tools, and digital platforms." },
  { name: "Corporate & Logistics", desc: "International logistics fleets, supply chain, and corporate services." },
  { name: "Hospitality & Travel", desc: "Travel agencies, entertainment venues, and leisure destinations." },
  { name: "Consumer Brands & Perfumery", desc: "Cosmetics, luxury fragrances, and lifestyle consumer goods." },
  { name: "Digital Products & Apps", desc: "User-centered web interfaces, interactive tools, and design systems." },
  { name: "Creative Media & Agencies", desc: "Commercial video ads, agency campaigns, and digital production." },
];

// ── Categorized Professional Skills Matrix ──
const skillsCategorized = [
  {
    category: "Creative",
    icon: Layers,
    skills: [
      "Brand Identity", "Graphic Design", "Motion Design", "Creative Direction",
      "Art Direction", "Typography", "Print Design", "Editorial Design",
      "Packaging Design", "Presentation Design",
    ],
  },
  {
    category: "Marketing",
    icon: Target,
    skills: [
      "Creative Strategy", "Digital Marketing", "Social Media Marketing",
      "Campaign Planning", "Content Strategy", "Copywriting", "SEO Fundamentals",
      "Meta Ads", "Google Marketing Platform", "Analytics",
    ],
  },
  {
    category: "Content Production",
    icon: MonitorPlay,
    skills: [
      "Video Editing", "Motion Graphics", "Photography Direction", "Commercial Shoots",
      "Reels Production", "Storyboarding", "Content Writing", "Social Media Content",
    ],
  },
  {
    category: "Software",
    icon: Cpu,
    skills: [
      "Adobe Photoshop", "Illustrator", "After Effects", "Premiere Pro",
      "InDesign", "Lightroom", "Figma", "Blender", "WordPress", "Microsoft Office",
    ],
  },
  {
    category: "AI Tools",
    icon: BrainCircuit,
    skills: [
      "ChatGPT", "Claude", "Google Gemini", "Google Veo", "Google Flow",
      "Kling AI", "Midjourney", "Runway", "Adobe Firefly", "Ideogram",
      "Flux", "Perplexity", "NotebookLM", "Lovable", "Cursor", "Bolt.new",
    ],
  },
];

// ── Creative Philosophy Pillars ──
const philosophyPillars = [
  {
    title: "Design Should Solve Business Problems",
    desc: "Visual design is not decoration; it is a strategic business tool. Every brand identity, layout, and campaign asset should solve specific operational or commercial goals.",
  },
  {
    title: "Marketing and Creativity Work Together",
    desc: "Aesthetics reach their full potential when grounded in marketing strategy. Combining creative execution with audience psychology ensures campaign visuals drive real conversion.",
  },
  {
    title: "Every Visual Should Have a Purpose",
    desc: "Intentional visual hierarchy, purposeful color palettes, and clean typographic structure eliminate noise and focus viewer attention on core brand messaging.",
  },
  {
    title: "Strong Branding Creates Long-Term Value",
    desc: "A well-crafted brand identity creates sustainable brand equity. Cohesive design systems allow companies to scale across channels with instant recognition.",
  },
  {
    title: "Motion Should Enhance Communication",
    desc: "Kinetic typography, 2D animation, and motion graphics guide narrative flow, clarify complex product concepts, and create memorable digital experiences.",
  },
  {
    title: "Content Should Be Built for People First",
    desc: "High-performing visual content respects human attention. Authentic storytelling, strategic hooks, and clear value proposition outperform superficial hype.",
  },
];

// ── Real Education & Academic Foundation (CV) ──
const educationList = [
  {
    degree: "BSc in Marketing",
    institution: "Azerbaijan State Oil and Industry University",
    period: "2021 — 2025",
    desc: "Comprehensive academic grounding in consumer behavior, digital marketing strategy, brand management, market research, and campaign planning.",
  },
  {
    degree: "MSc in Transport & Logistics (SABAH)",
    institution: "Azerbaijan Technical University",
    period: "2025 — 2027",
    desc: "Advanced studies in supply chain optimization, international logistics management, and strategic transport systems.",
  },
];

// ── Real Professional Certifications (CV) ──
const certificatesList = [
  { title: "2D Motion Design", issuer: "IT Brains Academy" },
  { title: "Graphic Design Specialization", issuer: "Baku Design Center" },
  { title: "Digital Marketing Strategy", issuer: "Apex School" },
  { title: "Adobe Graphic Designer Specialization", issuer: "Adobe Certified Program" },
];

export default function RavanMammadovPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutSection, setAboutSection] = useState<IAboutSection | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    fetchAboutSection().then((data) => {
      if (data) setAboutSection(data);
    });

    // Fetch latest 6 Behance / CMS projects for the portfolio grid
    client
      .fetch(
        `
      *[_type == "projects"] | order(order asc, _createdAt desc)[0...6]{
        _id,
        title,
        "slug": slug.current,
        client,
        description,
        type,
        tags,
        behanceCoverUrl,
        coverImage,
        liveUrl,
        year,
        accent
      }
    `
      )
      .then((data) => {
        setProjects(data || []);
        if (window.location.hash) {
          const hash = window.location.hash.substring(1);
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 300);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const element = document.getElementById(window.location.hash.substring(1));
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ravan Mammadov",
    jobTitle: "Senior Creative Designer",
    url: "https://www.rvan.me/ravan-mammadov",
    sameAs: [
      "https://www.linkedin.com/in/ravanmammadov1/",
      "https://www.behance.net/mammadovravan",
      "https://www.instagram.com/ravanimate/",
    ],
    knowsAbout: [
      "Brand Identity",
      "Motion Design",
      "Graphic Design",
      "Creative Strategy",
      "Digital Marketing",
      "Content Creation",
    ],
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="Ravan Mammadov — Senior Creative Designer & Marketing Specialist"
        description="Official portfolio & career timeline of Senior Creative Designer Ravan Mammadov. Specializing in Branding, Motion Design, Graphic Design, Creative Strategy, and Marketing across Automotive, Retail, Tech & Luxury industries."
        url="https://www.rvan.me/ravan-mammadov"
        jsonLd={personSchema}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* ── Aurora background ambient glows ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />

        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%",
            left: "-10%",
            width: "60%",
            height: "70%",
            background:
              "radial-gradient(ellipse at 40% 40%, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.06) 45%, transparent 72%)",
            filter: "blur(64px)",
          }}
        />

        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "0%",
            right: "-12%",
            width: "55%",
            height: "65%",
            background:
              "radial-gradient(ellipse at 65% 30%, rgba(59,130,246,0.08) 0%, rgba(79,70,229,0.05) 50%, transparent 78%)",
            filter: "blur(72px)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HERO SECTION (Senior Creative Designer)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-24 pb-16 md:px-10 md:pt-32 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Sparkles size={14} /> SENIOR CREATIVE DESIGNER
              </div>

              <h1 className="mt-6 text-5xl font-semibold tracking-[-.07em] md:text-7xl lg:text-8xl">
                Ravan Mammadov <br />
                <span className="text-primary font-bold">Senior Creative Designer</span>
              </h1>

              {/* Subtitle list */}
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold tracking-wider text-muted-foreground mono uppercase">
                <span className="text-foreground">Branding</span> •
                <span className="text-foreground">Motion Design</span> •
                <span className="text-foreground">Graphic Design</span> •
                <span className="text-foreground">Creative Strategy</span> •
                <span className="text-foreground">Marketing</span> •
                <span className="text-foreground">Content Creation</span>
              </div>

              {/* Multidisciplinary Intro Paragraph */}
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl font-medium">
                I combine visual creativity with strategic marketing thinking, helping businesses communicate with clarity and commercial impact across brand identity, integrated campaigns, motion graphics, digital content, and creative strategy.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground/80 font-medium">
                With a background in marketing and multi-industry experience across retail, luxury tech, automotive, and digital commerce, I build cohesive visual systems designed to elevate brand perception and drive measurable engagement.
              </p>

              {/* Contact Button & Direct Mailto */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:mammadovravan1@gmail.com?subject=Project%20Inquiry"
                  className="group inline-flex items-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm"
                >
                  GET IN TOUCH
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>

                <a
                  href="https://www.linkedin.com/in/ravanmammadov1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-xs font-bold tracking-widest text-foreground hover:border-primary/50 hover:bg-white/10 transition-colors mono uppercase"
                >
                  LINKEDIN <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>

            {/* Profile Card & Believable Professional Highlights */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="lg:col-span-5"
            >
              <div className="p-8 aurora-card shadow-2xl relative">
                <div className="flex items-center gap-4 border-b border-white/10 pb-6 relative z-10">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-primary/50 bg-black flex-shrink-0 shadow-[0_0_15px_rgba(232,253,82,0.2)]">
                    <picture>
                      <source
                        srcSet={`${RavanPortrait400} 400w, ${RavanPortrait800} 800w, ${RavanPortrait1200} 1200w`}
                        type="image/webp"
                      />
                      <img
                        src={
                          aboutSection?.profilePhoto
                            ? urlFor(aboutSection.profilePhoto)?.url() || RavanPortrait1200
                            : RavanPortrait1200
                        }
                        alt="Ravan Mammadov"
                        className="h-full w-full object-cover object-top"
                      />
                    </picture>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Ravan Mammadov</h3>
                    <p className="text-xs text-muted-foreground mono tracking-wider uppercase">
                      Senior Creative Designer
                    </p>
                    <p className="text-[11px] text-primary mono mt-1">Baku, Azerbaijan</p>
                  </div>
                </div>

                {/* ── Believable Professional Highlights (CV Aligned) ── */}
                <div className="grid grid-cols-2 gap-4 pt-6 relative z-10">
                  <div className="p-4 aurora-card transition-colors duration-300">
                    <span className="text-3xl font-bold text-primary mono">4+ Years</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">
                      Professional Experience
                    </p>
                  </div>
                  <div className="p-4 aurora-card transition-colors duration-300">
                    <span className="text-3xl font-bold text-primary mono">15+ Brands</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">
                      Worked & Collaborated
                    </p>
                  </div>
                  <div className="p-4 aurora-card transition-colors duration-300">
                    <span className="text-3xl font-bold text-primary mono">Multi-Industry</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">
                      Retail, Tech, Auto, Luxury
                    </p>
                  </div>
                  <div className="p-4 aurora-card transition-colors duration-300">
                    <span className="text-3xl font-bold text-primary mono">Branding</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">
                      Motion • Strategy • Marketing
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. SELECTED WORK (Behance Integration)
      ───────────────────────────────────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section id="selected-work" className="px-6 py-20 md:px-10 md:py-28 relative z-10 border-t border-white/10">
          <div className="mx-auto max-w-[1600px] relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="eyebrow text-muted-foreground">Portfolio Showcase</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
                  Selected Work
                </h2>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
              >
                <a
                  href="https://www.behance.net/mammadovravan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-primary/50 bg-primary/10 px-6 py-3 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm"
                >
                  VIEW FULL BEHANCE
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, idx) => {
                const coverSrc = project.behanceCoverUrl || (project.coverImage ? urlFor(project.coverImage)?.url() : null);

                return (
                  <motion.article
                    key={project._id || idx}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    custom={idx * 0.08}
                    className="group p-6 aurora-card flex flex-col justify-between relative"
                  >
                    <div className="relative z-10 flex-1">
                      {coverSrc && (
                        <div className="mb-5 overflow-hidden rounded-xl aspect-[16/10] bg-background border border-white/5 relative">
                          <img
                            src={coverSrc}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-wider text-muted-foreground mono uppercase mb-3">
                        <span className="text-primary">{project.type || "Case Study"}</span>
                        <span>{project.year || "2026"}</span>
                      </div>

                      <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                        {project.title}
                      </h3>

                      <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-3 mb-6 font-medium">
                        {project.description}
                      </p>
                    </div>

                    <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-foreground mono uppercase mt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags?.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-[9px] font-semibold text-muted-foreground/60 border border-white/5 bg-white/5 rounded-full px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={project.liveUrl || `https://www.behance.net/mammadovravan`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
                      >
                        VIEW PROJECT <ArrowUpRight size={12} />
                      </a>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. EDITORIAL PERSONAL SUMMARY / BIOGRAPHY
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 md:px-10 md:py-32 relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1600px] relative">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-4">
              <p className="eyebrow text-muted-foreground">Editorial Background</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-5xl text-foreground">
                Multidisciplinary Profile
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
              className="lg:col-span-8 space-y-6 text-base md:text-lg leading-relaxed text-muted-foreground font-medium"
            >
              <p>
                I am a Senior Creative Designer with a multidisciplinary foundation spanning Graphic Design, Brand Identity, Motion Design, Marketing Strategy, and Content Creation. My career is defined by creating cohesive visual ecosystems that elevate brand perception while serving concrete commercial goals.
              </p>
              <p>
                With formal academic training in Marketing (BSc), I approach every design challenge through both an artistic and analytical lens. Whether crafting a complete visual identity for an automotive brand, producing high-impact 2D/3D motion graphics for luxury tech products, or directing video content for retail networks, I ensure every visual element communicates a unified narrative.
              </p>
              <p>
                My workflow integrates traditional design principles—typography, color theory, grid systems—with modern AI-assisted creative pipelines (Midjourney, Runway, Kling AI, Cursor, Lovable) to accelerate iteration and maintain high production standards across print, digital, and social channels.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. PROFESSIONAL JOURNEY (Authentic Career Timeline from CV)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-28 md:px-10 md:py-36 relative z-10">
        <div className="absolute inset-0 border-t border-white/5" />
        <div className="mx-auto max-w-[1600px] relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Career Trajectory</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Professional Journey
            </h2>
          </motion.div>

          <div className="mt-16 space-y-12 border-l-[1px] border-white/20 pl-6 md:pl-10 relative">
            {realExperience.map((exp, idx) => (
              <motion.div
                key={exp.company + idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.1}
                className="relative group p-6 -ml-6 md:-ml-10 md:pl-10 rounded-2xl transition-all duration-500 hover:bg-white/5 border border-transparent hover:border-white/10"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[23px] md:left-[7px] top-8 h-3 w-3 rounded-full border border-primary bg-background shadow-[0_0_10px_rgba(232,253,82,0.5)] transition-all duration-300 group-hover:scale-150 group-hover:bg-primary" />
                
                <span className="text-xs font-bold tracking-[.2em] text-primary mono transition-colors duration-300 group-hover:text-white">
                  {exp.period}
                </span>

                <h3 className="mt-2 text-2xl md:text-3xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {exp.company} <span className="text-muted-foreground/60 font-normal">· {exp.role}</span>
                </h3>

                {/* Brands Worked With */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground mono uppercase">Brands:</span>
                  {exp.brands.map((b) => (
                    <span
                      key={b}
                      className="text-[11px] font-semibold text-primary/90 border border-primary/20 bg-primary/5 rounded-full px-3 py-0.5 mono"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Core Responsibilities */}
                <ul className="mt-5 grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground/90 font-medium">
                  {exp.responsibilities.map((resp) => (
                    <li key={resp} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. FEATURED BRANDS (Worked & Collaborated With)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="bg-surface px-6 py-24 md:px-10 border-t border-border">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Proven Track Record</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Featured Brands
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl text-base">
              Brands and corporate entities where I have driven visual identity, campaign visuals, motion graphics, and creative strategy.
            </p>
          </motion.div>

          <div className="mt-12 flex flex-wrap gap-3">
            {featuredBrandsList.map((brand) => (
              <span
                key={brand}
                className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-foreground hover:border-primary hover:text-primary transition-all duration-300 glass-sm mono"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          6. INDUSTRIES (Multidisciplinary Experience)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 md:px-10 relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Cross-Sector Capability</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Industry Experience
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {industryList.map((ind) => (
              <div key={ind.name} className="p-6 aurora-card flex flex-col justify-between group">
                <div>
                  <div className="p-2.5 w-fit rounded-xl bg-white/5 border border-white/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Building2 size={18} />
                  </div>
                  <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {ind.name}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80 font-medium">
                    {ind.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          7. CATEGORIZED SKILLS & TOOLING MATRIX
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-28 md:px-10 md:py-36 relative z-10">
        <div className="absolute inset-0 border-t border-white/5" />
        <div className="mx-auto max-w-[1600px] relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Capabilities & Stack</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Skills & Tooling
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {skillsCategorized.map((group, idx) => {
              const IconComp = group.icon;
              return (
                <div key={group.category + idx} className="p-8 aurora-card group relative flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3 relative z-10">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-primary shadow-[0_0_15px_rgba(232,253,82,0.15)] group-hover:scale-110 transition-transform duration-300">
                        <IconComp size={18} />
                      </div>
                      {group.category}
                    </h3>
                    <ul className="space-y-3 relative z-10">
                      {group.skills.map((skill) => (
                        <li
                          key={skill}
                          className="flex items-center gap-2.5 text-[14px] text-muted-foreground/90 font-medium transition-colors duration-300 group-hover:text-foreground"
                        >
                          <CheckCircle2 size={13} className="text-primary/80 flex-shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          8. CREATIVE PHILOSOPHY
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-28 md:px-10 md:py-36 relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1600px] relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Core Principles</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Design Philosophy
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {philosophyPillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.08}
                className="p-8 aurora-card flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-primary mono mb-4 uppercase">
                    0{idx + 1} · Principle
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80 font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          9. ACADEMIC EDUCATION & CERTIFICATIONS (CV Verified)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="bg-surface px-6 py-24 md:px-10 border-t border-border">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Academic Education */}
            <div className="lg:col-span-7">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="eyebrow text-muted-foreground">Academic Foundation</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-5xl text-foreground">
                  Education
                </h2>
              </motion.div>

              <div className="mt-10 space-y-6">
                {educationList.map((edu) => (
                  <div key={edu.degree} className="p-6 aurora-card">
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-primary mono uppercase">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap size={16} /> {edu.institution}
                      </span>
                      <span>{edu.period}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-foreground">{edu.degree}</h3>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80 font-medium">
                      {edu.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Certifications */}
            <div className="lg:col-span-5">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="eyebrow text-muted-foreground">Verified Training</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-5xl text-foreground">
                  Certificates
                </h2>
              </motion.div>

              <div className="mt-10 space-y-4">
                {certificatesList.map((cert) => (
                  <div key={cert.title} className="p-5 aurora-card flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-foreground">{cert.title}</h4>
                      <p className="text-xs text-muted-foreground mono mt-1">{cert.issuer}</p>
                    </div>
                    <BadgeCheck size={20} className="text-primary flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
