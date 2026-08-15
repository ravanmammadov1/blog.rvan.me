import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Star, Type, GitBranch, Wrench, Package, BookOpen, Sparkles } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { fetchHomeShowcaseResources, fetchUnifiedResources, SharedResourceItem, ResourceCategoryKey } from "../../../lib/resourceEngine";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const EASE = "easeInOut";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

const CATEGORY_ICONS: Record<ResourceCategoryKey, React.ReactNode> = {
  fonts: <Type size={14} />,
  githubRepos: <GitBranch size={14} />,
  tools: <Wrench size={14} />,
  assets: <Package size={14} />,
  learning: <BookOpen size={14} />,
  inspiration: <Sparkles size={14} />,
};

export const HOME_RESOURCE_CATEGORIES: Record<ResourceCategoryKey, { label: string }> = {
  fonts: { label: "Fonts" },
  githubRepos: { label: "GitHub Repositories" },
  tools: { label: "Tools" },
  assets: { label: "Assets" },
  learning: { label: "Learning" },
  inspiration: { label: "Inspiration" },
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
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-[#61c5ad] mono md:flex"
          >
            {t("exploreAll", "EXPLORE ALL")} {categoryLabels[activeCategory]}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Category Tabs (No Emojis - Clean Lucide SVG Icons) */}
        <div className="mb-12 flex flex-wrap gap-2.5">
          {Object.entries(HOME_RESOURCE_CATEGORIES).map(([key]) => {
            const catKey = key as ResourceCategoryKey;
            const isActive = activeCategory === catKey;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(catKey)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "text-white font-extrabold shadow-[0_0_20px_rgba(97,197,173,0.35)]"
                    : "border border-white/10 bg-white/5 hover:border-[#61c5ad]/50 text-muted-foreground hover:text-foreground glass-sm"
                }`}
                style={
                  isActive
                    ? { background: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)" }
                    : {}
                }
              >
                <span className={isActive ? "text-white" : "text-[#61c5ad]"}>
                  {CATEGORY_ICONS[catKey]}
                </span>
                <span>{categoryLabels[catKey]}</span>
              </button>
            );
          })}
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
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#61c5ad]/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-[#61c5ad] border border-[#61c5ad]/35 bg-gradient-to-r from-[#61c5ad]/12 via-[#426fba]/12 to-[#984f9f]/12 px-3 py-1 rounded-full mono uppercase backdrop-blur-md shadow-[0_0_12px_rgba(97,197,173,0.12)]">
                      {item.type}
                    </span>
                    {item.starsCount && (
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mono">
                        <Star size={12} className="fill-amber-400" /> {item.starsCount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-[#61c5ad] transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium line-clamp-3 mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold mono">
                  <span className="text-muted-foreground">{item.source}</span>
                  {item.url.startsWith("/") ? (
                    <Link to={getLocalizedPath(item.url)} className="text-[#61c5ad] hover:text-white flex items-center gap-1">
                      {t("viewDetails", "VIEW DETAILS")} <ArrowUpRight size={13} />
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#61c5ad] hover:text-white flex items-center gap-1"
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