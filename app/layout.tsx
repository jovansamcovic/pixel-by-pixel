import type { Metadata } from "next";
import { Geist, VT323 } from "next/font/google";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Izaberi pixel",
    template: "%s | Izaberi pixel",
  },
  description:
    "Humanitarna platforma za prikupljanje sredstava kupovinom piksela. Izaberi svoj piksel i postani deo zajedničke slike dobrote.",
  applicationName: "Izaberi pixel",
  keywords: [
    "humanitarna akcija",
    "humanitarne donacije",
    "donacije",
    "kupovina piksela",
    "piksel dobrote",
    "izaberi pixel",
    "pixel po pixel",
    "Kragujevac",
  ],
  authors: [
    {
      name: "Izaberi pixel",
    },
  ],
  creator: "Izaberi pixel",
  publisher: "Izaberi pixel",
  icons: {
    icon: {
      url: "/favicon.png",
      type: "image/png",
    },
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Izaberi pixel",
    description:
      "Jedan piksel. Jedan korak bliže cilju. Izaberi svoj piksel i ostavi trag u zajedničkom srcu.",
    siteName: "Izaberi pixel",
    locale: "sr_RS",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Izaberi pixel — humanitarna akcija",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Izaberi pixel",
    description:
      "Izaberi svoj piksel i postani deo zajedničke slike dobrote.",
    images: ["/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="sr"
      className={[
        geist.variable,
        vt323.variable,
        "h-full",
      ].join(" ")}
    >
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}