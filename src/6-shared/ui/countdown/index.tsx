
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const CAMPAIGN_END = new Date(
  "2026-10-30T23:59:59+01:00"
).getTime();

const pad = (value: number) =>
  String(value).padStart(2, "0");

function getTimeLeft(now: number) {
  const diff = Math.max(CAMPAIGN_END - now, 0);

  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor(diff / 3_600_000) % 24,
    m: Math.floor(diff / 60_000) % 60,
  };
}

const UNITS = ["d", "h", "m"] as const;

function HourglassIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M5 2h14v3H5z" />
      <path d="M5 19h14v3H5z" />
      <path d="M7 5v3l5 4-5 4v3" />
      <path d="M17 5v3l-5 4 5 4v3" />
      <path d="M10 17h4" />
    </svg>
  );
}

export function Countdown() {
  const t = useTranslations("Countdown");

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const left = now === null ? null : getTimeLeft(now);

  return (
    <div
      role="timer"
      aria-label={t("ariaLabel")}
      className="flex shrink-0 items-center gap-2.5 text-[#0D2734]"
    >
      <span className="text-[#0D2734]/65">
        <HourglassIcon />
      </span>

      {UNITS.map((unit, index) => (
        <div
          key={unit}
          className="flex items-center gap-2.5"
        >
          {index > 0 && (
            <span
              aria-hidden="true"
              className="h-5 w-px bg-[#0D2734]/20"
            />
          )}

          <div className="flex items-baseline gap-1">
            <span className="text-[16px] leading-none tabular-nums text-[#0D2734] sm:text-[18px]">
              {left ? pad(left[unit]) : "--"}
            </span>

            <span className="text-[10px] uppercase leading-none tracking-[0.03em] text-[#0D2734]/60 sm:text-[11px]">
              {t(`units.${unit}`)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
