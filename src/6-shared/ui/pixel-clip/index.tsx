import { CSSProperties } from "react";

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