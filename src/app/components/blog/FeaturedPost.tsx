import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";

import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";

interface FeaturedPostProps {
  post: BlogPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder ? imgBuilder.width(1600).url() : null;
  const formattedDate = formatBlogDate(post.publishDate);
  const readTimeStr = estimateReadingTime(post.body, post.readTime);
  const slugStr = post.slug?.current || "";

  return (
    <Link
      to={`/blog/${slugStr}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-500 hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {coverUrl && (
        <div className="overflow-hidden">
          <img
            src={coverUrl}
            alt={post.title || "Featured blog post"}
            loading="lazy"
            className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-8 md:p-10">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-primary px-4 py-2 text-[10px] font-bold tracking-[.18em] text-primary-foreground mono">
            FEATURED
          </span>

          <ArrowUpRight
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>

        <h2 className="max-w-4xl text-3xl font-semibold tracking-[-.04em] md:text-5xl">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-bold tracking-[.14em] text-muted-foreground mono">
          {post.category && <span>{post.category}</span>}

          {formattedDate && (
            <span className="flex items-center gap-2">
              <Calendar size={13} />
              {formattedDate}
            </span>
          )}

          <span className="flex items-center gap-2">
            <Clock size={13} />
            {readTimeStr}
          </span>
        </div>
      </div>
    </Link>
  );
}