import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { CauseDetailPage } from "@/src/2-pages/cause-detail";
import { CAUSES, getCauseBySlug, getCauseContent } from "@/src/5-entities/cause";
import { toSoldPixels } from "@/src/5-entities/heart-pixel/types";
import { MOCK_HEART_STATE } from "@/src/5-entities/heart-pixel/mock/heart-state";
// TODO: isti izvor stanja srca koji koristi početna strana.
// Predlog: premesti MOCK_HEART_STATE iz početne stranice u ovaj fajl,
// a kasnije ga zameni pozivom ka backendu.


type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return CAUSES.map((cause) => ({ slug: cause.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const cause = getCauseBySlug(slug);
  if (!cause) return {};

  const content = getCauseContent(cause, locale);

  return {
    title: `${content.title} · Srce Kragujevca`,
    description: content.lead,
    openGraph: {
      title: content.headline,
      description: content.lead,
      images: [{ url: cause.cover }],
    },
  };
}

export default async function CauseRoute({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cause = getCauseBySlug(slug);
  if (!cause) notFound();

  const heart = MOCK_HEART_STATE;
  const totalRaised = toSoldPixels(heart).size * heart.price;

  return (
    <CauseDetailPage
      cause={cause}
      locale={locale}
      totalRaised={totalRaised}
      pixelPrice={heart.price}
    />
  );
}
