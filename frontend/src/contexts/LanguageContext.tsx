"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type Language = "en" | "th";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "language";
const LANGUAGE_COOKIE_NAME = "NEXT_LOCALE";
const LANGUAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const toSupportedLanguage = (value: string | null | undefined): Language => (value === "th" ? "th" : "en");

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  const [language, setLanguageState] = useState<Language>(toSupportedLanguage(locale));

  const persistLanguage = (newLanguage: Language) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${newLanguage}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  };

  const setLanguage = (newLanguage: Language) => {
    if (newLanguage === language) {
      return;
    }

    setLanguageState(newLanguage);
    persistLanguage(newLanguage);
    router.refresh();
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "th" : "en";
    setLanguage(newLanguage);
  };

  const isRTL = false;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const currentLocaleLanguage = toSupportedLanguage(locale);

    setLanguageState(currentLocaleLanguage);
    persistLanguage(currentLocaleLanguage);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
