"use client";

import { type ReactNode, useEffect } from "react";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  icon: ReactNode;
  children: ReactNode;
};

export function Sheet({
  open,
  onClose,
  title,
  closeLabel,
  icon,
  children,
}: SheetProps) {
  // Esc zatvara, a pozadinski skrol se zaključava dok je sheet otvoren
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center md:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#0D2734]/60"
      />

      <div
        className={[
          "relative flex max-h-[88vh] w-full max-w-[560px] flex-col",
          "rounded-t-[28px] bg-[#FFF6EB] md:rounded-[20px]",
          "pb-[env(safe-area-inset-bottom)]",
        ].join(" ")}
      >
        <div aria-hidden="true" className="flex justify-center pt-3 md:hidden">
          <span className="h-1 w-14 rounded-full bg-[#0D2734]/30" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-[18px] uppercase leading-none text-[#0D2734]">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid size-9 place-items-center text-[#0D2734] transition active:translate-y-[1px]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="square"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <div className="mx-5 h-[3px] bg-[#0D2734]/80" />

        <div className="overflow-y-auto px-5 pb-6 pt-5">{children}</div>
      </div>
    </div>
  );
}