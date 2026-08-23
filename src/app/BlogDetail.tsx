import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUp } from "lucide-react";

import { client, urlFor } from "../lib/sanityClient";
import { fetchSiteSettings, fetchBlogBySlug, fetchAllBlogs } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { BlogPost } from "../types/blog";
import { useLanguage } from "../lib/i18n/LanguageContext";

import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ReadingProgress from "./components/blog/ReadingProgress";
import BlogHero from "./components/blog/BlogHero";
import BlogContent from "./components/blog/BlogContent";
import TableOfContents from "./components/blog/TableOfContents";
import ShareButtons from "./components/blog/ShareButtons";
import AuthorCard from "./components/blog/AuthorCard";
import RelatedPosts from "./components/blog/RelatedPosts";
import EcosystemBridgeCard from "./components/blog/EcosystemBridgeCard";
import { getEcosystemRelationship } from "../lib/ecosystemRelationshipMap";
import { Button } from "./components/ui/Button";
import ReportArticleModal from "./components/blog/ReportArticleModal";
import { trackArticleView } from "../services/contributorService";

import CommentSection from "./components/CommentSection";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, getLocalizedPath, language } = useLanguage();

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

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

    const cleanSlug = decodeURIComponent(slug).replace(/^\/?(az\/)?blog\//, "").replace(/^\//, "").replace(/\/+$/, "").trim().toLowerCase();

    Promise.all([fetchBlogBySlug(slug, language), fetchAllBlogs(language)])
      .then(([singlePost, postsList]) => {
        let foundPost = singlePost;

        if (!foundPost && postsList && postsList.length > 0) {
          foundPost = postsList.find((p) => {
            const pSlug = (typeof p.slug === "string" ? p.slug : p.slug?.current || p._id || "").toLowerCase().replace(/\/+$/, "");
            const pOrigSlug = (p.originalSlug || "").toLowerCase();
            const pAzSlug = (p.azSlug || "").toLowerCase();
            return pSlug === cleanSlug || pOrigSlug === cleanSlug || pAzSlug === cleanSlug || (p._id && p._id.toLowerCase() === cleanSlug);
          }) || null;
        }

        if (foundPost) {
          setPost(foundPost);
          const effectiveSlug = foundPost.slug?.current || cleanSlug;
          trackArticleView(effectiveSlug, foundPost.title, foundPost.authorName);
        } else {
          setError("Blog post not found");
        }

        if (postsList) {
          setAllPosts(postsList);
        }
      })
      .catch((err) => {
        console.error("Error loading blog detail:", err);
        setError("Failed to load article");
      })
      .finally(() => setLoading(false));
  }, [slug, language]);

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
        <SEO title={`${t("articleNotFound", "Article Not Found")} — Ravan Mammadov`} noIndex />
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t("articleNotFound", "Article Not Found")}</h1>
          <p className="mt-4 text-muted-foreground">
            {error || t("articleNotFoundDesc", "The requested blog post could not be found.")}
          </p>
          <Link
            to={getLocalizedPath("/blog")}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur-xl transition hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            {t("backToBlogArchive", "Back to Blog Archive")}
          </Link>
        </div>
      </main>
    );
  }

  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder ? imgBuilder.width(1200).url() : undefined;

  const currentIndex = allPosts.findIndex(
    (p) => (p.slug?.current || p._id) === (post.slug?.current || post._id)
  );
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  const postSlug = (post.slug?.current || post.originalSlug || post._id || "").toLowerCase();
  const relationship = getEcosystemRelationship(postSlug);
  const isAz = language === "az";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title={post.seo?.metaTitle || `${post.title} — Rvan.me`}
        description={post.seo?.metaDescription || post.excerpt || `Read ${post.title} on Rvan.me.`}
        image={post.seo?.ogImage ? (urlFor(post.seo.ogImage)?.width(1200).url() || coverUrl) : coverUrl}
        url={post.seo?.canonicalUrl || `https://www.rvan.me/blog/${post.slug?.current || slug}`}
        type="article"
        publishDate={post.publishDate}
        noIndex={post.seo?.noIndex}
      />

      <SiteHeader siteSettings={siteSettings} />

      <article className="mx-auto max-w-[1400px] px-6 pt-24 pb-28 md:px-10">
        <BlogHero post={post} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Article Content Column */}
          <div className="lg:col-span-8 space-y-12 min-w-0">
            {/* Mobile Collapsible TOC */}
            <div className="lg:hidden">
              <TableOfContents body={post.body} isMobile />
            </div>

            <BlogContent post={post} />

            {/* Contextual Ecosystem Bridge: Interactive Tool Recommendation */}
            {relationship?.toolBridge && (
              <EcosystemBridgeCard
                type={relationship.toolBridge.type}
                href={relationship.toolBridge.path}
                badge={isAz ? relationship.toolBridge.badge?.az : relationship.toolBridge.badge?.en}
                title={isAz ? relationship.toolBridge.title.az : relationship.toolBridge.title.en}
                description={isAz ? relationship.toolBridge.description.az : relationship.toolBridge.description.en}
                ctaText={isAz ? relationship.toolBridge.ctaText?.az : relationship.toolBridge.ctaText?.en}
                topic={isAz ? relationship.primaryTopic.az : relationship.primaryTopic.en}
              />
            )}

            {/* Contextual Ecosystem Bridge: Curated Resource Recommendation */}
            {relationship?.resourceBridge && (
              <EcosystemBridgeCard
                type={relationship.resourceBridge.type}
                href={relationship.resourceBridge.path}
                badge={isAz ? relationship.resourceBridge.badge?.az : relationship.resourceBridge.badge?.en}
                title={isAz ? relationship.resourceBridge.title.az : relationship.resourceBridge.title.en}
                description={isAz ? relationship.resourceBridge.description.az : relationship.resourceBridge.description.en}
                ctaText={isAz ? relationship.resourceBridge.ctaText?.az : relationship.resourceBridge.ctaText?.en}
                topic={isAz ? relationship.primaryTopic.az : relationship.primaryTopic.en}
              />
            )}

            <ShareButtons
              title={post.title}
              articleSlug={post.slug?.current || slug}
              onReport={() => setReportModalOpen(true)}
            />

            <AuthorCard post={post} />

            <CommentSection postId={post.slug?.current || post._id} postTitle={post.title} />

            {(prevPost || nextPost) && (
              <div className="mt-16 grid gap-6 sm:grid-cols-2 border-t border-white/10 pt-12">
                {prevPost ? (
                  <Link
                    to={getLocalizedPath(`/blog/${prevPost.slug?.current || prevPost._id}`)}
                    className="group flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-6 glass transition-all duration-300 hover:border-primary/50 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">← {t("previousArticle", "PREVIOUS ARTICLE")}</span>
                    <p className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{prevPost.title}</p>
                  </Link>
                ) : <div />}

                {nextPost ? (
                  <Link
                    to={getLocalizedPath(`/blog/${nextPost.slug?.current || nextPost._id}`)}
                    className="group flex flex-col justify-between items-end rounded-xl border border-white/10 bg-white/5 p-6 glass transition-all duration-300 hover:border-primary/50 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5 text-right"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">{t("nextArticle", "NEXT ARTICLE")} →</span>
                    <p className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{nextPost.title}</p>
                  </Link>
                ) : <div />}
              </div>
            )}

            <div className="mt-10 flex justify-center border-t border-white/10 pt-8">
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

            {/* Contextual Related Posts via Semantic Topic Graph */}
            <RelatedPosts
              currentPost={post}
              allPosts={allPosts}
            />
          </div>

          {/* Sticky Desktop Aside Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <TableOfContents body={post.body} />
          </aside>
        </div>
      </article>

      <Footer siteSettings={siteSettings} />

      <ReportArticleModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        articleId={post._id || post.slug?.current || "article"}
        articleTitle={post.title}
        authorName={post.authorName}
      />

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
