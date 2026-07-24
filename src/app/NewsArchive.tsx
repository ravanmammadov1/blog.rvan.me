import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Search, X, ArrowUpRight, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

import { fetchNews, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { NewsItem, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";


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
  }, []);

  const categories = useMemo(() => {
    const list = [
      ...new Set(newsList.map((n) => n.category).filter(Boolean)),
    ];
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
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title="News & Updates — Ravan Mammadov"
        description="Latest announcements, field updates, and creative releases."
      />

      {/* Global Unified Header */}
      <SiteHeader siteSettings={siteSettings} />

      {/* Hero section */}
      <section className="px-6 pt-20 pb-12 md:px-10 md:pt-28">
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
                  className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "border border-border bg-surface hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-surface pl-10 pr-9 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="px-6 pb-28 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-xl border border-border bg-surface animate-pulse" />
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center my-12">
              <p className="text-lg text-muted-foreground">No news announcements match your search.</p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 text-xs font-bold tracking-widest text-primary uppercase mono hover:underline"
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
                    className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary flex flex-col justify-between"
                  >
                    <Link to={`/news/${newsSlug}`}>
                      {imgUrl && (
                        <div className="mb-5 overflow-hidden rounded-xl aspect-[16/10] bg-background">
                          <img
                            src={imgUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 mb-6">
                          {item.excerpt}
                        </p>
                      )}
                    </Link>

                    <div className="border-t border-border/50 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-primary mono uppercase">
                      <Link to={`/news/${newsSlug}`} className="inline-flex items-center gap-1.5 hover:underline">
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

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} RAVAN MAMMADOV</span>
          <Link to="/" className="transition-colors hover:text-primary">
            HOME
          </Link>
        </div>
      </footer>
    </main>
  );
}
