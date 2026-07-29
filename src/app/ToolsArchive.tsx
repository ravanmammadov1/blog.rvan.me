import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, X, ExternalLink, Wrench, Zap } from "lucide-react";

import { fetchTools, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ToolItem, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import { lazy, Suspense } from "react";
const DesignerToolsPanel = lazy(() => import("./components/DesignerToolsPanel"));

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

  const categories = useMemo(() => {
    const validCategories = toolsList
      .map((t) => t.category)
      .filter((value): value is string => typeof value === "string" && value.trim() !== "");

    const list = [...new Set(validCategories)];
    return ["All", ...list];
  }, [toolsList]);

  const filteredTools = useMemo(() => {
    let result = toolsList;

    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [toolsList, activeCategory, searchQuery]);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="Interactive Designer Utilities & Daily Stack — Ravan Mammadov"
        description="Free in-browser tools for designers and marketers: color contrast checker, typography scale builder, SVG minifier, CSS shadow generator, and AI prompts."
        url="https://www.rvan.me/tools"
      />

      {/* Global Unified Header */}
      {/* ── Aurora background blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        
        {/* Blob 1 — gold / amber, top-left */}
        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%", left: "-10%",
            width: "60%", height: "70%",
            background: "radial-gradient(ellipse at 40% 40%, rgba(232,253,82,0.06) 0%, rgba(245,158,11,0.04) 45%, transparent 72%)",
            filter: "blur(64px)",
          }}
        />

        {/* Blob 2 — violet / blue, top-right */}
        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "0%", right: "-12%",
            width: "55%", height: "65%",
            background: "radial-gradient(ellipse at 65% 30%, rgba(139,92,246,0.05) 0%, rgba(59,130,246,0.03) 50%, transparent 78%)",
            filter: "blur(72px)",
          }}
        />

        {/* Micro grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero section */}
      <section className="px-6 pt-20 pb-12 md:px-10 md:pt-28 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <p className="eyebrow text-primary mb-4">CREATIVE ARSENAL & DESIGN UTILITIES</p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-4xl">
              Tools & Stack.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Interactive utilities for designers and marketers — built right into the browser. No sign-up, no downloads. Plus the software stack powering this practice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Interactive Designer Tools Panel ─── */}
      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5">
                <Zap size={14} className="text-primary" />
                <span className="text-[10px] font-bold tracking-widest mono uppercase text-primary">Interactive Tools</span>
              </div>
              <span className="text-xs text-muted-foreground">Works in your browser · No installation needed</span>
            </div>
            <Suspense fallback={<div className="h-40" aria-hidden="true" />}>
              <DesignerToolsPanel />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* ─── Sanity-Managed Tools Grid ─── */}
      {(loading || toolsList.length > 0) && (
        <section className="px-6 pb-16 md:px-10">
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-t border-border pt-12"
            >
              <div>
                <p className="eyebrow text-muted-foreground">MY DAILY STACK</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Software & Resources</h2>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Category tabs */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                        activeCategory === cat
                          ? "bg-primary text-black shadow-[0_0_15px_rgba(232,253,82,0.25)]"
                          : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                  />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-10 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Grid */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-44 rounded-lg border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="py-16 text-center border border-white/10 rounded-lg bg-white/5 glass">
                <p className="text-muted-foreground">No tools found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool, index) => {
                  const iconUrl = tool.icon ? urlFor(tool.icon)?.url() : null;
                  const CardElement = tool.link ? "a" : "div";
                  const cardProps = tool.link
                    ? { href: tool.link, target: "_blank", rel: "noreferrer" }
                    : {};

                  return (
                    <motion.div
                      key={tool._id}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      custom={index * 0.05}
                    >
                      <CardElement
                        {...cardProps}
                        className="group flex h-full flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-6 glass transition-all duration-300 hover:border-primary/50 hover:bg-white/10 cursor-pointer relative overflow-hidden"
                      >
                        {/* Internal Glow */}
                        <div 
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                          style={{
                            background: "radial-gradient(circle at top right, rgba(232,253,82,0.05) 0%, transparent 60%)",
                          }}
                        />
                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              {iconUrl ? (
                                <img
                                  src={iconUrl}
                                  alt={tool.name}
                                  className="h-12 w-12 rounded-lg object-contain bg-background border border-white/10 p-2"
                                />
                              ) : (
                                <div className="grid h-12 w-12 place-items-center rounded-lg border border-white/10 bg-background text-primary">
                                  <Wrench size={20} />
                                </div>
                              )}
                              <div>
                                <h2 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                                  {tool.name}
                                </h2>
                                {tool.category && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                                    {tool.category}
                                  </span>
                                )}
                              </div>
                            </div>

                            {tool.link && (
                              <div
                                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-muted-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                                aria-label={`Visit ${tool.name}`}
                              >
                                <ExternalLink size={14} />
                              </div>
                            )}
                          </div>

                          {tool.description && (
                            <p className="text-xs leading-relaxed text-muted-foreground mt-2 font-medium">
                              {tool.description}
                            </p>
                          )}
                        </div>
                      </CardElement>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer siteSettings={siteSettings} />
    </main>
  );
}
