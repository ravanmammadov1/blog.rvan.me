import { Link } from "react-router-dom";
import { BlogPost } from "../../../types/blog";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";
import { urlFor } from "../../../lib/sanityClient";

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPostId: string;
}

export default function RelatedPosts({
  posts,
  currentPostId,
}: RelatedPostsProps) {
  const relatedPosts = posts
    .filter((post) => post._id !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 border-t border-border pt-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mono font-bold">
          READ NEXT
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Related Articles
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => {
          const formattedDate = formatBlogDate(post.publishDate);
          const readTimeStr = estimateReadingTime(post.body, post.readTime);
          const slugStr = post.slug?.current || "";
          const imgUrl = post.coverImage ? urlFor(post.coverImage)?.url() : null;

          return (
            <Link
              key={post._id}
              to={`/blog/${slugStr}`}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div>
                {imgUrl && (
                  <div className="mb-4 overflow-hidden rounded-lg aspect-[16/10] bg-background">
                    <img
                      src={imgUrl}
                      alt={post.title}
                      width={800}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {post.category && (
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mono">
                    {post.category}
                  </span>
                )}

                <h3 className="mt-3 text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-[10px] text-muted-foreground mono font-bold">
                {formattedDate && <span>{formattedDate}</span>}
                <span>{readTimeStr}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
