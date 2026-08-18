import React from "react";
import { PersuasionDimension } from "../../../../lib/marketing/persuasionEngine";
import { CheckCircle2, AlertCircle, Sparkles, HelpCircle } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface PersuasionDimensionCardsProps {
  dimensions: PersuasionDimension[];
}

export default function PersuasionDimensionCards({ dimensions }: PersuasionDimensionCardsProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
            {isAz ? "6 KOQNİTİV VƏ PSİXOLOJİ DİMENZİYA" : "6 COGNITIVE & PSYCHOLOGICAL DIMENSIONS"}
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground mono">
          {isAz ? "Dəqiq detallı audit" : "Detailed breakdown & triggers"}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dimensions.map((dim) => {
          const isStrong = dim.status === "strong";
          const isModerate = dim.status === "moderate";

          let scoreBadge = "text-rose-400 border-rose-500/30 bg-rose-500/10";
          let borderAccent = "hover:border-rose-500/40";
          if (isStrong) {
            scoreBadge = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
            borderAccent = "hover:border-emerald-500/40";
          } else if (isModerate) {
            scoreBadge = "text-sky-400 border-sky-500/30 bg-sky-500/10";
            borderAccent = "hover:border-sky-500/40";
          }

          return (
            <div
              key={dim.id}
              className={`rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 ${borderAccent} flex flex-col justify-between space-y-4`}
            >
              <div>
                {/* Dimension Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-foreground">
                    {isAz ? dim.name_az : dim.name}
                  </h4>
                  <span className={`rounded-xl border px-2.5 py-1 text-xs font-mono font-bold shrink-0 ${scoreBadge}`}>
                    {dim.score}/100
                  </span>
                </div>

                {/* Summary */}
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {isAz ? dim.summary_az : dim.summary}
                </p>

                {/* Positives List */}
                {dim.positives.length > 0 && (
                  <div className="mt-4 space-y-1.5 pt-3 border-t border-white/5">
                    {dim.positives.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-emerald-300 leading-snug">
                        <CheckCircle2 size={13} className="shrink-0 text-emerald-400 mt-0.5" />
                        <span>{isAz ? p.az : p.en}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Improvements List */}
                {dim.improvements.length > 0 && (
                  <div className="mt-3 space-y-1.5 pt-2 border-t border-white/5">
                    {dim.improvements.map((imp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-amber-300/90 leading-snug">
                        <AlertCircle size={13} className="shrink-0 text-amber-400 mt-0.5" />
                        <span>{isAz ? imp.az : imp.en}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Detected Triggers Footer */}
              {dim.detectedTriggers.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1 text-[10px] font-mono text-muted-foreground/70">
                  {dim.detectedTriggers.map((t, idx) => (
                    <span key={idx} className="rounded bg-white/5 px-1.5 py-0.5">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
