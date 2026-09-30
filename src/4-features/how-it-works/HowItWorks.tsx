"use client";

import { Sheet } from "@/src/6-shared/ui/bottom-sheet/BottomSheet";
import { useTranslations } from "next-intl";



const INFO_ICON = [
  "001111100",
  "011000110",
  "110010011",
  "110000011",
  "110010011",
  "110010011",
  "110010011",
  "011000110",
  "001111100",
];

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 9 9"
      shapeRendering="crispEdges"
      className={className}
      fill="#E52336"
    >
      {INFO_ICON.flatMap((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
          ) : null,
        ),
      )}
    </svg>
  );
}

const STEPS = ["step1", "step2", "step3"] as const;

type HowItWorksProps = {
  open: boolean;
  onClose: () => void;
};

export function HowItWorks({ open, onClose }: HowItWorksProps) {
  const t = useTranslations("HowItWorks");

  const handleCta = () => {
    onClose();
    document.getElementById("srce")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={t("title")}
      closeLabel={t("close")}
      icon={<InfoIcon className="h-6 w-auto" />}
    >
      <p className="whitespace-pre-line text-[22px] uppercase leading-[1.1] text-[#E52336] sm:text-[26px]">
        {t("headline")}
      </p>

      <ol className="mt-6 space-y-5">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-4">
            <span
              className={[
                "grid size-9 shrink-0 place-items-center",
                "bg-[#E52336] text-[16px] leading-none text-white",
                "shadow-[inset_0_-3px_0_#B5111F]",
              ].join(" ")}
            >
              {index + 1}
            </span>

            <div>
              <h3 className="text-[14px] uppercase leading-none text-[#0D2734] sm:text-[15px]">
                {t(`${step}.title`)}
              </h3>
              <p className="mt-2 text-[11px] leading-[1.45] text-[#0D2734] sm:text-[12px]">
                {t(`${step}.text`)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-[10px] leading-[1.5] text-[#0D2734]/60">
        {t("note")}
      </p>

      <button
        type="button"
        onClick={handleCta}
        className="mt-5 block w-full text-left text-[15px] uppercase leading-[1.25] text-[#E52336] transition hover:text-[#B5111F] sm:text-[17px]"
      >
        {t("cta")}
      </button>
    </Sheet>
  );
}