import { useEffect } from "react";

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

export const CLARITY_PROJECT_ID =
  import.meta.env.VITE_CLARITY_PROJECT_ID || "xrujhevj2n";

/**
 * Custom React hook to safely initialize Microsoft Clarity in production environments.
 * Prevents duplicate initialization and seamlessly handles SPA session recordings.
 */
export function useClarity() {
  useEffect(() => {
    // Only run in browser context
    if (typeof window === "undefined") return;

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
  }, []);
}
