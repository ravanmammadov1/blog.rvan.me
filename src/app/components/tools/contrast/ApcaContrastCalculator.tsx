import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { evaluateContrast, ContrastPreset, isValidHex, normalizeHex } from "../../../../lib/accessibility/apcaEngine";
import ApcaColorControls from "./ApcaColorControls";
import ApcaScoreCard from "./ApcaScoreCard";
import ApcaTypographyMatrix from "./ApcaTypographyMatrix";
import ApcaLiveUiSpecimen from "./ApcaLiveUiSpecimen";
import ApcaTokenMatrix from "./ApcaTokenMatrix";
import ApcaCodeExporter from "./ApcaCodeExporter";
import ApcaEditorialGuide from "./ApcaEditorialGuide";
import { ShareToolButton } from "../ShareToolButton";
import { Grid, Layout, Layers, Code, Sparkles } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";
import { trackToolUsage } from "../../../../lib/analytics/events";

type ViewTab = "matrix" | "specimen" | "tokens" | "code";

function parseHexParam(param: string | null, fallback: string): string {
  if (!param) return fallback;
  const clean = param.trim().startsWith("#") ? param.trim() : `#${param.trim()}`;
  return isValidHex(clean) ? normalizeHex(clean) : fallback;
}

function parseTabParam(param: string | null): ViewTab {
  if (param === "specimen" || param === "tokens" || param === "code") {
    return param;
  }
  return "matrix";
}

export default function ApcaContrastCalculator() {
  const { language } = useLanguage();
  const isAz = language === "az";
  const [searchParams, setSearchParams] = useSearchParams();

  const [fgColor, setFgColor] = useState<string>(() =>
    parseHexParam(searchParams.get("fg"), "#FFFFFF")
  );
  const [bgColor, setBgColor] = useState<string>(() =>
    parseHexParam(searchParams.get("bg"), "#0F172A")
  );
  const [activeTab, setActiveTab] = useState<ViewTab>(() =>
    parseTabParam(searchParams.get("tab"))
  );

  // Sync state when URL searchParams change (e.g. Back/Forward or fresh navigation)
  useEffect(() => {
    const fgP = searchParams.get("fg");
    const bgP = searchParams.get("bg");
    const tabP = searchParams.get("tab");

    if (fgP) {
      const parsedFg = parseHexParam(fgP, "#FFFFFF");
      if (parsedFg.toUpperCase() !== fgColor.toUpperCase()) {
        setFgColor(parsedFg);
      }
    }
    if (bgP) {
      const parsedBg = parseHexParam(bgP, "#0F172A");
      if (parsedBg.toUpperCase() !== bgColor.toUpperCase()) {
        setBgColor(parsedBg);
      }
    }
    if (tabP) {
      const parsedTab = parseTabParam(tabP);
      if (parsedTab !== activeTab) {
        setActiveTab(parsedTab);
      }
    }
  }, [searchParams]);

  // Sync state to URL search parameters on user changes
  useEffect(() => {
    const cleanFg = fgColor.replace("#", "");
    const cleanBg = bgColor.replace("#", "");
    const currentFg = searchParams.get("fg");
    const currentBg = searchParams.get("bg");
    const currentTab = searchParams.get("tab") || "matrix";

    if (
      currentFg?.toLowerCase() !== cleanFg.toLowerCase() ||
      currentBg?.toLowerCase() !== cleanBg.toLowerCase() ||
      currentTab !== activeTab
    ) {
      setSearchParams(
        { fg: cleanFg, bg: cleanBg, tab: activeTab },
        { replace: true }
      );
    }
  }, [fgColor, bgColor, activeTab, setSearchParams, searchParams]);

  const evaluation = useMemo(
    () => evaluateContrast(fgColor, bgColor),
    [fgColor, bgColor]
  );

  const handleSwap = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
    trackToolUsage("contrast-matrix", "polarity_swapped");
  };

  const handleSelectPreset = (preset: ContrastPreset) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
    trackToolUsage("contrast-matrix", "preset_selected", { name: preset.name });
  };

  const handleTabChange = (tab: ViewTab) => {
    setActiveTab(tab);
    trackToolUsage("contrast-matrix", "tab_switched", { tab });
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
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] p-1.5 backdrop-blur-md overflow-x-auto max-w-full">
            <button
              onClick={() => handleTabChange("matrix")}
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
              onClick={() => handleTabChange("specimen")}
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
              onClick={() => handleTabChange("tokens")}
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
              onClick={() => handleTabChange("code")}
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

          <div className="flex items-center gap-3">
            <div className="text-[11px] text-muted-foreground mono hidden sm:block">
              {isAz ? `Seçilmiş cütlük: ${evaluation.fgHex} / ${evaluation.bgHex}` : `Pair: ${evaluation.fgHex} on ${evaluation.bgHex}`}
            </div>
            <ShareToolButton size="sm" />
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
