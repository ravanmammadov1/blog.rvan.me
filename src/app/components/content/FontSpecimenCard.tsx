import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
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
      className="group p-6 rounded-2xl liquid-glass-card liquid-glass-interactive flex flex-col justify-between"
    >
      <div className="relative z-10">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="rounded-md border border-border bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-foreground mono">
              {font.category}
            </span>
            {font.supportsAzerbaijani && (
              <span
                className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold mono uppercase"
                title="Verified Azerbaijani Latin support (Ə, ğ, ı, ö, ş, ü, ç)"
              >
                AZ / Ə
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground mono">
            {font.isVariable && (
              <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold">
                VARIABLE
              </span>
            )}
            <span>{font.stylesCount} {t("styles", "Styles")}</span>
          </div>
        </div>

        {/* Font Family Name with Crawlable Link */}
        <h3 className="text-xl font-bold tracking-tight text-card-foreground group-hover:text-primary transition-colors duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]">
          <Link to={detailPath} className="hover:underline">
            {font.name}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground mono mt-1">
          {t("designedBy", "Designed by")} <span className="text-foreground font-semibold">{font.designer}</span> · {font.foundry}
        </p>

        {/* Specimen Live Preview in Authentic Font Style */}
        <div className="my-4 p-4 rounded-xl border border-border bg-surface/60 group-hover:bg-surface/90 overflow-hidden min-h-[96px] flex items-center transition-colors duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]">
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
      <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-bold mono">
        <Link
          to={detailPath}
          className="text-[11px] text-primary hover:underline uppercase tracking-wider transition-colors flex items-center gap-1 group/cta"
        >
          <span>{t("specimenAndDetails", "SPECIMEN & DETAILS")}</span>
          <span className="transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/cta:translate-x-0.5">→</span>
        </Link>
        <a
          href={resolveDirectFontDownloadUrl(font)}
          download={`${font.family}.zip`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer shadow-sm"
        >
          ZIP <Download size={12} />
        </a>
      </div>
    </motion.article>
  );
}
