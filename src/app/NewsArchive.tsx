import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Search, X, Rss, ExternalLink, Calendar, Newspaper, Cpu, TrendingUp, Megaphone, Code, Layers, Sparkles, Share2, Copy, Check } from "lucide-react";

import { fetchNews, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { NewsItem, SiteSettings } from "../types/cms";
import { aggregateNewsFeeds, NormalizedResource } from "../lib/rssAggregator";
import { formatPublicationTimestamp, generateNewsSummary } from "../lib/contentEngine";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

const fallbackNewsList: NewsItem[] = [
  {
    _id: "fn1",
    title: "Ravan Mammadov Launches Redesigned Portfolio & CMS System",
    slug: { current: "portfolio-cms-system-launch" },
    category: "Milestone",
    excerpt: "Unveiling a new agency-quality portfolio website powered by Vite, React, and Sanity Studio CMS.",
    publishedAt: "2025-07-01T12:00:00Z",
  },
  {
    _id: "fn2",
    title: "New Motion Design & Brand Systems Case Study Published",
    slug: { current: "motion-design-case-study-release" },
    category: "Project Launch",
    excerpt: "Exploring the brand motion system and creative execution for automotive and tech campaigns.",
    publishedAt: "2025-06-20T12:00:00Z",
  },
];

// Industry news tabs config
const NEWS_TABS = [
  { key: "all", label: "All News", icon: Newspaper },
  { key: "designNews", label: "Design", icon: TrendingUp },
  { key: "aiNews", label: "AI & ML", icon: Cpu },
  { key: "frontendNews", label: "Frontend", icon: Code },
  { key: "devNews", label: "Development", icon: Layers },
  { key: "marketingNews", label: "Marketing", icon: TrendingUp },
  { key: "motionNews", label: "Motion 3D", icon: Sparkles },
  { key: "announcements", label: "Announcements", icon: Megaphone },
] as const;

type NewsTab = typeof NEWS_TABS[number]["key"];

const SOURCE_COLORS: Record<string, string> = {
  "Smashing Magazine": "text-[#e96228]",
  "UX Collective": "text-blue-400",
  "Creative Bloq": "text-purple-400",
  "Abduzeedo": "text-cyan-400",
  "Codrops": "text-pink-400",
  "Hugging Face": "text-yellow-400",
  "The Verge": "text-red-400",
  "MIT Tech Review": "text-blue-300",
  "VentureBeat": "text-emerald-400",
  "HubSpot": "text-orange-400",
  "React Blog": "text-cyan-400",
  "Vercel": "text-white",
  "Dev.to": "text-indigo-400",
  "Hacker News": "text-amber-400",
};

export default function NewsArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [announcements, setAnnouncements] = useState<NewsItem[]>([]);
  const [industryFeeds, setIndustryFeeds] = useState<NormalizedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedsLoading, setFeedsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NewsTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedNewsModal, setSelectedNewsModal] = useState<NormalizedResource | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => { if (data) setSiteSettings(data); });

    fetchNews()
      .then((data) => setAnnouncements(data && data.length > 0 ? data : fallbackNewsList))
      .catch(() => setAnnouncements(fallbackNewsList))
      .finally(() => setLoading(false));

    // Load live industry news RSS feeds across expanded categories
    aggregateNewsFeeds()
      .then((items) => setIndustryFeeds(items))
      .catch((err) => console.error("Error fetching industry news feeds:", err))
      .finally(() => setFeedsLoading(false));
  }, []);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFeeds = useMemo(() => {
    let result = industryFeeds;
    if (activeTab !== "all" && activeTab !== "announcements") {
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
  }, [industryFeeds, activeTab, searchQuery]);

  const filteredAnnouncements = useMemo(() => {
    if (activeTab !== "all" && activeTab !== "announcements") return [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return announcements.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.excerpt?.toLowerCase().includes(q) ||
          n.category?.toLowerCase().includes(q)
      );
    }
    return announcements;
  }, [announcements, activeTab, searchQuery]);

  const showingFeeds = activeTab !== "announcements";
  const showingAnnouncements = activeTab === "all" || activeTab === "announcements";

  const tabCounts: Record<string, number> = useMemo(() => ({
    all: industryFeeds.length + announcements.length,
    designNews: industryFeeds.filter((r) => r.category === "designNews").length,
    aiNews: industryFeeds.filter((r) => r.category === "aiNews").length,
    frontendNews: industryFeeds.filter((r) => r.category === "frontendNews").length,
    devNews: industryFeeds.filter((r) => r.category === "devNews").length,
    marketingNews: industryFeeds.filter((r) => r.category === "marketingNews").length,
    motionNews: industryFeeds.filter((r) => r.category === "motionNews").length,
    announcements: announcements.length,
  }), [industryFeeds, announcements]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Industry News — Design, AI, Frontend & Dev — Rvan.me"
        description="Stay current with real-time news across Design, AI, Frontend, Dev, Marketing, and Motion. Real-time RSS & API aggregation from 40+ trusted sources."
        url="https://www.rvan.me/news"
      />

      {/* Aurora background */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%", left: "-10%",
            width: "60%", height: "70%",
            background: "radial-gradient(ellipse at 40% 40%, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.03) 45%, transparent 72%)",
            filter: "blur(64px)",
          }}
        />
        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "0%", right: "-12%",
            width: "55%", height: "65%",
            background: "radial-gradient(ellipse at 65% 30%, rgba(59,130,246,0.04) 0%, rgba(79,70,229,0.02) 50%, transparent 78%)",
            filter: "blur(72px)",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero */}
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
              Real-time coverage across <span className="text-foreground font-medium">Design</span>, <span className="text-foreground font-medium">AI</span>, <span className="text-foreground font-medium">Frontend</span>, <span className="text-foreground font-medium">Marketing</span>, and <span className="text-foreground font-medium">Motion</span>. Aggregated automatically from 40+ trusted publishers with accurate UTC publication dates.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.15} className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8">
            {[
              { label: "Live Sources", value: "40+" },
              { label: "Categories", value: "7" },
              { label: "Refresh Rate", value: "Every 15m" },
              { label: "Strict UTC Dates", value: "✓" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</span>
                <span className="text-[10px] font-semibold text-muted-foreground mono uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Category Tabs + Search */}
      <section className="px-6 py-6 md:px-10 relative z-10 border-t border-white/8">
        <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {NEWS_TABS.map((tab) => {
              const Icon = tab.icon;
              const count = tabCounts[tab.key] || 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                    activeTab === tab.key
                      ? "bg-primary text-black shadow-[0_0_15px_rgba(232,253,82,0.25)]"
                      : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                  {count > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      activeTab === tab.key ? "bg-black/20 text-black" : "bg-white/10 text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
            <input
              type="text"
              placeholder="Search news & announcements..."
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

      {/* Live Industry News (RSS Feeds) */}
      {showingFeeds && (
        <section className="px-6 pb-28 md:px-10 relative z-10 border-t border-white/8 pt-12">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Rss size={16} className="text-primary" />
                <h2 className="text-sm font-bold tracking-[.15em] text-primary uppercase mono">
                  {activeTab === "all" ? "Live Industry Stream" : NEWS_TABS.find(t => t.key === activeTab)?.label}
                </h2>
                {!feedsLoading && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {filteredFeeds.length} articles
                  </span>
                )}
              </div>
            </div>

            {feedsLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, n) => (
                  <div key={n} className="h-64 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : filteredFeeds.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center glass">
                <Rss size={32} className="text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">No articles found for this category.</p>
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
                  const sourceColor = SOURCE_COLORS[item.sourceName] || "text-primary";
                  const summary = generateNewsSummary(item.title, item.description, item.sourceName);

                  return (
                    <motion.article
                      key={item.id || idx}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.05 }}
                      custom={idx * 0.04}
                      className="group p-6 aurora-card flex flex-col justify-between relative"
                    >
                      <div className="relative z-10 flex-1">
                        <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-wider mono uppercase mb-3">
                          <span className={`flex items-center gap-1.5 ${sourceColor}`}>
                            <Rss size={9} /> {item.sourceName}
                          </span>
                          <span className="text-muted-foreground/80 flex items-center gap-1">
                            <Calendar size={10} />
                            {item.formattedDate || formatPublicationTimestamp(item.publishedAt)}
                          </span>
                        </div>

                        <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-3 mb-4 font-medium flex-1">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 mono mb-4">
                          <span>⏱️ {summary.readingTimeMinutes} min read</span>
                          <span>·</span>
                          <span className="text-primary font-bold">Structured Summary Ready</span>
                        </div>
                      </div>

                      <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between mt-2">
                        <button
                          onClick={() => setSelectedNewsModal(item)}
                          className="text-[10px] font-bold text-primary hover:text-white uppercase mono tracking-wider transition-colors flex items-center gap-1"
                        >
                          <Sparkles size={11} /> AI ANALYTICAL SUMMARY
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(item.link, item.id)}
                            className="p-1.5 rounded-full border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all"
                            title="Copy link"
                          >
                            {copiedId === item.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
                          >
                            ORIGINAL SOURCE <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

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
