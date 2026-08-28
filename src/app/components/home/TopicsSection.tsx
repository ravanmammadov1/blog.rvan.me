import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { TOPICS_CATALOG } from "../../../lib/topicRegistry";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function TopicsSection() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <section id="topics" className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border bg-surface/30">
      <div className="mx-auto max-w-[1280px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-4"
        >
          <div>
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "BİLİK İNDEKSİ" : "KNOWLEDGE INDEX"}
            </Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Mövzular" : "Topics"}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground font-medium max-w-md">
            {isAz
              ? "Məqalələrimizi əsas redaksiya istiqamətlərimiz üzrə 6 mövzuya görə kəşf edin."
              : "Browse articles by subject matter across our 6 core editorial verticals."}
          </p>
        </motion.div>

        {/* 3x2 Grid on Desktop (6 Topics Total) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS_CATALOG.map((topic, idx) => {
            const Icon = topic.icon;
            const topicName = isAz ? topic.name.az : topic.name.en;
            const topicDesc = isAz ? topic.description.az : topic.description.en;

            return (
              <motion.div
                key={topic.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.06}
              >
                <Link
                  to={getLocalizedPath(`/topics/${topic.slug}`)}
                  className="group relative p-6 md:p-8 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-gradient-to-b from-white/95 to-white/75 dark:from-[#141519]/90 dark:to-[#0c0d10]/90 shadow-[0_4px_20px_rgba(15,23,42,0.03)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-primary/40 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.65)] flex flex-col justify-between h-full backdrop-blur-xl overflow-hidden"
                >
                  {/* Top Ambient Glow Accent */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border shadow-2xs ${topic.accentColor} group-hover:scale-105 transition-transform duration-300`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider mono uppercase text-muted-foreground border border-border/80 rounded-md px-2.5 py-0.5 bg-muted/40 dark:bg-white/[0.03]">
                        {topic.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2.5 tracking-tight">
                      {topicName}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal">
                      {topicDesc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/50 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary mono uppercase tracking-wider">
                      {isAz ? "Mövzuya Bax" : "Explore Topic"}
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-background/80 text-muted-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:text-black transition-all duration-300 shadow-2xs">
                      <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
