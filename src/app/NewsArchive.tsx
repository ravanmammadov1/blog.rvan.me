import { useEffect, useState, useMemo } from "react";
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
import { aggregateNewsFeeds, NormalizedResource } from "../lib/rssAggregator";
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
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
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
  const [newsFeeds, setNewsFeeds] = useState<NormalizedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNewsModal, setSelectedNewsModal] = useState<NormalizedResource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => { if (data) setSiteSettings(data); });

    // Load Sanity CMS news & RSS feeds & Curated baseline into single unified stream
    fetchNews()
      .then((cmsNews) => aggregateNewsFeeds(cmsNews || []))
      .then((items) => {
        setNewsFeeds(items || []);
      })
      .catch((err) => {
        console.error("Error fetching news feeds:", err);
        aggregateNewsFeeds([]).then(setNewsFeeds);
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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.sourceName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [newsFeeds, activeTab, searchQuery]);

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

      {/* Hero Header */}
      <section className="px-6 pt-20 pb-12 md:px-10 md:pt-28 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.05}>
            <p className="eyebrow text-primary mb-4 flex items-center gap-2">
              <Rss size={13} /> CREATIVE PUBLICATION PLATFORM · REAL-TIME RSS AGGREGATION
            </p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-5xl leading-[0.9]">
              Industry<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                News Hub.
              </span>
            </h1>
            <p className="mt-8 text-base text-muted-foreground max-w-2xl leading-relaxed">
              Real-time coverage across <span className="text-foreground font-medium">Design</span>, <span className="text-foreground font-medium">AI</span>, <span className="text-foreground font-medium">Frontend</span>, <span className="text-foreground font-medium">Marketing</span>, and <span className="text-foreground font-medium">Motion</span>. Aggregated automatically with accurate UTC publication dates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Tab Bar & Search */}
      <section className="sticky top-20 z-30 px-6 py-4 md:px-10 bg-background/80 backdrop-blur-xl border-y border-white/10">
        <div className="mx-auto max-w-[1600px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {NEWS_TABS.map((tab) => {
              const count = tabCounts[tab.key] || 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-primary text-black shadow-[0_0_16px_rgba(232,253,82,0.3)]"
                      : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {count > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      activeTab === tab.key ? "bg-black/20 text-black" : "bg-white/10 text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
            <input
              type="text"
              placeholder="Search news & articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground/45 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

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
                    className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 glass flex flex-col justify-between relative transition-all duration-300 hover:shadow-[0_0_25px_rgba(232,253,82,0.12)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold mono ${sourceBadgeClass}`}>
                          {item.sourceName}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 mono flex items-center gap-1">
                          <Clock size={11} /> {item.formattedDate}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {isInternal ? (
                          <Link to={item.link}>{item.title}</Link>
                        ) : (
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        )}
                      </h3>

                      <p className="mt-3 text-xs text-muted-foreground/80 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
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
