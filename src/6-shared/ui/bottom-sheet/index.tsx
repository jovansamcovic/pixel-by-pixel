
"use client";

import { type CSSProperties, type ReactNode, useEffect } from "react";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  icon: ReactNode;
  children: ReactNode;
};

const mobilePixelClip: CSSProperties = {
  clipPath: `polygon(
    0 4px,
    4px 4px,
    4px 0,
    calc(100% - 4px) 0,
    calc(100% - 4px) 4px,
    100% 4px,
    100% 100%,
    0 100%
  )`,
};

const desktopPixelClip: CSSProperties = {
  clipPath: `polygon(
    0 4px,
    4px 4px,
    4px 0,
    calc(100% - 4px) 0,
    calc(100% - 4px) 4px,
    100% 4px,
    100% calc(100% - 4px),
    calc(100% - 4px) calc(100% - 4px),
    calc(100% - 4px) 100%,
    4px 100%,
    4px calc(100% - 4px),
    0 calc(100% - 4px)
  )`,
};

export function Sheet({
  open,
  onClose,
  title,
  closeLabel,
  icon,
  children,
}: SheetProps) {
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

      {/* Diskretan pixel-art okvir */}
      <div
        className={[
          "relative w-full max-w-[560px]",
          "bg-[#0D2734]/35 p-[2px]",
          "md:[clip-path:polygon(0_4px,4px_4px,4px_0,calc(100%_-_4px)_0,calc(100%_-_4px)_4px,100%_4px,100%_calc(100%_-_4px),calc(100%_-_4px)_calc(100%_-_4px),calc(100%_-_4px)_100%,4px_100%,4px_calc(100%_-_4px),0_calc(100%_-_4px))]",
        ].join(" ")}
        style={mobilePixelClip}
      >
        <div
          className={[
            "flex max-h-[88vh] flex-col",
            "bg-[#FFF6EB]",
            "pb-[env(safe-area-inset-bottom)]",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="flex justify-center pt-3 md:hidden"
          >
            <span className="h-1 w-14 bg-[#0D2734]/20" />
          </div>

          <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
            <div className="flex min-w-0 items-center gap-3">
              {icon}

              <h2 className="text-[18px] uppercase leading-none text-[#0D2734]">
                {title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className={[
                "grid size-9 shrink-0 place-items-center",
                "text-[#0D2734]/55",
                "transition-colors",
                "hover:text-[#0D2734]",
                "active:translate-y-[1px]",
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[#E52336]",
              ].join(" ")}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <div className="mx-5 h-[2px] bg-[#0D2734]/20" />

          <div className="overflow-y-auto px-5 pb-6 pt-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
