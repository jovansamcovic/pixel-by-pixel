import { useTranslations } from "next-intl";

import { ZoomIcon } from "@/src/6-shared/icons/zoom-icon-pixel";

import { toolButton } from "../styles";

type ZoomControlsProps = {
  isZoomed: boolean;
  canZoomIn: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

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
      className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        aria-label={t("zoomIn")}
        className={toolButton}
      >
        <ZoomIcon type="plus" />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        disabled={!isZoomed}
        aria-label={t("zoomOut")}
        className={toolButton}
      >
        <ZoomIcon type="minus" />
      </button>
      {isZoomed && (
        <button
          type="button"
          onClick={onReset}
          aria-label={t("resetAriaLabel")}
          className="bg-[#FFF6EB]/90 px-2 py-1 text-[11px] uppercase leading-none text-[#0D2734]/70 transition hover:text-[#0D2734]"
        >
          {t("reset")}
        </button>
      )}
    </div>
  );
}
