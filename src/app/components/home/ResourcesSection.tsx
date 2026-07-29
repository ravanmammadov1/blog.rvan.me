import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Rss, Clock, ExternalLink, Globe, Award, BadgeCheck, Users, ChevronDown } from "lucide-react";
import { client, urlFor } from "../../../lib/sanityClient";
import { Eyebrow } from "../Eyebrow";
import { aggregateAllResources, NormalizedResource } from "../../../lib/rssAggregator";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export const CATEGORY_MAP: Record<string, { label: string; icon: string }> = {
  all: { label: "All Directory", icon: "⚡" },
  jobs: { label: "Jobs", icon: "💼" },
  freeDesignAssets: { label: "Free Assets", icon: "🎁" },
  tools: { label: "Tools", icon: "🛠️" },
  learning: { label: "Learning", icon: "📚" },
  opportunities: { label: "Opportunities", icon: "🚀" },
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ResourcesSection() {
  const [allResources, setAllResources] = useState<NormalizedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    // Load both RSS feeds and CMS resource documents
    aggregateAllResources([])
      .then((items) => {
        setAllResources(items || []);
      })
      .catch((err) => console.error("Error aggregating resources for homepage:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredResources = useMemo(() => {
    if (activeCategory === "all") return allResources;
    return allResources.filter((r) => r.category === activeCategory);
  }, [allResources, activeCategory]);

  return (
    <section id="resources" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section aurora background */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.07) 0%, rgba(59,130,246,0.04) 50%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-[1600px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6 gap-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">04 / Live Curated Directory</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Knowledge & Assets.
            </h2>
          </div>
          <Link
            to="/resources"
            className="group inline-flex items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono"
          >
            OPEN FULL DIRECTORY
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-12 flex flex-wrap gap-2">
          {Object.entries(CATEGORY_MAP).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300",
                activeCategory === key
                  ? "bg-primary text-black shadow-[0_0_15px_rgba(232,253,82,0.25)]"
                  : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
              )}
            >
              <span className="mr-1.5">{config.icon}</span>
              {config.label}
            </button>
          ))}
        </div>

        {/* Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl border border-white/10 bg-white/5 animate-pulse glass" />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="py-16 text-center border border-white/10 rounded-2xl bg-white/5 glass">
            <p className="text-muted-foreground text-sm">No live updates found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.slice(0, 8).map((resource, index) => {
              const catConfig = CATEGORY_MAP[resource.category] || { label: resource.category, icon: "📦" };
              const officialSources = ["Smashing Magazine", "We Work Remotely", "UX Collective", "Abduzeedo"];
              const isOfficial = officialSources.includes(resource.sourceName);
              const isVerified = !resource.isRss;

              return (
                <motion.article
                  key={resource.id || index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index * 0.05}
                  className="group p-5 aurora-card flex flex-col justify-between relative min-h-[300px]"
                >
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-primary mono">
                        {catConfig.icon} {catConfig.label.slice(0, 14)}...
                      </span>
                      {resource.isRss && (
                        <span className="text-[9px] text-muted-foreground/60 flex items-center gap-1 mono">
                          <Rss size={9} /> RSS
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {resource.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-3 mb-4 font-medium flex-1">
                      {resource.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-semibold text-muted-foreground/75 mb-4">
                      <span className="text-foreground/90">{resource.sourceName}</span>
                      {resource.workType && resource.workType !== "na" && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 capitalize">
                          {resource.workType}
                        </span>
                      )}
                      {resource.isFree && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary font-bold">
                          FREE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between">
                    <span className="text-[9px] font-semibold text-muted-foreground/50 mono">
                      OPPORTUNITY
                    </span>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
                    >
                      OPEN <ExternalLink size={10} />
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            to="/resources"
            className="group inline-flex items-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm"
          >
            EXPLORE FULL RESOURCES DIRECTORY
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}