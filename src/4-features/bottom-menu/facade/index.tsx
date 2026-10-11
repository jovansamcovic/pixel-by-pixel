
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
  "00100",
  "00000",
  "01100",
  "00100",
  "01110",
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

type SheetId = "mission" | "howItWorks" | null;

type BottomMenuProps = {
  openSheet: SheetId;
  onOpen: (sheet: Exclude<SheetId, null>) => void;
};

const ITEMS = [
  { id: "mission", key: "mission", icon: HEART_ICON },
  { id: "howItWorks", key: "howItWorks", icon: INFO_ICON },
] as const;



export function BottomMenu({
  openSheet,
  onOpen,
}: BottomMenuProps) {
  const t = useTranslations("BottomMenu");

  return (
    <nav
      aria-label={t("ariaLabel")}
      className={[
        "fixed inset-x-0 bottom-0 z-40 md:hidden",
        "bg-[#FFF6EB]",
        "px-4 pt-3",
        "pb-[calc(12px+env(safe-area-inset-bottom))]",
        "shadow-[0_-6px_20px_rgba(13,39,52,0.035)]",
      ].join(" ")}
    >
      <ul className="mx-auto flex max-w-[420px] gap-2">
        {ITEMS.map((item) => {
          const isActive = openSheet === item.id;

          return (
            <li key={item.id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onOpen(item.id)}
                aria-haspopup="dialog"
                aria-expanded={isActive}
                className={[
                  "flex h-11 w-full items-center justify-center gap-2",
                  "px-2 text-[10px] uppercase tracking-[0.04em]",
                  "transition-colors duration-150",
                  "focus-visible:outline-2",
                  "focus-visible:outline-offset-2",
                  "focus-visible:outline-[#E52336]",
                  isActive
                    ? "bg-[#F6DDDA] text-[#B84B55]"
                    : "bg-[#F3E8DC] text-[#66777B]",
                ].join(" ")}
                style={{
                  clipPath: `polygon(
                    0 4px,
                    4px 4px,
                    4px 0,
                    calc(100% - 4px) 0,
                    calc(100% - 4px) 4px,
                    100% 4px,
                    100% calc(100% - 4px),
                    calc(100% - 4px) calc(100% - 4px),
                    calc(100% - 4px) 100%,
                    4px 100%,
                    4px calc(100% - 4px),
                    0 calc(100% - 4px)
                  )`,
                }}
              >
                <PixelIcon
                  rows={item.icon}
                  className="h-4 w-auto shrink-0"
                />

                <span className="whitespace-nowrap text-[#0D2734]">
                  {t(item.key)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


