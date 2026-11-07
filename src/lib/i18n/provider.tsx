"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dict, Locale } from "./dictionaries";

interface I18nValue {
  locale: Locale;
  t: Dict;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, t, children }: I18nValue & { children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t }}>{children}</I18nContext.Provider>;
}

/** Access the active locale and dictionary inside Client Components. */
export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
