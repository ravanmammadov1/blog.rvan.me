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
  PenTool,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteSettings } from "../../types/cms";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import AuthModal from "./AuthModal";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import ravanLogo from "../../assets/ravan_logo.svg";


export function UserAuthMenu({ compact = false }: { compact?: boolean }) {
  const { user, isAdmin, loading, signOut, userPhoto } = useAuth();
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
    return <div className={compact ? "h-7 w-7 rounded-full bg-muted border border-border animate-pulse shrink-0 self-center" : "h-7 w-16 rounded-full bg-muted border border-border animate-pulse shrink-0 self-center"} />;
  }

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative shrink-0 flex items-center" ref={menuRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className={compact
          ? "h-7 w-7 sm:h-8 sm:w-8 rounded-full liquid-glass-btn p-0.5 flex items-center justify-center text-foreground transition-all hover:border-primary/60 focus:outline-none cursor-pointer select-none"
          : "flex items-center gap-1.5 rounded-full liquid-glass-btn px-2.5 py-1 text-xs text-foreground transition-all focus:outline-none cursor-pointer select-none"
        }
        aria-label="User Account Menu"
        aria-expanded={dropdownOpen}
      >
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={user?.displayName || "Profile"}
            className={compact ? "h-full w-full rounded-full object-cover" : "h-5 w-5 rounded-full object-cover border border-border shrink-0"}
          />
        ) : (
          <div className={compact ? "h-full w-full rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]" : "h-5 w-5 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-[10px] shrink-0"}>
            {user ? userInitial : <UserIcon size={compact ? 12 : 11} />}
          </div>
        )}
        {!compact && (
          <>
            <span className="hidden sm:inline font-mono tracking-wider truncate max-w-[90px] text-foreground font-semibold text-[11px]">
              {user ? (user.displayName?.split(" ")[0] || user.email?.split("@")[0]) : t("profile", "PROFILE")}
            </span>
            <ChevronDown size={11} className={`transition-transform duration-200 shrink-0 text-muted-foreground ${dropdownOpen ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] } }}
            exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl liquid-glass-card shadow-2xl z-50 pointer-events-auto text-foreground overflow-hidden origin-top-right"
          >
            {/* Identity / Header area */}
            {!user ? (
              /* Signed Out Header */
              <div className="relative z-10">
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
                <div className="border-t border-[#DDE1E0] dark:border-border p-3.5 space-y-3 bg-slate-50/50 dark:bg-surface/30">
                  {/* Appearance Segmented Control */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                      <span>{language === "az" ? "GÖRÜNÜŞ" : "APPEARANCE"}</span>
                      <span className="text-primary">{theme === "dark" ? (language === "az" ? "Tünd" : "Dark") : (language === "az" ? "Açıq" : "Light")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white dark:bg-card border border-[#DDE1E0] dark:border-border">
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
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white dark:bg-card border border-[#DDE1E0] dark:border-border">
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
              <div className="relative z-10">
                <div className="p-4 border-b border-[#DDE1E0] dark:border-border space-y-3">
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
                        {user.displayName || "User"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate mono">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Account status */}
                  <div className="flex items-center justify-between text-[11px] mono">
                    <span className="text-muted-foreground uppercase">{t("status", "Status")}:</span>
                    {isAdmin ? (
                      <span className="text-purple-600 dark:text-purple-400 font-bold">● {t("adminConsole", "Admin")}</span>
                    ) : (
                      <span className="text-muted-foreground">● {t("normalUser", "Oxucu")}</span>
                    )}
                  </div>
                </div>

                {/* Profile navigation actions */}
                <div className="p-2 border-b border-[#DDE1E0] dark:border-border space-y-1">
                  <Link
                    to={getLocalizedPath("/profile")}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-muted/60 transition-colors"
                  >
                    <UserIcon size={14} className="text-primary" />
                    <span>{t("myAccount", "Mənim Hesabım")}</span>
                  </Link>

                  <Link
                    to={getLocalizedPath("/write")}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-muted/60 transition-colors"
                  >
                    <Sparkles size={14} className="text-primary" />
                    <span>{t("shareYourIdeas", "Share Your Ideas")}</span>
                  </Link>

                  {/* Admin Direct Access */}
                  {isAdmin && (
                    <Link
                      to={getLocalizedPath("/admin")}
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors font-semibold"
                    >
                      <ShieldCheck size={13} className="shrink-0" />
                      <span>{t("adminConsole", "Admin Console")}</span>
                    </Link>
                  )}
                </div>

                {/* Preferences in signed in menu */}
                <div className="p-3 border-b border-[#DDE1E0] dark:border-border space-y-3 bg-slate-50/50 dark:bg-surface/30">
                  {/* Appearance Switch */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase">{language === "az" ? "Görünüş" : "Theme"}</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-card p-0.5 rounded-lg border border-[#DDE1E0] dark:border-border">
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
                    <div className="flex items-center gap-1 bg-white dark:bg-card p-0.5 rounded-lg border border-[#DDE1E0] dark:border-border">
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

/**
 * SiteHeader
 * Static, non-floating, non-resizing global header.
 * Stays at the top of the page and naturally scrolls out of view.
 */
export default function SiteHeader({ siteSettings }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { t, getLocalizedPath } = useLanguage();

  // Global navigation items
  const navItems = [
    { label: t("navHome", "HOME"), target: "/" },
    { label: t("navBlog", "BLOG"), target: "/blog" },
    { label: t("navResources", "RESOURCES"), target: "/resources" },
    { label: t("navAbout", "ABOUT"), target: "/about" },
    { label: t("navContact", "CONTACT"), target: "/contact" },
  ];

  // Mobile menu items
  const mobileNavItems = [...navItems];

  return (
    <>
      <header className="relative z-30 w-full pt-3 sm:pt-4 px-4 flex justify-center pointer-events-none select-none">
        <div className="pointer-events-auto w-full md:w-auto inline-flex items-center justify-between md:justify-start gap-2.5 sm:gap-4 md:gap-5 h-[42px] sm:h-[46px] px-3.5 sm:px-4 rounded-full liquid-glass-nav transition-all">
          {/* Logo & Brand — Always links to Home in active language */}
          <Link
            to={getLocalizedPath("/")}
            className="flex items-center gap-2 rounded-full px-1 py-0.5 text-left focus-visible:outline-none shrink-0 group select-none relative z-10"
            aria-label="Rvan.me Home"
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

          {/* Desktop Navigation — Tightly Hugged Liquid Glass Capsule */}
          <nav className="hidden md:flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] text-[10.5px] font-bold tracking-[.06em] mono uppercase shrink-0 relative z-10">
            {navItems.map((item) => {
              const localizedTarget = getLocalizedPath(item.target);
              const isHome = item.target === "/";
              const isActive = isHome
                ? location.pathname === "/" || location.pathname === "/az"
                : location.pathname === localizedTarget ||
                  location.pathname.startsWith(localizedTarget + "/");

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

          {/* Action & Profile Control on Right */}
          <div className="flex items-center gap-1.5 shrink-0 relative z-10">
            <UserAuthMenu compact={true} />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="grid h-7 w-7 place-items-center rounded-full border border-border/80 bg-card/60 dark:bg-white/[0.04] md:hidden text-foreground hover:border-primary transition-colors shrink-0 cursor-pointer"
            >
              {menuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
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
