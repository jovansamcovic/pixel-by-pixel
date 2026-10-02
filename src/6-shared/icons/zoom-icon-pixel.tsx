export function ZoomIcon({ type }: { type: "plus" | "minus" }) {
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