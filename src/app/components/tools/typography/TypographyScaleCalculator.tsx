import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  TypeScaleConfig,
  DEFAULT_TYPE_CONFIG,
  calculateTypeScale,
} from "../../../../lib/typography/typeScaleEngine";
import TypeScaleControls from "./TypeScaleControls";
import TypeScaleHierarchyPreview from "./TypeScaleHierarchyPreview";
import TypeScaleViewportSimulator from "./TypeScaleViewportSimulator";
import TypeScaleCodeExporter from "./TypeScaleCodeExporter";
import TypeScaleEditorialGuide from "./TypeScaleEditorialGuide";
import { Sliders, Eye, Code, Gauge, Sparkles } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";
import { trackToolUsage } from "../../../../lib/analytics/events";

function parseNumberParam(val: string | null, min: number, max: number, fallback: number): number {
  if (!val) return fallback;
  const num = parseFloat(val);
  if (isNaN(num) || !isFinite(num) || num < min || num > max) return fallback;
  return num;
}

function parseConfigFromUrl(searchParams: URLSearchParams): TypeScaleConfig {
  const minW = parseNumberParam(searchParams.get("minW"), 240, 1024, DEFAULT_TYPE_CONFIG.minViewport);
  const maxW = parseNumberParam(searchParams.get("maxW"), 800, 2560, DEFAULT_TYPE_CONFIG.maxViewport);
  const minBase = parseNumberParam(searchParams.get("minBase"), 10, 32, DEFAULT_TYPE_CONFIG.minBaseFontSize);
  const maxBase = parseNumberParam(searchParams.get("maxBase"), 12, 48, DEFAULT_TYPE_CONFIG.maxBaseFontSize);
  const minRatio = parseNumberParam(searchParams.get("minRatio"), 1.0, 2.5, DEFAULT_TYPE_CONFIG.minScaleRatio);
  const maxRatio = parseNumberParam(searchParams.get("maxRatio"), 1.0, 2.5, DEFAULT_TYPE_CONFIG.maxScaleRatio);
  const ratioKey = searchParams.get("ratio") || DEFAULT_TYPE_CONFIG.ratioKey;

  return {
    ...DEFAULT_TYPE_CONFIG,
    minViewport: minW,
    maxViewport: maxW,
    minBaseFontSize: minBase,
    maxBaseFontSize: maxBase,
    minScaleRatio: minRatio,
    maxScaleRatio: maxRatio,
    ratioKey: ratioKey,
  };
}

export default function TypographyScaleCalculator() {
  const { language } = useLanguage();
  const isAz = language === "az";
  const [searchParams, setSearchParams] = useSearchParams();

  const [config, setConfig] = useState<TypeScaleConfig>(() =>
    parseConfigFromUrl(searchParams)
  );
  const [simulatedWidth, setSimulatedWidth] = useState<number>(1024);

  // Sync state when URL changes externally (e.g. Back/Forward navigation)
  useEffect(() => {
    const updated = parseConfigFromUrl(searchParams);
    setConfig((prev) => {
      if (
        prev.minViewport !== updated.minViewport ||
        prev.maxViewport !== updated.maxViewport ||
        prev.minBaseFontSize !== updated.minBaseFontSize ||
        prev.maxBaseFontSize !== updated.maxBaseFontSize ||
        prev.minScaleRatio !== updated.minScaleRatio ||
        prev.maxScaleRatio !== updated.maxScaleRatio ||
        prev.ratioKey !== updated.ratioKey
      ) {
        return updated;
      }
      return prev;
    });
  }, [searchParams]);

  // Sync state to URL search params on configuration change
  useEffect(() => {
    const nextParams: Record<string, string> = {
      minW: String(config.minViewport),
      maxW: String(config.maxViewport),
      minBase: String(config.minBaseFontSize),
      maxBase: String(config.maxBaseFontSize),
      minRatio: String(config.minScaleRatio),
      maxRatio: String(config.maxScaleRatio),
    };
    if (config.ratioKey) {
      nextParams.ratio = config.ratioKey;
    }

    setSearchParams(nextParams, { replace: true });
  }, [config, setSearchParams]);

  const result = useMemo(() => calculateTypeScale(config), [config]);

  const handleConfigChange = (updated: Partial<TypeScaleConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updated };
      if (updated.ratioKey && updated.ratioKey !== prev.ratioKey) {
        trackToolUsage("typography-scale", "ratio_selected", { ratio: updated.ratioKey });
      }
      return next;
    });
  };

  const handleReset = () => {
    setConfig(DEFAULT_TYPE_CONFIG);
    setSimulatedWidth(1024);
    trackToolUsage("typography-scale", "reset_defaults");
  };

  return (
    <div className="w-full space-y-12">
      {/* 1. Main Interactive Workbench: 2-Column Responsive Layout */}
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Left Column: Configuration Controls Panel (5 cols on Desktop) */}
        <aside className="lg:col-span-5 space-y-6">
          <TypeScaleControls
            config={config}
            onChange={handleConfigChange}
            onReset={handleReset}
          />

          {/* Quick Stats Pill */}
          <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 text-xs mono text-muted-foreground flex items-center justify-between">
            <span>{isAz ? "Generasiya edilən səviyyələr:" : "Calculated Hierarchy Levels:"}</span>
            <span className="font-bold text-primary">{result.steps.length} {isAz ? "Səviyyə" : "Steps"} (Display → Caption)</span>
          </div>
        </aside>

        {/* Right Column: Live Viewport Simulator & Specimen Preview (7 cols on Desktop) */}
        <main className="lg:col-span-7 space-y-8 min-w-0">
          {/* Viewport Width Simulator Ruler */}
          <TypeScaleViewportSimulator
            currentWidth={simulatedWidth}
            minViewport={config.minViewport}
            maxViewport={config.maxViewport}
            onWidthChange={setSimulatedWidth}
          />

          {/* Live Hierarchy Specimen Canvas */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl">
            <TypeScaleHierarchyPreview
              result={result}
              simulatedWidth={simulatedWidth}
            />
          </div>
        </main>
      </div>

      {/* 2. Code Export Engine Section (Full Width) */}
      <section aria-labelledby="code-export-heading" className="space-y-4">
        <TypeScaleCodeExporter result={result} />
      </section>

      {/* 3. Comprehensive Educational & SEO Guide */}
      <TypeScaleEditorialGuide />
    </div>
  );
}
