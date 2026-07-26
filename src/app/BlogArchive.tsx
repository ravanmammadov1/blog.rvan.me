import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, X, ArrowLeft } from "lucide-react";

import { client } from "../lib/sanityClient";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import { BlogPost } from "../types/blog";
import BlogCard from "./components/blog/BlogCard";
import CategoryFilter from "./components/blog/CategoryFilter";
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

const fallbackBlogPosts: BlogPost[] = [
  {
    _id: "fb1",
    title: "The 3-Second Rule: First Frames That Retain Attention",
    slug: { current: "the-3-second-rule" },
    excerpt: "If your creative doesn't capture visual attention within three seconds, it never will. Here is how to structure opening frames for maximum impact.",
    category: "Marketing",
    tags: ["Hook", "Motion", "Performance Creative"],
    featured: true,
    publishDate: "2025-06-15",
    readTime: "4 min read",
    body: [],
    coverImage: null,
  },
];

export default function BlogArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    client
      .fetch(
        `
        *[_type == "blog"] | order(featured desc, publishDate desc){
          _id,
          title,
          slug,
          excerpt,
          category,
          tags,
          featured,
          publishDate,
          readTime,
          coverImage,
          body
        }
      `
      )
      .then((data) => {
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(fallbackBlogPosts);
        }
      })
      .catch((err) => {
        console.error("Error fetching blog archive from Sanity:", err);
        setPosts(fallbackBlogPosts);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const list = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    return ["All", ...list];
  }, [posts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    posts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, activeCategory, searchQuery]);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title="Design & Motion Insights Blog — Ravan Mammadov Studio"
        description="In-depth articles and agency-grade guides on 3D motion design, visual hierarchy, brand systems, performance creative, and UX psychology."
        url="https://www.rvan.me/blog"
      />

      {/* Global Unified Header */}
      <SiteHeader siteSettings={siteSettings} />

      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28">
        {/* Page heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <p className="eyebrow text-muted-foreground">Insights & Ideas</p>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-.07em] md:text-7xl">
            All Articles
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Thoughts on design systems, motion craft, creative strategy, and
            building brands that move people.
          </p>
        </motion.div>

        {/* Search & Filter bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
          className="mt-14 space-y-6 border-b border-border pb-8"
        >
          {/* Search */}
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Categories */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />
        </motion.div>

        {/* Results info */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.25}
          className="mt-8 flex items-center justify-between"
        >
          <p className="text-xs font-bold tracking-[.14em] text-muted-foreground mono">
            {filteredPosts.length} ARTICLE{filteredPosts.length !== 1 ? "S" : ""}
            {searchQuery && ` FOR "${searchQuery.toUpperCase()}"`}
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="mt-20 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 text-center"
          >
            <p className="text-lg text-muted-foreground">
              {searchQuery
                ? "No articles match your search."
                : "No articles published yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-4 text-sm text-primary underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPosts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                hovered={hoveredBlog === post._id}
                onHoverStart={() => setHoveredBlog(post._id)}
                onHoverEnd={() => setHoveredBlog(null)}
              />
            ))}
          </motion.div>
        )}
      </div>

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
