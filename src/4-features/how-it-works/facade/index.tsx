
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Sheet } from "@/src/6-shared/ui/bottom-sheet";

const INFO_ICON = [
  "00100",
  "00000",
  "01100",
  "00100",
  "01110",
];

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 5 5"
      shapeRendering="crispEdges"
      className={className}
      fill="currentColor"
    >
      {INFO_ICON.flatMap((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
            />
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

export function HowItWorks({
  open,
  onClose,
}: HowItWorksProps) {
  const t = useTranslations("HowItWorks");

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={t("title")}
      closeLabel={t("close")}
      icon={
        <span className="flex size-6 shrink-0 items-center justify-center text-[#0D2734]">
          <InfoIcon className="size-5" />
        </span>
      }
    >
      <p className="whitespace-pre-line text-[22px] uppercase leading-[1.1] text-[#E52336] sm:text-[26px]">
        {t("headline")}
      </p>

      <div className="mx-auto mt-6 w-full max-w-[300px] border-[3px] border-[#0D2734] bg-[#FBF4EA] shadow-[6px_6px_0_#0D2734] sm:max-w-[340px]">
        <Image
          src="/uputstvo.gif"
          alt="Uputstvo za izbor i kupovinu piksela"
          width={540}
          height={960}
          unoptimized
          className="block h-auto w-full"
        />
      </div>
    </Sheet>
  );
}
