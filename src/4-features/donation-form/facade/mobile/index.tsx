"use client";

import { Sheet } from "@/src/6-shared/ui/bottom-sheet/BottomSheet";
import type { ReactNode } from "react";

export type DonationDialogProps = {
  children: ReactNode;
  onClose: () => void;
};

export function MobileDonationDialog({
  children,
  onClose,
}: DonationDialogProps) {
  return (
    <Sheet
      onClose={onClose}
      closeLabel="Close"
      open={false}
      title={""}
      icon={undefined}
    >
      <div className="px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </Sheet>
  );
}
