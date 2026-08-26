export interface TrafficAttribution {
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  referrer?: string;
  entryUrl: string;
  timestamp: string;
}

const ATTRIBUTION_STORAGE_KEY = "rvan_traffic_attribution_v1";

export function captureTrafficAttribution(): TrafficAttribution | null {
  if (typeof window === "undefined") return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");
    const utmContent = params.get("utm_content");
    const referrer = document.referrer || "";

    // Determine traffic source
    let source = utmSource || "";
    if (!source && referrer) {
      if (referrer.includes("google.")) source = "google";
      else if (referrer.includes("linkedin.")) source = "linkedin";
      else if (referrer.includes("instagram.")) source = "instagram";
      else if (referrer.includes("t.me") || referrer.includes("telegram.")) source = "telegram";
      else if (referrer.includes("twitter.") || referrer.includes("x.com")) source = "x";
      else if (referrer.includes("facebook.")) source = "facebook";
      else source = "referral";
    } else if (!source) {
      source = "direct";
    }

    const attribution: TrafficAttribution = {
      source,
      medium: utmMedium || undefined,
      campaign: utmCampaign || undefined,
      content: utmContent || undefined,
      referrer: referrer || undefined,
      entryUrl: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    // Store in sessionStorage for session-level analysis
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return null;
  }
}

export function getStoredTrafficAttribution(): TrafficAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
