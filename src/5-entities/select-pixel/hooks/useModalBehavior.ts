import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

export function useModalBehavior(
  onClose: () => void,
  initialFocusRef: RefObject<HTMLElement | null>,
) {
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousOverscroll = documentElement.style.overscrollBehavior;
    const previousFocus = document.activeElement as HTMLElement | null;

    body.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";
    initialFocusRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      documentElement.style.overscrollBehavior = previousOverscroll;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [initialFocusRef]);
}
