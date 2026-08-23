import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  UserCheck,
  Compass,
  Users,
  Sparkles,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  FileEdit,
  Globe,
  PenTool,
  Send,
} from "lucide-react";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import SEO from "./components/SEO";
import { Eyebrow } from "./components/Eyebrow";
import { Button } from "./components/ui/Button";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "./components/AuthModal";
import ArticleSubmissionModal from "./components/contributor/ArticleSubmissionModal";
import { fetchSiteSettings } from "../lib/sanityQueries";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ContributorPage() {
  const { language, getLocalizedPath } = useLanguage();
  const { user } = useAuth();
  const isAz = language === "az";

  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  useEffect(() => {
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  const handleStartContribution = () => {
    if (user) {
      setSubmitModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const benefits = [
    {
      icon: UserCheck,
      title: isAz ? "Profilinizi Qurun" : "Build Your Profile",
      desc: isAz
        ? "Rvan.me-də öz şəxsi müəllif səhifənizi yaradın, bioqrafiyanızı və portfolionuzu nümayiş etdirin."
        : "Create your own dedicated author page on Rvan.me, showcasing your bio, links, and portfolio.",
    },
    {
      icon: PenTool,
      title: isAz ? "Öz Adınızla Nəşr Olunun" : "Publish Under Your Name",
      desc: isAz
        ? "Fikirləriniz, təcrübəniz və kreativ bilikləriniz birbaşa sizin adınız və kimliyiniz altında yayımlanır."
        : "Your insights, expertise, and ideas are permanently credited to your name and verified profile.",
    },
    {
      icon: Compass,
      title: isAz ? "Kəşf Olunun" : "Get Discovered",
      desc: isAz
        ? "Məqalələriniz Rvan.me oxucuları, axtarış sistemləri və sosial paylaşımlar vasitəsilə yeni auditoriyalara çatır."
        : "Your articles reach new audiences through Rvan.me, search engines, and organic social sharing.",
    },
    {
      icon: Users,
      title: isAz ? "İcmaya Qoşulun" : "Join the Community",
      desc: isAz
        ? "Azərbaycanın inkişaf edən dizayner, marketoloq və texnologiya peşəkarları icmasının bir hissəsi olun."
        : "Become part of Azerbaijan's growing community of designers, marketers, and creative technologists.",
    },
    {
      icon: Sparkles,
      title: isAz ? "Redaksiya Seçimi" : "Editorial Recognition",
      desc: isAz
        ? "Yüksək keyfiyyətli analitik məqalələr və müəlliflər Rvan.me-nin əsas səhifəsində xüsusi olaraq vurğulanır."
        : "Standout analytical pieces and distinguished writers are featured across Rvan.me publications.",
    },
    {
      icon: ShieldCheck,
      title: isAz ? "Təmiz və Şərtsiz Məkan" : "Zero Noise, Pure Knowledge",
      desc: isAz
        ? "Heç bir reklam səs-küyü və spam olmadan yalnız real peşəkar dəyər yaradan bilik mühiti."
        : "A distraction-free, high-standard editorial environment focused entirely on craft and substance.",
    },
  ];

  const whoCanWrite = [
    { title: isAz ? "Brend və Qrafik Dizaynerlər" : "Brand & Graphic Designers" },
    { title: isAz ? "UI/UX və Məhsul Dizaynerləri" : "UI/UX & Product Designers" },
    { title: isAz ? "Marketoloqlar və Strategistlər" : "Marketers & Brand Strategists" },
    { title: isAz ? "Kreativ Direktorlar" : "Creative Directors" },
    { title: isAz ? "Motion Dizaynerlər və Animatorlar" : "Motion Designers & Animators" },
    { title: isAz ? "Frontend və Kreativ Developerlər" : "Frontend & Creative Developers" },
    { title: isAz ? "Fotoqraflar və Vizual Sənətçilər" : "Photographers & Visual Artists" },
    { title: isAz ? "Kreativ Texnoloqlar və Tədqiqatçılar" : "Creative Technologists & Researchers" },
  ];

  const workflowSteps = [
    {
      num: "01",
      title: isAz ? "Google ilə Daxil Olun" : "Sign In with Google",
      desc: isAz
        ? "Mövcud Google hesabınız vasitəsilə bir kliklə sistemə qoşulun."
        : "Authenticate securely with your Google account in one click.",
    },
    {
      num: "02",
      title: isAz ? "Profilinizi Doldurun" : "Complete Contributor Profile",
      desc: isAz
        ? "Peşəkar vəzifənizi, qısa bioqrafiyanızı və sosial portfolionuzu təyin edin."
        : "Set your professional title, bio, and portfolio links in your account.",
    },
    {
      num: "03",
      title: isAz ? "Məqalənizi Təqdim Edin" : "Submit Your Article Draft",
      desc: isAz
        ? "Məqalə mətni, mövzu, xülasə və şəffaf AI istifadə bəyanatını daxil edib göndərin."
        : "Write your article draft, choose the topic, and include the AI disclosure.",
    },
    {
      num: "04",
      title: isAz ? "Redaksiya Nəzərdən Keçirməsi" : "Human Editorial Review",
      desc: isAz
        ? "Redaksiya heyəti yazınızı dəqiqlik, orijinallıq və faydalılıq baxımından yoxlayır."
        : "Our editorial team evaluates the draft for craft, originality, and genuine value.",
    },
    {
      num: "05",
      title: isAz ? "Rəsmi Nəşr və Müəllif Səhifəsi" : "Published Under Your Name",
      desc: isAz
        ? "Təsdiq olunduqdan sonra məqaləniz sizin şəxsi müəllif səhifənizlə birlikdə yayımlanır."
        : "Once approved, your article goes live under your dedicated author profile.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={isAz ? "Müəllif Olun — Rvan.me İcması" : "Become a Contributor — Rvan.me Community"}
        description={
          isAz
            ? "Azərbaycanın kreativ icması üçün müstəqil nəşr platforması. Fikirlərinizi paylaşın, peşəkar kimliyinizi qurun və öz adınızla nəşr olun."
            : "A creative publication built around Azerbaijan's creative community. Share what you know, build your professional identity, and get published under your name."
        }
        url="https://www.rvan.me/contributor"
      />

      <SiteHeader siteSettings={siteSettings} />

      <main className="relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
        {/* 1. HERO SECTION */}
        <section className="px-6 md:px-10 mb-20 md:mb-28">
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="max-w-4xl space-y-6"
            >
              <Eyebrow className="text-primary tracking-[.2em]">
                {isAz ? "AZƏRBAYCANIN KREATIV İCMASI VƏ NƏŞRİ" : "COMMUNITY & PERSPECTIVES"}
              </Eyebrow>

              <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl text-foreground leading-[1.08]">
                {isAz ? "Fikirləriniz görülməyə layiqdir." : "Your ideas deserve to be seen."}
              </h1>

              <p className="text-lg md:text-2xl text-muted-foreground font-normal leading-relaxed max-w-3xl">
                {isAz
                  ? "Bildiklərinizi paylaşın. Peşəkar kimliyinizi qurun. Öz adınız və profilinizlə nəşr olun."
                  : "Share what you know. Build your professional identity. Get published under your name."}
              </p>

              {/* Authentic Value Proposition Box */}
              <div className="p-6 rounded-2xl border border-primary/25 bg-primary/5 max-w-2xl">
                <p className="text-sm md:text-base text-foreground leading-relaxed font-medium">
                  {isAz
                    ? "«Peşəkar kimliyinizi qurmaq üçün böyük auditoriyanızın olmasını gözləməyə ehtiyac yoxdur. Sadəcə faydalı, orijinal və ya maraqlı bir ideya ilə başlayın.»"
                    : "“You don’t need an audience to start building your professional identity. Start with an idea.”"}
                </p>
              </div>

              {/* Hero Action Trigger */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleStartContribution}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-primary/10"
                >
                  <Send size={14} />
                  <span>{user ? (isAz ? "MƏQALƏ TƏQDİM EDİN" : "SUBMIT ARTICLE DRAFT") : (isAz ? "DAXİL OLUN VƏ BAŞLAYIN" : "SIGN IN TO CONTRIBUTE")}</span>
                </button>

                <span className="text-xs text-muted-foreground mono">
                  {isAz ? "Azərbaycan, İngilis və Türk dillərində yazılar qəbul olunur" : "Accepting articles in Azerbaijani, English, and Turkish"}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. REAL VALUE PILLARS */}
        <section className="px-6 md:px-10 py-20 border-t border-border/60 bg-surface/30">
          <div className="mx-auto max-w-[1600px] space-y-12">
            <div>
              <Eyebrow className="text-primary tracking-[.2em]">
                {isAz ? "REAL ÜSTÜNLÜKLƏR" : "WHY WRITE ON RVAN.ME"}
              </Eyebrow>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
                {isAz ? "Niyə Rvan.me-də Yazmalısınız?" : "What you get as a contributor"}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="p-8 rounded-2xl border border-border bg-card space-y-4 shadow-sm"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <b.icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. WHO CAN CONTRIBUTE & SUPPORTED LANGUAGES */}
        <section className="px-6 md:px-10 py-20 border-t border-border/60 bg-transparent">
          <div className="mx-auto max-w-[1600px] grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Eyebrow className="text-primary tracking-[.2em]">
                {isAz ? "KİMLƏR ÜÇÜNDÜR" : "WHO CAN CONTRIBUTE"}
              </Eyebrow>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">
                {isAz ? "Yaradıcı sahənin bütün peşəkarları" : "Every creative discipline"}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {isAz
                  ? "Rvan.me dizayn, brendinq, marketinq, texnologiya və yaradıcı sənayenin kəsişməsində olan bütün sahə mütəxəssislərinin baxış bucağına açıqdır."
                  : "We welcome perspectives from across visual culture, brand strategy, technology, design craft, and creative business."}
              </p>

              <div className="p-4 rounded-xl border border-border bg-surface/50 flex items-center gap-3">
                <Globe size={18} className="text-primary shrink-0" />
                <div className="text-xs font-mono text-muted-foreground">
                  <strong className="text-foreground">{isAz ? "Dillər:" : "Supported Languages:"}</strong> Azərbaycan Dili (AZ), English (EN), Türkçe (TR).
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whoCanWrite.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl border border-border bg-card flex items-center gap-3"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-bold text-foreground">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. PUBLISHING WORKFLOW */}
        <section className="px-6 md:px-10 py-20 border-t border-border/60 bg-surface/30">
          <div className="mx-auto max-w-[1600px] space-y-12">
            <div className="max-w-2xl">
              <Eyebrow className="text-primary tracking-[.2em]">
                {isAz ? "NƏŞR PROSESİ" : "HOW IT WORKS"}
              </Eyebrow>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
                {isAz ? "İdeyadan Nəşrə Qədər 5 Addım" : "From Idea to Publication"}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {workflowSteps.map((step) => (
                <div
                  key={step.num}
                  className="p-6 rounded-2xl border border-border bg-card space-y-3 relative"
                >
                  <div className="text-xs font-bold font-mono text-primary">
                    {step.num}
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. AI POLICY & EDITORIAL INTEGRITY */}
        <section className="px-6 md:px-10 py-20 border-t border-border/60 bg-transparent">
          <div className="mx-auto max-w-[1600px]">
            <div className="p-8 md:p-12 rounded-2xl border border-border bg-card space-y-6 max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1 text-xs font-bold tracking-wider text-muted-foreground mono uppercase">
                <Sparkles size={13} className="text-primary" />
                <span>{isAz ? "MƏSULİYYƏTLİ AI VƏ REDAKSİYA SİYASƏTİ" : "AI POLICY & INTEGRITY"}</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                {isAz ? "Şəffaf və İnsan Mərkəzli Nəşr" : "Human-Centered Editorial Standards"}
              </h2>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-normal">
                {isAz
                  ? "Rvan.me məsuliyyətli süni intellekt köməkçilərindən istifadəni (araşdırma, beyin fırtınası, qrammatika və redaktə) qadağan etmir. Lakin hər bir məqalə müəllifin öz şəxsi təcrübəsini, peşəkar analizini və orijinal baxış bucağını əks etdirməlidir. Kütləvi şəkildə yaradılmış avtomatik SEO mətnləri və keyfiyyətsiz kopyalar qəbul olunmur. Yekun redaksiya qərarı həmişə insan redaktora məxsusdur."
                  : "Rvan.me permits the responsible use of AI tools for research, drafting assistance, and structural editing. However, every published piece must represent the author's own experience, analysis, and perspective. Mass-produced AI SEO content is strictly prohibited. Final publishing decisions are made exclusively by human editors."}
              </p>

              <div className="pt-4 flex items-center gap-2 text-xs font-mono text-primary">
                <CheckCircle2 size={15} />
                <span>{isAz ? "Şəffaf AI istifadə bəyanatı tələb olunur" : "Transparent AI usage disclosure required upon submission"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. BOTTOM CTA */}
        <section className="px-6 md:px-10 pt-10">
          <div className="mx-auto max-w-[1600px]">
            <div className="p-8 md:p-14 rounded-3xl border border-primary/30 bg-primary/5 text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {isAz ? "İdeyanızı İndi Bölüşün" : "Ready to share your idea?"}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
                {isAz
                  ? "Google ilə daxil olun, müəllif profilinizi yaradın və ilk məqalənizi redaksiyamıza göndərin."
                  : "Sign in with Google, set up your author profile, and submit your first draft for editorial review."}
              </p>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleStartContribution}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-xl shadow-primary/20"
                >
                  <Send size={15} />
                  <span>{user ? (isAz ? "MƏQALƏNİ TƏQDİM ET" : "SUBMIT YOUR ARTICLE") : (isAz ? "GOOGLE İLƏ DAXİL OL" : "SIGN IN WITH GOOGLE")}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} />

      {/* Submission and Auth Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ArticleSubmissionModal isOpen={submitModalOpen} onClose={() => setSubmitModalOpen(false)} />
    </div>
  );
}
