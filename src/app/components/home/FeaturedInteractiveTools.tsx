import React, { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Wrench, ArrowUpRight, Sparkles } from "lucide-react";
import { INTERACTIVE_TOOLS } from "../../lib/toolsRegistry";

const CssGridGenerator = lazy(() => import("../tools/CssGridGenerator"));
const SvgWaveGenerator = lazy(() => import("../tools/SvgWaveGenerator"));
const FluidTypescaleGenerator = lazy(() => import("../tools/FluidTypescaleGenerator"));
const BoxShadowGenerator = lazy(() => import("../tools/BoxShadowGenerator"));
const ColorConverterTool = lazy(() => import("../tools/ColorConverterTool"));

export const FeaturedInteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("svg-wave-generator");

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
    <section id="interactive-tools" className="px-6 py-28 md:px-10 md:py-36 border-t border-border relative bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mono flex items-center gap-1.5 mb-3">
              <Sparkles size={12} /> IN-BROWSER WORKFLOW ENGINE
            </span>
            <h2 className="text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Featured Interactive Tools.
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground/80 max-w-2xl font-medium leading-relaxed">
              Test visual CSS generators, waves, fluid typography, and color contrast directly on this page—zero API dependencies, instant client-side code export.
            </p>
          </div>

          <Link
            to="/tools"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold tracking-widest text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-xl shrink-0"
          >
            VIEW ALL IN-BROWSER UTILITIES <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Interactive Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {INTERACTIVE_TOOLS.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-black shadow-[0_0_15px_rgba(232,253,82,0.3)] font-bold"
                    : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
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
