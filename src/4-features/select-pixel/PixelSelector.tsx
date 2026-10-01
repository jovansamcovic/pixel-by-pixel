"use client";

import { useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

import { PixelHeart } from "@/src/5-entities/heart-pixel/PixelHeart";

import { PixelPickerOverlay } from "./ui/PixelPickerOverlay";

type PixelSelectorProps = {
  selectedPixel: number | null;
  purchasedPixels: Record<number, string>;
  formattedPrice: string;
  onSelect: (pixelId: number) => void;
  onRandomSelect: () => void;
  /** Klik na "Kupi" u režimu biranja */
  onCheckout: () => void;
  /** Režim biranja je zatvoren bez kupovine */
  onPickerClose?: () => void;
};

function MagnifierIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className="size-4"
      fill="currentColor"
    >
      <rect x="2" y="1" width="4" height="1" />
      <rect x="1" y="2" width="1" height="4" />
      <rect x="6" y="2" width="1" height="4" />
      <rect x="2" y="6" width="4" height="1" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="9" y="9" width="2" height="2" />
    </svg>
  );
}

/**
 * Na strani je srce samo pregled: nema zuma ni hvatanja gestova,
 * pa skrol strane radi normalno. Biranje piksela se radi u režimu
 * preko celog ekrana (PixelPickerOverlay).
 */
export function PixelSelector({
  selectedPixel,
  purchasedPixels,
  formattedPrice,
  onSelect,
  onRandomSelect,
  onCheckout,
  onPickerClose,
}: PixelSelectorProps) {
  const t = useTranslations("PixelSelector");
  const [pickerOpen, setPickerOpen] = useState(false);

  const openPicker = () => setPickerOpen(true);

  const closePicker = () => {
    setPickerOpen(false);
    onPickerClose?.();
  };

  const checkout = () => {
    setPickerOpen(false);
    onCheckout();
  };

  const handlePreviewKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* Pregled srca: tap otvara režim biranja */}
      <div
        role="button"
        tabIndex={0}
        aria-label={t("previewAriaLabel")}
        onClick={openPicker}
        onKeyDown={handlePreviewKeyDown}
        className="w-full cursor-zoom-in touch-pan-y p-2 outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
      >
        <div className="pointer-events-none">
          <PixelHeart
            selectedPixel={selectedPixel}
            purchasedPixels={purchasedPixels}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={openPicker}
        className="mt-3 inline-flex items-center gap-2 border-2 border-[#0D2734] bg-[#FFF6EB] px-4 py-2.5 text-[13px] uppercase leading-none tracking-[0.04em] text-[#0D2734] transition hover:bg-[#0D2734] hover:text-[#FFF6EB] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
      >
        <MagnifierIcon />
        {t("open")}
      </button>

      {pickerOpen && (
        <PixelPickerOverlay
          selectedPixel={selectedPixel}
          purchasedPixels={purchasedPixels}
          formattedPrice={formattedPrice}
          onSelect={onSelect}
          onRandomSelect={onRandomSelect}
          onCheckout={checkout}
          onClose={closePicker}
        />
      )}
    </div>
  );
}