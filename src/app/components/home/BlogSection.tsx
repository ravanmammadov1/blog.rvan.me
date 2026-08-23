import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetchAllBlogs } from "../../../lib/sanityQueries";
import BlogCard from "../blog/BlogCard";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { Button } from "../ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: "easeInOut" },
  }),
};

import { MASTER_EDITORIAL_BLOGS } from "../../../lib/editorialBlogRegistry";

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<any[]>(MASTER_EDITORIAL_BLOGS.slice(0, 3));
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);
  const { t, getLocalizedPath, language, isAz } = useLanguage();

  useEffect(() => {
    fetchAllBlogs(language)
      .then((data) => {
        if (data && data.length > 0) {
          setBlogPosts(data);
        }
      })
      .catch(console.error);
  }, [language]);

  return (
    <section id="blog" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section aurora background */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle at 80% 60%, rgba(139,92,246,0.07) 0%, rgba(79,70,229,0.04) 45%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-[1600px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between border-b border-white/10 pb-6"
        >
          <div>
            <Eyebrow className="text-primary tracking-[.2em]">{isAz ? "NƏŞR VƏ TƏHQİQAT" : "CREATIVE PUBLICATION"}</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Son Məqalələr" : "Latest Articles"}
            </h2>
          </div>
          <Link
            to={getLocalizedPath("/blog")}
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            {isAz ? "BÜTÜN MƏQALƏLƏRƏ BAX" : "VIEW ALL ARTICLES"}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {blogPosts.length === 0 ? (
          <div className="h-64 rounded-xl border border-white/10 bg-white/5 glass flex items-center justify-center text-muted-foreground text-sm">
            {t("noBlogArticles", "No blog articles available.")}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts
              .slice(0, 3)
              .map((post) => (
                <BlogCard
                  key={post._id}
                  post={post}
                  hovered={hoveredBlog === post._id}
                  onHoverStart={() => setHoveredBlog(post._id)}
                  onHoverEnd={() => setHoveredBlog(null)}
                />
              ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Button
            to={getLocalizedPath("/blog")}
            variant="outline"
            size="lg"
            icon={<ArrowUpRight size={16} />}
          >
            {isAz ? "BÜTÜN MƏQALƏLƏRƏ BAX" : "VIEW ALL ARTICLES"}
          </Button>
        </div>
      </div>
    </section>
  );
}
