"use client";

import type { ReactNode } from "react";

import { Modal } from "@/src/6-shared/ui/modal/Modal";

export type DonationDialogProps = {
  children: ReactNode;
  onClose: () => void;
};

export function DesktopDonationDialog({
  children,
  onClose,
}: DonationDialogProps) {
  return (
    <Modal
      labelledBy="donation-dialog-title"
      closeLabel="Close"
      onClose={onClose}
      overlayClassName={[
        "fixed inset-0 z-[100]",
        "flex items-center justify-center",
        "bg-[#0D2734]/75",
        "p-5",
        "backdrop-blur-sm",
      ].join(" ")}
      dialogClassName={[
        "relative",
        "w-full max-w-[560px]",
        "max-h-[90dvh]",
        "overflow-y-auto",
        "rounded-[30px]",
        "bg-white",
        "px-6 py-6",
        "shadow-[0_20px_60px_rgba(13,39,52,0.22)]",
      ].join(" ")}
      closeButtonClassName={[
        "absolute right-4 top-4 z-10",
        "flex h-11 w-11 items-center justify-center",
        "rounded-full",
        "border border-[#0D2734]/10",
        "bg-white",
        "text-xl text-[#0D2734]",
        "shadow-sm",
        "transition",
        "hover:bg-[#D6384B]",
        "hover:text-white",
      ].join(" ")}
    >
      {children}
    </Modal>
  );
}