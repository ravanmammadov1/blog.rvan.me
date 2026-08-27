import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";

export const GA_MEASUREMENT_ID = "G-WSJMQHM7VM";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Google Analytics 4 (GA4) Integration Component
 * - Ensures gtag.js script is loaded with Measurement ID: G-WSJMQHM7VM
 * - Tracks SPA route transitions automatically on navigation
 * - Synchronizes with Google Consent Mode v2
 */
export default function GoogleAnalytics() {
  const location = useLocation();
  const { consent } = useCookieConsent();

  // 1. Ensure gtag script is injected and initialized
  useEffect(() => {
    if (typeof window === "undefined") return;

    const existingScript = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
    );

    if (!existingScript) {
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
      }

      // Default consent setup for Google Consent Mode v2
      window.gtag("consent", "default", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });

      window.gtag("config", GA_MEASUREMENT_ID, {
        send_page_view: false, // Dispatched dynamically on route change
        anonymize_ip: true,
        cookie_flags: "SameSite=None;Secure",
      });

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }
  }, []);

  // 2. Update Google Consent Mode when user updates preferences
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    window.gtag("consent", "update", {
      analytics_storage: consent?.analytics !== false ? "granted" : "denied",
      ad_storage: consent?.marketing ? "granted" : "denied",
      ad_user_data: consent?.marketing ? "granted" : "denied",
      ad_personalization: consent?.marketing ? "granted" : "denied",
    });
  }, [consent]);

  // 3. Track SPA page views on every React Router navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const pagePath = location.pathname + location.search;
    const pageTitle = document.title || "Rvan.me";

    // Allow slight microtask delay to ensure document.title is up-to-date
    const timer = setTimeout(() => {
      const currentTitle = document.title || "Rvan.me";
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_title: currentTitle,
          page_location: window.location.href,
          page_path: pagePath,
          send_to: GA_MEASUREMENT_ID,
        });
      }

      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: "page_view",
          page_path: pagePath,
          page_title: currentTitle,
          page_location: window.location.href,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}
