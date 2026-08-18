import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Compass, Sparkles, CheckCircle2, ArrowRight, HelpCircle, Layers } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

export default function TypeScaleEditorialGuide() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <article aria-labelledby="guide-title" className="mt-20 border-t border-white/10 pt-16 space-y-16">
      {/* 1. Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mono uppercase mb-3">
          <BookOpen size={14} />
          {isAz ? "TİPOQRAFİYA TƏDQİQATI VƏ MƏLUMAT" : "COMPREHENSIVE DESIGN GUIDE"}
        </div>
        <h2 id="guide-title" className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {isAz
            ? "Elastik Tipoqrafiya Miqyası və CSS Clamp Necə İşləyir?"
            : "Understanding Fluid Typography Scales & CSS clamp()"}
        </h2>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          {isAz
            ? "Müasir rəqəmsal məhsullarda şrift ölçülərini hər ekran ölçüsündə media query (@media) ilə dəyişmək əvəzinə, riyazi nisbətlər və CSS clamp() funksiyası ilə tam axıcı və fasiləsiz iyerarxiya qurulur."
            : "In modern responsive design, managing typography across dozens of device breakpoints with static media queries creates fragile layouts and jarring visual shifts. Fluid type scales solve this by calculating smooth, continuous size interpolation."}
        </p>
      </div>

      {/* 2. Core Concepts Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Concept 1: What is a Modular Scale? */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
            1
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {isAz ? "Modul Şrift Miqyası Nədir?" : "What Is a Modular Type Scale?"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAz
              ? "Modul miqyas musiqi intervallarına (məsələn, 1.200 Kiçik Tersiya və ya 1.333 Xalis Kvarta) əsaslanan ardıcıl həndəsi silsilədir. Hər bir başlıq ölçüsü təsadüfi seçilmir, vahid əmsal ilə artırılaraq təbii vizual ahəng yaradır."
              : "A modular scale is a sequence of numbers related by a fixed geometric ratio (such as 1.250 Major Third or 1.333 Perfect Fourth). Instead of picking arbitrary pixel values, every heading level derives harmonically from the base body font."}
          </p>
        </div>

        {/* Concept 2: The Mathematics of CSS clamp() */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
            2
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {isAz ? "CSS clamp() Riyaziyyatı Necə Hesablanır?" : "The Mathematics of CSS clamp()"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAz
              ? "clamp(min, fluid, max) funksiyasında fluid hissə xətti interpolyasiya tənliyi ilə hesablanır: y = slope * x + intercept. Bu, şriftin Wmin (375px) və Wmax (1280px) arasında ekran eninə mütənasib hamar böyüməsini təmin edir."
              : "CSS clamp(min, fluid, max) clamps a value between lower and upper bounds. The fluid middle expression uses linear interpolation: y = mx + b, where the slope matches the rate of change between your minimum and maximum viewports."}
          </p>
        </div>
      </div>

      {/* 3. Common Modular Scales Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
        <h3 className="text-xl font-bold text-foreground">
          {isAz ? "Ən Populyar Modul Miqyas Nisbətləri" : "Standard Modular Scale Ratios Compared"}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs mono">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground">
                <th className="pb-3 font-semibold">{isAz ? "Nisbət Adı" : "Ratio Name"}</th>
                <th className="pb-3 font-semibold">{isAz ? "Əmsal" : "Multiplier"}</th>
                <th className="pb-3 font-semibold">{isAz ? "Musiqi İntervalı" : "Harmonic Interval"}</th>
                <th className="pb-3 font-semibold">{isAz ? "Tövsiyə Edilən İstifadə" : "Best Use Case"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-foreground/90">
              <tr>
                <td className="py-3 font-bold text-primary">Minor Second</td>
                <td className="py-3">1.067</td>
                <td className="py-3 text-muted-foreground">15:16</td>
                <td className="py-3 text-muted-foreground">Dashboards, dense data tables, smartwatches</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-primary">Major Second</td>
                <td className="py-3">1.125</td>
                <td className="py-3 text-muted-foreground">8:9</td>
                <td className="py-3 text-muted-foreground">Technical docs, corporate software, forms</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-primary">Minor Third</td>
                <td className="py-3">1.200</td>
                <td className="py-3 text-muted-foreground">5:6</td>
                <td className="py-3 text-muted-foreground">Mobile web apps, content feeds, blogs</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-primary">Major Third</td>
                <td className="py-3">1.250</td>
                <td className="py-3 text-muted-foreground">4:5</td>
                <td className="py-3 text-muted-foreground">Modern SaaS, standard editorial websites</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-primary">Perfect Fourth</td>
                <td className="py-3">1.333</td>
                <td className="py-3 text-muted-foreground">3:4</td>
                <td className="py-3 text-muted-foreground">Marketing landing pages, digital portfolios</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-primary">Golden Ratio</td>
                <td className="py-3">1.618</td>
                <td className="py-3 text-muted-foreground">1:1.618 (φ)</td>
                <td className="py-3 text-muted-foreground">Magazine covers, high-impact creative showcases</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Accessibility & Best Practices */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 space-y-4">
        <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={18} />
          {isAz ? "Əlçatanlıq (WCAG 2.2) və rem Vahidləri" : "Accessibility (WCAG 2.2) & rem Unit Integrity"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isAz
            ? "CSS clamp() daxilində bütün ölçüləri həmişə rem vahidləri ilə təyin etmək zəruridir. Bu, görmə zəifliyi olan istifadəçilərin brauzer böyütmə tənzimləməsini (Zoom) dəyişdikdə şriftin proporsional böyüməsini təmin edir və WCAG 2.2 SC 1.4.4 standartına tam cavab verir."
            : "Always declare minimum and maximum clamp limits using relative rem units rather than static px values. This guarantees full compatibility with user browser zoom settings and system accessibility font enlargement (WCAG 2.2 Success Criterion 1.4.4: Resize text up to 200%)."}
        </p>
      </div>

      {/* 5. Contextual Ecosystem Cross-Links */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mono">
          <Sparkles size={14} />
          {isAz ? "ƏLAQƏLİ TƏDQİQAT MƏQALƏLƏRİ VƏ RESURSLAR" : "RELATED EDITORIAL ESSAYS & RESOURCES"}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to={getLocalizedPath("/blog/why-some-fonts-feel-expensive-gotham-typography")}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-primary/50 hover:bg-white/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary mono">
              {isAz ? "Məqalə" : "Essay"} · Typography
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {isAz ? "Bəzi Şriftlər Niyə Bahalı, Bəziləri İctimai Görünür?" : "Why Do Some Fonts Feel Expensive and Others Feel Cheap?"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "Gotham və siyasi brendinq tipoqrafiyasının psixologiyası." : "The psychology of political branding, luxury proportions, and font authority."}
            </p>
          </Link>

          <Link
            to={getLocalizedPath("/blog/why-helvetica-became-the-font-of-corporate-america")}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-primary/50 hover:bg-white/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary mono">
              {isAz ? "Məqalə" : "Essay"} · Design History
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {isAz ? "Helvetica Niyə Korporativ Amerikanın Rəsmi Şrifti Oldu?" : "Why Did Helvetica Become the Official Font of Corporate America?"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "İsveçrə modernizmi və obyektiv vizual nizam." : "Swiss modernist objectivity and the quest for neutral corporate identity."}
            </p>
          </Link>

          <Link
            to={getLocalizedPath("/resources?category=fonts")}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-sky-400/50 hover:bg-white/[0.05]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mono">
              {isAz ? "Resurs" : "Resource"} · Typography
            </span>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground group-hover:text-sky-400 transition-colors">
              {isAz ? "2,000+ Açıq Mənbəli Google Şrifti" : "Browse 2,000+ Google Font Families"}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {isAz ? "Canlı sınaq, çəki seçimi və CSS @import kodları." : "Explore live specimens, weight testing, and commercial-free SIL licenses."}
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
}
