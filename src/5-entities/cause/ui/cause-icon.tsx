import type { CauseIconName } from "../model/types";

type CauseIconProps = {
  name: CauseIconName;
  color?: string;
  className?: string;
};

const PATHS: Record<CauseIconName, React.ReactNode> = {
  incubator: (
    <>
      <rect x="3" y="9" width="18" height="10" rx="5" />
      <circle cx="9" cy="14" r="2" />
      <path d="M12 9V5M9 5h6" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  clinic: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
};

export function CauseIcon({ name, color = "currentColor", className }: CauseIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" className={className}>
      <path d="M2 1h2v1h2v1h2v1h1v2H8v1H6v1H4v1H2z" fill="currentColor" />
    </svg>
  );
}
