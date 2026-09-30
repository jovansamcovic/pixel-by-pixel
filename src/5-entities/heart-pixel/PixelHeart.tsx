import type { CSSProperties } from "react";

import { useTranslations } from "next-intl";

export type HeartPixel = {
  id: number;
  row: number;
  col: number;
  targetColor: string;
};

export const HEART_COLUMNS = 108;
export const HEART_ROWS = 100;
export const HEART_RENDER_ROWS = HEART_ROWS;

export const PIXEL_PRICE = 1_000;

const PIXEL_COLORS: Record<string, string> = {
  "N": "#1A2D3A",
  "R": "#CD333F",
  "C": "#EA4748",
  "O": "#F9A743",
  "W": "#FBF4ED",
  "S": "#E4766E",
  "P": "#F8BC73",
  "D": "#A24449",
};

export const PIXEL_PALETTE = Object.values(PIXEL_COLORS);

export const DONOR_NAMES = [
  "Mina P.",
  "Vuk i Tara",
  "Porodica Ilić",
  "Luka M.",
  "Ana i Ognjen",
  "Anonimno",
];

/**
 * High-detail 108 × 100 mapping generated directly
 * from the ORIGINAL "Srce Kragujevca" artwork.
 *
 * "." = transparent.
 * Every other character = one square pixel with exactly one solid color.
 *
 * 108 × 100 is deliberately much denser than the old 60 × 49 map:
 * it preserves the Srce/Kragujevca lettering, skyline, instruments,
 * windows and small hearts much more faithfully.
 */
