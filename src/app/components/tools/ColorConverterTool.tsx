import React, { useState } from "react";
import { Copy, Check, Palette, CheckCircle2, XCircle } from "lucide-react";

export const ColorConverterTool: React.FC = () => {
  const [colorHex, setColorHex] = useState("#e8fd52");
  const [bgHex, setBgHex] = useState("#0a0a0a");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // HEX to RGB helper
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return { r, g, b };
  };

  // RGB to HSL helper
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const mainRgb = hexToRgb(colorHex);
  const mainHsl = rgbToHsl(mainRgb.r, mainRgb.g, mainRgb.b);

  const rgbString = `rgb(${mainRgb.r}, ${mainRgb.g}, ${mainRgb.b})`;
  const hslString = `hsl(${mainHsl.h}, ${mainHsl.s}%, ${mainHsl.l}%)`;

  // WCAG Contrast Ratio Math
  const luminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const bgRgb = hexToRgb(bgHex);
  const l1 = luminance(mainRgb.r, mainRgb.g, mainRgb.b);
  const l2 = luminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const ratioFixed = ratio.toFixed(2);

  const passAA = ratio >= 4.5;
  const passAALarge = ratio >= 3;
  const passAAA = ratio >= 7;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Palette className="text-primary" size={20} /> Color Converter & WCAG Contrast Checker
          </h3>
          <p className="text-xs text-muted-foreground/80 font-medium mt-0.5">
            Convert HEX, RGB, HSL values and evaluate WCAG 2.1 AA/AAA accessibility compliance.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
        <div>
          <label htmlFor="primary-foreground-color" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">Foreground / Text Color</label>
          <div className="flex items-center gap-3">
            <input id="primary-foreground-color" type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} aria-label="Foreground color picker" className="h-10 w-16 cursor-pointer rounded border border-white/10 bg-transparent" />
            <input id="primary-foreground-hex" type="text" value={colorHex} onChange={(e) => setColorHex(e.target.value)} aria-label="Foreground color hex input" className="flex-1 rounded-md border border-white/10 bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="primary-background-color" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">Background Color</label>
          <div className="flex items-center gap-3">
            <input id="primary-background-color" type="color" value={bgHex} onChange={(e) => setBgHex(e.target.value)} aria-label="Background color picker" className="h-10 w-16 cursor-pointer rounded border border-white/10 bg-transparent" />
            <input id="primary-background-hex" type="text" value={bgHex} onChange={(e) => setBgHex(e.target.value)} aria-label="Background color hex input" className="flex-1 rounded-md border border-white/10 bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Converted Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground mono block uppercase">HEX</span>
            <span className="text-sm font-mono font-bold text-foreground">{colorHex.toUpperCase()}</span>
          </div>
          <button onClick={() => copyToClipboard(colorHex, "hex")} aria-label="Copy HEX value" className="text-muted-foreground hover:text-primary transition-colors">
            {copiedKey === "hex" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground mono block uppercase">RGB</span>
            <span className="text-sm font-mono font-bold text-foreground">{rgbString}</span>
          </div>
          <button onClick={() => copyToClipboard(rgbString, "rgb")} aria-label="Copy RGB value" className="text-muted-foreground hover:text-primary transition-colors">
            {copiedKey === "rgb" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground mono block uppercase">HSL</span>
            <span className="text-sm font-mono font-bold text-foreground">{hslString}</span>
          </div>
          <button onClick={() => copyToClipboard(hslString, "hsl")} aria-label="Copy HSL value" className="text-muted-foreground hover:text-primary transition-colors">
            {copiedKey === "hsl" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* WCAG Contrast Ratio Result */}
      <div className="p-6 rounded-xl border border-white/10 bg-background/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground mono uppercase block">Contrast Ratio</span>
            <span className="text-3xl font-bold font-mono text-primary">{ratioFixed} : 1</span>
          </div>
          <div className="flex gap-2">
            {[
              { label: "AA Normal", pass: passAA },
              { label: "AA Large", pass: passAALarge },
              { label: "AAA Normal", pass: passAAA },
            ].map(({ label, pass }) => (
              <span key={label} className={`rounded-full px-3 py-1 text-[10px] font-bold mono uppercase flex items-center gap-1 ${pass ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                {pass ? <CheckCircle2 size={11} /> : <XCircle size={11} />} {label}
              </span>
            ))}
          </div>
        </div>

        {/* Live Contrast Preview Box */}
        <div className="p-6 rounded-lg border border-white/10" style={{ backgroundColor: bgHex, color: colorHex }}>
          <p className="text-lg font-bold">Contrast Accessibility Preview</p>
          <p className="text-xs mt-1">This text demonstrates real-time contrast readability at {ratioFixed}:1 ratio.</p>
        </div>
      </div>
    </div>
  );
};
export default ColorConverterTool;
