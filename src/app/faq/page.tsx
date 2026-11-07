import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { FaqExplorer } from "@/components/forms/faq-explorer";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.faq.metaTitle, description: t.faq.text };
}

export default async function FaqPage() {
  const { t } = await getI18n();
  return (
    <>
      <section className="hero-glow border-b border-border">
        <Container className="py-14 sm:py-20">
          <h1 className="text-4xl font-black sm:text-5xl">{t.faq.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.faq.text}</p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <FaqExplorer />
          <div className="card mt-14 p-8 text-center">
            <h2 className="text-xl font-bold">{t.faq.stillTitle}</h2>
            <p className="mt-2 text-muted">{t.faq.stillText}</p>
            <ButtonLink href="/contact" className="mt-6">
              {t.faq.contactCta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
