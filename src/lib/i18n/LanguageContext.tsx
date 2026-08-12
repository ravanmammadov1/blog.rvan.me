import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, Language } from "./translations";

interface LanguageContextType {
  language: Language;
  isAz: boolean;
  setLanguage: (lang: Language) => void;
  switchLanguage: (targetLang: Language) => void;
  getLocalizedPath: (path: string, targetLang?: Language) => string;
  t: (key: string, fallbackEn?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function getLocalizedPath(path: string, targetLang: Language): string {
  if (!path) return targetLang === "az" ? "/az" : "/";

  // Clean path
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // If path already starts with /az
  const isAzPath = cleanPath === "/az" || cleanPath.startsWith("/az/");

  if (targetLang === "az") {
    if (isAzPath) return cleanPath;
    return cleanPath === "/" ? "/az" : `/az${cleanPath}`;
  } else {
    // English
    if (!isAzPath) return cleanPath;
    const stripped = cleanPath.replace(/^\/az/, "");
    return stripped === "" ? "/" : stripped;
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect language from current URL
  const currentLanguage: Language = useMemo(() => {
    const pathname = location.pathname;
    return pathname === "/az" || pathname.startsWith("/az/") ? "az" : "en";
  }, [location.pathname]);

  const [language, setLanguageState] = useState<Language>(currentLanguage);

  useEffect(() => {
    setLanguageState(currentLanguage);
  }, [currentLanguage]);

  const isAz = language === "az";

  // Auto-detect Azerbaijan location and redirect to /az if appropriate
  useEffect(() => {
    try {
      const savedPref = localStorage.getItem("rvan_user_lang_preference");

      // If user explicitly chose 'en', respect explicit choice
      if (savedPref === "en") return;

      // DO NOT auto-redirect away from explicit sub-pages (/blog, /news, /about, etc.)
      // The requested URL takes absolute priority over IP/timezone detection.
      const isRootPath = location.pathname === "/";
      if (!isRootPath) return;

      const isAlreadyAzUrl = location.pathname === "/az" || location.pathname.startsWith("/az/");

      // Check timezone, browser language, or saved preference
      const isBakuTimezone = typeof Intl !== "undefined" && Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Baku";
      const isAzBrowserLang = typeof navigator !== "undefined" && (
        (navigator.language && navigator.language.toLowerCase().startsWith("az")) ||
        (navigator.languages && navigator.languages.some(l => l.toLowerCase().startsWith("az")))
      );

      const isAzerbaijanLocation = savedPref === "az" || isBakuTimezone || isAzBrowserLang;

      if (isAzerbaijanLocation && !isAlreadyAzUrl) {
        const targetPath = getLocalizedPath(location.pathname, "az") + location.search + location.hash;
        navigate(targetPath, { replace: true });
      }
    } catch (e) {
      console.warn("Language auto-detection exception:", e);
    }
  }, []);

  const switchLanguage = (targetLang: Language) => {
    try {
      localStorage.setItem("rvan_user_lang_preference", targetLang);
    } catch (e) {}

    if (targetLang === language) return;
    const targetPath = getLocalizedPath(location.pathname, targetLang) + location.search + location.hash;
    setLanguageState(targetLang);
    navigate(targetPath);
  };

  const setLanguage = (lang: Language) => {
    switchLanguage(lang);
  };

  const t = (key: string, fallbackEn?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary or provided fallbackEn
    if (translations.en[key]) {
      return translations.en[key];
    }
    return fallbackEn || key;
  };

  const value = useMemo(
    () => ({
      language,
      isAz,
      setLanguage,
      switchLanguage,
      getLocalizedPath: (p: string, lang?: Language) => getLocalizedPath(p, lang || language),
      t,
    }),
    [language, isAz, location.pathname, location.search, location.hash]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
