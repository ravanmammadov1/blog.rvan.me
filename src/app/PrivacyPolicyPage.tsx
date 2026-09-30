import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  Mail,
  Lock,
  UserCheck,
  FileText,
  Database,
  Globe,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
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

export default function PrivacyPolicyPage() {
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
        title={isAz ? "Məxfilik Siyasəti — Rvan.me" : "Privacy Policy — Rvan.me"}
        description={
          isAz
            ? "Rvan.me platformasının rəsmi Məxfilik Siyasəti: istifadəçi hesabları, müəllif hüquqları, toplanan məlumatlar və təhlükəsizlik qaydaları."
            : "Official Privacy Policy for Rvan.me. Transparent information disclosures, Google authentication, contributor copyright ownership, and user privacy controls."
        }
        url={isAz ? "https://blog.rvan.me/az/privacy-policy" : "https://blog.rvan.me/privacy-policy"}
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
                {isAz ? "MƏXFİLİK VƏ ŞƏFFAFLIQ" : "PRIVACY & TRANSPARENCY"}
              </span>
            </div>

            <h1
              className="font-extrabold tracking-tight leading-[1.05] text-foreground uppercase mb-4"
              style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.4rem)" }}
            >
              <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] dark:from-[#61c5ad] dark:via-[#6099df] dark:to-[#bc66c5] bg-clip-text text-transparent inline-block">
                {isAz ? "Məxfilik Siyasəti." : "Privacy Policy."}
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              {isAz
                ? "Bu Məxfilik Siyasəti Rvan.me platformasından istifadə etdiyiniz zaman şəxsi məlumatlarınızın necə toplandığını, istifadə edildiyini və qorunduğunu sadə və aydın dillə izah edir."
                : "This Privacy Policy explains how Rvan.me (\"we\", \"us\", or \"our\") collects, uses, and protects your information when you access our creative platform, publication, and resources directory in simple, human-readable terms."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground mono">
              <span>{isAz ? "SON YENİLƏNMƏ: AVQUST 2026" : "LAST REVISED: AUGUST 2026"}</span>
              <span>·</span>
              <button
                onClick={openPreferences}
                className="text-primary font-bold hover:underline mono uppercase cursor-pointer"
              >
                {isAz ? "KUKİ SEÇİMLƏRİNİ İDARƏ ET →" : "MANAGE COOKIE PREFERENCES →"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Body */}
      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-20 relative z-10">
        <div className="mx-auto max-w-[1280px] grid gap-12 lg:grid-cols-12">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-4 space-y-3 sticky top-32 h-fit">
            <div className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/5 p-6 glass shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
              <p className="text-xs font-bold tracking-widest text-primary mono uppercase mb-4">
                {isAz ? "BÖLMƏLƏR" : "TABLE OF CONTENTS"}
              </p>
              <ul className="space-y-2 text-xs font-medium text-muted-foreground">
                <li><a href="#about-platform" className="hover:text-primary transition-colors">{isAz ? "1. Platformanın Təyinatı" : "1. Platform Purpose"}</a></li>
                <li><a href="#information-we-collect" className="hover:text-primary transition-colors">{isAz ? "2. Toplanan Məlumatlar" : "2. Information We Collect"}</a></li>
                <li><a href="#how-we-use-information" className="hover:text-primary transition-colors">{isAz ? "3. Məlumatların İstifadəsi" : "3. How We Use Information"}</a></li>
                <li><a href="#contributor-licensing" className="hover:text-primary transition-colors">{isAz ? "4. Müəlliflik və Məzmun Hüquqları" : "4. Contributor Content Ownership"}</a></li>
                <li><a href="#third-party-services" className="hover:text-primary transition-colors">{isAz ? "5. Üçüncü Tərəf Xidmətləri" : "5. Integrated Third-Party Services"}</a></li>
                <li><a href="#data-retention" className="hover:text-primary transition-colors">{isAz ? "6. Məlumatların Saxlanması" : "6. Data Retention & Storage"}</a></li>
                <li><a href="#account-deletion" className="hover:text-primary transition-colors">{isAz ? "7. Hesabın Silinməsi və Hüquqlarınız" : "7. Account Deletion & Rights"}</a></li>
                <li><a href="#contact-inquiries" className="hover:text-primary transition-colors">{isAz ? "8. Əlaqə və Siyasətin Yenilənməsi" : "8. Inquiries & Updates"}</a></li>
              </ul>
            </div>
          </div>

          {/* Main Legal Copy */}
          <div className="lg:col-span-8 space-y-12 text-foreground/90">
            {/* Section 1: Platform Purpose */}
            <article id="about-platform" className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Globe size={16} /> 01 / {isAz ? "PLATFORMANIN TƏYİNATI" : "PLATFORM PURPOSE"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "1. Rvan.me Nəşr və Bilik Platforması" : "1. Purpose of Rvan.me"}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isAz
                  ? "Rvan.me — şəxsi yaradıcılıq mühiti, müstəqil redaksiya nəşri, bilik bazası, kreativ resurslar kataloqu və müəlliflər icmasını birləşdirən rəqəmsal platformadır. Platforma dizayn, brendinq, marketinq, vizual mədəniyyət, kreativ texnologiyalar və süni intellekt mövzularına fokuslanır. Əsas auditoriyamız Azərbaycan olsa da, platforma qlobal əlçatanlıq üçün həm Azərbaycan, həm də İngilis dilində fəaliyyət göstərir."
                  : "Rvan.me is a creative publication, knowledge platform, and resource ecosystem founded by senior creative designer Ravan Mammadov. The platform focuses primarily on design systems, brand architecture, marketing strategy, visual culture, creative technology, and artificial intelligence. While our primary audience is Azerbaijan, the platform operates in both Azerbaijani and English to foster international creative discourse."}
              </p>
            </article>

            {/* Section 2: Information We Collect */}
            <article id="information-we-collect" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Database size={16} /> 02 / {isAz ? "TOPLANAN MƏLUMATLAR" : "INFORMATION WE COLLECT"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "2. Hansı Məlumatları Toplayırıq?" : "2. Information We Collect"}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isAz
                  ? "Biz yalnız platformanın əsas funksionallığını təmin etmək üçün zəruri olan minimum məlumatları toplayırıq:"
                  : "We only collect personal information that is directly necessary for providing our services:"}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="p-5 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <UserCheck size={16} className="text-primary" />
                    <span>{isAz ? "Hesab və Profil Məlumatları" : "Account & Profile Details"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAz
                      ? "Google Girişi vasitəsilə hesab yaratdıqda: adınız, soyadınız, e-poçt ünvanınız və Google profil şəkliniz. Tənzimləmələrdə fərdiləşdirilə bilən xarakter avatarı."
                      : "When you sign in with Google: first name, last name, email address, and Google profile picture, along with optional custom avatar choices."}
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <FileText size={16} className="text-primary" />
                    <span>{isAz ? "Müəllif Müraciəti və Qaralamalar" : "Contributor Details & Drafts"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAz
                      ? "Müəllif kimi qeydiyyatdan keçdikdə: peşəkar vəzifəniz, qısa bioqrafiyanız, ixtisas sahəniz, şəhəriniz, portfolio linkləriniz və təqdim etdiyiniz məqalə qaralamaları."
                      : "When applying as a contributor: professional title, biography, expertise areas, city, portfolio links, submitted article content, and transparent AI disclosures."}
                  </p>
                </div>
              </div>
            </article>

            {/* Section 3: How We Use Information */}
            <article id="how-we-use-information" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Sliders size={16} /> 03 / {isAz ? "MƏLUMATLARIN İSTİFADƏSİ" : "HOW WE USE INFORMATION"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "3. Məlumatlar Necə İstifadə Olunur?" : "3. How We Use Your Information"}
              </h2>
              <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed pl-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{isAz ? "Hesabınızın autentifikasiyası və təhlükəsiz saxlanması." : "To authenticate and manage your user account securely."}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{isAz ? "Müəllif kabinetinizdə məqalələrin redaksiya baxışını və təsdiq prosesini aparmaq." : "To process, review, and collaborate on contributor article submissions."}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{isAz ? "Təsdiqlənmiş məqalələri sizin adınız və ictimai müəllif profilinizlə nəşr etmək." : "To publish approved articles publicly with verified author attribution."}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{isAz ? "Seçdiyiniz rəng rejimi (işıqlı/qaranlıq) və dil tənzimləmələrini brauzerinizdə yadda saxlamaq." : "To remember your interface preferences (light/dark theme and language)."}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{isAz ? "Əlaqə forması vasitəsilə göndərdiyiniz müraciətlərə cavab vermək." : "To reply to inquiries sent via our contact form."}</span>
                </li>
              </ul>
            </article>

            {/* Section 4: Contributor Content Ownership & Licensing */}
            <article id="contributor-licensing" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Lock size={16} /> 04 / {isAz ? "MÜƏLLİFLİK VƏ LİSENZİYA" : "CONTRIBUTOR COPYRIGHT OWNERSHIP"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "4. Müəllif Hüquqları və Nəşr Lisenziyası" : "4. Contributor Content Ownership & Publishing License"}
              </h2>
              
              <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
                <h3 className="text-sm font-bold text-foreground">
                  {isAz ? "Müəllif Hüququ Tamamilə Müəllifə Məxsusdur" : "Contributors Retain 100% Copyright Ownership"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Rvan.me müəlliflərin əsərləri üzərində müəlliflik hüququnu mənimsəmir. Müəllif öz orijinal əsərinin hüquqlarını tam olaraq özündə saxlayır. Məqaləni təqdim etməklə müəllif Rvan.me platformasına yalnız qeyri-müstəsna (non-exclusive), qonorarsız lisenziya verir: məqaləni Rvan.me-də yayımlamaq, ictimaiyyətə nümayiş etdirmək, arxivləşdirmək, xidmətlərimiz vasitəsilə yaymaq və nəşrin tanıdılması üçün qısa parçalarından/önizləmələrindən istifadə etmək."
                    : "The contributor RETAINS FULL COPYRIGHT OWNERSHIP of their original work. Rvan.me does NOT take ownership of your copyright. By submitting content under the contributor terms, the contributor grants Rvan.me a non-exclusive, worldwide, royalty-free license to publish, publicly display, archive, distribute through Rvan.me services, and use excerpts/previews reasonably necessary to promote the publication."}
                </p>
              </div>
            </article>

            {/* Section 5: Third-Party Services */}
            <article id="third-party-services" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Database size={16} /> 05 / {isAz ? "ÜÇÜNCÜ TƏRƏF XİDMƏTLƏRİ" : "THIRD-PARTY SERVICES"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "5. Platformada İstifadə Olunan Xidmətlər" : "5. Third-Party Services Actually Integrated"}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isAz
                  ? "Rvan.me heç bir reklam şəbəkəsi və ya məlumat satan vasitəçi ilə əməkdaşlıq etmir. Yalnız platformanın işləməsi üçün aşağıdakı xidmətlərdən istifadə olunur:"
                  : "Rvan.me does not sell user data or integrate third-party advertising networks. The following technical services are currently utilized:"}
              </p>

              <div className="space-y-3 pt-2 text-xs text-muted-foreground">
                <div className="p-4 rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02]">
                  <strong className="text-foreground">Google Firebase Authentication & Firestore:</strong>{" "}
                  {isAz
                    ? "İstifadəçilərin Google hesabı ilə təhlükəsiz autentifikasiyası və profil məlumatlarının saxlanması."
                    : "Secure OAuth user authentication and cloud database for user profile and contributor state."}
                </div>
                <div className="p-4 rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02]">
                  <strong className="text-foreground">Sanity.io Headless CMS:</strong>{" "}
                  {isAz
                    ? "Redaksiya məqalələrinin, fotoşəkillərin və sayt parametrlərinin idarə olunması."
                    : "Content management infrastructure for fetching editorial blog posts and site settings."}
                </div>
                <div className="p-4 rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02]">
                  <strong className="text-foreground">Vercel Analytics & Speed Insights:</strong>{" "}
                  {isAz
                    ? "Saytın açılma sürətini və texniki sabitliyini ölçən anonim, şəxsi məlumat toplamayan telemetriya."
                    : "Privacy-friendly anonymous speed telemetry and performance metrics without personal tracking."}
                </div>
                <div className="p-4 rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02]">
                  <strong className="text-foreground">Google Tag Manager & Microsoft Clarity (Könüllü / Consented):</strong>{" "}
                  {isAz
                    ? "Yalnız istifadəçi kuki bildirişində analitikaya icazə verdiyi halda istifadəçi təcrübəsini yaxşılaşdırmaq məqsədilə aktivləşir."
                    : "Loaded conditionally only when the user explicitly grants analytics consent via the cookie preferences dialog."}
                </div>
              </div>
            </article>

            {/* Section 6: Data Retention & Security */}
            <article id="data-retention" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Shield size={16} /> 06 / {isAz ? "MƏLUMATLARIN SAXLANMASI" : "DATA RETENTION & SECURITY"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "6. Məlumatların Saxlanması və Təhlükəsizlik" : "6. Data Retention & Security"}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isAz
                  ? "Şəxsi məlumatlarınız hesabınız aktiv olduğu müddətdə saxlanılır. Dil və tema seçimləri birbaşa brauzerinizin yerli yaddaşında (localStorage) saxlanılır və heç bir kənar serverə ötürülmür. Təqdim olunan məqalə qaralamaları redaksiya baxışı və arxivləşdirmə məqsədilə qorunur."
                  : "Your account details are retained while your account remains active. Client preferences (such as language and theme) reside exclusively inside your browser's localStorage. All network transmissions are protected using HTTPS and TLS encryption."}
              </p>
            </article>

            {/* Section 7: Account Deletion & Rights */}
            <article id="account-deletion" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <UserCheck size={16} /> 07 / {isAz ? "HESABIN SİLİNMƏSİ VƏ HÜQUQLAR" : "ACCOUNT DELETION & RIGHTS"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "7. Hesabınızı Silmək və İstifadəçi Hüquqlarınız" : "7. Account Deletion & Your Data Rights"}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isAz
                  ? "Siz istənilən vaxt şəxsi profil məlumatlarınıza baxa, düzəliş edə və ya hesabınızı tamamilə silə bilərsiniz:"
                  : "You have complete ownership over your account data. You can exercise the following rights at any time:"}
              </p>

              <div className="space-y-2.5 text-xs text-muted-foreground pl-1">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">▪</span>
                  <span>
                    <strong className="text-foreground">{isAz ? "Hesabın Birbaşa Silinməsi:" : "Direct Account Deletion:"}</strong>{" "}
                    {isAz
                      ? "Tənzimləmələr səhifəsinə (/profile) daxil olaraq 'Hesabı Sil' düyməsi ilə hesabınızı və bütün yerli profil məlumatlarınızı birdəfəlik silə bilərsiniz."
                      : "Navigate to Settings (/profile) and click 'Delete Account' to permanently erase your authenticated account and local profile cache."}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">▪</span>
                  <span>
                    <strong className="text-foreground">{isAz ? "Məqalələrin İdarəsi:" : "Publication Removal:"}</strong>{" "}
                    {isAz
                      ? "Dərc olunmuş məqalənizin silinməsi və ya yenilənməsi üçün redaksiyamızla əlaqə saxlaya bilərsiniz."
                      : "You can request removal or updates to your published contributions by reaching out to our editorial desk."}
                  </span>
                </div>
              </div>
            </article>

            {/* Section 8: Inquiries & Policy Updates */}
            <article id="contact-inquiries" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Mail size={16} /> 08 / {isAz ? "ƏLAQƏ VƏ YENİLƏNMƏLƏR" : "INQUIRIES & POLICY UPDATES"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "8. Əlaqə və Siyasətdə Dəyişikliklər" : "8. Inquiries & Policy Updates"}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isAz
                  ? "Məxfilik Siyasəti ilə bağlı hər hansı sualınız və ya müraciətiniz olduqda bizimlə əlaqə saxlaya bilərsiniz. Bu siyasətdə edilən hər hansı dəyişiklik bu səhifədə dərc olunacaq və son yenilənmə tarixi qeyd ediləcək."
                  : "If you have any questions or requests regarding this Privacy Policy, please contact our editorial desk. Any updates to this policy will be posted directly to this page with an updated revision date."}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to={getLocalizedPath("/contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity"
                >
                  <Mail size={14} />
                  <span>{isAz ? "BİZİMLƏ ƏLAQƏ" : "CONTACT EDITORIAL DESK"}</span>
                </Link>

                <Link
                  to={getLocalizedPath("/terms")}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:underline"
                >
                  <span>{isAz ? "İstifadə Qaydalarına Bax" : "View Terms of Service"}</span>
                  <ExternalLink size={13} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
