import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Eye, Sparkles } from "lucide-react";

import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime, CANONICAL_AUTHOR } from "../../../lib/blogHelpers";
import { getArticleCoverImage } from "../../../lib/contentEngine";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { subscribeToArticleStats } from "../../../services/articleStatsService";
import { slugifyAuthorName } from "../../../services/contributorService";

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

  // Real-time View Counter (Truthfully tracks actual reader views)
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

  const authorRole = post.authorRole || (post.format ? `${post.format} Təhlili` : isAz ? "Redaksiya Analizi" : "Editorial Analysis");

  const authorAvatar = CANONICAL_AUTHOR.avatar;

  const currentTitle = isAz && post.title_az ? post.title_az : post.title;
  const currentDeck = isAz
    ? post.deck_az || post.excerpt_az || post.deck || post.excerpt
    : post.deck || post.excerpt || post.deck_az || post.excerpt_az;

  const categoryLabel = isAz && post.category_az ? post.category_az : (post.category || "Məqalə");

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
      className="group relative z-10 flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] dark:shadow-none dark:hover:shadow-primary/5 focus-within:ring-2 focus-within:ring-primary"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        {/* Cover Image Container */}
        <Link
          to={getLocalizedPath(`/blog/${slugStr}`)}
          className="mb-5 block aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 dark:border-white/10 relative bg-muted/40 dark:bg-neutral-900/80 focus:outline-none"
          tabIndex={-1}
        >
          <img
            src={coverUrl}
            alt={currentTitle}
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center group-hover:scale-[1.025] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(
                post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : "designNews",
                post.title
              );
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </Link>

        {/* Category & Format Badges + Action Arrow */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
              {categoryLabel}
            </span>
            {post.format && (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
                {post.format}
              </span>
            )}
          </div>

          <Link
            to={getLocalizedPath(`/blog/${slugStr}`)}
            className="grid h-8 w-8 place-items-center rounded-full border border-border/80 bg-background/60 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:text-black focus:outline-none shadow-xs shrink-0"
            aria-label={`Oxu: ${currentTitle}`}
          >
            <ArrowRight size={13} className="transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-rotate-45" />
          </Link>
        </div>

        {/* Short, Magnetic Headline (Clean 2 lines, no ellipsis) */}
        <h3 className="mb-3 text-lg sm:text-xl font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]">
          <Link to={getLocalizedPath(`/blog/${slugStr}`)} className="focus:outline-none focus-visible:underline">
            {currentTitle}
          </Link>
        </h3>

        {/* Short Deck (1-2 lines) */}
        {currentDeck && (
          <p className="mb-6 text-xs leading-relaxed text-muted-foreground line-clamp-2 font-medium">
            {currentDeck}
          </p>
        )}
      </div>

      {/* Footer Section: Author Photo + Name + Metadata */}
      <div className="mt-auto space-y-3 pt-4 border-t border-border/80 dark:border-white/10">
        {/* Author Avatar & Name */}
        <div className="flex items-center gap-2.5">
          <Link
            to={getLocalizedPath("/about/ravan-mammadov")}
            className="relative h-7 w-7 rounded-full overflow-hidden border border-primary/30 shrink-0 bg-muted/50 hover:border-primary transition-colors focus:outline-none ring-1 ring-primary/20"
            aria-label={displayAuthorName}
          >
            <img
              src={authorAvatar}
              alt={displayAuthorName}
              width={28}
              height={28}
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
          <div className="min-w-0 flex-1">
            <Link
              to={getLocalizedPath("/about/ravan-mammadov")}
              className="text-xs font-semibold text-foreground hover:text-primary transition-colors truncate block focus:outline-none"
            >
              {displayAuthorName}
            </Link>
          </div>
        </div>

        {/* Publication Date, Reading Time, Genuine Real View Count */}
        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mono uppercase text-muted-foreground pt-1 border-t border-border/40 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar size={11} className="text-primary/80" />
                {formattedDate}
              </span>
            )}

            <span className="flex items-center gap-1">
              <Clock size={11} className="text-primary/80" />
              {readTimeStr}
            </span>
          </div>

          {/* Real View Counter */}
          <span className="flex items-center gap-1 font-bold text-primary">
            <Eye size={11} />
            {views > 0 ? `${views.toLocaleString()} ${isAz ? "baxış" : "views"}` : `${isAz ? "Yeni" : "New"}`}
          </span>
        </div>
      </div>
    </article>
  );
}
