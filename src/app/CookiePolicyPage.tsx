import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Cookie, Shield, CheckCircle2, Lock, Sliders, Database, ExternalLink } from "lucide-react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useCookieConsent } from "./context/CookieConsentContext";
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

export default function CookiePolicyPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { openPreferences } = useCookieConsent();
  const { language, isAz, getLocalizedPath } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={isAz ? "Kuki Siyasəti — Rvan.me" : "Cookie Policy — Rvan.me"}
        description={
          isAz
            ? "Rvan.me platformasında istifadə olunan kuki faylları, yerli yaddaş texnologiyaları və məxfilik seçimləri barədə rəsmi məlumat."
            : "Official Cookie Policy for Rvan.me. Transparent explanation of essential authentication tokens, client preferences, and privacy controls."
        }
        url={isAz ? "https://www.rvan.me/az/cookie-policy" : "https://www.rvan.me/cookie-policy"}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Header Section */}
      <section className="px-4 pt-12 pb-10 sm:px-6 md:px-8 md:pt-16 border-b border-[#DDE1E0] dark:border-white/10 relative z-10">
        <div className="mx-auto max-w-[1280px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.05}>
            <Link
              to={getLocalizedPath("/")}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors mono uppercase mb-6"
            >
              <ArrowLeft size={14} /> {isAz ? "ƏSAS SƏHİFƏYƏ QAYIT" : "BACK TO HOME"}
            </Link>

            <div className="mb-3.5">
              <span className="text-xs font-semibold tracking-[.24em] text-primary mono uppercase">
                {isAz ? "ŞƏFFAFLIQ VƏ YADDAŞ" : "COOKIE & STORAGE DISCLOSURE"}
              </span>
            </div>

            <h1
              className="font-extrabold tracking-tight leading-[1.05] text-foreground uppercase mb-4"
              style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.4rem)" }}
            >
              <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] dark:from-[#61c5ad] dark:via-[#6099df] dark:to-[#bc66c5] bg-clip-text text-transparent inline-block">
                {isAz ? "Kuki Siyasəti." : "Cookie Policy."}
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              {isAz
                ? "Bu Kuki Siyasəti Rvan.me-də istifadə olunan kuki və yerli yaddaş (localStorage/sessionStorage) texnologiyalarını, onların təyinatını və seçimlərinizi necə tənzimləyə biləcəyinizi izah edir."
                : "This Cookie Policy explains how Rvan.me utilizes browser cookies and HTML5 storage technologies to maintain secure authentication, persist interface preferences, and optimize performance."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground mono">
              <span>{isAz ? "SON YENİLƏNMƏ: AVQUST 2026" : "LAST REVISED: AUGUST 2026"}</span>
              <span>·</span>
              <button
                onClick={openPreferences}
                className="text-primary font-bold hover:underline mono uppercase cursor-pointer"
              >
                {isAz ? "KUKİ TƏNZİMLƏMƏLƏRİNİ AÇ →" : "OPEN PREFERENCES PANEL →"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Body */}
      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-20 relative z-10">
        <div className="mx-auto max-w-[1280px] space-y-12 text-sm leading-relaxed text-muted-foreground font-medium">
          {/* 1. What Are Cookies and Local Storage */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">01.</span> {isAz ? "Kuki və Yerli Yaddaş Nədir?" : "What Are Cookies and Storage Technologies?"}
            </h2>
            <p>
              {isAz
                ? "Kukilər və HTML5 yerli yaddaş (localStorage/sessionStorage) vebsaytın düzgün işləməsi, təhlükəsiz giriş sessiyasını qoruması və istifadəçi seçimlərini (məsələn, saytın dili və rəng rejimi) yadda saxlaması üçün brauzerinizdə saxlanılan kiçik məlumat parçalarıdır."
                : "Cookies and HTML5 browser storage (localStorage and sessionStorage) are standard web mechanisms that allow websites to maintain secure sign-in states, remember interface customizations (such as theme and language), and ensure platform stability."}
            </p>
          </div>

          {/* 2. Real Technologies Used on Rvan.me */}
          <div className="space-y-6 pt-6 border-t border-[#DDE1E0] dark:border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">02.</span> {isAz ? "Rvan.me-də İstifadə Olunan Texnologiyalar" : "Storage Categories Actually Used on Rvan.me"}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Mandatory Essential */}
              <div className="p-6 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none space-y-3">
                <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider block">
                  {isAz ? "KATEQORİYA 01 · ZƏRURİ" : "CATEGORY 01 · ESSENTIAL"}
                </span>
                <h3 className="text-base font-bold text-foreground">{isAz ? "Zəruri Autentifikasiya və Sessiya" : "Strictly Necessary & Session"}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {isAz
                    ? "Google Firebase autentifikasiya sessiyasını təhlükəsiz saxlamaq və kuki razılıq seçiminizi (rvan_cookie_consent_v1) yadda saxlamaq üçün tələb olunur."
                    : "Required to maintain secure Firebase Google authentication sessions and record your cookie preferences choice (rvan_cookie_consent_v1)."}
                </p>
              </div>

              {/* Preferences */}
              <div className="p-6 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none space-y-3">
                <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider block">
                  {isAz ? "KATEQORİYA 02 · TƏNZİMLƏMƏLƏR" : "CATEGORY 02 · PREFERENCES"}
                </span>
                <h3 className="text-base font-bold text-foreground">{isAz ? "İnterfeys və Dil Seçimləri" : "Interface & Language Preferences"}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {isAz
                    ? "Seçdiyiniz rəng rejimini (rvan_user_theme: light/dark), dil seçimini (rvan_user_lang_preference) və fərdi avatarınızı lokal brauzerdə saxlayır."
                    : "Saves your theme preference (rvan_user_theme), language choice (rvan_user_lang_preference), and local profile avatar customization."}
                </p>
              </div>

              {/* Contributor & Telemetry */}
              <div className="p-6 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none space-y-3">
                <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider block">
                  {isAz ? "KATEQORİYA 03 · PERFORMANS" : "CATEGORY 03 · PERFORMANCE & CMS"}
                </span>
                <h3 className="text-base font-bold text-foreground">{isAz ? "Müəllif Qaralamaları və Performans" : "Contributor Drafts & Telemetry"}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {isAz
                    ? "Müəllif qaralamalarını itməməsi üçün yerli yaddaşda saxlayır. Vercel vasitəsilə anonim sayt sürəti göstəricilərini ölçür."
                    : "Caches offline contributor article drafts and records anonymous performance speed insights via Vercel telemetry."}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Advertising Confirmation */}
          <div className="space-y-4 pt-6 border-t border-[#DDE1E0] dark:border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">03.</span> {isAz ? "Reklam və İzləmə Kukiləri Haqqında" : "No Advertising or Cross-Site Tracking"}
            </h2>
            <div className="p-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>{isAz ? "Rvan.me-də Reklam Kukiləri İstifadə Olunmur" : "Zero Advertising Cookies on Rvan.me"}</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {isAz
                  ? "Rvan.me heç bir reklam şirkəti, məlumat toplayıcı şəbəkə və ya üçüncü tərəf reklam izləyicisi ilə işləmir. Şəxsi məlumatlarınız heç vaxt kommersiya məqsədləri üçün satılmır və ya ötürülmür."
                  : "Rvan.me does not utilize third-party advertising cookies, retargeting pixels, or data broker integrations. Your reading activity and personal data are never sold or leveraged for behavioral cross-site advertising."}
              </p>
            </div>
          </div>

          {/* 4. Managing Preferences */}
          <div className="space-y-4 pt-6 border-t border-[#DDE1E0] dark:border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">04.</span> {isAz ? "Kuki Seçimlərini İdarə Etmək" : "Managing Your Preferences"}
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {isAz
                ? "İstədiyiniz vaxt kuki seçimlərinizi yeniləyə və ya könüllü analitika icazələrini dəyişə bilərsiniz:"
                : "You can modify your cookie choices at any time through our interactive preference modal or directly in your browser settings:"}
            </p>
            
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={openPreferences}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground uppercase tracking-wider hover:opacity-90 transition-opacity mono cursor-pointer"
              >
                <Sliders size={14} />
                <span>{isAz ? "KUKİ SEÇİMLƏRİNİ DƏYİŞDİR" : "CHANGE COOKIE PREFERENCES"}</span>
              </button>

              <Link
                to={getLocalizedPath("/privacy-policy")}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:underline"
              >
                <span>{isAz ? "Məxfilik Siyasətinə Keç" : "View Full Privacy Policy"}</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
