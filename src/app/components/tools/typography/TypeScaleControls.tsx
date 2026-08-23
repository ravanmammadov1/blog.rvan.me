import React from "react";
import { TypeScaleConfig, MODULAR_SCALE_PRESETS } from "../../../../lib/typography/typeScaleEngine";
import { Sliders, Monitor, Smartphone, Type, Settings2, Sparkles } from "lucide-react";
import { ShareToolButton } from "../ShareToolButton";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface TypeScaleControlsProps {
  config: TypeScaleConfig;
  onChange: (updated: Partial<TypeScaleConfig>) => void;
  onReset: () => void;
}

const FONT_OPTIONS = [
  { id: "Geist", label: "Geist Sans (Clean Modern)" },
  { id: "Inter", label: "Inter (UI Grotesque)" },
  { id: "Playfair Display", label: "Playfair Display (Luxury Serif)" },
  { id: "Space Grotesk", label: "Space Grotesk (Tech Editorial)" },
  { id: "Roboto", label: "Roboto (Neutral Standard)" },
  { id: "Fira Code", label: "Fira Code (Developer Mono)" },
];

export default function TypeScaleControls({
  config,
  onChange,
  onReset,
}: TypeScaleControlsProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const handlePresetSelect = (target: "min" | "max", ratio: number) => {
    if (target === "min") {
      onChange({ minScaleRatio: ratio });
    } else {
      onChange({ maxScaleRatio: ratio });
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl">
      {/* Section 1: Header with Reset Button and Share Action */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mono">
            {isAz ? "TİPOQRAFİYA PARAMETRLƏRİ" : "SCALE CONFIGURATION"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <ShareToolButton size="sm" />
          <button
            onClick={onReset}
            className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors mono uppercase"
            title="Reset to default settings"
          >
            {isAz ? "İlkin Vəziyyət" : "Reset"}
          </button>
        </div>
      </div>

      {/* Section 2: Font Family Preview Selector */}
      <div>
        <label className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground mono">
          <span className="flex items-center gap-1.5">
            <Type size={14} className="text-primary" />
            {isAz ? "Sınaq Şrifti" : "Specimen Font Family"}
          </span>
          <span className="text-[10px] text-primary">{config.fontFamily}</span>
        </label>
        <select
          value={config.fontFamily || "Geist"}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary mono"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.id} className="bg-neutral-900 text-white">
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Section 3: Base Font Sizes (Mobile & Desktop) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Min Base Size (Mobile) */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1 text-muted-foreground mono">
              <Smartphone size={13} /> {isAz ? "Mobil Əsas Ölçü" : "Min Base Size"}
            </span>
            <span className="text-primary font-bold mono">{config.minBaseFontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="24"
            step="1"
            value={config.minBaseFontSize}
            onChange={(e) => onChange({ minBaseFontSize: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60 mono">
            <span>12px</span>
            <span>16px (std)</span>
            <span>24px</span>
          </div>
        </div>

        {/* Max Base Size (Desktop) */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1 text-muted-foreground mono">
              <Monitor size={13} /> {isAz ? "Masaüstü Əsas Ölçü" : "Max Base Size"}
            </span>
            <span className="text-primary font-bold mono">{config.maxBaseFontSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="28"
            step="1"
            value={config.maxBaseFontSize}
            onChange={(e) => onChange({ maxBaseFontSize: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60 mono">
            <span>14px</span>
            <span>18px (opt)</span>
            <span>28px</span>
          </div>
        </div>
      </div>

      {/* Section 4: Modular Type Scale Ratios */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Min Scale Ratio (Mobile) */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="text-muted-foreground mono">
              {isAz ? "Mobil Miqyas Nisbəti" : "Mobile Scale Ratio"}
            </span>
            <span className="text-primary font-bold mono">{config.minScaleRatio}</span>
          </div>
          <select
            value={config.minScaleRatio}
            onChange={(e) => onChange({ minScaleRatio: Number(e.target.value) })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none mono"
          >
            {MODULAR_SCALE_PRESETS.map((p) => (
              <option key={`min-${p.id}`} value={p.ratio} className="bg-neutral-900 text-white">
                {p.ratio} — {isAz ? p.name_az : p.name} ({p.fraction})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.001"
              min="1.000"
              max="2.500"
              value={config.minScaleRatio}
              onChange={(e) => onChange({ minScaleRatio: Number(e.target.value) })}
              className="w-24 rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs text-primary font-bold mono focus:border-primary focus:outline-none"
            />
            <span className="text-[10px] text-muted-foreground mono">{isAz ? "Xüsusi nisbət" : "Custom ratio"}</span>
          </div>
        </div>

        {/* Max Scale Ratio (Desktop) */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="text-muted-foreground mono">
              {isAz ? "Masaüstü Miqyas Nisbəti" : "Desktop Scale Ratio"}
            </span>
            <span className="text-primary font-bold mono">{config.maxScaleRatio}</span>
          </div>
          <select
            value={config.maxScaleRatio}
            onChange={(e) => onChange({ maxScaleRatio: Number(e.target.value) })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none mono"
          >
            {MODULAR_SCALE_PRESETS.map((p) => (
              <option key={`max-${p.id}`} value={p.ratio} className="bg-neutral-900 text-white">
                {p.ratio} — {isAz ? p.name_az : p.name} ({p.fraction})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.001"
              min="1.000"
              max="2.500"
              value={config.maxScaleRatio}
              onChange={(e) => onChange({ maxScaleRatio: Number(e.target.value) })}
              className="w-24 rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs text-primary font-bold mono focus:border-primary focus:outline-none"
            />
            <span className="text-[10px] text-muted-foreground mono">{isAz ? "Xüsusi nisbət" : "Custom ratio"}</span>
          </div>
        </div>
      </div>

      {/* Section 5: Viewport Width Bounds */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Min Viewport */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="text-muted-foreground mono">{isAz ? "Min Ekran Eni (Wmin)" : "Min Viewport (Wmin)"}</span>
            <span className="text-primary font-bold mono">{config.minViewport}px</span>
          </div>
          <input
            type="range"
            min="300"
            max="600"
            step="5"
            value={config.minViewport}
            onChange={(e) => onChange({ minViewport: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60 mono">
            <span>320px (SE)</span>
            <span>375px (std)</span>
            <span>480px</span>
          </div>
        </div>

        {/* Max Viewport */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="text-muted-foreground mono">{isAz ? "Maks Ekran Eni (Wmax)" : "Max Viewport (Wmax)"}</span>
            <span className="text-primary font-bold mono">{config.maxViewport}px</span>
          </div>
          <input
            type="range"
            min="960"
            max="1920"
            step="20"
            value={config.maxViewport}
            onChange={(e) => onChange({ maxViewport: Number(e.target.value) })}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60 mono">
            <span>1024px</span>
            <span>1280px (std)</span>
            <span>1920px (4K)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
