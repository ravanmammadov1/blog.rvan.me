import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          className="group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-neutral-950/85 text-foreground backdrop-blur-md transition-all duration-300 hover:border-[#61c5ad]/60 hover:text-[#61c5ad] hover:scale-105 shadow-2xl glass-sm transform-gpu overflow-hidden"
          aria-label="Scroll back to top"
        >
          {/* Circular SVG Scroll Progress Ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 48 48">
            <defs>
              <linearGradient id="scrollToTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#61c5ad" />
                <stop offset="50%" stopColor="#426fba" />
                <stop offset="100%" stopColor="#984f9f" />
              </linearGradient>
            </defs>
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
              stroke="url(#scrollToTopGrad)"
              className="fill-none transition-all duration-150 ease-out"
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
              background: "radial-gradient(circle at center, rgba(97,197,173,0.3) 0%, rgba(152,79,159,0.15) 60%, transparent 80%)",
            }}
          />

          {/* Arrow Icon */}
          <ArrowUp size={16} className="relative z-10 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
