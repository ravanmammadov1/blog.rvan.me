import React, { createContext, useContext, useEffect, useState } from "react";

export interface ConsentPreferences {
  essential: boolean; // Always true
  functional: boolean; // 3D WebGL / UI preferences
  analytics: boolean; // GA4, Clarity, Vercel Analytics & Speed Insights
  marketing: boolean; // Marketing & Advertising (Currently inactive / modular for future expansion)
}

export interface CookieConsentContextType {
  consent: ConsentPreferences | null;
  hasDecided: boolean;
  showBanner: boolean;
  showPreferencesModal: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (prefs: Partial<ConsentPreferences>) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const STORAGE_KEY = "ravan_cookie_consent_v1";
const COOKIE_NAME = "ravan_cookie_consent";

const DEFAULT_PREFERENCES: ConsentPreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

function getStoredConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (typeof parsed === "object" && parsed !== null && "essential" in parsed) {
        return {
          essential: true,
          functional: Boolean(parsed.functional),
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        };
      }
    }
  } catch (e) {
    console.warn("Failed to read cookie consent from localStorage:", e);
  }
  return null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax; Secure`;
}

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<ConsentPreferences | null>(getStoredConsent);
  const [hasDecided, setHasDecided] = useState<boolean>(() => getStoredConsent() !== null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);

  useEffect(() => {
    if (!hasDecided) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [hasDecided]);

  const persistConsent = (prefs: ConsentPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      setCookie(COOKIE_NAME, JSON.stringify(prefs));
    } catch (e) {
      console.warn("Failed to persist cookie consent:", e);
    }
    setConsent(prefs);
    setHasDecided(true);
    setShowBanner(false);
  };

  const acceptAll = () => {
    persistConsent({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectNonEssential = () => {
    persistConsent({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  const savePreferences = (prefs: Partial<ConsentPreferences>) => {
    persistConsent({
      essential: true,
      functional: Boolean(prefs.functional),
      analytics: Boolean(prefs.analytics),
      marketing: Boolean(prefs.marketing),
    });
    setShowPreferencesModal(false);
  };

  const openPreferences = () => {
    setShowPreferencesModal(true);
  };

  const closePreferences = () => {
    setShowPreferencesModal(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasDecided,
        showBanner,
        showPreferencesModal,
        acceptAll,
        rejectNonEssential,
        savePreferences,
        openPreferences,
        closePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export function useCookieConsent(): CookieConsentContextType {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
}
