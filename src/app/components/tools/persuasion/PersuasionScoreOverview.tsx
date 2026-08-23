import React from "react";
import { PersuasionAnalysis } from "../../../../lib/marketing/persuasionEngine";
import { Zap, ShieldCheck, UserCheck, AlertOctagon, Sparkles, Clock, CheckCircle } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface PersuasionScoreOverviewProps {
  analysis: PersuasionAnalysis;
}

export default function PersuasionScoreOverview({ analysis }: PersuasionScoreOverviewProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const {
    overallScore,
    ratingTier,
    wordCount,
    readingTimeSec,
    pronounBalance,
    powerWordsDetected,
    frictionWordsDetected,
    vagueWordsDetected,
  } = analysis;

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* 1. Primary Overall Impact Score Card (7 cols) */}
      <div className="md:col-span-7 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                {isAz ? "PERSUASİV TƏSİR İNDEKSİ" : "PERSUASION IMPACT INDEX"}
              </h3>
            </div>

            <div className={`inline-flex items-center rounded-xl border px-3 py-1 text-xs font-bold mono ${ratingTier.badgeColor}`}>
              {isAz ? ratingTier.label_az : ratingTier.label}
            </div>
          </div>

          {/* Large Score Metric Readout */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mono">
                COGNITIVE IMPACT SCORE
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl sm:text-7xl font-black tracking-tight text-foreground font-mono">
                  {overallScore}
                </span>
                <span className="text-sm text-muted-foreground/80 mono">/ 100</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex sm:flex-col gap-4 text-xs mono text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-primary" />
                <span>{readingTimeSec}s {isAz ? "oxuma vaxtı" : "read time"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck size={13} className={pronounBalance.isUserCentric ? "text-emerald-400" : "text-amber-400"} />
                <span>{pronounBalance.ratioLabel}</span>
              </div>
            </div>
          </div>

          {/* Score Meter Bar */}
          <div className="mt-6 space-y-2">
            <div className="relative h-3 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400"
                style={{ width: `${Math.max(5, overallScore)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground/60 mono">
              <span>0 (Weak)</span>
              <span>50 (Average)</span>
              <span>75 (Strong)</span>
              <span>90+ (High Converting)</span>
            </div>
          </div>
        </div>

        {/* Qualitative Description */}
        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3.5 text-xs text-muted-foreground leading-relaxed">
          {isAz ? ratingTier.description_az : ratingTier.description}
        </div>
      </div>

      {/* 2. Detected Psychological Triggers Summary (5 cols) */}
      <div className="md:col-span-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                {isAz ? "AŞKARLANAN SÖZ SİQNALLARI" : "DETECTED COPY SIGNALS"}
              </h3>
            </div>
            <span className="text-[10px] text-muted-foreground mono">Heuristic Audit</span>
          </div>

          {/* Signal Category Pills */}
          <div className="mt-4 space-y-3 text-xs">
            {/* Power Words */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mono">
                <CheckCircle size={12} /> {isAz ? "Güclü Fəaliyyət Felləri" : "Power & Outcome Words"} ({powerWordsDetected.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {powerWordsDetected.length > 0 ? (
                  powerWordsDetected.map((w, idx) => (
                    <span key={idx} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 font-mono">
                      {w}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground/60 text-[11px] italic">{isAz ? "Güclü fəaliyyət feli tapılmadı" : "No high-potency power words"}</span>
                )}
              </div>
            </div>

            {/* Friction Words */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mono">
                <AlertOctagon size={12} /> {isAz ? "Müqavimət Yaradan Sözlər" : "Friction / Resistance Words"} ({frictionWordsDetected.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {frictionWordsDetected.length > 0 ? (
                  frictionWordsDetected.map((w, idx) => (
                    <span key={idx} className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-300 font-mono">
                      {w}
                    </span>
                  ))
                ) : (
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                    ✓ {isAz ? "Sıfır müqavimət sözü (əla)" : "Zero friction triggers detected"}
                  </span>
                )}
              </div>
            </div>

            {/* Vague Buzzwords */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 mono">
                <ShieldCheck size={12} /> {isAz ? "Qeyri-Müəyyən Təriflər" : "Vague Superlatives"} ({vagueWordsDetected.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vagueWordsDetected.length > 0 ? (
                  vagueWordsDetected.map((w, idx) => (
                    <span key={idx} className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-300 font-mono">
                      {w}
                    </span>
                  ))
                ) : (
                  <span className="text-emerald-400 text-[11px]">
                    ✓ {isAz ? "Sıfır boş tərif (təmiz dil)" : "Clean empirical vocabulary"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
