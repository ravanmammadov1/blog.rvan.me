import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;
      
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setVisible(currentScroll > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: isReduced ? "auto" : "smooth" });
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius; // ~125.66
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToTop}
          className={`group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 grid h-12 w-12 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 transform-gpu overflow-hidden cursor-pointer ${
            isDark
              ? "border-white/15 bg-neutral-950/85 text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-primary/60 hover:text-primary"
              : "border-[#dde1e0] bg-white text-[#0f172a] shadow-[0_4px_16px_rgba(15,23,42,0.08)] hover:border-slate-400 hover:text-slate-900"
          }`}
          aria-label="Scroll back to top"
        >
          {/* Circular SVG Scroll Progress Ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 48 48">
            <defs>
              <linearGradient id="scrollToTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDark ? "#61c5ad" : "#0d9488"} />
                <stop offset="100%" stopColor={isDark ? "#bc66c5" : "#6366f1"} />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              className={isDark ? "stroke-white/10 fill-none" : "stroke-slate-200 fill-none"}
              strokeWidth="2.5"
            />
            {/* Progress Bar */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="url(#scrollToTopGrad)"
              className="fill-none transition-all duration-150 ease-out"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Arrow Icon */}
          <ArrowUp size={16} className="relative z-10 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
