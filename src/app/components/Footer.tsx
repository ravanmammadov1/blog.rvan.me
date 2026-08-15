import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";
import { SiteSettings } from "../../types/cms";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { Globe, ArrowUpRight } from "lucide-react";

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

export default function Footer({ siteSettings }: FooterProps) {
  const { openPreferences } = useCookieConsent();
  const { t, getLocalizedPath } = useLanguage();
  const [bakuTime, setBakuTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Baku",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setBakuTime(formatted);
      } catch (e) {
        setBakuTime("");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full border-t border-white/10 bg-background/90 text-foreground px-6 py-10 md:px-10 md:py-12 relative z-10 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] flex flex-col gap-8">
        
        {/* Top Studio Grid */}
        <div className="grid gap-6 md:grid-cols-12 items-center justify-between pb-8 border-b border-white/10">
          <div className="md:col-span-6 flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#61c5ad]/20 text-[#61c5ad] text-xs font-bold border border-[#61c5ad]/40">
                R
              </span>
              <span className="text-xs font-bold tracking-[.18em] uppercase mono text-foreground">
                RVAN.ME STUDIO
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md font-medium leading-relaxed">
              {t("footerStudioDescription", "A high-performance creative design studio and digital publication by Senior Art Director Ravan Mammadov.")}
            </p>
          </div>

          {/* Baku Local Time Clock */}
          <div className="md:col-span-6 flex flex-wrap items-center md:justify-end gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold mono text-foreground glass-sm">
              <Globe size={14} className="text-[#61c5ad]" />
              <span className="text-muted-foreground">BAKU (AZT):</span>
              <span className="text-foreground tracking-widest">{bakuTime || "UTC+4"}</span>
            </div>

            <a
              href="https://www.behance.net/mammadovravan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold mono uppercase text-muted-foreground hover:text-foreground hover:border-[#61c5ad]/50 transition-all duration-300 glass-sm"
            >
              <span>BEHANCE</span>
              <ArrowUpRight size={13} />
            </a>
            <a
              href="https://www.linkedin.com/in/ravanmammadov1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold mono uppercase text-muted-foreground hover:text-foreground hover:border-[#61c5ad]/50 transition-all duration-300 glass-sm"
            >
              <span>LINKEDIN</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Bottom Legal & Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10.5px] font-bold tracking-[.18em] text-muted-foreground/70 mono uppercase">
          <span>© {new Date().getFullYear()} RVAN.ME · RAVAN MAMMADOV ALL RIGHTS RESERVED</span>

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
              className="p-0 border-none bg-transparent text-[10.5px] font-bold tracking-[.18em] text-muted-foreground/70 hover:opacity-100 hover:text-foreground transition-opacity duration-200 mono uppercase cursor-pointer opacity-70"
            >
              {t("cookies", "COOKIES")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
