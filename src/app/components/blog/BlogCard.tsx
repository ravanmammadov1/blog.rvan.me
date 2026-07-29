import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";
import { NoiseBackground } from "@/components/ui/noise-background";

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

const categoryGradientColors: Record<string, string[]> = {
  Design: ["rgb(232, 253, 82)", "rgb(16, 185, 129)", "rgb(6, 182, 212)"],
  Motion: ["rgb(109, 129, 255)", "rgb(139, 92, 246)", "rgb(59, 130, 246)"],
  Marketing: ["rgb(255, 118, 75)", "rgb(244, 63, 94)", "rgb(234, 88, 12)"],
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

  const gradientColors = categoryGradientColors[post.category || ""] || [
    "rgb(232, 253, 82)",
    "rgb(109, 129, 255)",
    "rgb(6, 182, 212)",
  ];

  return (
    <Link
      to={`/blog/${slugStr}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl h-full"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <NoiseBackground
        gradientColors={gradientColors}
        className="p-7 min-h-[360px] flex flex-col justify-between"
      >
        <div>
          {coverUrl && (
            <div className="mb-6 h-52 w-full overflow-hidden rounded-xl border border-white/10 relative">
              <img
                src={coverUrl}
                alt={post.title || "Blog cover"}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              {/* Dynamic visual overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />
            </div>
          )}

          <div className="mb-5 flex items-center justify-between">
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
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:text-primary"
              style={{
                color: hovered ? "var(--primary)" : "var(--foreground)",
              }}
            >
              <ArrowRight size={14} />
            </motion.div>
          </div>

          <h3
            className="mb-3 text-xl font-semibold leading-[1.25] tracking-[-.03em] transition-colors duration-300 relative z-10"
            style={{ color: hovered ? "var(--primary)" : "var(--foreground)" }}
          >
            {post.title}
          </h3>

          {post.excerpt && (
            <p
              className="mb-6 text-[13px] leading-relaxed line-clamp-3 transition-colors duration-300 relative z-10 font-medium"
              style={{ color: hovered ? "rgba(255,255,255,0.85)" : "var(--muted-foreground)" }}
            >
              {post.excerpt}
            </p>
          )}
        </div>

        <div
          className="mt-auto flex items-center gap-5 text-[10px] font-bold tracking-[.14em] mono uppercase transition-colors duration-300 relative z-10 pt-4 border-t border-white/10"
          style={{ color: hovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)" }}
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
      </NoiseBackground>
    </Link>
  );
}