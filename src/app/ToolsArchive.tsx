import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Search, X, ExternalLink, Wrench, Layers } from "lucide-react";

import { fetchTools } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ToolItem } from "../types/cms";
import SEO from "./components/SEO";
import ColorContrastTool from "./components/ColorContrastTool";

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
  const [toolsList, setToolsList] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTools()
      .then((data) => setToolsList(data))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const list = [
      ...new Set(toolsList.map((t) => t.category).filter(Boolean)),
    ];
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
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title="Tools & Stack — Ravan Mammadov"
        description="The software, hardware, plugins, and creative tech tools powering my practice."
      />

      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
          <Link
            to="/"
            className="group flex items-center gap-3 text-xs font-bold tracking-[.18em] uppercase hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>BACK TO HOME</span>
          </Link>
          <div className="flex items-center gap-6 text-[11px] font-semibold tracking-[.16em]">
            <Link to="/news" className="hover:text-primary transition-colors">
              NEWS
            </Link>
            <Link to="/tools" className="text-primary">
              TOOLS
            </Link>
            <Link to="/blog" className="hover:text-primary transition-colors">
              BLOG
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="px-6 pt-20 pb-12 md:px-10 md:pt-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <p className="eyebrow text-primary mb-4">CREATIVE ARSENAL</p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-4xl">
              Tools & Stack.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Software, frameworks, motion engines, and hardware I rely on daily to craft high-impact creative work.
            </p>

            <ColorContrastTool />
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-t border-border pt-8"
          >
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "border border-border bg-surface hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-surface pl-10 pr-10 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid section */}
      <section className="px-6 pb-32 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-44 rounded-lg border border-border bg-surface animate-pulse" />
              ))}
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="py-24 text-center border border-border rounded-lg bg-surface/50">
              <p className="text-lg text-muted-foreground">No tools found matching your criteria.</p>
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
                      className="group flex h-full flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/50 hover:bg-surface/80 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            {iconUrl ? (
                              <img
                                src={iconUrl}
                                alt={tool.name}
                                className="h-12 w-12 rounded-lg object-contain bg-background border border-border p-2"
                              />
                            ) : (
                              <div className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-background text-primary">
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
                              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                              aria-label={`Visit ${tool.name}`}
                            >
                              <ExternalLink size={14} />
                            </div>
                          )}
                        </div>

                        {tool.description && (
                          <p className="text-xs leading-relaxed text-muted-foreground mt-2">
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

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} RAVAN MAMMADOV</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-primary">HOME</Link>
            <Link to="/news" className="hover:text-primary">NEWS</Link>
            <Link to="/tools" className="hover:text-primary">TOOLS</Link>
            <Link to="/blog" className="hover:text-primary">BLOG</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
