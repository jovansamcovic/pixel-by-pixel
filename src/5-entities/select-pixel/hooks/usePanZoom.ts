import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  clamp,
  getDistance,
  getMidpoint,
  type Point,
  type Size,
  type View,
} from "../helpers";

export const MIN_SCALE = 1;
export const MAX_SCALE = 10;
export const ZOOM_STEP = 1.5;
/** Razmak sadržaja od ivica kad je zum 100% */
const VIEW_PADDING = 12;
/** Koliko sadržaj sme da izađe van ivice pri pomeranju */
const PAN_OVERSCROLL = 48;
/** Pomeraj u px posle kog tap postaje prevlačenje */
const DRAG_THRESHOLD = 6;
const SELECTION_BLOCK_DURATION = 250;
const MIN_BASE_WIDTH = 200;

const INITIAL_VIEW: View = { scale: MIN_SCALE, pan: { x: 0, y: 0 } };

type PinchState = { distance: number; midpoint: Point; view: View };
type DragState = { start: Point; pan: Point; active: boolean };

/**
 * Zum i pomeranje sadržaja zadatog odnosa stranica (columns × rows):
 * točkić, pinch na trackpadu, dva prsta, prevlačenje i dugmad.
 */
export function usePanZoom(columns: number, rows: number) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [view, setViewState] = useState<View>(INITIAL_VIEW);
  // Glatka animacija samo za dugmad; prsti i točkić idu bez kašnjenja
  const [smooth, setSmooth] = useState(false);

  const viewRef = useRef(view);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<PinchState | null>(null);
  const drag = useRef<DragState | null>(null);
  const blockSelectionUntil = useRef(0);

  // Sadržaj staje ceo u ekran kad je zum 100%
  const baseWidth =
    size.width > 0
      ? Math.max(
          Math.min(
            size.width - VIEW_PADDING * 2,
            ((size.height - VIEW_PADDING * 2) * columns) / rows,
          ),
          MIN_BASE_WIDTH,
        )
      : 0;
  const baseHeight = (baseWidth * rows) / columns;

  const metrics = useRef({ ...size, baseWidth, baseHeight });
  useLayoutEffect(() => {
    metrics.current = { ...size, baseWidth, baseHeight };
  });

  const setView = useCallback((next: View) => {
    const { width, height, baseWidth, baseHeight } = metrics.current;
    const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE);

    let clamped: View;
    if (scale === MIN_SCALE) {
      clamped = INITIAL_VIEW;
    } else {
      // Sadržaj ne može da "pobegne" van ekrana
      const maxX = Math.max(0, (baseWidth * scale - width) / 2 + PAN_OVERSCROLL);
      const maxY = Math.max(0, (baseHeight * scale - height) / 2 + PAN_OVERSCROLL);
      clamped = {
        scale,
        pan: {
          x: clamp(next.pan.x, -maxX, maxX),
          y: clamp(next.pan.y, -maxY, maxY),
        },
      };
    }

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

  /** Zum oko tačke (lokalne koordinate); tačka ostaje ispod prsta/kursora */
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

  /** Da li je tap upravo bio deo gesta (pa ne treba da bira piksel) */
  const isSelectionBlocked = useCallback(
    () => performance.now() < blockSelectionUntil.current,
    [],
  );

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

  const getTwoPointers = () => {
    const [a, b] = Array.from(pointers.current.values());
    return a && b ? ([a, b] as const) : null;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    setSmooth(false);
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    if (pointers.current.size === 1) {
      drag.current = { start: point, pan: viewRef.current.pan, active: false };
      return;
    }

    const pair = getTwoPointers();
    if (pointers.current.size === 2 && pair) {
      pinch.current = {
        distance: getDistance(...pair) || 1,
        midpoint: toLocal(getMidpoint(...pair)),
        view: viewRef.current,
      };
      drag.current = null;
      blockSelection();
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;

    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    // Dva prsta: zum oko sredine prstiju + pomeranje
    const pair = getTwoPointers();
    if (pinch.current && pair) {
      const { view: start, distance, midpoint: startMidpoint } = pinch.current;
      const scale = clamp(
        start.scale * (getDistance(...pair) / distance),
        MIN_SCALE,
        MAX_SCALE,
      );
      const midpoint = toLocal(getMidpoint(...pair));
      const anchorX = (startMidpoint.x - start.pan.x) / start.scale;
      const anchorY = (startMidpoint.y - start.pan.y) / start.scale;

      setView({
        scale,
        pan: { x: midpoint.x - anchorX * scale, y: midpoint.y - anchorY * scale },
      });
      blockSelection();
      return;
    }

    // Jedan prst / miš: pomeranje
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

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
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

  const zoomIn = () => {
    setSmooth(true);
    zoomAt(ZOOM_STEP);
  };

  const zoomOut = () => {
    setSmooth(true);
    zoomAt(1 / ZOOM_STEP);
  };

  const resetZoom = () => {
    setSmooth(true);
    setView(INITIAL_VIEW);
  };

  /** Glatko dovodi ćeliju mreže (col, row) u centar, ako je zumirano */
  const centerOnCell = useCallback(
    (cell: Point) => {
      const current = viewRef.current;
      if (current.scale <= MIN_SCALE) return;

      const { baseWidth, baseHeight } = metrics.current;
      setSmooth(true);
      setView({
        scale: current.scale,
        pan: {
          x: -((cell.x + 0.5) / columns - 0.5) * baseWidth * current.scale,
          y: -((cell.y + 0.5) / rows - 0.5) * baseHeight * current.scale,
        },
      });
    },
    [columns, rows, setView],
  );

  return {
    viewportRef,
    size,
    view,
    smooth,
    baseWidth,
    baseHeight,
    isZoomed: view.scale > MIN_SCALE,
    canZoomIn: view.scale < MAX_SCALE,
    gestureHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
    zoomIn,
    zoomOut,
    resetZoom,
    centerOnCell,
    isSelectionBlocked,
  };
}
