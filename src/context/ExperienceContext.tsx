import React, { createContext, useContext, useEffect, useState } from "react";

interface ExperienceSettings {
  animations: boolean;
  cursorEffects: boolean;
  backgroundEffects: boolean;
}

interface ExperienceContextType {
  settings: ExperienceSettings;
  toggleAnimations: () => void;
  toggleCursorEffects: () => void;
  toggleBackgroundEffects: () => void;
}

const defaultSettings: ExperienceSettings = {
  animations: true,
  cursorEffects: true,
  backgroundEffects: true,
};

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ExperienceSettings>(() => {
    try {
      const saved = localStorage.getItem("rvan_experience_settings");
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {}
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem("rvan_experience_settings", JSON.stringify(settings));
    } catch (e) {}

    const root = document.documentElement;
    if (!settings.animations) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    if (!settings.backgroundEffects) {
      root.classList.add("disable-bg-effects");
    } else {
      root.classList.remove("disable-bg-effects");
    }
  }, [settings]);

  const toggleAnimations = () => {
    setSettings((prev) => ({ ...prev, animations: !prev.animations }));
  };

  const toggleCursorEffects = () => {
    setSettings((prev) => ({ ...prev, cursorEffects: !prev.cursorEffects }));
  };

  const toggleBackgroundEffects = () => {
    setSettings((prev) => ({ ...prev, backgroundEffects: !prev.backgroundEffects }));
  };

  return (
    <ExperienceContext.Provider
      value={{
        settings,
        toggleAnimations,
        toggleCursorEffects,
        toggleBackgroundEffects,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used within an ExperienceProvider");
  }
  return context;
}
