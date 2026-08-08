import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          transition={{ duration: 0.2 }}
          onClick={closePreferences}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#09090b]/95 text-foreground p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl z-10 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-primary mono">
                PRIVACY CONTROLS
              </span>
              <h2 id="cookie-modal-title" className="mt-2 text-xl font-bold tracking-tight text-foreground">
                Cookie Preferences
              </h2>
            </div>

            <button
              onClick={closePreferences}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-white hover:text-white"
              aria-label="Close cookie preferences modal"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground font-medium">
            Rvan.me uses essential cookies to ensure site security and optional performance cookies to measure aggregate traffic speed. Customize your choices below.
          </p>

          {/* Categories List */}
          <div className="mt-6 space-y-4 max-h-[45vh] overflow-y-auto pr-1">
            {/* 1. Essential Cookies */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Strictly Necessary Cookies</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mono mt-0.5">
                      ALWAYS ACTIVE
                    </p>
                  </div>
                </div>

                <div className="flex h-5 w-9 items-center rounded-full bg-primary/20 p-0.5 opacity-80 cursor-not-allowed shrink-0">
                  <div className="h-4 w-4 translate-x-4 rounded-full bg-primary shadow" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Required for core Google OAuth authentication, session routing, and remembering your privacy choices.
              </p>
            </div>

            {/* 2. Analytics Cookies */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Analytics & Performance</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono mt-0.5">
                      OPTIONAL
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics(!analytics)}
                  className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 cursor-pointer ${
                    analytics ? "bg-primary" : "bg-white/20"
                  }`}
                  aria-label="Toggle Analytics & Performance Cookies"
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-black shadow transition-transform duration-200 ${
                      analytics ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Enables Google Analytics 4, Microsoft Clarity, and Vercel Speed Insights to aggregate anonymous metrics to optimize site speed.
              </p>
            </div>

            {/* 3. Functional Cookies */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                    <Sliders size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Functional & Customization</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono mt-0.5">
                      OPTIONAL
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={functional}
                  onClick={() => setFunctional(!functional)}
                  className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 cursor-pointer ${
                    functional ? "bg-primary" : "bg-white/20"
                  }`}
                  aria-label="Toggle Functional & Customization Cookies"
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-black shadow transition-transform duration-200 ${
                      functional ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Remembers custom font specimen preview text, type sizes, and interactive sandbox states.
              </p>
            </div>
          </div>

          {/* Action Buttons — 1 Clear Primary Action */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2">
              <button
                onClick={rejectNonEssential}
                className="w-full sm:w-auto rounded-full border border-white/20 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[.14em] text-foreground hover:border-white hover:bg-white/5 transition-all mono cursor-pointer"
              >
                DECLINE OPTIONAL
              </button>
              <button
                onClick={acceptAll}
                className="w-full sm:w-auto rounded-full border border-white/20 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[.14em] text-foreground hover:border-white hover:bg-white/5 transition-all mono cursor-pointer"
              >
                ACCEPT ALL
              </button>
            </div>

            {/* Single Primary Action */}
            <button
              onClick={() => savePreferences({ analytics, functional })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[10.5px] font-bold uppercase tracking-[.14em] text-black hover:bg-white transition-all mono shadow-lg cursor-pointer"
            >
              <Check size={14} /> SAVE PREFERENCES
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
