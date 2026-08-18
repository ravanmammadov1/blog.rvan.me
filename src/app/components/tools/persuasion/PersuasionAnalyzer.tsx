import React, { useState, useMemo } from "react";
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

export default function PersuasionAnalyzer() {
  const { language } = useLanguage();
  const isAz = language === "az";

  const defaultPreset = PERSUASION_PRESETS[0];

  const [copyType, setCopyType] = useState<CopyType>(defaultPreset.type);
  const [inputText, setInputText] = useState<string>(defaultPreset.text);

  const analysis = useMemo(
    () => analyzePersuasion(inputText, copyType),
    [inputText, copyType]
  );

  const handleSelectPreset = (preset: PersuasionPreset) => {
    setCopyType(preset.type);
    setInputText(preset.text);
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
        onCopyTypeChange={setCopyType}
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