const LOGO_PIXELS = [
  "...........................SRRS.............................................RRRRRR..........................",
  "......................RRRRRRRRRRRRRR....................................RRRRRRRRRRRRRR......................",
  "...................SRRRRRRRRRSRRRRRRRRS..............................RRRRRRRRRRRSRRRRRRRR...................",
  ".................RRRSRRRRRRSSSSRRRRRRRRRS..........................RRRRRRRRRRRRRRSRRRRRRRRR.................",
  "................RRRSSRRRRRRSSRRSRRRRRSSSSSP.......................RRRRRRRRRRRSRRRSRRRRRRRRRR................",
  "..............RRRRSSRRSSRRRRSRSSRRRSSSSSRRRR....................RRRRRRRRRRRRSRSRRRSRRRRRRRRRRR..............",
  ".............RRRRRSRRRSRRRRRSRRRRRRSSSSRRRRRS..................RRRRRRRRRRRRRRSSRRRSRRRRRRRRRRRR.............",
  "............RRRRRRRSRRRRRRRRSRRRRRRRSRRRSSSSRR................RRRRRRRRRRRRRRRRSSRRSRRRRRRRSRRSRR............",
  "...........RRRRRRRRSRRRRRRRRRRRRRRRRRRRRSSRRRRR..............RRRRRRRRRRRRRRRRRRRRSRSRRRRRRSRRSRRR...........",
  "..........RRRRRRRRRSRRRSRRRRRRRRRRRRSRSSSRRRRRRC............CRRSRSRRRRRRWRRRRRRRRRRSRRRRRRSRRRRRRR..........",
  ".........RRRRRRRRRRRRRRRRRRRRRRRRRRRRCCCCCCCCCCCC..........CCCCCCSCSCRWWWRRRRRRRRRSRSRRRRRRRRRRRRRR.........",
  "........RRRSRRRRRRSRRRRRRRRRRRRRRRCCCCCCCCCCCCCCCC........CCCCCCCCCCCCWWWRRRRRRRRRRSSSRRRSSRRRRRRRRR........",
  ".......RRRRSRRRRRRRRRRRRRRRRRRRCCCCCCCCCCCCCCCCCCC.......CCCCCSSCCCCCCCCCCCRRRRRRRRSSSRSRRRRRRRRRRRRR.......",
  ".......RRRRRRRRRRRRRRRRRRRRRRCCCSCSCCCCCCCCCCCCCCCC......CCCCCCCCSCCCCCCCCCCCRRRRRRRSRSRRRRRRRRRRRRRR.......",
  "......RRRRRRRRRRRRSRRRRRRRRCCCCCSCCCCCCCCCCCCCCCCCCC....CCCCSCCCCCSCCCCCCCCCCCCRRRRRRSRRRRRRRRRRRRRRRR......",
  ".....RRRRRRRRRRRRRRRRRRRRRCCCCCCSCCCCCSCCCCCCCCCCCCC...CCCCSCCCCCCCCCCCCCCCCCCCCRRRRRSSRRRRRRRRRRRRRRRR.....",
  ".....RRRRRRRRRRRRRRRRRRRCCCCOOOPSCCCCCCCCCCCCCCCCCCCC..CCCCSCCCCCCSCCCCCCCCCCCCCCCRRRRRSSRRRRRRRRRRRRRR.....",
  "....DRRRRRRRRRRRRRRRRRRCCCCCOOPCCCCCSCCCCCCCCSSCCCCOO.OOOOOSCCCCCCCCCCCCCCSSCCCCCCCRRRSRSSRRRRRRRRRRRRRR....",
  "....RRRRRRRRRRRRRRRRRWWWCSSSCCCCCCCCSCCCCCCCCCSPPOOOOOOOOOOPOOOOCCCCCCCCCSSSCCCCCCCCSRRSRSRRRRRROOORRRRR....",
  "...RRRRRRRRRRRRRRRWWWWWWWWWCCCCCCSCCSCCCCCSCPOOOOOOOOOOOOOPOOOOOOOOCCCCCCCSCCCCCCCCSCCRRSSSSRRRROOORRRRRR...",
  "...RRRRRRRRRRRRRRRWWCCCWWCCSSCSCCCSCSCCCCCPPOOOOOOOOOOOOOOOOOOOOOOOOOCCCCCCCCCCCCCCSCCCSSRSSRRRRRORRRRRRR...",
  "...RRRRRRRRRRRRRRRSCCCCCCSSCSCCCCCCSCCCCCOPPOOOOOOOOOOOOOOOOOOOOOOOOOOCCCCCSCCCCCCCSCCCCRRRSRRRRRRRRRRRRR...",
  "..DRRRRRRRRRRRRRRRCCCCSSSCSCCCCCCCCCCCCOOOOOOOORRROOOOOOOOOOOOOOOOOOOOOOCCCCCCCCCCCCCCCCSRRSRRRRRRRRRRRRRR..",
  "..RRRRRRRRRWWRRRRCCCCCCSSCCSCSCCCCCCCCOOOOOOOOORRROOOOOOOOOOOOOOOOOOOOOOOCCCCCCCCCCCCCCSCNNSRRRRRRRRRRRRRR..",
  "..RRRRRRSRRWWRRRCCCCCCCSCSCSSSCCCCCCCOOOOOOOOOOOROOOOPOOOOOOOPPPOOOOOOOOOOCCCCCCCCCSCCCCCNNRRRRRRRRRRRRRRR..",
  "..RRRRRRRRSRRRRCCCCCCCCCSSSSSCCCCCCCOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOPCCSSCCCCCCCCCNNSRSRRRRRRRRRRRRD.",
  ".RRRRRRRRRSSRRCCCCCCCCCCCCCCCCCCCCCOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOPOCSCCCSCCCCCCCNNCSSSRRRRRRRRRRRR.",
  ".RRRRRRRSSRSRRCCCCCCCCCCCCCCCCCCCCOOOOOOOOOOOOOOOOPOOOOOOOOOOOOOOOOOOOOOOPOOOCCCCCCCCCCCCNNCSSRRRRRRRRRRRRR.",
  ".RRRRRRSRRRRSCCCCCCCCCCCCCCCCCCCCOOOOOOOOOOOOOOOOPPPPPPNNOOOOOOOOOOOOOOOOOOOOOSSCCCCCCCCCNNCWWRRRRRRRRRRRRR.",
  ".RRRRRSRRRRRCCCCCCCCCCCCCCCCCCCCCOPOOOPOOOOOOOOPOOPOPPONNNNOOOOOOOOOOOOOOOOOOPPCCCCCCCCCNNNWWWWWRRRRRRRRRRR.",
  ".RRRRSSRRRRRCSSCCCSSSCCCCCCSSCCCOOOOOOOOPOOOOOPOOPOPPOPNNNNNPOOOOOOOOOOOOOOPOOOOCCCCCCWWWNNWWWWWWRRRRRRRRRR.",
  ".RRRRRRRRRRCSSSSCSCSSCCCCSSSCCCCOOOOOOOOOOOOOOPOOOPOOOPNNNNNPPPOOPOOOOOOOOONNNNOCCCCCCCCCNNCCCCSRRRRRRRRRRRS",
  "SRRRRNNNRRCCCSSSCNNNSCCSSSCCCCCOOOPOPOOOOOOOOOOOOOOOPPNNNNNNOPOPOOOOOOOOONNNNNNNNCCCCCCSCNNCCSSCRRRRRRRRRRRR",
  "DRRRNNNNRRCCCCCSNNNNCCCCCCCCCCCOOOOOOOOOOOOOOOOOOOOONNNNNNNNPOOPOPOOPONNNNNNNNNNNNNNCCCCNNNCCCCCRRRRRRRRRRRR",
  "RRRNNNNNNNCCCSCNNNNNNCCSCCCCCCCONOOPOPOOPOOOOOOOOOOONNNNNNNNNOPOOPPONNNNNNNNNNNNNNNNNNCCNNNCCCCCCRRRRRRRRRRR",
  "RRRNNNNNNNNNNNNNNNNNNNCSCCCCCCOONOONNPOOOOOOOOOOOOOONNNNNNNNNPOONNNPPNNNNNNNNNNNNNNNNNNCNNNNNCCCCNNRRRNNRRRR",
  "RRRNNNNNNNNNNNNNNNNNNSSCCCCNNNNNNNNNNNNNNOOOOOOOOOOONNNNNNNNNPONNNNPPNNNNNNNNNNNNNNNNNNCNNNNNCCNNNNRNNNNRRRR",
  "RRRNNNONNNONONONNNONNNCNNNNNNNNNNNNNNNNNNNNNNOOOOOOONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNRRRR",
  "DRRNNNONNNONONONNNONNSCNNNNNNNNNNNNNNNNNNNNNNNOOOOOOONNNNNNNNNNNNNNNNNNNNNDNNNNNNNNNNNNNNNNNNNNNNNNNNNNNRRRR",
  "SRRNNNONNNONONONNNONNSCNNNNCNNNNNNNNNNNNNCNCNNNNNNNNNNNNNNNNNNNNNNNNNNNONNNNNNNONNONNNNNNNNNNNNNNNNNNNNNRRRS",
  ".RRNNNNNNNNNNNNNNNNNNNCNCCNCNNCNCNNCNCCNNCNCNNNNNNNNNNNNNNNNNNNNNNNNNNNONNONONNONNONNNNNNCCNNNNCCNNNCCNNRRR.",
  ".RRNNNNNNOONONONNNNNNCCNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNCCNNNNCCNNNCCNNNRR.",
  ".RRNNNONNNONONONNNONNCCNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNCCNNNNCCNNNCCNNRRR.",
  ".RRNNNONNNONONONNNONNCCNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNRRR.",
  ".RRNNNNNNNONONONNNNNNCCNNNNNNNNWWWWWWWNNNNCNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNDNONNONNNNNNNNNNNNNNNNNNNNNNNNRRR.",
  ".RRNNNNNNNNNONONNNNNNNCNNNNNNWWWWWWWWWWWNNCNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNWNNNNNNNNNNNNNNNNNNNNNNNNNNRD.",
  "..NNNNNNNNNNNNNNNNNNNNNNNNNNWWWWWWWWWWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN..",
  "..NNNNNNNNNNNNNNNNNNNNNNNNNWWWWNNNNNNWWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN..",
  "..NNNNNWNNNNNNNNNNNNNNNNNNNWWWNNNNNNNNWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNCCNNNNNNNNNNNNNNNN..",
  "..NNNNNNNNNNNNNNNNNNNNNNNNWWWWNNNNNNNNWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNWWNNNNNNNNNNNNNNNNNNCCNNNNNNNNNNNNNNN...",
  "...NNNNNNNNNNNNNNNNNNNNNNNWWWWNNNNNNNNWWWNNNNNNNNNNNNNNNNNNNNNNNNNWWWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN...",
  "...NNNNNNNNNNNNNNCCNNNNNNNNWWWNNNNNNNNNNNNNNNNNNNNNWNNNNNWWWWWNNNWWWWWWWNNNNNNNNCCCNNNNNNNNNNNNNNNNNNNNNN...",
  "...NNNNNNNNNNNNNNCNNNNNNNNNWWWWWNNNNNNNNNNNNNWWNNWWWWNNNWWWWWWNNWWWNNWWWNNNNNNNNNCNNNWNNNNNNNNCCCNNNNNNN....",
  "....NNNNNNCCNNNNNNNNNNNNNNNWWWWWWWWNNNNNNNNNWWWNWWWWWNNWWWNNWWNNWWWNNWWWNNNNNNNNNNNNNNNNNNNNNNCCCNNNNNNN....",
  "....NNNNNCCCNNNNNNNNNNNCCCNNWWWWWWWWWWNNNNNNWWWNWWWWWNNWWWNNWWNNWWNNNWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.....",
  ".....NNNNNCNNNWNNNNNNNNCCCNNNNWWWWWWWWWWNNNWWWNWWWWWWNWWWWNNWWNWWWWWWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.....",
  ".....NNNNNNNNNNNNNNNNNNNCCNNNNNNNWWWWWWWWNNWWWWWWNWWWNWWWNNNNNNWWWWWWWNNWWNNNNNNNNNNNNNNNNNWWWNNNNNNNN......",
  "......NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNWWWWWNNWWWWWNNWWWWWWWWNNNNNNWWWWNNNWWWNNNNNNNNNNNNNNNNWWWWNNNNNNNN......",
  "......NNNNNNNNNNNNNNNNNNNNNWNNNNNNNNNWWWWNNWWWWWNNWWWWWWWWNNNNNWWWWWNNWWWNNNNNNNNNNNNNNNNNNWWNNNNNNNN.......",
  ".......NNNNNNNNNNNNWWWWNNNWWWNNNNNNNNNWWWNNWWWWWNNNNWNNWWWWNNWWWWWWWWWWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNN.......",
  "........NNNNNNNNNNNNWWWNNNWWWNNNNNNNNNWWWNNNWWWWNNNNNNNWWWWWWWWWNNWWWWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNN........",
  ".........NNNNNNNNNNNNWNNNNWWWNNNNNNNNWWWWNNNWWWNNNNNNNNNWWWWWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.........",
  ".........NNNNNNNNNNNNNNNNNWWWWNNNNNNWWWWNNNNWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN..........",
  "..........NNNNNNNNNNNNNNNNNWWWWWWWWWWWWWNNNNWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN..........",
  "...........NNNNNNNNNNNNNNNNWWWWWWWWWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.........",
  "............NNNNNNNNNNNNNNNNNWWWWWWNNNNNNNNNNNNNNNNNNNNNNNNNNNNRRRNNNNNNNNNNNNNNNNNNNNNNNNNNNRRNNNN.........",
  "............NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNWWNNNNNNNNNNNNNNNRRRNNNNNNNNNNNNNNNNNNNNRRRNNNRRRRRNN.........",
  "...........NNNNNNNNNNNNNNRRNNNNNNNNNNNNNNNNNNWWWWNNNNNNNNNNNNNNNRNNNNNNNNNNNRNNNRRNNNRRRRNNRRRNRRNN.........",
  "..........NNNRRRRRRRNNNNNRRNNNNNNNNNNNNNNNNNNNWWNNNNNNNNNNNNNNNNNNNNNNRRRNNRRNNRRRNNRRNNRNNRRNNRRNN.........",
  ".........NNNRRRRRRRRNNNNRRRNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNRNNNRRNNNRRRRRNRRNNRRRNRRRNNRNRRRNNRRNN.........",
  ".........NNRRRNNNRRRNNNNRRNNNNNNNNNNNNNNNNNNNNNNNNNNNNNRRNNRRNNNRRNNRRNNRRNRRNNRRRRRRRNNNNRRNNNRRNN.........",
  ".........NNRRNNNNRRRNNNNRRNNNNNNNNNNNNNNNNNNNNNNRRRRRNNRRNNRRNNNRRNNRRNNRRNRRRNRRRRRRRNNNNRRRNRRRNN.........",
  ".........NNRRNNNNRRRNNNRRNNNNNNNNNNNNNNNRRRRNNNRRRRRRNNRRNNRRNNNRRNNRRNRRNNNRRNRRNNNRRNNNRRRRRRRRNNN........",
  ".........NNRRRNNNRRRNNRRRNNNNNRNNRRRNNNRRRRRNNNRRNNRRNNRRNNRRNNNRRNNRRRRNNNRRRRRNNNNRRRRRRRRRRNRRNN.........",
  ".........NNNRRNNNRRRNRRRNNNNNRRNRRRRNNRRNNRRNNRRNNNRRNNRRNNRRNNRRRNRRRRNNRRRRRRRNNNNNRRRRNNNNNNNNNN.........",
  "..........NNNNNNRRRRRRNNNNWNNRRNRRRRNNRRNNRRNNRRNNRRRNRRRNRRRNNRRRRRRRRRRRRNNRRNNN.NNNNNNNNNNNNNNN..........",
  "..........NNNNNNRRRRRRRNNNWNNRRRRNRRRRRRNNRRNNRRNNRRRRRRRRRRRRRRRRRNNNRRRNNNNNNNN...NNNNNN..N...............",
  "............D.NNNRRNNRRRNNNNNRRRNNRRRRRRNNRRNRRRRNRRRRRRRRRNRRRRRRNNNNNNNNNNNNNN............................",
  "..........NNNNNNNRRNNNRRRNNNNRRRNNNNNRRRNRRRRRRRRRRRRNNNNNNNNNNRRRNNNNNNNNN.................................",
  ".........NNNNNNNNRRNNNRRRRNNRRRRNNNNNNRRRRNRRRNNRNRRRNNNNNNNNNRRRNNNNNNNN...................................",
  ".........NNNRNNNNRRNNNNRRRRRRRRRNNNNNNNRRNNNNNNNNRRRNNNNNNNNNRRRRNNNNNNN....................................",
  ".........NNNRRNNRRRNNNNNRRRRRNRNNN..NNNNNNNNNNNNRRRRNNNNNNNNRRNRRNNNNN......................................",
  ".........NNNRRRRRRNNN.NNNNNNNNNNNN...NNNNNNNNNNNRNRRNNNNNNNNRRNRRNNN........................................",
  "..........NNNRRRRNNN...NNNNNNNNNN........NNNNNNRRNRRNNNNNNNNRNNRRNN.........................................",
  "...........NNNNNNNNN....NNNN..............NNNNNRNNRRNNNNNNNNRRRRNNN.........................................",
  "............NNNNNN..........................NNRRNNRNNNNNNNNNRRRRNN..........................................",
  "............................................NNNRRRRNNNNCCNNNNNNNNN..........................................",
  "............................................NNNRRRNNNNNCNNNNNNNNN...........................................",
  ".............................................NNNNNNNNNNNNNNNNNNN............................................",
  "..............................................NNNNNNNNNNNNNNN...............................................",
  "................................................NNNNNNNNNNNN................................................",
  ".................................................NNNNNNWWNN.................................................",
  ".................................................NNNNNNWWNN.................................................",
  "..................................................NNNNNNNN..................................................",
  "...................................................NNNNNN...................................................",
  "...................................................NNNNNN...................................................",
  "....................................................NNNN....................................................",
  "....................................................NNN.....................................................",
  ".....................................................NN.....................................................",
  ".....................................................N......................................................",
] as const;

