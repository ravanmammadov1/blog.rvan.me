import React, { useState, useMemo } from "react";
import { evaluateContrast, ContrastPreset } from "../../../../lib/accessibility/apcaEngine";
import ApcaColorControls from "./ApcaColorControls";
import ApcaScoreCard from "./ApcaScoreCard";
import ApcaTypographyMatrix from "./ApcaTypographyMatrix";
import ApcaLiveUiSpecimen from "./ApcaLiveUiSpecimen";
import ApcaTokenMatrix from "./ApcaTokenMatrix";
import ApcaCodeExporter from "./ApcaCodeExporter";
import ApcaEditorialGuide from "./ApcaEditorialGuide";
import { Grid, Layout, Layers, Code, Sparkles } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

type ViewTab = "matrix" | "specimen" | "tokens" | "code";

export default function ApcaContrastCalculator() {
  const { language } = useLanguage();
  const isAz = language === "az";

  const [fgColor, setFgColor] = useState<string>("#FFFFFF");
  const [bgColor, setBgColor] = useState<string>("#0F172A");
  const [activeTab, setActiveTab] = useState<ViewTab>("matrix");

  const evaluation = useMemo(
    () => evaluateContrast(fgColor, bgColor),
    [fgColor, bgColor]
  );

  const handleSwap = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  const handleSelectPreset = (preset: ContrastPreset) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
  };

  return (
    <div className="w-full space-y-12">
      {/* 1. Color Inputs & Presets Control Panel */}
      <ApcaColorControls
        fgColor={fgColor}
        bgColor={bgColor}
        onFgChange={setFgColor}
        onBgChange={setBgColor}
        onSwap={handleSwap}
        onSelectPreset={handleSelectPreset}
      />

      {/* 2. Score Readout & WCAG Comparison Card */}
      <ApcaScoreCard evaluation={evaluation} />

      {/* 3. Interactive Workspaces: Tab Navigation */}
      <section aria-labelledby="workspace-tabs" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] p-1.5 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all mono ${
                activeTab === "matrix"
                  ? "bg-primary text-black shadow-md"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Grid size={14} />
              <span>{isAz ? "Tipoqrafiya Matrisi" : "Typography Matrix"}</span>
            </button>

            <button
              onClick={() => setActiveTab("specimen")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all mono ${
                activeTab === "specimen"
                  ? "bg-primary text-black shadow-md"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Layout size={14} />
              <span>{isAz ? "Canlı UI Nümunəsi" : "Live UI Preview"}</span>
            </button>

            <button
              onClick={() => setActiveTab("tokens")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all mono ${
                activeTab === "tokens"
                  ? "bg-primary text-black shadow-md"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Layers size={14} />
              <span>{isAz ? "Semantik Tokenlər" : "Design Tokens"}</span>
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all mono ${
                activeTab === "code"
                  ? "bg-primary text-black shadow-md"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Code size={14} />
              <span>{isAz ? "İxrac & CSS" : "Code Export"}</span>
            </button>
          </div>

          <div className="text-[11px] text-muted-foreground mono hidden sm:block">
            {isAz ? `Seçilmiş cütlük: ${evaluation.fgHex} / ${evaluation.bgHex}` : `Pair: ${evaluation.fgHex} on ${evaluation.bgHex}`}
          </div>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === "matrix" && <ApcaTypographyMatrix evaluation={evaluation} />}
          {activeTab === "specimen" && <ApcaLiveUiSpecimen evaluation={evaluation} />}
          {activeTab === "tokens" && <ApcaTokenMatrix />}
          {activeTab === "code" && <ApcaCodeExporter evaluation={evaluation} />}
        </div>
      </section>

      {/* 4. Comprehensive Educational & SEO Guide */}
      <ApcaEditorialGuide />
    </div>
  );
}
