import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Search,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { urlFor } from "../../lib/sanityClient";
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
    return <div className="h-9 w-20 rounded-xl bg-muted border border-border animate-pulse shrink-0 self-center" />;
  }

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative shrink-0 flex items-center" ref={menuRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-border/80 bg-card/80 px-2.5 py-1.5 text-xs text-foreground transition-all hover:bg-muted/80 focus:outline-none cursor-pointer select-none shadow-sm"
        aria-label="User Account Menu"
        aria-expanded={dropdownOpen}
      >
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={user?.displayName || "Profile"}
            className="h-6 w-6 rounded-full object-cover border border-border shrink-0"
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-[11px] shrink-0">
            {user ? userInitial : <UserIcon size={12} />}
          </div>
        )}
        <span className="hidden sm:inline font-mono tracking-wider truncate max-w-[120px] text-foreground font-semibold">
          {user ? (user.displayName || user.email?.split("@")[0]) : t("profile", "PROFILE")}
        </span>
        <ChevronDown size={13} className={`transition-transform duration-200 shrink-0 text-muted-foreground ${dropdownOpen ? "rotate-180" : ""}`} />
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

                {/* 3. QUICK PREFERENCES */}
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

                  {/* Language Segmented Control */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                      <span>{language === "az" ? "DİL" : "LANGUAGE"}</span>
                      <span className="text-primary">{language === "az" ? "AZ" : "EN"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-card border border-border">
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
                        <span>EN</span>
                      </button>

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
                        <span>AZ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Signed In Header with 4 Structured Sections */
              <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
                {/* 1. USER PROFILE & 2. SETTINGS */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={user.displayName || "User"}
                        className="h-10 w-10 rounded-full object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shrink-0">
                        {userInitial}
                      </div>
                    )}
                    <div className="overflow-hidden min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">
                        {user.displayName || "User"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate font-mono">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={getLocalizedPath("/profile")}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-primary text-primary-foreground px-3.5 py-2.5 text-xs font-bold transition-all hover:opacity-90 mono uppercase tracking-wider shadow-sm"
                  >
                    <span>{language === "az" ? "TƏNZİMLƏMƏLƏR" : "SETTINGS"}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>

                {/* 3. QUICK PREFERENCES (Appearance & Language) */}
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

                  {/* Language Segmented Control */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                      <span>{language === "az" ? "DİL" : "LANGUAGE"}</span>
                      <span className="text-primary">{language === "az" ? "AZ" : "EN"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-card border border-border">
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
                        <span>EN</span>
                      </button>

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
                        <span>AZ</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. SIGN OUT */}
                <div className="border-t border-border p-2 bg-surface/30">
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
    const handleGlobalKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const baseNavItems = [
    { label: t("navHome", "HOME"), target: "/" },
    { label: t("navBlog", "BLOG"), target: "/blog" },
    { label: t("navResources", "RESOURCES"), target: "/resources" },
    { label: t("navAbout", "ABOUT"), target: "/about" },
    { label: t("navContact", "CONTACT"), target: "/contact" },
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
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ${
          scrolled || !isHomePage
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-2 md:py-2.5"
            : "bg-background/40 backdrop-blur-sm border-b border-transparent py-3 md:py-3.5"
        }`}
      >
        <div className="mx-auto flex h-11 md:h-12 max-w-[1600px] items-center justify-between px-6 md:px-10">
          {/* Logo & Brand */}
          <Link
            to={getLocalizedPath("/")}
            className="group flex items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 self-center"
            aria-label="Rvan.me Home"
          >
            <img
              src={ravanLogo}
              alt="Rvan.me Logo"
              width={36}
              height={36}
              className="h-8 w-8 md:h-9 md:w-9 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="hidden text-[11px] font-bold leading-tight tracking-[.14em] sm:block uppercase">
              RVAN.ME
              <br />
              <span className="text-[9px] font-medium text-muted-foreground">{t("studio", "STUDIO")}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1.5 text-[11px] font-bold tracking-[.1em] mono uppercase md:flex shrink-0 self-center">
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
                  className={`relative px-3.5 py-1.5 transition-colors duration-200 rounded-lg ${
                    isActive
                      ? "text-foreground font-bold bg-muted/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
 
          {/* Action Buttons & Authentication */}
          <div className="flex items-center gap-2.5 shrink-0 self-center">
            {/* Global Search Button Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search articles and resources"
              className="flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-[11px] font-medium transition-colors hover:border-primary/40 text-muted-foreground hover:text-foreground shrink-0 self-center"
            >
              <Search size={13} className="text-primary" />
              <span className="hidden lg:inline font-mono tracking-wider font-semibold">{t("search", "SEARCH")}</span>
              <kbd className="hidden lg:inline rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground border border-border">⌘K</kbd>
            </button>

            {/* Integrated Profile & Preferences Dropdown */}
            <UserAuthMenu />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card md:hidden text-foreground hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 self-center"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

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
              {navItems.map((item, i) => {
                const localizedTarget = getLocalizedPath(item.target);
                const isActive =
                  item.target === "/"
                    ? isHomePage
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
