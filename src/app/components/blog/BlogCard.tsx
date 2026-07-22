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
        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border p-7 transition-colors duration-300 min-h-[340px]"
        style={{
          background: hovered ? "#d8ff44" : "var(--surface)",
          borderColor: hovered ? "transparent" : "var(--border)",
        }}
      >
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
            className="flex items-center gap-2 text-[10px] font-bold tracking-[.18em] mono"
            style={{
              color:
                hovered
                  ? "#101010"
                  : categoryColors[post.category || ""] || "#d8ff44",
            }}
          >
            {post.category || "Article"}
          </span>

          <motion.div
            animate={{ rotate: hovered ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="grid h-9 w-9 place-items-center rounded-full border"
            style={{
              borderColor: hovered ? "#10101040" : "var(--border)",
              color: hovered ? "#101010" : "var(--foreground)",
            }}
          >
            <ArrowRight size={14} />
          </motion.div>
        </div>

        <h3
          className="mb-4 text-xl font-semibold leading-[1.12] tracking-[-.03em]"
          style={{
            color: hovered ? "#101010" : "var(--foreground)",
          }}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className="mb-8 text-sm leading-relaxed line-clamp-3"
            style={{
              color: hovered
                ? "rgba(16,16,16,.75)"
                : "var(--muted-foreground)",
            }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          className="mt-auto flex items-center gap-5 text-[10px] font-bold tracking-[.14em] mono"
          style={{
            color: hovered
              ? "rgba(16,16,16,.6)"
              : "rgba(255,255,255,.3)",
          }}
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