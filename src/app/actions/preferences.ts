"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/dictionaries";

/** Persists the chosen language in a cookie so it survives navigation and refreshes. */
export async function setLocale(locale: Locale): Promise<void> {
  if (locale !== "ar" && locale !== "en") return;
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
}
