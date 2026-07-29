import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToTop}
          className="group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-neutral-950/80 text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:text-primary hover:scale-105 shadow-2xl glass-sm transform-gpu overflow-hidden"
          aria-label="Scroll back to top"
        >
          {/* Subtle Aurora Glow on hover */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: "radial-gradient(circle at center, rgba(232,253,82,0.18) 0%, rgba(6,182,212,0.08) 60%, transparent 80%)",
            }}
          />
          <ArrowUp size={16} className="relative z-10 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
