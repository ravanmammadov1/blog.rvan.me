import React, { useState, useMemo, useRef } from "react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";
import {
  SEMANTIC_CONCEPTS,
  METAPHOR_PRESETS,
  COLOR_PALETTES,
} from "./metaphorMatrix";
import {
  GestaltMode,
  CanvasTransformConfig,
  TypographyConfig,
} from "./types";
import { generateGestaltVector } from "./GestaltFusionEngine";
import { analyzeMetaphorSemiotics } from "./semioticAnalyzer";
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Sliders,
  Palette,
  Type,
  Maximize2,
  Grid,
  RotateCcw,
  Compass,
  Layers,
  Zap,
  Info,
  ShieldCheck,
} from "lucide-react";

export const VisualMetaphorCanvas: React.FC = () => {
  const { language } = useLanguage();
  const isAz = language === "az";

  // State
  const [selectedConceptAId, setSelectedConceptAId] = useState<string>("security-shield");
  const [selectedConceptBId, setSelectedConceptBId] = useState<string>("velocity-wing");
  const [gestaltMode, setGestaltMode] = useState<GestaltMode>("figure-ground");
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>("palette-swiss");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"gestalt" | "tuning" | "palette" | "typography" | "semiotics">("gestalt");

  // Transform config
  const [transformConfig, setTransformConfig] = useState<CanvasTransformConfig>({
    scaleA: 1,
    scaleB: 0.95,
    offsetX: 0,
    offsetY: 0,
    rotationA: 0,
    rotationB: 0,
    negativeSpaceDepth: 65,
    cornerRadius: 12,
    strokeWidth: 2.5,
    contrastInversion: false,
    gridVisible: false,
    gutenbergGuideVisible: false,
    aspectRatio: "16:9",
  });

  // Typography config
  const [typographyConfig, setTypographyConfig] = useState<TypographyConfig>({
    enabled: true,
    headline: "Speed Without Compromise",
    subhead: "The wing emerges from within the shield's negative space.",
    fontFamily: "geometric",
    tracking: 0.15,
    alignment: "center",
    case: "uppercase",
    position: "bottom",
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Active items
  const conceptA = useMemo(
    () => SEMANTIC_CONCEPTS.find((c) => c.id === selectedConceptAId) || SEMANTIC_CONCEPTS[0],
    [selectedConceptAId]
  );
  const conceptB = useMemo(
    () => SEMANTIC_CONCEPTS.find((c) => c.id === selectedConceptBId) || SEMANTIC_CONCEPTS[1],
    [selectedConceptBId]
  );
  const palette = useMemo(
    () => COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || COLOR_PALETTES[0],
    [selectedPaletteId]
  );

  // Generate Vector & Semiotic Analysis
  const vectorSvg = useMemo(
    () => generateGestaltVector(conceptA, conceptB, gestaltMode, transformConfig, palette),
    [conceptA, conceptB, gestaltMode, transformConfig, palette]
  );

  const semioticReport = useMemo(
    () => analyzeMetaphorSemiotics(conceptA, conceptB, gestaltMode, transformConfig.negativeSpaceDepth),
    [conceptA, conceptB, gestaltMode, transformConfig.negativeSpaceDepth]
  );

  // Preset Applicator
  const applyPreset = (presetId: string) => {
    const p = METAPHOR_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setSelectedConceptAId(p.conceptAId);
    setSelectedConceptBId(p.conceptBId);
    setGestaltMode(p.mode);
    setSelectedPaletteId(p.paletteId);
    setTypographyConfig((prev) => ({
      ...prev,
      headline: isAz ? p.headline_az : p.headline,
      subhead: isAz ? p.subhead_az : p.subhead,
    }));
  };

  // Copy Full SVG code
  const handleCopySvg = () => {
    const fullSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vectorSvg.viewBox}" width="100%" height="100%">
  ${vectorSvg.svgContent}
</svg>
    `.trim();

    navigator.clipboard.writeText(fullSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download SVG
  const handleDownloadSvg = () => {
    const fullSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vectorSvg.viewBox}" width="1600" height="1600">
  ${vectorSvg.svgContent}
</svg>`;
    const blob = new Blob([fullSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visual-metaphor-${conceptA.symbolName.toLowerCase()}-${conceptB.symbolName.toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-3">
            <Sparkles size={13} />
            <span>{isAz ? "GESTALT VƏ KOQNİTİV METAFORA MOTORU" : "GESTALT & COGNITIVE METAPHOR ENGINE"}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
            {isAz ? "Görsel Metafora & Gestalt Sentezleyicisi" : "Visual Metaphor & Gestalt Canvas"}
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl mt-2">
            {isAz
              ? "İki fərqli abstrakt dəyəri Rubinin Şəkil-Zəmin, Ortaq Kontur və Sürreal Birləşmə prinsipləri ilə tək bir ikonik vizual metaforada birləşdirin."
              : "Synthesize two disparate conceptual values into a single high-impact visual metaphor using Figure-Ground Inversion, Shared Contour, and Mental Closure."}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-500 uppercase mr-1">
            {isAz ? "Nümunələr:" : "Presets:"}
          </span>
          {METAPHOR_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 border border-neutral-800 hover:border-primary/50 text-neutral-300 hover:text-white transition-colors"
            >
              {isAz ? p.name_az : p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT / CENTER: Live Interactive Canvas Area (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Canvas Viewport Toolbar */}
          <div className="flex items-center justify-between bg-neutral-900/90 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs">
            <div className="flex items-center gap-4">
              <span className="font-mono text-neutral-400 uppercase">
                {isAz ? "Kanvas:" : "Viewport:"} <strong className="text-white">{transformConfig.aspectRatio}</strong>
              </span>
              <button
                onClick={() =>
                  setTransformConfig((prev) => ({ ...prev, gridVisible: !prev.gridVisible }))
                }
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                  transformConfig.gridVisible ? "bg-primary text-black font-bold" : "text-neutral-400 hover:text-white bg-neutral-800/50"
                }`}
              >
                <Grid size={13} />
                <span>{isAz ? "Qrid" : "Grid"}</span>
              </button>
              <button
                onClick={() =>
                  setTransformConfig((prev) => ({
                    ...prev,
                    gutenbergGuideVisible: !prev.gutenbergGuideVisible,
                  }))
                }
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                  transformConfig.gutenbergGuideVisible
                    ? "bg-primary text-black font-bold"
                    : "text-neutral-400 hover:text-white bg-neutral-800/50"
                }`}
              >
                <Compass size={13} />
                <span>{isAz ? "Gutenberg Oxu" : "Reading Gravity"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setTransformConfig({
                    scaleA: 1,
                    scaleB: 0.95,
                    offsetX: 0,
                    offsetY: 0,
                    rotationA: 0,
                    rotationB: 0,
                    negativeSpaceDepth: 65,
                    cornerRadius: 12,
                    strokeWidth: 2.5,
                    contrastInversion: false,
                    gridVisible: false,
                    gutenbergGuideVisible: false,
                    aspectRatio: "16:9",
                  })
                }
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                title={isAz ? "Sıfırla" : "Reset Canvas"}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Actual Rendered Canvas Stage */}
          <div
            ref={canvasRef}
            style={{
              backgroundColor: palette.background,
              aspectRatio: transformConfig.aspectRatio === "16:9" ? "16/9" : transformConfig.aspectRatio === "4:5" ? "4/5" : "1/1",
            }}
            className="relative w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 transition-colors duration-500 select-none group"
          >
            {/* Optional Grid Overlay */}
            {transformConfig.gridVisible && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, ${palette.primary} 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
            )}

            {/* Optional Gutenberg Reading Gravity Line */}
            {transformConfig.gutenbergGuideVisible && (
              <svg className="absolute inset-0 w-full height-full pointer-events-none z-20">
                <line x1="0%" y1="0%" x2="100%" y2="100%" stroke={palette.accent} strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                <circle cx="10%" cy="10%" r="6" fill={palette.accent} opacity="0.8" />
                <text x="12%" y="12%" fill={palette.accent} fontSize="10" fontFamily="monospace">Primary Optical (Entry)</text>
                <circle cx="90%" cy="90%" r="6" fill={palette.accent} opacity="0.8" />
                <text x="75%" y="88%" fill={palette.accent} fontSize="10" fontFamily="monospace">Terminal Area (Action)</text>
              </svg>
            )}

            {/* Top Typography Position */}
            {typographyConfig.enabled && typographyConfig.position === "top" && (
              <div className="w-full text-center z-10 mb-6">
                <h3
                  style={{
                    color: palette.text,
                    letterSpacing: `${typographyConfig.tracking}em`,
                  }}
                  className="font-bold text-lg md:text-2xl uppercase tracking-wider transition-all"
                >
                  {typographyConfig.headline}
                </h3>
                {typographyConfig.subhead && (
                  <p style={{ color: palette.text }} className="text-xs md:text-sm opacity-60 mt-1 max-w-lg mx-auto">
                    {typographyConfig.subhead}
                  </p>
                )}
              </div>
            )}

            {/* Hero Gestalt SVG Stage */}
            <div className="relative w-full max-w-[340px] md:max-w-[420px] aspect-square flex items-center justify-center z-10">
              <svg
                viewBox={vectorSvg.viewBox}
                className="w-full h-full drop-shadow-2xl transition-all duration-300"
                dangerouslySetInnerHTML={{ __html: vectorSvg.svgContent }}
              />
            </div>

            {/* Bottom Typography Position */}
            {typographyConfig.enabled && typographyConfig.position === "bottom" && (
              <div className="w-full text-center z-10 mt-6">
                <h3
                  style={{
                    color: palette.text,
                    letterSpacing: `${typographyConfig.tracking}em`,
                  }}
                  className="font-bold text-lg md:text-2xl uppercase tracking-wider transition-all"
                >
                  {typographyConfig.headline}
                </h3>
                {typographyConfig.subhead && (
                  <p style={{ color: palette.text }} className="text-xs md:text-sm opacity-60 mt-1 max-w-lg mx-auto">
                    {typographyConfig.subhead}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Bar (Export & Code) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSvg}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-bold text-xs uppercase tracking-wide hover:bg-primary/90 transition-colors shadow-md"
              >
                <Download size={14} />
                <span>{isAz ? "SVG Yüklə (Figma/AI)" : "Download Vector SVG"}</span>
              </button>
              <button
                onClick={handleCopySvg}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:text-white font-medium text-xs transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? (isAz ? "Kopyalandı!" : "Copied SVG!") : isAz ? "SVG Kodunu Kopyala" : "Copy SVG Code"}</span>
              </button>
            </div>

            <div className="text-xs font-mono text-neutral-500">
              {conceptA.symbolName} × {conceptB.symbolName} • {gestaltMode}
            </div>
          </div>
        </div>

        {/* RIGHT: Controls, Semiotic Radar & Studio Tabs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab("gestalt")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === "gestalt" ? "bg-white/10 text-white font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {isAz ? "Gestalt" : "Gestalt"}
            </button>
            <button
              onClick={() => setActiveTab("tuning")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === "tuning" ? "bg-white/10 text-white font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {isAz ? "Tənzimləmə" : "Tuning"}
            </button>
            <button
              onClick={() => setActiveTab("palette")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === "palette" ? "bg-white/10 text-white font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {isAz ? "Rənglər" : "Palette"}
            </button>
            <button
              onClick={() => setActiveTab("typography")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === "typography" ? "bg-white/10 text-white font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {isAz ? "Mətn" : "Type"}
            </button>
            <button
              onClick={() => setActiveTab("semiotics")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === "semiotics" ? "bg-primary/20 text-primary font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {isAz ? "Semiotika" : "Semiotics"}
            </button>
          </div>

          {/* TAB 1: GESTALT CONCEPTS & MODES */}
          {activeTab === "gestalt" && (
            <div className="flex flex-col gap-6 bg-neutral-900/60 border border-neutral-800/80 p-5 rounded-2xl">
              {/* Concept A Selector */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 flex items-center justify-between mb-2">
                  <span>{isAz ? "Əsas Qab / Forma (Konsept A):" : "Container / Base Form (Concept A):"}</span>
                  <span className="text-primary font-bold">{conceptA.symbolName}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SEMANTIC_CONCEPTS.slice(0, 6).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConceptAId(c.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        selectedConceptAId === c.id
                          ? "border-primary bg-primary/10 text-white"
                          : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <span className="text-lg">{c.icon}</span>
                      <span className="text-xs font-medium truncate">{isAz ? c.symbolName_az : c.symbolName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Concept B Selector */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 flex items-center justify-between mb-2">
                  <span>{isAz ? "Gizli Məzmun / İç Forma (Konsept B):" : "Negative / Hidden Form (Concept B):"}</span>
                  <span className="text-primary font-bold">{conceptB.symbolName}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SEMANTIC_CONCEPTS.slice(6, 12).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConceptBId(c.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        selectedConceptBId === c.id
                          ? "border-primary bg-primary/10 text-white"
                          : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <span className="text-lg">{c.icon}</span>
                      <span className="text-xs font-medium truncate">{isAz ? c.symbolName_az : c.symbolName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gestalt Fusion Mode Selector */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 block mb-2">
                  {isAz ? "Gestalt Birləşmə Modu:" : "Gestalt Fusion Mode:"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: "figure-ground",
                      name: isAz ? "Şəkil-Zəmin (Mənfi Boşluq)" : "Figure-Ground Inversion",
                      desc: isAz ? "FedEx / Rubin illüziyası" : "Negative space discovery",
                    },
                    {
                      id: "shared-contour",
                      name: isAz ? "Ortaq Kontur" : "Shared Contour",
                      desc: isAz ? "Tək axıcı vektor xətti" : "Continuous single line",
                    },
                    {
                      id: "typographic",
                      name: isAz ? "Tipografik Gizləmə" : "Typographic Concealment",
                      desc: isAz ? "Şrift daxili boşluğu" : "Letterform counter-space",
                    },
                    {
                      id: "juxtaposition",
                      name: isAz ? "Sürreal Birləşmə" : "Surreal Juxtaposition",
                      desc: isAz ? "Konseptual element əvəzləmə" : "Anatomical node swap",
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setGestaltMode(m.id as GestaltMode)}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        gestaltMode === m.id
                          ? "border-primary bg-primary/10 text-white"
                          : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <span className="text-xs font-bold text-white">{m.name}</span>
                      <span className="text-[10px] text-neutral-400">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MICRO-TUNING */}
          {activeTab === "tuning" && (
            <div className="flex flex-col gap-5 bg-neutral-900/60 border border-neutral-800/80 p-5 rounded-2xl text-xs">
              {/* Negative Space Depth */}
              <div>
                <div className="flex justify-between font-mono text-neutral-400 mb-1.5">
                  <span>{isAz ? "Mənfi Boşluq Dərinliyi:" : "Negative Space Scale:"}</span>
                  <span className="text-white font-bold">{transformConfig.negativeSpaceDepth}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={transformConfig.negativeSpaceDepth}
                  onChange={(e) =>
                    setTransformConfig((prev) => ({ ...prev, negativeSpaceDepth: Number(e.target.value) }))
                  }
                  className="w-full accent-primary"
                />
              </div>

              {/* Corner Curvature (Squircle vs Sharp) */}
              <div>
                <div className="flex justify-between font-mono text-neutral-400 mb-1.5">
                  <span>{isAz ? "Künc Yuvarlaqlığı (Squircle):" : "Corner Curvature (Squircle):"}</span>
                  <span className="text-white font-bold">{transformConfig.cornerRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={transformConfig.cornerRadius}
                  onChange={(e) =>
                    setTransformConfig((prev) => ({ ...prev, cornerRadius: Number(e.target.value) }))
                  }
                  className="w-full accent-primary"
                />
              </div>

              {/* Offset X / Y */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between font-mono text-neutral-400 mb-1.5">
                    <span>{isAz ? "Mərkəz X:" : "Offset X:"}</span>
                    <span className="text-white">{transformConfig.offsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={transformConfig.offsetX}
                    onChange={(e) =>
                      setTransformConfig((prev) => ({ ...prev, offsetX: Number(e.target.value) }))
                    }
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-mono text-neutral-400 mb-1.5">
                    <span>{isAz ? "Mərkəz Y:" : "Offset Y:"}</span>
                    <span className="text-white">{transformConfig.offsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={transformConfig.offsetY}
                    onChange={(e) =>
                      setTransformConfig((prev) => ({ ...prev, offsetY: Number(e.target.value) }))
                    }
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Rotation B */}
              <div>
                <div className="flex justify-between font-mono text-neutral-400 mb-1.5">
                  <span>{isAz ? "Gizli Forma Bucaq Dönməsi:" : "Inner Form Rotation:"}</span>
                  <span className="text-white">{transformConfig.rotationB}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={transformConfig.rotationB}
                  onChange={(e) =>
                    setTransformConfig((prev) => ({ ...prev, rotationB: Number(e.target.value) }))
                  }
                  className="w-full accent-primary"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PALETTES */}
          {activeTab === "palette" && (
            <div className="flex flex-col gap-4 bg-neutral-900/60 border border-neutral-800/80 p-5 rounded-2xl">
              <label className="text-xs font-mono uppercase text-neutral-400 block">
                {isAz ? "Editoryal Rəng Palitraları:" : "Editorial Color Palettes:"}
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => setSelectedPaletteId(pal.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedPaletteId === pal.id
                        ? "border-primary bg-primary/10 text-white"
                        : "border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{isAz ? pal.name_az : pal.name}</div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                        {pal.background} • {pal.primary} • {pal.accent}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-lg border border-white/5">
                      <span className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: pal.background }} />
                      <span className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: pal.primary }} />
                      <span className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: pal.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TYPOGRAPHY */}
          {activeTab === "typography" && (
            <div className="flex flex-col gap-4 bg-neutral-900/60 border border-neutral-800/80 p-5 rounded-2xl text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono uppercase text-neutral-400">{isAz ? "Başlıq Qatı:" : "Typography Layer:"}</span>
                <button
                  onClick={() => setTypographyConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    typographyConfig.enabled ? "bg-primary text-black" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {typographyConfig.enabled ? (isAz ? "Aktiv" : "Enabled") : isAz ? "Qapalı" : "Disabled"}
                </button>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{isAz ? "Əsas Başlıq:" : "Main Headline:"}</label>
                <input
                  type="text"
                  value={typographyConfig.headline}
                  onChange={(e) => setTypographyConfig((prev) => ({ ...prev, headline: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{isAz ? "Alt Başlıq / Açıqlama:" : "Subhead / Explainer:"}</label>
                <input
                  type="text"
                  value={typographyConfig.subhead}
                  onChange={(e) => setTypographyConfig((prev) => ({ ...prev, subhead: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:border-primary outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-neutral-400 mb-1">
                  <span>{isAz ? "Harf Aralığı (Tracking):" : "Letter Tracking:"}</span>
                  <span className="text-white font-bold">{typographyConfig.tracking}em</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.02"
                  value={typographyConfig.tracking}
                  onChange={(e) =>
                    setTypographyConfig((prev) => ({ ...prev, tracking: Number(e.target.value) }))
                  }
                  className="w-full accent-primary"
                />
              </div>
            </div>
          )}

          {/* TAB 5: SEMIOTIC RATIONALE CARD */}
          {activeTab === "semiotics" && (
            <div className="flex flex-col gap-4 bg-primary/5 border border-primary/20 p-5 rounded-2xl text-xs">
              <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                <span className="font-mono text-primary uppercase font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  {isAz ? "SANAT YÖNETMENİ & SEMİOTİKA RAPORU" : "ART DIRECTION & SEMIOTIC REPORT"}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary">
                  {semioticReport.cognitiveFriction}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-neutral-500 text-[10px] block">{isAz ? "Mental Kapanma Süresi:" : "Mental Closure Time:"}</span>
                  <span className="text-base font-bold text-white">~{semioticReport.mentalClosureMs} ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-neutral-500 text-[10px] block">{isAz ? "Hatırlanabilirlik Skoru:" : "Memorability Index:"}</span>
                  <span className="text-base font-bold text-emerald-400">{semioticReport.memorabilityScore} / 100</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-white block mb-1">{isAz ? "Bilişsel Mekanizma:" : "Cognitive Mechanism:"}</span>
                <p className="text-neutral-300 leading-relaxed">
                  {isAz ? semioticReport.cognitiveMechanism_az : semioticReport.cognitiveMechanism}
                </p>
              </div>

              <div>
                <span className="font-bold text-white block mb-1">{isAz ? "Kategori & Kullanım Alanı:" : "Strategic Category Fit:"}</span>
                <p className="text-neutral-300 leading-relaxed">
                  {isAz ? semioticReport.artDirectionCritique_az : semioticReport.artDirectionCritique}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualMetaphorCanvas;
