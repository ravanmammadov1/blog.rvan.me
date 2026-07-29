import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { urlFor } from "../../lib/sanityClient";
import { SiteSettings } from "../../types/cms";

const EASE = [0.22, 1, 0.36, 1] as const;

interface SiteHeaderProps {
  siteSettings?: SiteSettings | null;
}

export default function SiteHeader({ siteSettings }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (target: string | undefined) => {
    setMenuOpen(false);

    if (!target) {
      navigate("/");
      return;
    }

    if (typeof target === "string" && target.startsWith("/")) {
      navigate(target);
      return;
    }

    if (target === "work" || target === "Work") { navigate("/ravan-mammadov#selected-work"); return; }
    if (target === "contact" || target === "Contact") { navigate("/contact"); return; }
    if (target === "about" || target === "About") { navigate("/ravan-mammadov"); return; }
    if (target === "news" || target === "News") { navigate("/news"); return; }
    if (target === "tools" || target === "Tools") { navigate("/tools"); return; }
    if (target === "blog" || target === "Blog") { navigate("/blog"); return; }
    if (target === "resources" || target === "Resources") { navigate("/resources"); return; }

    if (target === "top") {
      if (isHomePage) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      return;
    }

    navigate(`/${target}`);
  };

  const baseNavItems = [
    { label: "HOME",      target: "/" },
    { label: "WORK",      target: "/ravan-mammadov#selected-work" },
    { label: "NEWS",      target: "/news" },
    { label: "RESOURCES", target: "/resources" },
    { label: "TOOLS",     target: "/tools" },
    { label: "BLOG",      target: "/blog" },
    { label: "ABOUT",     target: "/ravan-mammadov" },
    { label: "CONTACT",   target: "/contact" },
  ];

  // Dynamic Navigation Rule:
  // 1. The current page should NOT appear in the navigation.
  // 2. Home should always be the first item if the user is NOT on the Home page.
  const navItems = baseNavItems.filter((item) => {
    if (item.target === "/") {
      // Hide HOME if we are on the Home page
      return !isHomePage;
    }
    // For other pages, hide if the current pathname matches or starts with it (e.g. /blog/post-1)
    const isCurrentPage = location.pathname === item.target || location.pathname.startsWith(item.target + "/");
    return !isCurrentPage;
  });

  const letsTalkLabel = siteSettings?.letsTalkLabel || "LET'S TALK";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled || !isHomePage
            ? "bg-background/88 backdrop-blur-md border-b border-border/60 shadow-lg shadow-black/20 py-3 md:py-4"
            : "bg-background/10 backdrop-blur-sm border-b border-transparent py-4 md:py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick("top")}
            className="group flex items-center gap-3 text-left focus:outline-none"
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
            <span className="hidden text-[10px] font-medium leading-tight tracking-[.16em] sm:block uppercase">
              RAVAN
              <br />
              MAMMADOV
            </span>
          </button>
 
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1.5 text-[10.5px] font-medium tracking-[.08em] mono uppercase md:flex">
            {navItems.map((item) => {
              const isActive =
                item.target === "/"
                  ? location.pathname === "/"
                  : location.pathname === item.target ||
                    location.pathname.startsWith(item.target + "/");
 
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.target)}
                  className={`relative px-3 py-1.5 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                   {/* Aurora glow behind active item */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-aurora-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 50%, rgba(232,253,82,0.1) 0%, rgba(59,130,246,0.06) 50%, transparent 80%)",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  {/* Animated underline indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[1px] w-1/2 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
 
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick("/contact")}
              className="hidden items-center gap-2 rounded-full border border-white/20 px-4.5 py-2 text-[10px] font-medium tracking-[.08em] uppercase transition-all duration-300 hover:border-primary/60 hover:bg-primary hover:text-black sm:flex glass-sm"
            >
              {letsTalkLabel} <ArrowUpRight size={13} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 md:hidden text-foreground hover:border-primary transition-colors glass-sm"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
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

            <div className="space-y-1 relative z-10">
              {navItems.map((item, i) => {
                const isActive =
                  item.target === "/"
                    ? location.pathname === "/"
                    : location.pathname === item.target ||
                      location.pathname.startsWith(item.target + "/");

                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    onClick={() => handleNavClick(item.target)}
                    className={`flex w-full items-baseline gap-4 border-b border-border/30 py-4 text-left text-2xl font-semibold uppercase tracking-tight transition-all duration-300 hover:text-primary ${
                      isActive ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    <span className="mono text-xs text-muted-foreground/50">
                      0{i + 1}
                    </span>
                    {item.label}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-border/30 flex justify-between items-center text-xs mono text-muted-foreground relative z-10">
              <span>CREATIVE PLATFORM & PUBLICATION</span>
              <button
                onClick={() => handleNavClick("/contact")}
                className="text-primary font-bold hover:underline"
              >
                COLLABORATE →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
