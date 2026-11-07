"use client";

import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

/** Toggles the "dark" class on <html> and remembers the choice. The icons switch via CSS, so there is no hydration mismatch. */
export function ThemeToggle() {
  const { t } = useI18n();

  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("wasla-theme", isDark ? "dark" : "light");
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.toggleTheme}
      title={t.nav.toggleTheme}
      className="grid size-10 place-items-center rounded-full border border-border bg-surface text-text transition-colors hover:bg-lavender"
    >
      <Moon className="size-[1.15rem] dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-[1.15rem] dark:block" aria-hidden="true" />
    </button>
  );
}
