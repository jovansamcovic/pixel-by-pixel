"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  type Cause,
  type CauseSlug,
  CauseIcon,
  CauseRing,
  PlayIcon,
  getCauseContent,
  getCauseProgress,
} from "@/src/5-entities/cause";
import { pixelClip } from "@/src/5-entities/select-pixel/styles";

type CauseRingsProps = {
  causes: Cause[];
  totalRaised: number;
  onOpen: (slug: CauseSlug) => void;
};

/**
 * Pozicije (u % širine/visine srca) izabrane tako da prstenovi padnu
 * u prazna (providna) polja mape srca 108×100:
 * - gore u sredini: udubljenje između dva „luka"
 * - dole levo/desno: prazan prostor pored vrha srca
 */
const SLOTS: Record<number, { x: number; y: number }[]> = {
  1: [{ x: 50, y: 5 }],
  2: [
    { x: 10, y: 94 },
    { x: 90, y: 94 },
  ],
  3: [
    { x: 50, y: 5 },
    { x: 10, y: 94 },
    { x: 90, y: 94 },
  ],
  4: [
    { x: 6, y: 6 },
    { x: 94, y: 6 },
    { x: 10, y: 94 },
    { x: 90, y: 94 },
  ],
};

export function CauseRings({ causes, totalRaised, onOpen }: CauseRingsProps) {
  const t = useTranslations("Causes");
  const locale = useLocale();
  const slots = SLOTS[causes.length] ?? SLOTS[4];

  return (
    <div role="group" aria-label={t("ringsLabel")} className="absolute inset-0">
      {causes.slice(0, slots.length).map((cause, index) => {
        const { percent } = getCauseProgress(cause, totalRaised);
        const { shortTitle } = getCauseContent(cause, locale);
        const slot = slots[index];

        return (
          <button
            key={cause.slug}
            type="button"
            onClick={() => onOpen(cause.slug)}
            aria-label={t("watchVideo", { cause: shortTitle, percent })}
            className="group pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 outline-none"
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              width: "clamp(56px, 16%, 92px)",
            }}
          >
            <span className="relative block aspect-square w-full transition group-hover:scale-105 group-active:translate-y-[2px]">
              <CauseRing percent={percent} color={cause.color} className="absolute inset-0 size-full" />

              <span className="absolute inset-[17%] grid place-items-center rounded-full bg-white ring-2 ring-[#0D2734] group-focus-visible:ring-4 group-focus-visible:ring-[#E52336]">
                <CauseIcon name={cause.icon} color={cause.color} className="size-1/2" />
              </span>

              <span
                style={pixelClip}
                className="absolute -bottom-0.5 -right-0.5 grid size-[32%] place-items-center bg-[#0D2734] text-[#FFF6EB]"
              >
                <PlayIcon className="size-1/2" />
              </span>
            </span>

            <span className="bg-[#FFF6EB] px-1 text-[11px] leading-none tabular-nums text-[#0D2734] sm:text-[12px]">
              <span className="hidden sm:inline">{shortTitle} · </span>
              {percent}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
