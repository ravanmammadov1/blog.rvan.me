import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-5 left-5 right-5 md:left-8 md:right-auto md:max-w-md z-50 rounded-3xl border border-white/15 bg-[#09090b]/95 text-foreground p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Cookie size={18} />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9.5px] font-bold uppercase tracking-[.18em] text-primary mono">
                PRIVACY & COOKIES
              </span>
              <button
                onClick={rejectNonEssential}
                className="text-muted-foreground hover:text-white transition-colors p-0.5"
                aria-label="Decline non-essential cookies and close"
              >
                <X size={15} />
              </button>
            </div>

            <h3 className="mt-1 text-sm font-bold text-foreground tracking-tight">
              We value your privacy.
            </h3>

            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground font-medium">
              We use essential cookies to operate this site and optional performance cookies to measure traffic. Read our{" "}
              <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-primary">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/cookie-policy" className="underline underline-offset-2 hover:text-primary">
                Cookie Policy
              </Link>
              .
            </p>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={acceptAll}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-black hover:bg-white transition-colors mono shadow-md cursor-pointer"
              >
                <Check size={12} /> ACCEPT ALL
              </button>

              <button
                onClick={rejectNonEssential}
                className="rounded-full border border-white/20 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-foreground hover:border-white transition-colors mono cursor-pointer"
              >
                DECLINE OPTIONAL
              </button>

              <button
                onClick={openPreferences}
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground hover:text-primary transition-colors mono ml-auto py-1 cursor-pointer"
              >
                <Settings size={12} /> PREFERENCES
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
