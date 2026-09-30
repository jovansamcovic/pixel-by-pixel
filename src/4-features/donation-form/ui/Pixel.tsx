import type { CSSProperties } from "react";

const HEART_ICON = [
  "0110110",
  "1111111",
  "1111111",
  "0111110",
  "0011100",
  "0001000",
];

export function PixelHeartIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 7 6"
      shapeRendering="crispEdges"
      className={className}
    >
      {HEART_ICON.flatMap((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#E52336" />
          ) : null,
        ),
      )}
      <rect x="1" y="1" width="1" height="1" fill="#FF8A94" />
    </svg>
  );
}

export function pixelClip(notch = "6px"): CSSProperties {
  return {
    clipPath: `polygon(
      0 ${notch}, ${notch} ${notch}, ${notch} 0,
      calc(100% - ${notch}) 0, calc(100% - ${notch}) ${notch}, 100% ${notch},
      100% calc(100% - ${notch}), calc(100% - ${notch}) calc(100% - ${notch}),
      calc(100% - ${notch}) 100%, ${notch} 100%, ${notch} calc(100% - ${notch}),
      0 calc(100% - ${notch})
    )`,
  };
}