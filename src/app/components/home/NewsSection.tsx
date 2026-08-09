import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { fetchHomeNewsEngine, CuratedArticle } from "../../../lib/newsEngine";
import { fetchNews } from "../../../lib/sanityQueries";
import { getArticleCoverImage } from "../../../lib/contentEngine";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

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
  const { t, getLocalizedPath } = useLanguage();

  useEffect(() => {
    // 1. Instant 0ms initial render from cache/baseline
    fetchHomeNewsEngine([]).then((items) => {
      if (items && items.length > 0) {
        setNewsList(items.slice(0, 3));
      }
    });

    // 2. Parallel background revalidation with Sanity CMS news
    fetchNews().then((cmsData) => {
      fetchHomeNewsEngine(cmsData || []).then((items) => {
        if (items && items.length > 0) {
          setNewsList(items.slice(0, 3));
        }
      });
    }).catch(() => {});
  }, []);

  if (newsList.length === 0) return null;

  return (
    <section id="news" className="relative px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <Eyebrow className="text-muted-foreground">{t("sectionNewsEyebrow", "02 / Industry Intelligence Feed")}</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              {t("sectionNewsTitle", "Latest updates.")}
            </h2>
          </div>
          <Link
            to={getLocalizedPath("/news")}
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            {t("viewAllNews", "VIEW ALL NEWS")}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* News Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsList.map((item, idx) => {
            const rawSlug = item.slug || item.id || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const detailPath = getLocalizedPath(`/news/${rawSlug}`);
            const coverUrl = item.imageUrl || item.logoUrl || getArticleCoverImage(item.category, item.title);

            return (
              <motion.article
                key={item.id || idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div>
                  {/* Cover Image (Matches BlogCard exact h-48 height, rounded-xl border) */}
                  <div className="mb-4 h-48 w-full overflow-hidden rounded-xl border border-white/10 relative bg-neutral-900/80 flex-shrink-0">
                    <img
                      src={coverUrl}
                      alt={item.title}
                      width={800}
                      height={520}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(item.category, item.title);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full mono uppercase">
                      {item.category === "aiNews" ? t("aiNews", "AI & ML") : item.category === "designNews" ? t("designNews", "Design") : item.category === "frontendNews" ? t("frontendNews", "Frontend") : item.category === "marketingNews" ? t("marketingNews", "Marketing") : t("motionNews", "Motion")}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground mono">{item.formattedDate}</span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors mb-3">
                    <Link to={detailPath}>{item.title}</Link>
                  </h3>

                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium line-clamp-3 mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold mono">
                  <span className="text-muted-foreground">{item.sourceName}</span>
                  <Link to={detailPath} className="text-primary hover:text-white flex items-center gap-1">
                    {t("readArticle", "READ ARTICLE")} <ArrowUpRight size={13} />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
