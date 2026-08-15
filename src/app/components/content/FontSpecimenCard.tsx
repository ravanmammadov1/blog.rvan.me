import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, Download } from "lucide-react";
import { FontItem, getFontSlug, resolveDirectFontDownloadUrl } from "../../../lib/fontEngine";
import { loadFontOnDemand } from "../../../lib/fontLoader";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

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
  const { t, getLocalizedPath } = useLanguage();

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

  const detailPath = getLocalizedPath(`/fonts/${getFontSlug(font)}`);

  return (
    <motion.article
      ref={cardRef}
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      custom={(idx % 20) * 0.02}
      className="group p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-[#61c5ad]/40 glass flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(97,197,173,0.18)]"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="flex items-center gap-1 rounded-full border border-[#61c5ad]/35 bg-gradient-to-r from-[#61c5ad]/12 via-[#426fba]/12 to-[#984f9f]/12 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#61c5ad] mono">
            {font.category}
          </span>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground mono">
            {font.isVariable && (
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-cyan-400">
                VARIABLE
              </span>
            )}
            <span>{font.stylesCount} {t("styles", "Styles")}</span>
          </div>
        </div>

        {/* Font Family Name with Crawlable Link */}
        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          <Link to={detailPath} className="hover:underline">
            {font.name}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground mono mt-0.5">
          {t("designedBy", "Designed by")} <span className="text-foreground/90 font-semibold">{font.designer}</span> · {font.foundry}
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
        <Link
          to={detailPath}
          className="text-[11px] text-primary hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1"
        >
          {t("specimenAndDetails", "SPECIMEN & DETAILS")} →
        </Link>
        <a
          href={resolveDirectFontDownloadUrl(font)}
          download={`${font.family}.zip`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
        >
          ZIP <Download size={11} />
        </a>
      </div>
    </motion.article>
  );
}
