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
import PageHero from "./components/PageHero";
import PageFilterBar from "./components/PageFilterBar";
import { aggregateNewsFeeds, NormalizedResource, getCachedNewsFeeds, setCachedNewsFeeds } from "../lib/rssAggregator";
import { generateNewsSummary } from "../lib/contentEngine";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

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
  { key: "frontendNews", label: "Frontend", icon: "💻" },
  { key: "devNews", label: "Development", icon: "⚙️" },
  { key: "marketingNews", label: "Marketing", icon: "📈" },
  { key: "motionNews", label: "Motion 3D", icon: "🎬" },
  { key: "announcements", label: "Announcements", icon: "📣" },
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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => { if (data) setSiteSettings(data); });

    // Non-blocking background revalidation of Sanity CMS news & RSS feeds
    fetchNews()
      .then((cmsNews) => aggregateNewsFeeds(cmsNews || []))
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
        title="Industry News & Technical Insights — Rvan.me"
        description="Real-time coverage across Design, AI, Frontend, Dev, Marketing, and Motion. Unified real-time feed."
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
            <Rss size={13} /> CREATIVE PUBLICATION PLATFORM · REAL-TIME RSS AGGREGATION
          </span>
        }
        title="Industry"
        accentText="News Hub."
        gradientVariant="accent"
        description={
          <>
            Real-time coverage across <span className="text-foreground font-medium">Design</span>, <span className="text-foreground font-medium">AI</span>, <span className="text-foreground font-medium">Frontend</span>, <span className="text-foreground font-medium">Marketing</span>, and <span className="text-foreground font-medium">Motion</span>. Aggregated automatically with accurate UTC publication dates.
          </>
        }
      />

      {/* Master Page Filter Bar & Search */}
      <PageFilterBar
        categories={NEWS_TABS.filter((tab) => tab.key === "all" || (tabCounts[tab.key] || 0) > 0).map((tab) => ({
          key: tab.key,
          label: tab.label,
          icon: tab.icon,
        }))}
        activeCategory={activeTab}
        onSelectCategory={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search news & articles..."
        searchId="news-search"
      />

      {/* Main News Stream Grid */}
      <section className="px-6 pb-28 md:px-10 relative z-10 pt-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rss size={16} className="text-primary" />
              <h2 className="text-sm font-bold tracking-[.15em] text-primary uppercase mono">
                {activeTab === "all" ? "Live Industry Stream" : NEWS_TABS.find(t => t.key === activeTab)?.label}
              </h2>
              {!loading && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {filteredFeeds.length} articles
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
              <p className="text-muted-foreground">No articles found for this search or category.</p>
              <button
                onClick={() => { setActiveTab("all"); setSearchQuery(""); }}
                className="mt-4 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white transition-colors"
              >
                SHOW ALL NEWS
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFeeds.map((item, idx) => {
                const sourceBadgeClass = SOURCE_COLORS[item.sourceName] || "text-primary border-primary/30 bg-primary/10";
                const isInternal = item.link.startsWith("/news/");

                return (
                  <motion.article
                    key={item.id || idx}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.05 }}
                    custom={idx * 0.04}
                    className="group rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 glass flex flex-col justify-between relative transition-all duration-300 hover:shadow-[0_0_25px_rgba(232,253,82,0.12)] overflow-hidden"
                  >
                    <div>
                      {/* Featured Cover Image / Branded Placeholder (16:9, ~105px height) */}
                      <div className="relative w-full h-[105px] overflow-hidden bg-black/60 border-b border-white/10 flex-shrink-0">
                        {item.imageUrl || item.logoUrl ? (
                          <img
                            src={item.imageUrl || item.logoUrl}
                            alt={item.title}
                            width={1200}
                            height={800}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="relative w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex items-center justify-center overflow-hidden">
                            <div
                              className="absolute inset-0 opacity-25"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle at 20% 30%, rgba(16,185,129,0.35) 0%, transparent 65%), radial-gradient(circle at 80% 70%, rgba(6,182,212,0.25) 0%, transparent 65%)",
                              }}
                            />
                            <div className="relative z-10 flex items-center gap-2 px-4 text-center">
                              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-primary/80">
                                <Rss size={14} />
                              </div>
                              <span className="text-[10px] font-bold tracking-widest text-muted-foreground/80 mono uppercase line-clamp-1">
                                {item.sourceName || "Industry News"}
                              </span>
                            </div>
                          </div>
                        )}
                        {/* Subtle 10-20% dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold mono ${sourceBadgeClass}`}>
                            {item.sourceName}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60 mono flex items-center gap-1">
                            <Clock size={11} /> {item.formattedDate}
                          </span>
                        </div>

                        <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {isInternal ? (
                            <Link to={item.link}>{item.title}</Link>
                          ) : (
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              {item.title}
                            </a>
                          )}
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
                          <Sparkles size={12} /> AI SUMMARY
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(item.link.startsWith("http") ? item.link : window.location.origin + item.link, item.id)}
                            className="rounded-full p-1.5 border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground transition-colors glass-sm"
                            title="Copy Link"
                          >
                            {copiedId === item.id ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
                          </button>

                          {isInternal ? (
                            <Link
                              to={item.link}
                              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-foreground hover:bg-primary hover:text-black transition-all"
                            >
                              READ <ArrowUpRight size={12} />
                            </Link>
                          ) : (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-foreground hover:bg-primary hover:text-black transition-all"
                            >
                              VISIT <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
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
              <Sparkles size={14} /> AI Structured Analytical Summary
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              {selectedNewsModal.title}
            </h2>

            {(() => {
              const summary = generateNewsSummary(selectedNewsModal.title, selectedNewsModal.description, selectedNewsModal.sourceName);
              return (
                <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-1">📌 Overview</h4>
                    <p>{summary.overview}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-1">🚀 What's New</h4>
                    <p>{summary.whatsNew}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-2">⚡ Key Features</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {summary.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground uppercase mono text-[11px] mb-1">💡 Industry Impact & Why It Matters</h4>
                    <p>{summary.industryImpact}</p>
                    <p className="mt-2">{summary.whyItMatters}</p>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-primary font-medium">
                    <h4 className="font-bold uppercase mono text-[11px] mb-2 text-primary">Key Takeaways</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {summary.keyTakeaways.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] mono text-muted-foreground">Publisher: {selectedNewsModal.sourceName}</span>
                    <a
                      href={selectedNewsModal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-colors"
                    >
                      READ FULL ORIGINAL ARTICLE <ExternalLink size={12} />
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
