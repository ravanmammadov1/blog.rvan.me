import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Search, X, ArrowUpRight, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

import { fetchNews } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { NewsItem } from "../types/cms";
import SEO from "./components/SEO";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

export default function NewsArchive() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNews()
      .then((data) => setNewsList(data))
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

      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
          <Link
            to="/"
            className="group flex items-center gap-3 text-xs font-bold tracking-[.18em] uppercase hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>BACK TO HOME</span>
          </Link>
          <div className="flex items-center gap-6 text-[11px] font-semibold tracking-[.16em]">
            <Link to="/news" className="text-primary">
              NEWS
            </Link>
            <Link to="/tools" className="hover:text-primary transition-colors">
              TOOLS
            </Link>
            <Link to="/blog" className="hover:text-primary transition-colors">
              BLOG
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="px-6 pt-20 pb-12 md:px-10 md:pt-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <p className="eyebrow text-primary mb-4">ANNOUNCEMENTS & RELEASES</p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-4xl">
              News & Updates.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Stay up to date with major announcements, new releases, media features, and creative progress.
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
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-surface pl-10 pr-10 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid section */}
      <section className="px-6 pb-32 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-lg border border-border bg-surface animate-pulse" />
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="py-24 text-center border border-border rounded-lg bg-surface/50">
              <p className="text-lg text-muted-foreground">No news articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((item, index) => {
                const imgUrl = item.coverImage ? urlFor(item.coverImage)?.url() : null;
                const formattedDate = item.publishedAt
                  ? format(new Date(item.publishedAt), "MMM d, yyyy")
                  : null;

                const newsSlug = item.slug?.current || item._id;

                return (
                  <motion.article
                    key={item._id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    custom={index * 0.08}
                    className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/50"
                  >
                    <Link to={`/news/${newsSlug}`} className="flex flex-col justify-between h-full">
                      <div>
                        {imgUrl && (
                          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-background mb-6">
                            <img
                              src={imgUrl}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mono mb-3">
                          {item.category && (
                            <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-primary">
                              <Tag size={12} />
                              {item.category}
                            </span>
                          )}
                          {formattedDate && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {formattedDate}
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                          {item.title}
                        </h2>

                        {item.excerpt && (
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                            {item.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-xs font-bold tracking-wider text-primary mono">
                        <span>READ FULL ARTICLE</span>
                        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </Link>
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
          <div className="flex gap-6">
            <Link to="/" className="hover:text-primary">HOME</Link>
            <Link to="/news" className="hover:text-primary">NEWS</Link>
            <Link to="/tools" className="hover:text-primary">TOOLS</Link>
            <Link to="/blog" className="hover:text-primary">BLOG</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
