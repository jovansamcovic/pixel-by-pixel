import { PixelHeart } from "@/src/5-entities/heart-pixel";

import { clamp, type Size, type View } from "../helpers";

const MINIMAP_WIDTH = 72;

type PickerMinimapProps = {
  view: View;
  viewport: Size;
  content: Size;
  selectedPixel: number | null;
  purchasedPixels: Record<number, string>;
};


function getVisibleFrame(view: View, viewport: Size, content: Size) {
  const axis = (contentSize: number, viewportSize: number, pan: number) => {
    const start = clamp((contentSize / 2 - viewportSize / 2 - pan) / contentSize, 0, 1);
    const end = clamp((contentSize / 2 + viewportSize / 2 - pan) / contentSize, 0, 1);
    return { start, length: end - start };
  };

  const x = axis(content.width, viewport.width, view.pan.x);
  const y = axis(content.height, viewport.height, view.pan.y);
  return { left: x.start, width: x.length, top: y.start, height: y.length };
}

const percent = (value: number) => `${value * 100}%`;


export function PickerMinimap({
  view,
  viewport,
  content,
  selectedPixel,
  purchasedPixels,
}: PickerMinimapProps) {
  if (content.width <= 0) return null;

  const frame = getVisibleFrame(view, viewport, content);

  return (
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
            left: percent(frame.left),
            top: percent(frame.top),
            width: percent(frame.width),
            height: percent(frame.height),
          }}
        />
      </div>
    </div>
  );
}
