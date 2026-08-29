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
    <section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-b border-border/40">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] sm:text-xs mono uppercase font-bold tracking-[.18em] text-muted-foreground">
              {isAz ? "MƏŞHUR MÖVZULAR VƏ TƏDQİQATLAR" : "POPULAR TOPICS & CURATED GUIDES"}
            </span>
          </div>
          <Link
            to={getLocalizedPath("/blog")}
            className="text-xs mono font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
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
                className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/50 dark:bg-card/30 p-4 sm:p-5 text-left transition-all duration-300 hover:border-foreground/20 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground/60 tracking-wider">
                      0{idx + 1}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-[.12em] text-primary/90 block mb-1.5">
                    {item.category}
                  </span>

                  <h3 className="text-[13px] sm:text-sm font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
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
