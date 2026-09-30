"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Sheet } from "@/src/6-shared/ui/bottom-sheet/BottomSheet";

export type DonationDialogProps = {
  children: ReactNode;
  onClose: () => void;
};

export function MobileDonationDialog({
  children,
  onClose,
}: DonationDialogProps) {
  const t = useTranslations("DonationForm");

  return (
    <Sheet
      open
      onClose={onClose}
      title={t("sheet.title")}
      closeLabel={t("sheet.close")}
      icon={null}
    >
      {children}
    </Sheet>
  );
}