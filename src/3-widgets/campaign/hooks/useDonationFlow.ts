import { useMemo, useState } from "react";

import { getPixelTargetColor } from "@/src/5-entities/heart-pixel";
import { DonationRecord } from "@/src/5-entities/donation";
import { pickRandomAvailablePixel } from "../helpers";
import { SoldPixels } from "@/src/5-entities/heart-pixel/types";

export type DonationStep = "idle" | "checkout" | "success" | "story";

type UseDonationFlowOptions = {
  /** Stanje srca koje je "stiglo sa backenda" (za sada mock). */
  initialSoldPixels: SoldPixels;
};

export function useDonationFlow({ initialSoldPixels }: UseDonationFlowOptions) {
  const [step, setStep] = useState<DonationStep>("idle");
  const [selectedPixel, setSelectedPixel] = useState<number | null>(null);
  const [lastPurchase, setLastPurchase] = useState<DonationRecord | null>(null);

  // Kupovine napravljene u ovoj sesiji. Dok nema backenda, ovako simuliramo
  // da je server zabeležio novo stanje srca.
  const [sessionSales, setSessionSales] = useState<SoldPixels>(new Map());

  const soldPixels: SoldPixels = useMemo(
    () => new Map([...initialSoldPixels, ...sessionSales]),
    [initialSoldPixels, sessionSales],
  );

  const showSuccess =
    (step === "success" || step === "story") && lastPurchase !== null;
  const showCheckout = step === "checkout" && selectedPixel !== null;
  const showStory = step === "story" && lastPurchase !== null;

  const choosePixel = (pixelNumber: number) => {
    if (soldPixels.has(pixelNumber)) return;
    setSelectedPixel(pixelNumber);
    setStep("idle");
  };

  const chooseRandomPixel = () => {
    const pixelNumber = pickRandomAvailablePixel(soldPixels);
    if (pixelNumber !== null) choosePixel(pixelNumber);
  };

  const openCheckout = () => {
    if (selectedPixel !== null) setStep("checkout");
  };

  /** Kad backend bude gotov, ovde ide poziv API-ja + plaćanje umesto lokalnog upisa. */
  const confirmDonation = (donorName?: string) => {
    if (selectedPixel === null) return;

    const color = getPixelTargetColor(selectedPixel);

    setSessionSales((current) =>
      new Map(current).set(selectedPixel, donorName?.trim() || null),
    );
    setLastPurchase({ id: selectedPixel, color });
    setSelectedPixel(null);
    setStep("success");
  };

  const reset = () => {
    setSelectedPixel(null);
    setStep("idle");
  };

  const closeDialog = () => {
    if (showSuccess) reset();
    else setStep("idle");
  };

  const openStory = () => setStep("story");
  const closeStory = () => setStep("success");

  return {
    step,
    selectedPixel,
    soldPixels,
    lastPurchase,
    showCheckout,
    showSuccess,
    showStory,
    choosePixel,
    chooseRandomPixel,
    openCheckout,
    confirmDonation,
    reset,
    closeDialog,
    openStory,
    closeStory,
  };
}