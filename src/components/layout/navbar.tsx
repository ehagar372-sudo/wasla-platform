import { LogOut, UserRound } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { getI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Logo } from "@/components/ui/logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { NavLinks, type NavLink } from "./nav-links";
import { MobileMenu } from "./mobile-menu";

async function getCurrentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function Navbar() {
  const { t } = await getI18n();
  const userId = await getCurrentUserId();

  const links: NavLink[] = [
    { href: "/", label: t.nav.home },
    { href: "/explore", label: t.nav.explore },
    { href: "/how-it-works", label: t.nav.howItWorks },
    { href: "/about", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
  ];

  const authActions = userId ? (
    <>
      <ButtonLink href={`/profile/${userId}`} variant="secondary" size="sm">
        <UserRound className="size-4" aria-hidden="true" />
        {t.nav.myProfile}
      </ButtonLink>
      <form action={signOut}>
        <Button type="submit" variant="ghost" size="sm" className="w-full">
          <LogOut className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          {t.nav.signOut}
        </Button>
      </form>
    </>
  ) : (
    <>
      <ButtonLink href="/sign-in" variant="ghost" size="sm">
        {t.nav.signIn}
      </ButtonLink>
      <ButtonLink href="/sign-up" variant="primary" size="sm">
        {t.nav.join}
      </ButtonLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/90 backdrop-blur-md">
      {/* 3 columns: brand | centred navigation | actions. In RTL the brand sits on the right, actions on the left. */}
      <div className="relative mx-auto grid h-16 w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:h-[4.25rem] sm:px-8 xl:gap-6">
        <Logo name={t.meta.siteName} label={`${t.meta.siteName} — ${t.nav.home}`} />

        <nav aria-label={t.nav.primary} className="col-start-2 hidden justify-center xl:flex">
          <NavLinks links={links} className="flex items-center gap-1" />
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="ms-1 hidden items-center gap-2 xl:flex">{authActions}</div>
          <MobileMenu links={links}>{authActions}</MobileMenu>
        </div>
      </div>
    </header>
  );
}
