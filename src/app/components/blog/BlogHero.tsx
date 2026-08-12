import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

interface BlogHeroProps {
  post: BlogPost;
}

export default function BlogHero({ post }: BlogHeroProps) {
  const { getLocalizedPath } = useLanguage();
  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder ? imgBuilder.width(1800).quality(90).url() : null;
  const formattedDate = formatBlogDate(post.publishDate);
  const readTimeStr = estimateReadingTime(post.body, post.readTime);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-border bg-surface min-h-[460px]">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={post.title || "Blog cover"}
          width={1800}
          height={1000}
          fetchPriority="high"
          decoding="async"
          className="h-[560px] w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                post.category === "Design"
                  ? "radial-gradient(circle at 80% 20%, rgba(97,197,173,0.35) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(152,79,159,0.25) 0%, transparent 65%)"
                  : post.category === "AI"
                  ? "radial-gradient(circle at 80% 20%, rgba(6,182,212,0.35) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(147,51,234,0.25) 0%, transparent 65%)"
                  : "radial-gradient(circle at 80% 20%, rgba(255,118,75,0.35) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(244,63,94,0.25) 0%, transparent 65%)",
            }}
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="relative z-10 flex h-full flex-col justify-between p-8 md:p-16 pt-16 md:pt-20"
      >
        {/* Subtle Back to Home Navigation Button */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to={getLocalizedPath("/")}
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/60 px-5 py-2.5 text-xs font-bold tracking-[.18em] text-white backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-primary hover:text-black uppercase mono"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>BACK TO HOME</span>
          </Link>

          <Link
            to={getLocalizedPath("/blog")}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[10px] font-bold tracking-widest text-white/80 backdrop-blur-md hover:text-white uppercase mono"
          >
            BLOG ARCHIVE
          </Link>
        </div>

        <div>
          <div className="mb-5 flex flex-wrap gap-3">
            {post.category && (
              <span className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black">
                {post.category}
              </span>
            )}

            {Array.isArray(post.tags) &&
              post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white backdrop-blur-xl mono"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
          </div>

          <h1 className="max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl lg:text-6xl tracking-tight mt-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
              {post.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-8 text-xs font-medium text-white/70 mono">
            {formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar size={15} />
                {formattedDate}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock size={15} />
              {readTimeStr}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
