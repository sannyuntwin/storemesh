"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function FlagIcon({ language, className = "h-5 w-7" }: { language: "en" | "th"; className?: string }) {
  if (language === "en") {
    return (
      <svg viewBox="0 0 28 20" className={className} aria-hidden>
        <rect width="28" height="20" rx="2" fill="#b22234" />
        <rect y="2" width="28" height="2" fill="#fff" />
        <rect y="6" width="28" height="2" fill="#fff" />
        <rect y="10" width="28" height="2" fill="#fff" />
        <rect y="14" width="28" height="2" fill="#fff" />
        <rect y="18" width="28" height="2" fill="#fff" />
        <rect width="12" height="10" rx="1" fill="#3c3b6e" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 28 20" className={className} aria-hidden>
      <rect width="28" height="20" rx="2" fill="#da121a" />
      <rect y="4" width="28" height="12" fill="#fff" />
      <rect y="7" width="28" height="6" fill="#241d8c" />
    </svg>
  );
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en" as const, label: "English" },
    { code: "th" as const, label: "ไทย" }
  ];

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "th")}
        className="appearance-none w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
      >
        {languages.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <Globe className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}

export function LanguageToggleButton() {
  const { language, toggleLanguage } = useLanguage();
  const nextLanguage = language === "en" ? "th" : "en";

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
      aria-label="Toggle language"
      title={nextLanguage === "th" ? "Switch to Thai" : "Switch to English"}
    >
      <FlagIcon language={language} />
    </button>
  );
}
