"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  q: string;
  a: string;
}

/** Accessible accordion: one panel open at a time, keyboard operable (Enter / Space). */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const uid = useId();

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = `${uid}-btn-${item.id}`;
        const panelId = `${uid}-panel-${item.id}`;
        return (
          <li key={item.id} className={cx("card overflow-hidden", isOpen && "border-primary/50")}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-base font-bold sm:text-lg"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className={cx(
                    "grid size-8 shrink-0 place-items-center rounded-full bg-lavender text-accent transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                >
                  <ChevronDown className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cx(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 leading-8 text-muted">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
