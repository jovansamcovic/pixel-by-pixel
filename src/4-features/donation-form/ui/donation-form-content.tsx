"use client";

import type { CSSProperties, FormEvent } from "react";

import { useTranslations } from "next-intl";

type DonationFormContentProps = {
  selectedPixel: number;
  selectedColor: string;
  formattedPrice: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

/* Pixel dugme sa "odsečenim" uglovima */
const NOTCH = "6px";
const pixelClip: CSSProperties = {
  clipPath: `polygon(
    0 ${NOTCH}, ${NOTCH} ${NOTCH}, ${NOTCH} 0,
    calc(100% - ${NOTCH}) 0, calc(100% - ${NOTCH}) ${NOTCH}, 100% ${NOTCH},
    100% calc(100% - ${NOTCH}), calc(100% - ${NOTCH}) calc(100% - ${NOTCH}),
    calc(100% - ${NOTCH}) 100%, ${NOTCH} 100%, ${NOTCH} calc(100% - ${NOTCH}),
    0 calc(100% - ${NOTCH})
  )`,
};

export function DonationFormContent({
  selectedPixel,
  selectedColor,
  formattedPrice,
  onSubmit,
}: DonationFormContentProps) {
  const t = useTranslations("DonationForm");

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center px-1 pb-1 pt-5">
      {/* Izabrani piksel: boja + broj */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center border-2 border-[#0D2734] bg-[#FFF6EB]"
        >
          <span
            className="size-7"
            style={{ backgroundColor: selectedColor }}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[10px] uppercase leading-none tracking-[0.08em] text-[#E52336]">
            {t("form.eyebrow")}
          </p>

          <h3
            id="donation-dialog-title"
            className="mt-1.5 text-[20px] uppercase leading-none text-[#0D2734]"
          >
            {t("form.selectedPixel", { pixel: selectedPixel })}
          </h3>
        </div>
      </div>

      {/* Cena */}
      <p className="mt-5 bg-[#0D2734]/[0.06] px-5 py-2 text-[18px] leading-none text-[#0D2734]">
        {formattedPrice}
      </p>

      {/* Objašnjenje */}
      <p className="mt-5 max-w-[320px] text-center text-[13px] leading-[1.5] text-[#0D2734]/80">
        {t("form.redirectNotice")}
      </p>

      {/* CTA */}
      <button
        type="submit"
        style={pixelClip}
        className={[
          "group mt-6 block w-full bg-[#0D2734] p-[3px]",
          "transition active:translate-y-[2px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336] focus-visible:ring-offset-2",
        ].join(" ")}
      >
        <span
          style={pixelClip}
          className={[
            "flex min-h-[56px] items-center justify-center gap-3",
            "bg-[#E8172B] px-5 text-[17px] uppercase leading-none text-white",
            "shadow-[inset_0_4px_0_#FF5564,inset_0_-5px_0_#B5111F]",
            "transition group-hover:bg-[#F0202F]",
          ].join(" ")}
        >
          {t("form.submit")}
          <span aria-hidden="true">→</span>
        </span>
      </button>
    </form>
  );
}