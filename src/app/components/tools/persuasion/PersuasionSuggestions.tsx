import React from "react";
import { ActionableSuggestion, CopyType } from "../../../../lib/marketing/persuasionEngine";
import { Lightbulb, ArrowRight, CheckCheck, Sparkles } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface PersuasionSuggestionsProps {
  suggestions: ActionableSuggestion[];
  copyType: CopyType;
}

export default function PersuasionSuggestions({ suggestions, copyType }: PersuasionSuggestionsProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  if (suggestions.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-2">
        <CheckCheck size={28} className="mx-auto text-emerald-400" />
        <h4 className="text-sm font-bold text-emerald-300">
          {isAz ? "Mətn Yüksək Konversiya Standartlarına Cavab Verir" : "High-Performance Copywriting Standard Achieved"}
        </h4>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto">
          {isAz
            ? "Mətninizdə aydınlıq, konkretlik və nəticə yönümlülük optimal balansdadır. İstehsalatda A/B testi aparmağa tam hazırdır."
            : "Your copy demonstrates strong clarity, verifiable specificity, and low cognitive friction. Ready for live multivariate or A/B testing."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mono">
            {isAz ? "FƏALİYYƏTƏ YÖNƏLİK TƏKMİLLƏŞDİRMƏ TÖVSİYƏLƏRİ" : "ACTIONABLE REWRITE & OPTIMIZATION LEVERS"}
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground mono">
          {suggestions.length} {isAz ? "tövsiyə" : "levers"}
        </span>
      </div>

      {/* Suggestion Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary mono">
                <Sparkles size={11} /> {isAz ? s.category_az : s.category}
              </span>
              <p className="text-xs text-foreground font-medium leading-relaxed">
                {isAz ? s.tip_az : s.tip}
              </p>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary/90 font-mono leading-snug">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                {isAz ? "Nümunə Forma:" : "Exemplar Transform:"}
              </span>
              {s.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
