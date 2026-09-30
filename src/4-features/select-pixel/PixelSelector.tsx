"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useTranslations } from "next-intl";

import {
  HEART_COLUMNS,
  HEART_RENDER_ROWS,
  PixelHeart,
} from "@/src/5-entities/heart-pixel/PixelHeart";

type PixelSelectorProps = {
  selectedPixel: number | null;
  purchasedPixels: Record<number, string>;
  onSelect: (pixelId: number) => void;
  onRandomSelect: () => void;
};

type Point = {
  x: number;
  y: number;
};

type GestureState = {
  distance: number;
  scale: number;
  midpoint: Point;
  pan: Point;
};

const MIN_SCALE = 1;
const MAX_SCALE = 10;
const ZOOM_STEP = 1.5;
const MIN_VIEWPORT_HEIGHT = 0;
const HEART_VERTICAL_PADDING = 8;
const HEART_HORIZONTAL_PADDING = 8;
const MIN_HEART_WIDTH = 290;
const MAX_HEART_WIDTH = 720;
const SELECTION_BLOCK_DURATION = 300;

const clampScale = (value: number) =>
  Math.min(Math.max(value, MIN_SCALE), MAX_SCALE);

const getDistance = (first: Point, second: Point) =>
  Math.hypot(second.x - first.x, second.y - first.y);

const getMidpoint = (first: Point, second: Point): Point => ({
  x: (first.x + second.x) / 2,
  y: (first.y + second.y) / 2,
});

const toolButton = [
  "grid size-9 place-items-center",
  "border border-[#0D2734]/25 bg-[#FFF6EB]/90 text-[#0D2734] backdrop-blur-sm",
  "transition hover:border-[#0D2734]/60 hover:bg-[#FFF6EB]",
  "active:translate-y-[1px]",
  "disabled:pointer-events-none disabled:opacity-30",
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]",
].join(" ");

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

