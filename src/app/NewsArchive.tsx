import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Search, X, Rss, ExternalLink, Calendar, Newspaper, Cpu, TrendingUp, Megaphone } from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";

import { fetchNews, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { NewsItem, SiteSettings } from "../types/cms";
import { aggregateNewsFeeds, NormalizedResource } from "../lib/rssAggregator";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

function formatPubDate(isoStr: string): string {
  try {
    const d = parseISO(isoStr);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch (e) {
    return "Recently";
  }
}

function formatDate(isoStr: string): string {
  try {
    return format(new Date(isoStr), "MMM d, yyyy");
  } catch (e) {
    return "";
  }
}

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
  { key: "all", label: "All News", icon: Newspaper, description: "Everything across all categories" },
  { key: "designNews", label: "Design News", icon: TrendingUp, description: "UX, visual design, and creative industry" },
  { key: "aiNews", label: "AI News", icon: Cpu, description: "Artificial intelligence and machine learning" },
  { key: "marketingNews", label: "Marketing News", icon: TrendingUp, description: "SEO, growth, and digital marketing" },
  { key: "announcements", label: "Announcements", icon: Megaphone, description: "Studio milestones and updates" },
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
  "Moz": "text-[#5c91d0]",
  "Semrush": "text-green-400",
};

export default function NewsArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [announcements, setAnnouncements] = useState<NewsItem[]>([]);
  const [industryFeeds, setIndustryFeeds] = useState<NormalizedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedsLoading, setFeedsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NewsTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => { if (data) setSiteSettings(data); });

    fetchNews()
      .then((data) => {
        setAnnouncements(data && data.length > 0 ? data : fallbackNewsList);
      })
      .catch(() => setAnnouncements(fallbackNewsList))
      .finally(() => setLoading(false));

    // Load live industry news RSS feeds (News page exclusive)
    aggregateNewsFeeds()
      .then((items) => {
        setIndustryFeeds(items);
      })
      .catch((err) => console.error("Error fetching industry news feeds:", err))
      .finally(() => setFeedsLoading(false));
  }, []);

  // Combined feed for display (RSS industry news only — no announcements in the combined view)
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

  // Compute counts per tab
  const tabCounts: Record<string, number> = useMemo(() => ({
    all: industryFeeds.length + announcements.length,
    designNews: industryFeeds.filter((r) => r.category === "designNews").length,
    aiNews: industryFeeds.filter((r) => r.category === "aiNews").length,
    marketingNews: industryFeeds.filter((r) => r.category === "marketingNews").length,
    announcements: announcements.length,
  }), [industryFeeds, announcements]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Industry News — Design, AI & Marketing — Rvan.me"
        description="Stay current with the latest design, AI, and marketing industry news. Aggregated in real-time from trusted sources including Smashing Magazine, Hugging Face, HubSpot, and more."
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
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero */}
      <section className="px-6 pt-20 pb-12 md:px-10 md:pt-28 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.05}>
            <p className="eyebrow text-primary mb-4 flex items-center gap-2">
              <Rss size={13} /> INDUSTRY NEWS HUB · LIVE RSS AGGREGATION
            </p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-5xl leading-[0.9]">
              Industry<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                News.
              </span>
            </h1>
            <p className="mt-8 text-base text-muted-foreground max-w-2xl leading-relaxed">
              Real-time coverage from{" "}
              <span className="text-foreground font-medium">Design</span>,{" "}
              <span className="text-foreground font-medium">AI</span>, and{" "}
              <span className="text-foreground font-medium">Marketing</span> — aggregated from the best publishers in the industry. Updated automatically every few hours.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="mt-10 flex flex-wrap gap-6"
          >
            {[
              { label: "Live Sources", value: "22+" },
              { label: "Categories", value: "3" },
              { label: "Updates", value: "Every 6h" },
              { label: "Auto-deduped", value: "✓" },
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
      <section className="px-6 py-8 md:px-10 relative z-10 border-t border-white/8">
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
              placeholder="Search all news..."
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

      {/* Announcements Section (CMS Sanity Posts) */}
      {showingAnnouncements && filteredAnnouncements.length > 0 && (
        <section className="px-6 pb-16 md:px-10 relative z-10 border-t border-white/8 pt-12">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 flex items-center gap-3">
              <Megaphone size={16} className="text-primary" />
              <h2 className="text-sm font-bold tracking-[.15em] text-primary uppercase mono">Studio Announcements</h2>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {filteredAnnouncements.length}
              </span>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-48 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAnnouncements.map((item, index) => {
                  const newsSlug = item.slug?.current || item._id;
                  const formattedDate = item.publishedAt ? formatDate(item.publishedAt) : null;
                  const imgUrl = item.coverImage ? urlFor(item.coverImage)?.url() : null;

                  return (
                    <motion.article
                      key={item._id || index}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.15 }}
                      custom={index * 0.07}
                      className="group p-6 aurora-card flex flex-col justify-between"
                    >
                      <div className="relative z-10 flex-1">
                        <Link to={`/news/${newsSlug}`}>
                          {imgUrl && (
                            <div className="mb-5 overflow-hidden rounded-xl aspect-[16/10] bg-background border border-white/5">
                              <img
                                src={imgUrl}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-wider text-muted-foreground mono uppercase mb-3">
                            {item.category && <span className="text-primary">{item.category}</span>}
                            {formattedDate && <span className="flex items-center gap-1"><Calendar size={10} />{formattedDate}</span>}
                          </div>
                          <h3 className="text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary mb-3 line-clamp-2">
                            {item.title}
                          </h3>
                          {item.excerpt && (
                            <p className="text-xs leading-relaxed text-muted-foreground/85 line-clamp-3 mb-4 font-medium">
                              {item.excerpt}
                            </p>
                          )}
                        </Link>
                      </div>
                      <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-primary mono uppercase">
                        <Link to={`/news/${newsSlug}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300">
                          READ ARTICLE <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Live Industry News (RSS Feeds) */}
      {showingFeeds && (
        <section className="px-6 pb-28 md:px-10 relative z-10 border-t border-white/8 pt-12">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Rss size={16} className="text-primary" />
                <h2 className="text-sm font-bold tracking-[.15em] text-primary uppercase mono">
                  {activeTab === "all" ? "Live Industry Feeds" :
                   activeTab === "designNews" ? "Design News" :
                   activeTab === "aiNews" ? "AI & Tech News" :
                   "Marketing News"}
                </h2>
                {!feedsLoading && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {filteredFeeds.length} articles
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground mono hidden md:block">
                Aggregated from 22+ trusted sources · Auto-refreshed every 6h
              </span>
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
                  const categoryLabel =
                    item.category === "designNews" ? "Design" :
                    item.category === "aiNews" ? "AI & Tech" :
                    item.category === "marketingNews" ? "Marketing" : item.category;

                  return (
                    <motion.article
                      key={item.id || idx}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.05 }}
                      custom={idx * 0.04}
                      className="group p-6 aurora-card flex flex-col justify-between"
                    >
                      <div className="relative z-10 flex-1">
                        <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-wider mono uppercase mb-3">
                          <span className={`flex items-center gap-1.5 ${sourceColor}`}>
                            <Rss size={9} /> {item.sourceName}
                          </span>
                          <span className="text-muted-foreground/70 flex items-center gap-1">
                            <span className="rounded-full bg-white/8 px-2 py-0.5 text-muted-foreground/80">{categoryLabel}</span>
                          </span>
                        </div>

                        <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-3 mb-3 font-medium flex-1">
                          {item.description}
                        </p>

                        <span className="text-[10px] text-muted-foreground/60 mono flex items-center gap-1">
                          <Calendar size={9} /> {formatPubDate(item.publishedAt)}
                        </span>
                      </div>

                      <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between mt-4">
                        <span className="text-[10px] font-semibold text-muted-foreground/50 mono uppercase">OPEN ACCESS</span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
                        >
                          READ ARTICLE <ExternalLink size={10} />
                        </a>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
