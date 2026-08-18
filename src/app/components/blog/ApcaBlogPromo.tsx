import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Eye, ArrowUpRight, ShieldCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

export default function ApcaBlogPromo() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <section
      aria-label={isAz ? "APCA Kontrast Aləti" : "APCA Contrast Utility"}
      className="my-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 sm:p-8 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-primary/40"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left text & badge */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary mono">
              <Eye size={12} />
              {isAz ? "YENİ DİZAYN ALƏTİ" : "FEATURED DESIGN TOOL"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-[10px] font-bold text-sky-400 mono">
              <ShieldCheck size={11} /> W3C Silver / APCA 0.98G
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isAz
              ? "APCA Kontrast Matrisi və Rəng Əlçatanlığı Yoxlayıcısı"
              : "APCA Contrast Matrix & Color Accessibility Checker"}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isAz
              ? "Ənənəvi 4.5:1 WCAG nisbətlərindən kənara çıxın. Şrift ölçüsü, çəkisi və ekran parıltısına əsaslanan 2D tipoqrafiya matrisi ilə rənglərinizin həqiqi oxunaqlığını test edin."
              : "Move beyond rigid 4.5:1 ratios. Evaluate perceptual contrast with font-weight and spatial-frequency modeling across light and dark modes with a 2D compliance grid."}
          </p>
        </div>

        {/* Right CTA & Mini Preview Pill */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
          {/* Mini Visual Swatch Pill */}
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-mono">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-foreground font-bold">Lc +106.0</span>
            <span className="text-muted-foreground/70">· Optimal Body</span>
          </div>

          {/* Action Link */}
          <Link
            to={getLocalizedPath("/tools/contrast-matrix")}
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-primary/90 shadow-md mono"
          >
            <span>{isAz ? "Aləti Başlat" : "Launch Contrast Tool"}</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
