import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Users,
  Compass,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";

import { fetchAboutSection, fetchSiteSettings } from "../lib/sanityQueries";
import { AboutSection, SiteSettings } from "../types/cms";
import { urlFor } from "../lib/sanityClient";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Eyebrow } from "./components/Eyebrow";
import { Button } from "./components/ui/Button";
import GlobalFaqSection from "./components/GlobalFaqSection";
import { ABOUT_FAQS } from "../data/faqData";

import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function AboutPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
    fetchAboutSection(language).then((data) => {
      if (data) setAboutData(data);
    });
  }, [language]);

  const sanityPortraitUrl = aboutData?.profilePhoto
    ? urlFor(aboutData.profilePhoto)?.width(1200).height(1200).url()
    : null;

  const founderDisplayName = isAz ? "Rəvan Məmmədov" : "Ravan Mammadov";

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={isAz ? "Haqqımızda — Rvan.me Nəşriyyatı" : "About — Rvan.me Publication"}
        description={
          isAz
            ? "Rvan.me dizayn, brend arxitekturası, marketinq, texnologiya və yaradıcı sənaye üçün müstəqil intellektual platformadır."
            : "Rvan.me is an independent creative publication and knowledge ecosystem dedicated to design systems, branding, technology, and strategic perspectives."
        }
        url="https://www.rvan.me/about"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* ── 1. HERO SECTION ── */}
      <PageHero
        title={isAz ? "KREATIV NƏŞRİYYAT &" : "CREATIVE PUBLICATION &"}
        accentText={isAz ? "BİLİK PLATFORMASI." : "KNOWLEDGE PLATFORM."}
        eyebrow={isAz ? "MANIFEST VƏ REDAKSİYA MİSSİYASI" : "MANIFESTO & EDITORIAL MISSION"}
        contentClassName="max-w-4xl"
        description={
          <span className="space-y-4 block">
            <span className="block text-foreground font-semibold text-lg sm:text-xl md:text-2xl leading-relaxed">
              {isAz
                ? "Dizayn sistemləri, brend arxitekturası, motion qrafika və müasir rəqəmsal mədəniyyət haqqında müstəqil analitik nəşr."
                : "An independent creative publication and knowledge ecosystem exploring design systems, brand architecture, motion dynamics, and emerging visual culture."}
            </span>
            <span className="block text-muted-foreground text-sm sm:text-base leading-relaxed">
              {isAz
                ? "Rvan.me estetik dəqiqliyi strateji dərinliklə birləşdirən peşəkarlar, tədqiqatçılar və yaradıcı düşüncə sahibləri üçün təsis edilmişdir."
                : "Founded by senior creative designer Ravan Mammadov to bridge aesthetic craft with strategic rigor for designers, marketers, and researchers."}
            </span>
          </span>
        }
      >
        {/* Metric / Stat Pillars */}
        <div className="mt-8 sm:mt-10 border-t border-[#DDE1E0] dark:border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-md shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-primary uppercase mb-1">
                  <span>01</span>
                  <span>/</span>
                  <span>{isAz ? "NƏŞR" : "EDITORIAL"}</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-foreground">
                  {isAz ? "Dərin Təhlillər" : "Substantive Essays"}
                </div>
                <div className="text-[10px] text-muted-foreground mono mt-0.5">
                  {isAz ? "Keyfiyyətli məqalələr" : "Original analysis"}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-md shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-primary uppercase mb-1">
                  <span>02</span>
                  <span>/</span>
                  <span>{isAz ? "RESURSLAR" : "RESOURCES"}</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-foreground">
                  {isAz ? "Kurasiya Olunmuş" : "Curated Tools"}
                </div>
                <div className="text-[10px] text-muted-foreground mono mt-0.5">
                  {isAz ? "Şriftlər & alətlər" : "Fonts & specimens"}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-md shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-primary uppercase mb-1">
                  <span>03</span>
                  <span>/</span>
                  <span>{isAz ? "MƏDƏNİYYƏT" : "CULTURE"}</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-foreground">
                  {isAz ? "Vizual Dialoq" : "Visual Discourse"}
                </div>
                <div className="text-[10px] text-muted-foreground mono mt-0.5">
                  {isAz ? "Yaradıcı icma & ekosistem" : "Creative community"}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-md shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-primary uppercase mb-1">
                  <span>04</span>
                  <span>/</span>
                  <span>{isAz ? "MÜƏLLİFLİK" : "AUTHORS"}</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-foreground">
                  {isAz ? "Təsdiqlənmiş Müəlliflər" : "Verified Authorship"}
                </div>
                <div className="text-[10px] text-muted-foreground mono mt-0.5">
                  {isAz ? "Qalıcı rəqəmsal arxiv" : "Permanent digital archive"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHero>

      {/* ── 2. WHY RVAN.ME EXISTS ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border">
        <div className="mx-auto max-w-[1280px] grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "MİSSİYAMIZ VƏ MƏQSƏDİMİZ" : "WHY RVAN.ME EXISTS"}
            </Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {isAz
                ? "Səthi səs-küydən uzaq, dərin və qalıcı düşüncə üçün məkan."
                : "A permanent home for rigorous, substantive creative thinking."}
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              {isAz
                ? "Rəqəmsal dünyada və xüsusən yerli yaradıcı mühitdə söhbətlər çox vaxt sosial media lentlərinin keçici alqoritmlərində itir. Dizayn təkcə vizual estetikadan ibarət deyil — o, koqnitiv psixologiya, biznes strategiyası və mədəni kodların kəsişməsidir."
                : "Too much creative dialogue in our region is fragmented, superficial, or buried within fleeting social media algorithms. Design is not mere decoration — it is a discipline where cognitive psychology, business strategy, and cultural identity intersect."}
            </p>
            <p>
              {isAz
                ? "Rvan.me məhz buna görə yaradıldı: dizaynerlər, marketoloqlar, brend strateqləri və tədqiqatçılar üçün nəzəri dərinliyi praktiki tətbiqlə birləşdirən, müəllifin adına bağlanan və illər sonra da dəyərini itirməyən analitik məqalələr dərc etmək."
                : "Rvan.me was created to change that: to give designers, marketers, brand strategists, and researchers a permanent, respectable platform that bridges theoretical rigor with actionable utility — published with verified attribution."}
            </p>
            <div className="p-6 rounded-2xl border border-border bg-card/60 space-y-2">
              <div className="text-xs font-bold font-mono text-primary uppercase tracking-wider">
                {isAz ? "ƏSAS DƏYƏR TƏKLİFİ" : "OUR CORE PROPOSITION"}
              </div>
              <p className="text-foreground font-semibold text-base sm:text-lg">
                {isAz
                  ? "«Fikirləriniz dəyərlidir. Adınızla qalan, icmaya təsir edən məzmun yaradın.»"
                  : "“Your ideas deserve a permanent place. Build something that stays with your name.”"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. WHAT WE PUBLISH (EDITORIAL PILLARS) ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border bg-card/20">
        <div className="mx-auto max-w-[1280px] space-y-12">
          <div className="max-w-3xl space-y-4">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "NƏŞR İSTİQAMƏTLƏRİ" : "WHAT WE PUBLISH"}
            </Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isAz ? "5 Əsas Redaksiya Sütunu" : "Five Core Editorial Pillars"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isAz
                ? "Rvan.me-də dərc olunan hər bir yazı bu əsas sahələrdən birinə fokuslanır:"
                : "Every article published on Rvan.me explores one of these foundational domains:"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                num: "01",
                icon: Layers,
                titleEn: "Visual Strategy & Brand Systems",
                titleAz: "Vizual Strategiya və Brend Sistemləri",
                descEn: "Case studies, identity architectures, brand positioning, and the semiotics of modern visual culture.",
                descAz: "Brend memarlığı, vizual identiklik sistemləri, bazar mövqeləndirilməsi və vizual semiotika təhlilləri.",
              },
              {
                num: "02",
                icon: Compass,
                titleEn: "Motion Dynamics & Creative Tech",
                titleAz: "Motion Dinamikası və Yaradıcı Texnologiya",
                descEn: "Spatial design, keyframing craft, real-time rendering, dynamic interfaces, and creative engineering.",
                descAz: "Məkan dizaynı, keyframe sənətkarlığı, dinamik interfeyslər və yaradıcı texnoloji həllər.",
              },
              {
                num: "03",
                icon: BookOpen,
                titleEn: "Cognitive Psychology & Interaction",
                titleAz: "Koqnitiv Psixologiya və İnteraksiya",
                descEn: "Mental models, visual hierarchy, user attention patterns, and behavioral design research.",
                descAz: "Zehni modellər, vizual iyerarxiya, istifadəçi diqqət nümunələri və davranış dizaynı araşdırmaları.",
              },
              {
                num: "04",
                icon: Users,
                titleEn: "Marketing & Creative Strategy",
                titleAz: "Marketinq və Yaradıcı Strategiya",
                descEn: "Cross-platform campaigns, communication architecture, narrative design, and commercial brand growth.",
                descAz: "Çoxkanallı kampaniyalar, kommunikasiya memarlığı, hekayəçilik və kommersiya brendlərinin inkişafı.",
              },
              {
                num: "05",
                icon: Sparkles,
                titleEn: "Typography, Tools & Ecosystems",
                titleAz: "Tipoqrafiya, Alətlər və Ekosistemlər",
                descEn: "Type design history, curated open-source tooling, font specimens, and digital workflow optimization.",
                descAz: "Şrift dizayn tarixi, seçilmiş açıq mənbəli alətlər, şrift nümayişləri və rəqəmsal iş axını optimizasiyası.",
              },
            ].map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-primary">{pillar.num}</span>
                    <IconComponent size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {isAz ? pillar.titleAz : pillar.titleEn}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {isAz ? pillar.descAz : pillar.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. EDITORIAL PRINCIPLES ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border">
        <div className="mx-auto max-w-[1280px] space-y-12">
          <div className="max-w-3xl space-y-4">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "REDAKSİYA STANDARTLARI" : "EDITORIAL PRINCIPLES"}
            </Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isAz ? "Bizim Üçün Əsas Olan Standartlar" : "How We Maintain Quality"}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                titleEn: "Depth Over Clicks",
                titleAz: "Səs-küy Əvəzinə Dərinlik",
                descEn: "No clickbait, no generic lists. Every article must offer non-obvious insights and thorough research.",
                descAz: "Klik yığan başlıqlar yoxdur. Hər bir yazı orijinal analiz və dərindən araşdırılmış fikirlər tələb edir.",
              },
              {
                titleEn: "Empirical Clarity",
                titleAz: "Praktiki və Dəqiq Məzmun",
                descEn: "We value actionable principles, concrete case evidence, and structured argumentation over vague speculation.",
                descAz: "Mücərrəd mülahizələr yerinə real layihə sübutları, strukturlaşdırılmış arqumentlər və aydın məntiq.",
              },
              {
                titleEn: "Author Attribution",
                titleAz: "Daimi Müəlliflik Hüququ",
                descEn: "Writers receive full attribution, verified author profiles, and direct links to their portfolios.",
                descAz: "Hər bir müəllifə tam ictimai profil, təsdiqlənmiş müəlliflik nişanı və portfolio linkləri verilir.",
              },
              {
                titleEn: "Respect for Readers",
                titleAz: "Oxucuya Hörmət",
                descEn: "Zero invasive popups, zero sponsored disguises, and immaculate typography engineered for comfort.",
                descAz: "Maneə törədən reklamlar yoxdur. Rahat oxu üçün kalibrlənmiş təmiz və peşəkar tipoqrafiya.",
              },
            ].map((principle, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-border bg-card space-y-2.5">
                <CheckCircle2 size={18} className="text-primary" />
                <h3 className="text-base font-bold text-foreground">
                  {isAz ? principle.titleAz : principle.titleEn}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAz ? principle.descAz : principle.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW PUBLISHING WORKS ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border bg-card/20">
        <div className="mx-auto max-w-[1280px] space-y-12">
          <div className="max-w-3xl space-y-4">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "NƏŞR PROSESİ" : "HOW PUBLISHING WORKS"}
            </Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isAz ? "4 Sadə və Şəffaf Addım" : "Transparent 4-Step Editorial Lifecycle"}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                titleEn: "Submit Your Article",
                titleAz: "Məqalənizi Təqdim Edin",
                descEn: "Share your article idea, draft, or finished piece directly through our /write submission portal.",
                descAz: "Məqalə ideyanızı, qaralamanızı və ya hazır yazınızı birbaşa /write portalımız vasitəsilə göndərin.",
              },
              {
                step: "02",
                titleEn: "Editorial Evaluation",
                titleAz: "Redaksiya Baxışı",
                descEn: "Our editorial team evaluates the submission for originality, clarity, depth, and relevance.",
                descAz: "Redaksiya heyətimiz məqaləni orijinallıq, aydınlıq, dərinlik və aktuallıq üzrə qiymətləndirir.",
              },
              {
                step: "03",
                titleEn: "Collaborative Polish",
                titleAz: "Birgə Redaktə",
                descEn: "If necessary, we provide constructive notes to refine arguments and typography before publishing.",
                descAz: "Ehtiyac olduqda, məzmunun və tipoqrafiyanın cilalanması üçün konstruktiv redaksiya qeydləri təqdim edirik.",
              },
              {
                step: "04",
                titleEn: "Public Publication",
                titleAz: "İctimai Dərc",
                descEn: "Your article goes live on Rvan.me under your verified name, bio, and permanent URL.",
                descAz: "Məqaləniz adınız, bioqrafiyanız və xüsusi URL altında Rvan.me-də canlı yayımlanır.",
              },
            ].map((st) => (
              <div key={st.step} className="p-6 rounded-2xl border border-border bg-card space-y-3 relative">
                <span className="text-2xl font-black font-mono text-primary/30">{st.step}</span>
                <h3 className="text-base font-bold text-foreground">{isAz ? st.titleAz : st.titleEn}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{isAz ? st.descAz : st.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. AI POLICY ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border">
        <div className="mx-auto max-w-[1280px] grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "SÜNİ İNTELLEKT SİYASƏTİ" : "AI EDITORIAL POLICY"}
            </Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {isAz
                ? "Süni intellekt alət kimi təqdir olunur, əvəzedici kimi deyil."
                : "AI is an amplifier for human thinking, not a substitute."}
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              {isAz
                ? "Biz yaradıcılıqda və tədqiqatda müasir texnologiyaların tərəfdarıyıq. Süni intellektdən beyin həmləsi, ilkin strukturlaşdırma, faktların axtarışı və qrammatik cilalama üçün istifadə etməkdə heç bir məhdudiyyət yoxdur."
                : "We embrace modern tools in creative workflows. Authors are completely free to leverage AI for brainstorming, structuring outlines, exploring arguments, fact-checking, and grammar editing."}
            </p>
            <p>
              {isAz
                ? "Lakin hər bir müəllif dərc olunan fikirlərin, arqumentlərin və faktiki məlumatların dəqiqliyinə şəxsən cavabdehdir. Heç bir insan redaktəsi və orijinal baxış bucağı olmayan, tam avtomatlaşdırılmış səthi məqalələr qəbul edilmir."
                : "However, human authorship and intellectual accountability remain paramount. Authors are solely responsible for the authenticity, reasoning, and factual accuracy of their published work. Fully automated, unedited AI output will not pass editorial review."}
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. FOUNDER PROFILE ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border bg-card/20">
        <div className="mx-auto max-w-[1280px] grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="h-64 w-64 sm:h-72 sm:w-72 rounded-3xl overflow-hidden border-2 border-primary/40 bg-surface shadow-2xl">
                <picture>
                  <source srcSet={`${RavanPortrait400} 400w, ${RavanPortrait800} 800w, ${RavanPortrait1200} 1200w`} type="image/webp" />
                  <img
                    src={sanityPortraitUrl || RavanPortrait1200}
                    alt={founderDisplayName}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </picture>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <Eyebrow className="text-primary tracking-[.2em]">
                {isAz ? "TƏSİSÇİ VƏ KREATİV STRATEQ" : "FOUNDER & CREATIVE STRATEGIST"}
              </Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {founderDisplayName}
              </h2>
              <p className="text-sm font-mono text-muted-foreground">
                {isAz ? "Kreativ Strateq · Dizayner · Marketoloq" : "Creative Strategist · Designer · Marketer"}
              </p>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isAz
                ? "«Rvan.me mənim üçün sadəcə bir portfolio deyil — bu, Azərbaycanın kreativ mühitinə dəyər qatmaq, peşəkar dizayn standartlarını yüksəltmək və intellektual yaradıcı müzakirələr üçün qurulmuş müstəqil platformadır.»"
                : "“Rvan.me is more than a creative showcase — it is a platform engineered to elevate regional design dialogue, bridge strategic theory with visual craft, and champion thoughtful perspectives across the creative community.”"}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                to={getLocalizedPath("/about/ravan-mammadov")}
                variant="primary"
                size="md"
                icon={<ArrowUpRight size={15} />}
              >
                {isAz ? "TƏSİSÇİ SƏHİFƏSİNƏ BAX" : "VIEW FOUNDER PROFILE"}
              </Button>
              <Button
                to={getLocalizedPath("/ravan-mammadov")}
                variant="secondary"
                size="md"
              >
                {isAz ? "CV VƏ TƏCRÜBƏ" : "FULL BIO & EXPERIENCE"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. EDITORIAL INVITATION (SHARE YOUR IDEAS) ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-b from-card to-background p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-3">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "REDAKSİYA DƏVƏTİ" : "EDITORIAL INVITATION"}
            </Eyebrow>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {isAz ? "Paylaşmağa dəyər bir fikriniz var?" : "Have an idea worth sharing?"}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {isAz
                ? "Dizayn, yaradıcılıq, texnologiya, marketinq, mədəniyyət və kreativ sənayeni formalaşdıran ideyalar haqqında maraqlı fikirləriniz varsa, onları bizimlə bölüşün."
                : "We welcome original perspectives on design, creativity, technology, marketing, and the ideas shaping the creative industry. Submit your article for editorial review."}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              to={getLocalizedPath("/write")}
              variant="primary"
              size="lg"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              {isAz ? "FİKRİNİZİ BİZİMLƏ PAYLAŞIN" : "SHARE YOUR IDEAS"}
            </Button>
          </div>
        </div>
      </section>

      {/* ── 9. GLOBAL FAQ SECTION (IMMEDIATELY BEFORE FOOTER) ── */}
      <GlobalFaqSection
        items={ABOUT_FAQS}
        eyebrow={isAz ? "TEZ-TEZ VERİLƏN SUALLAR" : "FREQUENTLY ASKED QUESTIONS"}
        title={isAz ? "Platforma və Nəşr Haqqında" : "About the Publication"}
        description={
          isAz
            ? "Rvan.me-nin missiyası, auditoriyası və nəşr fəlsəfəsi ilə bağlı ən vacib suallar:"
            : "Essential questions regarding our publication mission, audience, and editorial vision:"
        }
      />

      {/* ── 10. GLOBAL FOOTER ── */}
      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
