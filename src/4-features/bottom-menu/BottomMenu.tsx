"use client";

import { useTranslations } from "next-intl";

const HEART_ICON = [
  "0110110",
  "1111111",
  "1111111",
  "0111110",
  "0011100",
  "0001000",
];

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

function PixelIcon({
  rows,
  className,
}: {
  rows: string[];
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
      className={className}
      fill="currentColor"
    >
      {rows.flatMap((row, y) =>
        row
          .split("")
          .map((cell, x) =>
            cell === "1" ? (
              <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
            ) : null,
          ),
      )}
    </svg>
  );
}

type SheetId = "mission" | "howItWorks" | null;

type BottomMenuProps = {
  openSheet: SheetId;
  onOpen: (sheet: Exclude<SheetId, null>) => void;
};

const ITEMS = [
  { id: "mission", key: "mission", icon: HEART_ICON },
  { id: "howItWorks", key: "howItWorks", icon: INFO_ICON },
] as const;

export function BottomMenu({ openSheet, onOpen }: BottomMenuProps) {
  const t = useTranslations("BottomMenu");

  return (
    <nav
      aria-label={t("ariaLabel")}
      className={[
        "fixed inset-x-0 bottom-0 z-40 md:hidden",
        "rounded-t-[24px] bg-[#FFF6EB]/90 backdrop-blur-md",
        "border border-b-0 border-[#0D2734]/10",
        "shadow-[0_-6px_20px_rgba(13,39,52,0.06)]",
        "pb-[env(safe-area-inset-bottom)]",
      ].join(" ")}
    >
      <ul className="mx-auto flex max-w-[720px] items-stretch">
        {ITEMS.map((item) => {
          const isActive = openSheet === item.id;

          return (
            <li key={item.id} className="flex-1">
              <button
                type="button"
                onClick={() => onOpen(item.id)}
                aria-haspopup="dialog"
                aria-expanded={isActive}
                className={[
                  "flex w-full flex-col items-center justify-center gap-1.5 px-3 pb-3 pt-3.5",
                  "text-[11px] uppercase leading-none tracking-[0.04em] transition-colors",
                  "active:translate-y-[1px]",
                  isActive ? "text-[#E52336]" : "text-[#0D2734]/55",
                ].join(" ")}
              >
                <PixelIcon rows={item.icon} className="h-5 w-auto" />
                {t(item.key)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
