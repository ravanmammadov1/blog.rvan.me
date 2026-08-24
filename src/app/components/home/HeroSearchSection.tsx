import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  Eye,
  BookOpen,
  Type,
} from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { Eyebrow } from "../Eyebrow";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HeroSearchSection() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("open-search", { detail: { query: searchInput.trim() } })
    );
  };

  const handleOpenSearchModal = () => {
    window.dispatchEvent(
      new CustomEvent("open-search", { detail: { query: searchInput.trim() } })
    );
  };

  // Popular Curated Concept Guides
  const popularConcepts = [
    {
      id: "visual-hierarchy",
      title: isAz ? "Vizual İyerarxiya & 3 Saniyə Qaydası" : "Visual Hierarchy & 3s Scanning",
      category: isAz ? "DİZAYN · KOQNİTİV" : "DESIGN · COGNITIVE",
      path: "/blog/visual-hierarchy-3-second-framework",
      icon: Layers,
      accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "apca-contrast",
      title: isAz ? "APCA Kontrast & Əlçatanlıq Elmi" : "APCA Contrast & Accessibility",
      category: isAz ? "ƏLÇATANLIQ · ELM" : "ACCESSIBILITY · SCIENCE",
      path: "/blog/apca-contrast-science-guide",
      icon: Eye,
      accent: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "cognitive-copywriting",
      title: isAz ? "Koqnitiv Kopiraytinq Çərçivəsi" : "Cognitive Copywriting Model",
      category: isAz ? "PSİXOLOGİYA · UX" : "PSYCHOLOGY · UX",
      path: "/blog/cognitive-conversion-copywriting-framework",
      icon: BookOpen,
      accent: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "fluid-typography",
      title: isAz ? "Axıcı Tipoqrafiya Arxitekturası" : "Fluid Typography Architecture",
      category: isAz ? "ARXİTEKTURA · KOD" : "ARCHITECTURE · CODE",
      path: "/blog/responsive-fluid-typography-enterprise-guide",
      icon: Type,
      accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <section className="relative flex min-h-[85vh] md:min-h-[90vh] flex-col items-center justify-center px-4 pt-28 pb-14 md:px-8 md:pt-36 md:pb-20 overflow-hidden text-center">
      {/* ── Floating Decorative Elements (Subtle Editorial Symbols) ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none" aria-hidden="true">
        {/* Spark Icon — Top Left */}
        <div className="absolute top-20 left-[8%] md:left-[12%] animate-float-slow opacity-60 dark:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-md shadow-xs">
            <Sparkles size={14} className="text-primary" />
          </div>
        </div>

        {/* Orbit Ring — Upper Right */}
        <div className="absolute top-28 right-[7%] md:right-[14%] animate-float-medium opacity-50 dark:opacity-75">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 border border-secondary/25 backdrop-blur-md shadow-xs">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          </div>
        </div>

        {/* Diamond / Plus Marker — Lower Left */}
        <div className="absolute bottom-28 left-[6%] md:left-[10%] animate-float-gentle opacity-40 dark:opacity-60 hidden sm:block">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 backdrop-blur-sm">
            <span className="text-xs font-mono font-bold text-accent">+</span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl relative z-10 flex flex-col items-center">
        {/* ── Micro-label ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Eyebrow className="mb-4 text-primary tracking-[.24em] font-semibold">
            {isAz
              ? "YARADICI NƏŞR · BİLİK · MƏDƏNİYYƏT"
              : "CREATIVE PUBLICATION · KNOWLEDGE · CULTURE"}
          </Eyebrow>
        </motion.div>

        {/* ── Dominant Brand Headline ── */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="font-extrabold tracking-tight leading-[1.04] mb-5 w-full"
          style={{ fontSize: "clamp(2.5rem, 6.2vw, 5.2rem)" }}
        >
          <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] dark:from-[#61c5ad] dark:via-[#6099df] dark:to-[#bc66c5] bg-clip-text text-transparent inline-block">
            {isAz ? (
              <>DİZAYN. STRATEGİYA.<br className="hidden sm:block" /> FİKİRLƏR.</>
            ) : (
              <>DESIGN. STRATEGY.<br className="hidden sm:block" /> IDEAS.</>
            )}
          </span>
        </motion.h1>

        {/* ── Short Supporting Description ── */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
          className="text-base sm:text-lg text-muted-foreground font-normal max-w-xl leading-relaxed mb-8 mx-auto"
        >
          {isAz
            ? "Dizayn, marketinq, brendinq, süni intellekt və vizual mədəniyyət haqqında yaradıcı nəşr."
            : "A creative publication about design, marketing, branding, AI and visual culture."}
        </motion.p>

        {/* ══════════════════════════════════════════════════════════════════
            ── HERO SEARCH BAR — PRIMARY FOCAL POINT ──
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="w-full max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <form onSubmit={handleSearchSubmit} className="relative group">
            {/* Ambient Animated Gradient Glow Halo */}
            <div
              className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#61c5ad]/30 via-[#426fba]/25 to-[#984f9f]/30 blur-xl opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 animate-halo-pulse"
              aria-hidden="true"
            />

            {/* Search Container Card */}
            <div className="relative flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-neutral-950/85 backdrop-blur-xl border border-black/10 dark:border-white/12 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-primary/50 group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/15">
              {/* Search Icon */}
              <Search
                size={20}
                className="text-primary shrink-0 transition-transform duration-300 group-focus-within:scale-110"
              />

              {/* Input */}
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onClick={handleOpenSearchModal}
                placeholder={
                  isAz
                    ? "İdeya, mövzu və məqalə axtar..."
                    : "Search ideas, concepts, articles..."
                }
                className="w-full bg-transparent text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />

              {/* Keyboard Shortcut Indicator */}
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border bg-muted/60 px-2 py-1 text-[11px] font-mono text-muted-foreground shadow-xs shrink-0 select-none">
                ⌘K
              </kbd>

              {/* Search Submit Action Button */}
              <button
                type="submit"
                aria-label={isAz ? "Axtar" : "Search"}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 active:scale-95 transition-all mono shrink-0"
              >
                <span className="hidden xs:inline">{isAz ? "AXTAR" : "SEARCH"}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════════
            ── SEARCH RESULT PREVIEW / CURATED CONCEPT CARDS ──
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.25}
          className="w-full max-w-4xl mx-auto mb-10"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] sm:text-[11px] mono uppercase font-bold tracking-[.18em] text-muted-foreground/80">
              {isAz ? "MƏŞHUR MÖVZULAR VƏ TƏDQİQATLAR" : "POPULAR SEARCHES & CURATED GUIDES"}
            </span>
            <Link
              to={getLocalizedPath("/blog")}
              className="text-[11px] mono font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{isAz ? "Hamısına bax" : "View all"}</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularConcepts.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={getLocalizedPath(item.path)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-white/60 dark:bg-white/[0.04] p-3.5 text-left backdrop-blur-md shadow-xs hover:border-primary/50 hover:shadow-md hover:bg-white/90 dark:hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${item.accent}`}>
                        <Icon size={14} />
                      </div>
                      <ArrowUpRight
                        size={14}
                        className="text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      />
                    </div>
                    <span className="text-[9px] font-bold mono uppercase tracking-wider text-muted-foreground block mb-1">
                      {item.category}
                    </span>
                    <h2 className="text-xs sm:text-[13px] font-bold leading-snug text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {item.title}
                    </h2>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ── Secondary Supporting Actions ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold mono"
        >
          <Link
            to={getLocalizedPath("/blog")}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors hover:underline"
          >
            <span>{isAz ? "BÜTÜN MƏQALƏLƏRƏ BAX" : "EXPLORE ALL ARTICLES"}</span>
            <ArrowUpRight size={13} />
          </Link>
          <span className="text-muted-foreground/40">•</span>
          <Link
            to={getLocalizedPath("/contributor/dashboard")}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <span>{isAz ? "BİZİMLƏ YAZ" : "WRITE WITH US"}</span>
            <ArrowUpRight size={13} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
