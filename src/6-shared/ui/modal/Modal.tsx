"use client";

import type { MouseEvent, ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  labelledBy: string;
  closeLabel: string;
  overlayClassName: string;
  dialogClassName: string;
  onClose: () => void;
  closeButtonClassName?: string;
};

export function Modal({
  children,
  labelledBy,
  closeLabel,
  overlayClassName,
  dialogClassName,
  onClose,
  closeButtonClassName = "",
}: ModalProps) {
  const stopPropagation = (event: MouseEvent<HTMLElement>) => event.stopPropagation();

  return (
    <div className={overlayClassName} role="presentation" onMouseDown={onClose}>
      <section
        className={dialogClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={stopPropagation}
      >
        <button
          className={`modal-close ${closeButtonClassName}`.trim()}
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
        >
          ×
        </button>
        {children}
      </section>
    </div>
  );
}
