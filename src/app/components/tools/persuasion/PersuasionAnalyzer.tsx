import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CopyType,
  analyzePersuasion,
  PersuasionPreset,
  PERSUASION_PRESETS,
} from "../../../../lib/marketing/persuasionEngine";
import PersuasionInputControls from "./PersuasionInputControls";
import PersuasionScoreOverview from "./PersuasionScoreOverview";
import PersuasionDimensionCards from "./PersuasionDimensionCards";
import PersuasionSuggestions from "./PersuasionSuggestions";
import PersuasionEditorialGuide from "./PersuasionEditorialGuide";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";
import { trackToolUsage } from "../../../../lib/analytics/events";

function parseCopyTypeParam(param: string | null): CopyType {
  if (param === "headline" || param === "cta" || param === "value_prop") {
    return param;
  }
  return "headline";
}

export default function PersuasionAnalyzer() {
  const { language } = useLanguage();
  const isAz = language === "az";
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultPreset = PERSUASION_PRESETS[0];

  const [copyType, setCopyType] = useState<CopyType>(() =>
    parseCopyTypeParam(searchParams.get("mode"))
  );
  const [inputText, setInputText] = useState<string>(() => {
    const initialMode = parseCopyTypeParam(searchParams.get("mode"));
    const matchedPreset = PERSUASION_PRESETS.find((p) => p.type === initialMode);
    return matchedPreset ? matchedPreset.text : defaultPreset.text;
  });

  // Sync mode when URL changes externally (e.g. Back/Forward navigation)
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam) {
      const parsed = parseCopyTypeParam(modeParam);
      if (parsed !== copyType) {
        setCopyType(parsed);
      }
    }
  }, [searchParams]);

  // Sync mode to URL query parameters on user change
  useEffect(() => {
    const currentMode = searchParams.get("mode");
    if (currentMode !== copyType) {
      setSearchParams({ mode: copyType }, { replace: true });
    }
  }, [copyType, setSearchParams, searchParams]);

  const analysis = useMemo(
    () => analyzePersuasion(inputText, copyType),
    [inputText, copyType]
  );

  const handleCopyTypeChange = (type: CopyType) => {
    setCopyType(type);
    trackToolUsage("persuasion-analyzer", "mode_switched", { mode: type });
  };

  const handleSelectPreset = (preset: PersuasionPreset) => {
    setCopyType(preset.type);
    setInputText(preset.text);
    trackToolUsage("persuasion-analyzer", "preset_loaded", {
      mode: preset.type,
      score_tier: preset.expectedScore >= 80 ? "high" : preset.expectedScore >= 60 ? "medium" : "low",
    });
  };

  const handleClear = () => {
    setInputText("");
  };

  return (
    <div className="w-full space-y-12">
      {/* 1. Input Controls & Format Switcher */}
      <PersuasionInputControls
        copyType={copyType}
        inputText={inputText}
        wordCount={analysis.wordCount}
        charCount={analysis.charCount}
        onCopyTypeChange={handleCopyTypeChange}
        onInputChange={setInputText}
        onSelectPreset={handleSelectPreset}
        onClear={handleClear}
      />

      {/* 2. Primary Impact Score Readout & Signal Pills */}
      <PersuasionScoreOverview analysis={analysis} />

      {/* 3. 6 Core Cognitive Dimension Breakdown Cards */}
      {analysis.dimensions.length > 0 && (
        <PersuasionDimensionCards dimensions={analysis.dimensions} />
      )}

      {/* 4. Concrete Actionable Suggestions & Exemplars */}
      <PersuasionSuggestions
        suggestions={analysis.suggestions}
        copyType={copyType}
      />

      {/* 5. In-Depth Marketing Psychology & Editorial Guide */}
      <PersuasionEditorialGuide />
    </div>
  );
}
