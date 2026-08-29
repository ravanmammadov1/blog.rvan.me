import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import GlobalSearchModal from "../GlobalSearchModal";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 sm:pb-12">
      {/* ── Main Rounded Cinematic Hero Container ── */}
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] xl:min-h-[720px] rounded-3xl lg:rounded-[36px] bg-[#0c0d12] dark:bg-[#07080a] text-white border border-black/[0.08] dark:border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        
        {/* ── Cinematic Right-Anchored Hero Image (Theme-Aware) ── */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-0 h-full w-full lg:w-[60%] xl:w-[58%] select-none overflow-hidden"
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
              className="h-full w-full object-cover object-center lg:object-right transition-opacity duration-700 opacity-30 md:opacity-50 lg:opacity-100"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.9) 35%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.9) 35%, black 100%)",
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
              className="h-full w-full object-cover object-center lg:object-right transition-opacity duration-700 opacity-40 md:opacity-60 lg:opacity-100"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.9) 35%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.9) 35%, black 100%)",
              }}
            />
          </picture>

          {/* Edge Blend Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#0c0d12] dark:from-[#07080a] via-[#0c0d12]/80 dark:via-[#07080a]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0c0d12] dark:from-[#07080a] via-[#0c0d12]/50 dark:via-[#07080a]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0c0d12]/80 dark:from-[#07080a]/80 to-transparent pointer-events-none" />
        </div>

        {/* ── Left Editorial Content Area ── */}
        <div className="relative z-10 max-w-xl xl:max-w-2xl text-left space-y-6 sm:space-y-7 my-auto pt-4 sm:pt-6">
          {/* Eyebrow Pill */}
          <motion.div variants={fadeUp} initial={false} animate="visible" custom={0}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/12 bg-white/[0.06] backdrop-blur-md text-[11px] sm:text-xs font-mono font-bold tracking-wider text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>
                {isAz
                  ? "YARADICI NƏŞR · BİLİK · MƏDƏNİYYƏT"
                  : "CREATIVE PUBLICATION · KNOWLEDGE · CULTURE"}
              </span>
            </div>
          </motion.div>

          {/* Dominant Headline */}
          <motion.h1
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.1}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-extrabold tracking-tight leading-[1.03] text-white"
          >
            {isAz ? (
              <>
                Dizayn. Strategiya.<br />
                <span className="bg-gradient-to-r from-[#61c5ad] via-[#6099df] to-[#bc66c5] bg-clip-text text-transparent">
                  Fikirlər.
                </span>
              </>
            ) : (
              <>
                Design. Strategy.<br />
                <span className="bg-gradient-to-r from-[#61c5ad] via-[#6099df] to-[#bc66c5] bg-clip-text text-transparent">
                  Ideas.
                </span>
              </>
            )}
          </motion.h1>

          {/* Short Supporting Description */}
          <motion.p
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.15}
            className="text-base sm:text-lg text-neutral-300/85 font-normal max-w-md lg:max-w-lg leading-relaxed"
          >
            {isAz
              ? "Dizayn, marketinq, brendinq, süni intellekt və vizual mədəniyyət haqqında yaradıcı nəşr və bilik ekosistemi."
              : "A creative publication and knowledge ecosystem exploring design, marketing, branding, AI, and visual culture."}
          </motion.p>

          {/* Actions: Primary CTA + Frosted Search Trigger */}
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.2}
            className="flex flex-wrap items-center gap-3.5 pt-1"
          >
            {/* Primary Action Button (Brand Gradient) */}
            <Link
              to={getLocalizedPath("/blog")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_8px_24px_rgba(97,197,173,0.28)] hover:opacity-95 active:scale-95 transition-all mono select-none"
            >
              <span>{isAz ? "MƏQALƏLƏRİ KƏŞF ET" : "EXPLORE ARTICLES"}</span>
              <ArrowRight size={15} />
            </Link>

            {/* Secondary Action: Sleek Frosted Glass Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/12 bg-white/[0.06] backdrop-blur-xl text-white font-semibold text-xs sm:text-sm hover:bg-white/[0.12] active:scale-95 transition-all mono cursor-pointer select-none"
            >
              <Search size={15} className="text-primary" />
              <span>{isAz ? "İdeya Axtar" : "Search Ideas"}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-neutral-300 border border-white/10">
                ⌘K
              </kbd>
            </button>
          </motion.div>
        </div>

        {/* ── Bottom Floating Signature Glassmorphic Proof Card (Strict Reference Match) ── */}
        <motion.div
          variants={fadeUp}
          initial={false}
          animate="visible"
          custom={0.25}
          className="relative z-10 w-full max-w-3xl mt-10 lg:mt-14 rounded-2xl border border-white/12 bg-[#121318]/75 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 gap-3.5 sm:gap-0">
            {/* Column 1 */}
            <div className="sm:px-4 first:sm:pl-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white mb-1.5">
                <span className="text-primary font-bold">┌</span>
                <span>39 {isAz ? "Tədqiqat Məqaləsi" : "Research Articles"}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-snug">
                {isAz
                  ? "Dizayn sistemləri, UX və koqnitiv psixologiya üzrə dərin elmi təhlillər."
                  : "In-depth research on design systems, UX & cognitive psychology."}
              </p>
            </div>

            {/* Column 2 */}
            <div className="pt-3 sm:pt-0 sm:px-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white mb-1.5">
                <span className="text-primary font-bold">┌</span>
                <span>2,000+ {isAz ? "Açıq Şrift" : "Curated Fonts"}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-snug">
                {isAz
                  ? "Seçilmiş variativ və açıq mənbəli tipoqrafiya arxivi və CSS kodları."
                  : "Curated open-source variable typography catalog and specimen tools."}
              </p>
            </div>

            {/* Column 3 */}
            <div className="pt-3 sm:pt-0 sm:px-4 last:sm:pr-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white mb-1.5">
                <span className="text-primary font-bold">┌</span>
                <span>1,400+ {isAz ? "Vektor İkon" : "Vector Icons"}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-snug">
                {isAz
                  ? "Müasir interfeys və rəqəmsal məhsullar üçün təmiz SVG kitabxanası."
                  : "High-precision SVG vector library for modern interface applications."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Global Search Command Modal ── */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </section>
  );
}
