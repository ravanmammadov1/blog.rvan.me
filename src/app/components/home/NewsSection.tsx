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
                  className="group p-6 aurora-card flex flex-col justify-between relative"
                >
                  <div className="relative z-10">
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
                    <p className="text-xs leading-relaxed text-muted-foreground/75 line-clamp-3 mb-6 font-medium">
                      {item.description}
                    </p>
                  </div>
                  <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-primary mono uppercase">
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