import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rss,
  Clock,
  ExternalLink,
  Globe,
  Search,
  Sparkles,
  ArrowUpRight,
  Bookmark,
  Share2,
  Check,
  ChevronRight,
  TrendingUp,
  X,
} from "lucide-react";
import { fetchNews, fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings, NewsItem } from "../types/cms";
import { useProgressiveRendering } from "./hooks/useProgressiveRendering";
import PageHero from "./components/PageHero";
import PageFilterBar from "./components/PageFilterBar";
import { fetchCuratedNewsEngine, CuratedArticle } from "../lib/newsEngine";
import { aggregateNewsFeeds, NormalizedResource, getCachedNewsFeeds, setCachedNewsFeeds, cleanPublisherUrl } from "../lib/rssAggregator";
import { generateNewsSummary, getArticleCoverImage } from "../lib/contentEngine";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useLanguage } from "../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
      transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export const NEWS_TABS = [
  { key: "all", label: "All News", icon: "🌐" },
  { key: "designNews", label: "Design", icon: "🎨" },
  { key: "aiNews", label: "AI & ML", icon: "🤖" },
  { key: "marketingNews", label: "Marketing", icon: "📈" },
  { key: "frontendNews", label: "Frontend", icon: "💻" },
  { key: "motionNews", label: "Motion", icon: "🎬" },
];

export const SOURCE_COLORS: Record<string, string> = {
  "Smashing Magazine": "text-orange-400 border-orange-400/30 bg-orange-400/10",
  "UX Collective": "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  "Hugging Face": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  "The Verge": "text-purple-400 border-purple-400/30 bg-purple-400/10",
  "React Blog": "text-sky-400 border-sky-400/30 bg-sky-400/10",
  "Vercel": "text-white border-white/30 bg-white/10",
  "Dev.to": "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  "Hacker News": "text-amber-500 border-amber-500/30 bg-amber-500/10",
  "HubSpot": "text-rose-400 border-rose-400/30 bg-rose-400/10",
  "School of Motion": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "Rvan Studio": "text-primary border-primary/30 bg-primary/10",
};

