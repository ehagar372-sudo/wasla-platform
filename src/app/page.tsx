import Link from "next/link";
import { ArrowRight, BookOpenCheck, Check, HeartHandshake, Search, Sparkles, UserPlus, Users, Wallet } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";
import { getCategories, getListings } from "@/lib/data";
import { photos } from "@/lib/photos";
import { Container, Section, SectionHeading } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Reveal } from "@/components/ui/reveal";
import { DemoNotice } from "@/components/ui/badge";
import { SkillCard } from "@/components/skills/skill-card";

export default async function HomePage() {
  const { locale, t } = await getI18n();
  const h = t.home;
  const [categoriesResult, listingsResult] = await Promise.all([getCategories(locale), getListings(locale, {}, 3)]);
  const categories = categoriesResult.data;
  const featured = listingsResult.data;

  const stepIcons = [UserPlus, BookOpenCheck, Search, HeartHandshake];
  const benefitIcons = [Wallet, Sparkles, Users, BookOpenCheck];

  return (
    <>
      {/* HERO */}
      <section className="hero-glow relative overflow-hidden">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex rounded-full bg-lavender px-4 py-1.5 text-sm font-semibold text-accent">
              {h.hero.eyebrow}
            </p>
            <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">{h.hero.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{h.hero.text}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/sign-up" size="lg">
                {h.hero.ctaPrimary}
              </ButtonLink>
              <ButtonLink href="/explore" variant="secondary" size="lg">
                {h.hero.ctaSecondary}
              </ButtonLink>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <PhotoSlot
              file={photos.hero.file}
              alt={photos.hero.alt[locale]}
              slotLabel={t.common.photoSlot}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[4/4.3] rounded-[2rem] shadow-[var(--shadow-lg)] ring-1 ring-border"
            />
            {/* Decorative chips illustrating the concept (marked as an example) */}
            <div
              aria-hidden="true"
              className="animate-float absolute -bottom-5 start-4 rounded-2xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-lg)] sm:start-[-1.5rem]"
            >
              <p className="text-xs font-semibold text-muted">{h.hero.chipLabel}</p>
              <p className="mt-1 font-bold text-accent">{h.hero.chipTeach}</p>
              <p className="font-bold">{h.hero.chipLearn}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CONCEPT */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <PhotoSlot
              file={photos.concept.file}
              alt={photos.concept.alt[locale]}
              slotLabel={t.common.photoSlot}
              className="aspect-[4/3] rounded-3xl shadow-[var(--shadow)] ring-1 ring-border"
            />
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading align="start" eyebrow={h.concept.eyebrow} title={h.concept.title} text={h.concept.text} />
            <ul className="mt-8 space-y-5">
              {h.concept.points.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-fg">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-muted">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* CATEGORIES */}
      <Section tone="soft">
        <SectionHeading eyebrow={h.categories.eyebrow} title={h.categories.title} text={h.categories.text} />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 70}>
              <Link
                href={`/explore?category=${c.slug}`}
                className="card card-hover flex h-full flex-col items-center gap-3 p-6 text-center"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-lavender text-accent">
                  <CategoryIcon slug={c.slug} className="size-7" />
                </span>
                <span className="font-bold leading-snug">{c.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/explore" variant="secondary">
            {h.categories.explore}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      {/* STEPS */}
      <Section>
        <SectionHeading eyebrow={h.steps.eyebrow} title={h.steps.title} text={h.steps.text} />
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {h.steps.items.map((step, i) => {
            const Icon = stepIcons[i] ?? UserPlus;
            return (
              <li key={step.title}>
                <Reveal delay={i * 80} className="h-full">
                  <div className="card relative h-full p-6">
                    <span className="absolute end-5 top-4 text-5xl font-black text-lavender" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-primary text-primary-fg">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-muted">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
        <div className="mt-10 text-center">
          <ButtonLink href="/how-it-works" variant="ghost">
            {h.steps.learnMore}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      {/* FEATURED SKILLS */}
      <Section tone="soft">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading align="start" eyebrow={h.featured.eyebrow} title={h.featured.title} text={h.featured.text} />
          <ButtonLink href="/explore" variant="secondary">
            {h.featured.all}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </ButtonLink>
        </div>
        {listingsResult.demo && (
          <div className="mt-6">
            <DemoNotice>{t.common.demoNotice}</DemoNotice>
          </div>
        )}
        {featured.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing, i) => (
              <Reveal key={listing.id} delay={i * 80}>
                <SkillCard listing={listing} t={t} locale={locale} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="card mt-10 p-8 text-center text-muted">{h.featured.empty}</p>
        )}
      </Section>

      {/* BENEFITS */}
      <Section>
        <SectionHeading eyebrow={h.benefits.eyebrow} title={h.benefits.title} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {h.benefits.items.map((b, i) => {
            const Icon = benefitIcons[i] ?? Sparkles;
            return (
              <Reveal key={b.title} delay={i * 70}>
                <div className="card h-full p-6">
                  <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-lavender text-accent">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-bold">{b.title}</h3>
                  <p className="mt-2 text-muted">{b.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* WHY KNOWLEDGE EXCHANGE MATTERS */}
      <Section tone="soft">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <SectionHeading align="start" eyebrow={h.why.eyebrow} title={h.why.title} text={h.why.text} />
            <ul className="mt-6 space-y-3">
              {h.why.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <Check className="mt-1.5 size-5 shrink-0 text-success" aria-hidden="true" />
                  <span className="leading-8">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="order-1 lg:order-2" delay={100}>
            <PhotoSlot
              file={photos.language.file}
              alt={photos.language.alt[locale]}
              slotLabel={t.common.photoSlot}
              className="aspect-[4/3] rounded-3xl shadow-[var(--shadow)] ring-1 ring-border"
            />
          </Reveal>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[#3d1d8a] px-6 py-14 text-center text-white sm:px-14 sm:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -end-24 size-72 rounded-full bg-white/10 blur-2xl"
            />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl">{h.cta.title}</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg leading-8 text-white/85">{h.cta.text}</p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 font-bold text-[#3d1d8a] transition hover:-translate-y-0.5 hover:bg-lavender"
              >
                {h.cta.button}
              </Link>
              <Link
                href="/explore"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-7 font-semibold text-white transition hover:bg-white/10"
              >
                {h.cta.secondary}
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
