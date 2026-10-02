import type { CSSProperties } from "react";

export const toolButton = [
  "grid size-9 place-items-center",
  "border border-[#0D2734]/25 bg-[#FFF6EB]/90 text-[#0D2734] backdrop-blur-sm",
  "transition hover:border-[#0D2734]/60 hover:bg-[#FFF6EB]",
  "active:translate-y-[1px]",
  "disabled:pointer-events-none disabled:opacity-30",
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]",
].join(" ");

const NOTCH = "6px";

/** Pixelated button corners  **/
export const pixelClip: CSSProperties = {
  clipPath: `polygon(
    0 ${NOTCH}, ${NOTCH} ${NOTCH}, ${NOTCH} 0,
    calc(100% - ${NOTCH}) 0, calc(100% - ${NOTCH}) ${NOTCH}, 100% ${NOTCH},
    100% calc(100% - ${NOTCH}), calc(100% - ${NOTCH}) calc(100% - ${NOTCH}),
    calc(100% - ${NOTCH}) 100%, ${NOTCH} 100%, ${NOTCH} calc(100% - ${NOTCH}),
    0 calc(100% - ${NOTCH})
  )`,
};
