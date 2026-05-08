"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <div className="relative">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
        className="appearance-none w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
      >
        {themes.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <Monitor className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
      aria-label="Toggle theme"
    >
      {getIcon()}
    </button>
  );
}
