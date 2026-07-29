import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Search, X, ArrowUpRight, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

import { fetchNews, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { NewsItem, SiteSettings } from "../types/cms";
import { aggregateAllResources, NormalizedResource } from "../lib/rssAggregator";
import { Rss, ExternalLink } from "lucide-react";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

function formatPubDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return format(d, "MMM d, yyyy");
  } catch (e) {
    return "Recently";
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
  {
    _id: "fn3",
    title: "Integrating 3D Interactive Embeds into Brand Experiences",
    slug: { current: "3d-interactive-embeds-update" },
    category: "Workflow",
    excerpt: "How WebGL and 3D embeds are replacing static images in high-converting portfolio hero sections.",
    publishedAt: "2025-05-15T12:00:00Z",
  },
];

export default function NewsArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [designNewsFeeds, setDesignNewsFeeds] = useState<NormalizedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
    fetchNews()
      .then((data) => {
        if (data && data.length > 0) {
          setNewsList(data);
        } else {
          setNewsList(fallbackNewsList);
        }
      })
      .catch((err) => {
        console.error("Error fetching news from Sanity:", err);
        setNewsList(fallbackNewsList);
      })
      .finally(() => setLoading(false));

    // Load live RSS design news feeds
    aggregateAllResources([])
      .then((items) => {
        const designNews = items.filter(
          (i) => i.category === "latestDesignNews" || i.category === "techNews" || i.category === "aiNews"
        );
        setDesignNewsFeeds(designNews);
      })
      .catch((err) => console.error("Error fetching RSS news feeds:", err));
  }, []);

  const categories = useMemo(() => {
    const validCategories = newsList
      .map((n) => n.category)
      .filter((value): value is string => typeof value === "string" && value.trim() !== "");

    const list = [...new Set(validCategories)];
    return ["All", ...list];
  }, [newsList]);

  const filteredNews = useMemo(() => {
    let result = newsList;

    if (activeCategory !== "All") {
      result = result.filter((n) => n.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.excerpt?.toLowerCase().includes(q) ||
          n.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [newsList, activeCategory, searchQuery]);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="News & Creative Field Notes — Ravan Mammadov Studio"
        description="Latest announcements, agency milestones, brand releases, and motion design field updates from creative designer Ravan Mammadov."
        url="https://www.rvan.me/news"
      />

      {/* Global Unified Header */}
      {/* ── Aurora background blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        
        {/* Blob 1 — emerald / teal, top-left */}
        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%", left: "-10%",
            width: "60%", height: "70%",
            background: "radial-gradient(ellipse at 40% 40%, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.04) 45%, transparent 72%)",
            filter: "blur(64px)",
          }}
        />

        {/* Blob 2 — blue / indigo, top-right */}
        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "0%", right: "-12%",
            width: "55%", height: "65%",
            background: "radial-gradient(ellipse at 65% 30%, rgba(59,130,246,0.05) 0%, rgba(79,70,229,0.03) 50%, transparent 78%)",
            filter: "blur(72px)",
          }}
        />

        {/* Micro grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero section */}
      <section className="px-6 pt-20 pb-12 md:px-10 md:pt-28 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <p className="eyebrow text-primary mb-4">ANNOUNCEMENTS & FIELD NOTES</p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-4xl">
              Latest News.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Updates on creative launches, major client milestones, design system releases, and technical breakdowns.
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-t border-border pt-8"
          >
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-primary text-black shadow-[0_0_15px_rgba(232,253,82,0.25)]"
                      : "border border-white/10 bg-white/5 hover:border-primary/50 text-muted-foreground hover:text-foreground glass-sm"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-9 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/45 focus:border-primary/50 focus:outline-none transition-all duration-300 glass-sm"
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
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="px-6 pb-28 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-xl border border-white/10 bg-white/5 animate-pulse glass" />
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center my-12 glass">
              <p className="text-lg text-muted-foreground">No news announcements match your search.</p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 text-xs font-bold tracking-widest text-primary uppercase mono hover:text-white transition-colors duration-300"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((item, index) => {
                const newsSlug = item.slug?.current || item._id;
                let formattedDate: string | null = null;
                if (item.publishedAt) {
                  try {
                    const d = new Date(item.publishedAt);
                    if (!isNaN(d.getTime())) {
                      formattedDate = format(d, "MMM d, yyyy");
                    }
                  } catch (e) {
                    formattedDate = null;
                  }
                }
                const imgUrl = item.coverImage ? urlFor(item.coverImage)?.url() : null;

                return (
                  <motion.article
                    key={item._id || index}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    custom={index * 0.08}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-6 glass transition-all duration-500 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Internal Glow */}
                    <div 
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      style={{
                        background: "radial-gradient(circle at top right, rgba(16,185,129,0.06) 0%, transparent 60%)",
                      }}
                    />
                    <div className="relative z-10 flex-1">
                      <Link to={`/news/${newsSlug}`}>
                        {imgUrl && (
                          <div className="mb-5 overflow-hidden rounded-xl aspect-[16/10] bg-background border border-white/5">
                            <img
                              src={imgUrl}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-wider text-muted-foreground mono uppercase mb-3">
                          {item.category && <span className="text-primary">{item.category}</span>}
                          {formattedDate && <span>{formattedDate}</span>}
                        </div>

                        <h3 className="text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary mb-3">
                          {item.title}
                        </h3>

                        {item.excerpt && (
                          <p className="text-xs leading-relaxed text-muted-foreground/85 line-clamp-3 mb-6 font-medium">
                            {item.excerpt}
                          </p>
                        )}
                      </Link>
                    </div>

                    <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-primary mono uppercase mt-4">
                      <Link to={`/news/${newsSlug}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300">
                        <span>READ FULL ARTICLE</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Live Design News Section (RSS Aggregation) */}
      {designNewsFeeds.length > 0 && (
        <section className="px-6 pb-28 md:px-10 relative z-10 border-t border-white/10 pt-16">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="eyebrow text-primary mb-2 flex items-center gap-2">
                  <Rss size={14} /> LIVE RSS AGGREGATION
                </p>
                <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  Design News & Articles
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mono max-w-md">
                Real-time articles aggregated from Smashing Magazine, UX Collective, Abduzeedo, and trusted industry publishers.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {designNewsFeeds.slice(0, 9).map((item, idx) => (
                <article
                  key={item.id || idx}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 glass transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-wider text-muted-foreground mono uppercase mb-3">
                      <span className="text-primary flex items-center gap-1">
                        <Rss size={10} /> {item.sourceName}
                      </span>
                      <span>{formatPubDate(item.publishedAt)}</span>
                    </div>

                    <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-3 mb-6 font-medium">
                      {item.description}
                    </p>
                  </div>

                  <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-foreground mono uppercase">
                    <span className="text-[10px] text-muted-foreground">OPEN ACCESS</span>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
                    >
                      READ ARTICLE <ExternalLink size={11} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
