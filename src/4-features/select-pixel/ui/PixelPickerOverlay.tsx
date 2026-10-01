"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import {
  HEART_COLUMNS,
  HEART_RENDER_ROWS,
  HEART_PIXELS,
  PixelHeart,
  getPixelTargetColor,
} from "@/src/5-entities/heart-pixel/PixelHeart";

type Point = { x: number; y: number };
type View = { scale: number; pan: Point };

type PixelPickerOverlayProps = {
  selectedPixel: number | null;
  purchasedPixels: Record<number, string>;
  formattedPrice: string;
  onSelect: (pixelId: number) => void;
  onRandomSelect: () => void;
  onCheckout: () => void;
  onClose: () => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 10;
const ZOOM_STEP = 1.5;
/** Razmak srca od ivica kad je zum 100% */
const VIEW_PADDING = 12;
/** Koliko srce sme da izađe van ivice pri pomeranju */
const PAN_OVERSCROLL = 48;
/** Pomeraj u px posle kog tap postaje prevlačenje */
const DRAG_THRESHOLD = 6;
const SELECTION_BLOCK_DURATION = 250;
const MINIMAP_WIDTH = 72;

/** Pozicija piksela u mreži srca; broj piksela = id + 1 */
function getPixelGridPosition(pixelId: number): Point | null {
  const pixel = HEART_PIXELS[pixelId - 1];
  return pixel ? { x: pixel.col, y: pixel.row } : null;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getDistance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

const getMidpoint = (a: Point, b: Point): Point => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

export const toolButton = [
  "grid size-9 place-items-center",
  "border border-[#0D2734]/25 bg-[#FFF6EB]/90 text-[#0D2734] backdrop-blur-sm",
  "transition hover:border-[#0D2734]/60 hover:bg-[#FFF6EB]",
  "active:translate-y-[1px]",
  "disabled:pointer-events-none disabled:opacity-30",
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]",
].join(" ");

const NOTCH = "6px";
const pixelClip: CSSProperties = {
  clipPath: `polygon(
    0 ${NOTCH}, ${NOTCH} ${NOTCH}, ${NOTCH} 0,
    calc(100% - ${NOTCH}) 0, calc(100% - ${NOTCH}) ${NOTCH}, 100% ${NOTCH},
    100% calc(100% - ${NOTCH}), calc(100% - ${NOTCH}) calc(100% - ${NOTCH}),
    calc(100% - ${NOTCH}) 100%, ${NOTCH} 100%, ${NOTCH} calc(100% - ${NOTCH}),
    0 calc(100% - ${NOTCH})
  )`,
};

function ZoomIcon({ type }: { type: "plus" | "minus" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className="size-4"
      fill="currentColor"
    >
      <rect x="2" y="5" width="8" height="2" />
      {type === "plus" && <rect x="5" y="2" width="2" height="8" />}
    </svg>
  );
}

/** Dve pixel-art kockice: simbol nasumičnog izbora */
function DiceIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 22 18"
      shapeRendering="crispEdges"
      className="h-[22px] w-[27px]"
    >
      {/* Leva kockica: tri tačke */}
      <rect x="1" y="7" width="10" height="10" fill="#FFFFFF" />
      <path
        fill="currentColor"
        d="M1 7h10v1H1zM1 16h10v1H1zM1 7h1v10H1zM10 7h1v10h-1z"
      />
      <rect x="3" y="9" width="2" height="2" fill="#E52336" />
      <rect x="5" y="11" width="2" height="2" fill="#E52336" />
      <rect x="7" y="13" width="2" height="2" fill="#E52336" />

      {/* Desna kockica: četiri tačke */}
      <rect x="11" y="1" width="10" height="10" fill="#FFFFFF" />
      <path
        fill="currentColor"
        d="M11 1h10v1H11zM11 10h10v1H11zM11 1h1v10h-1zM20 1h1v10h-1z"
      />
      <rect x="13" y="3" width="2" height="2" fill="#E52336" />
      <rect x="17" y="3" width="2" height="2" fill="#E52336" />
      <rect x="13" y="7" width="2" height="2" fill="#E52336" />
      <rect x="17" y="7" width="2" height="2" fill="#E52336" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className="size-4"
      fill="currentColor"
    >
      <rect x="2" y="2" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="6" y="6" width="2" height="2" />
      <rect x="8" y="8" width="2" height="2" />
      <rect x="8" y="2" width="2" height="2" />
      <rect x="6" y="4" width="2" height="2" />
      <rect x="4" y="6" width="2" height="2" />
      <rect x="2" y="8" width="2" height="2" />
    </svg>
  );
}

