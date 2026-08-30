import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

export default function EditorialMarquee() {
  const { language } = useLanguage();
  const isAz = language === "az";

  // Curated editorial terms matching the requested sequence
  const items = useMemo(
    () =>
      isAz
        ? [
            "DESIGN",
            "MARKETING",
            "BRANDING",
            "PSİXOLOGİYA",
            "AI & CREATIVITY",
            "STRATEGY",
          ]
        : [
            "DESIGN",
            "MARKETING",
            "BRANDING",
            "PSYCHOLOGY",
            "AI & CREATIVITY",
            "STRATEGY",
          ],
    [isAz]
  );

  return (
    <section
      aria-label="Editorial Categories"
      className="relative z-10 w-full overflow-hidden border-y border-border/70 dark:border-white/10 bg-background dark:bg-[#07080b] py-3.5 xs:py-4 sm:py-5 md:py-5.5 select-none"
    >
      {/* Left and Right Soft Fade Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-background dark:from-[#07080b] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-background dark:from-[#07080b] to-transparent z-10" />

      {/* Hardware-accelerated Continuous Infinite Marquee Loop */}
      <div className="flex w-max overflow-visible">
        <motion.div
          className="flex shrink-0 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 28,
            repeat: Infinity,
          }}
        >
          {/* Half 1 (Repeated 4 sets to ensure 4K screen coverage) */}
          <div className="flex shrink-0 items-center">
            {[...Array(4)].map((_, setIdx) => (
              <div key={`set-1-${setIdx}`} className="flex shrink-0 items-center">
                {items.map((item, idx) => (
                  <div key={`m1-${setIdx}-${idx}`} className="flex shrink-0 items-center">
                    <span className="text-xs xs:text-sm sm:text-base md:text-[17px] font-black font-mono tracking-[0.2em] sm:tracking-[0.26em] uppercase text-foreground/90 hover:text-foreground transition-colors px-4 xs:px-6 sm:px-8">
                      {item}
                    </span>
                    <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#61c5ad] via-[#6099df] to-[#bc66c5] bg-clip-text text-transparent text-sm sm:text-base md:text-xl font-sans select-none opacity-90 mx-1 sm:mx-3">
                      ✦
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Half 2 (Exact clone for mathematically seamless infinite gliding) */}
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {[...Array(4)].map((_, setIdx) => (
              <div key={`set-2-${setIdx}`} className="flex shrink-0 items-center">
                {items.map((item, idx) => (
                  <div key={`m2-${setIdx}-${idx}`} className="flex shrink-0 items-center">
                    <span className="text-xs xs:text-sm sm:text-base md:text-[17px] font-black font-mono tracking-[0.2em] sm:tracking-[0.26em] uppercase text-foreground/90 hover:text-foreground transition-colors px-4 xs:px-6 sm:px-8">
                      {item}
                    </span>
                    <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#61c5ad] via-[#6099df] to-[#bc66c5] bg-clip-text text-transparent text-sm sm:text-base md:text-xl font-sans select-none opacity-90 mx-1 sm:mx-3">
                      ✦
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
