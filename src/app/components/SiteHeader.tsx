import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, LogOut, User as UserIcon, ChevronDown, Sun, Moon } from "lucide-react";
import { urlFor } from "../../lib/sanityClient";
import { SiteSettings } from "../../types/cms";
import { useAuth } from "../../hooks/useAuth";
import AuthModal from "./AuthModal";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const EASE = "easeInOut";

function UserAuthMenu() {
  const { user, loading, signOut, userPhoto } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, getLocalizedPath, language, switchLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  if (loading) {
    return <div className="h-[38px] w-24 rounded-full bg-white/5 border border-white/10 animate-pulse shrink-0 self-center" />;
  }

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U";

  return (
    <div ref={menuRef} className="relative inline-block text-left shrink-0 self-center user-auth-menu">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex h-[38px] items-center gap-2.5 rounded-full border border-white/20 bg-white/5 pl-1.5 pr-3 text-[10.5px] font-medium transition-all duration-300 hover:border-primary/50 glass-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground shrink-0 select-none self-center"
      >
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={user?.displayName || "User"}
            className="h-6 w-6 rounded-full object-cover border border-white/20 shrink-0"
          />
        ) : user ? (
          <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-black font-bold text-xs shrink-0">
            {userInitial}
          </span>
        ) : (
          <span className="grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-white/10 text-primary shrink-0">
            <UserIcon size={13} />
          </span>
        )}
        <span className="hidden sm:inline font-mono tracking-wider truncate max-w-[120px] text-foreground">
          {user ? (user.displayName || user.email?.split("@")[0]) : t("profile", "PROFILE")}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ${dropdownOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-white/15 bg-[#09090b]/95 p-4 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 pointer-events-auto"
          >
            {/* 1. PROFILE SECTION */}
            <div className="pb-3.5 border-b border-white/10">
              <div className="text-[9.5px] font-bold uppercase tracking-[.18em] text-primary mono mb-2.5">
                PROFILE
              </div>
              <div className="flex items-center gap-3 mb-3">
                {userPhoto ? (
                  <img src={userPhoto} alt={user?.displayName || "User"} className="h-9 w-9 rounded-full object-cover border border-white/20 shrink-0" />
                ) : user ? (
                  <div className="h-9 w-9 rounded-full bg-primary text-black font-bold flex items-center justify-center text-sm shrink-0">
                    {userInitial}
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-primary shrink-0">
                    <UserIcon size={16} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {user ? (user.displayName || "User") : "Ravan Mammadov"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate mono mt-0.5">
                    {user ? user.email : "mammadovravan1@gmail.com"}
                  </p>
                </div>
              </div>

              <Link
                to={getLocalizedPath("/profile")}
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs font-medium text-foreground hover:bg-white/10 hover:border-primary/50 transition-all text-left mono"
              >
                <span className="flex items-center gap-2">
                  <UserIcon size={14} className="text-primary" /> {t("viewProfile", "View Profile")}
                </span>
                <ArrowUpRight size={13} className="text-muted-foreground" />
              </Link>
            </div>

            {/* 2. PREFERENCES SECTION */}
            <div className="py-3.5 border-b border-white/10 space-y-3.5">
              <div className="text-[9.5px] font-bold uppercase tracking-[.18em] text-primary mono">
                PREFERENCES
              </div>

              {/* Appearance: Dark / Light */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono mb-1.5">
                  <span>Appearance</span>
                  <span className="text-[10px] text-primary font-bold uppercase mono">{theme}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      theme === "dark"
                        ? "bg-primary text-black shadow-sm"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <Moon size={13} /> Dark
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      theme === "light"
                        ? "bg-primary text-black shadow-sm"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <Sun size={13} /> Light
                  </button>
                </div>
              </div>

              {/* Language: English / Azərbaycan dili */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono mb-1.5">
                  <span>Language</span>
                  <span className="text-[10px] text-primary font-bold uppercase mono">{language === "az" ? "AZ" : "EN"}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    onClick={() => switchLanguage("en")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      language === "en"
                        ? "bg-primary text-black shadow-sm"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLanguage("az")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      language === "az"
                        ? "bg-primary text-black shadow-sm"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Azərbaycan
                  </button>
                </div>
              </div>
            </div>

            {/* 3. ACCOUNT SECTION */}
            <div className="pt-3.5">
              <div className="text-[9.5px] font-bold uppercase tracking-[.18em] text-primary mono mb-2">
                ACCOUNT
              </div>
              {user ? (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left mono"
                >
                  <LogOut size={14} /> {t("signOut", "Sign out")}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-3 py-2.5 text-xs font-bold text-primary uppercase tracking-wider mono hover:bg-primary hover:text-black transition-all"
                >
                  {t("signIn", "SIGN IN WITH GOOGLE")}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

interface SiteHeaderProps {
  siteSettings?: SiteSettings | null;
}

export default function SiteHeader({ siteSettings }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, getLocalizedPath } = useLanguage();

  const isHomePage = location.pathname === "/" || location.pathname === "/az";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const baseNavItems = [
    { label: t("navHome", "HOME"),      target: "/" },
    { label: t("navResources", "RESOURCES"), target: "/resources" },
    { label: t("navTools", "TOOLS"),     target: "/tools" },
    { label: t("navBlog", "BLOG"),      target: "/blog" },
    { label: t("navAbout", "ABOUT"),     target: "/about" },
    { label: t("navContact", "CONTACT"),   target: "/contact" },
  ];

  const navItems = baseNavItems.filter((item) => {
    if (item.target === "/") {
      return !isHomePage;
    }
    return true;
  });

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled || !isHomePage
            ? "bg-background/88 backdrop-blur-md border-b border-border/60 shadow-lg shadow-black/20 py-2 md:py-3"
            : "bg-background/10 backdrop-blur-sm border-b border-transparent py-3 md:py-4"
        }`}
      >
        <div className="mx-auto flex h-11 md:h-12 max-w-[1600px] items-center justify-between px-6 md:px-10">
          {/* Logo & Brand */}
          <Link
            to={getLocalizedPath("/")}
            className="group flex items-center gap-3 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background shrink-0 self-center"
            aria-label="Ravan Mammadov Home"
          >
            {siteSettings?.logo ? (
              <img
                src={urlFor(siteSettings.logo)?.url() || ""}
                alt="Ravan Mammadov Logo"
                className="h-9 w-9 md:h-10 md:w-10 rounded-full object-contain border border-white/30 p-1 transition-all duration-300 group-hover:scale-105 group-hover:border-[#61c5ad]/50 shadow-[0_0_12px_rgba(97,197,173,0.18)]"
              />
            ) : (
              <span className="grid h-9 w-9 md:h-10 md:w-10 place-items-center rounded-full border border-white/30 text-sm font-bold transition-all duration-300 group-hover:rotate-45 group-hover:border-[#61c5ad] group-hover:text-[#61c5ad] shadow-[0_0_12px_rgba(97,197,173,0.18)]">
                R
              </span>
            )}
            <span className="hidden text-[10px] font-bold leading-tight tracking-[.16em] sm:block uppercase">
              RVAN.ME
              <br />
              <span className="text-[9px] font-medium text-muted-foreground">{t("studio", "STUDIO")}</span>
            </span>

          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 text-[10.5px] font-medium tracking-[.08em] mono uppercase md:flex shrink-0 self-center">
            {navItems.map((item) => {
              const localizedTarget = getLocalizedPath(item.target);
              const isActive =
                item.target === "/"
                  ? isHomePage
                  : location.pathname === localizedTarget ||
                    location.pathname.startsWith(localizedTarget + "/");

              return (
                <Link
                  key={item.target}
                  to={localizedTarget}
                  className={`relative px-3 py-1.5 transition-colors duration-300 ${
                    isActive
                      ? "text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm`}
                >
                  {/* Clean underline indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
 
          {/* Action Buttons & Authentication */}
          <div className="flex items-center gap-3 shrink-0 self-center">
            {/* Integrated Profile & Preferences Dropdown */}
            <UserAuthMenu />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/30 md:hidden text-foreground hover:border-primary transition-colors glass-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 self-center"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background/96 backdrop-blur-2xl px-8 pt-20 md:hidden"
          >
            {/* Subtle aurora in mobile menu */}
            <div
              className="pointer-events-none absolute top-0 right-0 w-80 h-80 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 10%, rgba(16,185,129,0.25) 0%, rgba(59,130,246,0.12) 50%, transparent 75%)",
                filter: "blur(60px)",
              }}
            />

            <nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-1 relative z-10">
              {navItems.map((item, i) => {
                const localizedTarget = getLocalizedPath(item.target);
                const isActive =
                  item.target === "/"
                    ? isHomePage
                    : location.pathname === localizedTarget ||
                      location.pathname.startsWith(localizedTarget + "/");

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    className="border-b border-border/30"
                  >
                    <Link
                      to={localizedTarget}
                      onClick={() => setMenuOpen(false)}
                      className={`flex w-full items-baseline gap-4 py-4 text-left text-2xl font-semibold uppercase tracking-tight transition-all duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive ? "text-primary" : "text-foreground/80"
                      }`}
                    >
                      <span className="mono text-xs text-muted-foreground/50">0{i + 1}</span>
                      {item.label}
                      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-border/30 flex justify-between items-center text-xs mono text-muted-foreground relative z-10">
              <span>{t("creativePlatform", "CREATIVE PLATFORM & PUBLICATION")}</span>
              <Link
                to={getLocalizedPath("/contact")}
                onClick={() => setMenuOpen(false)}
                className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t("collaborate", "COLLABORATE")} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
