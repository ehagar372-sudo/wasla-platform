import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  id,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "soft";
}) {
  return (
    <section id={id} className={cx("py-16 sm:py-24", tone === "soft" && "bg-surface-2/60", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div className={cx("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-start", className)}>
      {eyebrow && (
        <p className="mb-3 inline-flex rounded-full bg-lavender px-3.5 py-1 text-sm font-semibold text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg leading-8 text-muted">{text}</p>}
    </div>
  );
}
