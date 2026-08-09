import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Download } from "lucide-react";
import { FontItem, resolveDirectFontDownloadUrl } from "../../../lib/fontEngine";
import { loadFontOnDemand } from "../../../lib/fontLoader";

interface FontSpecimenCardProps {
  font: FontItem;
  previewText: string;
  fontSizePx: number;
  idx: number;
  fadeUpVariants: any;
}

export function FontSpecimenCard({
  font,
  previewText,
  fontSizePx,
  idx,
  fadeUpVariants,
}: FontSpecimenCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    // Lazy load font on-demand when card enters or gets within 250px of the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadFontOnDemand(font);
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [font]);

  return (
    <motion.article
      ref={cardRef}
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      custom={(idx % 20) * 0.02}
      className="group p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 glass flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(232,253,82,0.1)]"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase text-primary mono">
            {font.category}
          </span>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground mono">
            {font.isVariable && (
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-cyan-400">
                VARIABLE
              </span>
            )}
            <span>{font.stylesCount} Styles</span>
          </div>
        </div>

        {/* Font Family Name */}
        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {font.name}
        </h3>
        <p className="text-xs text-muted-foreground mono mt-0.5">
          Designed by <span className="text-foreground/90 font-semibold">{font.designer}</span> · {font.foundry}
        </p>

        {/* Specimen Live Preview in Authentic Font Style */}
        <div className="my-4 p-4 rounded-xl border border-white/5 bg-background/60 overflow-hidden min-h-[96px] flex items-center">
          <p
            style={{
              fontFamily: `"${font.family}", "${font.family.replace(/\s+(Pro|Display|Extra|Variable|Math|Code|Sans|Mono|Serif)$/i, "").trim()}", system-ui, -apple-system, sans-serif`,
              fontSize: `${fontSizePx}px`,
              lineHeight: 1.25,
            }}
            className="text-foreground transition-all duration-300 break-words line-clamp-2 w-full"
          >
            {previewText || font.sampleText}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold mono">
        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
          <BadgeCheck size={12} /> {font.license}
        </span>
        <a
          href={resolveDirectFontDownloadUrl(font)}
          download={`${font.family}.zip`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
        >
          DOWNLOAD ZIP <Download size={11} />
        </a>
      </div>
    </motion.article>
  );
}
