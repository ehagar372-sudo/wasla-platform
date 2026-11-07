"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NavLinks, type NavLink } from "./nav-links";
import { useI18n } from "@/lib/i18n/provider";

/** Slide-down navigation for small screens. Closes on Escape and when a link is chosen. */
export function MobileMenu({ links, children }: { links: NavLink[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const pathname = usePathname();

  // Close whenever the route changes (covers every navigation, not just link clicks).
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
        onClick={() => setOpen((v) => !v)}
        className="grid size-10 place-items-center rounded-full border border-border bg-surface transition-colors hover:bg-lavender"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-bg px-4 pb-6 pt-3 shadow-lg sm:px-8"
        >
          <nav aria-label={t.nav.primary}>
            <NavLinks
              links={links}
              onNavigate={() => setOpen(false)}
              className="flex flex-col gap-1"
              linkClassName="flex w-full min-h-12 items-center rounded-xl px-4 text-base"
            />
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4" onClick={() => setOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
