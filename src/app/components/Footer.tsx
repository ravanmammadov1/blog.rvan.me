import { Link } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";
import { SiteSettings } from "../../types/cms";
import { useLanguage } from "../../lib/i18n/LanguageContext";

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

export default function Footer({ siteSettings }: FooterProps) {
  const { openPreferences } = useCookieConsent();
  const { t, getLocalizedPath } = useLanguage();

  return (
    <footer className="w-full border-t border-white/10 bg-background text-foreground px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto flex max-w-[1600px] flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] font-bold tracking-[.18em] text-muted-foreground/70 mono uppercase">
        {/* Left Side */}
        <span>© {new Date().getFullYear()} Rvan.me · Ravan Mammadov Studio</span>

        {/* Right Side */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            to={getLocalizedPath("/privacy-policy")}
            className="transition-opacity duration-200 hover:opacity-100 hover:text-foreground opacity-70"
          >
            {t("privacyPolicy", "PRIVACY POLICY")}
          </Link>
          <Link
            to={getLocalizedPath("/cookie-policy")}
            className="transition-opacity duration-200 hover:opacity-100 hover:text-foreground opacity-70"
          >
            {t("cookiePolicy", "COOKIE POLICY")}
          </Link>
          <Link
            to={getLocalizedPath("/terms")}
            className="transition-opacity duration-200 hover:opacity-100 hover:text-foreground opacity-70"
          >
            {t("termsOfService", "TERMS")}
          </Link>
          <button
            onClick={openPreferences}
            type="button"
            className="p-0 border-none bg-transparent text-[10px] font-bold tracking-[.18em] text-muted-foreground/70 hover:opacity-100 hover:text-foreground transition-opacity duration-200 mono uppercase cursor-pointer opacity-70"
          >
            {t("cookies", "COOKIES")}
          </button>
        </div>
      </div>
    </footer>
  );
}
