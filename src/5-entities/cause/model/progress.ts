import type { Cause, CauseContent, CauseLocale, CauseProgress } from "./types";

/**
 * Svaka donacija se deli po istom ključu, pa je prikupljeno za namenu
 * = ukupno prikupljeno × udeo namene. Napredak se razlikuje jer su ciljevi različiti.
 */
export function getCauseProgress(cause: Cause, totalRaised: number): CauseProgress {
  const raised = Math.round((totalRaised * cause.share) / 100);
  const percent =
    cause.goal > 0 ? Math.min(100, Math.round((raised / cause.goal) * 100)) : 0;

  return { raised, goal: cause.goal, percent };
}

/** Koliko jedan piksel donosi ovoj nameni */
export const getAmountPerPixel = (cause: Cause, pixelPrice: number) =>
  Math.round((pixelPrice * cause.share) / 100);

export const getCauseContent = (cause: Cause, locale: string): CauseContent =>
  cause.content[(locale in cause.content ? locale : "sr") as CauseLocale];

export const formatRsd = (value: number, locale: string) =>
  `${new Intl.NumberFormat(locale === "en" ? "en-US" : "sr-RS").format(value)} RSD`;
