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
  MapPin
} from "lucide-react";

import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export default function AboutPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="About Rvan.me — Creative Ecosystem & Platform Vision"
        description="Learn about Rvan.me, a curated creative ecosystem built for designers, marketers and developers. Discover our mission, core pillars, and studio vision."
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
            background: "radial-gradient(circle at 50% 50%, rgba(232,253,82,0.06) 0%, rgba(147,51,234,0.03) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HERO SECTION — Platform Mission & Vision
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-24 pb-16 md:px-10 md:pt-32 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold tracking-widest text-primary mono uppercase">
              <Sparkles size={14} /> PLATFORM VISION & MISSION
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-[-.06em] md:text-6xl lg:text-7xl leading-[1.05]">
              Engineered for Designers, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                Marketers & Developers.
              </span>
            </h1>

            <p className="mt-8 text-lg leading-relaxed text-muted-foreground md:text-xl font-medium max-w-3xl">
              Rvan.me is a curated digital ecosystem engineered to bridge design thinking, developer tooling, and industry intelligence in a single high-performance workspace.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/resources"
                className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(216,255,68,0.3)] mono"
              >
                EXPLORE RESOURCES
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-xs font-bold tracking-[.18em] text-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 mono uppercase glass-sm"
              >
                VIEW CREATOR TOOLS
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. THE PLATFORM MISSION & WHY RVAN.ME EXISTS
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold tracking-widest text-primary mono uppercase">WHY RVAN.ME EXISTS</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground leading-tight">
                Bringing Clarity & Speed to Creative Workflows.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground font-medium">
                Modern digital creation is fragmented across hundreds of bookmarks, scattered tools, and noisy social feeds. Rvan.me eliminates visual noise by uniting high-density creative utilities, open-source typography, and verified industry news into one seamless hub.
              </p>
            </div>

            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl aurora-card">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Value First</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Zero fluff and zero promotional noise. Every font family, tool, and article is curated for real commercial and creative utility.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl aurora-card">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                  <Layers size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Unified Ecosystem</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Open-source typography, AI automation tools, RSS news aggregation, and design essays connected under a single design system.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl aurora-card">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">High Performance</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Engineered with modern web architecture, sub-second FlexSearch, instant static pre-rendering, and real-time synchronization.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl aurora-card">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <Compass size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Free & Open Access</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Public access to resources with optional Google authentication for personalizing bookmarks and member features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. THE CORE ECOSYSTEM PILLARS (Resources, Tools, News, Blog)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10 border-t border-white/10 bg-white/[0.01]">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-primary mono uppercase">PLATFORM MODULES</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              What You Can Find Here.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground font-medium">
              Explore the core verticals engineered to accelerate your creative & technical projects.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Module 1: Resources */}
            <Link
              to="/resources"
              className="group p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-primary/50 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 aurora-card flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Globe size={22} />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  Resources Directory
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Curated open-source font catalog, vector icon sets, 3D mockups, and Figma UI kits.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1 text-xs font-bold text-primary mono uppercase">
                <span>Explore Resources</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>

            {/* Module 2: Tools */}
            <Link
              to="/tools"
              className="group p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-primary/50 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 aurora-card flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                  <Cpu size={22} />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  AI & Creator Tools
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Verified AI utilities, motion animation scripts, and workflow automation extensions.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1 text-xs font-bold text-primary mono uppercase">
                <span>Browse Tools</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>

            {/* Module 3: News */}
            <Link
              to="/news"
              className="group p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-primary/50 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 aurora-card flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Newspaper size={22} />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  Industry News
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Live aggregated feeds covering design, technology, AI breakthroughs, and brand culture.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1 text-xs font-bold text-primary mono uppercase">
                <span>Read Industry News</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>

            {/* Module 4: Blog */}
            <Link
              to="/blog"
              className="group p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-primary/50 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 aurora-card flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <BookOpen size={22} />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  Design Essays
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Original technical writeups on motion graphics, brand identity systems, and performance creative.
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
          4. BEHIND RVAN.ME — MEET THE FOUNDER SECTION (LARGE PORTRAIT & FOUNDER CREATOR CARDS)
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
                  Rvan.me was conceived, engineered, and curated by Ravan Mammadov — Founder & Creative Director specializing in brand architecture, motion graphics, creative strategy, and AI products.
                </p>

                <p className="text-xs md:text-sm leading-relaxed text-muted-foreground/80 font-medium max-w-2xl">
                  Built to bridge design thinking and technical execution, the platform reflects a dedication to high-utility design systems, friction-free creator tools, and modern web aesthetics.
                </p>

                <div className="pt-2">
                  <Link
                    to="/profile"
                    className="group inline-flex items-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-7 py-3.5 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm"
                  >
                    VIEW FULL PROFILE & EXPERIENCE
                    <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* Right Founder Photo — Prominent Large Size */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative group/founder">
                  <div className="h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-96 lg:w-96 overflow-hidden rounded-3xl border-2 border-primary/50 bg-black p-1.5 shadow-[0_0_35px_rgba(232,253,82,0.25)] group-hover/founder:border-primary group-hover/founder:shadow-[0_0_50px_rgba(232,253,82,0.4)] transition-all duration-500">
                    <picture>
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
