import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Eye, User } from "lucide-react";

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

  // Real-time Firestore View Counter
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    if (!slugStr) return;
    const unsubscribe = subscribeToArticleStats(slugStr, (stats) => {
      if (stats.viewCount > 0) {
        setViews(stats.viewCount);
      }
    });
    return () => unsubscribe();
  }, [slugStr]);

  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder
    ? imgBuilder.width(1200).height(675).quality(90).auto("format").url()
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
  const readTimeStr = estimateReadingTime(post.body, post.readTime, language);

  // Author resolution: use post.author if available, or canonical author
  const authorName = post.author?.name || (isAz ? CANONICAL_AUTHOR.name_az : CANONICAL_AUTHOR.name);
  const authorRole = post.author?.role || (isAz ? CANONICAL_AUTHOR.role_az : CANONICAL_AUTHOR.role);
  const authorAvatar = post.author?.avatar || CANONICAL_AUTHOR.avatar;
  const authorProfileUrl = post.author?.profileUrl || CANONICAL_AUTHOR.profileUrl;

  const handleMouseEnter = () => {
    setInternalHovered(true);
    if (onHoverStart) onHoverStart();
  };

  const handleMouseLeave = () => {
    setInternalHovered(false);
    if (onHoverEnd) onHoverEnd();
  };

  return (
    <div
      className="group relative z-10 flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-primary/5 focus-within:ring-2 focus-within:ring-primary"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        {/* Cover Image Container */}
        <Link
          to={getLocalizedPath(`/blog/${slugStr}`)}
          className="mb-5 block aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 relative bg-neutral-900/80 focus:outline-none"
          tabIndex={-1}
        >
          <img
            src={coverUrl}
            alt={post.title || "Blog cover"}
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(
                post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : "designNews",
                post.title
              );
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />
        </Link>

        {/* Category & Arrow Row */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[10px] font-bold tracking-wider mono uppercase text-primary"
          >
            {post.category || "Article"}
          </span>

          <Link
            to={getLocalizedPath(`/blog/${slugStr}`)}
            className="grid h-8 w-8 place-items-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-black focus:outline-none"
            aria-label={`Read ${post.title}`}
          >
            <ArrowRight size={13} className="transition-transform group-hover:-rotate-45" />
          </Link>
        </div>

        {/* Article Title */}
        <h3 className="mb-3 text-xl font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
          <Link to={getLocalizedPath(`/blog/${slugStr}`)} className="focus:outline-none focus-visible:underline">
            {post.title}
          </Link>
        </h3>

        {/* Short Description */}
        {post.excerpt && (
          <p className="mb-6 text-xs leading-relaxed text-muted-foreground line-clamp-3 font-medium">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Footer Section: Author + Metadata */}
      <div className="mt-auto space-y-4 pt-4 border-t border-white/10">
        {/* Author Details */}
        <Link
          to={getLocalizedPath(authorProfileUrl)}
          className="flex items-center gap-3 group/author hover:opacity-90 transition-opacity focus:outline-none"
        >
          <img
            src={authorAvatar}
            alt={authorName}
            className="h-9 w-9 rounded-full object-cover border border-white/20 bg-neutral-800 shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = "none";
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground group-hover/author:text-primary transition-colors truncate">
              {authorName}
            </p>
            <p className="text-[10px] text-muted-foreground mono truncate">
              {authorRole}
            </p>
          </div>
        </Link>

        {/* Publication Details: Date, Reading Time, Real Views */}
        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mono uppercase text-muted-foreground pt-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar size={11} className="text-primary/70" />
                {formattedDate}
              </span>
            )}

            <span className="flex items-center gap-1">
              <Clock size={11} className="text-primary/70" />
              {readTimeStr}
            </span>
          </div>

          {views > 0 && (
            <span className="flex items-center gap-1 text-primary">
              <Eye size={11} />
              {views} {isAz ? "baxış" : "views"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
