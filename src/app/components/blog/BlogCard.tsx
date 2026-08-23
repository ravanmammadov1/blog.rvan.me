import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";
import { getArticleCoverImage } from "../../../lib/contentEngine";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

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
  const { getLocalizedPath } = useLanguage();
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = externalHovered ?? internalHovered;

  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder
    ? imgBuilder.width(1200).height(675).quality(90).auto("format").url()
    : getArticleCoverImage(
        post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : post.category === "Motion" ? "motionNews" : post.category === "Marketing" ? "marketingNews" : "frontendNews",
        post.title
      );
  const formattedDate = formatBlogDate(post.publishDate);
  const readTimeStr = estimateReadingTime(post.body, post.readTime);

  // Safely extract slug string
  const rawSlug = typeof post.slug === "string" ? post.slug : (post.slug?.current || post._id || "");
  const slugStr = rawSlug.replace(/^\/?(az\/)?blog\//, "").replace(/^\//, "").replace(/\/+$/, "");

  const handleMouseEnter = () => {
    setInternalHovered(true);
    if (onHoverStart) onHoverStart();
  };

  const handleMouseLeave = () => {
    setInternalHovered(false);
    if (onHoverEnd) onHoverEnd();
  };

  return (
    <Link
      to={getLocalizedPath(`/blog/${slugStr}`)}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <article className="flex flex-col justify-between h-full p-6 md:p-7 rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/40">
        <div>
          {/* Article Image */}
          <div className="mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border relative bg-muted/40">
            <img
              src={coverUrl}
              alt={post.title || "Blog cover"}
              width={1200}
              height={675}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 ease-out"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(
                  post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : post.category === "Motion" ? "motionNews" : "designNews",
                  post.title
                );
              }}
            />
          </div>

          {/* Category & Arrow */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-[.16em] mono uppercase text-primary">
              {post.category || "Article"}
            </span>

            <motion.div
              animate={{ x: isHovered ? 3 : 0, y: isHovered ? -3 : 0 }}
              transition={{ duration: 0.2 }}
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground group-hover:border-primary group-hover:text-primary group-hover:bg-primary/10 transition-colors"
            >
              <ArrowRight size={13} className="-rotate-45" />
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="mb-3 text-xl font-bold leading-snug tracking-tight text-card-foreground group-hover:text-primary transition-colors duration-200">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground line-clamp-3 font-normal">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-auto flex items-center gap-4 text-[11px] font-medium tracking-wider mono text-muted-foreground pt-4 border-t border-border">
          {formattedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="opacity-70" />
              {formattedDate}
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <Clock size={12} className="opacity-70" />
            {readTimeStr}
          </span>
        </div>
      </article>
    </Link>
  );
}
