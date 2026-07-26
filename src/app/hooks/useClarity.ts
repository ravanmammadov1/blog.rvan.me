import { useEffect } from "react";
import { useCookieConsent } from "../context/CookieConsentContext";

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

export const CLARITY_PROJECT_ID =
  import.meta.env.VITE_CLARITY_PROJECT_ID || "xrujhevj2n";

/**
 * Custom React hook to safely initialize Microsoft Clarity in production environments.
 * Prevents duplicate initialization and handles session recordings ONLY when analytics consent is granted.
 */
export function useClarity() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    // Only run in browser context and ONLY if analytics consent is granted
    if (typeof window === "undefined") return;
    if (!consent?.analytics) return;

    // Prevent duplicate script insertion
    if (window.clarity) return;

    // Official Microsoft Clarity snippet
    (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
  }, [consent]);
}

