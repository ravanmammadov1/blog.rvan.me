import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
          className="group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-neutral-950/85 text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:text-primary hover:scale-105 shadow-2xl glass-sm transform-gpu overflow-hidden"
          aria-label="Scroll back to top"
        >
          {/* Circular SVG Scroll Progress Ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 48 48">
            {/* Track */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-white/10 fill-none"
              strokeWidth="2.5"
            />
            {/* Progress Bar */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-primary fill-none transition-all duration-150 ease-out"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Subtle Aurora Glow on hover */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: "radial-gradient(circle at center, rgba(232,253,82,0.2) 0%, rgba(6,182,212,0.1) 60%, transparent 80%)",
            }}
          />

          {/* Arrow Icon */}
          <ArrowUp size={16} className="relative z-10 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
