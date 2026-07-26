import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, Settings, Check, X } from "lucide-react";
import { useCookieConsent } from "../context/CookieConsentContext";

export default function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectNonEssential, openPreferences } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.aside
        role="region"
        aria-label="Cookie consent banner"
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 left-6 right-6 md:left-10 md:right-auto md:max-w-lg z-50 rounded-2xl border border-white/15 bg-[#141414]/95 text-[#f4f0ea] p-6 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-[#d8ff44]/10 text-[#d8ff44]">
            <Cookie size={20} />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#d8ff44] mono">
                PRIVACY & COOKIES
              </span>
              <button
                onClick={rejectNonEssential}
                className="text-[#8a8070] hover:text-white transition-colors"
                aria-label="Decline non-essential cookies and close"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="mt-1 text-base font-bold text-white tracking-tight">
              We value your privacy.
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-[#8a8070]">
              We use essential cookies to run this site and optional analytics cookies to measure traffic and improve your browsing experience. Read our{" "}
              <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-[#d8ff44]">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/cookie-policy" className="underline underline-offset-2 hover:text-[#d8ff44]">
                Cookie Policy
              </Link>
              .
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={acceptAll}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#d8ff44] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[.14em] text-black hover:bg-white transition-colors mono shadow-lg"
              >
                <Check size={13} /> ACCEPT ALL
              </button>

              <button
                onClick={rejectNonEssential}
                className="rounded-full border border-white/20 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[.14em] text-white hover:border-white transition-colors mono"
              >
                REJECT NON-ESSENTIAL
              </button>

              <button
                onClick={openPreferences}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-[#8a8070] hover:text-[#d8ff44] transition-colors mono ml-auto py-1"
              >
                <Settings size={13} /> PREFERENCES
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
