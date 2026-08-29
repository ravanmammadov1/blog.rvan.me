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
    <section id="topics" className="relative px-4 sm:px-6 md:px-10 py-16 sm:py-24 lg:py-28 border-b border-border/40">
      <div className="mx-auto max-w-[1280px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-border/60 pb-6 gap-4"
        >
          <div>
            <Eyebrow className="text-muted-foreground">
              {isAz ? "03 / BİLİK İNDEKSİ" : "03 / KNOWLEDGE INDEX"}
            </Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Mövzular" : "Topics"}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground font-normal max-w-md leading-relaxed">
            {isAz
              ? "Məqalələrimizi əsas redaksiya istiqamətlərimiz üzrə 6 mövzuya görə kəşf edin."
              : "Browse articles by subject matter across our 6 core editorial verticals."}
          </p>
        </motion.div>

        {/* 3x2 Grid on Desktop (6 Topics Total) */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                custom={idx * 0.05}
              >
                <Link
                  to={getLocalizedPath(`/topics/${topic.slug}`)}
                  className="group relative p-6 sm:p-7 rounded-2xl liquid-glass liquid-glass-interactive flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 dark:bg-white/[0.05] text-foreground border border-border/40">
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-muted-foreground/70">
                        {topic.tag}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2 tracking-tight">
                      {topicName}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal">
                      {topicDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-wider">
                      {isAz ? "Mövzuya Bax" : "Explore Topic"}
                    </span>
                    <ArrowUpRight size={14} className="text-muted-foreground/60 group-hover:text-primary transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
