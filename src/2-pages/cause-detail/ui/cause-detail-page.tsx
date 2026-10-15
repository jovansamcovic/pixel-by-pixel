import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import {
  CAUSES,
  type Cause,
  type CauseStepStatus,
  CauseIcon,
  CauseRing,
  formatRsd,
  getAmountPerPixel,
  getCauseContent,
  getCauseHref,
  getCauseProgress,
} from "@/src/5-entities/cause";
import { pixelClip } from "@/src/5-entities/select-pixel/styles";

type CauseDetailPageProps = {
  cause: Cause;
  locale: string;
  totalRaised: number;
  pixelPrice: number;
};

const STEP_DOT: Record<CauseStepStatus, string> = {
  done: "bg-[#0D2734] border-[#0D2734]",
  current: "bg-[#E52336] border-[#E52336]",
  upcoming: "bg-[#FFF6EB] border-[#0D2734]/40",
};

export async function CauseDetailPage({ cause, locale, totalRaised, pixelPrice }: CauseDetailPageProps) {
  const t = await getTranslations({ locale, namespace: "Causes" });
  const content = getCauseContent(cause, locale);
  const progress = getCauseProgress(cause, totalRaised);
  const others = CAUSES.filter((other) => other.slug !== cause.slug);
  const captions = cause.video.captions?.[locale as "sr" | "en"];

  return (
    <main className="min-h-dvh bg-[#FFF6EB] pb-32 text-[#0D2734]">
      {/* Naslovna fotografija */}
      <div className="relative mx-auto aspect-[4/3] max-h-[460px] w-full max-w-[960px] bg-[#E6D5BF] sm:aspect-[16/7]">
        <Image src={cause.cover} alt="" fill priority sizes="(min-width: 960px) 960px, 100vw" className="object-cover" />
        <Link
          href={`/${locale}#srce`}
          aria-label={t("back")}
          style={pixelClip}
          className="absolute left-4 top-4 grid size-11 place-items-center bg-[#FFF6EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="square" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
      </div>

      <article className="mx-auto max-w-[640px] px-5 sm:px-8">
        <header className="pt-6">
          <span className="inline-flex items-center gap-2 border-2 border-[#0D2734] bg-white px-2 py-1 text-[12px] uppercase leading-none tracking-[0.04em]">
            <span className="size-2.5" style={{ backgroundColor: cause.color }} aria-hidden="true" />
            {t("shareOfDonation", { share: cause.share })}
          </span>
          <p className="mt-4 flex items-center gap-2 text-[14px] text-[#0D2734]/75">
            <CauseIcon name={cause.icon} color={cause.color} className="size-5" />
            {content.title}
          </p>
          <h1 className="mt-2 text-[32px] leading-[1.05] sm:text-[44px]">{content.headline}</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-[#0D2734]/80">{content.lead}</p>
        </header>

        {/* Napredak */}
        <section
          aria-label={t("progressLabel")}
          className="mt-6 flex items-center gap-5 border-2 border-[#0D2734] bg-white p-4 shadow-[4px_4px_0_#0D2734]"
        >
          <div className="relative size-24 shrink-0">
            <CauseRing percent={progress.percent} color={cause.color} className="size-full" />
            <span className="absolute inset-0 grid place-items-center text-[20px] tabular-nums">
              {progress.percent}%
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[22px] leading-tight tabular-nums">{formatRsd(progress.raised, locale)}</p>
            <p className="mt-1 text-[13px] text-[#0D2734]/75">
              {t("ofGoal", { goal: formatRsd(progress.goal, locale) })}
            </p>
            <p className="mt-2 text-[13px] text-[#0D2734]/75">
              {t("perPixel", { amount: formatRsd(getAmountPerPixel(cause, pixelPrice), locale) })}
            </p>
          </div>
        </section>

        {/* Priča */}
        <section className="mt-10">
          <h2 className="text-[22px]">{t("story")}</h2>
          <div className="mt-3 flex flex-col gap-4 text-[16px] leading-relaxed">
            {content.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {content.quote && (
            <figure className="mt-6 border-l-0 bg-white p-5" style={{ boxShadow: `inset 6px 0 0 ${cause.color}` }}>
              <blockquote className="text-[19px] leading-snug">„{content.quote.text}”</blockquote>
              <figcaption className="mt-2 text-[13px] text-[#0D2734]/75">— {content.quote.author}</figcaption>
            </figure>
          )}

          <video
            src={cause.video.src}
            poster={cause.video.poster}
            controls
            playsInline
            preload="metadata"
            className="mx-auto mt-6 block aspect-[9/16] max-h-[640px] w-full max-w-[360px] border-2 border-[#0D2734] bg-[#0D2734] object-cover"
          >
            {captions && <track kind="captions" src={captions} srcLang={locale} label={locale.toUpperCase()} default />}
          </video>
        </section>

        {/* Šta kupujemo */}
        <section className="mt-10">
          <h2 className="text-[22px]">{t("whatWeBuy")}</h2>
          <ul className="mt-3 border-2 border-[#0D2734] bg-white">
            {content.items.map((item) => (
              <li key={item.label} className="flex justify-between gap-4 border-b-2 border-[#E6D5BF] px-4 py-3 text-[15px] last:border-b-0">
                <span>{item.label}</span>
                <span className="shrink-0 tabular-nums">
                  {item.price === null ? t("priceTbd") : formatRsd(item.price, locale)}
                </span>
              </li>
            ))}
          </ul>
        </section>

  

        {/* Galerija */}
        {cause.gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[22px]">{t("gallery")}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {cause.gallery.map((src, index) => (
                <div
                  key={src}
                  className={`relative bg-[#E6D5BF] ${index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
                >
                  <Image src={src} alt="" fill sizes="(min-width: 640px) 640px, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ostale namene */}
        <section className="mt-10">
          <h2 className="text-[22px]">{t("otherCauses")}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {others.map((other) => {
              const otherContent = getCauseContent(other, locale);
              return (
                <Link
                  key={other.slug}
                  href={getCauseHref(locale, other.slug)}
                  className="flex flex-col gap-2 border-2 border-[#0D2734] bg-white p-3 shadow-[3px_3px_0_#0D2734] transition active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
                >
                  <CauseIcon name={other.icon} color={other.color} className="size-6" />
                  <span className="text-[14px] leading-tight">{otherContent.shortTitle}</span>
                  <span className="text-[12px] text-[#0D2734]/75">{other.share}%</span>
                </Link>
              );
            })}
          </div>
        </section>
      </article>

      {/* Stalni CTA na dnu */}
      <div
        className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-[#0D2734] bg-[#FFF6EB] px-5 pt-3"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <Link
          href={`/${locale}#srce`}
          style={pixelClip}
          className="group mx-auto flex max-w-[640px] bg-[#0D2734] p-[3px] transition active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
        >
          <span
            style={pixelClip}
            className="flex w-full items-center justify-center bg-[#E52336] px-4 py-3.5 text-[14px] uppercase leading-none tracking-[0.04em] text-white shadow-[inset_0_4px_0_#F25A66,inset_0_-5px_0_#A81B28]"
          >
            {t("buyPixel")}
          </span>
        </Link>
      </div>
    </main>
  );
}
