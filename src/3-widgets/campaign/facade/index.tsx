"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  DonationDialog,
  DonationFormContent,
  DonationSuccess,
} from "@/src/4-features/donation-form";
import {
  HEART_PIXELS,
  PIXEL_PRICE,
  getPixelTargetColor,
  isInitiallySold,
} from "@/src/5-entities/heart-pixel";
import { CampaignHeader } from "../ui/campaign-header";
import { ImageBackground } from "../ui/image-background";
import { PixelSelector } from "@/src/4-features/select-pixel/facade";
import { DonationRecord } from "@/src/5-entities/donation";
import { ShareInstagramStory } from "@/src/4-features/share-instagram-story/facade";

type CampaignWidgetProps = {
  isMobile: boolean;
};

type Step = "idle" | "checkout" | "success" | "story";

export function CampaignWidget({ isMobile }: CampaignWidgetProps) {
  const t = useTranslations("CampaignWidget");
  const locale = useLocale();

  const [step, setStep] = useState<Step>("idle");
  const [selectedPixel, setSelectedPixel] = useState<number | null>(null);
  const [purchasedPixels, setPurchasedPixels] = useState<
    Record<number, string>
  >({});
  const [lastPurchase, setLastPurchase] = useState<DonationRecord | null>(null);

  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat(locale === "sr" ? "sr-RS" : "en-US", {
        style: "currency",
        currency: "RSD",
        maximumFractionDigits: 0,
      }).format(PIXEL_PRICE),
    [locale],
  );

  const showSuccess =
    (step === "success" || step === "story") && lastPurchase !== null;
  const showCheckout = step === "checkout" && selectedPixel !== null;

  const choosePixel = (pixelId: number) => {
    setSelectedPixel(pixelId);
    setStep("idle");
  };

  const openCheckout = () => {
    if (selectedPixel !== null) setStep("checkout");
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

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedPixel === null) return;

    const color = getPixelTargetColor(selectedPixel);

    setPurchasedPixels((current) => ({ ...current, [selectedPixel]: color }));
    setLastPurchase({ id: selectedPixel, color });
    setSelectedPixel(null);
    setStep("success");
  };

  const resetDonation = () => {
    setSelectedPixel(null);
    setStep("idle");
  };

  const handleDonationClose = () => {
    if (showSuccess) resetDonation();
    else setStep("idle");
  };

  return (
    <section
      id="srce"
      className="relative overflow-hidden bg-[#FFF6EB] pb-6 pt-6 sm:pb-32 sm:pt-10"
    >
      <ImageBackground />

      <div className="relative z-10 mx-auto max-w-[720px] px-5 sm:px-8">
        <CampaignHeader formattedPrice={formattedPrice} />

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

      {(showCheckout || showSuccess) && (
        <DonationDialog isMobile={isMobile} onClose={handleDonationClose}>
          {showSuccess ? (
            <DonationSuccess
              successPixel={lastPurchase.id}
              onShareStory={() => setStep("story")}
              onReset={resetDonation}
            />
          ) : (
            <DonationFormContent
              selectedPixel={selectedPixel!}
              selectedColor={getPixelTargetColor(selectedPixel!)}
              formattedPrice={formattedPrice}
              onSubmit={submitDonation}
            />
          )}
        </DonationDialog>
      )}

      {step === "story" && lastPurchase && (
        <ShareInstagramStory
          isMobile={isMobile}
          donation={lastPurchase}
          onClose={() => setStep("success")}
        />
      )}
    </section>
  );
}
