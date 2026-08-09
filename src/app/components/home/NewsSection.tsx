import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Rss } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { fetchHomeNewsEngine, CuratedArticle } from "../../../lib/newsEngine";
import { fetchNews } from "../../../lib/sanityQueries";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function NewsSection() {
  const [newsList, setNewsList] = useState<CuratedArticle[]>([]);

  useEffect(() => {
    fetchNews()
      .then((cmsNews) => fetchHomeNewsEngine(cmsNews || []))
      .then((items) => {
        setNewsList((items || []).slice(0, 3));
      })
      .catch(() => {
        fetchHomeNewsEngine([]).then((items) => setNewsList((items || []).slice(0, 3)));
      });
  }, []);

  return (
    <section id="news" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section background */}
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
            <Eyebrow className="text-muted-foreground">02 / Industry Intelligence Feed</Eyebrow>
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

        {/* News Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsList.map((item, idx) => (
            <motion.article
              key={item.id || idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-bold text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full mono uppercase">
                    {item.category === "aiNews" ? "AI & ML" : item.category === "designNews" ? "Design" : item.category === "frontendNews" ? "Frontend" : item.category === "marketingNews" ? "Marketing" : "Motion"}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground mono">{item.formattedDate}</span>
                </div>

                <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors mb-3">
                  {item.title}
                </h3>

                <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium line-clamp-3 mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold mono">
                <span className="text-muted-foreground">{item.sourceName}</span>
                {item.link.startsWith("/") ? (
                  <Link to={item.link} className="text-primary hover:text-white flex items-center gap-1">
                    READ ARTICLE <ArrowUpRight size={13} />
                  </Link>
                ) : (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-white flex items-center gap-1"
                  >
                    READ ARTICLE <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
