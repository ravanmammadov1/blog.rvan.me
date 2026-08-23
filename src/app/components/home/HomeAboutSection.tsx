import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, UserCheck, BookOpenCheck } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { Button } from "../ui/Button";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HomeAboutSection() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <section id="about-summary" className="relative px-6 py-24 md:px-10 md:py-32 border-t border-white/10 bg-white/[0.01]">
      <div className="mx-auto max-w-[1600px] relative z-10">
        <div className="p-8 md:p-14 rounded-3xl border border-white/15 bg-white/[0.02] backdrop-blur-2xl aurora-card">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
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

              <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-medium">
                {isAz
                  ? "Rvan.me — dizayn, marketinq, brendinq, vizual mədəniyyət, süni intellekt və yaradıcılıq, eləcə də kreativ sənayeni araşdıran müstəqil kreativ nəşr və bilik platformasıdır. Biz ideyaları araşdırmaq, yaradıcı işləri təhlil etmək və faydalı bilikləri bölüşmək üçün fəaliyyət göstəririk."
                  : "Rvan.me is a creative publication and knowledge platform exploring design, marketing, branding, visual culture, AI & creativity, and the creative industry. The platform exists to explore ideas, analyze creative work, and share useful knowledge."}
              </p>

              {/* Founder Subsection */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-primary mono uppercase">
                  <UserCheck size={14} />
                  <span>{isAz ? "Təsisçi: Rəvan Məmmədov" : "Founded by Ravan Mammadov"}</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground/80 leading-relaxed font-medium">
                  {isAz
                    ? "Rəvan Məmmədov vizual mədəniyyət, brendlər, texnologiya və kreativ strategiyanın kəsişməsini araşdıran dizayner və marketoloqdur."
                    : "Ravan Mammadov is a designer and marketer exploring the intersection of visual culture, brands, technology and creative strategy."}
                </p>
              </div>

              <div className="pt-4">
                <Button
                  to={getLocalizedPath("/about")}
                  variant="primary"
                  size="md"
                  icon={<ArrowUpRight size={15} />}
                >
                  {isAz ? "RƏVAN HAQQINDA ƏTRAFLI ÖYRƏN" : "LEARN MORE ABOUT RAVAN"}
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
              <div className="p-8 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md space-y-6 w-full max-w-md shadow-2xl">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <BookOpenCheck size={22} />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {isAz ? "Açıq Redaksiya Bəyanatı" : "Editorial Philosophy"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {isAz
                    ? "Hər bir məqalə, resurs və analitik esse real kommersiya və yaradıcı faydalılıq üçün hazırlanır. Reklam səs-küyü olmadan təmiz bilik."
                    : "Every article, resource, and analytical essay is curated for real commercial and creative utility. Zero promotional noise, pure knowledge."}
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs text-muted-foreground mono border-t border-white/10 pt-4">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
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
