
type CloseIconProps = {
  size?: number;
  className?: string;
};

export function CloseIcon({
  size = 20,
  className,
}: CloseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 3L13 13M13 3L3 13" />
    </svg>
  );
}
