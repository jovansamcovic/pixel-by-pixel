
import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Countdown } from "@/src/6-shared/ui/countdown";

const languagePixelClip: CSSProperties = {
  clipPath: `polygon(
    0 3px, 3px 3px, 3px 0,
    calc(100% - 3px) 0,
    calc(100% - 3px) 3px,
    100% 3px,
    100% calc(100% - 3px),
    calc(100% - 3px) calc(100% - 3px),
    calc(100% - 3px) 100%,
    3px 100%,
    3px calc(100% - 3px),
    0 calc(100% - 3px)
  )`,
};

export default function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();

  const langClass = (active: boolean) =>
    [
      "grid h-full min-w-10 place-items-center px-2",
      "text-[12px] font-bold tracking-[0.04em]",
      "transition-colors duration-150",
      active
        ? [
            "bg-[#E52336] text-white",
            "shadow-[inset_0_3px_0_#FF5564,inset_0_-3px_0_#B5111F]",
          ].join(" ")
        : [
            "bg-[#FFF6EB] text-[#0D2734]",
            "shadow-[inset_0_3px_0_#FFFFFF,inset_0_-3px_0_#E6D5BF]",
            "hover:bg-[#FFFBF5]",
          ].join(" "),
    ].join(" ");

  return (
    <>
      <div
        className={[
          "flex h-7 items-center justify-center gap-2 bg-[#0D2734] px-4",
          "text-[9px] uppercase tracking-[0.14em] text-[#FFF6EB]",
          "sm:text-[10px]",
        ].join(" ")}
      >
        <span>{t("demoConcept")}</span>
        <span
          aria-hidden="true"
          className="size-1.5 bg-[#F5A33B]"
        />
        <span>{t("paymentsDisabled")}</span>
      </div>

      <header className="sticky top-0 z-50 bg-[#FFF6EB]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-5 sm:h-[84px] sm:px-8 lg:px-12">
          <Countdown />

          <nav
            aria-label="Language"
            className="shrink-0 bg-[#0D2734] p-[3px]"
            style={languagePixelClip}
          >
            <div
              className="flex h-9 overflow-hidden"
              style={languagePixelClip}
            >
              <a
                href="/sr"
                aria-label="Srpski"
                aria-current={locale === "sr" ? "page" : undefined}
                className={langClass(locale === "sr")}
              >
                SR
              </a>

              <a
                href="/en"
                aria-label="English"
                aria-current={locale === "en" ? "page" : undefined}
                className={[
                  langClass(locale === "en"),
                  "border-l-[2px] border-[#0D2734]",
                ].join(" ")}
              >
                EN
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
