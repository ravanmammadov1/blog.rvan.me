import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowUp } from "lucide-react";

import { client, urlFor } from "../lib/sanityClient";
import { BlogPost } from "../types/blog";

import SEO from "./components/SEO";
import ReadingProgress from "./components/blog/ReadingProgress";
import BlogHero from "./components/blog/BlogHero";
import BlogContent from "./components/blog/BlogContent";
import TableOfContents from "./components/blog/TableOfContents";
import ShareButtons from "./components/blog/ShareButtons";
import AuthorCard from "./components/blog/AuthorCard";
import RelatedPosts from "./components/blog/RelatedPosts";

import CommentSection from "./components/CommentSection";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchPost() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const slugClean = slug.toLowerCase().trim();
        const slugPattern = `*${slugClean.replace(/-/g, "*")}*`;

        const [article, all] = await Promise.all([
          client.fetch(
            `
            *[_type == "blog" && (slug.current == $slug || _id == $slug || lower(title) match $slugPattern)][0]{
              _id,
              title,
              slug,
              excerpt,
              body,
              publishDate,
              readTime,
              category,
              tags,
              featured,
              coverImage
            }
            `,
            { slug: slugClean, slugPattern }
          ),
          client.fetch(
            `
            *[_type == "blog"] | order(publishDate desc){
              _id,
              title,
              slug,
              excerpt,
              body,
              publishDate,
              readTime,
              category,
              tags,
              featured,
              coverImage
            }
            `
          ),
        ]);

        const allList = all && all.length > 0 ? all : [];
        setAllPosts(allList);

        if (article) {
          setPost(article);
          const related = allList.filter((p: BlogPost) => p._id !== article._id).slice(0, 3);
          setRelatedPosts(related);
        } else if (allList.length > 0) {
          // Fallback match from all published posts
          const matched = allList.find((p: BlogPost) => {
            const pSlug = p.slug?.current?.toLowerCase() || "";
            const pTitle = p.title?.toLowerCase() || "";
            return (
              pSlug === slugClean ||
              p._id === slugClean ||
              pSlug.includes(slugClean) ||
              slugClean.includes(pSlug) ||
              pTitle.includes(slugClean.replace(/-/g, " "))
            );
          }) || allList[0];

          setPost(matched);
          const related = allList.filter((p: BlogPost) => p._id !== matched._id).slice(0, 3);
          setRelatedPosts(related);
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load article. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard Escape navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/blog");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div className="text-sm font-medium tracking-widest text-muted-foreground mono">
            LOADING ARTICLE...
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
        <SEO title="Article Not Found — Ravan Mammadov" />
        <div className="text-center">
          <h1 className="text-4xl font-bold">Article Not Found</h1>
          <p className="mt-4 text-muted-foreground">
            {error || "The requested blog post could not be found."}
          </p>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur-xl transition hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Back to Blog Archive
          </Link>
        </div>
      </main>
    );
  }

  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder ? imgBuilder.width(1200).url() : undefined;

  const currentIndex = allPosts.findIndex(
    (p) => p.slug?.current === slug || p._id === post._id
  );
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${post.title} — Ravan Mammadov`}
        description={post.excerpt || `Read ${post.title} by Ravan Mammadov.`}
        image={coverUrl}
        type="article"
        publishDate={post.publishDate}
      />

      <ReadingProgress />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <BlogHero post={post} />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          {/* Sidebar — Table of Contents */}
          <aside className="hidden lg:col-span-3 lg:order-2 lg:block">
            <div className="sticky top-28 space-y-8">
              {Array.isArray(post.body) && <TableOfContents body={post.body} />}
            </div>
          </aside>

          {/* Mobile ToC */}
          {Array.isArray(post.body) && (
            <div className="lg:hidden">
              <details className="group rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-md">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-xs font-bold uppercase tracking-[.18em] text-primary mono">
                  <span>Table of Contents</span>
                  <span className="transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="px-6 pb-6">
                  <TableOfContents body={post.body} />
                </div>
              </details>
            </div>
          )}

          {/* Main content */}
          <div className="lg:col-span-9 lg:order-1">
            <BlogContent post={post} />

            <ShareButtons title={post.title} />

            <AuthorCard />

            <CommentSection postId={post._id} postTitle={post.title} />

            {/* Previous / Next Article Navigation */}
            {(prevPost || nextPost) && (
              <div className="mt-16 grid gap-6 sm:grid-cols-2 border-t border-border pt-12">
                {prevPost ? (
                  <Link
                    to={`/blog/${prevPost.slug?.current || prevPost._id}`}
                    className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">← PREVIOUS ARTICLE</span>
                    <p className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{prevPost.title}</p>
                  </Link>
                ) : <div />}

                {nextPost ? (
                  <Link
                    to={`/blog/${nextPost.slug?.current || nextPost._id}`}
                    className="group flex flex-col justify-between items-end rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary text-right"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">NEXT ARTICLE →</span>
                    <p className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{nextPost.title}</p>
                  </Link>
                ) : <div />}
              </div>
            )}

            <RelatedPosts
              posts={relatedPosts}
              currentPostId={post._id}
            />
          </div>
        </div>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-surface/80 text-foreground backdrop-blur-md transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}