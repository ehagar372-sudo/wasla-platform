import type { Metadata } from "next";
import { Eye, HeartHandshake, Lock, Rocket, Scale, Users } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";
import { photos } from "@/lib/photos";
import { Container, Section, SectionHeading } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { Reveal } from "@/components/ui/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.about.metaTitle, description: t.about.text };
}

export default async function AboutPage() {
  const { locale, t } = await getI18n();
  const a = t.about;
  const valueIcons = [Users, HeartHandshake, Scale, Lock];

  return (
    <>
      <section className="hero-glow border-b border-border">
        <Container className="py-14 sm:py-20">
          <h1 className="text-4xl font-black sm:text-5xl">{a.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{a.text}</p>
        </Container>
      </section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-extrabold">{a.storyTitle}</h2>
            <div className="mt-5 space-y-4 text-lg leading-8 text-muted">
              {a.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <PhotoSlot
              file={photos.about.file}
              alt={photos.about.alt[locale]}
              className="aspect-[4/3] rounded-3xl shadow-[var(--shadow)] ring-1 ring-border"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Eye, title: a.visionTitle, text: a.vision },
            { icon: Rocket, title: a.missionTitle, text: a.mission },
          ].map((item) => (
            <Reveal key={item.title}>
              <div className="card h-full p-8">
                <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-primary text-primary-fg">
                  <item.icon className="size-7" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-bold">{item.title}</h2>
                <p className="mt-3 text-lg leading-8 text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title={a.valuesTitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {a.values.map((v, i) => {
            const Icon = valueIcons[i] ?? Users;
            return (
              <Reveal key={v.title} delay={i * 70}>
                <div className="card h-full p-6">
                  <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-lavender text-accent">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-bold">{v.title}</h3>
                  <p className="mt-2 text-muted">{v.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-bold">{a.whyTitle}</h2>
            <p className="mt-3 text-lg leading-8 text-muted">{a.why}</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-2xl font-bold">{a.communityTitle}</h2>
            <p className="mt-3 text-lg leading-8 text-muted">{a.community}</p>
          </Reveal>
        </div>
        <div className="mt-12 text-center">
          <ButtonLink href="/sign-up" size="lg">
            {a.cta}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
