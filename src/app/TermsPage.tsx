import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Scale, Mail, FileText, CheckCircle2, UserCheck, Lock, Globe, ExternalLink } from "lucide-react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
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

export default function TermsPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
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
        title={isAz ? "İstifadə Qaydaları — Rvan.me" : "Terms of Service — Rvan.me"}
        description={
          isAz
            ? "Rvan.me platformasının rəsmi İstifadə Qaydaları: müəlliflik hüquqları, hesab idarəetməsi, nəşr lisenziyaları və ictimai məsuliyyət."
            : "Official Terms of Service for Rvan.me. Contributor copyright ownership, non-exclusive publishing license, account management, and community standards."
        }
        url={isAz ? "https://blog.rvan.me/az/terms" : "https://blog.rvan.me/terms"}
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
                {isAz ? "PLATFORMA ŞƏRTLƏRİ" : "SERVICE AGREEMENT"}
              </span>
            </div>

            <h1
              className="font-extrabold tracking-tight leading-[1.05] text-foreground uppercase mb-4"
              style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.4rem)" }}
            >
              <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] dark:from-[#61c5ad] dark:via-[#6099df] dark:to-[#bc66c5] bg-clip-text text-transparent inline-block">
                {isAz ? "İstifadə Qaydaları." : "Terms of Service."}
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              {isAz
                ? "Bu İstifadə Qaydaları Rvan.me platformasına, redaksiya nəşrinə, resurslar bazasına və müəllif icmasına çıxışınızı tənzimləyir."
                : "These Terms of Service govern your access to and use of the Rvan.me creative publication, knowledge platform, resources directory, and contributor workspace."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground mono">
              <span>{isAz ? "SON YENİLƏNMƏ: AVQUST 2026" : "LAST REVISED: AUGUST 2026"}</span>
              <span>·</span>
              <span>{isAz ? "YURİSDİKSİYA: AZƏRBAYCAN" : "GOVERNING LAW: AZERBAIJAN"}</span>
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
                {isAz ? "BÖLMƏLƏR" : "CONTENTS OVERVIEW"}
              </p>
              <ul className="space-y-2 text-xs font-medium text-muted-foreground">
                <li><a href="#acceptance" className="hover:text-primary transition-colors">{isAz ? "1. Şərtlərin Qəbulu" : "1. Acceptance of Terms"}</a></li>
                <li><a href="#accounts" className="hover:text-primary transition-colors">{isAz ? "2. İstifadəçi Hesabları" : "2. User Accounts & Security"}</a></li>
                <li><a href="#contributor-terms" className="hover:text-primary transition-colors">{isAz ? "3. Müəlliflik və Nəşr Qaydaları" : "3. Contributor Submissions"}</a></li>
                <li><a href="#copyright-ownership" className="hover:text-primary transition-colors">{isAz ? "4. Müəllif Hüququ və Lisenziya" : "4. Copyright Ownership & License"}</a></li>
                <li><a href="#platform-ip" className="hover:text-primary transition-colors">{isAz ? "5. Platformanın Əqli Mülkiyyəti" : "5. Rvan.me Intellectual Property"}</a></li>
                <li><a href="#acceptable-use" className="hover:text-primary transition-colors">{isAz ? "6. Qəbul Edilən Davranış Qaydaları" : "6. Acceptable Use Policy"}</a></li>
                <li><a href="#external-links" className="hover:text-primary transition-colors">{isAz ? "7. Xarici Resurslar və Alətlər" : "7. External Directory Links"}</a></li>
                <li><a href="#disclaimers" className="hover:text-primary transition-colors">{isAz ? "8. Məsuliyyətin Məhdudlaşdırılması" : "8. Limitation of Liability"}</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">{isAz ? "9. Əlaqə və Hüquqi Məlumat" : "9. Inquiries & Contact"}</a></li>
              </ul>
            </div>
          </div>

          {/* Terms Text */}
          <div className="lg:col-span-8 space-y-12 text-sm leading-relaxed text-muted-foreground font-medium">
            {/* 1. Acceptance */}
            <article id="acceptance" className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Globe size={16} /> 01 / {isAz ? "ŞƏRTLƏRİN QƏBULU" : "ACCEPTANCE OF TERMS"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "1. Qaydaların Qəbul Edilməsi" : "1. Acceptance of Terms"}
              </h2>
              <p>
                {isAz
                  ? "Rvan.me saytına daxil olmaqla, məqalələri oxumaqla və ya hesab yaratmaqla siz bu İstifadə Qaydaları və Məxfilik Siyasəti ilə tam razılaşdığınızı təsdiq edirsiniz. Əgər bu şərtlərlə razı deyilsinizsə, saytdan istifadəni dayandırmalısınız."
                  : "By accessing, browsing, or creating an account on Rvan.me, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must discontinue using the platform."}
              </p>
            </article>

            {/* 2. User Accounts */}
            <article id="accounts" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <UserCheck size={16} /> 02 / {isAz ? "İSTİFADƏÇİ HESABLARI" : "USER ACCOUNTS"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "2. İstifadəçi Hesabları və İdarəetmə" : "2. User Accounts & Responsibilities"}
              </h2>
              <p>
                {isAz
                  ? "İstifadəçilər Google Girişi (Google Sign-In) vasitəsilə platformada hesab yarada bilərlər. Siz hesabınızdan edilən fəaliyyətlərə cavabdehsiniz və istədiyiniz vaxt Tənzimləmələr səhifəsi (/profile) vasitəsilə hesabınızı və şəxsi məlumatlarınızı birdəfəlik silə bilərsiniz."
                  : "Users can register an account securely using Google Sign-In. You are responsible for activities occurring under your account. You can modify your profile settings or permanently delete your account at any time through the Settings page (/profile)."}
              </p>
            </article>

            {/* 3. Contributor Terms */}
            <article id="contributor-terms" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <FileText size={16} /> 03 / {isAz ? "MÜƏLLİFLİK VƏ NƏŞR" : "CONTRIBUTOR SUBMISSIONS"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "3. Müəllif Məqalələri və Redaksiya Baxışı" : "3. Contributor Articles & Editorial Review"}
              </h2>
              <p>
                {isAz
                  ? "Rvan.me dizayn, brendinq, marketinq və texnologiya sahəsində fəaliyyət göstərən peşəkarların yazılarını qəbul edir. Təqdim edilən hər bir yazı redaksiya heyəti tərəfindən nəzərdən keçirilir və yalnız keyfiyyət standartlarına cavab verən məqalələr dərc olunur. Redaksiya mətnə heç bir məzmun təhrifi etmədən qrammatik və struktur düzəlişlər təklif etmək hüququna malikdir."
                  : "Rvan.me welcomes original contributions from designers, strategists, researchers, and creative professionals. All submitted articles undergo editorial review for clarity, depth, and originality before public publication. Editorial review ensures high analytical trust across our readership."}
              </p>
            </article>

            {/* 4. Copyright Ownership & Licensing */}
            <article id="copyright-ownership" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Lock size={16} /> 04 / {isAz ? "MÜƏLLİF HÜQUQU VƏ LİSENZİYA" : "COPYRIGHT OWNERSHIP & LICENSE"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "4. Müəllif Hüququ və Qeyri-Müstəsna Nəşr Lisenziyası" : "4. Contributor Copyright Retention & Publishing License"}
              </h2>

              <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
                <h3 className="text-sm font-bold text-foreground">
                  {isAz ? "Müəllif Hüququ 100% Müəllifdə Qalır" : "The Contributor Retains 100% Copyright Ownership"}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {isAz
                    ? "Müəllif öz orijinal əsərinin müəllif hüququnu TAM olaraq özündə saxlayır. Rvan.me müəllif hüquqlarını mənimsəmir. Məqaləni təqdim etməklə müəllif Rvan.me-yə yalnız qeyri-müstəsna (non-exclusive), qlobal və qonorarsız lisenziya hüququ verir: əsəri Rvan.me platformasında yayımlamaq, ictimaiyyətə göstərmək, arxivləşdirmək və platformanın təbliği məqsədilə xülasələrindən istifadə etmək. Müəllif istənilən vaxt əsərini digər platformalarda da sərbəst şəkildə paylaşa bilər."
                    : "The contributor RETAINS FULL COPYRIGHT OWNERSHIP of their original work. Rvan.me does NOT take ownership of your copyright. By submitting content under these terms, the contributor grants Rvan.me a non-exclusive, worldwide, royalty-free license to publish, publicly display, archive, distribute through Rvan.me services, and use excerpts/previews reasonably necessary to promote the article. Contributors remain completely free to republish or repurpose their original writing elsewhere."}
                </p>
              </div>
            </article>

            {/* 5. Rvan.me Intellectual Property */}
            <article id="platform-ip" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Shield size={16} /> 05 / {isAz ? "PLATFORMANIN ƏQLİ MÜLKİYYƏTİ" : "RVAN.ME INTELLECTUAL PROPERTY"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "5. Platformanın Dizaynı və Texniki Kodları" : "5. Platform Code, Branding & Proprietary Content"}
              </h2>
              <p>
                {isAz
                  ? "Rvan.me saytının proqram kodu, vizual dizayn sistemi, brend elementləri, loqoları və təsisçi tərəfindən yazılmış orijinal redaksiya esseləri Ravan Mammadov Studiyasına məxsusdur və əqli mülkiyyət qanunları ilə qorunur."
                  : "The Rvan.me codebase, visual identity, design tokens, logos, and proprietary editorial case studies are the intellectual property of Ravan Mammadov Studio and protected under applicable copyright laws."}
              </p>
            </article>

            {/* 6. Acceptable Use */}
            <article id="acceptable-use" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Scale size={16} /> 06 / {isAz ? "QƏBUL EDİLƏN DAVRANIŞ" : "ACCEPTABLE USE POLICY"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "6. Qəbul Edilən Davranış Qaydaları" : "6. Acceptable Community Conduct"}
              </h2>
              <p>
                {isAz ? "Platformadan istifadə zamanı aşağıdakılar qəti qadağandır:" : "You agree not to participate in the following prohibited actions:"}
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground pl-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{isAz ? "Plagiatlıq, başqasının əsərini icazəsiz öz adı ilə təqdim etmək." : "Plagiarism or submitting intellectual property without proper authorization."}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{isAz ? "Avtomatlaşdırılmış spam, zərərli kod və ya kiberhücum cəhdləri." : "Automated spamming, malicious script injection, or service disruption."}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{isAz ? "Təhqiramiz, nifrət nitqi ehtiva edən şərhlər və ya qanunazidd paylaşımlar." : "Harassment, abusive commentary, or unlawful content in community discussions."}</span>
                </li>
              </ul>
            </article>

            {/* 7. External Links */}
            <article id="external-links" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Globe size={16} /> 07 / {isAz ? "XARİCİ RESURSLAR" : "EXTERNAL DIRECTORY LINKS"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "7. Xarici Resurslar və Alətlər Kataloqu" : "7. External Directory Resources"}
              </h2>
              <p>
                {isAz
                  ? "Resurslar bölməsində (/resources) təqdim olunan açıq mənbəli şriftlər, vektor ikonlar və dizayn alətləri müvafiq üçüncü tərəflərə məxsusdur və öz lisenziyaları (OFL, MIT və s.) ilə tənzimlənir. Rvan.me xarici vebsaytların məzmununa görə məsuliyyət daşımır."
                  : "Open-source typography, developer tools, and external assets curated within our directory remain the property of their respective creators and are licensed under their respective terms (SIL OFL, MIT, etc.)."}
              </p>
            </article>

            {/* 8. Disclaimers */}
            <article id="disclaimers" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Shield size={16} /> 08 / {isAz ? "MƏSULİYYƏTİN MƏHDUDLAŞDIRILMASI" : "LIMITATION OF LIABILITY"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "8. Məsuliyyətin Məhdudlaşdırılması" : "8. Disclaimers & Limitation of Liability"}
              </h2>
              <p>
                {isAz
                  ? "Rvan.me platformasında dərc olunan məzmun təhsil və məlumatlandırma məqsədi daşıyır. Platforma xidmətləri 'olduğu kimi' təqdim edilir və saytın fasiləsiz işləməsi ilə bağlı heç bir qeyri-real zəmanət verilmir."
                  : "All articles and directory materials on Rvan.me are published for educational and analytical purposes. The platform is provided on an \"as is\" and \"as available\" basis without warranties of any kind."}
              </p>
            </article>

            {/* 9. Contact */}
            <article id="contact" className="space-y-4 border-t border-[#DDE1E0] dark:border-white/10 pt-10">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Mail size={16} /> 09 / {isAz ? "ƏLAQƏ VƏ MÜRACİƏT" : "INQUIRIES & CONTACT"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isAz ? "9. Redaksiya və Qaydalarla Bağlı Əlaqə" : "9. Editorial & Legal Contact"}
              </h2>
              <p>
                {isAz
                  ? "İstifadə Qaydaları ilə bağlı suallarınız və ya müəlliflik müraciətləriniz üçün bizimlə əlaqə saxlaya bilərsiniz:"
                  : "For inquiries regarding these Terms of Service or editorial publishing guidelines, contact our desk:"}
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
                  to={getLocalizedPath("/privacy-policy")}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:underline"
                >
                  <span>{isAz ? "Məxfilik Siyasətinə Bax" : "View Privacy Policy"}</span>
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
