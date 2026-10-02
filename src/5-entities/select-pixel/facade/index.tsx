"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import {
  HEART_COLUMNS,
  HEART_PIXELS,
  HEART_RENDER_ROWS,
  PixelHeart,
} from "@/src/5-entities/heart-pixel";
import { CloseIcon } from "@/src/6-shared/icons/close-icon-pixel";
import { useModalBehavior } from "../hooks/useModalBehavior";
import { usePanZoom } from "../hooks/usePanZoom";
import { toolButton } from "../styles";
import { ZoomControls } from "../ui/zoom-controls";
import { PickerMinimap } from "../ui/picker-minimap";
import { PickerFooter } from "../ui/picker-footer";

type PixelPickerOverlayProps = {
  selectedPixel: number | null;
  purchasedPixels: Record<number, string>;
  formattedPrice: string;
  onSelect: (pixelId: number) => void;
  onRandomSelect: () => void;
  onCheckout: () => void;
  onClose: () => void;
};

/** Pozicija piksela u mreži srca; broj piksela = id + 1 */
function getPixelCell(pixelId: number) {
  const pixel = HEART_PIXELS[pixelId - 1];
  return pixel ? { x: pixel.col, y: pixel.row } : null;
}

export function PixelPickerOverlay({
  selectedPixel,
  purchasedPixels,
  formattedPrice,
  onSelect,
  onRandomSelect,
  onCheckout,
  onClose,
}: PixelPickerOverlayProps) {
  const t = useTranslations("PixelSelector");
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useModalBehavior(onClose, closeButtonRef);

  const panZoom = usePanZoom(HEART_COLUMNS, HEART_RENDER_ROWS);
  const { view, isZoomed, centerOnCell } = panZoom;

  // Posle nasumičnog izbora zumirani pogled dolazi na novi piksel
  const centerOnNextSelection = useRef(false);

  useEffect(() => {
    if (!centerOnNextSelection.current || selectedPixel === null) return;
    centerOnNextSelection.current = false;

    const cell = getPixelCell(selectedPixel);
    if (cell) centerOnCell(cell);
  }, [selectedPixel, centerOnCell]);

  const handleRandomSelect = () => {
    centerOnNextSelection.current = true;
    onRandomSelect();
  };

  const handlePixelSelect = (pixelId: number) => {
    if (!panZoom.isSelectionBlocked()) onSelect(pixelId);
  };

  const contentWidth = panZoom.baseWidth * view.scale;
  const contentHeight = panZoom.baseHeight * view.scale;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("picker.title")}
      className="fixed inset-0 z-[1000] flex touch-none select-none flex-col overscroll-none bg-[#FFF6EB] text-[#0D2734]"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#0D2734]/15 px-3">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={t("picker.close")}
          className={toolButton}
        >
          <CloseIcon />
        </button>

        <p className="text-[13px] uppercase tracking-[0.04em]">{t("picker.title")}</p>

        <span className="w-9 text-right text-[11px] tabular-nums text-[#0D2734]/60">
          {Math.round(view.scale * 100)}%
        </span>
      </header>

      {/* Srce: svi gestovi ovde pripadaju srcu, ne strani */}
      <div
        ref={panZoom.viewportRef}
        {...panZoom.gestureHandlers}
        className={[
          "relative flex min-h-0 flex-1 items-center justify-center overflow-hidden",
          isZoomed ? "cursor-grab active:cursor-grabbing" : "",
        ].join(" ")}
      >
        {panZoom.baseWidth > 0 && (
          <div
            className={[
              "relative shrink-0",
              panZoom.smooth
                ? "transition-[width,transform] duration-300 ease-out"
                : "transition-none",
            ].join(" ")}
            style={{
              width: `${contentWidth}px`,
              transform: `translate3d(${view.pan.x}px, ${view.pan.y}px, 0)`,
              willChange: "transform, width",
            }}
          >
            <PixelHeart
              interactive
              selectedPixel={selectedPixel}
              purchasedPixels={purchasedPixels}
              onSelect={handlePixelSelect}
              className="!max-w-none"
            />
          </div>
        )}

        <ZoomControls
          isZoomed={isZoomed}
          canZoomIn={panZoom.canZoomIn}
          onZoomIn={panZoom.zoomIn}
          onZoomOut={panZoom.zoomOut}
          onReset={panZoom.resetZoom}
        />

        {isZoomed ? (
          <PickerMinimap
            view={view}
            viewport={panZoom.size}
            content={{ width: contentWidth, height: contentHeight }}
            selectedPixel={selectedPixel}
            purchasedPixels={purchasedPixels}
          />
        ) : (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] leading-none text-[#0D2734]/55">
            {t("picker.hint")}
          </p>
        )}
      </div>

      <PickerFooter
        selectedPixel={selectedPixel}
        formattedPrice={formattedPrice}
        onRandomSelect={handleRandomSelect}
        onCheckout={onCheckout}
      />
    </div>,
    document.body,
  );
}
