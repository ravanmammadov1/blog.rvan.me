import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Layers, Eye, BookOpen, Type } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function CuratedGuidesSection() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  const popularConcepts = [
    {
      id: "visual-hierarchy",
      title: isAz ? "Vizual İyerarxiya & 3 Saniyə Qaydası" : "Visual Hierarchy & 3s Scanning",
      category: isAz ? "DİZAYN · KOQNİTİV" : "DESIGN · COGNITIVE",
      path: "/blog/visual-hierarchy-framework-web-interfaces",
      icon: Layers,
      accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "apca-contrast",
      title: isAz ? "APCA Kontrast & Əlçatanlıq Elmi" : "APCA Contrast & Accessibility",
      category: isAz ? "ƏLÇATANLIQ · ELM" : "ACCESSIBILITY · SCIENCE",
      path: "/blog/apca-vs-wcag-contrast-accessibility-guide",
      icon: Eye,
      accent: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "cognitive-copywriting",
      title: isAz ? "Koqnitiv Kopiraytinq Çərçivəsi" : "Cognitive Copywriting Model",
      category: isAz ? "PSİXOLOGİYA · UX" : "PSYCHOLOGY · UX",
      path: "/blog/guide-cognitive-conversion-copywriting",
      icon: BookOpen,
      accent: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "fluid-typography",
      title: isAz ? "Axıcı Tipoqrafiya Arxitekturası" : "Fluid Typography Architecture",
      category: isAz ? "ARXİTEKTURA · KOD" : "ARCHITECTURE · CODE",
      path: "/blog/guide-responsive-fluid-typography-css-clamp",
      icon: Type,
      accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-b border-border/40">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-[11px] sm:text-xs mono uppercase font-bold tracking-[.18em] text-muted-foreground">
              {isAz ? "MƏŞHUR MÖVZULAR VƏ TƏDQİQATLAR" : "POPULAR TOPICS & CURATED GUIDES"}
            </span>
          </div>
          <Link
            to={getLocalizedPath("/blog")}
            className="text-xs mono font-bold text-primary hover:underline flex items-center gap-1 transition-transform hover:translate-x-0.5"
          >
            <span>{isAz ? "Bütün məqalələr" : "View all articles"}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularConcepts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={getLocalizedPath(item.path)}
                className="group relative flex flex-col justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card/60 dark:bg-card/40 p-4 sm:p-5 text-left backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:border-primary/40 dark:hover:border-white/20 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.55)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl border shadow-2xs transition-transform duration-300 group-hover:scale-105 ${item.accent}`}>
                        <Icon size={15} />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground/50 tracking-wider">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border/80 bg-background/80 text-muted-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:text-black transition-all duration-300 shadow-2xs shrink-0">
                      <ArrowUpRight
                        size={12}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>

                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-[.14em] text-muted-foreground/80 group-hover:text-primary transition-colors block mb-1.5">
                    {item.category}
                  </span>

                  <h3 className="text-xs sm:text-[13px] font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
