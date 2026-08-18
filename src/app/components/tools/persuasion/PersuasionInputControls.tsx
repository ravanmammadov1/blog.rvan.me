import React from "react";
import {
  CopyType,
  PERSUASION_PRESETS,
  PersuasionPreset,
} from "../../../../lib/marketing/persuasionEngine";
import { Type, MousePointerClick, MessageSquare, Sparkles, RotateCcw, PenTool } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface PersuasionInputControlsProps {
  copyType: CopyType;
  inputText: string;
  wordCount: number;
  charCount: number;
  onCopyTypeChange: (type: CopyType) => void;
  onInputChange: (text: string) => void;
  onSelectPreset: (preset: PersuasionPreset) => void;
  onClear: () => void;
}

export default function PersuasionInputControls({
  copyType,
  inputText,
  wordCount,
  charCount,
  onCopyTypeChange,
  onInputChange,
  onSelectPreset,
  onClear,
}: PersuasionInputControlsProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <PenTool size={18} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mono">
            {isAz ? "KOPİRAYTİNQ ANALİZ SAHƏSİ" : "COPYWRITING INPUT & FORMAT"}
          </h2>
        </div>

        {/* Copy Type Segmented Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
          <button
            onClick={() => onCopyTypeChange("headline")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all mono ${
              copyType === "headline"
                ? "bg-primary text-black shadow-md"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Type size={13} />
            <span>{isAz ? "Başlıq" : "Headline"}</span>
          </button>

          <button
            onClick={() => onCopyTypeChange("cta")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all mono ${
              copyType === "cta"
                ? "bg-primary text-black shadow-md"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <MousePointerClick size={13} />
            <span>{isAz ? "CTA Düyməsi" : "CTA Button"}</span>
          </button>

          <button
            onClick={() => onCopyTypeChange("value_prop")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all mono ${
              copyType === "value_prop"
                ? "bg-primary text-black shadow-md"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <MessageSquare size={13} />
            <span>{isAz ? "Dəyər Təklifi" : "Value Prop"}</span>
          </button>
        </div>
      </div>

      {/* Main Textarea Input */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={
              copyType === "headline"
                ? isAz
                  ? "Məsələn: 'Dizayn sistemlərinizi 3 qat daha sürətli qurun və xətalara son qoyun.'"
                  : "e.g., 'Ship enterprise design systems 3x faster with zero token drift.'"
                : copyType === "cta"
                ? isAz
                  ? "Məsələn: 'Pulsuz Rezyumemi İndi Yarat (Kart tələb olunmur)'"
                  : "e.g., 'Get My Free Vector Kit (No Card Required)'"
                : isAz
                ? "Məsələn: '14,000+ proqramçı tərəfindən etibar edilən əlçatanlıq platforması. 14 günlük pulsuz sınaq, istənilən vaxt ləğv edin.'"
                : "e.g., 'Trusted by 14,000+ engineers to eliminate accessibility violations before code review. Free 14-day trial, cancel anytime.'"
            }
            rows={copyType === "cta" ? 2 : copyType === "headline" ? 3 : 4}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm sm:text-base font-medium text-foreground focus:border-primary focus:outline-none leading-relaxed transition-all placeholder:text-muted-foreground/40 resize-y"
            aria-label="Copy input to analyze"
          />

          {inputText && (
            <button
              onClick={onClear}
              className="absolute top-3 right-3 rounded-lg border border-white/10 bg-white/5 p-1.5 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors text-xs"
              title="Clear input"
              aria-label="Clear copy input"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </div>

        {/* Live Metrix Bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground/70 mono px-1">
          <div className="flex items-center gap-4">
            <span>
              <strong className="text-foreground">{wordCount}</strong> {isAz ? "söz" : "words"}
            </span>
            <span>
              <strong className="text-foreground">{charCount}</strong> {isAz ? "simvol" : "chars"}
            </span>
          </div>

          <div className="text-[11px] text-muted-foreground/50">
            {isAz ? "100% lokal və gizli analiz" : "100% Client-Side & Private"}
          </div>
        </div>
      </div>

      {/* Preset Inspirations */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mono">
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-primary" />
            {isAz ? "Nümunə Mətn Presetsləri" : "Benchmark Copy Presets"}
          </span>
          <span className="text-[10px] text-muted-foreground/50">
            {PERSUASION_PRESETS.length} {isAz ? "nümunə" : "presets"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PERSUASION_PRESETS.map((p) => {
            const isSelected = inputText === p.text;

            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p)}
                className={`flex flex-col text-left rounded-xl border p-3 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="truncate text-xs font-bold text-foreground">
                    {isAz ? p.name_az : p.name}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary mono border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full shrink-0">
                    {p.type}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-snug">
                  "{p.text}"
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