export const HEART_PIXELS: HeartPixel[] = (() => {
  const pixels: HeartPixel[] = [];
  let id = 0;

  LOGO_PIXELS.forEach((rowValue, row) => {
    [...rowValue].forEach((value, col) => {
      if (value === ".") return;

      pixels.push({
        id,
        row,
        col,
        targetColor: PIXEL_COLORS[value],
      });

      id += 1;
    });
  });

  return pixels;
})();

export const STARTING_SOLD = Math.round(
  HEART_PIXELS.length * 0.68, // define here number of sold pixels
);

const hashPixel = (id: number) => {
  let value = id + 1;

  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  value = value ^ (value >>> 16);

  return value >>> 0;
};

const INITIAL_SOLD_IDS = new Set(
  HEART_PIXELS.map((pixel) => pixel.id)
    .sort(
      (first, second) =>
        hashPixel(first) - hashPixel(second) || first - second,
    )
    .slice(0, STARTING_SOLD),
);

export const isInitiallySold = (id: number) =>
  INITIAL_SOLD_IDS.has(id);

export const getPixelTargetColor = (pixelNumber: number) =>
  HEART_PIXELS[pixelNumber - 1]?.targetColor ?? PIXEL_COLORS["R"];

const AVAILABLE_PIXEL_OPACITY = 0.5;

