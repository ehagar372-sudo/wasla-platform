import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Heart, Info, Repeat2, ShieldCheck } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";
import { getMember } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { Avatar } from "@/components/ui/avatar";
import { Badge, DemoNotice } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/ui/category-icon";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { locale, t } = await getI18n();
  const { data } = await getMember(locale, id);
  if (!data) return { title: t.profile.notFoundTitle };
  return { title: data.name, description: data.bio ?? undefined };
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const { locale, t } = await getI18n();
  const result = await getMember(locale, id);
  if (!result.data) {
    if (result.error) throw new Error(result.error);
    notFound();
  }
  const member = result.data;
  const p = t.profile;

  return (
    <Container className="py-10 sm:py-14">
      {member.isDemo && (
        <div className="mb-8">
          <DemoNotice>{t.common.demoNotice}</DemoNotice>
        </div>
      )}

      <header className="card flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <Avatar name={member.name} url={member.avatarUrl} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black">{member.name}</h1>
            {member.isDemo && <Badge tone="demo">{t.common.demoBadge}</Badge>}
          </div>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">{member.bio || p.noBio}</p>
          {member.availability && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-lavender px-4 py-1.5 text-sm font-semibold text-accent">
              <CalendarClock className="size-4" aria-hidden="true" />
              {p.availability}: {member.availability}
            </p>
          )}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="offered">
          <h2 id="offered" className="mb-4 text-xl font-bold">
            {p.offered}
          </h2>
          {member.offers.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {member.offers.map((skill) => (
                <li key={skill.id}>
                  <Link href={`/skills/${skill.id}`} className="card card-hover flex h-full items-start gap-4 p-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lavender text-accent">
                      <CategoryIcon slug={skill.categorySlug} className="size-6" />
                    </span>
                    <span>
                      <span className="block font-bold leading-snug">{skill.title}</span>
                      {skill.level && (
                        <span className="mt-1 block text-sm text-muted">{t.common.levels[skill.level]}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="card p-6 text-muted">{p.noOffers}</p>
          )}
          {member.offers.length > 0 && (
            <p className="mt-5 flex items-start gap-2 text-sm leading-7 text-muted">
              <Info className="mt-1 size-4 shrink-0" aria-hidden="true" />
              {p.requestHint}
            </p>
          )}
        </section>

        <div className="space-y-8">
          <section aria-labelledby="wanted">
            <h2 id="wanted" className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Repeat2 className="size-5 text-accent" aria-hidden="true" />
              {p.wanted}
            </h2>
            {member.wants.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {member.wants.map((w) => (
                  <li key={w}>
                    <Badge className="px-4 py-1.5 text-sm">{w}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">{p.noWants}</p>
            )}
          </section>

          {member.interests.length > 0 && (
            <section aria-labelledby="interests">
              <h2 id="interests" className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Heart className="size-5 text-accent" aria-hidden="true" />
                {p.interests}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {member.interests.map((i) => (
                  <li key={i}>
                    <Badge tone="outline" className="px-4 py-1.5 text-sm">
                      {i}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="flex items-start gap-2 text-sm leading-7 text-muted">
            <ShieldCheck className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
            {p.privacy}
          </p>
        </div>
      </div>
    </Container>
  );
}
