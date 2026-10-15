export type {
  Cause,
  CauseContent,
  CauseIconName,
  CauseLocale,
  CauseProgress,
  CauseSlug,
  CauseStep,
  CauseStepStatus,
} from "./model/types";
export { CAUSES, getCauseBySlug, isCauseSlug } from "./model/causes";
export {
  formatRsd,
  getAmountPerPixel,
  getCauseContent,
  getCauseProgress,
} from "./model/progress";
export { CauseIcon, PlayIcon } from "./ui/cause-icon";
export { CauseRing } from "./ui/cause-ring";

/** Putanja strane namene, sa locale prefiksom (/sr/namene/inkubator) */
export const getCauseHref = (locale: string, slug: string) => `/${locale}/namene/${slug}`;
