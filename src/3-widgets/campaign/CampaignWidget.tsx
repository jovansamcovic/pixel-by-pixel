"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  DonationDialog,
  DonationFormContent,
  DonationSuccess,
  type DonationDraft,
} from "@/src/4-features/donation-form";
import { PixelSelector } from "@/src/4-features/select-pixel/PixelSelector";
import { InstagramStoryDialog } from "@/src/4-features/share-instagram-story/InstagramStoryDialog";
import type { DonationRecord } from "@/src/5-entities/donation/DonationBadge";
import {
  HEART_PIXELS,
  PIXEL_PALETTE,
  PIXEL_PRICE,
  getPixelTargetColor,
  isInitiallySold,
} from "@/src/5-entities/heart-pixel/PixelHeart";

type CampaignWidgetProps = {
  isMobile: boolean;
};

/* Pixel-art heart ikonica (7x6 mreža) */
const HEART_ICON = [
  "0110110",
  "1111111",
  "1111111",
  "0111110",
  "0011100",
  "0001000",
];

function PixelHeartIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 7 6"
      shapeRendering="crispEdges"
      className={className}
    >
      {HEART_ICON.flatMap((row, y) =>
        row
          .split("")
          .map((cell, x) =>
            cell === "1" ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="1"
                height="1"
                fill="#E52336"
              />
            ) : null,
          ),
      )}
      <rect x="1" y="1" width="1" height="1" fill="#FF8A94" />
    </svg>
  );
}

export function CampaignWidget({ isMobile }: CampaignWidgetProps) {
  const t = useTranslations("CampaignWidget");
  const donationT = useTranslations("DonationForm");
  const locale = useLocale();

  const [selectedPixel, setSelectedPixel] = useState<number | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [purchasedPixels, setPurchasedPixels] = useState<
    Record<number, string>
  >({});
  const [successPixel, setSuccessPixel] = useState<number | null>(null);
  const [lastPurchase, setLastPurchase] = useState<DonationRecord | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(PIXEL_PALETTE[0]);

  // Svaki piksel ima unapred određenu boju slike koju donator "otkriva".
  useEffect(() => {
    if (selectedPixel === null) return;
    setSelectedColor(getPixelTargetColor(selectedPixel));
  }, [selectedPixel]);

  const numberLocale = locale === "sr" ? "sr-RS" : "en-US";

  const formattedPrice = new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: "RSD",
    maximumFractionDigits: 0,
  }).format(PIXEL_PRICE);

  const isDonationDialogOpen =
    (checkoutOpen && selectedPixel !== null) || successPixel !== null;

  // Biranje se dešava u režimu preko celog ekrana, pa ovde nema skrola
  const choosePixel = (pixelId: number) => {
    setSelectedPixel(pixelId);
    setSuccessPixel(null);
  };

  // "Kupi" iz režima biranja vodi pravo na formu za donaciju
  const openCheckout = () => {
    if (selectedPixel === null) return;
    setCheckoutOpen(true);
  };

  const chooseRandomPixel = () => {
    const available = HEART_PIXELS.filter(
      (pixel) =>
        !isInitiallySold(pixel.id) &&
        purchasedPixels[pixel.id + 1] === undefined,
    );

    if (available.length === 0) return;

    const randomPixel = available[Math.floor(Math.random() * available.length)];
    choosePixel(randomPixel.id + 1);
  };

  const completeDonation = (draft: DonationDraft) => {
    if (selectedPixel === null) return;

    const targetColor = getPixelTargetColor(selectedPixel);

    setPurchasedPixels((current) => ({
      ...current,
      [selectedPixel]: targetColor,
    }));
    setLastPurchase({ id: selectedPixel, ...draft, color: targetColor });
    setSuccessPixel(selectedPixel);
    setSelectedPixel(null);
    setCheckoutOpen(false);
  };

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedPixel === null) return;

    completeDonation({
      color: getPixelTargetColor(selectedPixel),
      name: donorName.trim() || donationT("defaults.anonymousDonor"),
      message: message.trim() || donationT("defaults.message"),
    });
  };

  const resetDonation = () => {
    setSelectedPixel(null);
    setSuccessPixel(null);
    setCheckoutOpen(false);
    setDonorName("");
    setMessage("");
    setShowMessage(false);
    setSelectedColor(PIXEL_PALETTE[0]);
    setStoryOpen(false);
  };

  const handleDonationClose = () => {
    if (successPixel !== null) {
      resetDonation();
      return;
    }
    // Zatvara dijalog, ali piksel ostaje izabran
    setCheckoutOpen(false);
  };

  return (
    <section
      id="srce"
      className="relative overflow-hidden bg-[#FFF6EB] pb-6 pt-6 sm:pb-32 sm:pt-10"
    >
      {/* Grad u pozadini: ispod srca i dugmeta, opacity 0.2 */}
      <img
        src="/city.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 block w-full select-none opacity-20"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Sadržaj preko slike */}
      <div className="relative z-10 mx-auto max-w-[720px] px-5 sm:px-8">
        {/* Intro */}
        <header className="mb-5 text-left">
          <p className="flex items-center gap-2 text-[13px] uppercase tracking-[0.04em] text-[#0D2734]">
            <PixelHeartIcon className="size-[18px]" />
            {t("priceLine", { price: formattedPrice })}
          </p>

          <h2 className="mt-3 uppercase text-[48px] leading-[0.9] tracking-[-0.02em] sm:text-6xl">
            <span className="block text-[#0D2734]">{t("headline.line1")}</span>
            <span className="block text-[#E52336]">{t("headline.line2")}</span>
            <span className="block text-[#E52336]">{t("headline.line3")}</span>
          </h2>

          <p className="mt-4 max-w-[300px] text-[17px] leading-[1.35] text-[#0D2734] sm:max-w-md sm:text-[19px]">
            {t("description")}
          </p>
        </header>

        {/* Heart */}
        <div className="mx-auto max-w-[560px]">
          <PixelSelector
            selectedPixel={selectedPixel}
            purchasedPixels={purchasedPixels}
            formattedPrice={formattedPrice}
            onSelect={choosePixel}
            onRandomSelect={chooseRandomPixel}
            onCheckout={openCheckout}
          />
        </div>
      </div>

      {isDonationDialogOpen && (
        <DonationDialog isMobile={isMobile} onClose={handleDonationClose}>
          {successPixel !== null ? (
            <DonationSuccess
              successPixel={successPixel}
              onShareStory={() => setStoryOpen(true)}
              onReset={resetDonation}
            />
          ) : (
            selectedPixel !== null && (
              <DonationFormContent
                selectedPixel={selectedPixel}
                selectedColor={selectedColor}
                formattedPrice={formattedPrice}
                onSubmit={submitDonation}
              />
            )
          )}
        </DonationDialog>
      )}

      {storyOpen && lastPurchase && (
        <InstagramStoryDialog
          isMobile={isMobile}
          donation={lastPurchase}
          onClose={() => setStoryOpen(false)}
        />
      )}
    </section>
  );
}