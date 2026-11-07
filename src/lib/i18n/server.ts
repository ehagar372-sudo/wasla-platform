import { cookies } from "next/headers";
import { LOCALE_COOKIE, defaultLocale, dictionaries, type Dict, type Locale } from "./dictionaries";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "en" || value === "ar" ? value : defaultLocale;
}

export async function getI18n(): Promise<{ locale: Locale; t: Dict }> {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