const AVAILABLE_PIXEL_COLORS: Partial<Record<string, string>> = {
  "#FBF4ED": "#D8CEC5",
};

const hexToRgba = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const getAvailablePixelColor = (targetColor: string) => {
  const overrideColor =
    AVAILABLE_PIXEL_COLORS[targetColor.toUpperCase()];

  if (overrideColor) {
    return overrideColor;
  }

  return hexToRgba(targetColor, AVAILABLE_PIXEL_OPACITY);
};

type PixelHeartProps = {
  highlightedPixel?: number;
  purchasedPixels?: Record<number, string>;
  selectedPixel?: number | null;
  interactive?: boolean;
  onSelect?: (pixelId: number) => void;
  className?: string;
};

type PixelStyle = CSSProperties & {
  "--pixel-column": number;
  "--pixel-row": number;
};

export function PixelHeart({
  highlightedPixel,
  purchasedPixels = {},
  selectedPixel = null,
  interactive = false,
  onSelect,
  className = "",
}: PixelHeartProps) {
  const t = useTranslations("PixelHeart");

  const donorNames = [
    t("donors.mina"),
    t("donors.vukAndTara"),
    t("donors.ilicFamily"),
    t("donors.luka"),
    t("donors.anaAndOgnjen"),
    t("donors.anonymous"),
  ];

  return (
    <div
      role={interactive ? "group" : "img"}
      aria-label={t("ariaLabel")}
      className={["relative", "w-full", "max-w-[680px]", className].join(" ")}
      style={{
        aspectRatio: `${HEART_COLUMNS} / ${HEART_ROWS}`,
      }}
    >
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${HEART_COLUMNS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${HEART_ROWS}, minmax(0, 1fr))`,
        }}
      >
        {HEART_PIXELS.map((pixel) => {
          const pixelNumber = pixel.id + 1;
          const purchased = purchasedPixels[pixelNumber] !== undefined;
          const initiallySold = isInitiallySold(pixel.id);

          const sold = initiallySold || purchased;
          const selected = selectedPixel === pixelNumber;
          const highlighted = highlightedPixel === pixelNumber;

          const pixelStyle: PixelStyle = {
            "--pixel-column": pixel.col + 1,
            "--pixel-row": pixel.row + 1,
            gridColumn: pixel.col + 1,
            gridRow: pixel.row + 1,
            backgroundColor:
              sold || selected || highlighted
                ? pixel.targetColor
                : getAvailablePixelColor(pixel.targetColor),
          };

          if (!interactive) {
            return (
              <span
                key={pixel.id}
                style={{
                  ...pixelStyle,
                  backgroundColor:
                    sold || highlighted
                      ? pixel.targetColor
                      : getAvailablePixelColor(pixel.targetColor),
                }}
                aria-hidden="true"
                className={[
                  "relative min-h-0 min-w-0 rounded-none",
                  highlighted
                    ? "z-20 ring-2 ring-inset ring-[#102F3B]"
                    : "",
                ].join(" ")}
              />
            );
          }

          const donor =
            donorNames[pixel.id % donorNames.length];

          return (
            <button
              key={pixel.id}
              type="button"
              style={pixelStyle}
              disabled={sold}
              aria-pressed={selected}
              aria-label={
                sold
                  ? t("soldAriaLabel", {
                      pixel: pixelNumber,
                      donor,
                    })
                  : t("availableAriaLabel", {
                      pixel: pixelNumber,
                    })
              }
              title={
                sold
                  ? t("soldTitle", { donor })
                  : t("availableTitle", { pixel: pixelNumber })
              }
              onClick={() => {
                if (!sold) onSelect?.(pixelNumber);
              }}
              className={[
                "relative min-h-0 min-w-0 appearance-none rounded-none p-0 outline-none",
                "transition-[background-color,border-color,box-shadow] duration-150",
                sold
                  ? "cursor-default border border-transparent"
                  : [
                      "cursor-pointer",
                      "border border-white/30",
                      "hover:z-20",
                      "hover:border-[#D6384B]",
                      "focus-visible:z-20",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-[#D6384B]",
                    ].join(" "),
                selected
                  ? [
                      "z-30",
                      "!border-[#102F3B]",
                      "ring-2 ring-[#102F3B]",
                      "shadow-[0_0_0_2px_white]",
                    ].join(" ")
                  : "",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}
