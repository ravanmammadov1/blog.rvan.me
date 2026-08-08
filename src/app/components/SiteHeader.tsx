import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { urlFor } from "../../lib/sanityClient";
import { SiteSettings } from "../../types/cms";
import { useAuth } from "../../hooks/useAuth";
import AuthModal from "./AuthModal";

const EASE = [0.22, 1, 0.36, 1] as const;

function UserAuthMenu() {
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".user-auth-menu")) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  if (loading) {
    return <div className="h-[38px] w-24 rounded-full bg-white/5 border border-white/10 animate-pulse shrink-0 self-center" />;
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex h-[38px] items-center gap-2 rounded-full border border-white/20 px-4 text-[10.5px] font-medium tracking-[.08em] uppercase transition-all duration-300 hover:border-primary/60 hover:bg-primary hover:text-black glass-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground shrink-0 self-center"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>SIGN IN</span>
        </button>

        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }


  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative flex items-center justify-center h-[38px] user-auth-menu shrink-0 self-center">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex h-[38px] items-center gap-2.5 rounded-full border border-white/20 bg-white/5 pl-1.5 pr-3 text-[10.5px] font-medium transition-all duration-300 hover:border-primary/50 glass-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground shrink-0 select-none self-center"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="h-6 w-6 rounded-full object-cover border border-white/20 shrink-0"
          />
        ) : (
          <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-black font-bold text-xs shrink-0">
            {userInitial}
          </span>
        )}
        <span className="hidden sm:inline font-mono tracking-wider truncate max-w-[120px] text-foreground">
          {user.displayName || user.email?.split("@")[0]}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ${dropdownOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] w-60 rounded-2xl border border-white/10 bg-background/95 p-3 backdrop-blur-2xl shadow-2xl z-50 aurora-card"
          >
            <div className="px-3 py-2 border-b border-white/10 mb-1.5">
              <p className="text-xs font-bold text-foreground truncate">{user.displayName || "User"}</p>
              <p className="text-[10px] text-muted-foreground truncate mono mt-0.5">{user.email}</p>
            </div>

            <button
              disabled
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground/60 cursor-not-allowed text-left font-mono"
            >
              <UserIcon size={14} /> Profile (Placeholder)
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left font-mono"
            >
              <LogOut size={14} /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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

  const isHomePage = location.pathname === "/";

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

  const getNavHref = (target: string) => {
    if (target.startsWith("/")) return target;
    const normalized = target.toLowerCase();
    if (normalized === "top" || normalized === "home") return "/";
    if (normalized === "about") return "/ravan-mammadov";
    if (normalized === "work") return "/work";
    return `/${normalized}`;
  };

  const baseNavItems = [
    { label: "HOME",      target: "/" },
    { label: "WORK",      target: "/work" },
    { label: "NEWS",      target: "/news" },
    { label: "RESOURCES", target: "/resources" },
    { label: "TOOLS",     target: "/tools" },
    { label: "BLOG",      target: "/blog" },
    { label: "ABOUT",     target: "/ravan-mammadov" },
    { label: "CONTACT",   target: "/contact" },
  ];

  // Hide HOME when on the Home page; show HOME only when on other pages
  const navItems = baseNavItems.filter((item) => {
    if (item.target === "/") {
      return !isHomePage;
    }
    return true;
  });

  const letsTalkLabel = siteSettings?.letsTalkLabel || "LET'S TALK";

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
            to="/"
            className="group flex items-center gap-3 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background shrink-0 self-center"
            aria-label="Ravan Mammadov Home"
          >
            {siteSettings?.logo ? (
              <img
                src={urlFor(siteSettings.logo)?.url() || ""}
                alt="Ravan Mammadov Logo"
                className="h-9 w-9 md:h-10 md:w-10 rounded-full object-contain border border-white/30 p-1 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/50"
              />
            ) : (
              <span className="grid h-9 w-9 md:h-10 md:w-10 place-items-center rounded-full border border-white/30 text-sm font-bold transition-all duration-300 group-hover:rotate-45 group-hover:border-primary group-hover:text-primary">
                R
              </span>
            )}
            <span className="hidden text-[10px] font-bold leading-tight tracking-[.16em] sm:block uppercase">
              RVAN.ME
              <br />
              <span className="text-[9px] font-medium text-muted-foreground">STUDIO</span>
            </span>

          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 text-[10.5px] font-medium tracking-[.08em] mono uppercase md:flex shrink-0 self-center">
            {navItems.map((item) => {
              const isActive =
                item.target === "/"
                  ? location.pathname === "/"
                  : location.pathname === item.target ||
                    location.pathname.startsWith(item.target + "/");

              return (
                <Link
                  key={item.label}
                  to={getNavHref(item.target)}
                  className={`relative px-3 py-1.5 transition-colors duration-300 ${
                    isActive
                      ? "text-white font-bold"
                      : "text-foreground/70 hover:text-white"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm`}
                >
                  {/* Clean white underline indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"
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
            {/* Auth Button / Profile Dropdown */}
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
                const isActive =
                  item.target === "/"
                    ? location.pathname === "/"
                    : location.pathname === item.target ||
                      location.pathname.startsWith(item.target + "/");

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    className="border-b border-border/30"
                  >
                    <Link
                      to={getNavHref(item.target)}
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
              <span>CREATIVE PLATFORM & PUBLICATION</span>
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                COLLABORATE →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
