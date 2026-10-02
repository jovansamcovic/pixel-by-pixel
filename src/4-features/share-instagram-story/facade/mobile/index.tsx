"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Sheet } from "@/src/6-shared/ui/bottom-sheet";

export type Props = {
  children: ReactNode;
  onClose: () => void;
};

export function MobileShareInstagramStory({ children, onClose }: Props) {
  const t = useTranslations("InstagramStoryDialog");

  return (
    <Sheet
      open
      onClose={onClose}
      title={t("sheet.title")}
      closeLabel={t("modal.closeLabel")}
      icon={null}
    >
      {children}
    </Sheet>
  );
}
