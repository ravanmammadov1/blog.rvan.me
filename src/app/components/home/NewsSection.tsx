import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Rss } from "lucide-react";
import { format } from "date-fns";
import { client, urlFor } from "../../../lib/sanityClient";
import { Eyebrow } from "../Eyebrow";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
      transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

import { aggregateNewsFeeds, NormalizedResource } from "../../../lib/rssAggregator";
import { fetchNews } from "../../../lib/sanityQueries";

export default function NewsSection() {
  const [newsList, setNewsList] = useState<NormalizedResource[]>([]);

  useEffect(() => {
    fetchNews()
      .then((cmsNews) => aggregateNewsFeeds(cmsNews || []))
      .then((items) => {
        setNewsList((items || []).slice(0, 3));
      })
      .catch(() => {
        aggregateNewsFeeds([]).then((items) => setNewsList((items || []).slice(0, 3)));
      });
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
              const isInternal = item.link.startsWith("/news/");

              return (
                <motion.article
                  key={item.id || index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index * 0.08}
                  className="group rounded-2xl aurora-card flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    {/* Featured Cover Image / Branded Placeholder (16:9, ~105px height) */}
                    <div className="relative w-full h-[105px] overflow-hidden bg-black/60 border-b border-white/10 flex-shrink-0">
                      {item.imageUrl || item.logoUrl ? (
                        <img
                          src={item.imageUrl || item.logoUrl}
                          alt={item.title}
                          width={1200}
                          height={700}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="relative w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex items-center justify-center overflow-hidden">
                          <div
                            className="absolute inset-0 opacity-25"
                            style={{
                              backgroundImage:
                                "radial-gradient(circle at 20% 30%, rgba(16,185,129,0.35) 0%, transparent 65%), radial-gradient(circle at 80% 70%, rgba(6,182,212,0.25) 0%, transparent 65%)",
                            }}
                          />
                          <div className="relative z-10 flex items-center gap-2 px-4 text-center">
                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-primary/80">
                              <Rss size={14} />
                            </div>
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground/80 mono uppercase line-clamp-1">
                              {item.sourceName || "Industry News"}
                            </span>
                          </div>
                        </div>
                      )}
                      {/* Subtle 10-20% dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                    </div>

                    <div className="p-6 relative z-10">
                      <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-wider text-muted-foreground mono uppercase mb-3">
                        <span className="text-primary">{item.sourceName}</span>
                        <span>{item.formattedDate}</span>
                      </div>
                      <h3 className="text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary mb-3 line-clamp-2">
                        {isInternal ? (
                          <Link to={item.link}>{item.title}</Link>
                        ) : (
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        )}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground/75 line-clamp-3 font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 relative z-10">
                    <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-primary mono uppercase">
                      {isInternal ? (
                        <Link to={item.link} className="inline-flex items-center gap-2 hover:text-white transition-colors duration-300">
                          <span>READ ARTICLE</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      ) : (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors duration-300">
                          <span>VISIT SOURCE</span>
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
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
