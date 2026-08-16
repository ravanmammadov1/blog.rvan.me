import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Sparkles, ShieldCheck, FileText, Printer, Palette, Download, Wand2 } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { buildPeepSvg, PREMADE_PEEPS } from "../tools/openpeeps/peepsAssets";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: "easeInOut" },
  }),
};

export default function ToolsSection() {
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <section id="tools" className="relative px-6 py-24 md:px-10 md:py-36 overflow-hidden">
      {/* Subtle section aurora background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 10% 80%, rgba(97,197,173,0.08) 0%, rgba(66,111,186,0.04) 50%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1600px] relative z-10 space-y-12">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-end justify-between border-b border-white/10 pb-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">
              {t("sectionToolsEyebrow", "IN-BROWSER WORKFLOW ENGINE")}
            </Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.05em] md:text-5xl text-foreground">
              {t("sectionToolsTitle", "Featured Interactive Tools.")}
            </h2>
          </div>
          <Link
            to={getLocalizedPath("/tools")}
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            {t("viewAllUtilities", "VIEW ALL IN-BROWSER UTILITIES")}
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* ── 2 FLAGSHIP INTERACTIVE TOOLS GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. ATS RESUME & CV BUILDER */}
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-8 md:p-10 shadow-2xl flex flex-col justify-between hover:border-primary/40 transition-all duration-300"
          >
            <div className="space-y-6">
              {/* Badge & Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-primary uppercase border border-primary/30 bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles size={11} /> {isAz ? "YENİ ALƏT" : "FLAGSHIP TOOL"}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                  <ShieldCheck size={11} /> 100% ATS COMPLIANT
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {isAz ? "ATS Resume & CV Hazırlayıcı" : "ATS Resume & CV Builder"}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Canva stilində birbaşa sənəd üzərində redaktə, real vaxt ATS auditi, 8 HR təsdiqli şablon (RenderCV, ModernCV, Onyx) və 1 kliklə < 300KB A4 PDF yükləmə."
                    : "Canva-style direct document editor with live ATS scoring audit, 8 HR-approved templates (RenderCV, ModernCV, Onyx), and 1-click < 300KB A4 PDF export."}
                </p>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono text-neutral-300">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                  <FileText size={12} className="text-primary" /> {isAz ? "8 Şablon" : "8 Templates"}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                  <Printer size={12} className="text-primary" /> {isAz ? "A4 PDF (< 300KB)" : "A4 PDF (< 300KB)"}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                  <Wand2 size={12} className="text-primary" /> {isAz ? "Birbaşa Redaktə" : "Direct Canvas"}
                </span>
              </div>
            </div>

            {/* Action Link */}
            <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                to={getLocalizedPath("/tools/resume-builder")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black text-xs font-mono font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 group-hover:scale-105"
              >
                <span>{isAz ? "CV HAZIRLA" : "LAUNCH RESUME BUILDER"}</span>
                <ArrowUpRight size={14} />
              </Link>

              <span className="text-[11px] font-mono text-muted-foreground uppercase hidden sm:inline">
                {isAz ? "Pulsuz & Limitsiz" : "Free & In-Browser"}
              </span>
            </div>
          </motion.article>

          {/* 2. OPEN PEEPS CHARACTER BUILDER */}
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-8 md:p-10 shadow-2xl flex flex-col justify-between hover:border-primary/40 transition-all duration-300"
          >
            <div className="space-y-6">
              {/* Badge & Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-primary uppercase border border-primary/30 bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Palette size={11} /> {isAz ? "İLLÜSTRASİYA ALƏTİ" : "CREATIVE STUDIO"}
                </span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2.5 py-1 rounded-full uppercase">
                  584,688+ COMBINATIONS
                </span>
              </div>

              {/* Title & Description with Live Preview */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {isAz ? "Personaj Quraşdırıcı Aləti" : "Character Builder Tool"}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {isAz
                      ? "Modul əl ilə çəkilmiş vektor illüstrasiya və personaj generatoru. Üz ifadələri, saç düzümləri, aksesuarlar və geyimləri birləşdirin, təmiz SVG və PNG ixrac edin."
                      : "Modular hand-drawn vector illustration and character generator. Mix facial expressions, hairstyles, poses, and clothing with instant clean SVG & high-res PNG export."}
                  </p>
                </div>

                {/* Mini SVG Character Preview */}
                <div
                  className="shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white p-1.5 border border-white/20 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-110 group-hover:rotate-2 transition-all duration-300"
                  dangerouslySetInnerHTML={{
                    __html: buildPeepSvg(PREMADE_PEEPS[0]?.config || {
                      mode: "bust",
                      headExpression: "smile",
                      hairStyle: "medium_bob",
                      accessory: "none",
                      bodyPose: "sweater",
                      skinColor: "#ffffff",
                      hairColor: "#111111",
                      clothingColor: "#111111",
                      backgroundColor: "#ffffff",
                      inkStyle: "bw",
                      flipHorizontal: false,
                      scale: 1,
                    }, 64),
                  }}
                />
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono text-neutral-300">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                  <Download size={12} className="text-primary" /> {isAz ? "SVG & PNG İxracı" : "SVG & PNG Export"}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                  <Palette size={12} className="text-primary" /> {isAz ? "Fərdi Rənglər" : "Custom Colors"}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                  <Sparkles size={12} className="text-primary" /> {isAz ? "Kommersiya Lisenziyası" : "CC0 License"}
                </span>
              </div>
            </div>

            {/* Action Link */}
            <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                to={getLocalizedPath("/tools/open-peeps")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black text-xs font-mono font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 group-hover:scale-105"
              >
                <span>{isAz ? "PERSONAJ YARAT" : "LAUNCH CHARACTER BUILDER"}</span>
                <ArrowUpRight size={14} />
              </Link>

              <span className="text-[11px] font-mono text-muted-foreground uppercase hidden sm:inline">
                {isAz ? "100% Pulsuz" : "100% Free & Open"}
              </span>
            </div>
          </motion.article>
        </div>

        {/* Mobile View All Link */}
        <div className="flex justify-center md:hidden pt-4">
          <Link
            to={getLocalizedPath("/tools")}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold tracking-[.14em] text-foreground transition-all duration-300 hover:bg-white/10 hover:border-white/20 mono"
          >
            {t("viewAllUtilities", "VIEW ALL IN-BROWSER UTILITIES")}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
