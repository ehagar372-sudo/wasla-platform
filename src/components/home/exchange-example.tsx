"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cx } from "@/lib/utils";

type View = "a" | "b" | "both";

/** Illustrative example (not real members): two people whose skills complement each other. */
export function ExchangeExample() {
  const { t } = useI18n();
  const ex = t.how.example;
  const [view, setView] = useState<View>("both");

  const options: Array<{ id: View; label: string }> = [
    { id: "a", label: ex.showA },
    { id: "b", label: ex.showB },
    { id: "both", label: ex.showBoth },
  ];
  const result = view === "a" ? ex.resultA : view === "b" ? ex.resultB : ex.resultBoth;

  const people = [
    { id: "a" as const, ...ex.personA },
    { id: "b" as const, ...ex.personB },
  ];

  return (
    <div>
      <div role="group" aria-label={ex.toggleLabel} className="mx-auto flex w-fit flex-wrap justify-center gap-2 rounded-full border border-border bg-surface p-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={view === o.id}
            onClick={() => setView(o.id)}
            className={cx(
              "min-h-10 rounded-full px-5 text-sm font-semibold transition-colors",
              view === o.id ? "bg-primary text-primary-fg" : "text-muted hover:bg-lavender hover:text-text",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        {people.map((person, index) => {
          const active = view === "both" || view === person.id;
          const card = (
            <div
              key={person.id}
              className={cx(
                "card p-6 transition-all duration-300",
                active ? "border-primary/60 shadow-[var(--shadow-lg)]" : "opacity-60",
              )}
            >
              <div className="flex items-center gap-4">
                <Avatar name={person.name} size="lg" />
                <div>
                  <p className="text-xl font-bold">{person.name}</p>
                  <Badge tone="demo">{ex.badge}</Badge>
                </div>
              </div>
              <dl className="mt-6 space-y-4">
                <div className="rounded-2xl bg-lavender p-4">
                  <dt className="text-sm font-semibold text-muted">{ex.offers}</dt>
                  <dd className="mt-1 text-lg font-bold text-accent">{person.offer}</dd>
                </div>
                <div className="rounded-2xl border border-dashed border-border p-4">
                  <dt className="text-sm font-semibold text-muted">{ex.wants}</dt>
                  <dd className="mt-1 text-lg font-bold">{person.want}</dd>
                </div>
              </dl>
            </div>
          );
          if (index === 0) {
            return [
              card,
              <div
                key="arrows"
                role="img"
                aria-label={ex.arrowLabel}
                className="mx-auto flex items-center justify-center md:flex-col"
              >
                <span
                  className={cx(
                    "grid size-14 place-items-center rounded-full bg-primary text-primary-fg shadow-[var(--shadow-lg)] transition-transform duration-500",
                    view === "both" && "scale-110",
                  )}
                >
                  <ArrowLeftRight className="size-6 max-md:rotate-90" aria-hidden="true" />
                </span>
              </div>,
            ];
          }
          return card;
        })}
      </div>

      <p role="status" aria-live="polite" className="mx-auto mt-8 max-w-2xl rounded-2xl bg-lavender p-5 text-center text-lg leading-8">
        {result}
      </p>
    </div>
  );
}
