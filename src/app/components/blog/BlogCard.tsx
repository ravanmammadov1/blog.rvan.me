import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Eye } from "lucide-react";

import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime, CANONICAL_AUTHOR } from "../../../lib/blogHelpers";
import { getArticleCoverImage } from "../../../lib/contentEngine";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { subscribeToArticleStats } from "../../../services/articleStatsService";

interface BlogCardProps {
  post: BlogPost;
  hovered?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export default function BlogCard({
  post,
  hovered: externalHovered,
  onHoverStart,
  onHoverEnd,
}: BlogCardProps) {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = externalHovered ?? internalHovered;

  // Safely extract tracking ID & slug string
  const rawSlug = typeof post.slug === "string" ? post.slug : post.slug?.current || post.originalSlug || post._id || "";
  const slugStr = rawSlug.replace(/^\/?(az\/)?blog\//, "").replace(/^\//, "").replace(/\/+$/, "");

  // Real-time View Counter
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    if (!slugStr) return;
    const unsubscribe = subscribeToArticleStats(slugStr, (stats) => {
      setViews(stats.viewCount || 0);
    });
    return () => unsubscribe();
  }, [slugStr]);

  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder
    ? imgBuilder.width(1200).height(675).quality(90).auto("format").url()
    : (typeof post.coverImage?.url === "string" && post.coverImage.url)
    ? post.coverImage.url
    : getArticleCoverImage(
        post.category === "Design"
          ? "designNews"
          : post.category === "AI"
          ? "aiNews"
          : post.category === "Motion"
          ? "motionNews"
          : post.category === "Marketing"
          ? "marketingNews"
          : "frontendNews",
        post.title
      );

  const formattedDate = formatBlogDate(post.publishDate, language);
  const readTimeStr = estimateReadingTime(post.body, post.readTime, language, post.body_az);

  // Author resolution: canonical founder author Ravan Mammadov
  const isFounderAuthor =
    !post.authorName ||
    post.authorName.toLowerCase().includes("ravan") ||
    post.authorSlug === "ravan-mammadov" ||
    post.authorName.includes("Masası");

  const displayAuthorName = isFounderAuthor
    ? (isAz ? CANONICAL_AUTHOR.name_az : CANONICAL_AUTHOR.name)
    : (post.authorName || (isAz ? CANONICAL_AUTHOR.name_az : CANONICAL_AUTHOR.name));

  const authorAvatar = CANONICAL_AUTHOR.avatar;

  const currentTitle = isAz && post.title_az ? post.title_az : post.title;
  const currentDeck = isAz
    ? post.deck_az || post.excerpt_az || post.deck || post.excerpt
    : post.deck || post.excerpt || post.deck_az || post.excerpt_az;

  const categoryLabel = isAz && post.category_az ? post.category_az : (post.category || (isAz ? "Məqalə" : "Article"));

  const detailPath = getLocalizedPath(`/blog/${slugStr}`);
  const authorPath = getLocalizedPath("/about/ravan-mammadov");

  const handleMouseEnter = () => {
    setInternalHovered(true);
    if (onHoverStart) onHoverStart();
  };

  const handleMouseLeave = () => {
    setInternalHovered(false);
    if (onHoverEnd) onHoverEnd();
  };

  return (
    <article
      className="group relative flex h-full flex-col justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111215] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-black/20 dark:hover:border-white/20 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] focus-within:ring-2 focus-within:ring-primary"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        {/* Editorial Cover Image Frame with Precision Optical Hairline */}
        <Link
          to={detailPath}
          className="mb-4 block aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted/60 dark:bg-neutral-900 relative ring-1 ring-inset ring-black/5 dark:ring-white/10 focus:outline-none"
          tabIndex={-1}
        >
          <img
            src={coverUrl}
            alt={currentTitle}
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center group-hover:scale-[1.018] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(
                post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : "designNews",
                post.title
              );
            }}
          />
        </Link>

        {/* Clean Taxonomy Strip: Category + Format + Reading Time */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
              {categoryLabel}
            </span>
            {post.format && (
              <span className="inline-flex items-center rounded-md border border-border/80 bg-muted/50 dark:bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
                {post.format}
              </span>
            )}
          </div>

          {/* Reading Time & View Indicator */}
          <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-muted-foreground/80">
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-muted-foreground/60" />
              {readTimeStr}
            </span>
          </div>
        </div>

        {/* Authoritative Editorial Headline */}
        <h3 className="mb-2.5 text-[17px] sm:text-[18px] font-bold leading-[1.32] tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
          <Link to={detailPath} className="focus:outline-none focus-visible:underline">
            {currentTitle}
          </Link>
        </h3>

        {/* Refined Excerpt / Deck */}
        {currentDeck && (
          <p className="mb-5 text-[13px] leading-relaxed text-muted-foreground line-clamp-2 font-normal">
            {currentDeck}
          </p>
        )}
      </div>

      {/* Integrated Unified Metadata Footer */}
      <div className="mt-auto pt-3.5 border-t border-border/70 dark:border-white/5 flex items-center justify-between gap-3">
        {/* Author Details + Date */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            to={authorPath}
            className="relative h-6 w-6 rounded-full overflow-hidden border border-border shrink-0 bg-muted focus:outline-none ring-1 ring-border/50 hover:ring-primary/40 transition-all"
            aria-label={displayAuthorName}
            tabIndex={-1}
          >
            <img
              src={authorAvatar}
              alt={displayAuthorName}
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.endsWith("ravan_portrait.png")) {
                  target.src = "/imports/ravan_portrait.png";
                }
              }}
            />
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] min-w-0 truncate">
            <Link
              to={authorPath}
              className="font-semibold text-foreground hover:text-primary transition-colors truncate focus:outline-none"
            >
              {displayAuthorName}
            </Link>
            {formattedDate && (
              <>
                <span className="text-muted-foreground/40 shrink-0">•</span>
                <span className="mono text-muted-foreground text-[10px] shrink-0">{formattedDate}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Cue with Micro Arrow */}
        <Link
          to={detailPath}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground group-hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:text-black transition-all duration-300 shrink-0 shadow-2xs"
          aria-label={`${isAz ? "Məqaləni oxu" : "Read article"}: ${currentTitle}`}
          tabIndex={-1}
        >
          <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}

