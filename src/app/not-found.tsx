import { SearchX } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <Container className="grid min-h-[60vh] place-items-center py-20">
      <div className="max-w-md text-center">
        <span className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-lavender text-accent">
          <SearchX className="size-8" aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-extrabold">{t.common.notFoundTitle}</h1>
        <p className="mt-3 text-muted">{t.common.notFoundText}</p>
        <ButtonLink href="/" className="mt-7">
          {t.common.backHome}
        </ButtonLink>
      </div>
    </Container>
  );
}
