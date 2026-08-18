import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Brain, Compass, ArrowRight, Zap, Target } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

export default function PersuasionEditorialGuide() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <article aria-labelledby="persuasion-guide-title" className="mt-20 border-t border-white/10 pt-16 space-y-16">
      {/* 1. Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mono uppercase mb-3">
          <Brain size={14} />
          {isAz ? "MARKETİNQ PSİXOLOGİYASI VƏ KOQNİTİV AUDİT" : "MARKETING PSYCHOLOGY & CONVERSION RESEARCH"}
        </div>
        <h2 id="persuasion-guide-title" className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {isAz
            ? "Yüksək Təsirli Kopiraytinqin Elmi Prinsipləri"
            : "The Cognitive Mechanics of High-Converting Copywriting"}
        </h2>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          {isAz
            ? "Müasir istifadəçilər veb səhifələri oxumur — onları skan edir. Qərar vermə prosesi saniyələr içində baş verir. Uğurlu marketinq mətni süni zəkadan deyil, aydın psixoloji strukturlardan, konkret nəticələrdən və minimum zehni maneələrdən güc alır."
            : "Modern digital visitors scan before they read. Cognitive heuristics govern whether a visitor bounces within 3 seconds or converts into a long-term customer. Persuasive copy relies on transparent psychological clarity, measurable transformation, and frictionless action triggers."}
        </p>
      </div>

      {/* 2. Core Pillars Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-foreground">
            {isAz ? "Koqnitiv Asanlıq (Cognitive Fluency)" : "Cognitive Fluency & Simplicity"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAz
              ? "İnsan beyni dərk etməsi asan olan məlumatları avtomatik olaraq daha etibarlı və doğru qəbul edir. Mürəkkəb korporativ jargon inamı azaldır."
              : "The human brain inherently equates easy-to-process information with truth and reliability. Unnecessary corporate jargon spikes cognitive fatigue and erodes conversion intent."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-foreground">
            {isAz ? "Empirik Konkretlik (Concreteness)" : "Empirical Concreteness & Numbers"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAz
              ? "'Ən yaxşı' və 'inqilabi' kimi sözlər şübhə yaradır. Konkret rəqəmlər (məsələn, '3 qat daha sürətli', '500+ komanda') isə sübut kimi qəbul olunur."
              : "Vague superlatives ('best', 'revolutionary') activate natural skepticism. Concrete metrics ('3x faster', '14,000+ teams') trigger immediate empirical belief."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
            3
          </div>
          <h3 className="text-base font-bold text-foreground">
            {isAz ? "Risk Ləğvi və Zəmanət (Risk Reversal)" : "Risk Reversal & Loss Aversion"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAz
              ? "İstifadəçilər qazanacaqları faydadan çox, itirəcəkləri vaxt və ya puldan qorxurlar. Risksiz sınaq və sadə ləğvetmə qərar vermə baryerini aradan qaldırır."
              : "Prospects fear prospective loss more intensely than they anticipate gain. Explicit risk-reversal micro-copy ('No credit card required', 'Cancel anytime') unlocks immediate action."}
          </p>
        </div>
      </div>

      {/* 3. Contextual Ecosystem Cross-Links */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mono">
          <Sparkles size={14} />
          {isAz ? "ƏLAQƏLİ TƏDQİQAT MƏQALƏLƏRİ VƏ DİZAYN ALƏTLƏRİ" : "RELATED RESEARCH ESSAYS & PRODUCT SUITE"}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to={getLocalizedPath("/tools/contrast-matrix")}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-primary hover:bg-white/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary mono">
              {isAz ? "Alət" : "Tool"} · Accessibility
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {isAz ? "APCA Kontrast Matrisi" : "APCA Contrast Matrix"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "W3C Silver perseptual kontrast və 2D şrift matrisi." : "Perceptual contrast calculator and 2D typography compliance grid."}
            </p>
          </Link>

          <Link
            to={getLocalizedPath("/tools/typography-scale")}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-sky-400 hover:bg-white/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mono">
              {isAz ? "Alət" : "Tool"} · Typography
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-sky-400 transition-colors">
              {isAz ? "Elastik Tipoqrafiya Miqyası" : "Typography Scale Calculator"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "CSS clamp() və modul şrift iyerarxiyaları." : "Responsive modular type scale generator with CSS clamp() tokens."}
            </p>
          </Link>

          <Link
            to={getLocalizedPath("/blog/why-contrast-makes-designs-impossible-to-ignore-von-restorff")}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-amber-400 hover:bg-white/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mono">
              {isAz ? "Məqalə" : "Essay"} · Psychology
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-amber-400 transition-colors">
              {isAz ? "Kontrast və Von Restorff Effekti" : "Why Contrast Makes Designs Pop"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "Vizual fərqlilik və insan yaddaşının biologiyası." : "The isolation effect: How the brain prioritizes standout stimuli."}
            </p>
          </Link>

          <Link
            to={getLocalizedPath("/blog/why-the-number-3-appears-everywhere-in-design")}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-emerald-400 hover:bg-white/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mono">
              {isAz ? "Məqalə" : "Essay"} · Cognitive Load
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
              {isAz ? "3 Rəqəmi Niyə Hər Yerdədir?" : "The Rule of 3 in Design"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "Triada strukturu və qısa müddətli yaddaş limiti." : "Cognitive chunking and why triadic messaging converts best."}
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
}
