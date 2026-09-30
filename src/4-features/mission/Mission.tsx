"use client";

import { useTranslations } from "next-intl";

import { Sheet } from "@/src/6-shared/ui/bottom-sheet/BottomSheet";

const HEART_ICON = [
  "0110110",
  "1111111",
  "1111111",
  "0111110",
  "0011100",
  "0001000",
];

function PixelHeartIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 7 6"
      shapeRendering="crispEdges"
      className={className}
    >
      {HEART_ICON.flatMap((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#E52336" />
          ) : null,
        ),
      )}
      <rect x="1" y="1" width="1" height="1" fill="#FF8A94" />
    </svg>
  );
}

type MissionProps = {
  open: boolean;
  onClose: () => void;
};

export function Mission({ open, onClose }: MissionProps) {
  const t = useTranslations("Mission");

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
      icon={<PixelHeartIcon className="h-6 w-auto" />}
    >
      <div className="grid grid-cols-[1.05fr_1fr] gap-4">
        {/* Tekst */}
        <div>
          <p className="whitespace-pre-line text-[22px] uppercase leading-[1.1] text-[#E52336] sm:text-[26px]">
            {t("headline")}
          </p>

          <div className="mt-5 space-y-3 text-[11px] leading-[1.45] text-[#0D2734] sm:text-[12px]">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
            <p>{t("p4")}</p>
          </div>
        </div>

        {/* Ilustracija */}
        <img
          src="/mission-illustration.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full select-none self-start"
        />
      </div>

      {/* Poziv na akciju */}
      <button
        type="button"
        onClick={handleCta}
        className="mt-6 block w-full text-left text-[15px] uppercase leading-[1.25] text-[#E52336] transition hover:text-[#B5111F] sm:text-[17px]"
      >
        {t("cta")}
      </button>
    </Sheet>
  );
}