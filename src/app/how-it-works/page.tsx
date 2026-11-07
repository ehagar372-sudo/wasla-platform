import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck, GraduationCap, HeartHandshake, Search, Send, UserPlus, Users, Wallet, Sparkles } from "lucide-react";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";
import { Container, Section, SectionHeading } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { ExchangeExample } from "@/components/home/exchange-example";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.how.metaTitle, description: t.how.hero.text };
}

export default async function HowItWorksPage() {
  const { locale, t } = await getI18n();
  const h = t.how;

  const stepIcons = [UserPlus, GraduationCap, BookOpenCheck, Search, Send, HeartHandshake];
  const whyIcons = [Wallet, Users, Sparkles, HeartHandshake];

  // The six questions requested for this page, taken from the FAQ dictionary (single source of truth).
  // Positions in the flattened FAQ list (same order in both languages): what is WASLA, free, several skills,
  // finding a partner, how sessions work, reviewing.
  const allFaq = t.faq.groups.flatMap((g) => g.items);
  const faqItems = [0, 2, 4, 5, 7, 8].flatMap((index) => {
    const item = allFaq[index];
    return item ? [{ id: `how-${index}`, q: item.q, a: item.a }] : [];
  });

  return (
    <>
      {/* HERO */}
      <section className="hero-glow relative overflow-hidden border-b border-border">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex rounded-full bg-lavender px-4 py-1.5 text-sm font-semibold text-accent">
              {h.hero.eyebrow}
            </p>
            <h1 className="text-4xl font-black sm:text-5xl">{h.hero.title}</h1>
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
          <div className="animate-fade-up [animation-delay:150ms]">
            <PhotoSlot
              file={photos.howHero.file}
              alt={photos.howHero.alt[locale]}
              slotLabel={t.common.photoSlot}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[4/3] rounded-[2rem] shadow-[var(--shadow-lg)] ring-1 ring-border"
            />
          </div>
        </Container>
      </section>

      {/* STEPS TIMELINE */}
      <Section>
        <SectionHeading eyebrow={h.steps.eyebrow} title={h.steps.title} text={h.steps.text} />
        <ol className="relative mx-auto mt-16 max-w-3xl space-y-8">
          {/* connecting line */}
          <span
            aria-hidden="true"
            className="absolute start-7 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-ring to-transparent sm:start-8"
          />
          {h.steps.items.map((step, i) => {
            const Icon = stepIcons[i] ?? UserPlus;
            return (
              <li key={step.title} className="relative ps-20 sm:ps-24">
                <Reveal delay={i * 60}>
                  <span className="absolute start-0 top-0 grid size-14 place-items-center rounded-2xl bg-primary text-primary-fg shadow-[0_10px_24px_-10px_var(--primary)] sm:size-16">
                    <Icon className="size-6 sm:size-7" aria-hidden="true" />
                  </span>
                  <div className="card card-hover p-6">
                    <p className="text-sm font-bold text-accent">
                      {h.steps.stepWord} {i + 1}
                    </p>
                    <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 leading-8 text-muted">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* EXAMPLE */}
      <Section tone="soft">
        <SectionHeading eyebrow={h.example.eyebrow} title={h.example.title} text={h.example.text} />
        <div className="mt-12">
          <ExchangeExample />
        </div>
      </Section>

      {/* WHY WASLA */}
      <Section>
        <SectionHeading eyebrow={h.why.eyebrow} title={h.why.title} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {h.why.items.map((item, i) => {
            const Icon = whyIcons[i] ?? Sparkles;
            return (
              <Reveal key={item.title} delay={i * 70}>
                <div className="card card-hover h-full p-6">
                  <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-lavender text-accent">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-bold leading-snug">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="soft">
        <SectionHeading eyebrow={h.faq.eyebrow} title={h.faq.title} />
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion items={faqItems} />
          <div className="mt-8 text-center">
            <Link href="/faq" className="inline-flex items-center gap-2 font-semibold text-accent hover:underline">
              {h.faq.all}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
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
            <Link
              href="/sign-up"
              className="relative mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 font-bold text-[#3d1d8a] transition hover:-translate-y-0.5 hover:bg-lavender"
            >
              {h.cta.button}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
