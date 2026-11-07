"use client";

import { TriangleAlert } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  return (
    <Container className="grid min-h-[60vh] place-items-center py-20">
      <div role="alert" className="max-w-md text-center">
        <span className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-danger/15 text-danger">
          <TriangleAlert className="size-8" aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-extrabold">{t.common.errorTitle}</h1>
        <p className="mt-3 text-muted">{t.common.errorText}</p>
        <Button onClick={reset} className="mt-7">
          {t.common.retry}
        </Button>
      </div>
    </Container>
  );
}
