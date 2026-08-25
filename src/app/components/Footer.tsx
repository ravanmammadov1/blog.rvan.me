import { Link } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";
import { SiteSettings } from "../../types/cms";
import { useLanguage } from "../../lib/i18n/LanguageContext";

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

export default function Footer({ siteSettings }: FooterProps) {
  const { openPreferences } = useCookieConsent();
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  const footerCopyright = siteSettings?.footerText
    ? siteSettings.footerText.replace("{year}", new Date().getFullYear().toString())
    : `© ${new Date().getFullYear()} RVAN.ME · RAVAN MAMMADOV ALL RIGHTS RESERVED`;

  return (
    <footer className="w-full border-t border-border bg-background text-foreground px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto flex max-w-[1280px] flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] font-bold tracking-[.14em] text-muted-foreground mono uppercase">
        {/* Left Side */}
        <span>{footerCopyright}</span>

        {/* Right Side */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            to={getLocalizedPath("/write")}
            className="transition-colors hover:text-primary text-primary/90 font-bold"
          >
            {isAz ? "RVAN.ME ÜÇÜN YAZ" : "WRITE FOR RVAN.ME"}
          </Link>
          <Link
            to={getLocalizedPath("/about/ravan-mammadov")}
            className="transition-colors hover:text-foreground"
          >
            {isAz ? "TƏSİSÇİ" : "FOUNDER"}
          </Link>
          <Link
            to={getLocalizedPath("/faq")}
            className="transition-colors hover:text-foreground"
          >
            {t("navFaq", "FAQ")}
          </Link>
          <Link
            to={getLocalizedPath("/privacy-policy")}
            className="transition-colors hover:text-foreground"
          >
            {t("privacyPolicy", "PRIVACY POLICY")}
          </Link>
          <Link
            to={getLocalizedPath("/cookie-policy")}
            className="transition-colors hover:text-foreground"
          >
            {t("cookiePolicy", "COOKIE POLICY")}
          </Link>
          <Link
            to={getLocalizedPath("/terms")}
            className="transition-colors hover:text-foreground"
          >
            {t("termsOfService", "TERMS")}
          </Link>
          <button
            onClick={openPreferences}
            type="button"
            className="p-0 border-none bg-transparent text-[11px] font-bold tracking-[.14em] text-muted-foreground hover:text-foreground transition-colors mono uppercase cursor-pointer"
          >
            {t("cookies", "COOKIES")}
          </button>
        </div>
      </div>
    </footer>
  );
}
