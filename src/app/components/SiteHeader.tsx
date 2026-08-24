import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { SiteSettings } from "../../types/cms";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import AuthModal from "./AuthModal";
import GlobalSearchModal from "./GlobalSearchModal";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import ravanLogo from "../../assets/ravan_logo.svg";
import { getContributorStatus, getContributorApplication } from "../../services/contributorService";

function UserAuthMenu() {
  const { user, loading, signOut, userPhoto } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, getLocalizedPath, language, switchLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const isContributor = user?.uid ? getContributorStatus(user.uid) !== "NONE" : false;
  const contributorApp = user?.uid ? getContributorApplication(user.uid) : null;

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
    return <div className="h-7 w-16 rounded-full bg-muted border border-border animate-pulse shrink-0 self-center" />;
  }

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative shrink-0 flex items-center" ref={menuRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 dark:bg-white/[0.04] px-2.5 py-1 text-xs text-foreground transition-all hover:bg-muted/80 dark:hover:bg-white/[0.08] focus:outline-none cursor-pointer select-none shadow-2xs"
        aria-label="User Account Menu"
        aria-expanded={dropdownOpen}
      >
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={user?.displayName || "Profile"}
            className="h-5 w-5 rounded-full object-cover border border-border shrink-0"
          />
        ) : (
          <div className="h-5 w-5 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-[10px] shrink-0">
            {user ? userInitial : <UserIcon size={11} />}
          </div>
        )}
        <span className="hidden sm:inline font-mono tracking-wider truncate max-w-[90px] text-foreground font-semibold text-[11px]">
          {user ? (user.displayName?.split(" ")[0] || user.email?.split("@")[0]) : t("profile", "PROFILE")}
        </span>
        <ChevronDown size={11} className={`transition-transform duration-200 shrink-0 text-muted-foreground ${dropdownOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-border bg-card shadow-2xl z-50 pointer-events-auto text-foreground overflow-hidden"
          >
            {/* Identity / Header area */}
            {!user ? (
              /* Signed Out Header */
              <div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono mb-1">
                      {t("profile", "PROFILE")}
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      {t("guestUser", "Qonaq İstifadəçi")}
                    </div>
                    <div className="text-[11px] text-muted-foreground mono">
                      {t("notSignedIn", "Daxil olunmayıb")}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-bold text-primary uppercase tracking-wider mono hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                  >
                    {t("signInWithGoogle", "GOOGLE İLƏ DAXİL OL")}
                  </button>
                </div>

                {/* QUICK PREFERENCES */}
                <div className="border-t border-border p-3.5 space-y-3 bg-surface/30">
                  {/* Appearance Segmented Control */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                      <span>{language === "az" ? "GÖRÜNÜŞ" : "APPEARANCE"}</span>
                      <span className="text-primary">{theme === "dark" ? (language === "az" ? "Tünd" : "Dark") : (language === "az" ? "Açıq" : "Light")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-card border border-border">
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          theme === "dark"
                            ? "text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        style={
                          theme === "dark"
                            ? { backgroundImage: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)" }
                            : undefined
                        }
                      >
                        <Moon size={12} />
                        <span>{language === "az" ? "Tünd" : "Dark"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          theme === "light"
                            ? "text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        style={
                          theme === "light"
                            ? { backgroundImage: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)" }
                            : undefined
                        }
                      >
                        <Sun size={12} />
                        <span>{language === "az" ? "Açıq" : "Light"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                      <span>{language === "az" ? "DİL" : "LANGUAGE"}</span>
                      <span className="text-primary uppercase">{language}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-card border border-border">
                      <button
                        type="button"
                        onClick={() => switchLanguage("az")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          language === "az"
                            ? "text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        style={
                          language === "az"
                            ? { backgroundImage: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)" }
                            : undefined
                        }
                      >
                        <Globe size={12} />
                        <span>Azərbaycan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => switchLanguage("en")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          language === "en"
                            ? "text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        style={
                          language === "en"
                            ? { backgroundImage: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)" }
                            : undefined
                        }
                      >
                        <Globe size={12} />
                        <span>English</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Signed In Profile View */
              <div>
                <div className="p-4 border-b border-border space-y-3">
                  <div className="flex items-center gap-3">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={user.displayName || "User"}
                        className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/20 text-primary border-2 border-primary/40 flex items-center justify-center font-bold text-sm">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-foreground truncate">
                        {user.displayName || "Creative Contributor"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate mono">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Contributor badge status */}
                  <div className="flex items-center justify-between text-[11px] mono">
                    <span className="text-muted-foreground uppercase">{t("status", "Status")}:</span>
                    {isContributor ? (
                      <span className="text-primary font-bold">● {t("verifiedAuthor", "Təsdiqlənmiş Müəllif")}</span>
                    ) : contributorApp?.status === "PENDING" ? (
                      <span className="text-amber-500 font-bold">● {t("applicationUnderReview", "Baxılmaqdadır")}</span>
                    ) : (
                      <span className="text-muted-foreground">● {t("reader", "Oxucu")}</span>
                    )}
                  </div>
                </div>

                {/* Profile navigation actions */}
                <div className="p-2 border-b border-border space-y-1">
                  <Link
                    to={getLocalizedPath("/profile")}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <UserIcon size={14} className="text-primary" />
                    <span>{t("myAccount", "Mənim Hesabım")}</span>
                  </Link>

                  <Link
                    to={getLocalizedPath("/contributor/dashboard")}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">✍️</span>
                      <span>{t("authorPanel", "Müəllif Paneli")}</span>
                    </div>
                    {isContributor && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary mono bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                        {t("active", "AKTİV")}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Preferences in signed in menu */}
                <div className="p-3 border-b border-border space-y-3 bg-surface/30">
                  {/* Appearance Switch */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase">{language === "az" ? "Görünüş" : "Theme"}</span>
                    <div className="flex items-center gap-1 bg-card p-0.5 rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`p-1.5 rounded-md transition-colors ${theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        title="Dark mode"
                      >
                        <Moon size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`p-1.5 rounded-md transition-colors ${theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        title="Light mode"
                      >
                        <Sun size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Language Switch */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase">{language === "az" ? "Dil" : "Lang"}</span>
                    <div className="flex items-center gap-1 bg-card p-0.5 rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() => switchLanguage("az")}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors ${language === "az" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        AZ
                      </button>
                      <button
                        type="button"
                        onClick={() => switchLanguage("en")}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sign Out */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors text-left mono uppercase tracking-wider cursor-pointer"
                  >
                    <LogOut size={14} /> {t("signOut", "SIGN OUT")}
                  </button>
                </div>
              </div>
            )}
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState("");
  const location = useLocation();
  const { t, getLocalizedPath } = useLanguage();

  // Passive, performance-optimized scroll-aware threshold listener (60px)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 60;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut & open-search event handlers
  useEffect(() => {
    const handleGlobalKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchInitialQuery("");
        setSearchOpen((prev) => !prev);
      }
    };
    const handleOpenSearch = (event: Event) => {
      const customEvent = event as CustomEvent<{ query?: string }>;
      setSearchInitialQuery(customEvent.detail?.query || "");
      setSearchOpen(true);
    };

    window.addEventListener("keydown", handleGlobalKey);
    window.addEventListener("open-search", handleOpenSearch);
    return () => {
      window.removeEventListener("keydown", handleGlobalKey);
      window.removeEventListener("open-search", handleOpenSearch);
    };
  }, []);

  // Global navigation items
  const navItems = [
    { label: t("navBlog", "BLOG"), target: "/blog" },
    { label: t("navResources", "RESOURCES"), target: "/resources" },
    { label: t("navAbout", "ABOUT"), target: "/about" },
    { label: t("navContact", "CONTACT"), target: "/contact" },
  ];

  // Mobile menu items (includes Home for explicit navigation)
  const mobileNavItems = [
    { label: t("navHome", "HOME"), target: "/" },
    ...navItems,
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full pointer-events-none transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "pt-2.5 sm:pt-3 pb-1" : "pt-4 sm:pt-5 pb-2"
        }`}
      >
        <div
          className={`pointer-events-auto mx-auto flex items-center justify-between transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled
              ? "max-w-[760px] md:max-w-[820px] px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/94 dark:bg-[#121215]/92 border border-[#DDE1E0] dark:border-white/10 shadow-[0_6px_20px_rgba(15,23,42,0.06)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl mx-3 sm:mx-auto"
              : "max-w-[1060px] px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-white/40 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-2xs backdrop-blur-md mx-4 sm:mx-auto"
          }`}
        >
          {/* Logo & Brand — Original untouched asset */}
          <Link
            to={getLocalizedPath("/")}
            className="group flex items-center gap-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 select-none"
            aria-label="Rvan.me Home"
          >
            <img
              src={ravanLogo}
              alt="Rvan.me Logo"
              width={32}
              height={32}
              className={`object-contain transition-all duration-300 group-hover:scale-105 ${
                scrolled ? "h-6 w-6 sm:h-7 sm:w-7" : "h-7 w-7 sm:h-8 sm:w-8"
              }`}
            />
            <span className="hidden sm:inline-block text-[11px] font-bold tracking-[.14em] uppercase text-foreground leading-none">
              RVAN.ME
            </span>
          </Link>

          {/* Desktop Navigation — Clean compact horizontal pill */}
          <nav
            className={`hidden md:flex items-center text-[11px] font-bold tracking-[.1em] mono uppercase transition-all duration-300 ${
              scrolled ? "gap-1 sm:gap-1.5" : "gap-1.5 sm:gap-2.5"
            }`}
          >
            {navItems.map((item) => {
              const localizedTarget = getLocalizedPath(item.target);
              const isActive =
                location.pathname === localizedTarget ||
                location.pathname.startsWith(localizedTarget + "/");

              return (
                <Link
                  key={item.target}
                  to={localizedTarget}
                  className={`relative px-3 py-1.5 transition-colors duration-200 rounded-full ${
                    isActive
                      ? "text-foreground font-bold bg-muted/80 dark:bg-white/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40 dark:hover:bg-white/5"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action & Profile Control on Right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Integrated Compact Profile & Preferences Control */}
            <UserAuthMenu />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="grid h-8 w-8 place-items-center rounded-full border border-border/80 bg-card/60 dark:bg-white/[0.04] md:hidden text-foreground hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
            >
              {menuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal (Invoked via ⌘K or Hero Search) */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchInitialQuery("");
        }}
        initialQuery={searchInitialQuery}
      />

      {/* Mobile Slide-Over Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background/98 backdrop-blur-md px-8 pt-20 md:hidden"
          >
            <nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-1 relative z-10">
              {mobileNavItems.map((item, i) => {
                const localizedTarget = getLocalizedPath(item.target);
                const isActive =
                  item.target === "/"
                    ? location.pathname === "/" || location.pathname === "/az"
                    : location.pathname === localizedTarget ||
                      location.pathname.startsWith(localizedTarget + "/");

                return (
                  <div key={item.label} className="border-b border-border">
                    <Link
                      to={localizedTarget}
                      onClick={() => setMenuOpen(false)}
                      className={`flex w-full items-baseline gap-4 py-4 text-left text-2xl font-bold uppercase tracking-tight transition-colors hover:text-primary ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      <span className="mono text-xs text-muted-foreground">0{i + 1}</span>
                      {item.label}
                      {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                    </Link>
                  </div>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-border flex justify-between items-center text-xs mono text-muted-foreground relative z-10">
              <span>{t("creativePlatform", "CREATIVE PLATFORM & PUBLICATION")}</span>
              <Link
                to={getLocalizedPath("/contact")}
                onClick={() => setMenuOpen(false)}
                className="text-primary font-bold hover:underline"
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
