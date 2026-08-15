import React, { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Wrench, ArrowUpRight, Sparkles, Grid, Waves, Type, Layers, Palette, Search } from "lucide-react";
import { INTERACTIVE_TOOLS } from "../../lib/toolsRegistry";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { Button } from "../ui/Button";

const CssGridGenerator = lazy(() => import("../tools/CssGridGenerator"));
const SvgWaveGenerator = lazy(() => import("../tools/SvgWaveGenerator"));
const FluidTypescaleGenerator = lazy(() => import("../tools/FluidTypescaleGenerator"));
const BoxShadowGenerator = lazy(() => import("../tools/BoxShadowGenerator"));
const ColorConverterTool = lazy(() => import("../tools/ColorConverterTool"));

const TOOL_ICONS: Record<string, React.ReactNode> = {
  "css-grid-generator": <Grid size={14} />,
  "svg-wave-generator": <Waves size={14} />,
  "fluid-typography-generator": <Type size={14} />,
  "box-shadow-generator": <Layers size={14} />,
  "color-converter-palette": <Palette size={14} />,
  "seo-meta-generator": <Search size={14} />,
};

export const FeaturedInteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("svg-wave-generator");
  const { t, getLocalizedPath } = useLanguage();

  const renderActiveTool = () => {
    switch (activeTab) {
      case "svg-wave-generator":
        return <SvgWaveGenerator />;
      case "css-grid-generator":
        return <CssGridGenerator />;
      case "box-shadow-generator":
        return <BoxShadowGenerator />;
      case "fluid-typography-generator":
        return <FluidTypescaleGenerator />;
      case "color-converter-palette":
        return <ColorConverterTool />;
      default:
        return <SvgWaveGenerator />;
    }
  };

  return (
    <section id="interactive-tools" className="px-6 py-28 md:px-10 md:py-36 border-t border-white/10 relative">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#61c5ad] uppercase mono flex items-center gap-1.5 mb-3">
              <Sparkles size={12} className="text-[#61c5ad]" /> {t("sectionToolsEyebrow", "PULSUZ BRAUZERDAXİLİ DEVELOPER VƏ DİZAYNER ALƏTLƏRİ")}
            </span>
            <h2 className="text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              {t("sectionToolsTitle", "Alətlər və interaktiv dəst.")}
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground/80 max-w-2xl font-medium leading-relaxed">
              {t("sectionToolsSubtitle", "API asılılığı və yükləmə olmadan istifadə edə biləcəyiniz praktik dizayn və developer alətləri. CSS, SVG, HTML və SEO üçün hazır nəticələr yaradın.")}
            </p>
          </div>

          <Button
            to={getLocalizedPath("/tools")}
            variant="primary"
            size="md"
            icon={<ArrowUpRight size={15} />}
            className="shrink-0"
          >
            {t("viewAllUtilities", "BÜTÜN ALƏTLƏRƏ BAX")}
          </Button>
        </div>

        {/* Interactive Tabs (Clean Lucide Icons, No Emojis) */}
        <div className="mb-8 flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {INTERACTIVE_TOOLS.map((tool) => {
            const isActive = activeTab === tool.id;
            return (
              <Button
                key={tool.id}
                variant="filter"
                size="sm"
                active={isActive}
                onClick={() => setActiveTab(tool.id)}
                icon={<span className={isActive ? "text-white" : "text-[#61c5ad]"}>{TOOL_ICONS[tool.id] || <Wrench size={14} />}</span>}
                iconPosition="left"
              >
                {tool.name}
              </Button>
            );
          })}
        </div>

        {/* Embedded Interactive Canvas */}
        <div className="relative">
          <Suspense fallback={<div className="h-96 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />}>
            {renderActiveTool()}
          </Suspense>
        </div>
      </div>
    </section>
  );
};
export default FeaturedInteractiveTools;
