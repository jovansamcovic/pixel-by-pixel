import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import {
  type Cause,
  CauseIcon,
  formatRsd,
  getAmountPerPixel,
  getCauseContent,
  getCauseHref,
  getCauseProgress,
} from "@/src/5-entities/cause";

type CauseListProps = {
  causes: Cause[];
  totalRaised: number;
  pixelPrice: number;
};

export function CauseList({ causes, totalRaised, pixelPrice }: CauseListProps) {
  const t = useTranslations("Causes");
  const locale = useLocale();

  return (
    <section aria-labelledby="causes-heading" className="mt-10 sm:mt-14">
      <h2 id="causes-heading" className="text-[24px] leading-tight text-[#0D2734] sm:text-[28px]">
        {t("heading")}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-[#0D2734]/75">
        {t("splitHint", { price: formatRsd(pixelPrice, locale) })}
      </p>

      {/* Raspodela jednog piksela */}
      <div
        role="img"
        aria-label={causes
          .map((cause) => `${getCauseContent(cause, locale).shortTitle} ${cause.share}%`)
          .join(", ")}
        className="mt-4 flex h-4 gap-[3px] border-2 border-[#0D2734] bg-[#0D2734]"
      >
        {causes.map((cause) => (
          <span key={cause.slug} style={{ width: `${cause.share}%`, backgroundColor: cause.color }} />
        ))}
      </div>
      <div className="mt-2 flex gap-[3px] text-[12px] tabular-nums text-[#0D2734]/75">
        {causes.map((cause) => (
          <span key={cause.slug} style={{ width: `${cause.share}%` }} className="truncate">
            {formatRsd(getAmountPerPixel(cause, pixelPrice), locale)}
          </span>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {causes.map((cause) => {
          const content = getCauseContent(cause, locale);
          const progress = getCauseProgress(cause, totalRaised);

          return (
            <li key={cause.slug}>
              <Link
                href={getCauseHref(locale, cause.slug)}
                className="group flex items-center gap-4 border-2 border-[#0D2734] bg-white p-4 text-[#0D2734] shadow-[4px_4px_0_#0D2734] transition hover:-translate-y-[2px] hover:shadow-[4px_6px_0_#0D2734] active:translate-y-[2px] active:shadow-[2px_2px_0_#0D2734] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
              >
                <span className="grid size-14 shrink-0 place-items-center border-2 border-[#0D2734] bg-[#FFF6EB]">
                  <CauseIcon name={cause.icon} color={cause.color} className="size-7" />
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[16px] leading-tight">{content.title}</span>
                    <span className="inline-flex items-center gap-1.5 border border-[#0D2734] px-1.5 py-0.5 text-[11px] leading-none tabular-nums">
                      <span className="size-2" style={{ backgroundColor: cause.color }} aria-hidden="true" />
                      {cause.share}%
                    </span>
                  </span>
                  <span className="text-[13px] leading-snug text-[#0D2734]/75">{content.summary}</span>

                  <span className="mt-1 block h-2 bg-[#E6D5BF]" aria-hidden="true">
                    <span
                      className="block h-full"
                      style={{ width: `${progress.percent}%`, backgroundColor: cause.color }}
                    />
                  </span>
                  <span className="text-[12px] tabular-nums text-[#0D2734]/75">
                    {formatRsd(progress.raised, locale)} {t("ofGoal", { goal: formatRsd(progress.goal, locale) })} · {progress.percent}%
                  </span>
                </span>

                <svg viewBox="0 0 24 24" className="size-6 shrink-0 transition group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="square" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
