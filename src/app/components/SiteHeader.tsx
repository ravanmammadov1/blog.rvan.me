import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { t, getLocalizedPath, language, switchLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const top = rect.bottom + 10;
    // Align dropdown right edge with trigger button right edge, clamped inside viewport
    const right = Math.max(12, Math.min(window.innerWidth - 330, window.innerWidth - rect.right));
    setDropdownPos({ top, right });
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    updatePosition();

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current && triggerRef.current.contains(target)) return;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      setDropdownOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [dropdownOpen, updatePosition]);

  if (loading) {
    return <div className={compact ? "h-7 w-7 rounded-full bg-muted border border-border animate-pulse shrink-0 self-center" : "h-7 w-16 rounded-full bg-muted border border-border animate-pulse shrink-0 self-center"} />;
  }

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative shrink-0 flex items-center">
      <button
        ref={triggerRef}
        onClick={() => {
          setDropdownOpen((prev) => {
            if (!prev) updatePosition();
            return !prev;
          });
        }}
        className={compact
          ? `h-7 w-7 sm:h-8 sm:w-8 rounded-full liquid-glass-btn p-0.5 flex items-center justify-center text-foreground transition-all hover:border-primary/60 focus:outline-none cursor-pointer select-none ${dropdownOpen ? "ring-2 ring-primary/60 border-primary" : ""}`
          : `flex items-center gap-1.5 rounded-full liquid-glass-btn px-2.5 py-1 text-xs text-foreground transition-all focus:outline-none cursor-pointer select-none ${dropdownOpen ? "ring-2 ring-primary/60 border-primary" : ""}`
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

      {/* Anchored Popover Portal directly mounted into document.body */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {dropdownOpen && dropdownPos && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.14, ease: [0.4, 0, 1, 1] } }}
                style={{
                  position: "fixed",
                  top: `${dropdownPos.top}px`,
                  right: `${dropdownPos.right}px`,
                  zIndex: 99999,
                }}
                className="w-[310px] sm:w-[320px] max-w-[calc(100vw-24px)] rounded-[26px] liquid-glass-dropdown shadow-2xl pointer-events-auto text-foreground origin-top-right overflow-visible p-5 sm:p-6 text-left"
              >
                {/* Top Caret pointing directly to Avatar */}
                <div
                  className="absolute -top-[6px] w-3 h-3 rotate-45 border-t border-l border-white/25 dark:border-white/20 bg-white/60 dark:bg-[#161a24]/80 backdrop-blur-xl pointer-events-none z-[2]"
                  style={{ right: "10px" }}
                />

                <div className="relative z-10 space-y-4">
                  {!user ? (
                    /* Signed Out State */
                    <>
                      <div className="space-y-3 pb-3 border-b border-black/[0.08] dark:border-white/[0.08]">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold uppercase tracking-[.16em] text-primary">
                            {t("profile", "PROFILE")}
                          </span>
                          <span className="text-[10.5px] font-mono text-muted-foreground">
                            {t("guestUser", "Qonaq İstifadəçi")}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setModalOpen(true);
                          }}
                          className="w-full flex items-center justify-center gap-2 rounded-xl liquid-glass-btn-primary py-2.5 text-xs font-bold text-white uppercase tracking-wider mono transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99]"
                        >
                          {t("signInWithGoogle", "GOOGLE İLƏ DAXİL OL")}
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Signed In State */
                    <>
                      {/* User Profile Header */}
                      <div className="flex items-center gap-3.5 pb-4 border-b border-black/[0.08] dark:border-white/[0.08]">
                        <div className="relative h-11 w-11 rounded-full p-0.5 ring-2 ring-primary/40 dark:ring-white/20 shrink-0">
                          {userPhoto ? (
                            <img
                              src={userPhoto}
                              alt={user.displayName || "User"}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                              {userInitial}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-bold text-foreground truncate tracking-tight leading-tight">
                            {user.displayName || "User"}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate mono mt-0.5">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="space-y-1 pb-4 border-b border-black/[0.08] dark:border-white/[0.08]">
                        <Link
                          to={getLocalizedPath("/write")}
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-3 rounded-xl px-2 py-2 text-[13px] font-medium text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                        >
                          <Sparkles size={16} className="text-[#61c5ad] shrink-0" />
                          <span className="truncate">{t("shareYourIdeas", "Fikrinizi bizimlə paylaşın")}</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to={getLocalizedPath("/admin")}
                            onClick={() => setDropdownOpen(false)}
                            className="w-full flex items-center gap-3 rounded-xl px-2 py-2 text-[13px] font-medium text-[#c084fc] hover:bg-purple-500/10 transition-colors"
                          >
                            <ShieldCheck size={16} className="text-[#a855f7] shrink-0" />
                            <span className="truncate font-semibold">{t("adminConsole", "Admin İdarəetmə Paneli")}</span>
                          </Link>
                        )}

                        <Link
                          to={getLocalizedPath("/profile")}
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-3 rounded-xl px-2 py-2 text-[13px] font-medium text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                        >
                          <UserIcon size={16} className="text-muted-foreground shrink-0" />
                          <span className="truncate">{t("myAccount", "Mənim hesabım")}</span>
                        </Link>
                      </div>
                    </>
                  )}

                  {/* Preferences: Appearance & Language (Matching Reference Segmented Capsules) */}
                  <div className="space-y-3 pb-4 border-b border-black/[0.08] dark:border-white/[0.08]">
                    {/* Theme / Appearance */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono tracking-[0.14em] text-muted-foreground uppercase">
                        {language === "az" ? "GÖRÜNÜŞ" : "APPEARANCE"}
                      </span>
                      <div className="h-8 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/[0.04] p-0.5 flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => setTheme("dark")}
                          className={`h-full px-3 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            theme === "dark"
                              ? "bg-[#61c5ad]/20 text-[#61c5ad] shadow-sm font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          title="Dark mode"
                        >
                          <Moon size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme("light")}
                          className={`h-full px-3 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            theme === "light"
                              ? "bg-primary/20 text-primary shadow-sm font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          title="Light mode"
                        >
                          <Sun size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Language Switch */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono tracking-[0.14em] text-muted-foreground uppercase">
                        {language === "az" ? "DİL" : "LANGUAGE"}
                      </span>
                      <div className="h-8 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/[0.04] p-0.5 flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => switchLanguage("az")}
                          className={`h-full px-3 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                            language === "az"
                              ? "bg-[#a855f7]/30 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          AZ
                        </button>
                        <button
                          type="button"
                          onClick={() => switchLanguage("en")}
                          className={`h-full px-3 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                            language === "en"
                              ? "bg-[#a855f7]/30 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          EN
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sign Out (Signed In Only) */}
                  {user && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs font-mono font-bold text-[#ff5c5c] hover:text-[#ff3838] hover:bg-destructive/10 transition-colors text-left uppercase tracking-[0.18em] cursor-pointer"
                      >
                        <LogOut size={14} className="shrink-0" />
                        <span>{t("signOut", "ÇIXIŞ ET")}</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

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
