import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { client, urlFor } from "../../../lib/sanityClient";
import { Eyebrow } from "../Eyebrow";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function NewsSection() {
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    // Fetch News (latest 3)
    client
      .fetch(`
        *[_type == "news"] | order(publishedAt desc)[0...3]{
          _id,
          title,
          "slug": slug.current,
          coverImage,
          excerpt,
          publishedAt,
          category
        }
      `)
      .then((data) => {
        setNewsList(data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <section id="news" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between border-b border-border pb-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">02 / Announcements & Field Notes</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Latest updates.
            </h2>
          </div>
          <Link
            to="/news"
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            VIEW ALL NEWS
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {newsList.length === 0 ? (
          <div className="h-64 rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground text-sm">
            No news updates available.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {newsList.map((item, index) => {
              const newsSlug = item.slug || item._id;
              let formattedDate = "";
              if (item.publishedAt) {
                try {
                  formattedDate = format(new Date(item.publishedAt), "MMM d, yyyy");
                } catch (e) {
                  formattedDate = "";
                }
              }
              const imgUrl = item.coverImage ? urlFor(item.coverImage)?.url() : null;

              return (
                <motion.article
                  key={item._id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
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
                    <h3 className="text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary mb-3 line-clamp-2">
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

        <div className="mt-16 flex justify-center md:hidden">
          <Link
            to="/news"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-xs font-bold tracking-[.14em] text-foreground transition-colors hover:border-primary mono"
          >
            VIEW ALL NEWS
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}