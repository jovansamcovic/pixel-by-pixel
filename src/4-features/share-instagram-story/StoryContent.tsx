"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getFontEmbedCSS, toBlob } from "html-to-image";

import type { DonationRecord } from "@/src/5-entities/donation/DonationBadge";
import {
  HEART_COLUMNS,
  HEART_PIXELS,
  HEART_ROWS,
  isInitiallySold,
} from "@/src/5-entities/heart-pixel/PixelHeart";

type StoryContentProps = {
  donation: DonationRecord;
};

type StoryCopy = {
  fileName: string;
  imageError: string;
};

const COLORS = {
  cream: "#FFF6EB",
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

const createStoryHeartDataUrl = (
  donation: DonationRecord,
): string => {
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
    context.strokeStyle = "#102F3B";
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

  return new File(
    [blob],
    `${copy.fileName}-${donation.id}.png`,
    {
      type: "image/png",
    },
  );
};

export function StoryContent({
  donation,
}: StoryContentProps) {
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
        const heartDataUrl = createStoryHeartDataUrl(donation);

        heartImage.src = heartDataUrl;

        await waitForImage(heartImage);
        await nextPaint();

        const file = await createInstagramStory(
          previewElement,
          donation,
          copy,
        );

        if (!cancelled) {
          setStoryFile(file);
          setIsPreparing(false);
        }
      } catch (error) {
        console.error("Instagram story generation failed:", error);

        if (!cancelled) {
          setIsPreparing(false);
          setShareStatus(
            t("status.preparationFailed"),
          );
        }
      }
    };

    void prepareStory();

    return () => {
      cancelled = true;
    };
  }, [donation, locale, t]);

  const downloadStory = () => {
    if (!storyFile) {
      return;
    }

    const url = URL.createObjectURL(storyFile);
    const link = document.createElement("a");

    link.href = url;
    link.download = storyFile.name;
    link.click();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);

    setShareStatus(t("status.downloaded"));
  };

  const shareToInstagram = async () => {
    if (!storyFile) {
      return;
    }

    try {
      const canShareFile =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({
          files: [storyFile],
        });

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
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
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
        Math.max(
          ((selectedHeartPixel.col + 0.5) /
            HEART_COLUMNS) *
            100,
          28,
        ),
        72,
      )
    : 50;

  const donorCardTop = selectedHeartPixel
    ? ((selectedHeartPixel.row + 1) /
        HEART_ROWS) *
      100
    : 100;

  return (
    <>
      {/* Story preview */}
      <div
        role={previewOpen ? "dialog" : undefined}
        aria-modal={
          previewOpen ? true : undefined
        }
        aria-labelledby={
          previewOpen
            ? "story-preview-title"
            : undefined
        }
        aria-hidden={!previewOpen}
        className={
          previewOpen
            ? [
                "fixed inset-0 z-[120]",
                "flex items-center justify-center",
                "overflow-y-auto",
                "bg-[#0D2734]/85",
                "p-4 backdrop-blur-md",
                "sm:p-6",
              ].join(" ")
            : [
                "pointer-events-none",
                "fixed left-0 top-0",
                "z-[-1]",
                "flex h-[720px] w-[500px]",
                "items-center justify-center",
              ].join(" ")
        }
      >
        <div className="relative flex w-full max-w-md items-center justify-center rounded-[32px] bg-[#F4E8DD] p-5 shadow-[0_30px_100px_rgba(13,39,52,0.45)] sm:p-8">
          <h2
            id="story-preview-title"
            className="sr-only"
          >
            {t("preview.modalTitle")}
          </h2>

          <button
            type="button"
            onClick={() =>
              setPreviewOpen(false)
            }
            aria-label={t(
              "preview.closeLabel",
            )}
            className={[
              "absolute right-3 top-3 z-20",
              "h-10 w-10",
              "items-center justify-center",
              "rounded-full",
              "border border-[#0D2734]/10",
              "bg-white",
              "text-xl text-[#0D2734]",
              "shadow-sm transition",
              "hover:bg-[#D6384B]",
              "hover:text-white",
              "focus-visible:outline-none",
              previewOpen
                ? "flex"
                : "hidden",
            ].join(" ")}
          >
            ×
          </button>

          <div
            ref={storyPreviewRef}
            aria-label={t(
              "preview.ariaLabel",
            )}
            className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[28px] bg-[#FFF6EB] shadow-[0_24px_60px_rgba(13,39,52,0.18)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(#D6384B 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />

            <div className="relative flex h-full flex-col p-6">
              <header className="flex items-center justify-between gap-3">
                <img
                  src="/logo.svg"
                  alt={t("brandName")}
                  loading="eager"
                  decoding="sync"
                  className="h-8 w-auto"
                />
              </header>

              <div className="text-center">
                <h3 className="mt-3 font-serif text-[28px] font-bold leading-[1.05] tracking-[-0.03em] text-[#0D2734]">
                  {t("story.title.first")}

                  <span className="block text-[#D6384B]">
                    {t(
                      "story.title.highlighted",
                    )}
                  </span>

                  {t("story.title.last")}
                </h3>
              </div>

              <div className="mt-auto flex justify-center pt-6">
                <div className="inline-flex items-center justify-center gap-1 rounded-[16px] bg-white px-5 py-1.5 text-[12px] font-bold uppercase tracking-[0.04em] text-[#287EB1]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0"
                  >
                    <path d="M10.5 13.5a4 4 0 0 0 5.66.06l2.4-2.4a4 4 0 0 0-5.66-5.66l-1.38 1.38" />
                    <path d="M13.5 10.5a4 4 0 0 0-5.66-.06l-2.4 2.4a4 4 0 0 0 5.66 5.66l1.38-1.38" />
                  </svg>

                  <span>
                    {t(
                      "story.linkStickerLabel",
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-1 items-center justify-center">
                <div className="relative w-full max-w-[260px] overflow-visible">
                  <img
                    ref={heartImageRef}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    decoding="sync"
                    className="block h-auto w-full"
                    style={{
                      imageRendering: "pixelated",
                    }}
                  />

                  <div
                    className={[
                      "absolute z-20",
                      "w-[205px]",
                      "-translate-x-1/2",
                      "rounded-xl bg-white",
                      "p-2.5",
                    ].join(" ")}
                    style={{
                      left: `${donorCardLeft}%`,
                      top: `calc(${donorCardTop}% + 8px)`,
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-[#0D2734] text-[10px] font-extrabold text-white"
                        style={{
                          backgroundColor:
                            donation.color,
                        }}
                      >
                        #{donation.id}
                      </div>

                      <div className="min-w-0 text-left">
                        <strong className="mt-0.5 block truncate font-serif text-sm text-[#0D2734]">
                          {donation.name ||
                            t(
                              "story.anonymousDonor",
                            )}
                        </strong>

                        <p className="mt-0.5 line-clamp-1 text-[7px] text-[#6D7475]">
                          „
                          {donation.message ||
                            t(
                              "story.defaultMessage",
                            )}
                          ”
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

      {/* Controls */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
        <h2
          id="story-title"
          className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#0D2734]"
        >
          {t("controls.title")}
        </h2>

        <ol className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex items-center gap-4 text-sm font-semibold text-[#0D2734]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCE4E1] text-xs font-extrabold text-[#D6384B]">
                {index + 1}
              </span>

              {step}
            </li>
          ))}
        </ol>

        {storyFile && (
          <button
            type="button"
            onClick={() =>
              setPreviewOpen(true)
            }
            className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#D6384B] bg-white px-6 text-sm font-extrabold text-[#D6384B] transition hover:bg-[#D6384B] hover:text-white focus-visible:outline-none"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
              <circle
                cx="12"
                cy="12"
                r="2.5"
              />
            </svg>

            {t("controls.previewButton")}
          </button>
        )}

        <button
          type="button"
          onClick={shareToInstagram}
          disabled={!storyFile}
          className={[
            storyFile ? "mt-3" : "mt-9",
            "inline-flex min-h-14 w-full",
            "items-center justify-center",
            "gap-3 rounded-2xl",
            "bg-[#D6384B] px-6",
            "text-sm font-extrabold text-white",
            "shadow-[0_12px_30px_rgba(214,56,75,0.2)]",
            "transition",
            "hover:-translate-y-0.5",
            "hover:bg-[#BF2F41]",
            "disabled:cursor-wait",
            "disabled:opacity-50",
          ].join(" ")}
        >
          {isPreparing ? (
            <>
              <span
                aria-hidden="true"
                className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />

              {t("controls.preparing")}
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>

              {t("controls.shareButton")}
            </>
          )}
        </button>

        {shareStatus && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-white px-4 py-3 text-center text-xs font-semibold text-[#0D2734] shadow-sm"
          >
            {shareStatus}
          </p>
        )}
      </div>
    </>
  );
}