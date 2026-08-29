import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Menu, X, CornerDownLeft, FileText, Type, Sparkles } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { UserAuthMenu } from "../SiteHeader";
import { MASTER_EDITORIAL_BLOGS } from "../../../lib/editorialBlogRegistry";
import { trackSearchDiscovery } from "../../../lib/analytics/events";
import ravanLogo from "../../../assets/ravan_logo.svg";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  type: "ARTICLE" | "RESOURCE";
  path: string;
  icon: React.ReactNode;
}

export default function HeroSearchSection() {
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const navigate = useNavigate();

  // In-place Search States
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search Corpus
  const searchCorpus: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];

    // Master Editorial Articles
    MASTER_EDITORIAL_BLOGS.forEach((blog) => {
      const slugStr = typeof blog.slug === "string" ? blog.slug : blog.slug?.current || blog._id;
      items.push({
        id: `blog-${slugStr}`,
        title: isAz && blog.title_az ? blog.title_az : blog.title,
        subtitle: isAz && blog.excerpt_az ? blog.excerpt_az : blog.excerpt || "",
        type: "ARTICLE",
        path: `/blog/${slugStr}`,
        icon: <FileText size={14} className="text-primary shrink-0" />,
      });
    });

    // Core Platform Resources
    items.push({
      id: "res-fonts",
      title: isAz ? "Google Şriftləri Kataloqu (2,000+ Şrift)" : "Google Fonts Directory",
      subtitle: isAz ? "Açıq mənbəli şriftlər və tipoqrafiya arxitekturası" : "Curated open-source Google font catalog",
      type: "RESOURCE",
      path: "/resources?category=fonts",
      icon: <Type size={14} className="text-primary shrink-0" />,
    });
    items.push({
      id: "res-icons",
      title: isAz ? "Vektor İkon Kolleksiyası" : "Lucide Vector Icon Library",
      subtitle: isAz ? "UI/UX dizayn üçün minlərlə təmiz SVG ikon" : "Clean SVG icons for modern interfaces",
      type: "RESOURCE",
      path: "/resources?category=icons",
      icon: <Sparkles size={14} className="text-primary shrink-0" />,
    });

    return items;
  }, [isAz]);

  // Filtered Live Suggestions
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchCorpus.slice(0, 4);
    }
    const q = searchQuery.toLowerCase().trim();
    return searchCorpus
      .filter((item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q))
      .slice(0, 5);
  }, [searchQuery, searchCorpus]);

  // Global Command+K / Ctrl+K keyboard shortcut focuses in-place search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearching(true);
        setTimeout(() => searchInputRef.current?.focus(), 20);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to collapse search if empty
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        if (!searchQuery.trim()) {
          setIsSearching(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (filteredResults.length > 0 && selectedIndex >= 0 && selectedIndex < filteredResults.length) {
      const selected = filteredResults[selectedIndex];
      trackSearchDiscovery("result_selected", { targetPath: selected.path, resultType: selected.type });
      navigate(getLocalizedPath(selected.path));
      setIsSearching(false);
    } else if (searchQuery.trim()) {
      trackSearchDiscovery("search_opened", { hasQuery: true, queryLength: searchQuery.trim().length });
      navigate(getLocalizedPath(`/blog?q=${encodeURIComponent(searchQuery.trim())}`));
      setIsSearching(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsSearching(false);
      setSearchQuery("");
      searchInputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

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
        className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Centered Desktop Frame wrapper to bring portrait and text closer */}
        <div className="relative w-full h-full max-w-[1320px] mx-auto">
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

          {/* Desktop-only subtle left blend within container */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-32 xl:w-48 bg-gradient-to-r from-background via-background/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ── Layer 1: Floating Frosted Glass Navbar (Compact 52px-54px) ── */}
      <div className="relative z-30 w-full max-w-[1240px] xl:max-w-[1280px] mx-auto pt-3 sm:pt-5 px-4 sm:px-6">
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

      {/* ── Layer 2: Left Editorial Content (Centered Container, Closer Composition) ── */}
      <div className="relative z-10 w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 xs:px-6 sm:px-8 my-auto py-6 xs:py-8 sm:py-12 lg:py-16 text-left">
        <div className="max-w-[48%] xs:max-w-[50%] sm:max-w-[420px] lg:max-w-[460px] space-y-3 xs:space-y-3.5 sm:space-y-5 lg:space-y-6">
          
          {/* Refined Minimal Editorial Headline */}
          <motion.h1
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.05}
            className="text-[22px] xs:text-[25px] sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] font-black tracking-tight leading-[1.0] lg:leading-[0.98] text-foreground uppercase"
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
            className="text-[10.5px] xs:text-[11.5px] sm:text-xs md:text-sm lg:text-[14.5px] text-muted-foreground font-normal leading-[1.55] max-w-[185px] xs:max-w-[210px] sm:max-w-sm lg:max-w-md"
          >
            {isAz
              ? "Dizayn, marketinq, brendinq, süni intellekt və vizual mədəniyyət haqqında yaradıcı nəşr və bilik ekosistemi."
              : "A creative publication and knowledge ecosystem exploring design, marketing, branding, AI, and visual culture."}
          </motion.p>

          {/* CTA Group: [1. İDEYA AXTAR (In-place interactive search)] [2. MƏQALƏLƏRİ KƏŞF ET] */}
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.18}
            className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-2.5 sm:gap-3.5 pt-0.5 sm:pt-1"
          >
            {/* Primary Interactive Search Box (In-Place Transformation, NO Modal) */}
            <div ref={searchContainerRef} className="relative z-30 shrink-0">
              <div
                onClick={() => {
                  setIsSearching(true);
                  setTimeout(() => searchInputRef.current?.focus(), 20);
                }}
                className={`flex items-center gap-2 rounded-full border transition-all duration-200 ${
                  isSearching
                    ? "w-full xs:w-[220px] sm:w-[260px] md:w-[280px] bg-card/98 dark:bg-[#121418] border-primary ring-2 ring-primary/20 shadow-md px-3 py-1.5 xs:py-2"
                    : "w-auto bg-card/90 dark:bg-[#14161b]/90 border-border hover:border-primary/60 hover:bg-card px-3.5 py-2 xs:px-4 xs:py-2.5 sm:px-5 sm:py-2.5 cursor-pointer shadow-2xs backdrop-blur-xl"
                }`}
              >
                <Search size={13} className={isSearching ? "text-primary shrink-0" : "text-muted-foreground shrink-0"} />

                {isSearching ? (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={isAz ? "İdeya və ya mövzu axtar..." : "Search ideas or topics..."}
                    className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-mono"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-1.5 select-none">
                    <span className="text-[10px] xs:text-[11px] sm:text-xs font-mono font-bold tracking-wider text-foreground">
                      {isAz ? "İDEYA AXTAR" : "SEARCH IDEAS"}
                    </span>
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-black/5 dark:bg-white/10 text-muted-foreground border border-black/5 dark:border-white/10">
                      ⌘K
                    </kbd>
                  </div>
                )}

                {isSearching && searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* In-Place Live Results Dropdown (Directly Below the Search Control) */}
              <AnimatePresence>
                {isSearching && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } }}
                    exit={{ opacity: 0, y: 4, scale: 0.98, transition: { duration: 0.12 } }}
                    className="absolute top-full left-0 mt-2 z-50 w-[260px] xs:w-[290px] sm:w-[340px] md:w-[380px] rounded-2xl border border-border/90 bg-card/98 dark:bg-[#101115]/98 backdrop-blur-2xl shadow-2xl p-1.5 space-y-1 overflow-hidden"
                  >
                    <div className="px-2.5 py-1 text-[9.5px] font-mono font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center justify-between border-b border-border/40 pb-1">
                      <span>{isAz ? "NƏTİCƏLƏR" : "RESULTS"}</span>
                      <span>{isAz ? "Enter = Seç" : "Enter = Select"}</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto scrollbar-thin py-0.5">
                      {filteredResults.length === 0 ? (
                        <div className="py-4 text-center text-xs text-muted-foreground font-mono">
                          {isAz ? "Uyğun nəticə tapılmadı" : "No results found"}
                        </div>
                      ) : (
                        filteredResults.map((item, idx) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              trackSearchDiscovery("result_selected", { targetPath: item.path, resultType: item.type });
                              navigate(getLocalizedPath(item.path));
                              setIsSearching(false);
                            }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-colors ${
                              selectedIndex === idx
                                ? "bg-primary/10 text-foreground"
                                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">{item.icon}</div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold leading-snug truncate text-foreground">
                                {item.title}
                              </h4>
                              {item.subtitle && (
                                <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            {selectedIndex === idx && (
                              <CornerDownLeft size={12} className="text-primary mt-1 shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        className="w-full text-center py-1.5 text-[10.5px] font-mono font-bold text-primary hover:underline border-t border-border/40 pt-1.5 cursor-pointer block truncate"
                      >
                        {isAz ? `"${searchQuery}" üzrə bütün məqalələrdə axtar →` : `Search all for "${searchQuery}" →`}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Secondary Article Action */}
            <Link
              to={getLocalizedPath("/blog")}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 xs:px-4 xs:py-2.5 sm:px-5 sm:py-2.5 rounded-full border border-border/80 bg-background/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground text-[10px] xs:text-[11px] sm:text-xs font-mono font-bold tracking-wider transition-all select-none shrink-0 w-fit"
            >
              <span>{isAz ? "MƏQALƏLƏRİ KƏŞF ET" : "EXPLORE ARTICLES"}</span>
              <ArrowRight size={12} className="shrink-0" />
            </Link>
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
    </section>
  );
}
