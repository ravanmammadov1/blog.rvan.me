import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, TrendingUp, Clock, BookOpen, Compass, Brain, Zap } from "lucide-react";
import { fetchAllBlogs } from "../../../lib/sanityQueries";
import BlogCard from "../blog/BlogCard";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { Button } from "../ui/Button";
import { fetchAllArticleStats, ArticleStats } from "../../../services/articleStatsService";
import { MASTER_EDITORIAL_BLOGS } from "../../../lib/editorialBlogRegistry";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<any[]>(MASTER_EDITORIAL_BLOGS);
  const [articleStats, setArticleStats] = useState<Record<string, ArticleStats>>({});
  const [activeFilter, setActiveFilter] = useState<"latest" | "most_read" | "design" | "psychology" | "marketing">("latest");
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  useEffect(() => {
    fetchAllBlogs(language)
      .then((data) => {
        if (data && data.length > 0) {
          setBlogPosts(data);
        }
      })
      .catch(console.error);

    fetchAllArticleStats().then((stats) => {
      setArticleStats(stats || {});
    });
  }, [language]);

  // Data-driven filtered/sorted posts
  const displayedPosts = useMemo(() => {
    let list = [...blogPosts];

    if (activeFilter === "most_read") {
      list.sort((a, b) => {
        const slugA = (a.slug?.current || a.originalSlug || a._id || "").toLowerCase();
        const slugB = (b.slug?.current || b.originalSlug || b._id || "").toLowerCase();
        const viewsA = articleStats[slugA]?.viewCount || 0;
        const viewsB = articleStats[slugB]?.viewCount || 0;
        return viewsB - viewsA;
      });
    } else if (activeFilter === "design") {
      list = list.filter((p) => p.category === "Design" || p.category === "Typography");
    } else if (activeFilter === "psychology") {
      list = list.filter((p) => p.category === "Psychology" || p.category === "UX");
    } else if (activeFilter === "marketing") {
      list = list.filter((p) => p.category === "Marketing" || p.category === "Creative Culture");
    }

    return list.slice(0, 6);
  }, [blogPosts, activeFilter, articleStats]);

  return (
    <section id="blog" className="relative px-4 sm:px-6 md:px-10 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-24 lg:pb-28 overflow-hidden border-b border-border/40">
      <div className="mx-auto max-w-[1280px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-border/60 pb-6 gap-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">
              {isAz ? "02 / NƏŞRLƏR VƏ FİKİRLƏR" : "02 / EDITORIAL PUBLICATION & INSIGHTS"}
            </Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Dizayn × Psixologiya." : "Thinking out loud."}
            </h2>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground font-normal max-w-xl leading-relaxed">
              {isAz
                ? "Gündəlik gördüyünüz dizayn qaydaları, qiymət modelləri və vizual qərarların arxasındakı elmi səbəblər."
                : "Deep research on visual hierarchy, behavioural psychology, and creative culture."}
            </p>
          </div>

          <Link
            to={getLocalizedPath("/blog")}
            className="group hidden items-center gap-1.5 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            <span>{isAz ? "BÜTÜN MƏQALƏLƏRƏ BAX" : "EXPLORE ALL ARTICLES"}</span>
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Discovery Filter Tabs (Quiet Editorial Styling) */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {[
            { key: "latest", label: isAz ? "Ən Son Nəşrlər" : "Latest Essays" },
            { key: "most_read", label: isAz ? "Ən Çox Oxunanlar" : "Most Read" },
            { key: "design", label: "Design & Type" },
            { key: "psychology", label: "Psychology & UX" },
            { key: "marketing", label: "Marketing & Brand" },
          ].map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`rounded-full px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? "liquid-glass-pill liquid-glass-pill-active font-bold"
                    : "liquid-glass-pill text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 6-Card Responsive Grid */}
        {displayedPosts.length === 0 ? (
          <div className="h-64 rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-white/80 dark:bg-white/5 glass flex items-center justify-center text-muted-foreground text-sm">
            {t("noBlogArticles", "No blog articles available.")}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedPosts.map((post) => (
              <BlogCard
                key={post._id || post.slug?.current}
                post={post}
                hovered={hoveredBlog === post._id}
                onHoverStart={() => setHoveredBlog(post._id)}
                onHoverEnd={() => setHoveredBlog(null)}
              />
            ))}
          </div>
        )}

        <div className="mt-14 sm:mt-16 flex justify-center">
          <Link
            to={getLocalizedPath("/blog")}
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-full px-8 sm:px-10 py-3.5 sm:py-4 h-[52px] sm:h-[56px] text-xs sm:text-sm font-mono font-bold tracking-[0.14em] uppercase text-foreground/90 transition-all duration-300 hover:scale-[1.02] hover:text-foreground active:scale-[0.985] select-none border border-white/20 dark:border-white/15 hover:border-white/35 dark:hover:border-white/25 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-400/10 dark:via-cyan-400/10 dark:to-blue-500/10 backdrop-blur-md hover:from-emerald-500/20 hover:via-teal-500/20 hover:to-indigo-500/20 max-w-full"
          >
            <span>{isAz ? "BÜTÜN MƏQALƏLƏRİ OXU" : "EXPLORE ALL ARTICLES"}</span>
            <ArrowUpRight
              size={16}
              className="shrink-0 text-muted-foreground transition-transform duration-300 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
