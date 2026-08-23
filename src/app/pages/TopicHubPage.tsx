import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  ArrowRight,
  BookOpen,
  Wrench,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { getTopicBySlug, getAllTopicHubs } from "../../lib/topicHubs";
import { fetchAllBlogs, fetchSiteSettings } from "../../lib/sanityQueries";
import { BlogPost } from "../../types/blog";
import { SiteSettings } from "../../types/cms";
import BlogCard from "../components/blog/BlogCard";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useLanguage } from "../../lib/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export default function TopicHubPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const navigate = useNavigate();
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const topic = getTopicBySlug(topicSlug || "");
  const allHubs = getAllTopicHubs();

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });

    fetchAllBlogs(language)
      .then((data) => {
        if (data) setAllPosts(data);
      })
      .catch((err) => {
        console.error("Error fetching articles for topic hub:", err);
      })
      .finally(() => setLoading(false));
  }, [topicSlug, language]);

  const featuredPosts = useMemo(() => {
    if (!topic || allPosts.length === 0) return [];
    return allPosts.filter((p) => {
      const slugStr = (typeof p.slug === "string" ? p.slug : p.slug?.current || "").toLowerCase().trim();
      const origSlug = (p.originalSlug || "").toLowerCase().trim();
      const azSlug = (p.azSlug || p.slug_az?.current || "").toLowerCase().trim();
      const idStr = (p._id || "").toLowerCase().trim();

      return topic.featuredArticleSlugs.some((target) => {
        const t = target.toLowerCase().trim();
        return slugStr === t || origSlug === t || azSlug === t || idStr === t;
      });
    });
  }, [topic, allPosts]);

  if (!topic) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <SiteHeader siteSettings={siteSettings} />
        <div className="pt-40 pb-20 text-center px-6">
          <h1 className="text-3xl font-bold mb-4">{t("topicNotFound", "Topic Hub Not Found")}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {t("topicNotFoundDesc", "The requested design and marketing topic pillar does not exist.")}
          </p>
          <Link
            to={getLocalizedPath("/topics")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-black uppercase mono"
          >
            <ArrowLeft size={14} /> {t("browseAllTopics", "Browse All Topic Hubs")}
          </Link>
        </div>
        <Footer siteSettings={siteSettings} />
      </main>
    );
  }

  const otherHubs = allHubs.filter((h) => h.id !== topic.id);

  // Structured Data Schema (CollectionPage)
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": isAz ? topic.name_az : topic.name,
    "description": isAz ? topic.seoDescription_az : topic.seoDescription,
    "url": `https://www.rvan.me${isAz ? `/az/topics/${topic.slug}` : `/topics/${topic.slug}`}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": featuredPosts.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://www.rvan.me${isAz ? `/az/blog/${typeof p.slug === 'string' ? p.slug : p.slug?.current}` : `/blog/${typeof p.slug === 'string' ? p.slug : p.slug?.current}`}`,
        "name": p.title
      }))
    }
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={isAz ? topic.seoTitle_az : topic.seoTitle}
        description={isAz ? topic.seoDescription_az : topic.seoDescription}
        url={`https://www.rvan.me/topics/${topic.slug}`}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Aurora backdrop blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute"
          style={{
            top: "-10%",
            left: "15%",
            width: "70%",
            height: "60%",
            background: `radial-gradient(ellipse at 50% 50%, rgba(97,197,173,0.08) 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pt-36 pb-24 md:px-10 space-y-16">
        {/* 1. Breadcrumbs & Topic Hero */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="space-y-6 max-w-4xl"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mono">
            <Link to={getLocalizedPath("/")} className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to={getLocalizedPath("/topics")} className="hover:text-primary transition-colors">
              {isAz ? "Mövzular" : "Topic Hubs"}
            </Link>
            <span>/</span>
            <span className="text-foreground">{isAz ? topic.name_az : topic.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{topic.icon}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary mono">
              <Compass size={13} />
              {isAz ? "TOPİK HAB VƏ BİLMƏ BAZASI" : "TOPICAL ECOSYSTEM HUB"}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
            {isAz ? topic.name_az : topic.name}
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-foreground/90 leading-snug">
            {isAz ? topic.headline_az : topic.headline}
          </p>

          <p className="text-base text-muted-foreground leading-relaxed">
            {isAz ? topic.description_az : topic.description}
          </p>
        </motion.div>

        {/* 2. Key Scientific & Conceptual Principles */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mono border-b border-white/10 pb-3">
            <Layers size={14} />
            {isAz ? "MÖVZUNUN ƏSAS PRİNSİPLƏRİ" : "FOUNDATIONAL HEURISTIC PRINCIPLES"}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {topic.keyPrinciples.map((principle, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-xs font-mono font-bold text-primary">
                    0{idx + 1}
                  </span>
                  <CheckCircle2 size={16} className="text-primary/60" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {isAz ? principle.title_az : principle.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAz ? principle.description_az : principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>



        {/* 4. Curated Master Editorial Essays */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mono">
              <BookOpen size={14} />
              {isAz ? "KURASİYA EDİLMİŞ TƏDQİQAT MƏQALƏLƏRİ" : "CURATED RESEARCH ESSAYS"}
            </div>
            <Link
              to={getLocalizedPath("/blog")}
              className="text-xs text-primary hover:underline mono flex items-center gap-1"
            >
              <span>{isAz ? "Bütün məqalələr" : "View All 39 Essays"}</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* 5. Curated Domain Resources */}
        {topic.resourceSlugs.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mono">
                <Sparkles size={14} />
                {isAz ? "ƏLAQƏLİ RESURSLAR VƏ ŞRİFTLƏR" : "DOMAIN RESOURCES & SPECIMENS"}
              </div>
              <Link
                to={getLocalizedPath("/resources")}
                className="text-xs text-primary hover:underline mono flex items-center gap-1"
              >
                <span>{isAz ? "Bütün resurslar" : "Browse All Resources"}</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topic.resourceSlugs.map((res, idx) => (
                <Link
                  key={idx}
                  to={getLocalizedPath(res.path)}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.04] flex items-center justify-between group"
                >
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {isAz ? res.label_az : res.label}
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 6. Other Topic Hub Discovery Paths */}
        <div className="border-t border-white/10 pt-12 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mono">
            {isAz ? "DİGƏR TOPİK MƏRKƏZLƏRİ KƏŞF EDİN" : "EXPLORE OTHER TOPIC HUBS"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            {otherHubs.map((hub) => (
              <Link
                key={hub.id}
                to={getLocalizedPath(`/topics/${hub.slug}`)}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-primary hover:bg-white/[0.05] flex items-center gap-4 group"
              >
                <span className="text-2xl">{hub.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {isAz ? hub.name_az : hub.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {isAz ? hub.headline_az : hub.headline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
