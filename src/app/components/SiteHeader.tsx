import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
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

  const handleNavClick = (target: string) => {
    setMenuOpen(false);

    if (target.startsWith("/")) {
      navigate(target);
      return;
    }

    if (isHomePage) {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate(`/#${target}`);
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const defaultNavItems = [
    { label: "WORK", target: "work" },
    { label: "ABOUT", target: "about" },
    { label: "EXPERTISE", target: "expertise" },
    { label: "NEWS", target: "/news" },
    { label: "TOOLS", target: "/tools" },
    { label: "BLOG", target: "/blog" },
    { label: "CONTACT", target: "contact" },
  ];

  const navItems = (siteSettings?.navItems && siteSettings.navItems.length > 0
    ? siteSettings.navItems
    : defaultNavItems
  ).filter((item) => !("hidden" in item && item.hidden));

  const letsTalkLabel = siteSettings?.letsTalkLabel || "LET'S TALK";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled || !isHomePage
            ? "bg-background/88 backdrop-blur-md border-b border-border/60 shadow-lg shadow-black/20 py-3 md:py-4"
            : "bg-background/20 backdrop-blur-sm border-b border-transparent py-4 md:py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick(isHomePage ? "top" : "/")}
            className="group flex items-center gap-3 text-left focus:outline-none"
            aria-label="Ravan Mammadov Home"
          >
            {siteSettings?.logo ? (
              <img
                src={urlFor(siteSettings.logo)?.url() || ""}
                alt="Ravan Mammadov Logo"
                className="h-9 w-9 md:h-10 md:w-10 rounded-full object-contain border border-white/40 p-1 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="grid h-9 w-9 md:h-10 md:w-10 place-items-center rounded-full border border-white/40 text-sm font-bold transition-transform duration-300 group-hover:rotate-45 group-hover:border-primary group-hover:text-primary">
                R
              </span>
            )}
            <span className="hidden text-[10px] font-bold leading-tight tracking-[.24em] sm:block uppercase">
              RAVAN
              <br />
              MAMMADOV
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 text-[11px] font-semibold tracking-[.16em] uppercase lg:flex">
            {navItems.map((item) => {
              const isActive =
                (item.target === "/blog" && location.pathname.startsWith("/blog")) ||
                (item.target === "/news" && location.pathname.startsWith("/news")) ||
                (item.target === "/tools" && location.pathname.startsWith("/tools")) ||
                (item.target === "work" && location.pathname.startsWith("/work"));

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.target)}
                  className={`text-[11px] font-semibold tracking-[.16em] uppercase transition-colors duration-300 hover:text-primary ${
                    isActive ? "text-primary font-bold" : "text-foreground/90"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick("contact")}
              className="hidden items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-[10px] font-bold tracking-[.16em] uppercase transition duration-300 hover:border-primary hover:bg-primary hover:text-black sm:flex"
            >
              {letsTalkLabel} <ArrowUpRight size={13} />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-white/40 lg:hidden text-foreground hover:border-primary transition-colors"
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
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background/95 backdrop-blur-xl px-8 pt-20 lg:hidden"
          >
            <div className="space-y-2">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  onClick={() => handleNavClick(item.target)}
                  className="flex w-full items-baseline gap-4 border-b border-border/50 py-4 text-left text-2xl font-semibold uppercase tracking-tight transition-colors hover:text-primary"
                >
                  <span className="mono text-xs text-muted-foreground">0{i + 1}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 flex justify-between items-center text-xs mono text-muted-foreground">
              <span>AVAILABLE FOR SELECT WORK</span>
              <button
                onClick={() => handleNavClick("contact")}
                className="text-primary font-bold hover:underline"
              >
                START PROJECT →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
