import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings, Check, X } from "lucide-react";
import { useCookieConsent } from "../context/CookieConsentContext";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectNonEssential, openPreferences } = useCookieConsent();
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.aside
        role="region"
        aria-label="Cookie consent banner"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed bottom-3.5 left-3.5 right-3.5 sm:bottom-5 sm:left-5 sm:right-5 md:left-8 md:right-auto md:max-w-md z-50 rounded-[26px] liquid-glass-dropdown p-4 sm:p-5 md:p-6 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-[36px] border border-white/20 dark:border-white/12"
      >
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="grid h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 place-items-center rounded-2xl liquid-glass-pill text-primary">
            <Cookie size={16} className="text-[#61c5ad]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full liquid-glass-pill text-[9px] sm:text-[9.5px] font-mono font-bold tracking-widest text-[#61c5ad] uppercase">
                {isAz ? "MƏXFİLİK VƏ KUKİLƏR" : t("privacyCookiesTag", "PRIVACY & COOKIES")}
              </span>
              <button
                onClick={rejectNonEssential}
                className="h-6 w-6 rounded-full liquid-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Decline non-essential cookies and close"
              >
                <X size={13} />
              </button>
            </div>

            <h3 className="mt-2 text-[13.5px] sm:text-sm font-bold text-foreground tracking-tight">
              {isAz ? "Məxfiliyinizə önəm veririk." : t("cookieHeaderTitle", "We value your privacy.")}
            </h3>

            <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-muted-foreground font-normal">
              {isAz
                ? "Saytın fəaliyyəti üçün zəruri və platforma təcrübəsini artırmaq üçün analitik kukilərdən istifadə edirik. Ətraflı:"
                : t("cookieBodyText", "We use essential cookies to operate this site and optional performance cookies to measure traffic. Read our")}{" "}
              <Link to={getLocalizedPath("/privacy-policy")} className="underline underline-offset-2 hover:text-[#61c5ad] transition-colors">
                {isAz ? "Məxfilik Siyasəti" : t("privacyPolicy", "Privacy Policy")}
              </Link>{" "}
              {isAz ? "və" : t("andWord", "and")}{" "}
              <Link to={getLocalizedPath("/cookie-policy")} className="underline underline-offset-2 hover:text-[#61c5ad] transition-colors">
                {isAz ? "Kuki Siyasəti" : t("cookiePolicy", "Cookie Policy")}
              </Link>
              .
            </p>

            {/* Action Buttons — Liquid Glass Pills */}
            <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={acceptAll}
                className="inline-flex items-center gap-1.5 rounded-full liquid-glass-pill liquid-glass-pill-active px-3.5 py-1.5 sm:px-4 sm:py-2 text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                <Check size={11} className="text-[#61c5ad]" /> {isAz ? "HAMISINI QƏBUL ET" : "ACCEPT ALL"}
              </button>

              <button
                onClick={rejectNonEssential}
                className="rounded-full liquid-glass-pill px-3 py-1.5 sm:px-3.5 sm:py-2 text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                {isAz ? "İMTİNA ET" : "DECLINE OPTIONAL"}
              </button>

              <button
                onClick={openPreferences}
                className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-[#61c5ad] transition-colors ml-auto py-1 cursor-pointer"
              >
                <Settings size={11} /> {isAz ? "TƏNZİMLƏMƏLƏR" : "PREFERENCES"}
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
