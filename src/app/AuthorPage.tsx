import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserCheck,
  CheckCircle2,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Share2,
  Check,
  ArrowUpRight,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import SEO from "./components/SEO";
import BlogCard from "./components/blog/BlogCard";
import { Eyebrow } from "./components/Eyebrow";
import { Button } from "./components/ui/Button";
import { useLanguage } from "../lib/i18n/LanguageContext";
import {
  fetchAuthorBySlug,
  fetchArticlesByAuthor,
  fetchSiteSettings,
  AuthorDocument,
} from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { BlogPost } from "../types/blog";
import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function AuthorPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";

  const [author, setAuthor] = useState<AuthorDocument | null>(null);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([
      fetchAuthorBySlug(slug, language),
      fetchArticlesByAuthor(slug, language),
    ])
      .then(([authorData, articlesData]) => {
        setAuthor(authorData);
        setArticles(articlesData || []);
      })
      .finally(() => setLoading(false));
  }, [slug, language]);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const authorPhotoUrl = author?.image
    ? urlFor(author.image)?.url() || RavanPortrait1200
    : RavanPortrait1200;

  const authorName = author?.name || (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Author");
  const authorRole = author?.role || (isAz ? "Kreativ Mütəxəssis və Müəllif" : "Creative Contributor");
  const authorBio = author?.bio || (isAz ? "Rvan.me-də dərc olunan müəllif." : "Contributor on Rvan.me.");

  return (
    <div className="relative min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${authorName} — Rvan.me ${isAz ? "Müəllifi" : "Author"}`}
        description={`${authorName} (${authorRole}) — ${authorBio.substring(0, 150)}`}
        url={`https://www.rvan.me/author/${slug || "author"}`}
      />

      <SiteHeader siteSettings={siteSettings} />

      <main className="relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          {/* Back to Blog link */}
          <div className="mb-8">
            <Link
              to={getLocalizedPath("/blog")}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={13} />
              <span>{isAz ? "Bütün Məqalələr" : "All Articles"}</span>
            </Link>
          </div>

          {/* 1. AUTHOR PROFILE HERO CARD */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="p-8 md:p-12 rounded-3xl border border-border bg-card shadow-sm mb-16"
          >
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Left Photo & Verification */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-4">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl overflow-hidden border-2 border-primary/40 bg-surface shrink-0 shadow-md">
                  <img
                    src={authorPhotoUrl}
                    alt={authorName}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                {author?.isVerified && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mono uppercase tracking-wider">
                    <CheckCircle2 size={13} />
                    <span>{isAz ? "TƏSDİQLƏNMİŞ MÜƏLLİF" : "VERIFIED AUTHOR"}</span>
                  </div>
                )}
              </div>

              {/* Right Details & Bio */}
              <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
                <div>
                  <div className="text-xs font-bold font-mono text-primary uppercase tracking-[.18em] mb-1">
                    {isAz ? "MÜƏLLİF PROFİLİ" : "AUTHOR PROFILE"}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                    {authorName}
                  </h1>
                  <p className="text-sm md:text-base font-medium text-muted-foreground mt-1">
                    {authorRole}
                  </p>
                </div>

                <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-normal max-w-2xl">
                  {authorBio}
                </p>

                {/* Social Links & Share Row */}
                <div className="pt-3 border-t border-border flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {author?.socialLinks?.website && (
                    <a
                      href={author.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      title="Website"
                    >
                      <Globe size={16} />
                    </a>
                  )}
                  {author?.socialLinks?.linkedin && (
                    <a
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {author?.socialLinks?.twitter && (
                    <a
                      href={author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      title="X / Twitter"
                    >
                      <Twitter size={16} />
                    </a>
                  )}
                  {author?.socialLinks?.github && (
                    <a
                      href={author.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      title="GitHub"
                    >
                      <Github size={16} />
                    </a>
                  )}

                  {/* Share Profile button */}
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface text-xs font-bold mono uppercase text-muted-foreground hover:text-foreground hover:border-primary transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
                    <span>{copied ? (isAz ? "KOPYALANDI" : "COPIED") : (isAz ? "PROFİLİ PAYLAŞ" : "SHARE PROFILE")}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. ARTICLES BY THIS AUTHOR */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-4 gap-4">
              <div>
                <Eyebrow className="text-primary tracking-[.2em]">
                  {isAz ? "NƏŞRLƏR" : "PUBLICATIONS"}
                </Eyebrow>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {isAz ? `${authorName} tərəfindən yazılan məqalələr` : `Articles by ${authorName}`}
                </h2>
              </div>

              <div className="text-xs font-mono text-muted-foreground">
                <strong className="text-foreground">{articles.length}</strong> {isAz ? "məqalə nəşr olunub" : "published articles"}
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 rounded-2xl bg-muted/40 border border-border animate-pulse" />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((post) => (
                  <BlogCard key={post._id || post.slug?.current} post={post} />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-2xl border border-border bg-card text-center space-y-4">
                <BookOpen size={32} className="mx-auto text-muted-foreground" />
                <h3 className="text-lg font-bold text-foreground">
                  {isAz ? "Hələlik heç bir məqalə tapılmadı" : "No published articles yet"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  {isAz
                    ? "Bu müəllifin ilk məqaləsi tezliklə Rvan.me-də yayımlanacaq."
                    : "Articles from this contributor are currently in editorial review or preparation."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer siteSettings={siteSettings} />
    </div>
  );
}
