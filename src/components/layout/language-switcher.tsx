import { Globe } from "lucide-react";
import { setLocale } from "@/app/actions/preferences";
import { getI18n } from "@/lib/i18n/server";

/** Server-action form: sets the language cookie, then the whole layout re-renders in the new language/direction. */
export async function LanguageSwitcher() {
  const { locale, t } = await getI18n();
  const next = locale === "ar" ? "en" : "ar";

  return (
    <form action={setLocale.bind(null, next)}>
      <button
        type="submit"
        lang={next}
        aria-label={t.nav.switchLanguageLabel}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-sm font-semibold transition-colors hover:bg-lavender"
      >
        <Globe className="size-4" aria-hidden="true" />
        {t.nav.switchLanguage}
      </button>
    </form>
  );
}
