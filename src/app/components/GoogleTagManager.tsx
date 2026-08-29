import { useEffect } from "react";
import { useCookieConsent } from "../context/CookieConsentContext";

const GTM_ID = "GTM-TX3NCK38";

/** Loads GTM only after the visitor grants analytics consent. */
export default function GoogleTagManager() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!consent?.analytics || typeof window === "undefined") return;
    if (document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    const script = document.createElement("script");
    script.async = true;
    script.dataset.gtmId = GTM_ID;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);
  }, [consent?.analytics]);

  return null;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}
