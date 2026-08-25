import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Calendar, Clock, Search, SlidersHorizontal, X } from "lucide-react";

import { fetchAllBlogs, fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { BlogPost } from "../types/blog";
import BlogCard from "./components/blog/BlogCard";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useProgressiveRendering } from "./hooks/useProgressiveRendering";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { Button } from "./components/ui/Button";
import { urlFor } from "../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../lib/blogHelpers";
import { getArticleCoverImage } from "../lib/contentEngine";
import { BLOG_FAQS } from "../data/faqData";
import GlobalFaqSection from "./components/GlobalFaqSection";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

export default function BlogArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);
  const { t, getLocalizedPath, language } = useLanguage();

  const isAz = language === "az";

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });

    fetchAllBlogs(language)
      .then((sanityData) => {
        setPosts(sanityData || []);
      })
      .catch((err) => {
        console.error("Error fetching blog archive:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [language]);

  const categories = useMemo(() => {
    const list = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    return ["All", ...list];
  }, [posts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    posts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, activeCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    if (posts.length === 0) return null;
    return posts.find((p) => p.featured) || posts[0];
  }, [posts]);

  const {
    visibleItems: visiblePosts,
    hasMore,
    remainingCount,
    loadMore,
    isLoadingMore,
  } = useProgressiveRendering(filteredPosts, {
    initialBatchSize: 12,
    stepBatchSize: 12,
    resetDependencies: [activeCategory, searchQuery],
  });

  return (
    <main
      className="min-h-screen bg-background text-foreground overflow-x-hidden w-full"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={`${t("blogArchiveTitle", "Design & Motion Insights")} — Rvan.me`}
        description={t(
          "blogArchiveSubtitle",
          "Original articles on visual strategy, motion mechanics, design systems, and creative technology."
        )}
        url="https://www.rvan.me/blog"
      />

      {/* Global Unified Header */}
      <SiteHeader siteSettings={siteSettings} />

      {/* ── Aurora background blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        
        {/* Blob 1 — emerald / teal, top-left */}
        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%",
            left: "-10%",
            width: "60%",
            height: "70%",
            background:
              "radial-gradient(ellipse at 40% 40%, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.06) 45%, transparent 72%)",
            filter: "blur(64px)",
          }}
        />

        {/* Blob 2 — blue / indigo, top-right */}
        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "0%",
            right: "-12%",
            width: "55%",
            height: "65%",
            background:
              "radial-gradient(ellipse at 65% 30%, rgba(59,130,246,0.08) 0%, rgba(79,70,229,0.05) 50%, transparent 78%)",
            filter: "blur(72px)",
          }}
        />
      </div>

      {/* 1. Unified Master Page Hero */}
      <PageHero
        eyebrow={isAz ? "BLOQ · İDEYALAR VƏ BİLİK" : "BLOG · INSIGHTS & IDEAS"}
        title={isAz ? "DİZAYN. İDEYALAR." : "DESIGN. IDEAS."}
        accentText={isAz ? "VİZUAL MƏDƏNİYYƏT." : "VISUAL CULTURE."}
        description={t(
          "blogArchiveSubtitle",
          "Original articles on visual strategy, motion mechanics, design systems, and creative technology."
        )}
      />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 py-6 relative z-10 space-y-10">
        {/* 2. Featured Highlighted Content (when not filtering/searching) */}
        {!searchQuery && activeCategory === "All" && featuredPost && !loading && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
          >
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Cover Image */}
              <div className="lg:col-span-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#DDE1E0] dark:border-white/10 relative bg-neutral-900/80">
                <img
                  src={
                    urlFor(featuredPost.coverImage)?.width(1200).height(675).quality(90).url() ||
                    getArticleCoverImage("designNews", featuredPost.title)
                  }
                  alt={featuredPost.title}
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
              </div>

              {/* Text Info */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary mono">
                    <Sparkles size={12} />
                    {isAz ? "SEÇİLMİŞ TƏDQİQAT" : "FEATURED ESSAY"}
                  </span>
                  <span className="text-xs text-muted-foreground mono">
                    {featuredPost.category}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/80 mono">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {formatBlogDate(featuredPost.publishDate, language)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {estimateReadingTime(featuredPost.body, featuredPost.readTime, language)}
                    </span>
                  </div>

                  <Link
                    to={getLocalizedPath(
                      `/blog/${
                        typeof featuredPost.slug === "string"
                          ? featuredPost.slug
                          : featuredPost.slug?.current || featuredPost._id
                      }`
                    )}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 mono"
                  >
                    <span>{isAz ? "Məqaləni Oxu" : "Read Essay"}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. Integrated Article Search & Category Filters */}
        <div className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-3.5 sm:p-4.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl space-y-3">
          {/* Main Search Input */}
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-primary shrink-0 pointer-events-none" />
            <input
              type="text"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchArticles", "Search articles by title, excerpt, topic, or keyword...")}
              className="w-full rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.04] pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-[#0F172A] dark:text-foreground placeholder:text-muted-foreground/60 border-none outline-none ring-0 shadow-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
              style={{ outline: "none", boxShadow: "none" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Connected Category Filter Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5 pb-0.5">
            <span className="text-[10px] font-mono font-bold text-muted-foreground/70 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <SlidersHorizontal size={12} className="text-primary" />
              <span>{isAz ? "FİLTR:" : "FILTER:"}</span>
            </span>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const label = cat === "All" ? (isAz ? "Hamısı" : "All") : cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-primary text-black font-bold shadow-2xs"
                      : "bg-slate-100/70 dark:bg-white/[0.04] text-muted-foreground hover:text-foreground hover:bg-slate-200/80 dark:hover:bg-white/[0.08] border border-transparent hover:border-slate-300 dark:hover:border-white/10"
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Article Grid & List */}
        <div>
          {/* Results count info */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs font-bold tracking-[.14em] text-muted-foreground mono">
              {filteredPosts.length} {t("articles", "ARTICLES")}
              {searchQuery && ` FOR "${searchQuery.toUpperCase()}"`}
            </p>
          </div>

          {loading ? (
            <div className="mt-20 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#61c5ad] border-t-transparent" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-20 text-center"
            >
              <p className="text-lg text-muted-foreground">
                {searchQuery
                  ? "No articles match your search."
                  : "No articles published yet."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="mt-4 text-sm text-[#61c5ad] underline underline-offset-4"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.3}
                className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visiblePosts.map((post) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                    hovered={hoveredBlog === post._id}
                    onHoverStart={() => setHoveredBlog(post._id)}
                    onHoverEnd={() => setHoveredBlog(null)}
                  />
                ))}
              </motion.div>

              {/* Load More Pagination */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <Button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    size="lg"
                  >
                    {isLoadingMore
                      ? t("loadingBatch", "LOADING BATCH...")
                      : `${t("loadMoreArticles", "LOAD MORE ARTICLES")} (${remainingCount} ${t(
                          "remaining",
                          "REMAINING"
                        )})`}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Subtle Editorial Idea CTA */}
      <section className="relative px-4 sm:px-6 md:px-8 py-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/[0.04] via-card to-primary/[0.02] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-1 text-center md:text-left max-w-xl">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                {isAz ? "Paylaşmağa dəyər bir fikriniz var?" : "Have an idea worth exploring?"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isAz ? "Fikrinizi Rvan.me redaksiyası ilə bölüşün." : "Share your perspective with the Rvan.me editorial team."}
              </p>
            </div>
            <Link
              to={getLocalizedPath("/write")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xs shrink-0"
            >
              <span>{isAz ? "Fikrinizi paylaşın →" : "Share Your Ideas →"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contextual Blog Global FAQ Section */}
      <GlobalFaqSection
        items={BLOG_FAQS}
        eyebrow={isAz ? "BLOQ HAQQINDA SUALLAR" : "EDITORIAL & PUBLISHING FAQ"}
        title={isAz ? "Bloq və Məqalə Qəbulu" : "Publication & Submissions"}
        description={
          isAz
            ? "Məqalə mövzuları, nəşr tezliyi və redaksiya meyarları haqqında suallar:"
            : "Questions regarding our editorial topics, publication cadence, and submission criteria:"
        }
      />

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
