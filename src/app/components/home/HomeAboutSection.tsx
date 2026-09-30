import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, UserCheck, BookOpenCheck } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { Button } from "../ui/Button";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HomeAboutSection() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <section id="about-summary" className="relative px-4 sm:px-6 md:px-10 py-16 sm:py-24 lg:py-28 border-b border-border/40">
      <div className="mx-auto max-w-[1280px] relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Platform Vision & Narrative */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <Eyebrow className="text-muted-foreground">
              {isAz ? "04 / PLATFORMA HAQQINDA" : "04 / PLATFORM VISION"}
            </Eyebrow>

            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground leading-tight">
              {isAz ? "Rvan.me Haqqında" : "About Rvan.me"}
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground font-normal max-w-2xl">
              {isAz
                ? "Rvan.me — dizayn, marketinq, brendinq, vizual mədəniyyət, süni intellekt və yaradıcılıq, eləcə də kreativ sənayeni araşdıran müstəqil kreativ nəşr və bilik platformasıdır. Biz ideyaları araşdırmaq, yaradıcı işləri təhlil etmək və faydalı bilikləri bölüşmək üçün fəaliyyət göstəririk."
                : "Rvan.me is a creative publication and knowledge platform exploring design, marketing, branding, visual culture, AI & creativity, and the creative industry. The platform exists to explore ideas, analyze creative work, and share useful knowledge."}
            </p>

            {/* Founder Note */}
            <div className="pt-6 border-t border-border/50 flex items-start gap-4">
              <Link
                to={getLocalizedPath("/about/ravan-mammadov")}
                className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden border border-primary/40 shrink-0 bg-muted group shadow-md"
                aria-label={isAz ? "Rəvan Məmmədov" : "Ravan Mammadov"}
              >
                <img
                  src="/ravan-mammadov.webp"
                  alt={isAz ? "Rəvan Məmmədov — Kreativ Direktor və Təsisçi" : "Ravan Mammadov — Creative Director & Founder"}
                  title={isAz ? "Rəvan Məmmədov" : "Ravan Mammadov"}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="space-y-1">
                <Link
                  to={getLocalizedPath("/about/ravan-mammadov")}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider hover:text-primary transition-colors"
                >
                  <UserCheck size={14} className="text-primary" />
                  <span>{isAz ? "Təsisçi: Rəvan Məmmədov" : "Founded by Ravan Mammadov"}</span>
                </Link>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal max-w-xl">
                  {isAz
                    ? "Rəvan Məmmədov vizual mədəniyyət, brendlər, texnologiya və kreativ strategiyanın kəsişməsini araşdıran dizayner və marketoloqdur."
                    : "Ravan Mammadov is a designer and marketer exploring the intersection of visual culture, brands, technology and creative strategy."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                to={getLocalizedPath("/about")}
                variant="primary"
                size="md"
                icon={<ArrowUpRight size={14} />}
              >
                {isAz ? "HAQQIMIZDA ƏTRAFLI" : "LEARN MORE ABOUT RVAN.ME"}
              </Button>
            </div>
          </motion.div>

          {/* Editorial Statement Box */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.12}
            className="lg:col-span-5"
          >
            <div className="p-7 sm:p-8 rounded-2xl liquid-glass-card space-y-5 text-left relative z-10">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <BookOpenCheck size={18} />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                {isAz ? "Açıq Redaksiya Bəyanatı" : "Editorial Philosophy"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                {isAz
                  ? "Hər bir məqalə, resurs və analitik esse real kommersiya və yaradıcı faydalılıq üçün hazırlanır. Reklam səs-küyü olmadan təmiz bilik."
                  : "Every article, resource, and analytical essay is curated for real commercial and creative utility. Zero promotional noise, pure knowledge."}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/80 border-t border-border/40 pt-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isAz ? "Aktiv Nəşr Mərkəzi" : "Active Knowledge Hub"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
