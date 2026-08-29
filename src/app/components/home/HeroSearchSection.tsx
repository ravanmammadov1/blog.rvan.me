import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Menu, X } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { UserAuthMenu } from "../SiteHeader";
import GlobalSearchModal from "../GlobalSearchModal";
import ravanLogo from "../../../assets/ravan_logo.svg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HeroSearchSection() {
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Command+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { label: t("navHome", "ANA SƏHİFƏ"), target: "/" },
    { label: t("navBlog", "BLOQ"), target: "/blog" },
    { label: t("navResources", "RESURSLAR"), target: "/resources" },
    { label: t("navAbout", "HAQQINDA"), target: "/about" },
    { label: t("navContact", "ƏLAQƏ"), target: "/contact" },
  ];

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[88vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-background text-foreground select-none">
      
      {/* ── Layer 0: Background Cinematic Portrait Image (Responsive Art-Direction) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-full w-full lg:left-auto lg:right-0 lg:w-[65%] xl:w-[60%] overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Light Mode Picture */}
        <picture className="block dark:hidden h-full w-full">
          {/* Mobile Light (< 768px) */}
          <source media="(max-width: 767px)" srcSet="/images/hero_light_mobile.jpg" />
          {/* Desktop / Tablet Light (>= 768px) */}
          <source media="(min-width: 768px)" srcSet="/images/hero_light.jpg" />
          <img
            src="/images/hero_light.jpg"
            alt="Rvan.me Editorial Vision"
            width={2752}
            height={1536}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-right sm:object-center lg:object-right select-none"
          />
        </picture>

        {/* Dark Mode Picture */}
        <picture className="hidden dark:block h-full w-full">
          {/* Mobile Dark (< 768px) */}
          <source media="(max-width: 767px)" srcSet="/images/hero_dark_mobile.jpg" />
          {/* Desktop / Tablet Dark (>= 768px) */}
          <source media="(min-width: 768px)" srcSet="/images/hero-dark.jpg" />
          <img
            src="/images/hero-dark.jpg"
            alt="Rvan.me Editorial Vision"
            width={2752}
            height={1536}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-right sm:object-center lg:object-right select-none"
          />
        </picture>

        {/* Desktop-only subtle left gradient blend into canvas */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-36 sm:w-56 lg:w-80 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none" />
      </div>

      {/* ── Layer 1: Floating Frosted Glass Navbar (Compact 52px-54px) ── */}
      <div className="relative z-30 w-full max-w-[1400px] mx-auto pt-3 sm:pt-5 px-4 sm:px-8">
        <div className="flex items-center justify-between w-full h-[48px] sm:h-[54px] px-3 sm:px-4 rounded-full bg-white/75 dark:bg-black/35 border border-black/10 dark:border-white/12 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all">
          {/* Logo & Brand */}
          <Link
            to={getLocalizedPath("/")}
            className="flex items-center gap-2 rounded-full px-1.5 py-0.5 text-left focus-visible:outline-none shrink-0 group select-none"
          >
            <img
              src={ravanLogo}
              alt="Rvan.me Logo"
              width={24}
              height={24}
              className="h-5.5 w-5.5 sm:h-6 sm:w-6 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden sm:inline-block text-xs font-bold tracking-[.16em] uppercase text-foreground leading-none">
              RVAN.ME
            </span>
          </Link>

          {/* Floating Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 text-[11px] font-bold tracking-[.08em] mono uppercase">
            {navItems.map((item, idx) => {
              const localizedTarget = getLocalizedPath(item.target);
              const isActive = idx === 0;

              return (
                <Link
                  key={item.target}
                  to={localizedTarget}
                  className={`relative px-3 py-1 transition-all duration-200 rounded-full select-none ${
                    isActive
                      ? "text-foreground dark:text-white font-bold bg-gradient-to-r from-[#61c5ad]/20 via-[#426fba]/20 to-[#984f9f]/20 border border-[#61c5ad]/30 shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Group: User/Profile Control Only */}
          <div className="flex items-center gap-2 shrink-0">
            <UserAuthMenu />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="grid h-7 w-7 place-items-center rounded-full border border-border/80 bg-card/60 dark:bg-white/[0.04] md:hidden text-foreground hover:border-primary transition-colors shrink-0"
            >
              {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Layer 2: Left Editorial Content (Disciplined Minimal Typography, Strictly Left-Bounded) ── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 xs:px-5 sm:px-8 my-auto py-6 xs:py-8 sm:py-12 lg:py-16 text-left">
        <div className="max-w-[48%] xs:max-w-[50%] sm:max-w-md lg:max-w-lg xl:max-w-xl space-y-3 xs:space-y-3.5 sm:space-y-5 lg:space-y-6">
          
          {/* Refined Minimal Editorial Headline */}
          <motion.h1
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.05}
            className="text-[22px] xs:text-[25px] sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] font-black tracking-tight leading-[1.0] lg:leading-[0.98] text-foreground uppercase"
          >
            {isAz ? (
              <>
                DİZAYN.<br />
                STRATEGİYA.<br />
                <span className="bg-gradient-to-r from-[#61c5ad] via-[#6099df] to-[#bc66c5] bg-clip-text text-transparent">
                  FİKİRLƏR.
                </span>
              </>
            ) : (
              <>
                DESIGN.<br />
                STRATEGY.<br />
                <span className="bg-gradient-to-r from-[#61c5ad] via-[#6099df] to-[#bc66c5] bg-clip-text text-transparent">
                  IDEAS.
                </span>
              </>
            )}
          </motion.h1>

          {/* Minimal Supporting Description — Strictly bounded on left, naturally multi-line */}
          <motion.p
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.12}
            className="text-[10.5px] xs:text-[11.5px] sm:text-xs md:text-sm lg:text-[15px] text-muted-foreground font-normal leading-[1.55] max-w-[185px] xs:max-w-[210px] sm:max-w-sm lg:max-w-md"
          >
            {isAz
              ? "Dizayn, marketinq, brendinq, süni intellekt və vizual mədəniyyət haqqında yaradıcı nəşr və bilik ekosistemi."
              : "A creative publication and knowledge ecosystem exploring design, marketing, branding, AI, and visual culture."}
          </motion.p>

          {/* Minimal CTA Buttons — Compact & Clean */}
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.18}
            className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-2.5 sm:gap-3.5 pt-0.5 sm:pt-1"
          >
            <Link
              to={getLocalizedPath("/blog")}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 xs:px-4 xs:py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] text-white font-bold text-[10px] xs:text-[11px] sm:text-xs tracking-wider shadow-[0_4px_16px_rgba(97,197,173,0.25)] hover:opacity-95 active:scale-95 transition-all mono select-none shrink-0 w-fit"
            >
              <span>{isAz ? "MƏQALƏLƏRİ KƏŞF ET" : "EXPLORE ARTICLES"}</span>
              <ArrowRight size={13} className="shrink-0" />
            </Link>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 xs:px-3.5 xs:py-2 sm:px-5 sm:py-2.5 rounded-full border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl text-foreground font-semibold text-[10px] xs:text-[11px] sm:text-xs hover:bg-white/80 dark:hover:bg-white/[0.12] active:scale-95 transition-all mono cursor-pointer select-none shrink-0 w-fit"
            >
              <Search size={12} className="text-primary shrink-0" />
              <span>{isAz ? "İDEYA AXTAR" : "SEARCH IDEAS"}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-black/5 dark:bg-white/10 text-muted-foreground border border-black/5 dark:border-white/10">
                ⌘K
              </kbd>
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile Slide-Over Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
            className="fixed inset-0 z-50 flex flex-col justify-center bg-background/98 backdrop-blur-md px-8 pt-20 md:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-foreground"
            >
              <X size={24} />
            </button>
            <nav className="space-y-2">
              {navItems.map((item, i) => {
                const localizedTarget = getLocalizedPath(item.target);
                return (
                  <div key={item.label} className="border-b border-border">
                    <Link
                      to={localizedTarget}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-baseline gap-4 py-4 text-left text-2xl font-bold uppercase tracking-tight text-foreground hover:text-primary"
                    >
                      <span className="mono text-xs text-muted-foreground">0{i + 1}</span>
                      {item.label}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Global Search Command Modal ── */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </section>
  );
}
