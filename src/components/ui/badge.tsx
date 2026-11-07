import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

export function Badge({
  children,
  tone = "soft",
  className,
}: {
  children: ReactNode;
  tone?: "soft" | "demo" | "outline";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        tone === "soft" && "bg-lavender text-accent",
        tone === "demo" && "border border-warning/50 bg-warning/15 text-text",
        tone === "outline" && "border border-border text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <p role="note" className="rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm leading-7 text-text">
      {children}
    </p>
  );
}
