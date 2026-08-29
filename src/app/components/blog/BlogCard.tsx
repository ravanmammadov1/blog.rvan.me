import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
      className="group relative flex h-full flex-col justify-between rounded-2xl liquid-glass-card liquid-glass-interactive p-4 sm:p-5 focus-within:ring-2 focus-within:ring-primary"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative z-10">
        {/* Clean 16:9 Editorial Image Frame */}
        <Link
          to={detailPath}
          className="mb-4 block aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted/40 dark:bg-neutral-900 relative ring-1 ring-inset ring-black/10 dark:ring-white/15 shadow-inner focus:outline-none"
          tabIndex={-1}
        >
          <img
            src={coverUrl}
            alt={currentTitle}
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(
                post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : "designNews",
                post.title
              );
            }}
          />
        </Link>

        {/* Pure Typographic Eyebrow & Read Time (No Pill Badges) */}
        <div className="mb-2 flex items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.12em]">
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <span>{categoryLabel}</span>
            {post.format && (
              <>
                <span className="text-muted-foreground/40 font-normal">/</span>
                <span className="text-muted-foreground font-semibold">{post.format}</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground/70 font-medium normal-case tracking-normal">
            {readTimeStr}
          </span>
        </div>

        {/* Authoritative Editorial Headline */}
        <h3 className="text-[17px] sm:text-[18px] font-bold leading-[1.32] tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
          <Link to={detailPath} className="focus:outline-none focus-visible:underline">
            {currentTitle}
          </Link>
        </h3>

        {/* Refined Excerpt / Deck */}
        {currentDeck && (
          <p className="mt-2 mb-4 text-[13px] leading-[1.58] text-muted-foreground line-clamp-2 font-normal">
            {currentDeck}
          </p>
        )}
      </div>

      {/* Understated Editorial Signature Footer */}
      <div className="relative z-10 mt-auto pt-3 border-t border-border/60 dark:border-white/5 flex items-center justify-between text-[11px]">
        {/* Author Details + Date */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to={authorPath}
            className="relative h-5 w-5 rounded-full overflow-hidden border border-border/80 shrink-0 bg-muted focus:outline-none"
            aria-label={displayAuthorName}
            tabIndex={-1}
          >
            <img
              src={authorAvatar}
              alt={displayAuthorName}
              width={20}
              height={20}
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

          <div className="flex items-center gap-1.5 truncate text-muted-foreground">
            <Link
              to={authorPath}
              className="font-medium text-foreground hover:text-primary transition-colors truncate focus:outline-none"
            >
              {displayAuthorName}
            </Link>
            {formattedDate && (
              <>
                <span className="text-muted-foreground/40 shrink-0">•</span>
                <span className="mono text-[10px] shrink-0 text-muted-foreground/80">{formattedDate}</span>
              </>
            )}
          </div>
        </div>

        {/* Quiet View Counter (If Available) */}
        {views > 0 && (
          <span className="mono text-[10px] font-semibold text-muted-foreground/60 shrink-0">
            {views.toLocaleString()} {isAz ? "oxu" : "reads"}
          </span>
        )}
      </div>
    </article>
  );
}

