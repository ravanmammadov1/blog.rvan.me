import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";

import { fetchNewsBySlug } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { NewsItem } from "../types/cms";
import SEO from "./components/SEO";
import CommentSection from "./components/CommentSection";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      const imgUrl = urlFor(value)?.url();
      return (
        <figure className="my-8 overflow-hidden rounded-lg border border-border">
          <img
            src={imgUrl}
            alt={value.alt || "News image"}
            className="w-full max-h-[500px] object-cover"
          />
          {value.caption && (
            <figcaption className="p-3 text-center text-xs text-muted-foreground mono border-t border-border bg-surface">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="mt-8 mb-4 text-3xl font-semibold tracking-tight text-foreground">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="mt-6 mb-3 text-2xl font-semibold tracking-tight text-foreground">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-4 mb-2 text-xl font-semibold tracking-tight text-foreground">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 text-base leading-relaxed text-muted-foreground">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-6 border-l-2 border-primary pl-4 text-lg italic text-foreground bg-surface/50 py-2 pr-4 rounded-r">
        {children}
      </blockquote>
    ),
  },
};

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      fetchNewsBySlug(slug)
        .then((data) => setNews(data))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/news");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground mono animate-pulse">
          LOADING ARTICLE...
        </p>
      </div>
    );
  }

  if (!news) {
    return (
      <main className="min-h-screen bg-background text-foreground px-6 py-32">
        <SEO title="Article Not Found — Ravan Mammadov" />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold mb-4">News Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested article could not be found or has been moved.</p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all mono"
          >
            <ArrowLeft size={16} /> BACK TO NEWS
          </Link>
        </div>
      </main>
    );
  }

  const coverUrl = news.coverImage ? urlFor(news.coverImage)?.url() : null;
  const formattedDate = news.publishedAt
    ? format(new Date(news.publishedAt), "MMMM d, yyyy")
    : null;

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title={`${news.title} — News`}
        description={news.excerpt || news.title}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
          <Link
            to="/news"
            className="group flex items-center gap-3 text-xs font-bold tracking-[.18em] uppercase hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>BACK TO NEWS</span>
          </Link>
        </div>
      </header>

      {/* Header section */}
      <article className="px-6 pt-16 pb-28 md:px-10 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mono mb-6">
              {news.category && (
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-primary">
                  <Tag size={12} />
                  {news.category}
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formattedDate}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl text-foreground leading-tight">
              {news.title}
            </h1>

            {news.excerpt && (
              <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
                {news.excerpt}
              </p>
            )}
          </motion.div>

          {coverUrl && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="mt-10 overflow-hidden rounded-xl border border-border"
            >
              <img
                src={coverUrl}
                alt={news.title}
                className="w-full max-h-[600px] object-cover"
              />
            </motion.div>
          )}

          {/* Body PortableText */}
          {news.body && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="mt-12 border-t border-border pt-10 font-sans"
            >
              <PortableText value={news.body} components={portableTextComponents} />
            </motion.div>
          )}

          <CommentSection postId={news._id} postTitle={news.title} />
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} RAVAN MAMMADOV</span>
          <Link to="/news" className="hover:text-primary">
            ← BACK TO ALL NEWS
          </Link>
        </div>
      </footer>
    </main>
  );
}