export function PixelSelector({
  selectedPixel,
  purchasedPixels,
  onSelect,
  onRandomSelect,
}: PixelSelectorProps) {
  const t = useTranslations("PixelSelector");

  const [scale, setScale] = useState(MIN_SCALE);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [baseWidth, setBaseWidth] = useState(320);
  const [isPinching, setIsPinching] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activePointers = useRef(new Map<number, Point>());
  const gesture = useRef<GestureState | null>(null);
  const blockSelectionUntil = useRef(0);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const updateWidth = () => {
      setBaseWidth(
        Math.min(
          Math.max(
            viewport.clientWidth - HEART_HORIZONTAL_PADDING,
            MIN_HEART_WIDTH,
          ),
          MAX_HEART_WIDTH,
        ),
      );
    };

    const initialFrame = window.requestAnimationFrame(updateWidth);
    const observer = new ResizeObserver(updateWidth);

    observer.observe(viewport);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      observer.disconnect();
    };
  }, []);

  const resetZoom = () => {
    setScale(MIN_SCALE);
    setPan({ x: 0, y: 0 });
    setIsPinching(false);
    activePointers.current.clear();
    gesture.current = null;
  };

  // Zum dugmadima (+ / −), oko centra srca
  const zoomBy = (factor: number) => {
    const next = clampScale(scale * factor);

    if (next === scale) {
      return;
    }

    if (next === MIN_SCALE) {
      setPan({ x: 0, y: 0 });
    } else {
      const ratio = next / scale;
      setPan((current) => ({ x: current.x * ratio, y: current.y * ratio }));
    }

    setScale(next);
  };

  const startGesture = () => {
    const points = Array.from(activePointers.current.values());

    if (points.length !== 2) {
      return;
    }

    setIsPinching(true);
    blockSelectionUntil.current =
      performance.now() + SELECTION_BLOCK_DURATION;

    gesture.current = {
      distance: getDistance(points[0], points[1]),
      midpoint: getMidpoint(points[0], points[1]),
      scale,
      pan,
    };
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType !== "touch") {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    activePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (activePointers.current.size === 2) {
      startGesture();
    }
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType !== "touch" ||
      !activePointers.current.has(event.pointerId)
    ) {
      return;
    }

    activePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const points = Array.from(activePointers.current.values());

    // Jedan prst ostaje slobodan za normalno skrolovanje stranice.
    // Presreću se samo gestovi sa dva prsta.
    if (points.length !== 2 || !gesture.current) {
      return;
    }

    event.preventDefault();

    blockSelectionUntil.current =
      performance.now() + SELECTION_BLOCK_DURATION;

    const currentDistance = getDistance(points[0], points[1]);
    const currentMidpoint = getMidpoint(points[0], points[1]);

    const nextScale = clampScale(
      gesture.current.scale *
        (currentDistance / gesture.current.distance),
    );

    setScale(nextScale);

    setPan({
      x:
        gesture.current.pan.x +
        currentMidpoint.x -
        gesture.current.midpoint.x,
      y:
        gesture.current.pan.y +
        currentMidpoint.y -
        gesture.current.midpoint.y,
    });
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    activePointers.current.delete(event.pointerId);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (activePointers.current.size < 2 && gesture.current) {
      gesture.current = null;
      setIsPinching(false);

      blockSelectionUntil.current =
        performance.now() + SELECTION_BLOCK_DURATION;
    }
  };

  const handlePixelSelect = (pixelId: number) => {
    const selectionBlocked =
      isPinching ||
      performance.now() < blockSelectionUntil.current;

    if (selectionBlocked) {
      return;
    }

    onSelect(pixelId);
  };

  const renderedWidth = baseWidth * scale;
  const heartHeight =
    baseWidth * (HEART_RENDER_ROWS / HEART_COLUMNS);

  const viewportHeight = Math.max(
    heartHeight + HEART_VERTICAL_PADDING * 2,
    MIN_VIEWPORT_HEIGHT,
  );

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="relative flex w-full touch-pan-y items-center justify-center overflow-hidden bg-transparent"
        style={{ height: `${viewportHeight}px` }}
      >
        <div
          className={[
            "relative flex shrink-0 items-center justify-center",
            isPinching
              ? "transition-none"
              : "transition-transform duration-150",
          ].join(" ")}
          style={{
            width: `${renderedWidth}px`,
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`,
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

        {/* Diskretne zum alatke u uglu srca */}
        <div className="absolute right-2 top-2 z-10 flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={() => zoomBy(ZOOM_STEP)}
            disabled={scale >= MAX_SCALE}
            aria-label={t("controls.zoomIn")}
            className={toolButton}
          >
            <ZoomIcon type="plus" />
          </button>

          <button
            type="button"
            onClick={() => zoomBy(1 / ZOOM_STEP)}
            disabled={scale <= MIN_SCALE}
            aria-label={t("controls.zoomOut")}
            className={toolButton}
          >
            <ZoomIcon type="minus" />
          </button>

          {scale > MIN_SCALE && (
            <button
              type="button"
              onClick={resetZoom}
              aria-label={t("controls.resetAriaLabel")}
              className="bg-[#FFF6EB]/90 px-2 py-1 text-[11px] uppercase leading-none text-[#0D2734]/70 transition hover:text-[#0D2734]"
            >
              {Math.round(scale * 100)}% · {t("controls.reset")}
            </button>
          )}
        </div>
      </div>

      {/* Nasumičan piksel + napomena o zumu */}
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={onRandomSelect}
          aria-label={t("randomAriaLabel")}
          className="inline-flex items-center gap-2 text-[13px] uppercase leading-none tracking-[0.04em] text-[#E52336] underline decoration-2 underline-offset-4 transition hover:text-[#B5111F]"
        >
          <span aria-hidden="true">◆</span>
          {t("randomSelect")}
        </button>

        <p className="text-center text-[11px] leading-none text-[#0D2734]/55">
          {t("zoomHint")}
        </p>
      </div>
    </div>
  );
}