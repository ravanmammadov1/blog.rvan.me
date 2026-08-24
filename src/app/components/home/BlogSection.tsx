import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, TrendingUp, Clock, BookOpen } from "lucide-react";
import { fetchAllBlogs } from "../../../lib/sanityQueries";
import BlogCard from "../blog/BlogCard";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { Button } from "../ui/Button";
import { fetchAllArticleStats, ArticleStats } from "../../../services/articleStatsService";
import { MASTER_EDITORIAL_BLOGS } from "../../../lib/editorialBlogRegistry";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: "easeInOut" },
  }),
};

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<any[]>(MASTER_EDITORIAL_BLOGS);
  const [articleStats, setArticleStats] = useState<Record<string, ArticleStats>>({});
  const [activeFilter, setActiveFilter] = useState<"latest" | "most_read" | "design" | "psychology" | "marketing">("latest");
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  useEffect(() => {
    fetchAllBlogs(language)
      .then((data) => {
        if (data && data.length > 0) {
          setBlogPosts(data);
        }
      })
      .catch(console.error);

    fetchAllArticleStats().then((stats) => {
      setArticleStats(stats || {});
    });
  }, [language]);

  // Data-driven filtered/sorted posts
  const displayedPosts = useMemo(() => {
    let list = [...blogPosts];

    if (activeFilter === "most_read") {
      list.sort((a, b) => {
        const slugA = (a.slug?.current || a.originalSlug || a._id || "").toLowerCase();
        const slugB = (b.slug?.current || b.originalSlug || b._id || "").toLowerCase();
        const viewsA = articleStats[slugA]?.viewCount || 0;
        const viewsB = articleStats[slugB]?.viewCount || 0;
        return viewsB - viewsA;
      });
    } else if (activeFilter === "design") {
      list = list.filter((p) => p.category === "Design" || p.category === "Typography");
    } else if (activeFilter === "psychology") {
      list = list.filter((p) => p.category === "Psychology" || p.category === "UX");
    } else if (activeFilter === "marketing") {
      list = list.filter((p) => p.category === "Marketing" || p.category === "Creative Culture");
    }

    return list.slice(0, 6);
  }, [blogPosts, activeFilter, articleStats]);

  return (
    <section id="blog" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section aurora background */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle at 80% 60%, rgba(139,92,246,0.07) 0%, rgba(79,70,229,0.04) 45%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-[1280px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-6 gap-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">
              {isAz ? "03 / Redaksiya Nəşrləri və Fikirlər" : "03 / Editorial Publication & Insights"}
            </Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              {isAz ? "Dizayn × Psixologiya." : "Thinking out loud."}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground font-medium max-w-xl">
              {isAz
                ? "Gündəlik gördüyünüz dizayn qaydaları, qiymət modelləri və vizual qərarların arxasındakı elmi səbəblər."
                : "Deep research on visual hierarchy, behavioural psychology, and creative culture."}
            </p>
          </div>

          <Link
            to={getLocalizedPath("/blog")}
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            {isAz ? "BÜTÜN MƏQALƏLƏRƏ BAX" : "EXPLORE ALL ARTICLES"}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Discovery Filter Tabs */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter("latest")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold mono transition-all cursor-pointer ${
              activeFilter === "latest"
                ? "bg-primary text-black shadow-lg shadow-primary/20"
                : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            <Clock size={13} />
            <span>{isAz ? "Ən Son Nəşrlər" : "Latest Essays"}</span>
          </button>

          <button
            onClick={() => setActiveFilter("most_read")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold mono transition-all cursor-pointer ${
              activeFilter === "most_read"
                ? "bg-primary text-black shadow-lg shadow-primary/20"
                : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            <TrendingUp size={13} />
            <span>{isAz ? "Ən Çox Oxunanlar" : "Most Read"}</span>
          </button>

          <button
            onClick={() => setActiveFilter("design")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold mono transition-all cursor-pointer ${
              activeFilter === "design"
                ? "bg-primary text-black shadow-lg shadow-primary/20"
                : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            <span>📐 Design & Type</span>
          </button>

          <button
            onClick={() => setActiveFilter("psychology")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold mono transition-all cursor-pointer ${
              activeFilter === "psychology"
                ? "bg-primary text-black shadow-lg shadow-primary/20"
                : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            <span>🧠 Psychology & UX</span>
          </button>

          <button
            onClick={() => setActiveFilter("marketing")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold mono transition-all cursor-pointer ${
              activeFilter === "marketing"
                ? "bg-primary text-black shadow-lg shadow-primary/20"
                : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            <span>⚡ Marketing & Brand</span>
          </button>
        </div>

        {/* 6-Card Responsive Grid */}
        {displayedPosts.length === 0 ? (
          <div className="h-64 rounded-xl border border-white/10 bg-white/5 glass flex items-center justify-center text-muted-foreground text-sm">
            {t("noBlogArticles", "No blog articles available.")}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedPosts.map((post) => (
              <BlogCard
                key={post._id || post.slug?.current}
                post={post}
                hovered={hoveredBlog === post._id}
                onHoverStart={() => setHoveredBlog(post._id)}
                onHoverEnd={() => setHoveredBlog(null)}
              />
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            to={getLocalizedPath("/blog")}
            variant="outline"
            size="lg"
            icon={<ArrowUpRight size={16} />}
          >
            {isAz ? "BÜTÜN MƏQALƏ ARXİVİNİ AÇ (39 NƏŞR)" : "EXPLORE FULL PUBLICATION ARCHIVE"}
          </Button>

          <Button
            to={getLocalizedPath("/contributor/dashboard")}
            variant="secondary"
            size="lg"
            icon={<Sparkles size={15} className="text-primary" />}
            iconPosition="left"
          >
            {isAz ? "MÜƏLLİF KİMİ QOŞULUN" : "BECOME A CONTRIBUTOR"}
          </Button>
        </div>
      </div>
    </section>
  );
}
