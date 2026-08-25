import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { fetchSiteSettings, fetchBlogBySlug, fetchAllBlogs } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { BlogPost } from "../types/blog";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { trackArticleView } from "../services/articleStatsService";
import {
  getPublishedContributorArticleBySlug,
  slugifyAuthorName,
} from "../services/contributorService";

import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ReadingProgress from "./components/blog/ReadingProgress";
import BlogHero from "./components/blog/BlogHero";
import BlogContent from "./components/blog/BlogContent";
import TableOfContents from "./components/blog/TableOfContents";
import AuthorCard from "./components/blog/AuthorCard";
import ArticleReactions from "./components/blog/ArticleReactions";
import RelatedPosts from "./components/blog/RelatedPosts";
import CommentSection from "./components/CommentSection";
import { Button } from "./components/ui/Button";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, getLocalizedPath, language } = useLanguage();

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      getPublishedContributorArticleBySlug(cleanSlug),
    ])
      .then(([singlePost, postsList, contributorPost]) => {
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

        if (!foundPost && contributorPost) {
          foundPost = {
            _id: contributorPost.id,
            title: contributorPost.title,
            title_az: contributorPost.language === "az" ? contributorPost.title : undefined,
            slug: { current: contributorPost.slug },
            slug_az: contributorPost.language === "az" ? { current: contributorPost.slug } : undefined,
            excerpt: contributorPost.excerpt,
            excerpt_az: contributorPost.language === "az" ? contributorPost.excerpt : undefined,
            body: [
              {
                _type: "block",
                style: "normal",
                children: [{ _type: "span", text: contributorPost.content }],
              },
            ],
            publishDate: contributorPost.publishedAt || contributorPost.createdAt,
            readTime: contributorPost.readTime || "4 min read",
            category: contributorPost.category,
            category_az: contributorPost.category,
            tags: contributorPost.tags || [],
            coverImage: contributorPost.coverImageUrl ? { asset: { url: contributorPost.coverImageUrl } } : null,
            authorName: contributorPost.authorName,
            authorSlug: contributorPost.authorSlug || slugifyAuthorName(contributorPost.authorName),
            authorRole: contributorPost.authorRole || "Editorial Contributor",
            authorBio: contributorPost.authorBio,
            status: "published",
          };
        }

        if (foundPost) {
          setPost(foundPost);
          const trackingId = foundPost.slug?.current || foundPost._id || cleanSlug;
          trackArticleView(trackingId);
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ReadingProgress />

      <SEO
        title={`${post.title} — Ravan Mammadov`}
        description={post.excerpt || `Read ${post.title} by Ravan Mammadov.`}
        image={coverUrl}
        url={`https://www.rvan.me/blog/${post.slug?.current || slug}`}
        type="article"
        publishDate={post.publishDate}
      />

      <SiteHeader siteSettings={siteSettings} />

      <article className="mx-auto max-w-[1280px] px-4 pt-8 pb-20 sm:px-6 md:px-8 md:pt-12 md:pb-28">
        <BlogHero post={post} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Article Content Column */}
          <div className="lg:col-span-8 space-y-10 min-w-0">
            {/* Mobile Collapsible TOC */}
            <div className="lg:hidden">
              <TableOfContents body={post.body} isMobile />
            </div>

            <BlogContent post={post} />

            {/* Article Like / Dislike Feedback Reaction */}
            <ArticleReactions postId={postTrackingId} postTitle={post.title} />

            {/* Author Profile Card */}
            <AuthorCard post={post} />

            {/* Genuine Reader Discussion */}
            <CommentSection postId={postTrackingId} postTitle={post.title} />

            {/* Previous / Next Article Navigation */}
            {(prevPost || nextPost) && (
              <div className="mt-16 grid gap-6 sm:grid-cols-2 border-t border-border/80 dark:border-white/10 pt-12">
                {prevPost ? (
                  <Link
                    to={getLocalizedPath(`/blog/${prevPost.slug?.current || prevPost._id}`)}
                    className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card/80 dark:border-white/10 dark:bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card dark:hover:bg-white/10 hover:shadow-lg shadow-sm"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">
                      ← {t("previousArticle", "PREVIOUS ARTICLE")}
                    </span>
                    <p className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {prevPost.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost ? (
                  <Link
                    to={getLocalizedPath(`/blog/${nextPost.slug?.current || nextPost._id}`)}
                    className="group flex flex-col justify-between items-end rounded-2xl border border-border/80 bg-card/80 dark:border-white/10 dark:bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card dark:hover:bg-white/10 hover:shadow-lg shadow-sm text-right"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">
                      {t("nextArticle", "NEXT ARTICLE")} →
                    </span>
                    <p className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {nextPost.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}

            <div className="mt-10 flex justify-center border-t border-border/80 dark:border-white/10 pt-8">
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

            {/* Contextual Related Published Articles */}
            <RelatedPosts currentPost={post} allPosts={allPosts} />
          </div>

          {/* Sticky Desktop Aside Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <TableOfContents body={post.body} />
          </aside>
        </div>
      </article>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
