import React from "react";
import { Smartphone, Tablet, Laptop, Monitor, Maximize2, Gauge } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface TypeScaleViewportSimulatorProps {
  currentWidth: number;
  minViewport: number;
  maxViewport: number;
  onWidthChange: (width: number) => void;
}

const BREAKPOINTS = [
  { id: "mobile", width: 375, label: "375px", sub: "Mobile", icon: Smartphone },
  { id: "tablet", width: 768, label: "768px", sub: "Tablet", icon: Tablet },
  { id: "laptop", width: 1024, label: "1024px", sub: "Laptop", icon: Laptop },
  { id: "desktop", width: 1280, label: "1280px", sub: "Desktop", icon: Monitor },
  { id: "wide", width: 1440, label: "1440px", sub: "Wide", icon: Maximize2 },
];

export default function TypeScaleViewportSimulator({
  currentWidth,
  minViewport,
  maxViewport,
  onWidthChange,
}: TypeScaleViewportSimulatorProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  // Determine viewport scaling state
  const getState = () => {
    if (currentWidth <= minViewport) {
      return {
        label: isAz ? "Minimum Sabit Ölçü (W ≤ Wmin)" : "Clamped at Minimum (W ≤ Wmin)",
        color: "text-amber-400 border-amber-400/30 bg-amber-400/10",
      };
    }
    if (currentWidth >= maxViewport) {
      return {
        label: isAz ? "Maksimum Sabit Ölçü (W ≥ Wmax)" : "Clamped at Maximum (W ≥ Wmax)",
        color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
      };
    }
    const percent = Math.round(((currentWidth - minViewport) / (maxViewport - minViewport)) * 100);
    return {
      label: isAz ? `Dinamik Axıcı İnterpolyasiya (${percent}%)` : `Fluid Linear Interpolation (${percent}%)`,
      color: "text-sky-400 border-sky-400/30 bg-sky-400/10",
    };
  };

  const state = getState();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl shadow-lg space-y-4">
      {/* Top Bar: Title & Active State Badge */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Gauge size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
            {isAz ? "EKRAN ENİ SİMULYATORU" : "VIEWPORT SIMULATOR"}
          </h3>
        </div>

        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[10px] font-bold mono ${state.color}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          {state.label}
        </div>
      </div>

      {/* Breakpoint Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {BREAKPOINTS.map((bp) => {
          const Icon = bp.icon;
          const isActive = currentWidth === bp.width;

          return (
            <button
              key={bp.id}
              onClick={() => onWidthChange(bp.width)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all mono ${
                isActive
                  ? "border-primary bg-primary text-black font-bold shadow-md shadow-primary/20"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
              }`}
            >
              <Icon size={14} />
              <span>{bp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Range Slider & Computed Indicator */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs mono">
          <span className="text-muted-foreground">{isAz ? "Cari Simulyasiya Eni:" : "Simulated Canvas Width:"}</span>
          <span className="text-sm font-bold text-primary">{currentWidth}px</span>
        </div>

        <input
          type="range"
          min="320"
          max="1600"
          step="5"
          value={currentWidth}
          onChange={(e) => onWidthChange(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-muted-foreground/60 mono">
          <span>320px</span>
          <span className="text-amber-400">Min: {minViewport}px</span>
          <span className="text-emerald-400">Max: {maxViewport}px</span>
          <span>1600px</span>
        </div>
      </div>
    </div>
  );
}
