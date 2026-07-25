import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-WSJMQHM7VM";

/**
 * Custom React hook to handle SPA route change tracking in Google Analytics 4.
 * Listens to React Router location changes and dispatches page_view events.
 */
export function useGA4Tracker() {
  const location = useLocation();

  useEffect(() => {
    // Only track pageviews in production or when window.gtag exists
    if (typeof window.gtag !== "function") return;

    // Send page_view event on route change
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname + location.search,
      send_to: GA_MEASUREMENT_ID,
    });
  }, [location]);
}
