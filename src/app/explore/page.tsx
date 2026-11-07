import type { Metadata } from "next";
import Link from "next/link";
import { Search, SearchX, TriangleAlert } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";
import { getCategories, getListings } from "@/lib/data";
import { levels } from "@/lib/types";
import { cx, fmt } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button, ButtonLink } from "@/components/ui/button";
import { DemoNotice } from "@/components/ui/badge";
import { SkillCard } from "@/components/skills/skill-card";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.explore.metaTitle, description: t.explore.text };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 100) ?? "";
}

export default async function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { locale, t } = await getI18n();
  const e = t.explore;

  const q = first(params.q);
  const category = first(params.category);
  const levelParam = first(params.level);
  const level = (levels as string[]).includes(levelParam) ? levelParam : "";

  const [categoriesResult, listingsResult] = await Promise.all([
    getCategories(locale),
    getListings(locale, { q, category, level }),
  ]);
  const listings = listingsResult.data;
  const hasFilters = Boolean(q || category || level);

  const chipHref = (slug: string) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (level) sp.set("level", level);
    if (slug) sp.set("category", slug);
    const qs = sp.toString();
    return qs ? `/explore?${qs}` : "/explore";
  };

  const resultsLabel =
    listings.length === 0 ? e.resultsNone : listings.length === 1 ? e.resultsOne : fmt(e.results, { count: listings.length });

  return (
    <>
      <section className="hero-glow border-b border-border">
        <Container className="py-12 sm:py-16">
          <h1 className="text-4xl font-black sm:text-5xl">{e.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{e.text}</p>

          <form action="/explore" method="get" role="search" className="mt-8 grid gap-3 md:grid-cols-[1fr_14rem_auto]">
            {category && <input type="hidden" name="category" value={category} />}
            <div>
              <label htmlFor="q" className="sr-only">
                {e.searchLabel}
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="q"
                  name="q"
                  type="search"
                  defaultValue={q}
                  placeholder={e.searchPlaceholder}
                  className="field ps-12"
                />
              </div>
            </div>
            <div>
              <label htmlFor="level" className="sr-only">
                {e.levelLabel}
              </label>
              <select id="level" name="level" defaultValue={level} className="field">
                <option value="">{e.allLevels}</option>
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {t.common.levels[l]}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" size="lg" className="min-h-12">
              {e.apply}
            </Button>
          </form>

          <nav aria-label={e.categoriesLabel} className="mt-6">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href={chipHref("")}
                  aria-current={!category ? "true" : undefined}
                  className={cx(
                    "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                    !category ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:bg-lavender",
                  )}
                >
                  {e.allCategories}
                </Link>
              </li>
              {categoriesResult.data.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={chipHref(c.slug)}
                    aria-current={category === c.slug ? "true" : undefined}
                    className={cx(
                      "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                      category === c.slug
                        ? "border-primary bg-primary text-primary-fg"
                        : "border-border bg-surface hover:bg-lavender",
                    )}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        {listingsResult.demo && (
          <div className="mb-8">
            <DemoNotice>{t.common.demoNotice}</DemoNotice>
          </div>
        )}

        {listingsResult.error ? (
          <div role="alert" className="card mx-auto max-w-lg p-10 text-center">
            <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-danger/15 text-danger">
              <TriangleAlert className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold">{e.errorTitle}</h2>
            <p className="mt-2 text-muted">{e.errorText}</p>
            <ButtonLink href="/explore" className="mt-6">
              {t.common.retry}
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold text-muted" aria-live="polite">
                {resultsLabel}
              </p>
              {hasFilters && (
                <ButtonLink href="/explore" variant="ghost" size="sm">
                  {e.clear}
                </ButtonLink>
              )}
            </div>

            {listings.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                  <SkillCard key={listing.id} listing={listing} t={t} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="card mx-auto max-w-lg p-10 text-center">
                <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-lavender text-accent">
                  <SearchX className="size-7" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-bold">{e.emptyTitle}</h2>
                <p className="mt-2 text-muted">{e.emptyText}</p>
                {hasFilters && (
                  <ButtonLink href="/explore" variant="secondary" className="mt-6">
                    {e.clear}
                  </ButtonLink>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
