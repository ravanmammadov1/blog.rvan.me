import React, { useEffect, useState, lazy, Suspense } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { getToolById, INTERACTIVE_TOOLS } from "../lib/toolsRegistry";
import { Wrench, ArrowLeft, Sparkles } from "lucide-react";

// Lazy-load individual tools
const CssGridGenerator = lazy(() => import("../components/tools/CssGridGenerator"));
const SvgWaveGenerator = lazy(() => import("../components/tools/SvgWaveGenerator"));
const FluidTypescaleGenerator = lazy(() => import("../components/tools/FluidTypescaleGenerator"));
const BoxShadowGenerator = lazy(() => import("../components/tools/BoxShadowGenerator"));
const ColorConverterTool = lazy(() => import("../components/tools/ColorConverterTool"));
const SeoMetaGenerator = lazy(() => import("../components/tools/SeoMetaGenerator"));

export const ToolDetailPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();

  const tool = getToolById(toolId || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [toolId]);

  if (!tool) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <SiteHeader />
        <div className="pt-40 pb-20 text-center px-6">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">The interactive utility you requested does not exist or has moved.</p>
          <Link to="/tools" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-black uppercase">
            <ArrowLeft size={14} /> Back to Tools Hub
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Generate JSON-LD SoftwareApplication / WebApplication Schema
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name,
    "description": tool.seoDescription,
    "url": `https://www.rvan.me${tool.path}`,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Ravan Mammadov"
    }
  };

  const renderToolComponent = () => {
    switch (tool.id) {
      case "css-grid-generator":
        return <CssGridGenerator />;
      case "svg-wave-generator":
        return <SvgWaveGenerator />;
      case "fluid-typography-generator":
        return <FluidTypescaleGenerator />;
      case "box-shadow-generator":
        return <BoxShadowGenerator />;
      case "color-converter-palette":
        return <ColorConverterTool />;
      case "seo-meta-generator":
        return <SeoMetaGenerator />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <SEO
        title={tool.seoTitle}
        description={tool.seoDescription}
        url={`https://www.rvan.me${tool.path}`}
      />

      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <SiteHeader />

      <div className="pt-32 pb-24 px-6 md:px-10 max-w-[1600px] mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mono mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/tools" className="hover:text-primary transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-primary">{tool.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mono flex items-center gap-1.5 mb-2">
                <span>{tool.icon}</span> IN-BROWSER UTILITY
              </span>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">
                {tool.name}
              </h1>
              <p className="mt-2 text-sm md:text-base text-muted-foreground/80 max-w-2xl font-medium leading-relaxed">
                {tool.description}
              </p>
            </div>

            <Link
              to="/tools"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all shrink-0 glass-sm"
            >
              <ArrowLeft size={14} /> ALL UTILITIES
            </Link>
          </div>
        </div>

        {/* Interactive Tool Container */}
        <Suspense fallback={<div className="h-96 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />}>
          {renderToolComponent()}
        </Suspense>

        {/* Other Interactive Tools Section */}
        <div className="mt-20 border-t border-border pt-12">
          <h3 className="text-xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-2">
            <Sparkles size={18} className="text-primary" /> Explore Other Free Developer & Designer Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTERACTIVE_TOOLS.filter((t) => t.id !== tool.id).map((other) => (
              <Link
                key={other.id}
                to={other.path}
                className="group p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-lg">{other.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full mono">
                      {other.category}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {other.name}
                  </h4>
                  <p className="text-xs text-muted-foreground/80 line-clamp-2">{other.description}</p>
                </div>
                <span className="mt-4 text-[10px] font-bold text-primary uppercase tracking-wider mono flex items-center gap-1">
                  LAUNCH TOOL →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};
export default ToolDetailPage;
