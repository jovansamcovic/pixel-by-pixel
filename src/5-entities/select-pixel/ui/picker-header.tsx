
import type { Ref } from "react";
import { useTranslations } from "next-intl";

import { PickerCloseButton } from "./picker-close-button";

type PickerHeaderProps = {
  onClose: () => void;
  closeButtonRef: Ref<HTMLButtonElement>;
  scale: number;
};

export function PickerHeader({
  onClose,
  closeButtonRef,
  scale,
}: PickerHeaderProps) {
  const t = useTranslations("PixelSelector");

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-[#0D2734]/15 px-3">
      <PickerCloseButton
        onClose={onClose}
        buttonRef={closeButtonRef}
      />

      <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] uppercase tracking-[0.04em] text-[#0D2734]">
        {t("picker.title")}
      </p>

      <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-[#0D2734]/60">
        {Math.round(scale * 100)}%
      </span>
    </header>
  );
}
