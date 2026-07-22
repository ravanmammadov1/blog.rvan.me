import { useState, useMemo } from "react";
import { Copy, Check, Sparkles, Sliders } from "lucide-react";

// Calculate relative luminance based on W3C WCAG 2.1 algorithm
function getLuminance(hex: string): number {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) return 0;

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

const COLOR_PRESETS = [
  { name: "Neon Lime", hex: "#E2FE52" },
  { name: "Dark Surface", hex: "#0B0C10" },
  { name: "Crimson Red", hex: "#E03616" },
  { name: "Off White", hex: "#F4F3EF" },
  { name: "Muted Gray", hex: "#94A3B8" },
  { name: "Deep Charcoal", hex: "#1A1D24" },
];

export default function ColorContrastTool() {
  const [textColor, setTextColor] = useState("#E2FE52");
  const [bgColor, setBgColor] = useState("#0B0C10");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const ratio = useMemo(() => {
    return getContrastRatio(textColor, bgColor);
  }, [textColor, bgColor]);

  const formattedRatio = ratio.toFixed(2);

  const passesAALarge = ratio >= 3.0;
  const passesAANormal = ratio >= 4.5;
  const passesAAA = ratio >= 7.0;

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-surface p-8 shadow-2xl my-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase mb-1">
            <Sparkles size={14} />
            <span>INTERACTIVE DESIGN MINI-TOOL</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            WCAG Color Contrast & Accessibility Checker
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold tracking-tighter text-primary mono">
            {formattedRatio}:1
          </span>
          <span className="text-xs text-muted-foreground uppercase mono">Ratio</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <label className="flex items-center justify-between text-xs font-bold tracking-wider text-muted-foreground mono uppercase mb-2">
              <span>TEXT COLOR</span>
              <span className="text-foreground">{textColor}</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-border bg-transparent p-1"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-xs text-foreground mono uppercase focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-bold tracking-wider text-muted-foreground mono uppercase mb-2">
              <span>BACKGROUND COLOR</span>
              <span className="text-foreground">{bgColor}</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-border bg-transparent p-1"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-xs text-foreground mono uppercase focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">
              PRESET BRAND SWATCHES
            </span>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setTextColor(p.hex)}
                  className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-foreground hover:border-primary transition-colors"
                >
                  <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: p.hex }} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className="rounded-xl p-8 border border-white/10 shadow-lg transition-colors duration-300 min-h-[220px] flex flex-col justify-between"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase mono opacity-80">
                LIVE INTERACTIVE PREVIEW
              </span>
              <h3 className="text-3xl font-semibold tracking-tight mt-2">
                Visual Energy & High-Impact Creative
              </h3>
              <p className="mt-3 text-sm leading-relaxed opacity-90">
                Good typography isn't just legibility — it's emotional resonance and accessible contrast working in harmony.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-current/15">
              <button
                onClick={() => handleCopy(textColor)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mono hover:underline"
              >
                {copiedColor === textColor ? <Check size={14} /> : <Copy size={14} />}
                <span>COPY TEXT HEX</span>
              </button>
              <button
                onClick={() => handleCopy(bgColor)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mono hover:underline ml-4"
              >
                {copiedColor === bgColor ? <Check size={14} /> : <Copy size={14} />}
                <span>COPY BG HEX</span>
              </button>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-lg border p-4 text-center ${passesAALarge ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>
              <p className="text-[10px] font-bold tracking-widest uppercase mono">AA LARGE (3.0+)</p>
              <p className="text-lg font-bold mt-1">{passesAALarge ? "PASS ✓" : "FAIL ✗"}</p>
            </div>

            <div className={`rounded-lg border p-4 text-center ${passesAANormal ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>
              <p className="text-[10px] font-bold tracking-widest uppercase mono">AA NORMAL (4.5+)</p>
              <p className="text-lg font-bold mt-1">{passesAANormal ? "PASS ✓" : "FAIL ✗"}</p>
            </div>

            <div className={`rounded-lg border p-4 text-center ${passesAAA ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>
              <p className="text-[10px] font-bold tracking-widest uppercase mono">AAA (7.0+)</p>
              <p className="text-lg font-bold mt-1">{passesAAA ? "PASS ✓" : "FAIL ✗"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
