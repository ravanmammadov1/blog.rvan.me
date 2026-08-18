import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Calendar, Clock } from "lucide-react";

import { fetchAllBlogs, fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { BlogPost } from "../types/blog";
import BlogCard from "./components/blog/BlogCard";
import ApcaBlogPromo from "./components/blog/ApcaBlogPromo";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
import PageFilterBar from "./components/PageFilterBar";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useProgressiveRendering } from "./hooks/useProgressiveRendering";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { Button } from "./components/ui/Button";
import { urlFor } from "../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../lib/blogHelpers";
import { getArticleCoverImage } from "../lib/contentEngine";

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
      .then((data) => {
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching blog archive from Sanity:", err);
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
    initialBatchSize: 6,
    stepBatchSize: 6,
    resetDependencies: [activeCategory, searchQuery],
  });

  return (
    <main
      className="min-h-screen bg-background text-foreground"
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

        {/* Micro grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* 1. Unified Page Hero */}
      <PageHero
        title={isAz ? "Dizayn və" : "Design &"}
        accentText={t("blogArchiveHeadingAccent", "Editorial Essays.")}
        gradientVariant="secondary"
        description={t(
          "blogArchiveSubtitle",
          "Original articles on visual strategy, motion mechanics, design systems, and creative technology."
        )}
      />

      <div className="mx-auto max-w-[1600px] px-6 py-6 md:px-10 relative z-10 space-y-10">
        {/* 2. Featured Highlighted Content (when not filtering/searching) */}
        {!searchQuery && activeCategory === "All" && featuredPost && !loading && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:border-primary/40 shadow-2xl"
          >
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Cover Image */}
              <div className="lg:col-span-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 relative bg-neutral-900/80">
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
                      {formatBlogDate(featuredPost.publishDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {estimateReadingTime(featuredPost.body, featuredPost.readTime)}
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

        {/* 3. Lightweight APCA Utility Promotion */}
        <ApcaBlogPromo />

        {/* 4. Article Categories & Search Discovery */}
        <PageFilterBar
          categories={categories.map((cat) => ({
            key: cat,
            label: cat === "All" ? t("allNews", "All") : cat,
            count: categoryCounts[cat],
          }))}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t("searchArticles", "Search articles...")}
          searchId="blog-search"
        />

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

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
