type CauseRingProps = {
  /** 0–100 */
  percent: number;
  color: string;
  trackColor?: string;
  /** Broj „piksel" segmenata u krugu */
  segments?: number;
  className?: string;
};

/**
 * Kružni progress bar od kvadratnih segmenata — prati piksel estetiku srca.
 * Popunjava se u smeru kazaljke, od vrha.
 */
export function CauseRing({
  percent,
  color,
  trackColor = "#E6D5BF",
  segments = 24,
  className,
}: CauseRingProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const lit = Math.round((clamped / 100) * segments);

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      {Array.from({ length: segments }, (_, index) => (
        <rect
          key={index}
          x={45.5}
          y={1}
          width={9}
          height={11}
          fill={index < lit ? color : trackColor}
          transform={`rotate(${(360 / segments) * index} 50 50)`}
        />
      ))}
    </svg>
  );
}
