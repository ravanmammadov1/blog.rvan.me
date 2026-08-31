import { Link } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";
import { SiteSettings } from "../../types/cms";
import { useLanguage } from "../../lib/i18n/LanguageContext";

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

/**
 * Pure Monochrome White/CurrentColor SVG Logo for Rvan.me
 */
function RvanMonochromeLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 214.76 244.71"
      fill="currentColor"
      className={className}
      aria-label="Rvan.me Logo"
    >
      <g fill="currentColor">
        <path d="M106.57,158.6c3.15-.95,10.17-2.57,18.56-.4,2.58.66,10.15,2.73,16.15,9.5.45.51,2.44,2.79,4.32,6.42,3.32,6.4,3.92,12.4,3.98,15.93.14,18.15.27,36.3.41,54.45-9.86-.03-19.72-.05-29.58-.08,0-6.28,0-17.93,0-24.21,0-1.77.13-9.22,0-24.15-.01-1.14-.08-4-2-6.18-.34-.38-1.36-1.46-3.02-2.02-2.49-.85-4.84-.02-5.74.28-3.98,1.37-17.41,5.59-35.77,11.52-15.56-6.03-27.41-10.14-32.43-11.64-1.62-.49-4.96-1.43-8,.05-1.67.81-2.61,2.04-2.81,2.32-1.63,2.21-1.58,4.8-1.57,5.71.05,4.31-.04,22.99,0,48.62-9.69-.06-19.38-.13-29.07-.19.23-20.64.39-37.34.26-50.96-.03-2.84-.09-7.96,2.35-13.84,4.56-10.97,14.41-16.32,17.82-17.95,13.75-6.57,26.89-2.4,29.87-1.38,8.37,2.61,16.73,5.21,25.1,7.82,10.39-3.21,20.78-6.42,31.17-9.62Z" />
        <path d="M166.88,0c4.51.51,11.13,1.82,18.31,5.48,9.35,4.77,14.79,11.04,16.47,13.08.88,1.07,4.88,6.01,8.19,14.13,5.43,13.29,5.35,26.01,4.44,34.32v38.87c-9.18.14-18.36.28-27.54.42.15-8.34.19-15.45.18-21-.02-10.74-.19-16.43-.37-20.61-.24-5.63-.35-8.44-.58-9.86-.85-5.36-2.62-16.48-11.47-22.44-5.85-3.94-12.4-4.01-16.19-3.65H29.07v52.83c0,4.94,1.21,9.71,4.47,14.2,4.3,5.92,10.79,7.94,13.82,8.64,20.33,1.78,36.04,1.37,47,.59,6.88-.49,19.18-1.65,35.63.61,3.32.46,7.52,1.03,12.85,2.36,8.28,2.05,27.46,7.05,43.49,23.18,8.23,8.28,12.43,16.25,15.55,22.17,1.82,3.47,9.38,18.28,11.99,39.18.83,6.61.84,13.63.88,27.69.02,9.99-.22,18.32-.46,24.23h-27.54c.12-14.23.24-28.46.37-42.68-1.29-12.43-4.58-21.66-7.12-27.43-2.12-4.83-4.16-8.19-4.81-9.28-2.58-4.32-6.71-10.13-13.02-15.76-5.27-4.69-10.44-7.81-14.5-9.85-5.41-2.35-10.08-3.6-13.47-4.32-5.18-1.09-9.29-1.34-15.87-1.72-4.98-.29-9.16-.36-12.16-.37-11.64.4-22.82.54-33.53.47-3.51-.02-7.73,0-13.37-.2-28.19-.94-35.43-4.56-39.19-6.9-1.5-.93-5.18-3.35-8.89-7.53C.91,107.31.04,93.27,0,87.79V0h166.88Z" />
      </g>
    </svg>
  );
}

export default function Footer({ siteSettings }: FooterProps) {
  const { openPreferences } = useCookieConsent();
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0c] text-white border-t border-white/10 px-4 py-8 sm:px-6 md:px-8 md:py-10 selection:bg-white selection:text-black">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Monochrome Rvan.me Logo & Clean Copyright */}
        <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
          <Link
            to={getLocalizedPath("/")}
            aria-label="Rvan.me Home"
            className="text-white hover:opacity-80 transition-opacity shrink-0"
          >
            <RvanMonochromeLogo className="h-6 w-auto text-white" />
          </Link>

          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          <div className="text-[11px] sm:text-xs text-neutral-400 font-sans leading-tight">
            <span className="text-neutral-300 font-medium">
              © {currentYear} Rvan.me · Ravan Mammadov
            </span>
            <span className="hidden sm:inline text-neutral-500"> · </span>
            <span className="block sm:inline text-neutral-500">
              {isAz ? "Bütün hüquqlar qorunur." : "All rights reserved."}
            </span>
          </div>
        </div>

        {/* Right: Clean Minimal Navigation */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2 text-[11px] sm:text-xs text-neutral-400 font-sans"
        >
          <Link
            to={getLocalizedPath("/write")}
            className="text-white font-medium hover:text-primary transition-colors"
          >
            {isAz ? "Fikrinizi Paylaşın" : "Share Your Ideas"}
          </Link>

          <Link
            to={getLocalizedPath("/faq")}
            className="hover:text-white transition-colors"
          >
            {t("navFaq", "FAQ")}
          </Link>

          <Link
            to={getLocalizedPath("/privacy-policy")}
            className="hover:text-white transition-colors"
          >
            {isAz ? "Məxfilik Siyasəti" : "Privacy Policy"}
          </Link>

          <Link
            to={getLocalizedPath("/cookie-policy")}
            className="hover:text-white transition-colors"
          >
            {isAz ? "Kuki Siyasəti" : "Cookie Policy"}
          </Link>

          <Link
            to={getLocalizedPath("/terms")}
            className="hover:text-white transition-colors"
          >
            {isAz ? "İstifadə Şərtləri" : "Terms"}
          </Link>

          <button
            onClick={openPreferences}
            type="button"
            className="p-0 border-none bg-transparent text-[11px] sm:text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {isAz ? "Kukilər" : "Cookies"}
          </button>
        </nav>
      </div>
    </footer>
  );
}
