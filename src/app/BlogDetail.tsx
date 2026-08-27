import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";

import { fetchSiteSettings, fetchBlogBySlug, fetchAllBlogs } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { BlogPost } from "../types/blog";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { trackArticleView, trackReadingProgress } from "../services/articleStatsService";
import { captureTrafficAttribution } from "../services/attributionService";

import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ReadingProgress from "./components/blog/ReadingProgress";
import BlogHero from "./components/blog/BlogHero";
import BlogContent from "./components/blog/BlogContent";
import TableOfContents from "./components/blog/TableOfContents";
import AuthorCard from "./components/blog/AuthorCard";
import ArticleReactions from "./components/blog/ArticleReactions";
import DiscussionTrigger from "./components/blog/DiscussionTrigger";
import RelatedPosts from "./components/blog/RelatedPosts";
import CommentSection from "./components/CommentSection";
import GlobalFaqSection from "./components/GlobalFaqSection";
import { Button } from "./components/ui/Button";
import { urlFor } from "../lib/sanityClient";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Capture UTM traffic attribution once on page load
  useEffect(() => {
    captureTrafficAttribution();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    const cleanSlug = decodeURIComponent(slug)
      .replace(/^\/?(az\/)?blog\//, "")
      .replace(/^\//, "")
      .replace(/\/+$/, "")
      .trim()
      .toLowerCase();

    Promise.all([
      fetchBlogBySlug(slug, language),
      fetchAllBlogs(language),
    ])
      .then(([singlePost, postsList]) => {
        let foundPost = singlePost;

        if (!foundPost && postsList && postsList.length > 0) {
          foundPost =
            postsList.find((p) => {
              const pSlug = (typeof p.slug === "string" ? p.slug : p.slug?.current || p._id || "")
                .toLowerCase()
                .replace(/\/+$/, "");
              const pOrigSlug = (p.originalSlug || "").toLowerCase();
              const pAzSlug = (p.slug_az?.current || p.azSlug || "").toLowerCase();
              return (
                pSlug === cleanSlug ||
                pOrigSlug === cleanSlug ||
                pAzSlug === cleanSlug ||
                (p._id && p._id.toLowerCase() === cleanSlug)
              );
            }) || null;
        }

        if (postsList) {
          setAllPosts(postsList);
        }

        if (foundPost) {
          setPost(foundPost);
          trackArticleView(foundPost._id || foundPost.slug?.current || cleanSlug);
          trackReadingProgress(foundPost._id || foundPost.slug?.current || cleanSlug, "start");
        } else {
          setError(t("articleNotFound", "Article Not Found"));
        }
      })
      .catch((err) => {
        console.error("Error fetching blog post:", err);
        setError(t("articleNotFound", "Article Not Found"));
      })
      .finally(() => setLoading(false));
  }, [slug, language, t]);

  // Track scroll depth milestones (25%, 50%, 75%, 100%)
  useEffect(() => {
    if (!post) return;
    const trackingId = post.slug?.current || post.originalSlug || post._id;
    if (!trackingId) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = (window.scrollY / scrollHeight) * 100;

      if (progress >= 25 && progress < 50) trackReadingProgress(trackingId, 25);
      else if (progress >= 50 && progress < 75) trackReadingProgress(trackingId, 50);
      else if (progress >= 75 && progress < 95) trackReadingProgress(trackingId, 75);
      else if (progress >= 95) trackReadingProgress(trackingId, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(getLocalizedPath("/blog"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, getLocalizedPath]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div className="text-sm font-medium tracking-widest text-muted-foreground mono">
            {t("loadingArticle", "LOADING ARTICLE...")}
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
        <SEO title={`${t("articleNotFound", "Article Not Found")} — Rvan.me`} noIndex />
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t("articleNotFound", "Article Not Found")}</h1>
          <p className="mt-4 text-muted-foreground">
            {error || t("articleNotFoundDesc", "The requested blog post could not be found.")}
          </p>
          <Link
            to={getLocalizedPath("/blog")}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm text-foreground shadow-sm transition hover:bg-muted"
          >
            <ArrowLeft size={16} />
            {t("backToBlogArchive", "Back to Blog Archive")}
          </Link>
        </div>
      </main>
    );
  }

  const coverUrl = typeof post.coverImage?.url === "string" ? post.coverImage.url : undefined;

  const currentIndex = allPosts.findIndex(
    (p) => (p.slug?.current || p._id) === (post.slug?.current || post._id)
  );
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  const postTrackingId = post.slug?.current || post.originalSlug || post._id || "";

  const currentTitle = isAz && post.title_az ? post.title_az : post.title;
  const currentExcerpt = isAz ? (post.deck_az || post.excerpt_az || post.excerpt) : (post.deck || post.excerpt);
  const activeBody = isAz && post.body_az ? post.body_az : (post.body || post.body_az);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ReadingProgress />

      <SEO
        title={post.seo?.metaTitle || `${currentTitle} — Rvan.me`}
        description={post.seo?.metaDescription || currentExcerpt || `Read "${currentTitle}" on Rvan.me — Creative Publication & Knowledge Platform.`}
        image={post.seo?.ogImage ? urlFor(post.seo.ogImage)?.width(1200).height(630).url() : coverUrl}
        url={post.seo?.canonicalUrl || `https://www.rvan.me/blog/${post.slug?.current || slug}`}
        type="article"
        publishDate={post.publishDate}
        authorName={post.desk || post.authorName || "Rvan.me Editorial"}
        noIndex={post.seo?.noIndex}
      />

      <SiteHeader siteSettings={siteSettings} />

      <article className="mx-auto max-w-[1280px] px-4 pt-8 pb-20 sm:px-6 md:px-8 md:pt-12 md:pb-28">
        <BlogHero post={post} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Article Content Column */}
          <div className="lg:col-span-8 space-y-10 min-w-0">
            {/* Mobile Collapsible TOC */}
            <div className="lg:hidden">
              <TableOfContents body={activeBody} isMobile />
            </div>

            <BlogContent post={post} />

            {/* Verified Sources & Literature Section */}
            {Array.isArray(post.sources) && post.sources.length > 0 && (
              <section className="rounded-2xl border border-border/80 dark:border-white/10 bg-card/60 dark:bg-white/[0.02] p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  <BookOpen size={14} className="text-primary" />
                  <span>{isAz ? "Mənbələr və Ədəbiyyat" : "Sources & Literature"}</span>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                  {post.sources.map((src, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <div>
                        <span className="text-foreground font-medium">{src.title}</span>
                        {src.author && <span> — {src.author}</span>}
                        {src.year && <span> ({src.year})</span>}
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 ml-1.5 text-primary hover:underline"
                          >
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Article Like / Dislike Feedback Reaction */}
            <ArticleReactions postId={postTrackingId} postTitle={currentTitle} />

            {/* Author / Editorial Desk Profile Card */}
            <AuthorCard post={post} />

            {/* Provocative Discussion Trigger Prompt */}
            <DiscussionTrigger prompt={post.discussionPrompt} postTitle={currentTitle} />

            {/* Genuine Reader Discussion Section */}
            <div id="comments-section">
              <CommentSection postId={postTrackingId} postTitle={currentTitle} />
            </div>

            <div className="mt-12 flex justify-center border-t border-border/80 dark:border-white/10 pt-8">
              <Button
                to={getLocalizedPath("/blog")}
                variant="secondary"
                size="lg"
                icon={<ArrowLeft size={16} />}
                iconPosition="left"
              >
                {t("backToBlogArchive", "BACK TO BLOG ARCHIVE")}
              </Button>
            </div>

            {/* Contextual Related Published Articles (Topic Cluster Internal Loop) */}
            <RelatedPosts currentPost={post} allPosts={allPosts} />
          </div>

          {/* Sticky Desktop Aside Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <TableOfContents body={activeBody} />
          </aside>
        </div>
      </article>

      {/* ── Global FAQ Section ── */}
      <GlobalFaqSection />

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
