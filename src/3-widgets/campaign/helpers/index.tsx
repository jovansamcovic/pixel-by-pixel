import { HEART_PIXELS, toPixelNumber } from "@/src/5-entities/heart-pixel";
import { SoldPixels } from "@/src/5-entities/heart-pixel/types";

export function formatPrice(amount: number, locale: string, currency = "RSD"): string {
  return new Intl.NumberFormat(locale === "sr" ? "sr-RS" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function pickRandomAvailablePixel(soldPixels: SoldPixels): number | null {
  const available = HEART_PIXELS.map((pixel) => toPixelNumber(pixel.id)).filter(
    (pixelNumber) => !soldPixels.has(pixelNumber),
  );
  if (available.length === 0) return null;

  return available[Math.floor(Math.random() * available.length)];
}