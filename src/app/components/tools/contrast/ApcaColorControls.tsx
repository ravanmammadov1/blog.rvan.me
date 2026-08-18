import React from "react";
import { ArrowLeftRight, Sparkles, SlidersHorizontal, Palette } from "lucide-react";
import { CONTRAST_PRESETS, ContrastPreset, isValidHex, normalizeHex } from "../../../../lib/accessibility/apcaEngine";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface ApcaColorControlsProps {
  fgColor: string;
  bgColor: string;
  onFgChange: (hex: string) => void;
  onBgChange: (hex: string) => void;
  onSwap: () => void;
  onSelectPreset: (preset: ContrastPreset) => void;
}

export default function ApcaColorControls({
  fgColor,
  bgColor,
  onFgChange,
  onBgChange,
  onSwap,
  onSelectPreset,
}: ApcaColorControlsProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const handleFgInput = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith("#") && /^[0-9A-Fa-f]{1,6}$/.test(clean)) {
      clean = `#${clean}`;
    }
    onFgChange(clean);
  };

  const handleBgInput = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith("#") && /^[0-9A-Fa-f]{1,6}$/.test(clean)) {
      clean = `#${clean}`;
    }
    onBgChange(clean);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mono">
            {isAz ? "RƏNG SEÇİMİ VƏ PALİTRA" : "COLOR INPUTS & PALETTE"}
          </h2>
        </div>
      </div>

      {/* Color Inputs Row with Swap Button */}
      <div className="grid gap-4 sm:grid-cols-11 items-center">
        {/* Foreground Color Input (5 cols) */}
        <div className="sm:col-span-5 rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="text-muted-foreground mono">
              {isAz ? "Mətn Rəngi (Foreground)" : "Text Color (Foreground)"}
            </span>
            <span className="text-primary font-bold mono">
              {isValidHex(fgColor) ? normalizeHex(fgColor) : "..."}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Color Swatch Picker */}
            <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden border border-white/20 shadow-inner">
              <input
                type="color"
                value={isValidHex(fgColor) ? normalizeHex(fgColor) : "#FFFFFF"}
                onChange={(e) => onFgChange(e.target.value)}
                className="absolute -inset-2 h-16 w-16 cursor-pointer opacity-100"
                aria-label="Pick foreground color"
              />
            </div>

            {/* HEX Input */}
            <div className="flex-1">
              <input
                type="text"
                value={fgColor}
                onChange={(e) => handleFgInput(e.target.value)}
                placeholder="#FFFFFF"
                maxLength={7}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none mono"
                aria-label="Foreground HEX color code"
              />
            </div>
          </div>
        </div>

        {/* Swap Button (1 col) */}
        <div className="sm:col-span-1 flex justify-center py-1 sm:py-0">
          <button
            onClick={onSwap}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:border-primary hover:bg-primary hover:text-black transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={isAz ? "Rəngləri Dəyişdir (FG ↔ BG)" : "Swap Colors (Foreground ↔ Background)"}
            aria-label="Swap foreground and background colors"
          >
            <ArrowLeftRight size={15} className="transition-transform group-hover:rotate-180 duration-300" />
          </button>
        </div>

        {/* Background Color Input (5 cols) */}
        <div className="sm:col-span-5 rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="text-muted-foreground mono">
              {isAz ? "Fon Rəngi (Background)" : "Background Color"}
            </span>
            <span className="text-primary font-bold mono">
              {isValidHex(bgColor) ? normalizeHex(bgColor) : "..."}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Color Swatch Picker */}
            <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden border border-white/20 shadow-inner">
              <input
                type="color"
                value={isValidHex(bgColor) ? normalizeHex(bgColor) : "#000000"}
                onChange={(e) => onBgChange(e.target.value)}
                className="absolute -inset-2 h-16 w-16 cursor-pointer opacity-100"
                aria-label="Pick background color"
              />
            </div>

            {/* HEX Input */}
            <div className="flex-1">
              <input
                type="text"
                value={bgColor}
                onChange={(e) => handleBgInput(e.target.value)}
                placeholder="#000000"
                maxLength={7}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none mono"
                aria-label="Background HEX color code"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preset Palettes */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mono">
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-primary" />
            {isAz ? "Nümunə Palitralar" : "Curated Preset Pairs"}
          </span>
          <span className="text-[10px] text-muted-foreground/60">{CONTRAST_PRESETS.length} {isAz ? "nümunə" : "presets"}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CONTRAST_PRESETS.map((p) => {
            const isSelected =
              normalizeHex(fgColor) === normalizeHex(p.fg) &&
              normalizeHex(bgColor) === normalizeHex(p.bg);

            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p)}
                className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {/* Visual Swatch Pill */}
                <div
                  className="h-7 w-7 rounded-lg border border-white/20 flex items-center justify-center shrink-0 shadow-sm font-bold text-xs"
                  style={{ backgroundColor: p.bg, color: p.fg }}
                >
                  Aa
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-foreground">
                    {isAz ? p.name_az : p.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground/70 mono">
                    {p.fg} on {p.bg}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
