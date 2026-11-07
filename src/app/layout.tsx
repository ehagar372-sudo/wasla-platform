import type { Metadata, Viewport } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import { getI18n } from "@/lib/i18n/server";
import { localeMeta } from "@/lib/i18n/dictionaries";
import { I18nProvider } from "@/lib/i18n/provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${t.meta.siteName} | WASLA — ${t.meta.tagline}`, template: `%s | ${t.meta.siteName}` },
    description: t.meta.description,
    openGraph: { title: t.meta.siteName, description: t.meta.description, type: "website", siteName: "WASLA" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8ff" },
    { media: "(prefers-color-scheme: dark)", color: "#130e1f" },
  ],
};

/**
 * Runs before first paint: applies the saved theme (or the system preference on a first visit)
 * and flags that JavaScript is available so scroll-reveal animations can be enabled.
 */
const themeScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('wasla-theme');var dark=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)d.classList.add('dark');}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getI18n();
  const { dir, lang } = localeMeta[locale];

  return (
    // className is constant on purpose: the inline script adds "dark"/"js" and React must not overwrite them.
    <html lang={lang} dir={dir} className={`${cairo.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <I18nProvider locale={locale} t={t}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:font-semibold focus:text-primary-fg"
          >
            {t.nav.skip}
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
