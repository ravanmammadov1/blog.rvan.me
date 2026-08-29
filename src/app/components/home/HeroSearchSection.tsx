import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Menu, X, Sparkles } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { UserAuthMenu } from "../SiteHeader";
import GlobalSearchModal from "../GlobalSearchModal";
import ravanLogo from "../../../assets/ravan_logo.svg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
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
    <section className="relative w-full p-2.5 sm:p-4 md:p-6 lg:p-7 max-w-[1536px] mx-auto">
      {/* ── Single Large Framed Hero Canvas (Strict Reference Match) ── */}
      <div className="relative min-h-[92vh] lg:h-[calc(100vh-3.5rem)] lg:min-h-[680px] lg:max-h-[960px] w-full rounded-3xl lg:rounded-[36px] bg-[#0c0d12] dark:bg-[#07080a] text-white border border-black/10 dark:border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col justify-between p-5 sm:p-8 lg:p-10 select-none">
        
        {/* ── Layer 0: Background Cinematic Portrait Image (Dominant, Person Clearly Visible) ── */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-0 h-full w-full lg:w-[65%] xl:w-[60%] overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* Light Theme Image */}
          <picture className="block dark:hidden h-full w-full">
            <source type="image/webp" srcSet="/images/hero-light.webp" />
            <img
              src="/images/hero-light.jpg"
              alt="Rvan.me Editorial Vision"
              width={2752}
              height={1536}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-center lg:object-right select-none opacity-40 md:opacity-75 lg:opacity-100"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.92) 34%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.92) 34%, black 100%)",
              }}
            />
          </picture>

          {/* Dark Theme Image */}
          <picture className="hidden dark:block h-full w-full">
            <source type="image/webp" srcSet="/images/hero-dark.webp" />
            <img
              src="/images/hero-dark.jpg"
              alt="Rvan.me Editorial Vision"
              width={2752}
              height={1536}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-center lg:object-right select-none opacity-50 md:opacity-85 lg:opacity-100"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.92) 34%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.92) 34%, black 100%)",
              }}
            />
          </picture>

          {/* Subtle Left Vignette Fade ONLY on the left text area, NO darkening over face */}
          <div className="absolute inset-y-0 left-0 w-36 sm:w-56 lg:w-80 bg-gradient-to-r from-[#0c0d12] dark:from-[#07080a] via-[#0c0d12]/70 dark:via-[#07080a]/70 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0c0d12]/60 dark:from-[#07080a]/60 to-transparent pointer-events-none" />
        </div>

        {/* ── Layer 1: Floating Frosted Glass Navbar (At the top of the scene) ── */}
        <div className="relative z-30 flex items-center justify-between w-full">
          {/* Brand Logo */}
          <Link
            to={getLocalizedPath("/")}
            className="flex items-center gap-2.5 rounded-full px-2 py-1 text-left focus-visible:outline-none shrink-0 group select-none"
          >
            <img
              src={ravanLogo}
              alt="Rvan.me Logo"
              width={30}
              height={30}
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden sm:inline-block text-xs sm:text-sm font-bold tracking-[.18em] uppercase text-white leading-none">
              RVAN.ME
            </span>
          </Link>

          {/* Floating Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/40 border border-white/15 backdrop-blur-2xl text-[11px] sm:text-xs font-bold tracking-[.1em] mono uppercase shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
            {navItems.map((item, idx) => {
              const localizedTarget = getLocalizedPath(item.target);
              const isActive = idx === 0; // Home is active on hero

              return (
                <Link
                  key={item.target}
                  to={localizedTarget}
                  className={`relative px-3.5 py-1.5 transition-all duration-200 rounded-full select-none ${
                    isActive
                      ? "text-white font-bold bg-gradient-to-r from-[#61c5ad]/25 via-[#426fba]/25 to-[#984f9f]/25 border border-[#61c5ad]/40 shadow-xs"
                      : "text-neutral-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to={getLocalizedPath("/contact")}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold mono uppercase tracking-wider text-white bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] hover:opacity-95 shadow-xs transition-all active:scale-95 select-none"
            >
              <span>{isAz ? "ƏLAQƏ SAXLAYIN" : "GET IN TOUCH"}</span>
              <Sparkles size={12} />
            </Link>

            <UserAuthMenu />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/10 md:hidden text-white hover:border-[#61c5ad] transition-colors shrink-0"
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        {/* ── Layer 2: Left Editorial Content (Vertically in middle-left) ── */}
        <div className="relative z-10 max-w-xl xl:max-w-2xl text-left space-y-4 sm:space-y-5 lg:space-y-6 my-auto pt-4 sm:pt-6">
          {/* Eyebrow */}
          <motion.div variants={fadeUp} initial={false} animate="visible" custom={0}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/10 dark:bg-white/[0.06] backdrop-blur-xl text-[11px] sm:text-xs font-mono font-bold tracking-wider text-neutral-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#61c5ad] animate-pulse" />
              <span>
                {isAz
                  ? "YARADICI NƏŞR · BİLİK · MƏDƏNİYYƏT"
                  : "CREATIVE PUBLICATION · KNOWLEDGE · CULTURE"}
              </span>
            </div>
          </motion.div>

          {/* Dominant Editorial 3-Line Headline */}
          <motion.h1
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.1}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.02] text-white"
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

          {/* Description */}
          <motion.p
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.15}
            className="text-sm sm:text-base lg:text-lg text-neutral-300 font-normal max-w-md lg:max-w-lg leading-relaxed"
          >
            {isAz
              ? "Dizayn, marketinq, brendinq, süni intellekt və vizual mədəniyyət haqqında yaradıcı nəşr və bilik ekosistemi."
              : "A creative publication and knowledge ecosystem exploring design, marketing, branding, AI, and visual culture."}
          </motion.p>

          {/* CTA Group: Primary Pill + Frosted Search */}
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.2}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <Link
              to={getLocalizedPath("/blog")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_8px_24px_rgba(97,197,173,0.28)] hover:opacity-95 active:scale-95 transition-all mono select-none"
            >
              <span>{isAz ? "MƏQALƏLƏRİ KƏŞF ET" : "EXPLORE ARTICLES"}</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/15 bg-white/10 dark:bg-white/[0.06] backdrop-blur-xl text-white font-semibold text-xs sm:text-sm hover:bg-white/15 active:scale-95 transition-all mono cursor-pointer select-none"
            >
              <Search size={15} className="text-[#61c5ad]" />
              <span>{isAz ? "İdeya Axtar" : "Search Ideas"}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/15 text-neutral-200 border border-white/10">
                ⌘K
              </kbd>
            </button>
          </motion.div>
        </div>

        {/* ── Layer 3: Bottom Horizontal Frosted Glass Information Panel ── */}
        <motion.div
          variants={fadeUp}
          initial={false}
          animate="visible"
          custom={0.25}
          className="relative z-10 w-full max-w-3xl xl:max-w-4xl mt-6 lg:mt-0 rounded-2xl border border-white/15 bg-white/10 dark:bg-black/40 backdrop-blur-2xl p-3.5 sm:p-4 lg:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/15 gap-3 sm:gap-0">
            {/* Col 1 */}
            <div className="sm:px-4 first:sm:pl-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white mb-1">
                <span className="text-[#61c5ad] font-bold">┌</span>
                <span>39 {isAz ? "Tədqiqat Məqaləsi" : "Research Articles"}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-300/90 leading-snug">
                {isAz
                  ? "Dizayn sistemləri, UX və koqnitiv psixologiya üzrə dərin elmi təhlillər."
                  : "In-depth research on design systems, UX & cognitive psychology."}
              </p>
            </div>

            {/* Col 2 */}
            <div className="pt-2 sm:pt-0 sm:px-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white mb-1">
                <span className="text-[#61c5ad] font-bold">┌</span>
                <span>2,000+ {isAz ? "Açıq Şrift" : "Curated Fonts"}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-300/90 leading-snug">
                {isAz
                  ? "Seçilmiş variativ və açıq mənbəli tipoqrafiya arxivi və CSS kodları."
                  : "Curated open-source variable typography catalog and specimen tools."}
              </p>
            </div>

            {/* Col 3 */}
            <div className="pt-2 sm:pt-0 sm:px-4 last:sm:pr-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white mb-1">
                <span className="text-[#61c5ad] font-bold">┌</span>
                <span>1,400+ {isAz ? "Vektor İkon" : "Vector Icons"}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-300/90 leading-snug">
                {isAz
                  ? "Müasir interfeys və rəqəmsal məhsullar üçün təmiz SVG kitabxanası."
                  : "High-precision SVG vector library for modern interface applications."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Mobile Slide-Over Menu (Inside Hero) ── */}
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
