"use client";

import Image from "next/image";
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

type HowItWorksProps = {
  open: boolean;
  onClose: () => void;
};

export function HowItWorks({ open, onClose }: HowItWorksProps) {
  const t = useTranslations("HowItWorks");

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

      <div className="mx-auto mt-6 w-full max-w-[300px] border-[3px] border-[#0D2734] bg-[#FBF4EA] shadow-[6px_6px_0_#0D2734] sm:max-w-[340px]">
        <Image
          src="/uputstvo.gif"
          alt={t("gifAlt")}
          width={540}
          height={960}
          unoptimized
          className="block h-auto w-full"
        />
      </div>
    </Sheet>
  );
}