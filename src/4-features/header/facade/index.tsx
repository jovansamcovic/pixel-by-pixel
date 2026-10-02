import { Countdown } from "@/src/6-shared/ui/countdown";
import { useLocale, useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();

  const langClass = (active: boolean) =>
    [
      "grid h-full min-w-10 place-items-center px-2",
      "text-[13px] tracking-wide transition-colors",
      active ? "bg-[#E52336] text-white" : "bg-[#FFF6EB] text-[#0D2734]",
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
        <span aria-hidden="true" className="size-1.5 bg-[#F5A33B]" />
        <span>{t("paymentsDisabled")}</span>
      </div>

      <header className="sticky top-0 z-50 bg-[#FFF6EB]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-5 sm:h-[84px] sm:px-8 lg:px-12">
          <Countdown />

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex h-10 overflow-hidden rounded-[10px] border-2 border-[#0D2734]">
              <a
                href="/sr"
                aria-label="Srpski"
                className={langClass(locale === "sr")}
              >
                SR
              </a>

              <a
                href="/en"
                aria-label="English"
                className={[
                  langClass(locale === "en"),
                  "border-l-2 border-[#0D2734]",
                ].join(" ")}
              >
                EN
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}