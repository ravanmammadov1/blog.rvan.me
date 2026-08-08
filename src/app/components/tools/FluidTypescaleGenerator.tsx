import React, { useState } from "react";
import { Copy, Check, Type, Sliders } from "lucide-react";

export const FluidTypescaleGenerator: React.FC = () => {
  const [minViewport, setMinViewport] = useState(320);
  const [maxViewport, setMaxViewport] = useState(1440);
  const [minFontSize, setMinFontSize] = useState(18);
  const [maxFontSize, setMaxFontSize] = useState(48);
  const [previewViewport, setPreviewViewport] = useState(800);
  const [copied, setCopied] = useState(false);

  // Compute CSS clamp() parameters: clamp(minRem, val, maxRem)
  const minRem = (minFontSize / 16).toFixed(4);
  const maxRem = (maxFontSize / 16).toFixed(4);

  const slope = (maxFontSize - minFontSize) / (maxViewport - minViewport);
  const yAxisIntersection = -minViewport * slope + minFontSize;
  const yAxisIntersectionRem = (yAxisIntersection / 16).toFixed(4);
  const slopeVw = (slope * 100).toFixed(4);

  const clampRule = `font-size: clamp(${minRem}rem, ${yAxisIntersectionRem}rem + ${slopeVw}vw, ${maxRem}rem);`;

  // Calculated font size for current preview slider
  const clampedPreviewPx = Math.min(
    maxFontSize,
    Math.max(minFontSize, minFontSize + (previewViewport - minViewport) * slope)
  ).toFixed(1);

  const copyRule = () => {
    navigator.clipboard.writeText(clampRule);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Type className="text-primary" size={20} /> Fluid Typography clamp() Generator
          </h3>
          <p className="text-xs text-muted-foreground/80 font-medium mt-0.5">
            Compute perfectly scaled fluid typography without media queries using CSS clamp().
          </p>
        </div>
        <button
          onClick={copyRule}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-primary/20 shrink-0"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "COPIED CLAMP()!" : "COPY CSS CLAMP()"}
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
        <div>
          <label htmlFor="min-font-size" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Min Font Size</span> <span className="text-primary font-bold">{minFontSize}px</span>
          </label>
          <input
            id="min-font-size"
            type="range"
            min="12"
            max="32"
            value={minFontSize}
            onChange={(e) => setMinFontSize(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="max-font-size" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Max Font Size</span> <span className="text-primary font-bold">{maxFontSize}px</span>
          </label>
          <input
            id="max-font-size"
            type="range"
            min="24"
            max="96"
            value={maxFontSize}
            onChange={(e) => setMaxFontSize(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="min-viewport" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Min Viewport</span> <span className="text-primary font-bold">{minViewport}px</span>
          </label>
          <input
            id="min-viewport"
            type="range"
            min="320"
            max="640"
            step="10"
            value={minViewport}
            onChange={(e) => setMinViewport(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="max-viewport" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Max Viewport</span> <span className="text-primary font-bold">{maxViewport}px</span>
          </label>
          <input
            id="max-viewport"
            type="range"
            min="960"
            max="1920"
            step="10"
            value={maxViewport}
            onChange={(e) => setMaxViewport(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Viewport Slider & Live Specimen Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase flex items-center gap-1">
            <Sliders size={12} /> Test Viewport Width: <span className="text-primary">{previewViewport}px</span>
          </span>
          <span className="text-[11px] font-bold text-emerald-400 mono">Computed: {clampedPreviewPx}px</span>
        </div>

        <input
          type="range"
          min="320"
          max="1600"
          value={previewViewport}
          onChange={(e) => setPreviewViewport(Number(e.target.value))}
          className="w-full accent-primary"
        />

        <div className="p-6 rounded-xl border border-white/10 bg-background/90 overflow-hidden">
          <p
            style={{ fontSize: `${clampedPreviewPx}px`, lineHeight: 1.2 }}
            className="font-semibold text-foreground transition-all duration-150 line-clamp-2"
          >
            Responsive fluid typography scales smoothly across devices.
          </p>
        </div>
      </div>

      {/* Generated CSS Code */}
      <div className="relative rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
        <pre>{clampRule}</pre>
      </div>
    </div>
  );
};
export default FluidTypescaleGenerator;
