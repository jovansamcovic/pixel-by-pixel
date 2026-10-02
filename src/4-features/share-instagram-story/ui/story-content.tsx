"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getFontEmbedCSS, toBlob } from "html-to-image";

import type { DonationRecord } from "@/src/5-entities/donation";
import {
  HEART_COLUMNS,
  HEART_PIXELS,
  HEART_ROWS,
  isInitiallySold,
} from "@/src/5-entities/heart-pixel";
import { pixelClip } from "@/src/6-shared/ui/pixel-clip";
import { PixelHeartIcon } from "@/src/6-shared/icons/heaer-icon-pixel";

type StoryContentProps = {
  donation: DonationRecord;
};

type StoryCopy = {
  fileName: string;
  imageError: string;
};

const COLORS = {
  cream: "#FFF6EB",
  navy: "#0D2734",
};

const STORY_HEART_WIDTH = 864;
const STORY_HEART_HEIGHT = Math.round(
  STORY_HEART_WIDTH * (HEART_ROWS / HEART_COLUMNS),
);

const AVAILABLE_PIXEL_ALPHA = 0.22;

const hexToRgba = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const createStoryHeartDataUrl = (donation: DonationRecord): string => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create story heart canvas.");
  }

  canvas.width = STORY_HEART_WIDTH;
  canvas.height = STORY_HEART_HEIGHT;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = false;

  const pixelWidth = canvas.width / HEART_COLUMNS;
  const pixelHeight = canvas.height / HEART_ROWS;

  HEART_PIXELS.forEach((pixel) => {
    const pixelNumber = pixel.id + 1;
    const purchased = pixelNumber === donation.id;
    const sold = isInitiallySold(pixel.id) || purchased;

    context.fillStyle = sold
      ? pixel.targetColor
      : hexToRgba(pixel.targetColor, AVAILABLE_PIXEL_ALPHA);

    context.fillRect(
      Math.floor(pixel.col * pixelWidth),
      Math.floor(pixel.row * pixelHeight),
      Math.ceil(pixelWidth),
      Math.ceil(pixelHeight),
    );
  });

  const selectedPixel = HEART_PIXELS.find(
    (pixel) => pixel.id + 1 === donation.id,
  );

  if (selectedPixel) {
    context.strokeStyle = COLORS.navy;
    context.lineWidth = Math.max(2, Math.round(pixelWidth * 0.35));

    context.strokeRect(
      Math.floor(selectedPixel.col * pixelWidth),
      Math.floor(selectedPixel.row * pixelHeight),
      Math.ceil(pixelWidth),
      Math.ceil(pixelHeight),
    );
  }

  return canvas.toDataURL("image/png");
};

const nextPaint = () =>
  new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });

const waitForImage = async (image: HTMLImageElement) => {
  if (image.complete && image.naturalWidth > 0) {
    if (typeof image.decode === "function") {
      try {
        await image.decode();
      } catch {
        // Loaded enough for rendering.
      }
    }

    return;
  }

  await new Promise<void>((resolve, reject) => {
    const handleLoad = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error("Story heart image failed to load."));
    };

    const cleanup = () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", handleError, { once: true });
  });
};

const createInstagramStory = async (
  previewElement: HTMLDivElement,
  donation: DonationRecord,
  copy: StoryCopy,
): Promise<File> => {
  await document.fonts.ready;
  await nextPaint();

  const { width, height } = previewElement.getBoundingClientRect();

  if (!width || !height) {
    throw new Error(copy.imageError);
  }

  let fontEmbedCSS = "";

  try {
    fontEmbedCSS = await getFontEmbedCSS(previewElement);
  } catch (error) {
    console.warn(
      "Instagram story font embedding failed; continuing with fallback fonts.",
      error,
    );
  }

  const blob = await toBlob(previewElement, {
    width,
    height,
    canvasWidth: 1080,
    canvasHeight: 1920,
    pixelRatio: 1,
    backgroundColor: COLORS.cream,
    cacheBust: true,
    fontEmbedCSS,
  });

  if (!blob) {
    throw new Error(copy.imageError);
  }

  return new File([blob], `${copy.fileName}-${donation.id}.png`, {
    type: "image/png",
  });
};

/* Pixel "loader": tri kvadrata koji trepću jedan za drugim */
function PixelLoader() {
  return (
    <span aria-hidden="true" className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-2 animate-pulse bg-white"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
    </span>
  );
}

