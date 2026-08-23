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
import { useLanguage } from "../lib/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

interface FaqItem {
  id: number;
  qEn: string;
  qAz: string;
  aEn: string;
  aAz: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    qEn: "What is Rvan.me?",
    qAz: "Rvan.me nədir?",
    aEn: "Rvan.me is an independent creative publication exploring design, branding, marketing, visual culture, technology and the creative industry.",
    aAz: "Rvan.me — dizayn, brendinq, marketinq, vizual mədəniyyət, texnologiya və yaradıcı sənayeni araşdıran müstəqil kreativ nəşr və bilik platformasıdır.",
  },
  {
    id: 2,
    qEn: "Who can become a contributor?",
    qAz: "Kimlər müəllif ola bilər?",
    aEn: "Designers, marketers, writers, students, researchers, strategists and creative professionals — anyone with an interesting perspective or valuable idea to share.",
    aAz: "Dizaynerlər, marketoloqlar, yazıçılar, tələbələr, tədqiqatçılar, strateqlər və kreativ mütəxəssislər — maraqlı baxış bucağı və ya bölüşməyə dəyərli ideyası olan hər kəs.",
  },
  {
    id: 3,
    qEn: "Do I need to be a professional to contribute?",
    qAz: "Müəllif olmaq üçün peşəkar təcrübə mütləqdirmi?",
    aEn: "No. Professional experience is welcome, but it is not a requirement. We care about the quality of your thinking, research and perspective.",
    aAz: "Xeyr. Peşəkar təcrübə təqdir olunur, lakin mütləq şərt deyil. Bizim üçün əsas meyar düşüncənizin dərinliyi, araşdırmanızın keyfiyyəti və təqdim etdiyiniz fərqli baxış bucağıdır.",
  },
  {
    id: 4,
    qEn: "Can I write in Azerbaijani?",
    qAz: "Azərbaycan dilində yaza bilərəmmi?",
    aEn: "Yes. Azerbaijani is one of the primary languages of Rvan.me and we especially welcome thoughtful contributions from Azerbaijan's creative community.",
    aAz: "Bəli. Azərbaycan dili Rvan.me-nin əsas dillərindən biridir və biz xüsusilə Azərbaycanın kreativ icmasından olan analitik və məzmunlu yazıların dərk olunmasını dəstəkləyirik.",
  },
  {
    id: 5,
    qEn: "Can I use AI when writing?",
    qAz: "Yazarkən süni intellektdən (AI) istifadə edə bilərəmmi?",
    aEn: "Yes. AI may be used for research, brainstorming, outlining, fact-checking and editing. However, contributors are responsible for the ideas, research, accuracy and final voice of their work. Fully AI-generated, low-effort articles are not accepted.",
    aAz: "Bəli. Süni intellektdən araşdırma, beyin həmləsi, struktur qurma, faktların yoxlanılması və redaktə üçün istifadə edilə bilər. Lakin müəllif ideyaların orijinallığına, dəqiqliyinə və üslubuna şəxsən cavabdehdir. Tamamilə AI tərəfindən yazılmış səthi məqalələr qəbul edilmir.",
  },
  {
    id: 6,
    qEn: "Does every submitted article get published?",
    qAz: "Göndərilən hər məqalə avtomatik dərc olunurmu?",
    aEn: "No. Every submission goes through editorial review. We may accept it, request revisions or decline it.",
    aAz: "Xeyr. Hər bir yazı redaksiya baxışından keçir. Redaksiya məqaləni birbaşa qəbul edə, təkmilləşdirmə üçün düzəlişlər tələb edə və ya qəbul etməyə bilər.",
  },
  {
    id: 7,
    qEn: "How does the editorial review work?",
    qAz: "Redaksiya baxışı prosesi necə işləyir?",
    aEn: "We look at originality, relevance, clarity, research quality, usefulness and the author's perspective.",
    aAz: "Biz məqalənin orijinallığını, mövzunun aktuallığını, fikirlərin aydınlığını, araşdırma keyfiyyətini və oxucu üçün faydalılıq dərəcəsini qiymətləndiririk.",
  },
  {
    id: 8,
    qEn: "How long does review usually take?",
    qAz: "Məqalənin yoxlanılması nə qədər vaxt aparır?",
    aEn: "Editorial review typically takes between 2 to 5 business days. You can track your article's live status inside your Settings / Contributor dashboard.",
    aAz: "Redaksiya baxışı adətən 2-5 iş günü çəkir. Məqalənizin statusunu birbaşa Tənzimləmələr / Müəlliflik kabinetinizdən izləyə bilərsiniz.",
  },
  {
    id: 9,
    qEn: "Can I write about my own work or experience?",
    qAz: "Öz layihələrim və ya şəxsi təcrübəm haqqında yaza bilərəmmi?",
    aEn: "Yes, case studies and practical reflections are welcome as long as they provide educational value, actionable lessons, or honest critique rather than pure self-promotion.",
    aAz: "Bəli. Praktiki layihə təhlilləri (case study) və şəxsi təcrübələr oxucu üçün öyrədici dərslər və real fayda təqdim etdiyi halda çox dəyərlidir.",
  },
  {
    id: 10,
    qEn: "Can I promote my business or service?",
    qAz: "Öz biznesimi və ya xidmətimi reklam edə bilərəmmi?",
    aEn: "Self-promotion is allowed only when it provides genuine editorial value. Rvan.me should not be used for promotional spam, disguised advertising or SEO-only content.",
    aAz: "Özünü tanıtma yalnız məqalənin tərkibində real məzmun dəyəri daşıdıqda məqbuldur. Rvan.me birbaşa reklam çarxı, spam və ya sadəcə SEO xatirinə yazılmış məzmunlar üçün nəzərdə tutulmayıb.",
  },
  {
    id: 11,
    qEn: "Will my name and profile appear on the article?",
    qAz: "Məqalədə adım və ictimai profilim görünəcəkmi?",
    aEn: "Yes. Approved articles are published under the contributor's profile and include their biography, role, verified badge, and relevant social/portfolio links.",
    aAz: "Bəli. Təsdiqlənmiş məqalələr müəllifin ictimai profili altında dərc olunur və bioqrafiyanız, peşəkar titulunuz, təsdiq nişanınız və sosial/portfolio linkləriniz göstərilir.",
  },
  {
    id: 12,
    qEn: "Can I edit my article after publishing?",
    qAz: "Məqalə dərc olunduqdan sonra ona düzəliş edə bilərəmmi?",
    aEn: "Minor typo corrections can be requested through your contributor panel. For major conceptual changes, the revision will be reviewed by the editorial team before updating.",
    aAz: "Kiçik orfoqrafik düzəlişləri müəllif paneliniz vasitəsilə bildirə bilərsiniz. Əsaslı məzmun dəyişiklikləri isə yenidən redaksiya tərəfindən təsdiqləndikdən sonra yenilənir.",
  },
  {
    id: 13,
    qEn: "Can readers comment on my article?",
    qAz: "Oxucular məqaləmə şərh yaza bilərmi?",
    aEn: "Yes. Authenticated community members can engage with your article, ask questions, leave feedback, and react with discussions.",
    aAz: "Bəli. Daxil olmuş icma üzvləri məqalənizə şərh yaza, suallar verə və peşəkar müzakirələrdə iştirak edə bilərlər.",
  },
  {
    id: 14,
    qEn: "Can I submit more than one article?",
    qAz: "Birdən çox məqalə göndərə bilərəmmi?",
    aEn: "Yes. Contributors are encouraged to publish regularly and build an ongoing body of work on Rvan.me.",
    aAz: "Bəli. Müəlliflər istənilən sayda məqalə təqdim edə və Rvan.me üzərində öz şəxsi müəllif arxivlərini zənginləşdirə bilərlər.",
  },
  {
    id: 15,
    qEn: "Can I submit an article that was published elsewhere?",
    qAz: "Əvvəllər başqa yerdə dərc olunmuş məqaləni göndərə bilərəmmi?",
    aEn: "We prioritize original, first-run publications. If an article was previously published on your personal blog or Medium, it must be adapted, revised, and clearly disclosed with canonical attribution.",
    aAz: "Biz ilkin və orijinal yazılara üstünlük veririk. Əgər yazı şəxsi bloqunuzda və ya Medium-da paylaşılıbsa, o yenidən işlənməli və ilkin mənbə aydın şəkildə qeyd olunmalıdır.",
  },
  {
    id: 16,
    qEn: "Why should I become a contributor?",
    qAz: "Niyə Rvan.me-də müəllif olmalıyam?",
    aEn: "Publishing on Rvan.me gives you a public place to develop and share your professional perspective. Your approved articles become part of your author profile and public body of work.",
    aAz: "Rvan.me-də dərc olunmaq sizə peşəkar baxış bucağınızı formalaşdırmaq və icma ilə bölüşmək üçün nüfuzlu platforma verir. Yazılarınız ictimai müəllif profilinizin və portfolio arxivinizin daimi hissəsinə çevrilir.",
  },
  {
    id: 17,
    qEn: "Is contributing paid?",
    qAz: "Müəlliflərə qonorar ödənilirmi?",
    aEn: "Rvan.me is an independent, non-commercial community publication. Community submissions are currently voluntary, providing authors with editorial guidance, professional visibility, and verified public attribution.",
    aAz: "Rvan.me müstəqil, qeyri-kommersiya icma nəşridir. İcma töhfələri hazırda könüllü əsaslarla qəbul olunur və müəlliflərə redaksiya dəstəyi, peşəkar görünürlük və təsdiqlənmiş ictimai müəlliflik imkanı verir.",
  },
  {
    id: 18,
    qEn: "How do I become a contributor?",
    qAz: "Müəllif olmaq üçün nə etməliyəm?",
    aEn: "Sign in with Google, navigate to the Contributor page or Settings (/profile), fill out your author profile, and submit your first draft for editorial review.",
    aAz: "Google hesabınızla daxil olun, Müəlliflik səhifəsinə və ya Tənzimləmələrə (/profile) keçin, müəllif profilinizi doldurun və ilk qaralamanızı redaksiyaya göndərin.",
  },
];

