import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Palette, Type, Image, Code2, Globe, Zap, Eye, TrendingUp, Sliders,
  Copy, Check, RefreshCw, ChevronDown, ChevronUp, AlertTriangle
} from "lucide-react";

// ─── Color Contrast Tool ───
function ColorContrastTool() {
  const [bg, setBg] = useState("#0a0a0a");
  const [fg, setFg] = useState("#e8fd52");
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const luminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = () => {
    const { r: r1, g: g1, b: b1 } = hexToRgb(bg);
    const { r: r2, g: g2, b: b2 } = hexToRgb(fg);
    const l1 = luminance(r1, g1, b1);
    const l2 = luminance(r2, g2, b2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const ratio = getContrastRatio();
  const ratioFixed = ratio.toFixed(2);
  const passAA = ratio >= 4.5;
  const passAALarge = ratio >= 3;
  const passAAA = ratio >= 7;

  const copyRatio = () => {
    navigator.clipboard.writeText(`${ratioFixed}:1`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">Background</label>
          <div className="flex items-center gap-3">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-md border border-border bg-transparent" />
            <input type="text" value={bg} onChange={(e) => setBg(e.target.value)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">Foreground</label>
          <div className="flex items-center gap-3">
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-md border border-border bg-transparent" />
            <input type="text" value={fg} onChange={(e) => setFg(e.target.value)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="overflow-hidden rounded-lg border border-border" style={{ backgroundColor: bg }}>
        <div className="p-6" style={{ color: fg }}>
          <p className="text-2xl font-bold">Sample Heading Text</p>
          <p className="mt-2 text-sm">This is how your body text will appear at this contrast ratio.</p>
        </div>
      </div>

      {/* Result */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold mono text-foreground">{ratioFixed}:1</span>
          <button onClick={copyRatio} className="text-muted-foreground hover:text-primary transition-colors">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
        <div className="flex gap-2">
          {[
            { label: "AA", pass: passAA },
            { label: "AA Large", pass: passAALarge },
            { label: "AAA", pass: passAAA },
          ].map(({ label, pass }) => (
            <span key={label} className={`rounded-full px-3 py-1 text-[10px] font-bold mono uppercase ${pass ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
              {pass ? "✓" : "✗"} {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Typography Scale Tool ───
function TypographyScaleTool() {
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25);

  const scales = [
    { name: "Minor Second", value: 1.067 },
    { name: "Major Second", value: 1.125 },
    { name: "Minor Third", value: 1.2 },
    { name: "Major Third", value: 1.25 },
    { name: "Perfect Fourth", value: 1.333 },
    { name: "Augmented Fourth", value: 1.414 },
    { name: "Perfect Fifth", value: 1.5 },
    { name: "Golden Ratio", value: 1.618 },
  ];

  const sizes = [-2, -1, 0, 1, 2, 3, 4, 5].map((step) => ({
    step,
    size: (baseSize * Math.pow(ratio, step)).toFixed(2),
    label: ["2xs", "xs", "sm (base)", "md", "lg", "xl", "2xl", "3xl"][step + 2],
  }));

  const [copied, setCopied] = useState<string | null>(null);
  const copyValue = (val: string) => {
    navigator.clipboard.writeText(`${val}px`);
    setCopied(val);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">Base Size (px)</label>
          <input type="number" value={baseSize} onChange={(e) => setBaseSize(Number(e.target.value))} min={8} max={32} step={1}
            className="w-28 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">Scale Ratio</label>
          <select value={ratio} onChange={(e) => setRatio(Number(e.target.value))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
            {scales.map((s) => (
              <option key={s.name} value={s.value}>{s.name} ({s.value})</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        {sizes.map(({ step, size, label }) => (
          <div key={step} className="group flex items-baseline justify-between gap-3 rounded-md px-2 py-1 hover:bg-background transition-colors">
            <span className="font-medium text-foreground transition-all" style={{ fontSize: `${Math.min(Number(size), 48)}px`, lineHeight: 1.2 }}>
              {label}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs mono text-muted-foreground">{size}px</span>
              <button onClick={() => copyValue(size)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary">
                {copied === size ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Gradient Generator ───
function GradientGenerator() {
  const [color1, setColor1] = useState("#e8fd52");
  const [color2, setColor2] = useState("#ff764b");
  const [color3, setColor3] = useState("#5ce1e6");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [useThird, setUseThird] = useState(false);
  const [copied, setCopied] = useState(false);

  const gradientCss = type === "linear"
    ? `linear-gradient(${angle}deg, ${color1}, ${color2}${useThird ? `, ${color3}` : ""})`
    : `radial-gradient(circle, ${color1}, ${color2}${useThird ? `, ${color3}` : ""})`;

  const cssString = `background: ${gradientCss};`;

  const copy = () => {
    navigator.clipboard.writeText(cssString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex gap-2 mb-2">
        {(["linear", "radial"] as const).map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold mono uppercase transition-all ${type === t ? "bg-primary text-black" : "border border-border text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden h-32 border border-border transition-all duration-300" style={{ background: gradientCss }} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[{ val: color1, set: setColor1, label: "Color 1" }, { val: color2, set: setColor2, label: "Color 2" }].map(({ val, set, label }) => (
          <div key={label}>
            <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1">{label}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={val} onChange={(e) => set(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent" />
              <input type="text" value={val} onChange={(e) => set(e.target.value)} className="flex-1 min-w-0 rounded border border-border bg-background px-2 py-1 text-xs font-mono text-foreground focus:border-primary focus:outline-none" />
            </div>
          </div>
        ))}

        {useThird && (
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1">Color 3</label>
            <div className="flex items-center gap-2">
              <input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent" />
              <input type="text" value={color3} onChange={(e) => setColor3(e.target.value)} className="flex-1 min-w-0 rounded border border-border bg-background px-2 py-1 text-xs font-mono text-foreground focus:border-primary focus:outline-none" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {type === "linear" && (
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Angle</label>
            <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-32" />
            <span className="text-xs mono text-foreground">{angle}°</span>
          </div>
        )}
        <button onClick={() => setUseThird(!useThird)} className="text-xs font-bold text-primary hover:underline mono">
          {useThird ? "− Remove 3rd color" : "+ Add 3rd color"}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
        <code className="text-xs font-mono text-muted-foreground truncate">{cssString}</code>
        <button onClick={copy} className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors">
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

// ─── SVG Minifier / Base64 Encoder ───
function SvgTool() {
  const [svgInput, setSvgInput] = useState(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`);
  const [mode, setMode] = useState<"minify" | "base64" | "datauri">("minify");
  const [copied, setCopied] = useState(false);

  const minify = (s: string) => s.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
  const toBase64 = (s: string) => btoa(unescape(encodeURIComponent(s)));
  const toDataUri = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

  const output = (() => {
    try {
      if (mode === "minify") return minify(svgInput);
      if (mode === "base64") return `data:image/svg+xml;base64,${toBase64(svgInput)}`;
      return toDataUri(svgInput);
    } catch {
      return "Invalid SVG";
    }
  })();

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex gap-2">
        {(["minify", "base64", "datauri"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold mono uppercase transition-all ${mode === m ? "bg-primary text-black" : "border border-border text-muted-foreground hover:text-foreground"}`}>
            {m}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">SVG Input</label>
        <textarea
          value={svgInput}
          onChange={(e) => setSvgInput(e.target.value)}
          rows={5}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none resize-none"
          spellCheck={false}
        />
      </div>

      {/* Preview */}
      <div className="flex items-center gap-4">
        <div className="text-foreground text-[10px] text-muted-foreground mono uppercase font-bold">Preview:</div>
        <div className="text-foreground" dangerouslySetInnerHTML={{ __html: svgInput }} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Output</label>
          <button onClick={copy} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline mono">
            {copied ? <><Check size={12} className="text-green-500" /> Copied!</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
        <div className="max-h-28 overflow-y-auto rounded-md border border-border bg-background px-3 py-2">
          <code className="text-xs font-mono text-muted-foreground break-all whitespace-pre-wrap">{output}</code>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground mono">
          Size: <span className="text-foreground font-bold">{(new TextEncoder().encode(output).length / 1024).toFixed(2)} KB</span>
          {mode === "minify" && svgInput.length > 0 && (
            <> · Saved: <span className="text-green-400 font-bold">{Math.round((1 - output.length / svgInput.length) * 100)}%</span></>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Spacing Scale Generator ───
function SpacingScaleTool() {
  const [base, setBase] = useState(4);
  const steps = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64];
  const [copied, setCopied] = useState<number | null>(null);

  const copyAll = () => {
    const css = steps.map((s) => `  --space-${String(s).replace(".", "_")}: ${(s * base).toFixed(1)}px;`).join("\n");
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    setCopied(-1);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Base unit (px)</label>
          <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} min={2} max={16} step={1}
            className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
        </div>
        <button onClick={copyAll} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline mono">
          {copied === -1 ? <><Check size={12} className="text-green-500" /> Copied!</> : <><Copy size={12} /> Copy all CSS</>}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((s) => {
          const val = (s * base).toFixed(1);
          return (
            <button key={s} onClick={() => { navigator.clipboard.writeText(`${val}px`); setCopied(s); setTimeout(() => setCopied(null), 1000); }}
              className="group flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-left hover:border-primary transition-colors">
              <div className="h-3 bg-primary rounded-sm flex-shrink-0 transition-all" style={{ width: `${Math.min(s * 2, 48)}px` }} />
              <span className="text-[10px] mono text-muted-foreground group-hover:text-foreground">{val}px</span>
              {copied === s && <Check size={10} className="text-green-500 ml-auto" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── SEO Meta Preview ───
function SeoMetaPreview() {
  const [title, setTitle] = useState("Ravan Mammadov — Senior Creative Designer & Art Director");
  const [desc, setDesc] = useState("Senior Creative Designer based in Baku, blending motion design, brand worlds, and performance creative into high-impact digital experiences.");
  const [url, setUrl] = useState("https://rvan.me");

  const titleLen = title.length;
  const descLen = desc.length;

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">
            Page Title <span className={`ml-2 ${titleLen > 60 ? "text-red-400" : titleLen > 50 ? "text-yellow-400" : "text-green-400"}`}>{titleLen}/60</span>
          </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">
            Meta Description <span className={`ml-2 ${descLen > 160 ? "text-red-400" : descLen > 140 ? "text-yellow-400" : "text-green-400"}`}>{descLen}/160</span>
          </label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">URL</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
      </div>

      {/* Google SERP Preview */}
      <div>
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-3">Google Preview</p>
        <div className="rounded-lg border border-border bg-white p-4 space-y-1">
          <p className="text-xs text-green-700">{url}</p>
          <p className="text-base font-medium text-blue-700 line-clamp-1">{title.slice(0, 60)}{title.length > 60 ? "..." : ""}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{desc.slice(0, 160)}{desc.length > 160 ? "..." : ""}</p>
        </div>
      </div>

      {/* Twitter/X Preview */}
      <div>
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-3">X/Twitter Card Preview</p>
        <div className="rounded-xl border border-border bg-black overflow-hidden max-w-sm">
          <div className="aspect-[2/1] bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <span className="text-zinc-600 text-xs mono">OG IMAGE PREVIEW</span>
          </div>
          <div className="p-3 border-t border-zinc-800">
            <p className="text-white text-sm font-semibold line-clamp-1">{title.slice(0, 60)}</p>
            <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{desc.slice(0, 120)}</p>
            <p className="text-zinc-500 text-xs mt-2">{url.replace("https://", "")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CSS Shadow Generator ───
function ShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(16);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const hexToRgba = (hex: string, op: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${(op / 100).toFixed(2)})`;
  };

  const shadowCss = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;

  const copy = () => {
    navigator.clipboard.writeText(`box-shadow: ${shadowCss};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex items-center justify-center py-6 bg-background rounded-lg border border-border">
        <div className="h-24 w-40 rounded-xl bg-surface border border-border transition-all duration-300" style={{ boxShadow: shadowCss }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[{ label: "X Offset", val: x, set: setX, min: -50, max: 50 },
          { label: "Y Offset", val: y, set: setY, min: -50, max: 50 },
          { label: "Blur", val: blur, set: setBlur, min: 0, max: 100 },
          { label: "Spread", val: spread, set: setSpread, min: -20, max: 50 }].map(({ label, val, set, min, max }) => (
          <div key={label}>
            <label className="flex justify-between text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1">
              <span>{label}</span><span>{val}px</span>
            </label>
            <input type="range" min={min} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className="w-full" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Opacity {opacity}%</label>
          <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-24" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="accent-primary" />
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Inset</span>
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
        <code className="text-xs font-mono text-muted-foreground truncate">box-shadow: {shadowCss};</code>
        <button onClick={copy} className="flex-shrink-0 text-muted-foreground hover:text-primary">
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

// ─── AI Prompt Helper ───
function AiPromptHelper() {
  const templates = [
    { label: "Logo Design Brief", icon: "🎨", prompt: `Design a professional logo for [BRAND NAME], a [INDUSTRY] company. Style: [minimalist/bold/geometric/organic]. Color palette: [PRIMARY COLOR], [SECONDARY COLOR]. Target audience: [AUDIENCE]. The logo should convey [VALUE 1], [VALUE 2], and [VALUE 3]. Deliverables: SVG, PNG variants (light/dark), horizontal and stacked layouts.` },
    { label: "Motion Design Spec", icon: "🎬", prompt: `Create a motion design specification for [PROJECT NAME]. Duration: [SECONDS]s. Platform: [INSTAGRAM/YOUTUBE/WEB]. Brand colors: [COLORS]. Animation style: [smooth/energetic/elegant/playful]. Key message: [MESSAGE]. Reference style: [REFERENCE]. Include: intro animation, logo reveal, CTA animation, and exit transition.` },
    { label: "Brand Identity Brief", icon: "🏷️", prompt: `Develop a complete brand identity system for [COMPANY NAME] in the [INDUSTRY] sector. Brand personality: [ADJECTIVE 1], [ADJECTIVE 2], [ADJECTIVE 3]. Primary audience: [AUDIENCE DESCRIPTION]. Key differentiator: [WHAT MAKES THEM UNIQUE]. Deliverables needed: logo suite, color system, typography, icons, patterns, and usage guidelines.` },
    { label: "Social Media Ad Copy", icon: "📣", prompt: `Write high-converting social media ad copy for [PRODUCT/SERVICE]. Platform: [INSTAGRAM/FACEBOOK/LINKEDIN]. Campaign goal: [AWARENESS/CLICKS/CONVERSIONS]. Target: [AUDIENCE]. Key benefit: [MAIN BENEFIT]. Tone: [PROFESSIONAL/PLAYFUL/URGENT]. Include: hook (first 3 words that stop scroll), body copy (max 150 chars), CTA. Provide 3 variations for A/B testing.` },
    { label: "UX Audit Request", icon: "🔍", prompt: `Perform a UX audit on [WEBSITE/APP NAME] focusing on [SECTION/FEATURE]. Current problem: [DESCRIBE PAIN POINT]. User goal: [WHAT USER WANTS TO ACCOMPLISH]. Business goal: [WHAT BUSINESS WANTS]. Analyze: navigation clarity, visual hierarchy, CTA effectiveness, mobile responsiveness, load performance. Provide: 3 quick wins and 2 strategic improvements.` },
    { label: "Portfolio Case Study", icon: "📋", prompt: `Write a compelling portfolio case study for [PROJECT NAME]. Client: [CLIENT NAME/TYPE]. Project type: [BRANDING/MOTION/WEB]. Challenge: [PROBLEM TO SOLVE]. Process: [YOUR APPROACH - research, concept, design, delivery]. Solution: [WHAT YOU CREATED]. Results: [MEASURABLE OUTCOMES]. Format: 150-word summary + 3 key sections. Tone: confident, specific, results-focused.` },
  ];

  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(templates[selected].prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        {templates.map((t, i) => (
          <button key={t.label} onClick={() => setSelected(i)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${selected === i ? "bg-primary text-black" : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="relative rounded-lg border border-border bg-background p-4">
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{templates[selected].prompt}</p>
        <button onClick={copy} className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-surface border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary transition-all">
          {copied ? <><Check size={12} className="text-green-500" /> Copied!</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mono">Replace all <code className="text-primary">[PLACEHOLDERS]</code> with your specific details before using with AI tools.</p>
    </div>
  );
}

// ─── Unit Converter ───
function UnitConverter() {
  const [px, setPx] = useState(16);
  const [remBase, setRemBase] = useState(16);

  const rem = (px / remBase).toFixed(4);
  const em = rem;
  const pt = (px * 0.75).toFixed(2);
  const cm = (px * 0.026458).toFixed(4);
  const pct = ((px / remBase) * 100).toFixed(2);

  const [copied, setCopied] = useState<string | null>(null);
  const copy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(null), 1000);
  };

  const conversions = [
    { label: "rem", value: `${rem}rem` },
    { label: "em", value: `${em}em` },
    { label: "pt", value: `${pt}pt` },
    { label: "cm", value: `${cm}cm` },
    { label: "% (of base)", value: `${pct}%` },
    { label: "vw (1px each)", value: `${(px / 14.4).toFixed(4)}vw` },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">Pixel value</label>
          <input type="number" value={px} onChange={(e) => setPx(Number(e.target.value))} min={1} max={500} step={0.5}
            className="w-32 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-2">Root font size (px)</label>
          <input type="number" value={remBase} onChange={(e) => setRemBase(Number(e.target.value))} min={8} max={24}
            className="w-32 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {conversions.map(({ label, value }) => (
          <button key={label} onClick={() => copy(value, label)}
            className="group flex flex-col items-start rounded-lg border border-border bg-background p-3 hover:border-primary transition-colors text-left">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">{label}</span>
            <span className="mt-1 text-lg font-bold mono text-foreground group-hover:text-primary transition-colors">
              {value}
            </span>
            {copied === label ? <Check size={12} className="text-green-500 mt-1" /> : <Copy size={12} className="text-muted-foreground mt-1 opacity-0 group-hover:opacity-100" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main tool categories ───
const TOOL_CATEGORIES = [
  {
    id: "color",
    label: "Color",
    icon: <Palette size={18} />,
    description: "Contrast checker, gradient generator",
    tools: [
      { id: "contrast", label: "Color Contrast Checker", component: <ColorContrastTool /> },
      { id: "gradient", label: "Gradient Generator", component: <GradientGenerator /> },
    ],
  },
  {
    id: "typography",
    label: "Typography",
    icon: <Type size={18} />,
    description: "Type scale, unit converter",
    tools: [
      { id: "typescale", label: "Typography Scale Builder", component: <TypographyScaleTool /> },
      { id: "units", label: "Unit Converter (px → rem/em/pt)", component: <UnitConverter /> },
    ],
  },
  {
    id: "spacing",
    label: "Spacing",
    icon: <Sliders size={18} />,
    description: "Spacing system generator",
    tools: [
      { id: "spacing", label: "Spacing Scale Generator", component: <SpacingScaleTool /> },
    ],
  },
  {
    id: "svg",
    label: "SVG & Code",
    icon: <Code2 size={18} />,
    description: "SVG minifier, base64 encoder",
    tools: [
      { id: "svg", label: "SVG Minifier & Encoder", component: <SvgTool /> },
    ],
  },
  {
    id: "shadow",
    label: "Shadows",
    icon: <Layers size={18} />,
    description: "CSS box-shadow generator",
    tools: [
      { id: "shadow", label: "CSS Shadow Generator", component: <ShadowGenerator /> },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    icon: <Globe size={18} />,
    description: "Meta preview, OG simulator",
    tools: [
      { id: "seo", label: "SEO Meta Tag Preview", component: <SeoMetaPreview /> },
    ],
  },
  {
    id: "ai",
    label: "AI Prompts",
    icon: <Zap size={18} />,
    description: "Design & marketing prompt templates",
    tools: [
      { id: "ai", label: "AI Prompt Templates for Designers", component: <AiPromptHelper /> },
    ],
  },
];

// Needed for TypeScript
const Layers = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

interface DesignerToolsPanelProps {
  className?: string;
}

export default function DesignerToolsPanel({ className = "" }: DesignerToolsPanelProps) {
  const [activeCategory, setActiveCategory] = useState("color");
  const [activeTool, setActiveTool] = useState("contrast");

  const category = TOOL_CATEGORIES.find((c) => c.id === activeCategory) || TOOL_CATEGORIES[0];
  const tool = category.tools.find((t) => t.id === activeTool) || category.tools[0];

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const cat = TOOL_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.tools.length > 0) {
      setActiveTool(cat.tools[0].id);
    }
  };

  return (
    <div className={`rounded-2xl border border-border bg-background overflow-hidden ${className}`}>
      {/* Category Tabs */}
      <div className="border-b border-border overflow-x-auto">
        <div className="flex min-w-max">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-bold tracking-wide mono uppercase transition-all duration-200 border-b-2 ${
                activeCategory === cat.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Sub-tabs (if multiple tools in category) */}
      {category.tools.length > 1 && (
        <div className="flex gap-2 px-6 py-3 border-b border-border bg-surface/50">
          {category.tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTool === t.id ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Active Tool */}
      <div className="p-6">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-4">{tool.label}</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tool.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
