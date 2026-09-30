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

  // Sheet već ima svoj padding (px-5 pb-6 pt-5), pa sadržaj ide direktno
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

  // Modal nema padding, pa ga dodajemo ovde
  return (
    <Modal
      labelledBy="story-title"
      closeLabel={t("modal.closeLabel")}
      overlayClassName="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0D2734]/60 p-4 sm:p-6"
      dialogClassName="relative w-full max-w-md border-[3px] border-[#0D2734] bg-[#FFF6EB] shadow-[8px_8px_0_#0D2734]"
      closeButtonClassName="absolute right-3 top-3 z-50 grid size-9 place-items-center text-[28px] leading-none text-[#0D2734] transition hover:text-[#E52336] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
      onClose={onClose}
    >
      <div className="px-6 pb-7 pt-7 sm:px-8 sm:pb-8">{content}</div>
    </Modal>
  );
}