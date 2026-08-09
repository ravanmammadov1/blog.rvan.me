import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Star } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { fetchHomeShowcaseResources, fetchUnifiedResources, SharedResourceItem, ResourceCategoryKey } from "../../../lib/resourceEngine";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export const HOME_RESOURCE_CATEGORIES: Record<ResourceCategoryKey, { label: string; icon: string }> = {
  fonts: { label: "Fonts", icon: "🔤" },
  githubRepos: { label: "GitHub Repositories", icon: "🐙" },
  tools: { label: "Tools", icon: "🛠️" },
  assets: { label: "Assets", icon: "🎁" },
  learning: { label: "Learning", icon: "📚" },
  inspiration: { label: "Inspiration", icon: "✨" },
};

export default function ResourcesSection() {
  const [resources, setResources] = useState<SharedResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ResourceCategoryKey>("fonts");
  const { t, getLocalizedPath } = useLanguage();

  const categoryLabels: Record<ResourceCategoryKey, string> = {
    fonts: t("fonts", "Fonts"),
    githubRepos: t("githubRepos", "GitHub Repositories"),
    tools: t("tools", "Tools"),
    assets: t("assets", "Assets"),
    learning: t("learning", "Learning"),
    inspiration: t("inspiration", "Inspiration"),
  };

  useEffect(() => {
    // 1. Instant 0ms initial render from lightweight showcase catalog
    fetchHomeShowcaseResources().then((items) => {
      if (items && items.length > 0) {
        setResources(items);
        setLoading(false);
      }
    });

    // 2. Parallel background revalidation with full unified resources
    fetchUnifiedResources()
      .then((items) => {
        if (items && items.length > 0) {
          setResources(items);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((r) => r.category === activeCategory).slice(0, 6);
  }, [resources, activeCategory]);

  return (
    <section id="resources" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section background */}
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
            <Eyebrow className="text-muted-foreground">{t("sectionResourcesEyebrow", "04 / Unified Creative Ecosystem")}</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              {t("sectionResourcesTitle", "Knowledge & Assets.")}
            </h2>
          </div>
          <Link
            to={getLocalizedPath(`/resources?category=${activeCategory}`)}
            className="group inline-flex items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono uppercase"
          >
            {t("exploreAll", "EXPLORE ALL")} {categoryLabels[activeCategory]}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-12 flex flex-wrap gap-2">
          {Object.entries(HOME_RESOURCE_CATEGORIES).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as ResourceCategoryKey)}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeCategory === key
                  ? "bg-primary text-black shadow-[0_0_15px_rgba(232,253,82,0.25)] font-bold"
                  : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
              }`}
            >
              <span>{config.icon}</span> {categoryLabels[key as ResourceCategoryKey]}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-44 rounded-2xl border border-white/10 bg-white/5 animate-pulse glass" />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center glass">
            <p className="text-xs text-muted-foreground">{t("noFeaturedItems", "No featured items available for this category.")}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((item, idx) => (
              <motion.article
                key={item.id || idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full mono">
                      {item.type}
                    </span>
                    {item.starsCount && (
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mono">
                        <Star size={12} className="fill-amber-400" /> {item.starsCount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium line-clamp-3 mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold mono">
                  <span className="text-muted-foreground">{item.source}</span>
                  {item.url.startsWith("/") ? (
                    <Link to={getLocalizedPath(item.url)} className="text-primary hover:text-white flex items-center gap-1">
                      {t("viewDetails", "VIEW DETAILS")} <ArrowUpRight size={13} />
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-white flex items-center gap-1"
                    >
                      {t("visit", "VISIT")} <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}