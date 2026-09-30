"use client";

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
    <div className="px-1 pb-2 pt-7 text-center">
      <span
        aria-hidden="true"
        className={[
          "mx-auto flex h-14 w-14",
          "items-center justify-center",
          "rounded-2xl bg-[#FCE4E1]",
          "text-2xl text-[#D6384B]",
        ].join(" ")}
      >
        ♥
      </span>

      <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#D6384B]">
        {t("success.eyebrow")}
      </p>

      <h3
        id="donation-dialog-title"
        className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#0D2734]"
      >
        {t("success.title")}
      </h3>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6D7475]">
        {t.rich("success.description", {
          pixel: successPixel,
          strong: (children) => (
            <strong className="text-[#0D2734]">
              {children}
            </strong>
          ),
        })}
      </p>

      <button
        type="button"
        onClick={onShareStory}
        className={[
          "mt-7 inline-flex min-h-14 w-full",
          "items-center justify-center gap-3",
          "rounded-2xl bg-[#0D2734] px-6",
          "text-sm font-extrabold text-white",
          "transition",
          "hover:-translate-y-0.5",
          "hover:bg-[#173947]",
        ].join(" ")}
      >
        {t("success.shareButton")}
      </button>

      <button
        type="button"
        onClick={onReset}
        className={[
          "mt-3 min-h-11 w-full",
          "text-sm font-bold text-[#6D7475]",
          "hover:text-[#0D2734]",
        ].join(" ")}
      >
        {t("success.resetButton")}
      </button>
    </div>
  );
}