export default function NewsArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [newsFeeds, setNewsFeeds] = useState<NormalizedResource[]>(() => getCachedNewsFeeds());
  const [loading, setLoading] = useState<boolean>(() => newsFeeds.length === 0);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedNewsModal, setSelectedNewsModal] = useState<NormalizedResource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { t, getLocalizedPath, language } = useLanguage();

  const tabLabels: Record<string, string> = {
    all: t("allNews", "All News"),
    designNews: t("designNews", "Design"),
    aiNews: t("aiNews", "AI & ML"),
    marketingNews: t("marketingNews", "Marketing"),
    frontendNews: t("frontendNews", "Frontend"),
    motionNews: t("motionNews", "Motion"),
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => { if (data) setSiteSettings(data); });

    // Background revalidation of Sanity CMS news & RSS feeds with News Engine scoring
    fetchNews()
      .then((cmsNews) => fetchCuratedNewsEngine(cmsNews || []))
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          setNewsFeeds(items);
          setCachedNewsFeeds(items);
        }
      })
      .catch((err) => {
        console.error("Error fetching news feeds:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFeeds = useMemo(() => {
    let result = newsFeeds;
    if (activeTab !== "all") {
      result = result.filter((r) => r.category === activeTab);
    }
    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.sourceName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [newsFeeds, activeTab, deferredSearch]);

  const {
    visibleItems: visibleFeeds,
    hasMore,
    remainingCount,
    loadMore,
    isLoadingMore,
  } = useProgressiveRendering(filteredFeeds, {
    initialBatchSize: 6,
    stepBatchSize: 6,
    resetDependencies: [activeTab, deferredSearch],
  });

  const tabCounts: Record<string, number> = useMemo(() => ({
    all: newsFeeds.length,
    designNews: newsFeeds.filter((r) => r.category === "designNews").length,
    aiNews: newsFeeds.filter((r) => r.category === "aiNews").length,
    frontendNews: newsFeeds.filter((r) => r.category === "frontendNews").length,
    devNews: newsFeeds.filter((r) => r.category === "devNews").length,
    marketingNews: newsFeeds.filter((r) => r.category === "marketingNews").length,
    motionNews: newsFeeds.filter((r) => r.category === "motionNews").length,
    announcements: newsFeeds.filter((r) => r.category === "announcements").length,
  }), [newsFeeds]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${t("newsArchiveTitle", "Industry News & Technical Insights")} — Rvan.me`}
        description={t("newsArchiveSubtitle", "Real-time coverage across Design, AI, Frontend, Dev, Marketing, and Motion. Unified real-time feed.")}
        url="https://www.rvan.me/news"
      />

      {/* Aurora Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35">
        <div
          className="absolute -top-[30%] left-[20%] h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.03) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Unified Page Hero */}
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-primary mono uppercase">
            <Rss size={13} /> {t("rssEyebrow", "CREATIVE PUBLICATION PLATFORM · REAL-TIME RSS AGGREGATION")}
          </span>
        }
        title={t("newsHeroTitle", "Industry")}
        accentText={t("newsHeroAccent", "News Hub.")}
        gradientVariant="accent"
        description={t("newsHeroDesc", "Real-time coverage across Design, AI, Frontend, Marketing, and Motion. Aggregated automatically with accurate UTC publication dates.")}
      />

      {/* Master Page Filter Bar & Search */}
      <PageFilterBar
        categories={NEWS_TABS.filter((tab) => tab.key === "all" || (tabCounts[tab.key] || 0) > 0).map((tab) => ({
          key: tab.key,
          label: tabLabels[tab.key] || tab.label,
          icon: tab.icon,
        }))}
        activeCategory={activeTab}
        onSelectCategory={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("searchNews", "Search news & articles...")}
        searchId="news-search"
      />

      {/* Main News Stream Grid */}
      <section className="px-6 pb-28 md:px-10 relative z-10 pt-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rss size={16} className="text-primary" />
              <h2 className="text-sm font-bold tracking-[.15em] text-primary uppercase mono">
                {activeTab === "all" ? t("liveIndustryStream", "Live Industry Stream") : (tabLabels[activeTab] || NEWS_TABS.find(t => t.key === activeTab)?.label)}
              </h2>
              {!loading && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {filteredFeeds.length} {t("articles", "articles")}
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, n) => (
                <div key={n} className="h-64 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
              ))}
            </div>
          ) : filteredFeeds.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center glass">
              <Rss size={32} className="text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">{t("noArticlesFound", "No articles found for this search or category.")}</p>
              <button
                onClick={() => { setActiveTab("all"); setSearchQuery(""); }}
                className="mt-4 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white transition-colors"
              >
                {t("showAllNews", "SHOW ALL NEWS")}
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleFeeds.map((item, idx) => {
                  const sourceBadgeClass = SOURCE_COLORS[item.sourceName] || "text-primary border-primary/30 bg-primary/10";
                  const rawSlug = item.slug || item.id || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const detailPath = getLocalizedPath(`/news/${rawSlug}`);
                  const publisherUrl = cleanPublisherUrl(item.link);

                  return (
                    <motion.article
                      key={item.id || idx}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.05 }}
                      custom={idx * 0.04}
                      className="group rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 glass p-5 flex flex-col justify-between relative transition-all duration-300 hover:shadow-[0_0_25px_rgba(232,253,82,0.12)] overflow-hidden"
                    >
                      <div>
                        {/* Cover Image (Matches BlogCard exact h-48 height, rounded-xl border) */}
                        <div className="mb-4 h-48 w-full overflow-hidden rounded-xl border border-white/10 relative bg-neutral-900/80 flex-shrink-0">
                          <img
                            src={item.imageUrl || item.logoUrl || getArticleCoverImage(item.category, item.title)}
                            alt={item.title}
                            width={800}
                            height={520}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(item.category, item.title);
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Card Content */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold mono ${sourceBadgeClass}`}>
                              {item.sourceName}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 mono flex items-center gap-1">
                              <Clock size={11} /> {item.formattedDate}
                            </span>
                          </div>

                          <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            <Link to={detailPath}>{item.title}</Link>
                          </h3>

                          <p className="mt-2 text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedNewsModal(item)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-white transition-colors mono uppercase tracking-wider"
                          >
                            <Sparkles size={12} /> {t("aiSummaryBtn", "AI SUMMARY")}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyLink(window.location.origin + detailPath, item.id)}
                              className="rounded-full p-1.5 border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground transition-colors glass-sm"
                              title="Copy Link"
                            >
                              {copiedId === item.id ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
                            </button>

                            <Link
                              to={detailPath}
                              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-foreground hover:bg-primary hover:text-black transition-all"
                            >
                              {t("read", "READ")} <ArrowUpRight size={12} />
                            </Link>

                            {publisherUrl.startsWith("http") && (
                              <a
                                href={publisherUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all"
                                title="Visit original publisher website"
                              >
                                {t("visit", "VISIT")} <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Load More Pagination */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.15em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black glass-sm disabled:opacity-50"
                  >
                    {isLoadingMore ? t("loadingBatch", "LOADING BATCH...") : `${t("loadMoreArticles", "LOAD MORE ARTICLES")} (${remainingCount} ${t("remaining", "REMAINING")})`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* AI Structured Summary Modal */}
      {selectedNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/15 bg-background/95 p-6 shadow-2xl glass">
            <button
              onClick={() => setSelectedNewsModal(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase mb-2">
              <Sparkles size={14} /> {t("aiStructuredSummary", "AI Structured Analytical Summary")}
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              {selectedNewsModal.title}
            </h2>

            {(() => {
              const summary = generateNewsSummary(selectedNewsModal.title, selectedNewsModal.description, selectedNewsModal.sourceName, language);
              return (
                <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-1">📌 {t("modalOverview", "Overview")}</h4>
                    <p>{summary.overview}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-1">🚀 {t("modalWhatsNew", "What's New")}</h4>
                    <p>{summary.whatsNew}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-2">⚡ {t("modalKeyFeatures", "Key Features")}</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {summary.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-1">💡 {t("modalImpact", "Industry Impact & Why It Matters")}</h4>
                    <p>{summary.industryImpact}</p>
                    <p className="mt-2">{summary.whyItMatters}</p>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-primary font-medium">
                    <h4 className="font-bold uppercase mono text-[11px] mb-2 text-primary">{t("modalKeyTakeaways", "Key Takeaways")}</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {summary.keyTakeaways.map((tItem, i) => <li key={i}>{tItem}</li>)}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] mono text-muted-foreground">{t("publisher", "Publisher")}: {selectedNewsModal.sourceName}</span>
                    <a
                      href={selectedNewsModal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-colors"
                    >
                      {t("readFullOriginal", "READ FULL ORIGINAL ARTICLE")} <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
