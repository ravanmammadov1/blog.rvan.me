import React, { useState } from "react";
import { Copy, Check, Download, Waves, Sliders } from "lucide-react";

export const SvgWaveGenerator: React.FC = () => {
  const [complexity, setComplexity] = useState(3);
  const [height, setHeight] = useState(180);
  const [colorStart, setColorStart] = useState("#3b82f6");
  const [colorEnd, setColorEnd] = useState("#8b5cf6");
  const [isGradient, setIsGradient] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate smooth SVG curve path string
  const generatePath = () => {
    const width = 1440;
    const baseHeight = 320;
    const points: [number, number][] = [];

    const segments = complexity * 2 + 1;
    const step = width / segments;

    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const waveOffset = Math.sin(i * 1.5) * (height / 2);
      const y = baseHeight - height / 2 + waveOffset;
      points.push([x, y]);
    }

    let d = `M 0,${baseHeight} L 0,${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cx = (p1[0] + p2[0]) / 2;
      const cy = (p1[1] + p2[1]) / 2;
      d += ` Q ${p1[0]},${p1[1]} ${cx},${cy}`;
    }
    d += ` L ${width},${baseHeight} Z`;

    return d;
  };

  const pathString = generatePath();

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" width="100%" height="100%">
  <defs>
    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${colorStart}" />
      <stop offset="100%" stop-color="${isGradient ? colorEnd : colorStart}" />
    </linearGradient>
  </defs>
  <path fill="url(#waveGradient)" fill-opacity="1" d="${pathString}"></path>
</svg>`;

  const copySvg = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wave-divider.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Waves className="text-[#61c5ad]" size={20} /> Gradient SVG Wave Generator
          </h3>
          <p className="text-xs text-muted-foreground/80 font-medium mt-0.5">
            Create smooth SVG section dividers with custom gradients and wave complexity.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copySvg}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-[#61c5ad]/20"
            style={{
              background: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "COPIED SVG!" : "COPY SVG CODE"}
          </button>
          <button
            onClick={downloadSvg}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-foreground uppercase tracking-wider hover:border-primary/50 hover:bg-white/10 transition-all glass-sm"
          >
            <Download size={14} /> DOWNLOAD SVG
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
        <div>
          <label htmlFor="wave-complexity" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Complexity</span> <span className="text-primary font-bold">{complexity}</span>
          </label>
          <input
            id="wave-complexity"
            type="range"
            min="1"
            max="6"
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="wave-height" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Wave Height</span> <span className="text-primary font-bold">{height}px</span>
          </label>
          <input
            id="wave-height"
            type="range"
            min="60"
            max="260"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="color-start" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5">Start Color</label>
          <div className="flex items-center gap-2">
            <input id="color-start" type="color" value={colorStart} onChange={(e) => setColorStart(e.target.value)} aria-label="Start color picker" className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-transparent" />
            <input id="color-start-hex" type="text" value={colorStart} onChange={(e) => setColorStart(e.target.value)} aria-label="Start color hex text" className="w-full rounded-md border border-white/10 bg-background px-3 py-1.5 text-xs font-mono text-foreground" />
          </div>
        </div>

        <div>
          <label htmlFor="color-end" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5">End Color</label>
          <div className="flex items-center gap-2">
            <input id="color-end" type="color" value={colorEnd} onChange={(e) => setColorEnd(e.target.value)} aria-label="End color picker" className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-transparent" />
            <input id="color-end-hex" type="text" value={colorEnd} onChange={(e) => setColorEnd(e.target.value)} aria-label="End color hex text" className="w-full rounded-md border border-white/10 bg-background px-3 py-1.5 text-xs font-mono text-foreground" />
          </div>
        </div>
      </div>

      {/* Live Wave Canvas */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Live Wave Preview</span>
        <div className="w-full h-48 rounded-xl border border-white/10 bg-background overflow-hidden relative flex items-end">
          <svg viewBox="0 0 1440 320" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="liveWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colorStart} />
                <stop offset="100%" stopColor={isGradient ? colorEnd : colorStart} />
              </linearGradient>
            </defs>
            <path fill="url(#liveWaveGrad)" d={pathString} />
          </svg>
        </div>
      </div>

      {/* Generated SVG Code */}
      <div className="relative rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
        <pre>{svgCode}</pre>
      </div>
    </div>
  );
};
export default SvgWaveGenerator;
