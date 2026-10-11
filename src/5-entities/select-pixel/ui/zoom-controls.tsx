import { useTranslations } from "next-intl";

import { ZoomIcon } from "@/src/6-shared/icons/zoom-icon-pixel";

import { pixelClip } from "../styles";

type ZoomControlsProps = {
  isZoomed: boolean;
  canZoomIn: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

const buttonFrame = [
  "group relative size-9 shrink-0",
  "bg-[#0D2734] p-[3px]",
  "transition active:translate-y-[2px]",
  "focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-[#E52336]",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

const buttonInner = [
  "flex h-full w-full items-center justify-center",
  "bg-[#FFF6EB] text-[#0D2734]",
  "shadow-[inset_0_3px_0_#FFFFFF,inset_0_-3px_0_#E6D5BF]",
  "transition-colors group-hover:bg-[#FFFBF5]",
].join(" ");

const resetButtonInner = [
  "flex h-full w-full items-center justify-center",
  "bg-[#DCE5E5] text-[#0D2734]",
  "shadow-[inset_0_3px_0_#F3F7F7,inset_0_-3px_0_#B8C9CA]",
  "transition-colors group-hover:bg-[#C8D9DA]",
].join(" ");

export function ZoomControls({
  isZoomed,
  canZoomIn,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  const t = useTranslations("PixelSelector.controls");

  return (
    <div
      className="absolute right-3 top-3 z-10 flex flex-col gap-1"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        aria-label={t("zoomIn")}
        style={pixelClip}
        className={buttonFrame}
      >
        <span style={pixelClip} className={buttonInner}>
          <ZoomIcon type="plus" />
        </span>
      </button>

      <button
        type="button"
        onClick={onZoomOut}
        disabled={!isZoomed}
        aria-label={t("zoomOut")}
        style={pixelClip}
        className={buttonFrame}
      >
        <span style={pixelClip} className={buttonInner}>
          <ZoomIcon type="minus" />
        </span>
      </button>

      {isZoomed && (
        <button
          type="button"
          onClick={onReset}
          aria-label={t("resetAriaLabel")}
          title={t("reset")}
          style={pixelClip}
          className={buttonFrame}
        >
          <span style={pixelClip} className={resetButtonInner}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <path d="M20 7v5h-5" />
              <path d="M20 12a8 8 0 1 0-2.3 5.7" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
