import React, { useState } from "react";
import { Copy, Check, Sparkles, Sliders } from "lucide-react";

export const BoxShadowGenerator: React.FC = () => {
  const [layers, setLayers] = useState(4);
  const [transparency, setTransparency] = useState(0.12);
  const [blurMultiplier, setBlurMultiplier] = useState(16);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [copied, setCopied] = useState(false);

  // Convert hex color to rgb array
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `${r}, ${g}, ${b}`;
  };

  const rgb = hexToRgb(shadowColor);

  // Generate multi-layer shadow CSS string
  const shadowRules = Array.from({ length: layers })
    .map((_, i) => {
      const step = i + 1;
      const x = 0;
      const y = Math.round(Math.pow(step, 1.8) * 1.5);
      const blur = Math.round(Math.pow(step, 1.9) * (blurMultiplier / 10));
      const alpha = (transparency / Math.pow(1.5, i)).toFixed(3);
      return `${x}px ${y}px ${blur}px rgba(${rgb}, ${alpha})`;
    })
    .join(",\n  ");

  const cssCode = `box-shadow: ${shadowRules};`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="text-primary" size={20} /> Multi-Layered Box Shadow Generator
          </h3>
          <p className="text-xs text-muted-foreground/80 font-medium mt-0.5">
            Create smooth, natural CSS box shadows with realistic depth and opacity falloff.
          </p>
        </div>
        <button
          onClick={copyCode}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-primary/20 shrink-0"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "COPIED SHADOW!" : "COPY BOX-SHADOW CODE"}
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
        <div>
          <label htmlFor="shadow-layers" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Shadow Layers</span> <span className="text-primary font-bold">{layers}</span>
          </label>
          <input
            id="shadow-layers"
            type="range"
            min="1"
            max="6"
            value={layers}
            onChange={(e) => setLayers(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="blur-multiplier" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Blur Multiplier</span> <span className="text-primary font-bold">{blurMultiplier}</span>
          </label>
          <input
            id="blur-multiplier"
            type="range"
            min="4"
            max="40"
            value={blurMultiplier}
            onChange={(e) => setBlurMultiplier(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="shadow-opacity" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Opacity Falloff</span> <span className="text-primary font-bold">{(transparency * 100).toFixed(0)}%</span>
          </label>
          <input
            id="shadow-opacity"
            type="range"
            min="0.04"
            max="0.4"
            step="0.02"
            value={transparency}
            onChange={(e) => setTransparency(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="shadow-color" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5">Shadow Color</label>
          <div className="flex items-center gap-2">
            <input id="shadow-color" type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} aria-label="Shadow color picker" className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-transparent" />
            <input id="shadow-color-hex" type="text" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} aria-label="Shadow color hex text" className="w-full rounded-md border border-white/10 bg-background px-3 py-1.5 text-xs font-mono text-foreground" />
          </div>
        </div>
      </div>

      {/* Live Card Preview */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Live Card Elevation Preview</span>
        <div className="w-full h-64 rounded-xl border border-white/5 bg-background flex items-center justify-center p-6 relative">
          <div
            className="w-full max-w-sm h-36 rounded-2xl bg-surface border border-white/10 p-6 flex flex-col justify-between transition-all duration-300"
            style={{ boxShadow: shadowRules }}
          >
            <div>
              <span className="text-[10px] font-bold text-primary mono uppercase">Realistic Depth</span>
              <h4 className="text-sm font-semibold text-foreground mt-1">Multi-Layered CSS Elevation</h4>
            </div>
            <p className="text-[11px] text-muted-foreground">Notice how natural the shadow falloff looks without harsh edges.</p>
          </div>
        </div>
      </div>

      {/* Generated Code */}
      <div className="relative rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
        <pre>{cssCode}</pre>
      </div>
    </div>
  );
};
export default BoxShadowGenerator;