export default function AboutPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

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

  const toggleFaq = (id: number) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

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

      {/* ── 1. ABOUT HERO SECTION ── */}
      <section className="relative px-6 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24 border-b border-border">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-4xl space-y-6"
          >
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "MÜSTƏQİL KREATİV NƏŞR VƏ BİLİK PLATFORMASI" : "INDEPENDENT CREATIVE PUBLICATION & KNOWLEDGE PLATFORM"}
            </Eyebrow>

            <h1
              className="font-extrabold tracking-tight leading-[1.08] text-foreground"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.2rem)" }}
            >
              {isAz ? "Vizual strategiyanın təhlili." : "Deconstructing visual strategy."}
              <br />
              <span className="bg-gradient-to-r from-[#61c5ad] via-[#6099df] to-[#bc66c5] bg-clip-text text-transparent">
                {isAz ? "Brendlərin, mədəniyyətin və sənayenin mənası." : "Decoding brands, culture & the creative industry."}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-normal leading-relaxed max-w-3xl">
              {isAz
                ? "Rvan.me — dizayn, brendinq, marketinq strategiyası, vizual mədəniyyət və yaradıcı texnologiyaları dərindən araşdıran, Azərbaycanın kreativ icmasını vahid intellektual məkanda birləşdirən müstəqil nəşr platformasıdır."
                : "Rvan.me is an independent creative publication exploring design, branding, marketing strategy, visual culture, and creative technology — providing Azerbaijan's creative community with a focused intellectual home."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
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
          </motion.div>
        </div>
      </section>

      {/* ── 2. WHY RVAN.ME EXISTS ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border">
        <div className="mx-auto max-w-[1600px] grid gap-12 lg:grid-cols-12 items-start">
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
        <div className="mx-auto max-w-[1600px] space-y-12">
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
        <div className="mx-auto max-w-[1600px] space-y-12">
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
        <div className="mx-auto max-w-[1600px] grid gap-12 lg:grid-cols-12 items-center">
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
        <div className="mx-auto max-w-[1600px] space-y-12">
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
        <div className="mx-auto max-w-[1600px] grid gap-10 lg:grid-cols-12 items-start">
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
        <div className="mx-auto max-w-[1600px] grid gap-12 lg:grid-cols-12 items-center">
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

      {/* ── 9. FREQUENTLY ASKED QUESTIONS (ACCORDION) ── */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-b border-border">
        <div className="mx-auto max-w-[1200px] space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "TEZ-TEZ VERİLƏN SUALLAR" : "FREQUENTLY ASKED QUESTIONS"}
            </Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {isAz ? "Müəlliflik və Nəşr Haqqında Ətraflı" : "Everything You Need to Know"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isAz
                ? "Rvan.me nəşr prosesi, redaksiya qaydaları və müəlliflik imkanları ilə bağlı ən vacib sualların cavabları:"
                : "Clear, transparent answers regarding our publication, editorial review, and contributor standards:"}
            </p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              const formattedId = item.id < 10 ? `0${item.id}` : `${item.id}`;
              return (
                <div key={item.id} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                    className="w-full py-6 flex items-center justify-between gap-6 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6 min-w-0">
                      <span className="font-mono text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                        {formattedId}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {isAz ? item.qAz : item.qEn}
                      </h3>
                    </div>

                    <div
                      className={`h-8 w-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-primary text-primary-foreground border-primary" : "text-muted-foreground group-hover:border-primary/50"
                      }`}
                    >
                      <ChevronDown size={14} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pl-8 sm:pl-12 pr-4 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-3xl">
                          {isAz ? item.aAz : item.aEn}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
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
