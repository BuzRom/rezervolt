import type { Metadata } from "next";
import { Inter, Unbounded } from "next/font/google";
import localFont from "next/font/local";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { site, siteUrl } from "@/lib/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const hryvniaSans = localFont({
  src: "../../assets/fonts/Inter-Hryvnia.woff2",
  variable: "--font-hryvnia-sans",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+20B4" }],
});

const hryvniaDisplay = localFont({
  src: "../../assets/fonts/Unbounded-Hryvnia.woff2",
  variable: "--font-hryvnia-display",
  weight: "200 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+20B4" }],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: `%s — ${site.name}` },
    description: t("description"),
    applicationName: site.name,
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: site.name,
      url: `/${locale}`,
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
    alternates: {
      canonical: `/${locale}`,
      languages: { uk: "/uk", en: "/en", "x-default": "/" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    redirect(`/${routing.defaultLocale}/${encodeURIComponent(locale)}`);
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${unbounded.variable} ${hryvniaSans.variable} ${hryvniaDisplay.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <noscript
          dangerouslySetInnerHTML={{
            __html: '<style>[data-anim="hidden"]{opacity:1!important;transform:none!important}</style>',
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
