import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, BarChart3, Sliders, Check } from "lucide-react";
import { useCookieConsent } from "../context/CookieConsentContext";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function CookiePreferencesModal() {
  const {
    consent,
    showPreferencesModal,
    closePreferences,
    savePreferences,
    acceptAll,
    rejectNonEssential,
  } = useCookieConsent();
  const { language } = useLanguage();
  const isAz = language === "az";

  const [functional, setFunctional] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);

  useEffect(() => {
    if (consent) {
      setFunctional(consent.functional);
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    } else {
      setFunctional(false);
      setAnalytics(false);
      setMarketing(false);
    }
  }, [consent, showPreferencesModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPreferencesModal) {
        closePreferences();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreferencesModal, closePreferences]);

  return (
    <AnimatePresence>
      {showPreferencesModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            onClick={closePreferences}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.32, ease: [0.25, 1, 0.5, 1] } }}
            exit={{ opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            className="relative w-full max-w-xl rounded-[28px] liquid-glass-dropdown text-foreground p-5 sm:p-7 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-[40px] border border-white/20 dark:border-white/12 z-10 my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-black/[0.08] dark:border-white/[0.08] pb-4 sm:pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full liquid-glass-pill px-3 py-0.5 text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-[.18em] text-[#61c5ad]">
                  {isAz ? "MƏXFİLİK NƏZARƏTİ" : "PRIVACY CONTROLS"}
                </span>
                <h2 id="cookie-modal-title" className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {isAz ? "Kuki Tənzimləmələri" : "Cookie Preferences"}
                </h2>
              </div>

              <button
                onClick={closePreferences}
                className="grid h-8 w-8 place-items-center rounded-full liquid-glass-pill text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                aria-label="Close cookie preferences modal"
              >
                <X size={15} />
              </button>
            </div>

            <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground font-normal">
              {isAz
                ? "Rvan.me saytı istifadəçi autentifikasiyasını qorumaq üçün zəruri kukilərdən və platforma sürətini ölçmək üçün analitik kukilərdən istifadə edir."
                : "Rvan.me uses essential cookies to ensure secure user authentication and optional performance cookies to measure aggregate traffic speed. Customize your choices below."}
            </p>

            {/* Categories List */}
            <div className="mt-5 space-y-3.5 max-h-[48vh] overflow-y-auto pr-1">
              {/* 1. Essential Cookies */}
              <div className="rounded-2xl liquid-glass-pill p-4 sm:p-5 space-y-2 border border-white/10 dark:border-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#61c5ad]/15 text-[#61c5ad] shrink-0">
                      <ShieldCheck size={17} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {isAz ? "Zəruri Kukilər" : "Essential Cookies"}
                      </h4>
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground mono">
                        {isAz ? "HƏMİŞƏ AKTİV" : "ALWAYS ACTIVE"}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-full bg-[#61c5ad]/15 px-2.5 py-0.5 text-[9.5px] font-bold text-[#61c5ad] mono">
                    {isAz ? "Tələb Olunur" : "Required"}
                  </div>
                </div>
                <p className="text-[11.5px] text-muted-foreground leading-relaxed pt-1">
                  {isAz
                    ? "Təhlükəsizlik, sessiya idarəetməsi və əsas naviqasiya üçün mütləqdir. Söndürülə bilməz."
                    : "Required for basic site security, session maintenance, and navigation. Cannot be disabled."}
                </p>
              </div>

              {/* 2. Analytics Cookies */}
              <div className="rounded-2xl liquid-glass-pill p-4 sm:p-5 space-y-2 border border-white/10 dark:border-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#6099df]/15 text-[#6099df] shrink-0">
                      <BarChart3 size={17} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {isAz ? "Performans və Analitika" : "Performance & Analytics"}
                      </h4>
                      <span className="text-[9.5px] font-medium text-muted-foreground mono">
                        Google Tag Manager, Microsoft Clarity
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-black/20 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#61c5ad]"></div>
                  </label>
                </div>
                <p className="text-[11.5px] text-muted-foreground leading-relaxed pt-1">
                  {isAz
                    ? "Anonim səhifə baxışlarını və sayt sürətini ölçməyə kömək edir."
                    : "Helps us measure anonymous page speed and understand how visitors discover articles."}
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.08] dark:border-white/[0.08] pt-4 sm:pt-5">
              <div className="flex items-center gap-2">
                <button
                  onClick={rejectNonEssential}
                  className="rounded-full liquid-glass-pill px-3.5 py-1.5 text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  {isAz ? "HAMISINI İMTİNA ET" : "REJECT ALL"}
                </button>
                <button
                  onClick={acceptAll}
                  className="rounded-full liquid-glass-pill px-3.5 py-1.5 text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {isAz ? "HAMISINI QƏBUL ET" : "ACCEPT ALL"}
                </button>
              </div>

              <button
                onClick={() => savePreferences({ functional, analytics, marketing })}
                className="inline-flex items-center gap-1.5 rounded-full liquid-glass-pill liquid-glass-pill-active px-4 py-2 text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ml-auto"
              >
                <Check size={12} className="text-[#61c5ad]" /> {isAz ? "SEÇİMLƏRİ YADDA SAXLA" : "SAVE PREFERENCES"}
              </button>
            </div>
          </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
