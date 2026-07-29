import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";

interface BlogCardProps {
  post: BlogPost;
  hovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const categoryColors: Record<string, string> = {
  Design: "#d8ff44",
  Motion: "#6d81ff",
  Marketing: "#ff764b",
  Targeting: "#efede7",
};

export default function BlogCard({
  post,
  hovered,
  onHoverStart,
  onHoverEnd,
}: BlogCardProps) {
  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder ? imgBuilder.width(800).url() : null;
  const formattedDate = formatBlogDate(post.publishDate);
  const readTimeStr = estimateReadingTime(post.body, post.readTime);
  const slugStr = post.slug?.current || "";

  return (
    <Link to={`/blog/${slugStr}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
      <motion.article
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl p-7 transition-all duration-300 min-h-[340px] glass-stat"
        style={{
          background: hovered ? "rgba(255, 255, 255, 0.045)" : "rgba(255, 255, 255, 0.025)",
          borderColor: hovered ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.07)",
        }}
      >
        {/* Subtle aurora hover glow inside the card */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: "radial-gradient(circle at center, rgba(216,255,68,0.06) 0%, transparent 70%)",
          }}
        />
        {coverUrl && (
          <img
            src={coverUrl}
            alt={post.title || "Blog cover"}
            loading="lazy"
            className="mb-6 h-52 w-full rounded-lg object-cover"
          />
        )}

        <div className="mb-8 flex items-center justify-between">
          <span
            className="flex items-center gap-2 text-[10px] font-bold tracking-[.18em] mono uppercase transition-colors duration-300"
            style={{
              color: hovered ? "var(--primary)" : categoryColors[post.category || ""] || "#d8ff44",
            }}
          >
            {post.category || "Article"}
          </span>

          <motion.div
            animate={{ rotate: hovered ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="grid h-9 w-9 place-items-center rounded-full border border-border transition-colors duration-300"
            style={{
              borderColor: hovered ? "var(--primary)" : "var(--border)",
              color: hovered ? "var(--primary)" : "var(--foreground)",
              background: hovered ? "rgba(216,255,68,0.1)" : "transparent",
            }}
          >
            <ArrowRight size={14} />
          </motion.div>
        </div>

        <h3
          className="mb-4 text-xl font-semibold leading-[1.2] tracking-[-.02em] transition-colors duration-300 relative z-10"
          style={{ color: hovered ? "var(--primary)" : "var(--foreground)" }}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className="mb-8 text-sm leading-relaxed line-clamp-3 transition-colors duration-300 relative z-10"
            style={{ color: hovered ? "var(--foreground)" : "var(--muted-foreground)" }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          className="mt-auto flex items-center gap-5 text-[10px] font-bold tracking-[.14em] mono uppercase transition-colors duration-300 relative z-10"
          style={{ color: hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}
        >
          {formattedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {formattedDate}
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            {readTimeStr}
          </span>
        </div>
      </motion.article>
    </Link>
  );
}