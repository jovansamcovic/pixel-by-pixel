"use client";

import { useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

import { PixelHeart } from "@/src/5-entities/heart-pixel";

import { MagnifierIcon } from "@/src/6-shared/icons/magnifier-icon-pixel";
import { PixelPickerOverlay } from "@/src/5-entities/select-pixel/facade";
import { pixelClip } from "@/src/5-entities/select-pixel/styles";

type PixelSelectorProps = {
  selectedPixel: number | null;
  purchasedPixels: Record<number, string>;
  formattedPrice: string;
  onSelect: (pixelId: number) => void;
  onRandomSelect: () => void;
  onCheckout: () => void;
  onPickerClose?: () => void;
};

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
        style={pixelClip}
        className="group mt-3 inline-flex bg-[#0D2734] p-[3px] transition active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
      >
        <span
          style={pixelClip}
          className="inline-flex items-center gap-2 bg-[#FFF6EB] px-4 py-2.5 text-[13px] uppercase leading-none tracking-[0.04em] text-[#0D2734] shadow-[inset_0_4px_0_#FFFFFF,inset_0_-5px_0_#E6D5BF] transition group-hover:bg-[#0D2734] group-hover:text-[#FFF6EB] group-hover:shadow-[inset_0_4px_0_#1E4153,inset_0_-5px_0_#061820]"
        >
          <MagnifierIcon />
          {t("open")}
        </span>
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
