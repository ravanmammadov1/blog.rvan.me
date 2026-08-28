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
    <section id="about-summary" className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border/70 bg-surface/20">
      <div className="mx-auto max-w-[1280px] relative z-10">
        <div className="p-8 md:p-12 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-gradient-to-b from-white/95 to-white/80 dark:from-[#141519]/90 dark:to-[#0c0d10]/90 shadow-[0_8px_32px_rgba(15,23,42,0.04)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Platform Information */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-6"
            >
              <Eyebrow className="text-primary tracking-[.2em]">
                {isAz ? "PLATFORMA HAQQINDA" : "PLATFORM VISION"}
              </Eyebrow>

              <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground leading-tight">
                {isAz ? "Rvan.me Haqqında" : "About Rvan.me"}
              </h2>

              <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-normal">
                {isAz
                  ? "Rvan.me — dizayn, marketinq, brendinq, vizual mədəniyyət, süni intellekt və yaradıcılıq, eləcə də kreativ sənayeni araşdıran müstəqil kreativ nəşr və bilik platformasıdır. Biz ideyaları araşdırmaq, yaradıcı işləri təhlil etmək və faydalı bilikləri bölüşmək üçün fəaliyyət göstəririk."
                  : "Rvan.me is a creative publication and knowledge platform exploring design, marketing, branding, visual culture, AI & creativity, and the creative industry. The platform exists to explore ideas, analyze creative work, and share useful knowledge."}
              </p>

              {/* Founder Subsection */}
              <div className="pt-6 border-t border-border/70 dark:border-white/10 space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-primary mono uppercase">
                  <UserCheck size={14} />
                  <span>{isAz ? "Təsisçi: Rəvan Məmmədov" : "Founded by Ravan Mammadov"}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                  {isAz
                    ? "Rəvan Məmmədov vizual mədəniyyət, brendlər, texnologiya və kreativ strategiyanın kəsişməsini araşdıran dizayner və marketoloqdur."
                    : "Ravan Mammadov is a designer and marketer exploring the intersection of visual culture, brands, technology and creative strategy."}
                </p>
              </div>

              <div className="pt-2">
                <Button
                  to={getLocalizedPath("/about")}
                  variant="primary"
                  size="md"
                  icon={<ArrowUpRight size={15} />}
                >
                  {isAz ? "RVAN.ME HAQQINDA ƏTRAFLI ÖYRƏN" : "LEARN MORE ABOUT RVAN.ME"}
                </Button>
              </div>
            </motion.div>

            {/* Editorial Feature Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="p-8 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-slate-50/90 dark:bg-white/[0.04] space-y-5 w-full max-w-md shadow-2xs backdrop-blur-md">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-2xs">
                  <BookOpenCheck size={20} />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {isAz ? "Açıq Redaksiya Bəyanatı" : "Editorial Philosophy"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                  {isAz
                    ? "Hər bir məqalə, resurs və analitik esse real kommersiya və yaradıcı faydalılıq üçün hazırlanır. Reklam səs-küyü olmadan təmiz bilik."
                    : "Every article, resource, and analytical essay is curated for real commercial and creative utility. Zero promotional noise, pure knowledge."}
                </p>
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground mono border-t border-border/70 dark:border-white/10 pt-4">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isAz ? "Aktiv Nəşr Mərkəzi" : "Active Knowledge Hub"}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