export function PixelPickerOverlay({
  selectedPixel,
  purchasedPixels,
  formattedPrice,
  onSelect,
  onRandomSelect,
  onCheckout,
  onClose,
}: PixelPickerOverlayProps) {
  const t = useTranslations("PixelSelector");

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [view, setViewState] = useState<View>({
    scale: MIN_SCALE,
    pan: { x: 0, y: 0 },
  });
  // Glatka animacija samo za +/− dugmad; prsti i točkić idu bez kašnjenja
  const [smooth, setSmooth] = useState(false);

  const viewRef = useRef(view);
  const metrics = useRef({ width: 0, height: 0, baseWidth: 0, baseHeight: 0 });
  const onCloseRef = useRef(onClose);

  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ distance: number; midpoint: Point; view: View } | null>(
    null,
  );
  const drag = useRef<{ start: Point; pan: Point; active: boolean } | null>(
    null,
  );
  const blockSelectionUntil = useRef(0);
  // Posle nasumičnog izbora pomeri pogled na novi piksel
  const centerOnNextSelection = useRef(false);

  // Srce staje celo u ekran kad je zum 100%
  const baseWidth =
    size.width > 0
      ? Math.max(
          Math.min(
            size.width - VIEW_PADDING * 2,
            ((size.height - VIEW_PADDING * 2) * HEART_COLUMNS) /
              HEART_RENDER_ROWS,
          ),
          200,
        )
      : 0;
  const baseHeight = (baseWidth * HEART_RENDER_ROWS) / HEART_COLUMNS;

  useLayoutEffect(() => {
    metrics.current = {
      width: size.width,
      height: size.height,
      baseWidth,
      baseHeight,
    };
    onCloseRef.current = onClose;
  });

  const setView = useCallback((next: View) => {
    const { width, height, baseWidth, baseHeight } = metrics.current;
    const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE);

    if (scale === MIN_SCALE) {
      const reset = { scale, pan: { x: 0, y: 0 } };
      viewRef.current = reset;
      setViewState(reset);
      return;
    }

    // Srce ne može da "pobegne" van ekrana
    const maxX = Math.max(0, (baseWidth * scale - width) / 2 + PAN_OVERSCROLL);
    const maxY = Math.max(0, (baseHeight * scale - height) / 2 + PAN_OVERSCROLL);

    const clamped = {
      scale,
      pan: {
        x: clamp(next.pan.x, -maxX, maxX),
        y: clamp(next.pan.y, -maxY, maxY),
      },
    };

    viewRef.current = clamped;
    setViewState(clamped);
  }, []);

  /** Klijentske koordinate → koordinate u odnosu na centar viewporta */
  const toLocal = useCallback((point: Point): Point => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: point.x - rect.left - rect.width / 2,
      y: point.y - rect.top - rect.height / 2,
    };
  }, []);

  /** Zum oko zadate tačke (u lokalnim koordinatama), tačka ostaje ispod prsta/kursora */
  const zoomAt = useCallback(
    (factor: number, origin: Point = { x: 0, y: 0 }) => {
      const current = viewRef.current;
      const scale = clamp(current.scale * factor, MIN_SCALE, MAX_SCALE);
      if (scale === current.scale) return;

      const ratio = scale / current.scale;
      setView({
        scale,
        pan: {
          x: origin.x - (origin.x - current.pan.x) * ratio,
          y: origin.y - (origin.y - current.pan.y) * ratio,
        },
      });
    },
    [setView],
  );

  const blockSelection = () => {
    blockSelectionUntil.current = performance.now() + SELECTION_BLOCK_DURATION;
  };

  // Veličina viewporta
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const update = () =>
      setSize({ width: viewport.clientWidth, height: viewport.clientHeight });

    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  // Posle promene veličine (rotacija telefona) ponovo ograniči pomeraj
  useEffect(() => {
    setView(viewRef.current);
  }, [size, setView]);

  // Točkić / pinch na trackpadu. Mora native listener sa passive: false,
  // jer je React-ov onWheel pasivan i preventDefault se ignoriše.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      setSmooth(false);

      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      // ctrlKey = pinch gest na trackpadu (daje male vrednosti)
      const intensity = event.ctrlKey ? 0.01 : 0.002;

      zoomAt(
        Math.exp(-delta * intensity),
        toLocal({ x: event.clientX, y: event.clientY }),
      );
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [zoomAt, toLocal]);

  // Zaključavanje skrola strane, Escape i fokus
  useEffect(() => {
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousOverscroll = documentElement.style.overscrollBehavior;
    const previousFocus = document.activeElement as HTMLElement | null;

    body.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";
    closeButtonRef.current?.focus();

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
  }, []);

  const startPinch = () => {
    const [a, b] = Array.from(pointers.current.values());
    if (!a || !b) return;

    pinch.current = {
      distance: getDistance(a, b) || 1,
      midpoint: toLocal(getMidpoint(a, b)),
      view: viewRef.current,
    };
    drag.current = null;
    blockSelection();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    setSmooth(false);
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    if (pointers.current.size === 1) {
      drag.current = { start: point, pan: viewRef.current.pan, active: false };
    } else if (pointers.current.size === 2) {
      startPinch();
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;

    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    // Dva prsta: zum oko sredine prstiju + pomeranje
    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = Array.from(pointers.current.values());
      const gesture = pinch.current;

      const scale = clamp(
        gesture.view.scale * (getDistance(a, b) / gesture.distance),
        MIN_SCALE,
        MAX_SCALE,
      );
      const midpoint = toLocal(getMidpoint(a, b));
      const anchorX = (gesture.midpoint.x - gesture.view.pan.x) / gesture.view.scale;
      const anchorY = (gesture.midpoint.y - gesture.view.pan.y) / gesture.view.scale;

      setView({
        scale,
        pan: { x: midpoint.x - anchorX * scale, y: midpoint.y - anchorY * scale },
      });
      blockSelection();
      return;
    }

    // Jedan prst / miš: pomeranje srca
    const current = drag.current;
    if (!current) return;

    const dx = point.x - current.start.x;
    const dy = point.y - current.start.y;

    if (!current.active) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      current.active = true;
      // Dodir je već implicitno "uhvaćen"; mišu treba capture da prevlačenje
      // radi i kad kursor izađe iz okvira.
      if (event.pointerType === "mouse") {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    blockSelection();
    setView({
      scale: viewRef.current.scale,
      pan: { x: current.pan.x + dx, y: current.pan.y + dy },
    });
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.delete(event.pointerId)) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (pinch.current && pointers.current.size === 1) {
      // Iz pinch-a u pomeranje jednim prstom, bez skoka
      pinch.current = null;
      const [remaining] = Array.from(pointers.current.values());
      drag.current = { start: remaining, pan: viewRef.current.pan, active: true };
      blockSelection();
      return;
    }

    if (pointers.current.size === 0) {
      if (pinch.current || drag.current?.active) blockSelection();
      pinch.current = null;
      drag.current = null;
    }
  };

  const handlePixelSelect = (pixelId: number) => {
    if (performance.now() < blockSelectionUntil.current) return;
    onSelect(pixelId);
  };

  const handleRandomSelect = () => {
    centerOnNextSelection.current = true;
    onRandomSelect();
  };

  // Kad je srce zumirano, nasumično izabrani piksel dolazi u centar ekrana
  useEffect(() => {
    if (!centerOnNextSelection.current || selectedPixel === null) return;
    centerOnNextSelection.current = false;

    const current = viewRef.current;
    if (current.scale <= MIN_SCALE) return;

    const position = getPixelGridPosition(selectedPixel);
    if (!position) return;

    const { baseWidth, baseHeight } = metrics.current;
    const width = baseWidth * current.scale;
    const height = baseHeight * current.scale;

    setSmooth(true);
    setView({
      scale: current.scale,
      pan: {
        x: -((position.x + 0.5) / HEART_COLUMNS - 0.5) * width,
        y: -((position.y + 0.5) / HEART_RENDER_ROWS - 0.5) * height,
      },
    });
  }, [selectedPixel, setView]);

  const zoomWithButton = (factor: number) => {
    setSmooth(true);
    zoomAt(factor);
  };

  const resetZoom = () => {
    setSmooth(true);
    setView({ scale: MIN_SCALE, pan: { x: 0, y: 0 } });
  };

  // Vidljivi deo srca za mini mapu (0–1)
  const contentWidth = baseWidth * view.scale;
  const contentHeight = baseHeight * view.scale;
  const minimapFrame =
    contentWidth > 0 && view.scale > MIN_SCALE
      ? (() => {
          const left = clamp((contentWidth / 2 - size.width / 2 - view.pan.x) / contentWidth, 0, 1);
          const right = clamp((contentWidth / 2 + size.width / 2 - view.pan.x) / contentWidth, 0, 1);
          const top = clamp((contentHeight / 2 - size.height / 2 - view.pan.y) / contentHeight, 0, 1);
          const bottom = clamp((contentHeight / 2 + size.height / 2 - view.pan.y) / contentHeight, 0, 1);
          return { left, top, width: right - left, height: bottom - top };
        })()
      : null;

  const hasSelection = selectedPixel !== null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("picker.title")}
      className="fixed inset-0 z-[1000] flex touch-none select-none flex-col overscroll-none bg-[#FFF6EB] text-[#0D2734]"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Zaglavlje */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#0D2734]/15 px-3">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={t("picker.close")}
          className={toolButton}
        >
          <CloseIcon />
        </button>

        <p className="text-[13px] uppercase tracking-[0.04em]">
          {t("picker.title")}
        </p>

        <span className="w-9 text-right text-[11px] tabular-nums text-[#0D2734]/60">
          {Math.round(view.scale * 100)}%
        </span>
      </header>

      {/* Srce: svi gestovi ovde pripadaju srcu, ne strani */}
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className={[
          "relative flex min-h-0 flex-1 items-center justify-center overflow-hidden",
          view.scale > MIN_SCALE ? "cursor-grab active:cursor-grabbing" : "",
        ].join(" ")}
      >
        {baseWidth > 0 && (
          <div
            className={[
              "relative shrink-0",
              smooth
                ? "transition-[width,transform] duration-300 ease-out"
                : "transition-none",
            ].join(" ")}
            style={{
              width: `${contentWidth}px`,
              transform: `translate3d(${view.pan.x}px, ${view.pan.y}px, 0)`,
              willChange: "transform, width",
            }}
          >
            <PixelHeart
              interactive
              selectedPixel={selectedPixel}
              purchasedPixels={purchasedPixels}
              onSelect={handlePixelSelect}
              className="!max-w-none"
            />
          </div>
        )}

        {/* Zum alatke */}
        <div
          className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => zoomWithButton(ZOOM_STEP)}
            disabled={view.scale >= MAX_SCALE}
            aria-label={t("controls.zoomIn")}
            className={toolButton}
          >
            <ZoomIcon type="plus" />
          </button>
          <button
            type="button"
            onClick={() => zoomWithButton(1 / ZOOM_STEP)}
            disabled={view.scale <= MIN_SCALE}
            aria-label={t("controls.zoomOut")}
            className={toolButton}
          >
            <ZoomIcon type="minus" />
          </button>
          {view.scale > MIN_SCALE && (
            <button
              type="button"
              onClick={resetZoom}
              aria-label={t("controls.resetAriaLabel")}
              className="bg-[#FFF6EB]/90 px-2 py-1 text-[11px] uppercase leading-none text-[#0D2734]/70 transition hover:text-[#0D2734]"
            >
              {t("controls.reset")}
            </button>
          )}
        </div>

        {/* Mini mapa: gde sam u srcu */}
        {minimapFrame && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-3 z-10 border border-[#0D2734]/25 bg-[#FFF6EB]/90 p-1"
            style={{ width: MINIMAP_WIDTH }}
          >
            <div className="relative">
              <PixelHeart
                selectedPixel={selectedPixel}
                purchasedPixels={purchasedPixels}
                showSelectionMarker={false}
                className="!max-w-none"
              />
              <div
                className="absolute border-2 border-[#E52336]"
                style={{
                  left: `${minimapFrame.left * 100}%`,
                  top: `${minimapFrame.top * 100}%`,
                  width: `${minimapFrame.width * 100}%`,
                  height: `${minimapFrame.height * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Uputstvo dok nije zumirano */}
        {view.scale === MIN_SCALE && (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] leading-none text-[#0D2734]/55">
            {t("picker.hint")}
          </p>
        )}
      </div>

      {/* Donja traka: izbor + kupovina, na dohvat palca */}
      <footer className="shrink-0 border-t border-[#0D2734]/15 px-4 pb-4 pt-3">
        {/* Izabrani piksel: njegova boja + broj */}
        <div
          aria-live="polite"
          className="mb-2.5 flex h-7 items-center justify-center gap-2.5 text-[#0D2734]"
        >
          {hasSelection ? (
            <>
              <span
                aria-hidden="true"
                className="size-7 border-2 border-[#0D2734] shadow-[inset_0_0_0_2px_#FFF6EB]"
                style={{ backgroundColor: getPixelTargetColor(selectedPixel) }}
              />
              <span className="text-[18px] leading-none tabular-nums tracking-[0.02em]">
                #{selectedPixel}
              </span>
              <span className="sr-only">
                {t("picker.selected", { id: selectedPixel })}
              </span>
            </>
          ) : (
            <span className="text-[12px] uppercase tracking-[0.04em] text-[#0D2734]/70">
              {t("picker.empty")}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRandomSelect}
            aria-label={t("randomAriaLabel")}
            style={pixelClip}
            className="group w-[68px] shrink-0 bg-[#0D2734] p-[3px] transition active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
          >
            <span
              style={pixelClip}
              className="flex h-full min-h-[50px] items-center justify-center bg-[#FFF6EB] shadow-[inset_0_4px_0_#FFFFFF,inset_0_-5px_0_#E6D5BF] transition group-hover:bg-[#FFFBF5]"
            >
              <DiceIcon />
            </span>
          </button>

          <button
            type="button"
            onClick={onCheckout}
            disabled={!hasSelection}
            style={pixelClip}
            className="group flex-1 bg-[#0D2734] p-[3px] transition active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]"
          >
            <span
              style={pixelClip}
              className="flex min-h-[50px] flex-col items-center justify-center bg-[#E8172B] px-4 uppercase text-white shadow-[inset_0_4px_0_#FF5564,inset_0_-5px_0_#B5111F] transition group-hover:bg-[#F0202F]"
            >
              <span className="text-[18px] leading-none tracking-[0.03em]">
                {t("picker.buy")}
              </span>
              <span className="mt-1 text-[11px] leading-none">
                — {formattedPrice} —
              </span>
            </span>
          </button>
        </div>
      </footer>
    </div>,
    document.body,
  );
}