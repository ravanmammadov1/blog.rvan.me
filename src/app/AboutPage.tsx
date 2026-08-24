import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass,
  CheckCircle2,
  Cpu,
  Layers,
  Newspaper,
  ShieldCheck,
  Zap,
  ChevronDown,
  UserCheck,
  Quote,
  Feather,
  Eye,
  Check,
  HelpCircle,
} from "lucide-react";
import { Button } from "./components/ui/Button";
import { Eyebrow } from "./components/Eyebrow";

import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";
import { fetchAboutSection, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { AboutSection, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import PageHero from "./components/PageHero";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { ABOUT_FAQS } from "../data/faqData";
import FaqAccordion from "./components/ui/FaqAccordion";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

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

  return (
    <main
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={isAz ? "Haqqımızda — Rvan.me Kreativ Nəşr" : "About — Rvan.me Creative Publication"}
        description={
          isAz
            ? "Rvan.me — dizayn, brendinq, marketinq və süni intellekt sahələrini araşdıran müstəqil kreativ nəşr və bilik platformasıdır."
            : "Rvan.me is an independent creative publication and knowledge platform exploring design, branding, marketing, AI & creativity, and Azerbaijan's creative community."
        }
        url="https://www.rvan.me/about"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* ── 1. ABOUT MASTER HERO ── */}
      <PageHero
        eyebrow={isAz ? "RVAN.ME HAQQINDA · REDAKSİYA BƏYANATI" : "ABOUT RVAN.ME · EDITORIAL STATEMENT"}
        title={isAz ? "KREATİV NƏŞR VƏ" : "CREATIVE PUBLICATION &"}
        accentText={isAz ? "BİLİK PLATFORMASI." : "KNOWLEDGE PLATFORM."}
        description={isAz
          ? "Dizayn, brendinq, marketinq strategiyası, vizual mədəniyyət və yaradıcı texnologiyalar haqqında müstəqil platforma."
          : "An independent creative publication exploring design, branding, marketing strategy, visual culture, and creative technology."}
      >
        <div className="flex flex-col items-center gap-8 pt-2 w-full">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              to={getLocalizedPath("/blog")}
              variant="primary"
              size="lg"
              icon={<ArrowUpRight size={16} />}
            >
              {isAz ? "MƏQALƏLƏRİ OXU" : "READ ARTICLES"}
            </Button>
            <Button
              to={getLocalizedPath("/contributor")}
              variant="secondary"
              size="lg"
              icon={<ArrowRight size={16} />}
            >
              {isAz ? "MÜƏLLİF OLUN" : "BECOME A CONTRIBUTOR"}
            </Button>
          </div>

          {/* Editorial Publication Identity & Pillars Matrix */}
          <div className="w-full max-w-4xl mx-auto pt-8 border-t border-[#DDE1E0] dark:border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-md shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-primary uppercase mb-1">
                  <span>01</span>
                  <span>/</span>
                  <span>{isAz ? "TƏDQİQAT" : "RESEARCH"}</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-foreground">
                  {isAz ? "Koqnitiv UX & Qaydalar" : "Cognitive UX & Heuristics"}
                </div>
                <div className="text-[10px] text-muted-foreground mono mt-0.5">
                  {isAz ? "3 saniyə qaydası & skanlama" : "3s rule & visual scanning"}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-md shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-primary uppercase mb-1">
                  <span>02</span>
                  <span>/</span>
                  <span>{isAz ? "STRATEGİYA" : "STRATEGY"}</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-foreground">
                  {isAz ? "Brend Arxitekturası" : "Brand Architecture"}
                </div>
                <div className="text-[10px] text-muted-foreground mono mt-0.5">
                  {isAz ? "Dəyər təklifi & mövqeləndirmə" : "Value props & positioning"}
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
                icon: Feather,
                titleEn: "Motion, Typography & Graphic Craft",
                titleAz: "Motion, Tipoqrafiya və Qrafik Sənət",
                descEn: "Fluid typography mathematics, kinetic design principles, art direction, and meticulous visual execution.",
                descAz: "Elastik tipoqrafiya riyaziyyatı, kinetik hərəkət qaydaları, art direktorluq və qrafik kompozisiya ustalığı.",
              },
              {
                num: "03",
                icon: Cpu,
                titleEn: "Creative Technology & Applied AI",
                titleAz: "Kreativ Texnologiyalar və Tətbiqi AI",
                descEn: "Practical AI integration, computational design workflows, modern web performance, and algorithmic tools.",
                descAz: "Süni intellektin dizayna real inteqrasiyası, kompüter dizayn iş axınları və müasir veb texnologiyaları.",
              },
              {
                num: "04",
                icon: Compass,
                titleEn: "Behavioral Psychology & Copywriting",
                titleAz: "Davranış Psixologiyası və Kopiraytinq",
                descEn: "Cognitive heuristics, conversion copywriting, ethical UX, perceptual contrast, and mental models.",
                descAz: "Koqnitiv hevristika, konversiya kopiraytinqi, etik UX, vizual kontrast və istifadəçi qərarvermə psixologiyası.",
              },
              {
                num: "05",
                icon: Newspaper,
                titleEn: "Industry Critiques & Community Essays",
                titleAz: "Sənaye Tənqidi və İcma Məqalələri",
                descEn: "Critical perspectives on creative careers, pricing, local industry evolution, and design leadership in Azerbaijan.",
                descAz: "Azərbaycanın kreativ sənayesi, qiymət siyasəti, karyera inkişafı və dizayn liderliyi haqqında tənqidi esselər.",
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="group relative rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">{pillar.num}</span>
                    <Icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {isAz ? pillar.titleAz : pillar.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
                descEn: "Writers receive full attribution, verified profile badges, and direct links to their portfolios.",
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

      {/* ── 5. FOR CONTRIBUTORS ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border bg-card/20">
        <div className="mx-auto max-w-[1280px] grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "MÜƏLLİFLƏR ÜÇÜN" : "FOR CONTRIBUTORS"}
            </Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {isAz
                ? "Azərbaycanın yaradıcı icmasına xitab edən açıq platforma."
                : "A welcoming platform for thoughtful creative voices."}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isAz
                ? "İstər illərin təcrübəsinə malik art direktor, istər brend strateqi, istərsə də maraqlı tədqiqat aparmış gənc dizayner olun — Rvan.me sizin ideyalarınızı geniş yaradıcı auditoriyaya çatdırmaq üçün açıqdır."
                : "Whether you are a seasoned art director, an emerging UI designer, a brand strategist, or a curious researcher — Rvan.me gives your perspective an enduring, verified publication."}
            </p>
            <div className="pt-2">
              <Button
                to={getLocalizedPath("/contributor")}
                variant="primary"
                size="lg"
                icon={<ArrowUpRight size={16} />}
              >
                {isAz ? "MÜƏLLİFLİK ŞƏRTLƏRİNƏ BAX" : "EXPLORE CONTRIBUTOR PROGRAM"}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                titleEn: "Build Your Public Portfolio",
                titleAz: "İctimai Portfolionuzu Qurun",
                descEn: "Your articles remain permanently associated with your verified author profile.",
                descAz: "Məqalələriniz təsdiqlənmiş müəllif profilinizlə daimi olaraq assosiasiya olunur.",
              },
              {
                titleEn: "Editorial Support",
                titleAz: "Redaksiya və Struktur Dəstəyi",
                descEn: "We assist with structure, clarity, and visual polish to ensure your work shines.",
                descAz: "Yazınızın ən yüksək səviyyədə təqdim olunması üçün redaktə və tərtibat dəstəyi veririk.",
              },
              {
                titleEn: "Real Insights",
                titleAz: "Real Oxucu Statistikası",
                descEn: "Track genuine views, comments, and engagement in your private dashboard.",
                descAz: "Yazılarınıza gələn real oxucu baxışlarını və şərhləri şəxsi kabinetinizdən izləyin.",
              },
              {
                titleEn: "Community Impact",
                titleAz: "İcmaya Real Təsir",
                descEn: "Elevate the quality of creative discussion in Azerbaijan and beyond.",
                descAz: "Azərbaycanda və regionda yaradıcı müzakirələrin keyfiyyətinin yüksəlməsinə töhfə verin.",
              },
            ].map((c, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-card space-y-2">
                <span className="text-xs font-mono font-bold text-primary">0{i + 1}</span>
                <h4 className="text-sm font-bold text-foreground">{isAz ? c.titleAz : c.titleEn}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{isAz ? c.descAz : c.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. HOW PUBLISHING WORKS ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border">
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
                titleEn: "Draft & Apply",
                titleAz: "Qaralama və Müraciət",
                descEn: "Sign in with Google, complete your author profile in Settings, and submit your draft.",
                descAz: "Google ilə daxil olun, Tənzimləmələrdə müəllif profilinizi tamamlayın və qaralamanızı göndərin.",
              },
              {
                step: "02",
                titleEn: "Editorial Review",
                titleAz: "Redaksiya Baxışı",
                descEn: "Our editorial team evaluates the submission for originality, clarity, depth, and relevance.",
                descAz: "Redaksiya heyətimiz məqaləni orijinallıq, aydınlıq, dərinlik və aktuallıq üzrə qiymətləndirir.",
              },
              {
                step: "03",
                titleEn: "Collaborative Polish",
                titleAz: "Birgə Redaktə",
                descEn: "If necessary, we provide constructive notes to refine the arguments and layout.",
                descAz: "Ehtiyac olduqda, arqumentlərin və məzmunun cilalanması üçün konstruktiv redaksiya qeydləri təqdim edirik.",
              },
              {
                step: "04",
                titleEn: "Public Showcase",
                titleAz: "İctimai Dərc",
                descEn: "Your article goes live on Rvan.me under your verified author profile and URL.",
                descAz: "Məqaləniz təsdiqlənmiş müəllif profiliniz və xüsusi URL altında Rvan.me-də canlı yayımlanır.",
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

      {/* ── 7. AI POLICY ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border bg-card/30">
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
                : "We embrace modern tools in creative workflows. Contributors are completely free to leverage AI for brainstorming, structuring outlines, exploring arguments, fact-checking, and grammar editing."}
            </p>
            <p>
              {isAz
                ? "Lakin hər bir müəllif dərc olunan fikirlərin, arqumentlərin və faktiki məlumatların dəqiqliyinə şəxsən cavabdehdir. Heç bir insan redaktəsi və orijinal baxış bucağı olmayan, tam avtomatlaşdırılmış səthi məqalələr qətiyyən qəbul edilmir."
                : "However, human authorship and intellectual accountability remain paramount. Contributors are solely responsible for the authenticity, reasoning, and factual accuracy of their published work. Fully automated, unedited AI output will not pass editorial review."}
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. FOUNDER PROFILE ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border">
        <div className="mx-auto max-w-[1280px] grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="h-64 w-64 sm:h-72 sm:w-72 rounded-3xl overflow-hidden border-2 border-primary/40 bg-surface shadow-2xl">
                <picture>
                  <source srcSet={`${RavanPortrait400} 400w, ${RavanPortrait800} 800w, ${RavanPortrait1200} 1200w`} type="image/webp" />
                  <img
                    src={sanityPortraitUrl || RavanPortrait1200}
                    alt="Ravan Mammadov"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </picture>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <Eyebrow className="text-primary tracking-[.2em]">
                {isAz ? "TƏSİSÇİ VƏ REDAKSİYA RƏHBƏRİ" : "FOUNDER & EDITORIAL LEAD"}
              </Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {isAz ? "Rəvan Məmmədov" : "Ravan Mammadov"}
              </h2>
              <p className="text-sm font-mono text-muted-foreground">
                {isAz ? "Aparıcı Kreativ Dizayner & Art Direktor" : "Senior Creative Designer & Art Director"}
              </p>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isAz
                ? "«Rvan.me mənim üçün sadəcə bir portfolio deyil — bu, Azərbaycanın kreativ mühitinə dəyər qatmaq, peşəkar dizayn standartlarını yüksəltmək və intellektual yaradıcı müzakirələr üçün qurulmuş müstəqil bir platformadır.»"
                : "“Rvan.me is more than a creative showcase — it is a platform engineered to elevate regional design dialogue, bridge strategic theory with visual craft, and champion thoughtful voices across Azerbaijan's creative community.”"}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                to={getLocalizedPath("/author/ravan-mammadov")}
                variant="primary"
                size="md"
                icon={<ArrowUpRight size={15} />}
              >
                {isAz ? "MÜƏLLİF PROFİLİNƏ BAX" : "VIEW AUTHOR PROFILE"}
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

      {/* ── 9. FREQUENTLY ASKED QUESTIONS ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border">
        <div className="mx-auto max-w-[1200px]">
          <FaqAccordion
            items={ABOUT_FAQS}
            eyebrow={isAz ? "TEZ-TEZ VERİLƏN SUALLAR" : "FREQUENTLY ASKED QUESTIONS"}
            title={isAz ? "Platforma və Nəşr Haqqında" : "About the Publication"}
            description={
              isAz
                ? "Rvan.me-nin missiyası, auditoriyası və nəşr fəlsəfəsi ilə bağlı ən vacib suallar:"
                : "Essential questions regarding our publication mission, audience, and editorial vision:"
            }
            viewAllHref="/faq"
            viewAllLabel={isAz ? "BÜTÜN SUALLARA BAX (10)" : "VIEW ALL FAQS (10)"}
            showNumbers={true}
          />
        </div>
      </section>

      {/* ── 10. FINAL CONTRIBUTOR CALL TO ACTION ── */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-b from-card to-background p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-3">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "İDEYANIZ VAR?" : "HAVE AN IDEA WORTH SHARING?"}
            </Eyebrow>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {isAz ? "Paylaşmağa dəyər bir fikriniz var?" : "Have an idea worth sharing?"}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {isAz
                ? "Bildikləriniz, öyrəndikləriniz, araşdırdıqlarınız və ya fərqli gördüyünüz yanaşmalar haqqında yazın. Öz peşəkar ictimai profilinizi yaradın və ilk məqalənizi göndərin."
                : "Write about what you know, what you've learned, what you've researched or what you see differently. Create your profile and submit your first article."}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              to={getLocalizedPath("/contributor")}
              variant="primary"
              size="lg"
              icon={<ArrowRight size={16} />}
            >
              {isAz ? "MÜƏLLİF OLUN" : "BECOME A CONTRIBUTOR"}
            </Button>
          </div>

          <p className="text-[11px] font-mono text-muted-foreground">
            {isAz ? "Profilinizi yaradın. İlk məqalənizi redaksiyaya təqdim edin." : "Create your profile. Submit your first article."}
          </p>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
