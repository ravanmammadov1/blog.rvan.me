import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Clock, ExternalLink, Sparkles, Share2, Check, Bookmark, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";

import { fetchNewsBySlug, fetchSiteSettings, fetchNews } from "../lib/sanityQueries";
import { urlFor, client } from "../lib/sanityClient";
import { SiteSettings } from "../types/cms";
import { aggregateNewsFeeds, NormalizedResource, CURATED_NEWS_CATALOG, getCachedNewsFeeds } from "../lib/rssAggregator";
import { generateDetailedEditorial, getArticleCoverImage, DetailedEditorial } from "../lib/contentEngine";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import CommentSection from "./components/CommentSection";
import Footer from "./components/Footer";

import { useLanguage } from "../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [article, setArticle] = useState<NormalizedResource | null>(null);
  const [sanityBody, setSanityBody] = useState<any[] | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NormalizedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { t, getLocalizedPath, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    async function loadArticleData() {
      if (!slug) return;
      
      // 0. Synchronous instant lookup pool (0ms render, NEVER show "Article Not Found" for catalog items!)
      const cacheFeeds = getCachedNewsFeeds() || [];
      const combinedPool = [...cacheFeeds, ...CURATED_NEWS_CATALOG];
      
      const instantMatch = combinedPool.find(
        (item) =>
          item.slug === slug ||
          item.id === slug ||
          item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug ||
          slug.includes(item.slug || "") ||
          (item.slug || "").includes(slug)
      );

      if (instantMatch) {
        const cover = instantMatch.imageUrl || instantMatch.logoUrl || getArticleCoverImage(instantMatch.category, instantMatch.title);
        setArticle({ ...instantMatch, logoUrl: cover });
        setLoading(false); // Instant render!
      }

      try {
        // 1. Check Sanity CMS
        const sanityDoc = await fetchNewsBySlug(slug!);
        if (sanityDoc) {
          const pubIso = sanityDoc.publishedAt || new Date().toISOString();
          const cover = sanityDoc.coverImage ? urlFor(sanityDoc.coverImage)?.url() : getArticleCoverImage(sanityDoc.category, sanityDoc.title);
          
          setArticle({
            id: sanityDoc._id,
            title: sanityDoc.title,
            slug: sanityDoc.slug?.current || sanityDoc._id,
            resourceType: "news",
            description: sanityDoc.excerpt || sanityDoc.title,
            benefitSummary: "Studio Announcement",
            link: `/news/${sanityDoc.slug?.current || sanityDoc._id}`,
            sourceName: "Rvan Studio",
            publishedAt: pubIso,
            formattedDate: format(new Date(pubIso), "MMMM d, yyyy"),
            category: sanityDoc.category || "Announcements",
            country: "Global",
            workType: "na",
            isFree: true,
            logoUrl: cover,
            isRss: false,
          });
          setSanityBody(sanityDoc.body || null);
          setLoading(false);
        }

        // 2. Fetch aggregated feeds with background update
        const cmsNews = await fetchNews();
        const allItems = await aggregateNewsFeeds(cmsNews || []);

        if (allItems.length > 0) {
          const matched = allItems.find(
            (item) =>
              item.slug === slug ||
              item.id === slug ||
              item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug ||
              slug.includes(item.slug || "")
          );

          if (matched) {
            const cover = matched.imageUrl || matched.logoUrl || getArticleCoverImage(matched.category, matched.title);
            setArticle({ ...matched, logoUrl: cover });
          }

          setRelatedArticles(allItems.filter((a) => a.slug !== slug && a.id !== slug).slice(0, 3));
        } else if (instantMatch) {
          setRelatedArticles(combinedPool.filter((a) => a.slug !== slug && a.id !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error("Error loading article detail:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArticleData();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold tracking-widest text-muted-foreground mono">
            LOADING EDITORIAL...
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-background text-foreground px-6 py-32">
        <SEO title="Article Not Found — Rvan.me" />
        <SEO noIndex />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested publication could not be located.</p>
          <Link
            to={getLocalizedPath("/news")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-black transition-all mono"
          >
            <ArrowLeft size={16} /> {t("backToNews", "BACK TO NEWS HUB")}
          </Link>
        </div>
      </main>
    );
  }

  const editorial: DetailedEditorial = generateDetailedEditorial(
    article.title,
    article.description,
    article.sourceName,
    article.category,
    language
  );

  const coverImage = article.logoUrl || getArticleCoverImage(article.category, article.title);
  const siteDomain = siteSettings?.seo?.canonicalUrl || "https://www.rvan.me";
  const articleUrl = `${siteDomain}${getLocalizedPath(`/news/${article.slug}`)}`;

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${article.title} — Premium Editorial`}
        description={article.description}
        image={coverImage}
        url={articleUrl}
        type="article"
        articleSchemaType="NewsArticle"
        publishDate={article.publishedAt}
      />

      {/* Aurora Ambient Blob */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30">
        <div
          className="absolute -top-[20%] left-[25%] h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.08) 0%, rgba(59,130,246,0.04) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Main Article Container */}
      <article className="px-6 pt-16 pb-28 md:px-10 md:pt-24 relative z-10">
        <div className="mx-auto max-w-4xl">
          {/* Back button & Action controls */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              to={getLocalizedPath("/news")}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors mono uppercase"
            >
              <ArrowLeft size={14} /> {t("backToNews", "BACK TO NEWS")}
            </Link>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all glass-sm mono"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              {copied ? t("linkCopied", "COPIED") : t("copyLink", "SHARE")}
            </button>
          </div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.05}>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground mono mb-6">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary font-bold">
                {article.sourceName}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <Tag size={12} className="text-muted-foreground" />
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground/70">
                <Calendar size={12} />
                {article.formattedDate}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground/70">
                <Clock size={12} />
                {editorial.estimatedReadingTimeMinutes} MIN READ
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl lg:text-6xl text-foreground leading-[1.1]">
              {article.title}
            </h1>

            {/* Lead Excerpt */}
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground/90 font-normal">
              {article.description}
            </p>
          </motion.div>

          {/* Article Cover Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 aspect-[16/9] shadow-2xl relative"
          >
            <img
              src={coverImage}
              alt={article.title}
              width={1600}
              height={900}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* ─────────────────────────────────────────────────────────────────────────────
              COMPREHENSIVE 500-1000 WORD AI EDITORIAL SUMMARY
          ───────────────────────────────────────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-12 space-y-10 text-foreground leading-relaxed font-sans"
          >
            {/* Header Tag */}
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs font-bold text-primary mono uppercase">
              <Sparkles size={16} /> Extended AI Editorial & Technical Breakdown ({editorial.wordCount} Words)
            </div>

            {/* 1. Overview */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 glass">
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-3 flex items-center gap-2">
                <span>📌</span> Executive Overview
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                {editorial.overview}
              </p>
            </section>

            {/* 2. What's New */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>🚀</span> What's New & Core Innovations
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                {editorial.whatsNew}
              </p>
            </section>

            {/* 3. Key Features */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 glass">
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-4 flex items-center gap-2">
                <span>⚡</span> Key Capabilities & Highlights
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {editorial.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Technical Breakdown */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>⚙️</span> Technical & Architecture Deep-Dive
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                {editorial.technicalBreakdown}
              </p>
            </section>

            {/* 5. Industry Impact */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>💡</span> Industry & Market Impact
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                {editorial.industryImpact}
              </p>
            </section>

            {/* 6. Why It Matters */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>🎯</span> Strategic Value & Why It Matters
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                {editorial.whyItMatters}
              </p>
            </section>

            {/* 7. Key Takeaways */}
            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 text-foreground">
              <h2 className="text-xl font-bold tracking-tight text-primary mb-4 flex items-center gap-2 uppercase mono">
                Key Takeaways & Actionable Guidance
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {editorial.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 text-primary font-bold">0{idx + 1}.</span>
                    <span className="text-foreground">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Optional Sanity PortableText if available */}
            {sanityBody && (
              <div className="pt-8 border-t border-white/10">
                <h3 className="text-lg font-bold text-foreground mb-4">Original PortableText Body</h3>
                <PortableText value={sanityBody} />
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────────────────
                READ FULL ORIGINAL ARTICLE BUTTON (PLACED AFTER THE ENTIRE AI SUMMARY)
            ───────────────────────────────────────────────────────────────────────────── */}
            <div className="mt-16 pt-10 border-t border-white/10 flex flex-col items-center justify-center text-center gap-4">
              <p className="text-xs text-muted-foreground mono">
                Article curated from original publisher <span className="text-foreground font-bold">{article.sourceName}</span>.
              </p>
              {article.link && article.link.startsWith("http") && (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-xs font-bold text-black uppercase tracking-widest hover:bg-white hover:shadow-[0_0_25px_rgba(232,253,82,0.4)] transition-all duration-300 mono"
                >
                  <span>READ FULL ORIGINAL ARTICLE AT {article.sourceName.toUpperCase()}</span>
                  <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-24 border-t border-white/10 pt-16">
              <h3 className="text-xs font-bold tracking-[.18em] mb-8 mono uppercase text-primary">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => {
                  const relCover = rel.logoUrl || getArticleCoverImage(rel.category, rel.title);
                  return (
                    <Link
                      key={rel.id}
                      to={`/news/${rel.slug}`}
                      className="group flex flex-col justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 glass"
                    >
                      <div>
                        <div className="aspect-video w-full overflow-hidden rounded-lg mb-4 border border-white/10 bg-background">
                          <img
                            src={relCover}
                            alt={rel.title}
                            width={800}
                            height={450}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="text-[10px] font-bold tracking-wider mono text-primary uppercase">
                          {rel.sourceName}
                        </span>
                        <h4 className="mt-1 text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                      </div>
                      <span className="mt-4 text-[10px] font-semibold text-muted-foreground mono">
                        {rel.formattedDate}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="mt-16">
            <CommentSection postId={article.slug || article.id} postTitle={article.title} />
          </div>
        </div>
      </article>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
