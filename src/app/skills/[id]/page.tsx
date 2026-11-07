import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Repeat2 } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";
import { getListing, getListings } from "@/lib/data";
import { categoryPhoto } from "@/lib/photos";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Container } from "@/components/ui/container";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Badge, DemoNotice } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { RequestExchange } from "@/components/forms/request-exchange";
import { SkillCard } from "@/components/skills/skill-card";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { locale, t } = await getI18n();
  const { data } = await getListing(locale, id);
  if (!data) return { title: t.skill.notFoundTitle };
  return { title: data.title, description: data.description ?? undefined };
}

async function currentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

export default async function SkillPage({ params }: Props) {
  const { id } = await params;
  const { locale, t } = await getI18n();
  const result = await getListing(locale, id);
  if (!result.data) {
    if (result.error) throw new Error(result.error);
    notFound();
  }
  const listing = result.data;
  const userId = await currentUserId();

  const related = (await getListings(locale, { category: listing.category?.slug }, 4)).data
    .filter((l) => l.id !== listing.id)
    .slice(0, 3);
  const sep = locale === "ar" ? "، " : ", ";

  return (
    <Container className="py-10 sm:py-14">
      <Link href="/explore" className="mb-6 inline-flex items-center gap-2 font-semibold text-accent hover:underline">
        <ArrowRight className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
        {t.common.backToExplore}
      </Link>

      {result.demo && (
        <div className="mb-8">
          <DemoNotice>{t.common.demoNotice}</DemoNotice>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <article>
          <PhotoSlot
            file={categoryPhoto(listing.category?.slug) ?? "/photos/categories/other.jpg"}
            alt={listing.category?.name ?? listing.title}
            slotLabel={t.common.photoSlot}
            quiet
            priority
            sizes="(min-width: 1024px) 700px, 100vw"
            className="aspect-[16/8] rounded-3xl ring-1 ring-border"
            fallback={
              <span className="grid size-20 place-items-center rounded-3xl bg-surface text-accent shadow-sm">
                <CategoryIcon slug={listing.category?.slug} className="size-10" />
              </span>
            }
          />

          <div className="mt-7 flex flex-wrap items-center gap-2">
            {listing.category && <Badge>{listing.category.name}</Badge>}
            {listing.level && <Badge tone="outline">{t.common.levels[listing.level]}</Badge>}
            {listing.isDemo && <Badge tone="demo">{t.common.demoBadge}</Badge>}
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">{listing.title}</h1>

          {listing.description && (
            <section className="mt-8">
              <h2 className="mb-3 text-xl font-bold">{t.skill.about}</h2>
              <p className="text-lg leading-8 text-muted">{listing.description}</p>
            </section>
          )}

          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold">{t.skill.outcomes}</h2>
            {listing.outcomes.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {listing.outcomes.map((o) => (
                  <li key={o} className="card flex items-start gap-3 p-4">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success/20 text-success">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                    <span className="leading-7">{o}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">{t.skill.outcomesEmpty}</p>
            )}
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold">{t.skill.wantsTitle}</h2>
            {listing.wants.length > 0 ? (
              <p className="card flex items-start gap-3 p-5 leading-7">
                <Repeat2 className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                {listing.wants.join(sep)}
              </p>
            ) : (
              <p className="text-muted">{t.skill.wantsEmpty}</p>
            )}
          </section>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">{t.skill.teacher}</h2>
            <Link href={`/profile/${listing.teacher.id}`} className="flex items-center gap-4 hover:text-accent">
              <Avatar name={listing.teacher.name} url={listing.teacher.avatarUrl} size="lg" />
              <span className="text-lg font-bold">{listing.teacher.name}</span>
            </Link>
            {listing.teacher.bio && <p className="mt-4 leading-7 text-muted">{listing.teacher.bio}</p>}
            <ButtonLink href={`/profile/${listing.teacher.id}`} variant="secondary" size="sm" className="mt-5">
              {t.common.viewProfile}
            </ButtonLink>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold">{t.skill.exchange.title}</h2>
            <p className="mb-5 mt-1 text-sm text-muted">{t.skill.exchange.text}</p>
            <RequestExchange
              listingId={listing.id}
              skillId={listing.skillId}
              teacherId={listing.teacher.id}
              userId={userId}
              isDemo={listing.isDemo}
              supabaseReady={isSupabaseConfigured}
            />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">{t.common.category}: {listing.category?.name}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => (
              <SkillCard key={l.id} listing={l} t={t} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
