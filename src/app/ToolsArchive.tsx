import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X, Zap, ArrowUpRight, Sparkles } from "lucide-react";

import { fetchTools, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ToolItem, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import { INTERACTIVE_TOOLS } from "./lib/toolsRegistry";

const DesignerToolsPanel = lazy(() => import("./components/DesignerToolsPanel"));
const FeaturedInteractiveTools = lazy(() => import("./components/home/FeaturedInteractiveTools").then(m => ({ default: m.FeaturedInteractiveTools })));

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

export default function ToolsArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [toolsList, setToolsList] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
    fetchTools()
      .then((data) => setToolsList(data))
      .finally(() => setLoading(false));
  }, []);

  const toolCategories = ["All", "Color", "Typography", "Spacing & Grid", "SVG & Code", "Shadows", "SEO"];

  const filteredInteractiveTools = useMemo(() => {
    let result = INTERACTIVE_TOOLS;
    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="Free Interactive Developer & Designer Tools Hub — Rvan.me"
        description="Free in-browser developer utilities: CSS Grid generator, SVG wave generator, fluid typography clamp generator, multi-layer smooth box shadow builder, color contrast checker, and SEO meta tag generator."
        url="https://www.rvan.me/tools"
      />

      {/* Global Unified Header */}
      <SiteHeader siteSettings={siteSettings} />

      {/* Hero section */}
      <section className="px-6 pt-28 pb-12 md:px-10 md:pt-36 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <p className="eyebrow text-primary mb-4 flex items-center gap-2">
              <Zap size={14} /> FREE IN-BROWSER DEVELOPER & DESIGNER UTILITIES
            </p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-5xl leading-[0.9]">
              Tools & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-primary to-emerald-400">
                Interactive Toolkit.
              </span>
            </h1>
            <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed font-medium">
              Zero API dependencies, zero downloads. Copy clean production CSS, SVG, and HTML code instantly for CSS Grid, SVG Waves, Fluid Clamp(), Box Shadows, and SEO metadata.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Tools Showcase Grid */}
      <section className="px-6 py-12 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          {/* Search & Filter Bar */}
          <div className="mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
              <input
                type="search"
                placeholder="Search tools (e.g. CSS Grid, SVG Wave, clamp, box shadow)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {toolCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-primary text-black shadow-[0_0_15px_rgba(232,253,82,0.3)] font-bold"
                      : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredInteractiveTools.map((tool) => (
              <motion.article
                key={tool.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full mono">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium line-clamp-3 mb-4">
                    {tool.description}
                  </p>
                </div>

                <Link
                  to={tool.path}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-white/10 text-xs font-bold text-primary uppercase tracking-wider mono group-hover:text-white transition-colors"
                >
                  <span>LAUNCH UTILITY PAGE</span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Embedded Live Tool Studio */}
          <Suspense fallback={<div className="h-96 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />}>
            <FeaturedInteractiveTools />
          </Suspense>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
