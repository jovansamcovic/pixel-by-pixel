"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import {
  type Cause,
  getCauseContent,
  getCauseHref,
} from "@/src/5-entities/cause";
import { pixelClip } from "@/src/5-entities/select-pixel/styles";

type CauseVideoDialogProps = {
  /** `null` = dijalog zatvoren */
  cause: Cause | null;
  onClose: () => void;
};

/**
 * Native <dialog>: Esc, focus trap i top-layer dobijamo od browsera.
 * Sadržaj (i <video>) se unmount-uje kad je `cause` null, pa video staje.
 */
export function CauseVideoDialog({ cause, onClose }: CauseVideoDialogProps) {
  const t = useTranslations("Causes");
  const locale = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (cause && !dialog.open) dialog.showModal();
    if (!cause && dialog.open) dialog.close();
  }, [cause]);

  const content = cause ? getCauseContent(cause, locale) : null;
  const captions = cause?.video.captions?.[locale as "sr" | "en"];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cause-video-title"
      onClose={onClose}
      onClick={(event) => {
        // Klik na zatamnjenu pozadinu zatvara dijalog
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[94dvh] w-[min(92vw,420px)] overflow-y-auto bg-[#FFF6EB] p-0 text-[#0D2734] shadow-[6px_6px_0_#0D2734] backdrop:bg-[#0D2734]/80"
    >
      {cause && content && (
        <div className="flex flex-col">
          <div className="relative bg-[#0D2734]">
            <video
              key={cause.slug}
              src={cause.video.src}
              poster={cause.video.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="mx-auto block aspect-[9/16] max-h-[62dvh] w-full object-cover"
            >
              {captions && (
                <track kind="captions" src={captions} srcLang={locale} label={locale.toUpperCase()} default />
              )}
            </video>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              style={pixelClip}
              className="absolute right-3 top-3 grid size-11 place-items-center bg-[#FFF6EB] text-[#0D2734] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3 p-5">
            <span className="inline-flex w-fit items-center gap-2 border-2 border-[#0D2734] bg-white px-2 py-1 text-[12px] uppercase leading-none tracking-[0.04em]">
              <span className="size-2.5" style={{ backgroundColor: cause.color }} aria-hidden="true" />
              {t("shareOfDonation", { share: cause.share })}
            </span>

            <h2 id="cause-video-title" className="text-[24px] leading-tight">
              {content.title}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#0D2734]/80">{content.videoText}</p>

            <Link
              href={getCauseHref(locale, cause.slug)}
              style={pixelClip}
              className="group mt-1 inline-flex bg-[#0D2734] p-[3px] transition active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
            >
              <span
                style={pixelClip}
                className="flex w-full items-center justify-between gap-2 bg-[#FFF6EB] px-4 py-3 text-[13px] uppercase leading-none tracking-[0.04em] shadow-[inset_0_4px_0_#FFFFFF,inset_0_-5px_0_#E6D5BF] transition group-hover:bg-[#0D2734] group-hover:text-[#FFF6EB] group-hover:shadow-[inset_0_4px_0_#1E4153,inset_0_-5px_0_#061820]"
              >
                {t("fullStory")}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}
