"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useLocale } from "next-intl";

import {
  DonationDialog,
  DonationFormContent,
  DonationSuccess,
} from "@/src/4-features/donation-form";
import { getPixelTargetColor } from "@/src/5-entities/heart-pixel";
import { PixelSelector } from "@/src/4-features/select-pixel/facade";
import { ShareInstagramStory } from "@/src/4-features/share-instagram-story/facade";
import { StoryContent } from "@/src/4-features/share-instagram-story/ui/story-content";
import { CauseVideoDialog } from "@/src/4-features/cause-video";
import { CAUSES, type CauseSlug, getCauseBySlug } from "@/src/5-entities/cause";
import { CauseList } from "../ui/cause-list";
import { CampaignHeader } from "../ui/campaign-header";
import { CauseRings } from "../ui/cause-rings";
import { ImageBackground } from "../ui/image-background";
import { useDonationFlow } from "../hooks/useDonationFlow";
import { formatPrice } from "../helpers";
import { HeartStateDto, toSoldPixels } from "@/src/5-entities/heart-pixel/types";

type CampaignWidgetProps = {
  isMobile: boolean;
  /** Stanje srca sa backenda. Za sada: MOCK_HEART_STATE iz stranice. */
  heart: HeartStateDto;
};

export function CampaignWidget({ isMobile, heart }: CampaignWidgetProps) {
  const locale = useLocale();

  const initialSoldPixels = useMemo(() => toSoldPixels(heart), [heart]);
  const flow = useDonationFlow({ initialSoldPixels });

  const [videoSlug, setVideoSlug] = useState<CauseSlug | null>(null);
  const videoCause = videoSlug ? getCauseBySlug(videoSlug) ?? null : null;

  // Raste uživo posle svake donacije, pa se i prstenovi pomeraju
  const totalRaised = flow.soldPixels.size * heart.price;

  const formattedPrice = useMemo(
    () => formatPrice(heart.price, locale),
    [heart.price, locale],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Prilagodi `name` atributu polja za ime u DonationFormContent.
    const donorName = new FormData(event.currentTarget).get("donorName");
    flow.confirmDonation(typeof donorName === "string" ? donorName : undefined);
  };

  return (
    <section
      id="srce"
      className="relative overflow-hidden bg-[#FFF6EB] pb-10 pt-6 sm:pb-32 sm:pt-10"
    >
      <ImageBackground />

      <div className="relative z-10 mx-auto max-w-[720px] px-5 sm:px-8">
        <CampaignHeader formattedPrice={formattedPrice} />

        {/* pt/pb ostavljaju mesta prstenovima koji malo izlaze van srca */}
        <div className="mx-auto max-w-[560px] pb-4 pt-6">
          <PixelSelector
            selectedPixel={flow.selectedPixel}
            soldPixels={flow.soldPixels}
            formattedPrice={formattedPrice}
            onSelect={flow.choosePixel}
            onRandomSelect={flow.chooseRandomPixel}
            onCheckout={flow.openCheckout}
            heartOverlay={
              <CauseRings
                causes={CAUSES}
                totalRaised={totalRaised}
                onOpen={setVideoSlug}
              />
            }
          />
        </div>

        <div className="mx-auto max-w-[560px]">
          <CauseList causes={CAUSES} totalRaised={totalRaised} pixelPrice={heart.price} />
        </div>
      </div>

      <CauseVideoDialog cause={videoCause} onClose={() => setVideoSlug(null)} />

      {(flow.showCheckout || flow.showSuccess) && (
        <DonationDialog isMobile={isMobile} onClose={flow.closeDialog}>
          {flow.showSuccess && flow.lastPurchase ? (
            <DonationSuccess
              successPixel={flow.lastPurchase.id}
              onShareStory={flow.openStory}
              onReset={flow.reset}
            />
          ) : (
            flow.selectedPixel !== null && (
              <DonationFormContent
                selectedPixel={flow.selectedPixel}
                selectedColor={getPixelTargetColor(flow.selectedPixel)}
                formattedPrice={formattedPrice}
                onSubmit={handleSubmit}
              />
            )
          )}
        </DonationDialog>
      )}

      {flow.showStory && flow.lastPurchase && (
        <ShareInstagramStory isMobile={isMobile} onClose={flow.closeStory}>
          <StoryContent donation={flow.lastPurchase} soldPixels={flow.soldPixels} />
        </ShareInstagramStory>
      )}
    </section>
  );
}
