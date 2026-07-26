import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, BarChart3, Sliders, Check } from "lucide-react";
import { useCookieConsent } from "../context/CookieConsentContext";

export default function CookiePreferencesModal() {
  const {
    consent,
    showPreferencesModal,
    closePreferences,
    savePreferences,
    acceptAll,
    rejectNonEssential,
  } = useCookieConsent();

  const [analytics, setAnalytics] = useState<boolean>(false);
  const [functional, setFunctional] = useState<boolean>(false);

  useEffect(() => {
    if (consent) {
      setAnalytics(consent.analytics);
      setFunctional(consent.functional);
    } else {
      setAnalytics(false);
      setFunctional(false);
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

  if (!showPreferencesModal) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closePreferences}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#141414] text-[#f4f0ea] p-6 sm:p-8 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="inline-block rounded-full bg-[#d8ff44]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-[#d8ff44] mono">
                PRIVACY CONTROLS
              </span>
              <h2 id="cookie-modal-title" className="mt-3 text-2xl font-bold tracking-tight text-white">
                Cookie Preferences
              </h2>
            </div>

            <button
              onClick={closePreferences}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-[#8a8070] transition-colors hover:border-white hover:text-white"
              aria-label="Close cookie preferences modal"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#8a8070]">
            Customize your cookie preferences below. Essential cookies are required to maintain basic website security and accessibility functions. Non-essential cookies help us measure traffic and optimize performance.
          </p>

          {/* Categories List */}
          <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {/* 1. Essential Cookies */}
            <div className="rounded-xl border border-white/10 bg-[#1b1b1b] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#d8ff44]/10 text-[#d8ff44]">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Strictly Necessary Cookies</h3>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#d8ff44] mono mt-0.5">
                      ALWAYS ACTIVE
                    </p>
                  </div>
                </div>

                <div className="flex h-6 w-11 items-center rounded-full bg-[#d8ff44]/30 p-1 opacity-80 cursor-not-allowed">
                  <div className="h-4 w-4 translate-x-5 rounded-full bg-[#d8ff44] shadow" />
                </div>
              </div>
              <p className="mt-3 text-xs text-[#8a8070] leading-relaxed">
                Required for core website security, route navigation, dark theme variables, and remembering your privacy consent preferences.
              </p>
            </div>

            {/* 2. Analytics Cookies */}
            <div className="rounded-xl border border-white/10 bg-[#1b1b1b] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Analytics & Performance</h3>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8a8070] mono mt-0.5">
                      OPTIONAL
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics(!analytics)}
                  className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ff44] ${
                    analytics ? "bg-[#d8ff44]" : "bg-white/20"
                  }`}
                  aria-label="Toggle Analytics & Performance Cookies"
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-black shadow transition-transform duration-200 ${
                      analytics ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="mt-3 text-xs text-[#8a8070] leading-relaxed">
                Allows Google Analytics 4, Microsoft Clarity, and Vercel Speed Insights to anonymously aggregate pageview metrics, load performance, and user interactions to help improve the site.
              </p>
            </div>

            {/* 3. Functional Cookies */}
            <div className="rounded-xl border border-white/10 bg-[#1b1b1b] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Sliders size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Functional & Experience</h3>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8a8070] mono mt-0.5">
                      OPTIONAL
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={functional}
                  onClick={() => setFunctional(!functional)}
                  className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ff44] ${
                    functional ? "bg-[#d8ff44]" : "bg-white/20"
                  }`}
                  aria-label="Toggle Functional & Experience Cookies"
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-black shadow transition-transform duration-200 ${
                      functional ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="mt-3 text-xs text-[#8a8070] leading-relaxed">
                Remembers customized WebGL 3D rendering preferences, hardware acceleration defaults, and animation speed settings for an optimized viewing experience.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex w-full sm:w-auto items-center gap-3">
              <button
                onClick={rejectNonEssential}
                className="w-full sm:w-auto rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[.14em] text-white hover:border-white transition mono"
              >
                REJECT NON-ESSENTIAL
              </button>
              <button
                onClick={acceptAll}
                className="w-full sm:w-auto rounded-full bg-[#d8ff44] px-5 py-2.5 text-xs font-bold uppercase tracking-[.14em] text-black hover:bg-white transition mono"
              >
                ACCEPT ALL
              </button>
            </div>

            <button
              onClick={() => savePreferences({ analytics, functional })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#d8ff44] bg-[#d8ff44]/10 px-6 py-2.5 text-xs font-bold uppercase tracking-[.14em] text-[#d8ff44] hover:bg-[#d8ff44] hover:text-black transition mono"
            >
              <Check size={14} /> SAVE PREFERENCES
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
