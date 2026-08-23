import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Palette, Megaphone, ShieldCheck, Sparkles, Briefcase } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function TopicsSection() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  const topics = [
    {
      id: "design",
      name: isAz ? "Dizayn" : "Design",
      tag: "DESIGN",
      icon: Palette,
      accentColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      hoverBorder: "hover:border-emerald-500/50",
      description: isAz
        ? "Vizual sistemlər, tipoqrafiya, şəbəkə arxitekturası, UI/UX və dizayn sənətkarlığı."
        : "Visual systems, typography, grid architecture, UI/UX, and creative craft.",
    },
    {
      id: "marketing",
      name: isAz ? "Marketinq" : "Marketing",
      tag: "MARKETING",
      icon: Megaphone,
      accentColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
      hoverBorder: "hover:border-cyan-500/50",
      description: isAz
        ? "Konversiya hevristikası, pozisionlaşdırma, mesajlaşma psixologiyası və böyümə modelləri."
        : "Conversion heuristics, positioning, messaging psychology, and growth loops.",
    },
    {
      id: "branding",
      name: isAz ? "Brendinq" : "Branding",
      tag: "BRANDING",
      icon: ShieldCheck,
      accentColor: "border-purple-500/30 bg-purple-500/10 text-purple-400",
      hoverBorder: "hover:border-purple-500/50",
      description: isAz
        ? "Vizual kimlik, brend strategiyası, dizayn tokenləri və bazarda fərqlənmə."
        : "Visual identity, brand strategy, design tokens, and market differentiation.",
    },
    {
      id: "ai-creativity",
      name: isAz ? "Süni İntellekt və Yaradıcılıq" : "AI & Creativity",
      tag: "AI & CREATIVITY",
      icon: Sparkles,
      accentColor: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      hoverBorder: "hover:border-amber-500/50",
      description: isAz
        ? "Generativ iş axınları, promt mühəndisliyi, Sİ incəsənət etikası və sintetik media."
        : "Generative workflows, prompt engineering, AI art ethics, and synthetic media.",
    },
    {
      id: "creative-industry",
      name: isAz ? "Kreativ Sənaye" : "Creative Industry",
      tag: "INDUSTRY",
      icon: Briefcase,
      accentColor: "border-rose-500/30 bg-rose-500/10 text-rose-400",
      hoverBorder: "hover:border-rose-500/50",
      description: isAz
        ? "Karyera dinamikası, çoxsahəli iş axınları və agentlik biznes modelləri."
        : "Career dynamics, multidisciplinary workflows, and agency business models.",
    },
  ];

  return (
    <section id="topics" className="relative px-6 py-24 md:px-10 md:py-32 border-t border-white/10 bg-white/[0.005]">
      <div className="mx-auto max-w-[1600px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4"
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
              ? "Məqalələrimizi əsas redaksiya istiqamətlərimiz üzrə mövzulara görə kəşf edin."
              : "Browse articles by subject matter across our core editorial verticals."}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={topic.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.08}
              >
                <Link
                  to={getLocalizedPath("/blog")}
                  className={`group p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl transition-all duration-300 ${topic.hoverBorder} hover:bg-white/[0.04] hover:-translate-y-1 flex flex-col justify-between h-full aurora-card`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${topic.accentColor} group-hover:scale-110 transition-transform`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider mono uppercase text-muted-foreground/70 border border-white/10 rounded-full px-2.5 py-0.5">
                        {topic.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-primary mono uppercase">
                    <span>{isAz ? "Məqalələri Oxu" : "Explore Category"}</span>
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
