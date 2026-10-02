import { useTranslations } from "next-intl";

import { getPixelTargetColor } from "@/src/5-entities/heart-pixel";
import { DiceIcon } from "@/src/6-shared/icons/dice-icon-pixel";
import { pixelClip } from "../styles";

type PickerFooterProps = {
  selectedPixel: number | null;
  formattedPrice: string;
  onRandomSelect: () => void;
  onCheckout: () => void;
};

const pixelButtonFrame =
  "group bg-[#0D2734] p-[3px] transition active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]";

/** Donja traka: izabrani piksel + nasumičan izbor + kupovina, na dohvat palca */
export function PickerFooter({
  selectedPixel,
  formattedPrice,
  onRandomSelect,
  onCheckout,
}: PickerFooterProps) {
  const t = useTranslations("PixelSelector");

  return (
    <footer className="shrink-0 border-t border-[#0D2734]/15 px-4 pb-4 pt-3">
      <div
        aria-live="polite"
        className="mb-2.5 flex h-7 items-center justify-center gap-2.5 text-[#0D2734]"
      >
        {selectedPixel !== null ? (
          <>
            <span
              aria-hidden="true"
              className="size-7 border-2 border-[#0D2734] shadow-[inset_0_0_0_2px_#FFF6EB]"
              style={{ backgroundColor: getPixelTargetColor(selectedPixel) }}
            />
            <span className="text-[18px] leading-none tabular-nums tracking-[0.02em]">
              #{selectedPixel}
            </span>
            <span className="sr-only">
              {t("picker.selected", { id: selectedPixel })}
            </span>
          </>
        ) : (
          <span className="text-[12px] uppercase tracking-[0.04em] text-[#0D2734]/70">
            {t("picker.empty")}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRandomSelect}
          aria-label={t("randomAriaLabel")}
          style={pixelClip}
          className={`${pixelButtonFrame} w-[68px] shrink-0`}
        >
          <span
            style={pixelClip}
            className="flex h-full min-h-[50px] items-center justify-center bg-[#FFF6EB] shadow-[inset_0_4px_0_#FFFFFF,inset_0_-5px_0_#E6D5BF] transition group-hover:bg-[#FFFBF5]"
          >
            <DiceIcon />
          </span>
        </button>

        <button
          type="button"
          onClick={onCheckout}
          disabled={selectedPixel === null}
          style={pixelClip}
          className={`${pixelButtonFrame} flex-1 disabled:pointer-events-none disabled:opacity-40`}
        >
          <span
            style={pixelClip}
            className="flex min-h-[50px] flex-col items-center justify-center bg-[#E8172B] px-4 uppercase text-white shadow-[inset_0_4px_0_#FF5564,inset_0_-5px_0_#B5111F] transition group-hover:bg-[#F0202F]"
          >
            <span className="text-[18px] leading-none tracking-[0.03em]">
              {t("picker.buy")}
            </span>
            <span className="mt-1 text-[11px] leading-none">
              — {formattedPrice} —
            </span>
          </span>
        </button>
      </div>
    </footer>
  );
}
