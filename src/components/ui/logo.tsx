import Link from "next/link";
import { cx } from "@/lib/utils";

/** WASLA mark: two interlocking rings (a "link" / connection between two people). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cx("size-9", className)}>
      <rect width="40" height="40" rx="12" fill="var(--primary)" />
      <circle cx="15.5" cy="20" r="7" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="24.5" cy="20" r="7" fill="none" stroke="#e6d8ff" strokeWidth="3" opacity="0.95" />
    </svg>
  );
}

export function Logo({ name, label, className }: { name: string; label: string; className?: string }) {
  return (
    <Link href="/" aria-label={label} className={cx("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-xl font-extrabold tracking-tight text-text">{name}</span>
    </Link>
  );
}
