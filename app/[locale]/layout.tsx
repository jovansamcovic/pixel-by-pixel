import type { Metadata } from "next";
import { Geist, VT323 } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";


import "../globals.css";
import { routing } from "@/src/i18n/routing";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

const SITE_NAME = "Izaberi pixel";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixel-by-pixel-seven.vercel.app";

/**
 * Slika koja se prikazuje kad se link podeli (WhatsApp, Viber, Facebook, Instagram DM...).
 * Fajl ide u public/ pod ovim imenom. Preporuka: JPG ili PNG, 1200 × 630 px, do ~300 KB.
 */
const SHARE_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
};

const OPEN_GRAPH_LOCALES: Record<string, string> = {
  sr: "sr_RS",
  en: "en_US",
};

type LocaleParams = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    // Bez ovoga Next ne može da napravi apsolutne URL-ove za og:image.
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | ${SITE_NAME}`,
    },
    description: t("description"),
    applicationName: SITE_NAME,
    keywords: t.raw("keywords") as string[],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((code) => [code, `/${code}`]),
      ),
    },
    icons: {
      icon: { url: "/favicon.png", type: "image/png" },
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
    openGraph: {
      title: t("shareTitle"),
      description: t("openGraph.description"),
      siteName: t("shareTitle"),
      locale: OPEN_GRAPH_LOCALES[locale] ?? OPEN_GRAPH_LOCALES.sr,
      alternateLocale: routing.locales
        .filter((code) => code !== locale)
        .map((code) => OPEN_GRAPH_LOCALES[code]),
      url: `/${locale}`,
      type: "website",
      images: [{ ...SHARE_IMAGE, alt: t("openGraph.imageAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("shareTitle"),
      description: t("twitter.description"),
      images: [SHARE_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

type LocaleLayoutProps = Readonly<
  LocaleParams & {
    children: React.ReactNode;
  }
>;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={[geist.variable, vt323.variable, "h-full"].join(" ")}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}