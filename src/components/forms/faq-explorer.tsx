"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";

/** Searchable FAQ grouped by category. */
export function FaqExplorer() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return t.faq.groups
      .map((g) => ({
        ...g,
        items: g.items
          .map((item, index) => ({ id: `${g.id}-${index}`, q: item.q, a: item.a }))
          .filter((item) => !needle || item.q.toLowerCase().includes(needle) || item.a.toLowerCase().includes(needle)),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, t.faq.groups]);

  return (
    <div>
      <label htmlFor="faq-search" className="sr-only">
        {t.faq.searchLabel}
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.faq.searchPlaceholder}
          className="field ps-12"
        />
      </div>

      <div aria-live="polite" className="mt-10 space-y-10">
        {groups.length === 0 ? (
          <div className="card p-10 text-center">
            <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-lavender text-accent">
              <SearchX className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold">{t.faq.emptyTitle}</h2>
            <p className="mt-2 text-muted">{t.faq.emptyText}</p>
            <ButtonLink href="/contact" className="mt-6">
              {t.faq.contactCta}
            </ButtonLink>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.id} aria-labelledby={`faq-group-${g.id}`}>
              <h2 id={`faq-group-${g.id}`} className="mb-4 text-lg font-bold text-accent">
                {g.title}
              </h2>
              <Accordion items={g.items} />
            </section>
          ))
        )}
      </div>
    </div>
  );
}
