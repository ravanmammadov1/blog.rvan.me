import { Link } from "react-router-dom";
import { BlogPost } from "../../../types/blog";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";
import { urlFor } from "../../../lib/sanityClient";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { getEcosystemRelationship } from "../../../lib/ecosystemRelationshipMap";
import { ArrowRight, BookOpen } from "lucide-react";

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}

export default function RelatedPosts({
  currentPost,
  allPosts,
}: RelatedPostsProps) {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  const currentSlug = (currentPost.slug?.current || currentPost._id || "").toLowerCase();
  const relationship = getEcosystemRelationship(currentSlug);

  let selectedPosts: BlogPost[] = [];

  if (relationship && relationship.relatedSlugs.length > 0) {
    const slugSet = new Set(relationship.relatedSlugs.map((s) => s.toLowerCase()));
    
    // Pick posts matching the mapped relationship slugs in order
    for (const targetSlug of relationship.relatedSlugs) {
      const match = allPosts.find((p) => {
        const pSlug = (p.slug?.current || p.originalSlug || p._id || "").toLowerCase();
        return pSlug === targetSlug.toLowerCase();
      });
      if (match && match._id !== currentPost._id && !selectedPosts.some((sp) => sp._id === match._id)) {
        selectedPosts.push(match);
      }
    }
  }

  // Fallback: If fewer than 3 posts mapped or found, fill from same category / topic cluster
  if (selectedPosts.length < 3) {
    const categoryMatches = allPosts.filter(
      (p) =>
        p._id !== currentPost._id &&
        !selectedPosts.some((sp) => sp._id === p._id) &&
        (p.category === currentPost.category || (relationship && p.tags?.includes(relationship.cluster)))
    );
    selectedPosts = [...selectedPosts, ...categoryMatches].slice(0, 3);
  }

  // Final fallback if still empty
  if (selectedPosts.length === 0) {
    selectedPosts = allPosts.filter((p) => p._id !== currentPost._id).slice(0, 3);
  }

  if (selectedPosts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-essays-heading" className="mt-24 border-t border-white/10 pt-16">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mono font-bold">
            <BookOpen size={14} />
            <span>{isAz ? "MÜTALİƏNİ DAVAM ET" : "RECOMMENDED NEXT READ"}</span>
          </div>

          <h2 id="related-essays-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
            {isAz ? "Əlaqəli Tədqiqatlar və Məqalələr" : "Related Essays & Research"}
          </h2>
        </div>

        {relationship && (
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-muted-foreground mono">
            {isAz ? relationship.primaryTopic.az : relationship.primaryTopic.en}
          </span>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {selectedPosts.map((post) => {
          const formattedDate = formatBlogDate(post.publishDate);
          const readTimeStr = estimateReadingTime(post.body, post.readTime);
          const slugStr = post.slug?.current || post._id || "";
          const imgUrl = post.coverImage ? urlFor(post.coverImage)?.url() : null;

          return (
            <Link
              key={post._id}
              to={getLocalizedPath(`/blog/${slugStr}`)}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div>
                {imgUrl && (
                  <div className="mb-4 overflow-hidden rounded-xl aspect-[16/10] bg-background/50 border border-white/5">
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
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mono">
                    {post.category}
                  </span>
                )}

                <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] text-muted-foreground mono font-bold">
                <span>{readTimeStr}</span>
                <span className="inline-flex items-center gap-1 text-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary">
                  {isAz ? "Oxu" : "Read"} <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
