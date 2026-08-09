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
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
import PageFilterBar from "./components/PageFilterBar";
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
        *[_type == "blog" && (status == "published" || !defined(status)) && defined(slug.current) && (!defined(publishDate) || publishDate <= now())] | order(featured desc, publishDate desc){
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
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching blog archive from Sanity:", err);
        setPosts([]);
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
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="Design & Motion Insights Blog — Ravan Mammadov Studio"
        description="In-depth articles and agency-grade guides on 3D motion design, visual hierarchy, brand systems, performance creative, and UX psychology."
        url="https://www.rvan.me/blog"
      />

      {/* Global Unified Header */}
      <SiteHeader siteSettings={siteSettings} />

      {/* ── Aurora background blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        
        {/* Blob 1 — emerald / teal, top-left */}
        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%", left: "-10%",
            width: "60%", height: "70%",
            background: "radial-gradient(ellipse at 40% 40%, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.06) 45%, transparent 72%)",
            filter: "blur(64px)",
          }}
        />

        {/* Blob 2 — blue / indigo, top-right */}
        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "0%", right: "-12%",
            width: "55%", height: "65%",
            background: "radial-gradient(ellipse at 65% 30%, rgba(59,130,246,0.08) 0%, rgba(79,70,229,0.05) 50%, transparent 78%)",
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
      {/* Unified Page Hero */}
      <PageHero
        eyebrow="INSIGHTS & IDEAS"
        title="Design &"
        accentText="Editorial Essays."
        gradientVariant="secondary"
        description="Thoughts on design systems, motion craft, creative strategy, and building brands that move people."
      />

      {/* Master Page Filter Bar & Search */}
      <PageFilterBar
        categories={categories.map((cat) => ({
          key: cat,
          label: cat,
          count: categoryCounts[cat],
        }))}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search articles..."
        searchId="blog-search"
      />

      <div className="mx-auto max-w-[1600px] px-6 py-6 md:px-10 relative z-10">

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

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
