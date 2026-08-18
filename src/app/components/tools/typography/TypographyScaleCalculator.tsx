import React, { useState, useMemo } from "react";
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

export default function TypographyScaleCalculator() {
  const { language } = useLanguage();
  const isAz = language === "az";

  const [config, setConfig] = useState<TypeScaleConfig>(DEFAULT_TYPE_CONFIG);
  const [simulatedWidth, setSimulatedWidth] = useState<number>(1024);

  const result = useMemo(() => calculateTypeScale(config), [config]);

  const handleConfigChange = (updated: Partial<TypeScaleConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setConfig(DEFAULT_TYPE_CONFIG);
    setSimulatedWidth(1024);
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
