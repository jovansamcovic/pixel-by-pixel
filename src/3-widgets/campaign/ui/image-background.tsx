export const ImageBackground = () => {
  return (
    <img
      src="/city.svg"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 block w-full select-none opacity-20"
      style={{ imageRendering: "pixelated" }}
    />
  );
};
