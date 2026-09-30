"use client";

import { useTranslations } from "next-intl";

import type { DonationRecord } from "@/src/5-entities/donation/DonationBadge";
import { Sheet } from "@/src/6-shared/ui/bottom-sheet/BottomSheet";
import { Modal } from "@/src/6-shared/ui/modal/Modal";

import { StoryContent } from "./StoryContent";

type InstagramStoryDialogProps = {
  isMobile: boolean;
  donation: DonationRecord;
  onClose: () => void;
};

export function InstagramStoryDialog({
  isMobile,
  donation,
  onClose,
}: InstagramStoryDialogProps) {
  const t = useTranslations("InstagramStoryDialog");

  const content = <StoryContent donation={donation} />;

  if (isMobile) {
    return (
      <Sheet
        open
        onClose={onClose}
        title={t("sheet.title")}
        closeLabel={t("modal.closeLabel")}
        icon={null}
      >
        {content}
      </Sheet>
    );
  }

  return (
    <Modal
      labelledBy="story-title"
      closeLabel={t("modal.closeLabel")}
      overlayClassName="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0D2734]/75 p-4 backdrop-blur-sm sm:p-6"
      dialogClassName="relative w-full max-w-xl overflow-hidden rounded-[32px] bg-[#FFF6EB] shadow-[0_30px_100px_rgba(13,39,52,0.35)]"
      closeButtonClassName="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#0D2734]/10 bg-white text-xl text-[#0D2734] shadow-sm transition hover:bg-[#D6384B] hover:text-white focus-visible:outline-none"
      onClose={onClose}
    >
      {content}
    </Modal>
  );
}