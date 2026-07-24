import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { BlogPost } from "../../../types/blog";

import FeaturedPost from "./FeaturedPost";
import BlogCard from "./BlogCard";
import CategoryFilter from "./CategoryFilter";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);

  const categories = useMemo(() => {
    const list = [...new Set(posts.map((post) => post.category).filter(Boolean))];
    return ["All", ...list];
  }, [posts]);

  const featuredPost = useMemo(() => {
    return posts.find((post) => post.featured) || posts[0];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const list = posts.filter((post) => post._id !== featuredPost?._id);

    if (activeCategory === "All") {
      return list.slice(0, 3); // Display max 3 cards on homepage
    }

    return list.filter((post) => post.category === activeCategory).slice(0, 3);
  }, [posts, activeCategory, featuredPost]);

  return (
    <section id="blog" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
      <div className="mx-auto max-w-[1600px]">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between border-b border-border pb-6"
        >
          <div>
            <p className="eyebrow text-muted-foreground">05 / Insights & Ideas</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Thinking out loud.
            </h2>
          </div>

          <Link
            to="/blog"
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            EXPLORE ALL ARTICLES ({posts.length})
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {posts.length === 0 ? (
          /* Empty state */
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="h-16 w-16 rounded-full border border-border grid place-items-center mb-6">
              <span className="text-2xl">✍</span>
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              Articles coming soon.
            </p>
          </motion.div>
        ) : (
          <>
            {featuredPost && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-14"
              >
                <FeaturedPost post={featuredPost} />
              </motion.div>
            )}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
              className="mb-12"
            >
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onChange={setActiveCategory}
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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

            {/* Explore Blog Archive CTA */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16 flex justify-center"
            >
              <Link
                to="/blog"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-lg"
              >
                EXPLORE FULL BLOG ARCHIVE ({posts.length} ARTICLES)
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}