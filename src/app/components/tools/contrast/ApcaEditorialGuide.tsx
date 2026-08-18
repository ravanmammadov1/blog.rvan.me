import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Compass, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Scale, Lightbulb } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

export default function ApcaEditorialGuide() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <article aria-labelledby="apca-guide-title" className="mt-20 border-t border-white/10 pt-16 space-y-16">
      {/* 1. Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mono uppercase mb-3">
          <BookOpen size={14} />
          {isAz ? "ƏLÇATANLIQ VƏ PERSEPTUAL KONTRAST TƏDQİQATI" : "ACCESSIBILITY & VISION RESEARCH"}
        </div>
        <h2 id="apca-guide-title" className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {isAz
            ? "APCA (Perseptual Kontrast) və Ənənəvi WCAG 2.1 Fərqi Nədir?"
            : "Understanding APCA: Perceptual Contrast vs. Traditional WCAG 2.x"}
        </h2>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          {isAz
            ? "Rəqəmsal interfeyslərdə illərdir istifadə olunan 4.5:1 kontrast nisbəti insan gözünün biologiyasını tam əks etdirmir. W3C Silver üçün hazırlanan APCA alqoritmi şriftin qalınlığını, ölçüsünü və ekran parıltısını nəzərə alaraq dəqiq oxunaqlıq modeli təqdim edir."
            : "For over two decades, the web relied on the simplistic WCAG 2.x 4.5:1 mathematical luminance ratio. APCA (Advanced Perceptual Contrast Algorithm) represents a major paradigm shift, modeling actual human vision, spatial frequency, and text weight across modern high-DPI and OLED displays."}
        </p>
      </div>

      {/* 2. Core Comparison Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Concept 1: Spatial Frequency & Weight */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
            1
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {isAz ? "Məkan Tezliyi və Şrift Çəkisi" : "Spatial Frequency & Font Weight"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAz
              ? "İncə (300 çəki) şriftlər eyni rəngdə qalın (700 çəki) şriftlərə nisbətən göz üçün daha zəif görünür. Ənənəvi WCAG 2.1 şrift çəkisini nəzərə almır, lakin APCA hər bir ölçü və çəki üçün fərdi Lc həddi tələb edir."
              : "Thin 300-weight typography stimulates fewer photoreceptors on the human retina than bold 700-weight glyphs. While WCAG 2.x treats all weights identically, APCA scales its required Lightness Contrast (Lc) dynamically based on stroke width."}
          </p>
        </div>

        {/* Concept 2: Polarity Effect (Normal vs. Reverse) */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold">
            2
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {isAz ? "Polyarlıq Effekti (Tünd və Açıq Rejim)" : "The Polarity Effect (Dark vs. Light Mode)"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAz
              ? "Ağ fon üzərində qara mətn (Normal polyarlıq) göz bəbəyini daraldır və mətni kəskin göstərir. Qara fon üzərində ağ mətn (Tərs polyarlıq) isə işıq haləsi (haloing) yaradır. APCA bu fərqi xüsusi müsbət və mənfi Lc tənlikləri ilə dəqiq hesablayır."
              : "Black text on a white canvas causes pupil constriction and crisp focus. White text on an OLED black background causes visual halation and optical flare. APCA models this asymmetry with separate normal and reverse polarity curves."}
          </p>
        </div>
      </div>

      {/* 3. APCA Tiers Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck size={20} className="text-primary" />
          {isAz ? "APCA Lc Qiymətləndirmə Şkalası" : "APCA Lightness Contrast (Lc) Rating Levels"}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs mono">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground">
                <th className="pb-3 font-semibold">{isAz ? "Hədd (Lc)" : "Threshold (Lc)"}</th>
                <th className="pb-3 font-semibold">{isAz ? "İstifadə Sahəsi" : "Recommended Context"}</th>
                <th className="pb-3 font-semibold">{isAz ? "Minimal Şrift Ölçüsü" : "Min Font Size & Weight"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-foreground/90">
              <tr>
                <td className="py-3 font-bold text-emerald-400">Lc 90+</td>
                <td className="py-3">Preferred Body Copy (Fluent reading)</td>
                <td className="py-3 text-muted-foreground">≥14px Regular (400) / Any text</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-emerald-400">Lc 75+</td>
                <td className="py-3">Standard Content Text (Baseline)</td>
                <td className="py-3 text-muted-foreground">≥16px Regular (400) / ≥14px Bold (700)</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-sky-400">Lc 60+</td>
                <td className="py-3">Subheadings & Large Body Text</td>
                <td className="py-3 text-muted-foreground">≥24px Regular (400) / ≥18px Bold (700)</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-amber-400">Lc 45+</td>
                <td className="py-3">Large Display Headlines & Buttons</td>
                <td className="py-3 text-muted-foreground">≥36px Regular (400) / ≥24px Bold (700)</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-orange-400">Lc 30+</td>
                <td className="py-3">Non-Text UI, Icons & Form Borders</td>
                <td className="py-3 text-muted-foreground">Active UI components / Decorative ≥48px</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-rose-400">Lc &lt; 30</td>
                <td className="py-3">Subtle / Disabled Elements Only</td>
                <td className="py-3 text-muted-foreground">Not suitable for readable typography</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Legal Compliance & WCAG Relationship */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.03] p-6 space-y-4">
        <h3 className="text-lg font-bold text-sky-400 flex items-center gap-2">
          <Scale size={18} />
          {isAz ? "Hüquqi Əlçatanlıq Standartları və WCAG 2.1" : "Legal Standards & WCAG 2.1 Compliance"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isAz
            ? "Mühüm qeyd: Hazırda dünya üzrə hüquqi əlçatanlıq tələbləri (məsələn, ADA, Section 508, EAA) rəsmi olaraq WCAG 2.1 standartlarına (AA üçün 4.5:1) əsaslanır. APCA gələcək WCAG 3.0 modeli kimi təqdim olunur və dizaynerlərə daha yüksək estetik və dəqiq oxunaqlıq təmin etmək üçün bələdçilik edir."
            : "Important compliance note: Current international accessibility legislation (ADA, Section 508, European Accessibility Act) legally enforces WCAG 2.1 AA (4.5:1 ratio for normal text). APCA is the working standard for W3C Silver (WCAG 3.0), providing product designers with far greater nuance and visual ergonomics."}
        </p>
      </div>

      {/* 5. Contextual Ecosystem Cross-Links */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mono">
          <Sparkles size={14} />
          {isAz ? "ƏLAQƏLİ ALƏTLƏR VƏ TƏDQİQAT MƏQALƏLƏRİ" : "RELATED TOOLS & EDITORIAL RESEARCH"}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to={getLocalizedPath("/tools/typography-scale")}
            className="group rounded-xl border border-primary/30 bg-primary/[0.02] p-4 transition-all duration-300 hover:border-primary hover:bg-primary/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary mono">
              {isAz ? "Alət" : "Tool"} · Typography
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {isAz ? "Elastik Tipoqrafiya Miqyası və CSS Clamp" : "Typography Scale & CSS Clamp Calculator"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "Riyazi modul miqyaslar və axıcı şrift ölçüsü generatoru." : "Generate responsive modular type scales and copy exact CSS clamp() tokens."}
            </p>
          </Link>

          <Link
            to={getLocalizedPath("/blog/why-contrast-makes-designs-impossible-to-ignore-von-restorff")}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-primary/50 hover:bg-white/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary mono">
              {isAz ? "Məqalə" : "Essay"} · Psychology
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {isAz ? "Kontrast və Von Restorff Effekti" : "Why Contrast Makes Designs Impossible to Ignore"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "Vizual fərq və insan yaddaşının qavrayış biologiyası." : "The isolation effect: How human memory prioritizes distinct visual stimuli."}
            </p>
          </Link>

          <Link
            to={getLocalizedPath("/blog/psychology-of-dark-mode-oled-black-ui")}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-sky-400/50 hover:bg-white/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mono">
              {isAz ? "Məqalə" : "Essay"} · Dark Mode
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-sky-400 transition-colors">
              {isAz ? "Qaranlıq Rejim Psixologiyası və OLED UI" : "The Psychology of Dark Mode & OLED Black UI"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "OLED piksellər, göz yorğunluğu və tərs polyarlıq fizikası." : "Halation, retinal strain, and the ergonomics of true black interfaces."}
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
}
