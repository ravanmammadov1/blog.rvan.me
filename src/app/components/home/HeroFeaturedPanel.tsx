import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Eye, ArrowRight } from "lucide-react";

import { fetchAllBlogs } from "../../../lib/sanityQueries";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime, CANONICAL_AUTHOR } from "../../../lib/blogHelpers";
import { getArticleCoverImage } from "../../../lib/contentEngine";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { MASTER_EDITORIAL_BLOGS } from "../../../lib/editorialBlogRegistry";
import { subscribeToArticleStats } from "../../../services/articleStatsService";
import { BlogPost } from "../../../types/blog";

/**
 * HeroFeaturedPanel
 * Large, rounded, translucent editorial content panel for the homepage hero.
 * Displays the first (featured) article from the blog system.
 * Visual style: frosted glass surface with soft backdrop-blur, sitting on top
 * of the animated gradient background.
 */
export default function HeroFeaturedPanel() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(
    MASTER_EDITORIAL_BLOGS[0] || null
  );
  const [views, setViews] = useState(0);

  // Attempt to fetch real articles from Sanity; fallback to editorial registry
  useEffect(() => {
    fetchAllBlogs(language)
      .then((data) => {
        if (data && data.length > 0) {
          // Pick the first (latest / most featured) article
          const featured = data.find((p: BlogPost) => p.featured) || data[0];
          setFeaturedPost(featured);
        }
      })
      .catch(() => {
        // Use fallback from editorial registry
      });
  }, [language]);

  // Subscribe to real-time view stats
  useEffect(() => {
    if (!featuredPost) return;
    const rawSlug =
      typeof featuredPost.slug === "string"
        ? featuredPost.slug
        : featuredPost.slug?.current ||
          featuredPost.originalSlug ||
          featuredPost._id ||
          "";
    const slugStr = rawSlug
      .replace(/^\/?(az\/)?blog\//, "")
      .replace(/^\//, "")
      .replace(/\/+$/, "");
    if (!slugStr) return;

    const unsubscribe = subscribeToArticleStats(slugStr, (stats) => {
      setViews(stats?.viewCount || 0);
    });
    return () => unsubscribe?.();
  }, [featuredPost]);

  if (!featuredPost) return null;

  // Resolve cover image
  const coverUrl =
    featuredPost.coverImage && urlFor(featuredPost.coverImage)
      ? urlFor(featuredPost.coverImage)!.width(800).height(450).fit("crop").url()
      : getArticleCoverImage(
          featuredPost.category === "Design"
            ? "designNews"
            : featuredPost.category === "AI"
            ? "aiNews"
            : "frontendNews",
          featuredPost.title
        );

  const formattedDate = formatBlogDate(featuredPost.publishDate, language);
  const readTimeStr = estimateReadingTime(
    featuredPost.body,
    featuredPost.readTime,
    language
  );

  const rawSlug =
    typeof featuredPost.slug === "string"
      ? featuredPost.slug
      : featuredPost.slug?.current ||
        featuredPost.originalSlug ||
        featuredPost._id ||
        "";
  const slugStr = rawSlug
    .replace(/^\/?(az\/)?blog\//, "")
    .replace(/^\//, "")
    .replace(/\/+$/, "");

  const authorName =
    featuredPost.authorName ||
    (isAz ? CANONICAL_AUTHOR.name_az : CANONICAL_AUTHOR.name);
  const authorAvatar = featuredPost.authorPhoto
    ? urlFor(featuredPost.authorPhoto)?.width(48).height(48).url() || CANONICAL_AUTHOR.avatar
    : CANONICAL_AUTHOR.avatar;

  const title = isAz && featuredPost.title_az ? featuredPost.title_az : featuredPost.title;
  const excerpt = isAz && featuredPost.excerpt_az ? featuredPost.excerpt_az : featuredPost.excerpt;
  const category = isAz && featuredPost.category_az ? featuredPost.category_az : featuredPost.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[1200px] mx-auto"
    >
      <Link
        to={getLocalizedPath(`/blog/${slugStr}`)}
        className="group block rounded-3xl border border-white/20 dark:border-white/10 overflow-hidden
          bg-white/50 dark:bg-white/[0.06]
          backdrop-blur-xl
          shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]
          hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]
          transition-all duration-500 hover:-translate-y-1
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* LEFT: Cover Image */}
          <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
            <img
              src={coverUrl}
              alt={title || "Featured article"}
              width={800}
              height={500}
              loading="eager"
              className="h-full w-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(
                  featuredPost.category === "Design" ? "designNews" : "designNews",
                  featuredPost.title
                );
              }}
            />
            {/* Gradient overlay for readability on mobile stack */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/10 pointer-events-none" />

            {/* Featured badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-primary-foreground mono backdrop-blur-sm">
                {isAz ? "SEÇİLMİŞ" : "FEATURED"}
              </span>
            </div>
          </div>

          {/* RIGHT: Article Info */}
          <div className="flex flex-col justify-center px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
            {/* Category */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[10px] font-bold tracking-wider mono uppercase text-primary w-fit mb-4">
              {category || "Article"}
            </span>

            {/* Title */}
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight mb-3 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-3">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 line-clamp-3">
              {excerpt}
            </p>

            {/* Author + Meta Row */}
            <div className="flex items-center gap-3 mb-5">
              <img
                src={authorAvatar}
                alt={authorName}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover border border-border/50"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = CANONICAL_AUTHOR.avatar;
                }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{authorName}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {formattedDate && <span>{formattedDate}</span>}
                  {readTimeStr && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {readTimeStr}
                    </span>
                  )}
                  {views > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye size={11} />
                      {views.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300">
              <span>{isAz ? "MƏQALƏNI OXU" : "READ ARTICLE"}</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
