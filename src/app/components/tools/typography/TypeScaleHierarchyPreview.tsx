import React, { useState } from "react";
import { TypeScaleResult, TypeScaleStep, calculateComputedSize } from "../../../../lib/typography/typeScaleEngine";
import { Copy, Check, Eye, Edit3, ArrowRight } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface TypeScaleHierarchyPreviewProps {
  result: TypeScaleResult;
  simulatedWidth: number;
}

export default function TypeScaleHierarchyPreview({
  result,
  simulatedWidth,
}: TypeScaleHierarchyPreviewProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editableTexts, setEditableTexts] = useState<Record<string, string>>({});

  const handleCopyStep = (step: TypeScaleStep) => {
    navigator.clipboard.writeText(step.clampCss);
    setCopiedKey(step.name);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTextChange = (stepName: string, text: string) => {
    setEditableTexts((prev) => ({ ...prev, [stepName]: text }));
  };

  const fontFamilyStyle = {
    fontFamily: `'${result.config.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mono">
            <Eye size={16} />
            <span>{isAz ? "CANLI TİPOQRAFİYA İYERARXİYASI" : "LIVE TYPOGRAPHY HIERARCHY"}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {isAz
              ? `Simulyasiya edilən ekran: ${simulatedWidth}px (şrift ölçüləri canlı hesablanır)`
              : `Simulated viewport: ${simulatedWidth}px (font sizes calculated in real-time)`}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80 mono">
          <Edit3 size={13} className="text-primary" />
          <span>{isAz ? "Mətnləri birbaşa klikləyərək redaktə edə bilərsiniz" : "Click any text to test custom copy"}</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-8 divide-y divide-white/5">
        {result.steps.map((step) => {
          const currentPx = calculateComputedSize(
            step.minPx,
            step.maxPx,
            result.config.minViewport,
            result.config.maxViewport,
            simulatedWidth
          );
          const currentRem = (currentPx / result.config.rootFontSize).toFixed(2);
          const textValue =
            editableTexts[step.name] !== undefined
              ? editableTexts[step.name]
              : isAz
              ? step.sampleText_az
              : step.sampleText;

          const isCopied = copiedKey === step.name;

          return (
            <div
              key={step.name}
              className="group pt-6 first:pt-0 transition-colors duration-200"
            >
              {/* Step Metadata Bar */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs mono">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-bold text-primary text-[10px]">
                    {step.tag}
                  </span>
                  <span className="font-semibold text-foreground">{step.name}</span>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="text-muted-foreground">
                    {isAz ? step.label_az : step.label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {currentPx}px <span className="text-muted-foreground/60">({currentRem}rem)</span>
                  </span>
                  <span className="text-muted-foreground/40 hidden sm:inline">|</span>
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">
                    Range: {step.minPx}px → {step.maxPx}px
                  </span>
                  <button
                    onClick={() => handleCopyStep(step)}
                    className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-muted-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all"
                    title={`Copy: ${step.clampCss}`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={11} className="text-emerald-400 group-hover:text-black" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>CSS CLAMP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Editable Specimen Line */}
              <div className="overflow-hidden py-1">
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => handleTextChange(step.name, e.target.value)}
                  style={{
                    fontSize: `${currentPx}px`,
                    lineHeight: step.lineHeight,
                    letterSpacing: step.letterSpacing,
                    ...fontFamilyStyle,
                  }}
                  className="w-full bg-transparent text-foreground outline-none border-b border-transparent hover:border-white/20 focus:border-primary font-semibold transition-colors duration-200"
                  aria-label={`${step.tag} specimen text`}
                />
              </div>

              {/* Clamp Token Footnote */}
              <div className="mt-2 text-[10px] text-muted-foreground/60 mono truncate">
                <code>{step.clampCss}</code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
