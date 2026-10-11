
import type { Ref } from "react";
import { useTranslations } from "next-intl";

type PickerCloseButtonProps = {
  onClose: () => void;
  buttonRef: Ref<HTMLButtonElement>;
};

export function PickerCloseButton({
  onClose,
  buttonRef,
}: PickerCloseButtonProps) {
  const t = useTranslations("PixelSelector");

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClose}
      aria-label={t("picker.close")}
      className={[
        "group flex h-9 shrink-0 items-center gap-1.5",
        "border-0 bg-transparent px-1",
        "text-[#0D2734]/55",
        "transition-colors duration-150",
        "hover:text-[#0D2734]",
        "active:-translate-x-[2px]",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#E52336]",
      ].join(" ")}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
      >
        <path d="M7 3L2 8L7 13" />
        <path d="M2 8H14" />
      </svg>

      <span className="text-[10px] uppercase tracking-[0.04em]">
        {t("picker.back")}
      </span>
    </button>
  );
}
