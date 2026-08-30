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
    <section className="relative z-20 w-full aspect-[1080/1920] md:aspect-[1678/937] flex flex-col justify-start md:justify-between bg-background text-foreground select-none">
      
      {/* ── Layer 0: Full-Bleed Background Cinematic Image (Clipped inside Layer 0 only) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden select-none"
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
            width={1678}
            height={937}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-bottom sm:object-[center_top] md:object-top select-none"
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
            width={1678}
            height={937}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-bottom sm:object-[center_top] md:object-top select-none"
          />
        </picture>
      </div>

      {/* ── Layer 1: Compact Floating Liquid Glass Navbar (Hugs Content, Identical to SiteHeader) ── */}
      <div className="relative z-30 w-full pt-3 sm:pt-4 px-4 flex justify-center pointer-events-none select-none">
        <div className="pointer-events-auto w-full md:w-auto inline-flex items-center justify-between md:justify-start gap-2.5 sm:gap-4 md:gap-5 h-[42px] sm:h-[46px] px-3.5 sm:px-4 rounded-full liquid-glass-nav transition-all">
          {/* Logo & Brand */}
          <Link
            to={getLocalizedPath("/")}
            className="flex items-center gap-2 rounded-full px-1 py-0.5 text-left focus-visible:outline-none shrink-0 group select-none relative z-10"
          >
            <img
              src={ravanLogo}
              alt="Rvan.me Logo"
              width={20}
              height={20}
              className="h-4.5 w-4.5 sm:h-5 sm:w-5 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-[11px] sm:text-xs font-bold tracking-[.16em] uppercase text-foreground leading-none">
              RVAN.ME
            </span>
          </Link>

          {/* Desktop Navigation — Links floating directly inside main navbar container */}
          <nav className="hidden md:flex items-center gap-1 text-[10.5px] font-bold tracking-[.06em] mono uppercase shrink-0 relative z-10">
            {navItems.map((item, idx) => {
              const localizedTarget = getLocalizedPath(item.target);
              const isActive = idx === 0;

              return (
                <Link
                  key={item.target}
                  to={localizedTarget}
                  className={`relative px-2.5 py-0.5 transition-all duration-200 rounded-full select-none ${
                    isActive
                      ? "liquid-glass-pill liquid-glass-pill-active font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Group: Hamburger menu first, then profile on mobile */}
          <div className="flex items-center gap-1.5 shrink-0 relative z-10">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="grid h-7 w-7 place-items-center rounded-full border border-border/80 bg-card/60 dark:bg-white/[0.04] md:hidden text-foreground hover:border-primary transition-colors shrink-0 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>

            <UserAuthMenu compact={true} />
          </div>
        </div>
      </div>

      {/* ── Layer 2: Centered Editorial Content on Mobile, Left-Aligned on Desktop ── */}
      <div className="relative z-20 w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-8 pt-7 xs:pt-8 md:pt-12 md:my-auto lg:py-16 text-center md:text-left">
        <div className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] lg:max-w-[490px] xl:max-w-[540px] mx-auto md:mx-0 space-y-3 xs:space-y-3.5 sm:space-y-5 lg:space-y-6 flex flex-col items-center md:items-start">
          
          {/* Centered Minimal Editorial Headline on Mobile */}
          <motion.h1
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.05}
            className="text-[32px] xs:text-[36px] sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-black tracking-tight leading-[0.96] lg:leading-[0.98] text-foreground uppercase text-center md:text-left"
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

          {/* Centered Supporting Description on Mobile (2 Lines) */}
          <motion.p
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.12}
            className="text-[11.5px] xs:text-[12px] sm:text-xs md:text-[13.5px] lg:text-[15.5px] text-muted-foreground font-normal leading-[1.48] sm:leading-[1.55] max-w-[325px] xs:max-w-[350px] sm:max-w-sm lg:max-w-md xl:max-w-lg text-center md:text-left mx-auto md:mx-0"
          >
            {isAz
              ? "Dizayn, marketinq, brendinq, süni intellekt və vizual mədəniyyət haqqında yaradıcı nəşr və bilik ekosistemi."
              : "A creative publication and knowledge ecosystem exploring design, marketing, branding, AI, and visual culture."}
          </motion.p>

          {/* Centered Interactive Actions Group on Mobile */}
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="visible"
            custom={0.18}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2.5 xs:gap-3 sm:gap-3.5 pt-0.5 sm:pt-1 w-full"
          >
            {/* Primary Interactive Search Box */}
            <div ref={searchContainerRef} className="relative z-40 shrink-0 w-[220px] xs:w-[240px] sm:w-auto mx-auto md:mx-0">
              <div
                onClick={() => {
                  setIsSearching(true);
                  searchInputRef.current?.focus();
                }}
                className="relative w-full sm:w-[230px] md:w-[260px] lg:w-[275px] h-[40px] xs:h-[42px] md:h-[44px] px-3.5 md:px-4 rounded-full flex items-center justify-center md:justify-start gap-2.5 md:gap-2.5 cursor-pointer outline-none focus:outline-none focus-visible:outline-none transition-all liquid-glass-pill liquid-glass-pill-active text-foreground"
                style={{ outline: "none", boxShadow: "none" }}
              >
                {/* Full Perimeter Border with Continuously Revolving Gradient and Soft Glow */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible rounded-full z-20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="search-stroke-beam" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#61c5ad" />
                      <stop offset="33%" stopColor="#6099df" />
                      <stop offset="66%" stopColor="#bc66c5" />
                      <stop offset="100%" stopColor="#61c5ad" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        from="0 0.5 0.5"
                        to="360 0.5 0.5"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                    <filter id="search-stroke-glow-soft" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                    </filter>
                  </defs>

                  {/* Soft Ambient Glow Layer — Full Continuous Perimeter */}
                  <rect
                    x="0.75"
                    y="0.75"
                    className="search-pill-border"
                    style={{
                      width: "calc(100% - 1.5px)",
                      height: "calc(100% - 1.5px)",
                    }}
                    stroke="url(#search-stroke-beam)"
                    strokeWidth="3.5"
                    fill="none"
                    opacity={0.55}
                    filter="url(#search-stroke-glow-soft)"
                  />

                  {/* Sharp Core 1.5px Stroke — Full Continuous Perimeter */}
                  <rect
                    x="0.75"
                    y="0.75"
                    className="search-pill-border"
                    style={{
                      width: "calc(100% - 1.5px)",
                      height: "calc(100% - 1.5px)",
                    }}
                    stroke="url(#search-stroke-beam)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>

                <Search size={14} className="w-3.5 h-3.5 md:w-3.5 md:h-3.5 text-primary shrink-0 relative z-10" />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearching(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={
                    isSearching
                      ? (isAz ? "Axtarış..." : "Search...")
                      : (isAz ? "İDEYA AXTAR" : "SEARCH IDEAS")
                  }
                  className={`w-full h-full bg-transparent text-[11.5px] xs:text-xs md:text-[13px] text-foreground border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 font-mono min-w-0 p-0 shadow-none relative z-10 cursor-pointer focus:cursor-text ${
                    isSearching
                      ? "placeholder:text-muted-foreground/60 font-normal"
                      : "placeholder:text-foreground font-bold tracking-wider"
                  }`}
                  style={{ outline: "none", boxShadow: "none", border: "none" }}
                />

                {isSearching && searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer shrink-0 outline-none relative z-10"
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* In-Place Live Results Dropdown (Unconstrained Floating Panel, Never Clipped) */}
              <AnimatePresence>
                {isSearching && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } }}
                    exit={{ opacity: 0, y: 4, scale: 0.98, transition: { duration: 0.12 } }}
                    className="absolute top-full left-0 mt-2 z-50 w-[260px] xs:w-[290px] sm:w-[340px] md:w-[380px] rounded-2xl liquid-glass-card shadow-2xl p-1.5 space-y-1 overflow-hidden"
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
              className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 xs:px-4.5 xs:py-1.5 sm:px-5 sm:py-2.5 md:px-6 w-[180px] xs:w-[190px] sm:w-fit h-[32px] xs:h-[34px] sm:h-[38px] md:h-[44px] rounded-full liquid-glass-pill liquid-glass-pill-active text-foreground text-[9.5px] xs:text-[10px] sm:text-xs md:text-[12.5px] lg:text-sm font-mono font-bold tracking-wider transition-all select-none shrink-0 cursor-pointer mx-auto md:mx-0"
            >
              <span>{isAz ? "MƏQALƏLƏRİ KƏŞF ET" : "EXPLORE ARTICLES"}</span>
              <ArrowRight size={11} className="w-3 h-3 sm:w-3 md:w-3.5 shrink-0" />
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
            className="fixed inset-0 z-50 flex flex-col justify-center bg-background/85 dark:bg-[#07080b]/90 backdrop-blur-[36px] px-8 pt-20 md:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 h-9 w-9 rounded-full liquid-glass-pill flex items-center justify-center text-foreground hover:scale-105 transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
            <nav className="space-y-1 relative z-10">
              {navItems.map((item, i) => {
                const localizedTarget = getLocalizedPath(item.target);
                const isActive = i === 0;
                return (
                  <div key={item.label} className="border-b border-black/[0.08] dark:border-white/[0.08]">
                    <Link
                      to={localizedTarget}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex w-full items-center justify-between py-4 text-left text-xl font-bold uppercase tracking-tight transition-colors ${
                        isActive ? "text-foreground font-black" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="mono text-xs text-[#61c5ad]">0{i + 1}</span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="px-2.5 py-0.5 rounded-full liquid-glass-pill liquid-glass-pill-active text-[10px] font-mono font-bold text-[#61c5ad]">
                          {isAz ? "AKTİV" : "ACTIVE"}
                        </span>
                      )}
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
