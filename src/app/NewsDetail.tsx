import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";

import { fetchNewsBySlug, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor, client } from "../lib/sanityClient";
import { NewsItem, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import CommentSection from "./components/CommentSection";
import Footer from "./components/Footer";

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

function getReadingTime(body: any[] | undefined): number {
  if (!body || !Array.isArray(body)) return 1;
  let textContent = "";
  for (const block of body) {
    if (block._type === "block" && block.children) {
      for (const child of block.children) {
        if (child.text) {
          textContent += child.text + " ";
        }
      }
    }
  }
  const words = textContent.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);
  return Math.max(1, readingTime);
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetchNewsBySlug(slug)
        .then(async (data) => {
          setNews(data);
          if (data) {
            // Fetch related articles prioritizing matching category, then most recent news
            const related = await client.fetch<NewsItem[]>(
              `*[_type == "news" && _id != $currentId] | order(category == $category desc, publishedAt desc)[0...3]{
                _id,
                title,
                slug,
                coverImage,
                excerpt,
                publishedAt,
                category
              }`,
              { currentId: data._id, category: data.category || "" }
            );
            setRelatedArticles(related || []);
          }
        })
        .catch((err) => {
          console.error("Error fetching news details:", err);
        })
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
  let formattedDate: string | null = null;
  if (news.publishedAt) {
    try {
      const d = new Date(news.publishedAt);
      if (!isNaN(d.getTime())) {
        formattedDate = format(d, "MMMM d, yyyy");
      }
    } catch (e) {
      formattedDate = null;
    }
  }

  const readingTime = getReadingTime(news.body);
  const siteDomain = siteSettings?.seo?.canonicalUrl || "https://www.rvan.me";
  const articleUrl = `${siteDomain}/news/${news.slug?.current || slug}`;

  // Structured NewsArticle JSON-LD
  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: news.excerpt || news.title,
    image: coverUrl ? [coverUrl] : [],
    datePublished: news.publishedAt,
    dateModified: news.publishedAt,
    url: articleUrl,
    author: {
      "@type": "Person",
      name: siteSettings?.seo?.author || "Ravan Mammadov",
      url: siteDomain,
    },
    publisher: {
      "@type": "Organization",
      name: siteSettings?.seo?.siteName || "Ravan Mammadov",
      logo: {
        "@type": "ImageObject",
        url: siteSettings?.logo ? urlFor(siteSettings.logo)?.url() : `${siteDomain}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title={`${news.title} — Premium Editorial`}
        description={news.excerpt || news.title}
        image={coverUrl || undefined}
        url={articleUrl}
        type="article"
        publishDate={news.publishedAt}
        jsonLd={newsArticleJsonLd}
        favicon={siteSettings?.favicon}
      />

      {/* ── Aurora background blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        
        {/* Blob 1 — emerald / teal, top-left */}
        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%", left: "-10%",
            width: "60%", height: "70%",
            background: "radial-gradient(ellipse at 40% 40%, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.03) 45%, transparent 72%)",
            filter: "blur(64px)",
          }}
        />

        {/* Blob 2 — violet / blue, top-right */}
        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "0%", right: "-12%",
            width: "55%", height: "65%",
            background: "radial-gradient(ellipse at 65% 30%, rgba(139,92,246,0.05) 0%, rgba(59,130,246,0.03) 50%, transparent 78%)",
            filter: "blur(72px)",
          }}
        />

        {/* Micro grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* Global Unified Header */}
      <SiteHeader siteSettings={siteSettings} />

      {/* Header section */}
      <article className="px-6 pt-16 pb-28 md:px-10 md:pt-24 relative z-10">
        <div className="mx-auto max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mono mb-6">
              {news.category && (
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-primary glass-sm">
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
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {readingTime} MIN READ
              </span>
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
              className="mt-10 overflow-hidden rounded-xl border border-white/10"
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
              className="mt-12 border-t border-white/10 pt-10 font-sans"
            >
              <PortableText value={news.body} components={portableTextComponents} />
            </motion.div>
          )}

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-24 border-t border-white/10 pt-16">
              <h3 className="text-xs font-bold tracking-[.18em] mb-8 mono uppercase text-primary">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((article) => {
                  const relatedCover = article.coverImage ? urlFor(article.coverImage)?.url() : null;
                  return (
                    <Link
                      key={article._id}
                      to={`/news/${article.slug?.current}`}
                      className="group flex flex-col justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 glass"
                    >
                      <div>
                        {relatedCover && (
                          <div className="aspect-video w-full overflow-hidden rounded mb-4 border border-white/10">
                            <img
                              src={relatedCover}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <span className="text-[10px] font-bold tracking-wider mono text-muted-foreground uppercase">
                          {article.category}
                        </span>
                        <h4 className="mt-2 text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                      </div>
                      <span className="mt-4 text-[10px] font-semibold text-muted-foreground mono">
                        {article.publishedAt ? format(new Date(article.publishedAt), "MMM d, yyyy") : ""}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-16">
            <CommentSection postId={news._id} postTitle={news.title} />
          </div>
        </div>
      </article>

      {/* Footer */}
      <Footer siteSettings={siteSettings} />
    </main>
  );
}
