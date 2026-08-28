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
            className="relative w-full max-w-xl rounded-3xl border border-border bg-card text-foreground p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.15)] backdrop-blur-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] dark:bg-[#09090b]/95 dark:border-white/15 z-10 my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-border dark:border-white/10 pb-5">
              <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-primary mono">
                {isAz ? "MƏXFİLİK NƏZARƏTİ" : "PRIVACY CONTROLS"}
              </span>
              <h2 id="cookie-modal-title" className="mt-2 text-xl font-bold tracking-tight text-foreground">
                {isAz ? "Kuki Tənzimləmələri" : "Cookie Preferences"}
              </h2>
            </div>

            <button
              onClick={closePreferences}
              className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/80 dark:border-white/10 text-muted-foreground transition-colors hover:text-foreground cursor-pointer shadow-sm"
              aria-label="Close cookie preferences modal"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground font-medium">
            {isAz
              ? "Rvan.me saytı istifadəçi autentifikasiyasını qorumaq üçün zəruri kukilərdən və platforma sürətini ölçmək üçün analitik kukilərdən istifadə edir."
              : "Rvan.me uses essential cookies to ensure secure user authentication and optional performance cookies to measure aggregate traffic speed. Customize your choices below."}
          </p>

          {/* Categories List */}
          <div className="mt-6 space-y-4 max-h-[48vh] overflow-y-auto pr-1">
            {/* 1. Essential Cookies */}
            <div className="rounded-2xl border border-border bg-muted/40 dark:border-white/10 dark:bg-white/[0.02] p-5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {isAz ? "Zəruri Kukilər" : "Essential Cookies"}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                      {isAz ? "HƏMİŞƏ AKTİV" : "ALWAYS ACTIVE"}
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold text-primary mono">
                  {isAz ? "Tələb Olunur" : "Required"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {isAz
                  ? "Təhlükəsizlik, sessiya idarəetməsi və əsas naviqasiya üçün mütləqdir. Söndürülə bilməz."
                  : "Required for basic site security, session maintenance, and navigation. Cannot be disabled."}
              </p>
            </div>

            {/* 2. Analytics Cookies */}
            <div className="rounded-2xl border border-border bg-card dark:border-white/10 dark:bg-white/[0.02] p-5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {isAz ? "Performans və Analitika" : "Performance & Analytics"}
                    </h4>
                    <span className="text-[10px] font-medium text-muted-foreground mono">
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
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {isAz
                  ? "Anonim səhifə baxışlarını və sayt sürətini ölçməyə kömək edir."
                  : "Helps us measure anonymous page speed and understand how visitors discover articles."}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border dark:border-white/10 pt-5">
            <div className="flex items-center gap-2">
              <button
                onClick={rejectNonEssential}
                className="rounded-full border border-border bg-card dark:border-white/20 dark:bg-transparent px-4 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors mono cursor-pointer"
              >
                {isAz ? "HAMISINI İMTİNA ET" : "REJECT ALL"}
              </button>
              <button
                onClick={acceptAll}
                className="rounded-full border border-border bg-card dark:border-white/20 dark:bg-transparent px-4 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-foreground hover:bg-muted/60 transition-colors mono cursor-pointer"
              >
                {isAz ? "HAMISINI QƏBUL ET" : "ACCEPT ALL"}
              </button>
            </div>

            <button
              onClick={() => savePreferences({ functional, analytics, marketing })}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.14em] text-primary-foreground dark:text-black hover:opacity-90 transition-all mono shadow-sm cursor-pointer ml-auto"
            >
              <Check size={13} /> {isAz ? "SEÇİMLƏRİ YADDA SAXLA" : "SAVE PREFERENCES"}
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
