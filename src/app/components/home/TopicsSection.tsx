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
    <section id="topics" className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border bg-background">
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
                  className="group p-6 md:p-8 rounded-3xl border border-border bg-card shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] dark:shadow-none dark:hover:shadow-primary/5 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${topic.accentColor} group-hover:scale-105 transition-transform`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider mono uppercase text-muted-foreground border border-border rounded-md px-2.5 py-0.5 bg-muted/40">
                        {topic.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors mb-2">
                      {topicName}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                      {topicDesc}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-primary mono uppercase">
                    <span>{isAz ? "Mövzuya Bax" : "Explore Topic"}</span>
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
