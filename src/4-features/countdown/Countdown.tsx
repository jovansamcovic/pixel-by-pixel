"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/* Kraj kampanje: 30 dana od starta. */
const CAMPAIGN_END = new Date("2026-10-30T23:59:59+02:00").getTime();

const pad = (value: number) => String(value).padStart(2, "0");

function getTimeLeft(now: number) {
  const diff = Math.max(CAMPAIGN_END - now, 0);

  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor(diff / 3_600_000) % 24,
    m: Math.floor(diff / 60_000) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
}

const UNITS = ["d", "h", "m", "s"] as const;

export function Countdown() {
  const t = useTranslations("Countdown");

  // null dok se komponenta ne mountuje, da server i klijent renderuju isto
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());

    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  const left = now === null ? null : getTimeLeft(now);

  return (
    <div
      role="timer"
      aria-label={t("ariaLabel")}
      className="flex shrink-0 items-start gap-3 sm:gap-5"
    >
      {UNITS.map((unit) => (
        <div key={unit} className="flex min-w-[2ch] flex-col items-center">
          <span className="text-[22px] leading-none tabular-nums text-[#0D2734] sm:text-[28px]">
            {left ? pad(left[unit]) : "--"}
          </span>

          <span className="mt-1.5 text-[11px] uppercase leading-none tracking-[0.06em] text-[#E52336] sm:text-[13px]">
            {t(`units.${unit}`)}
          </span>
        </div>
      ))}
    </div>
  );
}