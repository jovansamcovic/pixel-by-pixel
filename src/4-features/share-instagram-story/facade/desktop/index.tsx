"use client";

import type { ReactNode } from "react";

import { useTranslations } from "next-intl";
import { Modal } from "@/src/6-shared/ui/modal";

export type Props = {
  children: ReactNode;
  onClose: () => void;
};

export function DesktopShareInstagramStory({ children, onClose }: Props) {
  const t = useTranslations("InstagramStoryDialog");

  return (
    <Modal
      labelledBy="story-title"
      closeLabel={t("modal.closeLabel")}
      overlayClassName="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0D2734]/60 p-4 sm:p-6"
      dialogClassName="relative w-full max-w-md border-[3px] border-[#0D2734] bg-[#FFF6EB] shadow-[8px_8px_0_#0D2734]"
      closeButtonClassName="absolute right-3 top-3 z-50 grid size-9 place-items-center text-[28px] leading-none text-[#0D2734] transition hover:text-[#E52336] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
      onClose={onClose}
    >
      <div className="px-6 pb-7 pt-7 sm:px-8 sm:pb-8">{children}</div>
    </Modal>
  );
}
