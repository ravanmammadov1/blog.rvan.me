import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetchAllBlogs } from "../../../lib/sanityQueries";
import BlogCard from "../blog/BlogCard";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { Button } from "../ui/Button";
import { MASTER_EDITORIAL_BLOGS } from "../../../lib/editorialBlogRegistry";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

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
    <section id="blog" className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex items-end justify-between border-b border-border pb-6"
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
          <div className="h-64 rounded-2xl border border-border bg-card flex items-center justify-center text-muted-foreground text-sm">
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

        <div className="mt-12 flex justify-center">
          <Button
            to={getLocalizedPath("/blog")}
            variant="secondary"
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
