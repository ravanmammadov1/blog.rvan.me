import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../../types/blog";
import { urlFor } from "../../../lib/sanityClient";
import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";
import { getArticleCoverImage } from "../../../lib/contentEngine";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

interface BlogHeroProps {
  post: BlogPost;
}

export default function BlogHero({ post }: BlogHeroProps) {
  const { t, getLocalizedPath, language } = useLanguage();
  const imgBuilder = urlFor(post.coverImage);
  const coverUrl = imgBuilder
    ? imgBuilder.width(1800).height(1012).quality(92).auto("format").url()
    : getArticleCoverImage(
        post.category === "Design"
          ? "designNews"
          : post.category === "AI"
          ? "aiNews"
          : post.category === "Motion"
          ? "motionNews"
          : post.category === "Marketing"
          ? "marketingNews"
          : "frontendNews",
        post.title
      );
  const formattedDate = formatBlogDate(post.publishDate, language);
  const readTimeStr = estimateReadingTime(post.body, post.readTime, language, post.body_az);

  return (
    <header className="space-y-8 pt-4 pb-6">
      {/* ── 1. TOP NAVIGATION BAR ── */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to={getLocalizedPath("/")}
          className="group inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/80 dark:border-white/15 dark:bg-white/5 px-4 py-2 text-xs font-bold tracking-wider text-foreground backdrop-blur-xl transition-all duration-200 hover:border-primary hover:text-primary uppercase mono cursor-pointer shadow-2xs"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>{t("backToHome", "BACK TO HOME")}</span>
        </Link>

        <Link
          to={getLocalizedPath("/blog")}
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 dark:border-white/10 dark:bg-white/[0.03] px-3.5 py-1.5 text-[10px] font-mono font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase cursor-pointer"
        >
          {t("blogArchive", "BLOG ARCHIVE")}
        </Link>
      </div>

      {/* ── 2. EDITORIAL ARTICLE TITLE & METADATA BLOCK (Separated from image) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-6 max-w-4xl"
      >
        {/* Category, Format & Tags Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {(post.category || post.category_az) && (
            <span className="rounded-full bg-primary px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-black">
              {language === "az" && post.category_az ? post.category_az : (post.category || post.category_az)}
            </span>
          )}

          {post.format && (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              {post.format}
            </span>
          )}

          {Array.isArray(post.tags) &&
            post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-mono tracking-wider text-muted-foreground"
              >
                <Tag size={11} className="text-primary" />
                {tag}
              </span>
            ))}
        </div>

        {/* Big Crisp Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          {language === "az" && post.title_az ? post.title_az : post.title}
        </h1>

        {/* Deck / Lead Description */}
        {(post.deck || post.deck_az || post.excerpt || post.excerpt_az) && (
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground font-medium">
            {language === "az"
              ? post.deck_az || post.deck || post.excerpt_az || post.excerpt
              : post.deck || post.excerpt || post.deck_az || post.excerpt_az}
          </p>
        )}

        {/* Author / Editorial Desk & Timestamp Bar */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-muted-foreground border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <Link
              to={getLocalizedPath("/about/ravan-mammadov")}
              className="relative w-7 h-7 rounded-full overflow-hidden border border-primary/40 shrink-0 bg-muted/50 hover:border-primary transition-colors focus:outline-none ring-1 ring-primary/20"
              aria-label={language === "az" ? "Rəvan Məmmədov" : "Ravan Mammadov"}
            >
              <img
                src="/imports/ravan_1-400.webp"
                alt={language === "az" ? "Rəvan Məmmədov" : "Ravan Mammadov"}
                width={28}
                height={28}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.endsWith("ravan_portrait.png")) {
                    target.src = "/imports/ravan_portrait.png";
                  }
                }}
              />
            </Link>
            <Link
              to={getLocalizedPath("/about/ravan-mammadov")}
              className="text-foreground font-semibold hover:text-primary transition-colors"
            >
              {language === "az" ? "Rəvan Məmmədov" : "Ravan Mammadov"}
            </Link>
          </div>

          {formattedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-primary" />
              <span>{formattedDate}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-primary" />
            <span>{readTimeStr}</span>
          </div>
        </div>
      </motion.div>

      {/* ── 3. CLEAN, STANDALONE FEATURED COVER IMAGE (Zero text obstruction) ── */}
      {coverUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] aspect-[16/9] md:aspect-[21/9] shadow-2xl group"
        >
          <img
            src={coverUrl}
            alt={post.title || "Blog cover"}
            width={1800}
            height={1012}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(
                post.category === "Design"
                  ? "designNews"
                  : post.category === "AI"
                  ? "aiNews"
                  : post.category === "Motion"
                  ? "motionNews"
                  : "designNews",
                post.title
              );
            }}
          />
        </motion.div>
      )}
    </header>
  );
}
