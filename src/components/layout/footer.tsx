import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

export async function Footer() {
  const { t } = await getI18n();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t.footer.explore,
      links: [
        { href: "/explore", label: t.nav.explore },
        { href: "/how-it-works", label: t.nav.howItWorks },
        { href: "/faq", label: t.nav.faq },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { href: "/about", label: t.nav.about },
        { href: "/contact", label: t.nav.contact },
      ],
    },
    {
      title: t.footer.account,
      links: [
        { href: "/sign-in", label: t.nav.signIn },
        { href: "/sign-up", label: t.nav.join },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo name={t.meta.siteName} label={t.meta.siteName} />
            <p className="mt-4 max-w-xs leading-7 text-muted">{t.footer.about}</p>
            <p className="mt-3 font-semibold text-accent">{t.meta.tagline}</p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">{col.title}</h2>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-text transition-colors hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t.meta.siteName} (WASLA). {t.footer.rights}
          </p>
          <p>{t.footer.demoNote}</p>
        </div>
      </Container>
    </footer>
  );
}