/* Pixel X ikonica, ista kao u Sheet-u */
function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
    >
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function StoryContent({ donation }: StoryContentProps) {
  const t = useTranslations("InstagramStoryDialog");
  const locale = useLocale();

  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [isPreparing, setIsPreparing] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  const storyPreviewRef = useRef<HTMLDivElement | null>(null);
  const heartImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const copy: StoryCopy = {
      fileName: t("story.fileName"),
      imageError: t("errors.imageGeneration"),
    };

    const previewElement = storyPreviewRef.current;
    const heartImage = heartImageRef.current;

    if (!previewElement || !heartImage) {
      return;
    }

    const prepareStory = async () => {
      try {
        heartImage.src = createStoryHeartDataUrl(donation);

        await waitForImage(heartImage);
        await nextPaint();

        const file = await createInstagramStory(previewElement, donation, copy);

        if (!cancelled) {
          setStoryFile(file);
          setIsPreparing(false);
        }
      } catch (error) {
        console.error("Instagram story generation failed:", error);

        if (!cancelled) {
          setIsPreparing(false);
          setShareStatus(t("status.preparationFailed"));
        }
      }
    };

    void prepareStory();

    return () => {
      cancelled = true;
    };
  }, [donation, locale, t]);

  const downloadStory = () => {
    if (!storyFile) return;

    const url = URL.createObjectURL(storyFile);
    const link = document.createElement("a");

    link.href = url;
    link.download = storyFile.name;
    link.click();

    window.setTimeout(() => URL.revokeObjectURL(url), 100);

    setShareStatus(t("status.downloaded"));
  };

  const shareToInstagram = async () => {
    if (!storyFile) return;

    try {
      const canShareFile =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [storyFile] });

      if (!canShareFile) {
        downloadStory();
        return;
      }

      await navigator.share({
        files: [storyFile],
        title: t("sharing.title"),
        text: t("sharing.text"),
      });

      setShareStatus(t("status.shared"));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setShareStatus(t("status.cancelled"));
        return;
      }

      downloadStory();
    }
  };

  const steps = [
    t("controls.steps.share"),
    t("controls.steps.instagram"),
    t("controls.steps.publish"),
  ];

  const selectedHeartPixel = HEART_PIXELS.find(
    (pixel) => pixel.id + 1 === donation.id,
  );

  const donorCardLeft = selectedHeartPixel
    ? Math.min(
        Math.max(((selectedHeartPixel.col + 0.5) / HEART_COLUMNS) * 100, 28),
        72,
      )
    : 50;

  const donorCardTop = selectedHeartPixel
    ? ((selectedHeartPixel.row + 1) / HEART_ROWS) * 100
    : 100;

  return (
    <>
      {/* Story preview: van ekrana dok se generiše slika, full-screen kad je otvoren */}
      <div
        role={previewOpen ? "dialog" : undefined}
        aria-modal={previewOpen ? true : undefined}
        aria-labelledby={previewOpen ? "story-preview-title" : undefined}
        aria-hidden={!previewOpen}
        className={
          previewOpen
            ? "fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-[#0D2734]/85 p-4 sm:p-6"
            : "pointer-events-none fixed -left-[10000px] top-0 flex h-[720px] w-[500px] items-center justify-center"
        }
      >
        <div
          style={pixelClip("10px")}
          className="relative flex w-full max-w-md items-center justify-center bg-[#0D2734] p-[3px]"
        >
          <div
            style={pixelClip("10px")}
            className="relative flex w-full items-center justify-center bg-[#F4E8DD] p-5 sm:p-8"
          >
            <h2 id="story-preview-title" className="sr-only">
              {t("preview.modalTitle")}
            </h2>

            {/* Ovaj element se pretvara u PNG */}
            <div
              ref={storyPreviewRef}
              aria-label={t("preview.ariaLabel")}
              className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden bg-[#FFF6EB]"
            >
              {/* Pixel mreža u pozadini */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(13,39,52,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(13,39,52,0.06) 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                }}
              />

              {/* Okvir od 3px oko cele story slike */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2 border-[3px] border-[#0D2734]"
              />

              <div className="relative flex h-full flex-col px-6 pb-7 pt-7">
                <header className="flex items-center justify-between gap-3">
                  <img
                    src="/logo-pixel.svg"
                    alt={t("brandName")}
                    loading="eager"
                    decoding="sync"
                    className="h-7 w-auto"
                  />
                  {/* X je u headeru samo dok je pregled otvoren; kad se pravi PNG, sakriven je */}
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    aria-label={t("preview.closeLabel")}
                    className={[
                      "-mr-1 size-9 shrink-0 place-items-center",
                      "text-[#0D2734] transition hover:text-[#E52336] active:translate-y-[1px]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336]",
                      previewOpen ? "grid" : "hidden",
                    ].join(" ")}
                  >
                    <CloseIcon />
                  </button>
                </header>

                <div className="mx-0 mt-4 h-[3px] bg-[#0D2734]" />

                <h3 className="mt-4 text-center text-[26px] uppercase leading-[0.95] tracking-[-0.01em] text-[#0D2734]">
                  {t("story.title.first")}
                  <span className="block text-[#E52336]">
                    {t("story.title.highlighted")}
                  </span>
                  {t("story.title.last")}
                </h3>

                {/* Mesto za Instagram link stiker */}
                <div className="mt-4 flex justify-center">
                  <div
                    style={pixelClip("4px")}
                    className="bg-[#0D2734] p-[2px]"
                  >
                    <div
                      style={pixelClip("4px")}
                      className="flex items-center gap-1.5 bg-white px-3 py-1.5 text-[11px] uppercase leading-none tracking-[0.04em] text-[#287EB1]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.6}
                        strokeLinecap="square"
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      >
                        <path d="M10.5 13.5a4 4 0 0 0 5.66.06l2.4-2.4a4 4 0 0 0-5.66-5.66l-1.38 1.38" />
                        <path d="M13.5 10.5a4 4 0 0 0-5.66-.06l-2.4 2.4a4 4 0 0 0 5.66 5.66l1.38-1.38" />
                      </svg>
                      <span>{t("story.linkStickerLabel")}</span>
                    </div>
                  </div>
                </div>

                {/* Srce + kartica donatora */}
                <div className="mt-4 flex flex-1 items-center justify-center">
                  <div className="relative w-full max-w-[260px] overflow-visible">
                    <img
                      ref={heartImageRef}
                      alt=""
                      aria-hidden="true"
                      loading="eager"
                      decoding="sync"
                      className="block h-auto w-full"
                      style={{ imageRendering: "pixelated" }}
                    />

                    <div
                      className="absolute z-20 w-[205px] -translate-x-1/2 border-[3px] border-[#0D2734] bg-white p-2 shadow-[4px_4px_0_#0D2734]"
                      style={{
                        left: `${donorCardLeft}%`,
                        top: `calc(${donorCardTop}% + 10px)`,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex size-11 shrink-0 items-center justify-center border-[3px] border-[#0D2734] text-[10px] leading-none text-white"
                          style={{ backgroundColor: donation.color }}
                        >
                          #{donation.id}
                        </div>

                        {/* Motivaciona poruka umesto imena donatora */}
                        <div className="min-w-0 text-left uppercase text-[#0D2734]">
                          <p className="text-[12px] leading-[1.15]">
                            {t("story.cardMessage.mine")}
                          </p>
                          <p className="mt-1 text-[12px] leading-[1.15] text-[#E52336]">
                            {t("story.cardMessage.question")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kontrole */}
      <div className="flex flex-col justify-center">
        <p className="flex items-center gap-2 text-[12px] uppercase tracking-[0.08em] text-[#E52336] pr-12">
          <PixelHeartIcon className="size-4" />
          {t("controls.eyebrow")}
        </p>

        <h2
          id="story-title"
          className="mt-2 break-words pr-12 text-[30px] uppercase leading-[0.95] tracking-[-0.01em] text-[#0D2734] sm:text-[36px]"
        >
          {t("controls.title")}
        </h2>

        <ol className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex items-center gap-3 text-[13px] leading-[1.35] text-[#0D2734]"
            >
              <span
                style={pixelClip("3px")}
                className="flex size-8 shrink-0 items-center justify-center bg-[#0D2734] text-[14px] leading-none text-white"
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {/* Glavno dugme: isti stil kao CTA u CampaignWidget */}
        <button
          type="button"
          onClick={shareToInstagram}
          disabled={!storyFile}
          style={pixelClip()}
          className={[
            "group mt-7 block w-full bg-[#0D2734] p-[3px]",
            "transition active:translate-y-[2px]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336] focus-visible:ring-offset-2",
            "disabled:cursor-wait disabled:active:translate-y-0",
          ].join(" ")}
        >
          <span
            style={pixelClip()}
            className={[
              "flex min-h-[56px] items-center justify-center gap-3",
              "bg-[#E8172B] px-5 text-[17px] uppercase leading-none tracking-[0.03em] text-white",
              "shadow-[inset_0_4px_0_#FF5564,inset_0_-5px_0_#B5111F]",
              "transition group-hover:bg-[#F0202F] group-disabled:bg-[#E8172B]/60",
            ].join(" ")}
          >
            {isPreparing ? (
              <>
                <PixelLoader />
                {t("controls.preparing")}
              </>
            ) : (
              t("controls.shareButton")
            )}
          </span>
        </button>

        {/* Sporedno dugme: pregled slike */}
        {storyFile && (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            style={pixelClip()}
            className="group mt-3 block w-full bg-[#0D2734] p-[3px] transition active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E52336] focus-visible:ring-offset-2"
          >
            <span
              style={pixelClip()}
              className="flex min-h-[48px] items-center justify-center bg-[#FFF6EB] px-5 text-[14px] uppercase leading-none tracking-[0.03em] text-[#0D2734] transition group-hover:bg-white"
            >
              {t("controls.previewButton")}
            </span>
          </button>
        )}

        {shareStatus && (
          <p
            role="status"
            className="mt-4 border-[3px] border-[#0D2734] bg-white px-4 py-3 text-center text-[12px] leading-[1.4] text-[#0D2734]"
          >
            {shareStatus}
          </p>
        )}
      </div>
    </>
  );
}