import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";
import { getArticleCoverImage } from "../../../lib/contentEngine";
import { NoiseBackground } from "@/components/ui/noise-background";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

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
  const { getLocalizedPath } = useLanguage();
  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder ? imgBuilder.width(800).url() : getArticleCoverImage(
    post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : post.category === "Motion" ? "motionNews" : post.category === "Marketing" ? "marketingNews" : "frontendNews",
    post.title
  );
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
      to={getLocalizedPath(`/blog/${slugStr}`)}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl h-full"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <NoiseBackground
        gradientColors={gradientColors}
        className="p-7 min-h-[360px] flex flex-col justify-between"
      >
        <div>
        <div className="mb-6 h-48 w-full overflow-hidden rounded-xl border border-white/10 relative bg-neutral-900/80">
          <img
              src={coverUrl}
              alt={post.title || "Blog cover"}
              width={800}
              height={520}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(
                  post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : post.category === "Motion" ? "motionNews" : "designNews",
                  post.title
                );
              }}
            />
          {/* Dynamic visual overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />
        </div>

          <div className="mb-5 flex items-center justify-between">
            <span
              className="flex items-center gap-2 text-[10px] font-bold tracking-[.18em] mono uppercase transition-colors duration-300"
              style={{
                color: "#61c5ad",
              }}
            >
              {post.category || "Article"}
            </span>

            <motion.div
              animate={{ rotate: hovered ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 group-hover:border-[#61c5ad]/60 group-hover:bg-[#61c5ad]/10 group-hover:text-[#61c5ad]"
              style={{
                color: hovered ? "#61c5ad" : "var(--foreground)",
              }}
            >
              <ArrowRight size={14} />
            </motion.div>
          </div>

          <h3
            className="mb-3 text-xl font-semibold leading-[1.25] tracking-[-.03em] transition-colors duration-300 relative z-10"
            style={{ color: hovered ? "#61c5ad" : "var(--card-foreground)" }}
          >
            {post.title}
          </h3>

          {post.excerpt && (
            <p
              className="mb-6 text-[13px] leading-relaxed line-clamp-3 transition-colors duration-300 relative z-10 font-medium"
              style={{ color: hovered ? "var(--foreground)" : "var(--muted-foreground)" }}
            >
              {post.excerpt}
            </p>
          )}
        </div>

        <div
          className="mt-auto flex items-center gap-5 text-[10px] font-bold tracking-[.14em] mono uppercase transition-colors duration-300 relative z-10 pt-4 border-t border-border"
          style={{ color: hovered ? "var(--foreground)" : "var(--muted-foreground)" }}
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
