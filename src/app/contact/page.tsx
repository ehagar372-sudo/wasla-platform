import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.contact.metaTitle, description: t.contact.text };
}

export default async function ContactPage() {
  const { t } = await getI18n();
  return (
    <>
      <section className="hero-glow border-b border-border">
        <Container className="py-14 sm:py-20">
          <h1 className="text-4xl font-black sm:text-5xl">{t.contact.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.contact.text}</p>
        </Container>
      </section>

      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_20rem]">
        <ContactForm />
        <aside className="order-first lg:order-last">
          <div className="card p-6">
            <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-lavender text-accent">
              <MessageCircle className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-bold">{t.contact.sideTitle}</h2>
            <p className="mt-2 leading-7 text-muted">{t.contact.sideText}</p>
          </div>
        </aside>
      </Container>
    </>
  );
}
