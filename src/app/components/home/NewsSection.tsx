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
    <section id="news" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section aurora background */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle at 20% 40%, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)",
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
            <Eyebrow className="text-muted-foreground">02 / Announcements & Field Notes</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
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
          <div className="h-64 rounded-xl border border-white/10 bg-white/5 glass flex items-center justify-center text-muted-foreground text-sm">
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
                  className="group p-6 aurora-card flex flex-col justify-between relative"
                >
                  <div className="relative z-10">
                    <Link to={`/news/${newsSlug}`}>
                      {imgUrl && (
                        <div className="mb-5 overflow-hidden rounded-xl aspect-[16/10] bg-background border border-white/5">
                          <img
                            src={imgUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
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
                        <p className="text-xs leading-relaxed text-muted-foreground/75 line-clamp-3 mb-6 font-medium">
                          {item.excerpt}
                        </p>
                      )}
                    </Link>
                  </div>
                  <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-primary mono uppercase">
                    <Link to={`/news/${newsSlug}`} className="inline-flex items-center gap-2 hover:text-white transition-colors duration-300">
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
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold tracking-[.14em] text-foreground transition-all duration-300 hover:bg-white/10 hover:border-white/20 mono"
          >
            VIEW ALL NEWS
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}