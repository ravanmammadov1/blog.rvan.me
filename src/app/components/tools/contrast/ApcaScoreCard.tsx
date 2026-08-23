import React from "react";
import { ApcaEvaluation } from "../../../../lib/accessibility/apcaEngine";
import { ShieldCheck, AlertCircle, Info, Scale, Check, X } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface ApcaScoreCardProps {
  evaluation: ApcaEvaluation;
}

export default function ApcaScoreCard({ evaluation }: ApcaScoreCardProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const { lc, absLc, polarity, rating, wcag } = evaluation;

  // Calculate meter percentage (0 to 108 Lc)
  const meterPercent = Math.min(100, Math.round((absLc / 108) * 100));

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* 1. Primary APCA Lc Score Card (7 cols on Desktop) */}
      <div className="md:col-span-7 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6">
        <div>
          {/* Header & Polarity Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                {isAz ? "APCA PERSEPTUAL KONTRAST DƏRƏCƏSİ" : "APCA PERCEPTUAL CONTRAST"}
              </h3>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[10px] font-bold text-muted-foreground mono">
              {polarity === "normal"
                ? isAz ? "Normal Polyarlıq (Açıq Fonda Tünd Mətn)" : "Normal Polarity (Dark on Light)"
                : polarity === "reverse"
                ? isAz ? "Tərs Polyarlıq (Tünd Fonda Açıq Mətn)" : "Reverse Polarity (Light on Dark)"
                : isAz ? "Kontrast Yoxdur" : "Zero Contrast"}
            </div>
          </div>

          {/* Big Lc Metric Readout */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mono">
                LIGHTNESS CONTRAST
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-foreground font-mono">
                  Lc {lc > 0 ? `+${lc}` : lc}
                </span>
                <span className="text-xs text-muted-foreground/80 mono">/ 108 max</span>
              </div>
            </div>

            {/* Qualitative Rating Badge */}
            <div className={`inline-flex items-center rounded-xl border px-3.5 py-1.5 text-xs font-bold mono ${rating.badgeColor}`}>
              {isAz ? rating.label_az : rating.label}
            </div>
          </div>

          {/* Visual Contrast Scale Meter */}
          <div className="mt-6 space-y-2">
            <div className="relative h-3 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400"
                style={{ width: `${meterPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground/60 mono">
              <span>0 (Invisible)</span>
              <span>Lc 45 (Headline)</span>
              <span>Lc 75 (Body)</span>
              <span>Lc 90+ (Optimal)</span>
            </div>
          </div>
        </div>

        {/* Qualitative Explanation Text */}
        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3.5 text-xs text-muted-foreground leading-relaxed">
          {isAz ? rating.description_az : rating.description}
        </div>
      </div>

      {/* 2. Comparative WCAG 2.1 Card (5 cols on Desktop) */}
      <div className="md:col-span-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                {isAz ? "ƏNƏNƏVİ WCAG 2.1 NİSBƏTİ" : "TRADITIONAL WCAG 2.1"}
              </h3>
            </div>
            <span className="text-[10px] text-muted-foreground mono">Luminance Ratio</span>
          </div>

          {/* WCAG Numeric Ratio */}
          <div className="mt-6">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mono">
              MATHEMATICAL CONTRAST RATIO
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-foreground font-mono">
              {wcag.formattedRatio}
            </div>
          </div>

          {/* WCAG Compliance Badges Grid */}
          <div className="mt-6 space-y-2 text-xs mono">
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2">
              <span className="text-muted-foreground">WCAG AA Normal Text (≥4.5:1)</span>
              {wcag.aaNormalText ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <Check size={13} /> PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-rose-400">
                  <X size={13} /> FAIL
                </span>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2">
              <span className="text-muted-foreground">WCAG AAA Normal Text (≥7.0:1)</span>
              {wcag.aaaNormalText ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <Check size={13} /> PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-rose-400">
                  <X size={13} /> FAIL
                </span>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2">
              <span className="text-muted-foreground">WCAG AA Large Text & UI (≥3.0:1)</span>
              {wcag.uiComponent ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <Check size={13} /> PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-rose-400">
                  <X size={13} /> FAIL
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Note Footer */}
        <div className="text-[11px] text-muted-foreground/70 flex items-start gap-1.5 leading-snug">
          <Info size={14} className="shrink-0 text-sky-400 mt-0.5" />
          <span>
            {isAz
              ? "WCAG 2.1 riyazi nisbətə əsaslanır; APCA isə insan gözünün mətni fərqləndirmə qabiliyyətini (persepsiya) modelləşdirir."
              : "WCAG 2.1 evaluates mathematical luminance; APCA models human ocular vision, spatial frequency, and text weight."}
          </span>
        </div>
      </div>
    </div>
  );
}
