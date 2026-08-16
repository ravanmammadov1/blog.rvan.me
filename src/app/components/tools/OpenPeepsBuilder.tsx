import React, { useState } from "react";
import {
  PeepConfig,
  DEFAULT_PEEP_CONFIG,
  EXPRESSIONS,
  HAIR_STYLES,
  ACCESSORIES,
  BODIES,
  SKIN_TONES,
  HAIR_COLORS,
  CLOTHING_COLORS,
  BACKGROUND_PRESETS,
  buildPeepSvg,
  generateRandomPeep,
} from "./openpeeps/peepsAssets";
import {
  Sparkles,
  Dices,
  Download,
  Copy,
  Check,
  FlipHorizontal,
  Smile,
  Scissors,
  Glasses,
  Shirt,
  Palette,
  ZoomIn,
  ZoomOut,
  ImageIcon,
  SlidersHorizontal,
} from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

export default function OpenPeepsBuilder() {
  const { language } = useLanguage();
  const [config, setConfig] = useState<PeepConfig>(DEFAULT_PEEP_CONFIG);
  const [activeTab, setActiveTab] = useState<"expression" | "hair" | "accessory" | "body" | "colors">("expression");
  const [copied, setCopied] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  // SVG Markup string for current config in Studio
  const currentSvgString = buildPeepSvg(config, 500);

  // Handlers
  const handleRandomize = () => {
    setConfig(generateRandomPeep());
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(currentSvgString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = (svgContent?: string, filename?: string) => {
    const content = svgContent || currentSvgString;
    const blob = new Blob([content], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `character-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = async (svgContent?: string, filename?: string) => {
    try {
      setIsExportingPng(true);
      const content = svgContent || currentSvgString;
      const svgBlob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0, 1024, 1024);
          const pngUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = filename || `character-${Date.now()}.png`;
          a.click();
        }
        URL.revokeObjectURL(blobURL);
        setIsExportingPng(false);
      };
      image.src = blobURL;
    } catch (err) {
      console.error("PNG export error:", err);
      setIsExportingPng(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#0d0d10] text-[#ededed] border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-0">
      {/* ── TOP HEADER / WORKSPACE BAR ── */}
      <div className="border-b border-white/10 bg-black/60 backdrop-blur-xl px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight uppercase font-mono flex items-center gap-2">
              <span>CHARACTER BUILDER TOOL</span>
              <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                CC0 • Open Source
              </span>
            </h2>
          </div>
        </div>

        {/* View Mode Switcher (Gallery / Studio / Guide) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg font-bold bg-primary text-black flex items-center gap-1.5">
              <SlidersHorizontal size={13} />
              <span>{language === "az" ? "Studio" : "Custom Studio"}</span>
            </span>
          </div>

          <button
            onClick={handleRandomize}
            className="px-3.5 py-2 rounded-xl bg-primary text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 transition shadow-[0_0_15px_rgba(97,197,173,0.3)] cursor-pointer"
            title="Randomize Character"
          >
            <Dices size={14} />
            <span className="hidden sm:inline">{language === "az" ? "TƏSADÜFİ 🎲" : "RANDOMIZE"}</span>
          </button>
        </div>
      </div>





      {/* ─────────────────────────────────────────────────────────────────────────────
          3. INTERACTIVE CHARACTER STUDIO SECTION
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* ── LEFT: MODULAR ASSET SELECTOR ── */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 bg-black/30 flex flex-col">
            {/* Tab Selector */}
            <div className="grid grid-cols-5 p-1.5 border-b border-white/10 bg-black/40 gap-1">
              <button
                onClick={() => setActiveTab("expression")}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                  activeTab === "expression" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                }`}
                title="Expression"
              >
                <Smile size={14} />
                <span className="hidden sm:inline">Face</span>
              </button>
              <button
                onClick={() => setActiveTab("hair")}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                  activeTab === "hair" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                }`}
                title="Hair & Hats"
              >
                <Scissors size={14} />
                <span className="hidden sm:inline">Hair</span>
              </button>
              <button
                onClick={() => setActiveTab("accessory")}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                  activeTab === "accessory" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                }`}
                title="Glasses & Facial Hair"
              >
                <Glasses size={14} />
                <span className="hidden sm:inline">Extra</span>
              </button>
              <button
                onClick={() => setActiveTab("body")}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                  activeTab === "body" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                }`}
                title="Clothing & Pose"
              >
                <Shirt size={14} />
                <span className="hidden sm:inline">Pose</span>
              </button>
              <button
                onClick={() => setActiveTab("colors")}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                  activeTab === "colors" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                }`}
                title="Color Palette"
              >
                <Palette size={14} />
                <span className="hidden sm:inline">Palette</span>
              </button>
            </div>

            {/* Options Panel */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[460px] lg:max-h-[580px] custom-scrollbar space-y-2">
              {/* Expression Items */}
              {activeTab === "expression" && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider block mb-2">
                    Facial Expression ({EXPRESSIONS.length})
                  </span>
                  {EXPRESSIONS.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setConfig({ ...config, headExpression: exp.id })}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-mono font-bold transition flex items-center justify-between cursor-pointer ${
                        config.headExpression === exp.id
                          ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(97,197,173,0.15)]"
                          : "bg-white/[0.02] border-white/5 text-muted-foreground hover:border-white/15 hover:text-white"
                      }`}
                    >
                      <span>{exp.name}</span>
                      {config.headExpression === exp.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}

              {/* Hair Style Items */}
              {activeTab === "hair" && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider block mb-2">
                    Hair Style & Headwear ({HAIR_STYLES.length})
                  </span>
                  {HAIR_STYLES.map((hair) => (
                    <button
                      key={hair.id}
                      onClick={() => setConfig({ ...config, hairStyle: hair.id })}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-mono font-bold transition flex items-center justify-between cursor-pointer ${
                        config.hairStyle === hair.id
                          ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(97,197,173,0.15)]"
                          : "bg-white/[0.02] border-white/5 text-muted-foreground hover:border-white/15 hover:text-white"
                      }`}
                    >
                      <span>{hair.name}</span>
                      {config.hairStyle === hair.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}

              {/* Accessories Items */}
              {activeTab === "accessory" && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider block mb-2">
                    Glasses & Facial Hair ({ACCESSORIES.length})
                  </span>
                  {ACCESSORIES.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => setConfig({ ...config, accessory: acc.id })}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-mono font-bold transition flex items-center justify-between cursor-pointer ${
                        config.accessory === acc.id
                          ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(97,197,173,0.15)]"
                          : "bg-white/[0.02] border-white/5 text-muted-foreground hover:border-white/15 hover:text-white"
                      }`}
                    >
                      <span>{acc.name}</span>
                      {config.accessory === acc.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}

              {/* Body / Pose Items */}
              {activeTab === "body" && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider block mb-2">
                    Clothing & Pose ({BODIES.length})
                  </span>
                  {BODIES.map((body) => (
                    <button
                      key={body.id}
                      onClick={() => setConfig({ ...config, bodyPose: body.id, mode: body.type })}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-mono font-bold transition flex items-center justify-between cursor-pointer ${
                        config.bodyPose === body.id
                          ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(97,197,173,0.15)]"
                          : "bg-white/[0.02] border-white/5 text-muted-foreground hover:border-white/15 hover:text-white"
                      }`}
                    >
                      <span>{body.name}</span>
                      {config.bodyPose === body.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}

              {/* Color Palettes Panel */}
              {activeTab === "colors" && (
                <div className="space-y-5">
                  {/* Style Toggle */}
                  <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-primary block">
                      INK STYLE
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setConfig({ ...config, inkStyle: "bw" })}
                        className={`py-2 rounded-lg text-xs font-mono font-bold border transition cursor-pointer ${
                          config.inkStyle === "bw"
                            ? "bg-white text-black border-white"
                            : "border-white/10 text-muted-foreground hover:text-white"
                        }`}
                      >
                        B&W Sketch
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, inkStyle: "color" })}
                        className={`py-2 rounded-lg text-xs font-mono font-bold border transition cursor-pointer ${
                          config.inkStyle === "color"
                            ? "bg-primary text-black border-primary"
                            : "border-white/10 text-muted-foreground hover:text-white"
                        }`}
                      >
                        Colorized
                      </button>
                    </div>
                  </div>

                  {/* Skin Tone */}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground block mb-2">
                      Skin Tone
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {SKIN_TONES.map((tone) => (
                        <button
                          key={tone.value}
                          onClick={() => setConfig({ ...config, skinColor: tone.value, inkStyle: "color" })}
                          className={`h-8 rounded-xl border flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                            config.skinColor === tone.value ? "border-primary ring-2 ring-primary/40" : "border-white/10"
                          }`}
                          style={{ backgroundColor: tone.value }}
                          title={tone.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hair Color */}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground block mb-2">
                      Hair Color
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {HAIR_COLORS.map((hc) => (
                        <button
                          key={hc.value}
                          onClick={() => setConfig({ ...config, hairColor: hc.value, inkStyle: "color" })}
                          className={`h-8 rounded-xl border flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                            config.hairColor === hc.value ? "border-primary ring-2 ring-primary/40" : "border-white/10"
                          }`}
                          style={{ backgroundColor: hc.value }}
                          title={hc.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Clothing Color */}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground block mb-2">
                      Clothing Color
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {CLOTHING_COLORS.map((cc) => (
                        <button
                          key={cc.value}
                          onClick={() => setConfig({ ...config, clothingColor: cc.value, inkStyle: "color" })}
                          className={`h-8 rounded-xl border flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                            config.clothingColor === cc.value ? "border-primary ring-2 ring-primary/40" : "border-white/10"
                          }`}
                          style={{ backgroundColor: cc.value }}
                          title={cc.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── CENTER: LIVE CHARACTER CANVAS PREVIEW ── */}
          <div className="lg:col-span-5 p-6 md:p-8 flex flex-col items-center justify-center bg-[#070709] relative overflow-hidden">
            {/* Checkered backdrop pattern */}
            <div
              className="w-full max-w-[360px] aspect-square rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl"
              style={{
                background:
                  config.backgroundColor === "transparent"
                    ? "repeating-conic-gradient(#18181b 0% 25%, #0f0f11 0% 50%) 50% / 20px 20px"
                    : config.backgroundColor,
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: currentSvgString }}
              />
            </div>

            {/* Quick Preview Toggles Bar */}
            <div className="flex items-center gap-3 mt-6 bg-black/60 border border-white/10 rounded-full px-4 py-1.5 text-xs font-mono">
              <button
                onClick={() => setConfig({ ...config, flipHorizontal: !config.flipHorizontal })}
                className={`flex items-center gap-1.5 transition cursor-pointer ${config.flipHorizontal ? "text-primary font-bold" : "text-muted-foreground hover:text-white"}`}
                title="Flip Horizontal"
              >
                <FlipHorizontal size={14} />
                <span>Flip</span>
              </button>
              <div className="h-3 w-px bg-white/10" />
              <button
                onClick={() => setConfig({ ...config, scale: Math.max(0.7, config.scale - 0.1) })}
                className="text-muted-foreground hover:text-white p-1 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-[11px] text-zinc-400 font-bold">{Math.round(config.scale * 100)}%</span>
              <button
                onClick={() => setConfig({ ...config, scale: Math.min(1.4, config.scale + 0.1) })}
                className="text-muted-foreground hover:text-white p-1 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* ── RIGHT: EXPORT & BACKGROUND CONFIGURATION ── */}
          <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-white/10 bg-black/30 p-5 md:p-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase block mb-4">
                BACKGROUND & CANVAS
              </span>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {BACKGROUND_PRESETS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setConfig({ ...config, backgroundColor: bg.value })}
                    className={`p-2.5 rounded-xl border text-[11px] font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
                      config.backgroundColor === bg.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                      style={{ background: bg.value === "transparent" ? "#333" : bg.value }}
                    />
                    <span className="truncate">{bg.label}</span>
                  </button>
                ))}
              </div>

              <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase block mb-4">
                EXPORT CHARACTER
              </span>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleDownloadSvg()}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition cursor-pointer shadow-[0_0_20px_rgba(97,197,173,0.3)]"
                >
                  <Download size={14} />
                  <span>DOWNLOAD SVG</span>
                </button>

                <button
                  onClick={() => handleDownloadPng()}
                  disabled={isExportingPng}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  <ImageIcon size={14} className="text-cyan-400" />
                  <span>{isExportingPng ? "GENERATING PNG..." : "DOWNLOAD HIGH-RES PNG"}</span>
                </button>

                <button
                  onClick={handleCopySvg}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? "SVG COPIED!" : "COPY SVG CODE"}</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-muted-foreground leading-relaxed">
              Illustrations inspired by Pablo Stanley. Licensed under <strong className="text-emerald-400">CC0 (Public Domain)</strong> for free commercial and personal use.
            </div>
          </div>
        </div>
    </div>
  );
}
