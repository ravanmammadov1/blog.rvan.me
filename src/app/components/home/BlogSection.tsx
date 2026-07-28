import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { client, urlFor } from "../../../lib/sanityClient";
import BlogCard from "../blog/BlogCard";
import { Eyebrow } from "../Eyebrow";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);

  useEffect(() => {
    // Fetch Blogs
    client
      .fetch(`
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
      `)
      .then((data) => {
        setBlogPosts(data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <section id="blog" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between border-b border-border pb-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">03 / Insights & Ideas</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Thinking out loud.
            </h2>
          </div>
          <Link
            to="/blog"
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            EXPLORE ALL ARTICLES
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {blogPosts.length === 0 ? (
          <div className="h-64 rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground text-sm">
            No blog articles available.
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
          <Link
            to="/blog"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-lg"
          >
            EXPLORE FULL BLOG ARCHIVE ({blogPosts.length} ARTICLES)
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}