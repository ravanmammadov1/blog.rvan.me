import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, BookOpen } from "lucide-react";

import { useLanguage } from "../../lib/i18n/LanguageContext";
import { fetchAllBlogs, fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";
import { BlogPost } from "../../types/blog";
import { getTopicBySlug, TOPICS_CATALOG } from "../../lib/topicRegistry";
import BlogCard from "../components/blog/BlogCard";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { Button } from "../components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function TopicDetailPage() {
  const { topicSlug } = useParams();
  const { language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const topic = useMemo(() => {
    return getTopicBySlug(topicSlug || "") || null;
  }, [topicSlug]);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });

    fetchAllBlogs(language)
      .then((blogs) => {
        if (blogs) setAllPosts(blogs);
      })
      .catch((err) => {
        console.error("Error loading blog posts for topic:", err);
      })
      .finally(() => setLoading(false));
  }, [language, topicSlug]);

  // Filter ONLY genuinely published articles matching this topic
  const matchingArticles = useMemo(() => {
    if (!topic || allPosts.length === 0) return [];

    const targetSlug = topic.slug.toLowerCase();
    const targetTag = topic.tag.toLowerCase();
    const targetNameEn = topic.name.en.toLowerCase();
    const targetNameAz = topic.name.az.toLowerCase();

    return allPosts.filter((post) => {
      const cat = (post.category || "").toLowerCase();
      const tags = (post.tags || []).map((t) => t.toLowerCase());

      return (
        cat === targetSlug ||
        cat === targetTag ||
        cat === targetNameEn ||
        cat === targetNameAz ||
        tags.includes(targetSlug) ||
        tags.includes(targetTag) ||
        tags.includes(targetNameEn) ||
        tags.includes(targetNameAz)
      );
    });
  }, [topic, allPosts]);

  if (!topic) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <SiteHeader siteSettings={siteSettings} />
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <SEO title="Topic Not Found — Rvan.me" noIndex />
          <h1 className="text-3xl font-bold">{isAz ? "Mövzu Tapılmadı" : "Topic Not Found"}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {isAz
              ? "Axtardığınız mövzu mövcud deyil və ya ünvan dəyişdirilib."
              : "The requested topic could not be found."}
          </p>
          <div className="mt-8">
            <Button to={getLocalizedPath("/topics")} variant="secondary">
              {isAz ? "BÜTÜN MÖVZULARA BAX" : "VIEW ALL TOPICS"}
            </Button>
          </div>
        </div>
        <Footer siteSettings={siteSettings} />
      </main>
    );
  }

  const Icon = topic.icon;
  const topicName = isAz ? topic.name.az : topic.name.en;
  const topicDesc = isAz ? topic.description.az : topic.description.en;

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${topicName} — ${isAz ? "Mövzu İndeksi" : "Topic Index"} | Rvan.me`}
        description={topicDesc}
        url={`https://www.rvan.me/topics/${topic.slug}`}
      />

      <SiteHeader siteSettings={siteSettings} />

      <PageHero
        eyebrow={isAz ? `MÖVZU / ${topic.tag}` : `TOPIC / ${topic.tag}`}
        title={topicName}
        accentText="."
        gradientVariant="secondary"
        description={topicDesc}
      />

      <div className="mx-auto max-w-[1600px] px-6 py-12 md:px-10 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link
            to={getLocalizedPath("/topics")}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-muted-foreground hover:text-primary transition-colors mono"
          >
            <ArrowLeft size={14} />
            {isAz ? "BÜTÜN MÖVZULAR" : "ALL TOPICS"}
          </Link>

          <span className="text-xs font-bold tracking-wider mono uppercase text-primary border border-border rounded-md px-3 py-1 bg-card">
            {matchingArticles.length} {isAz ? "MƏQALƏ" : "ARTICLES"}
          </span>
        </div>

        {/* Article Grid / Authentic Empty State */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : matchingArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matchingArticles.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-3xl border border-border bg-card p-10 md:p-14 text-center max-w-2xl mx-auto shadow-sm"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary mb-5">
              <Icon size={26} />
            </div>

            <h3 className="text-xl font-bold text-foreground">
              {isAz ? "Bu mövzuda hələlik məqalə yoxdur" : "No articles published in this category yet"}
            </h3>

            <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
              {isAz
                ? "Redaksiyamız bu mövzu üzrə yeni dərin tədqiqat və məqalələr hazırlayır. Digər mövzuları araşdıra və ya müəllif kimi töhfə verə bilərsiniz."
                : "Our editorial board is currently preparing in-depth research essays for this vertical. Explore other published topics or apply to become a contributor."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button to={getLocalizedPath("/blog")} variant="primary" size="md">
                {isAz ? "BÜTÜN BLOQ YAZILARI" : "EXPLORE ALL ESSAYS"}
              </Button>
              <Button to={getLocalizedPath("/contributor/dashboard")} variant="secondary" size="md">
                {isAz ? "MÜƏLLİF KİMİ QOŞUL" : "BECOME A CONTRIBUTOR"}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Other Editorial Topics */}
        <div className="pt-16 border-t border-border">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">
              {isAz ? "Digər Mövzular" : "Other Editorial Topics"}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TOPICS_CATALOG.filter((t) => t.slug !== topic.slug).map((otherTopic) => {
              const OtherIcon = otherTopic.icon;
              return (
                <Link
                  key={otherTopic.id}
                  to={getLocalizedPath(`/topics/${otherTopic.slug}`)}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid h-9 w-9 place-items-center rounded-xl border ${otherTopic.accentColor}`}>
                      <OtherIcon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {isAz ? otherTopic.name.az : otherTopic.name.en}
                      </h4>
                      <span className="text-[10px] text-muted-foreground mono">
                        {otherTopic.tag}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
