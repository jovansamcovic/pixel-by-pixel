"use client";

import { PixelHeartIcon } from "@/src/6-shared/icons/heaer-icon-pixel";
import { pixelClip } from "@/src/6-shared/ui/pixel-clip";
import { useTranslations } from "next-intl";

type DonationSuccessProps = {
  successPixel: number;
  onShareStory: () => void;
  onReset: () => void;
};

export function DonationSuccess({
  successPixel,
  onShareStory,
  onReset,
}: DonationSuccessProps) {
  const t = useTranslations("DonationForm");

  return (
    <div className="pb-1 pt-4 text-center">
      {/* Veliko pixel srce */}
      <PixelHeartIcon className="mx-auto h-14 w-auto" />

      <p className="mt-5 text-[12px] uppercase tracking-[0.08em] text-[#E52336]">
        {t("success.eyebrow")}
      </p>

      <h3
        id="donation-dialog-title"
        className="mt-2 text-[34px] uppercase leading-[0.95] tracking-[-0.01em] text-[#0D2734]"
      >
        {t("success.title")}
      </h3>

      {/* Broj piksela u pixel okviru */}
      <div
        style={pixelClip("4px")}
        className="mx-auto mt-5 inline-block bg-[#0D2734] p-[3px]"
      >
        <span
          style={pixelClip("4px")}
          className="block bg-[#FFF6EB] px-4 py-2 text-[18px] uppercase leading-none text-[#0D2734]"
        >
          #{successPixel}
        </span>
      </div>

      <p className="mx-auto mt-5 max-w-[320px] text-[13px] leading-[1.5] text-[#0D2734]">
        {t.rich("success.description", {
          pixel: String(successPixel),
          strong: (chunks) => <strong className="text-[#E52336]">{chunks}</strong>,
        })}
      </p>

      {/* Glavno dugme: isti stil kao CTA u CampaignWidget */}
      <button
        type="button"
        onClick={onShareStory}
        style={pixelClip()}
        className={[
          "group mt-7 block w-full bg-[#0D2734] p-[3px]",
          "transition active:translate-y-[2px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336] focus-visible:ring-offset-2",
        ].join(" ")}
      >
        <span
          style={pixelClip()}
          className={[
            "flex min-h-[56px] items-center justify-center",
            "bg-[#E8172B] px-5 text-[18px] uppercase leading-none tracking-[0.03em] text-white",
            "shadow-[inset_0_4px_0_#FF5564,inset_0_-5px_0_#B5111F]",
            "transition group-hover:bg-[#F0202F]",
          ].join(" ")}
        >
          {t("success.shareButton")}
        </span>
      </button>

      {/* Sporedno dugme */}
      <button
        type="button"
        onClick={onReset}
        className={[
          "mt-4 min-h-11 w-full text-[13px] uppercase tracking-[0.04em]",
          "text-[#0D2734]/70 underline decoration-2 underline-offset-4",
          "transition hover:text-[#E52336]",
        ].join(" ")}
      >
        {t("success.resetButton")}
      </button>
    </div>
  );
}