import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";

interface BlogHeroProps {
  post: BlogPost;
}

export default function BlogHero({ post }: BlogHeroProps) {
  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder ? imgBuilder.width(1800).quality(90).url() : null;
  const formattedDate = formatBlogDate(post.publishDate);
  const readTimeStr = estimateReadingTime(post.body, post.readTime);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-surface min-h-[420px]">
      {coverUrl && (
        <img
          src={coverUrl}
          alt={post.title || "Blog cover"}
          className="h-[520px] w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="absolute inset-0 flex items-end"
      >
        <div className="w-full p-8 md:p-14">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-xl transition hover:bg-white/20"
          >
            <ArrowLeft size={18} />
            Back to Articles
          </Link>

          <div className="mb-5 flex flex-wrap gap-3">
            {post.category && (
              <span className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black">
                {post.category}
              </span>
            )}

            {Array.isArray(post.tags) &&
              post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white backdrop-blur-xl"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
              {post.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-8 text-sm text-white/70">
            {formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {formattedDate}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock size={16} />
              {readTimeStr}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}