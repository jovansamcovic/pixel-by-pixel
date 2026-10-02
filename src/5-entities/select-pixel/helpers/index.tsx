export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type View = { scale: number; pan: Point };

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getDistance = (a: Point, b: Point) =>
  Math.hypot(b.x - a.x, b.y - a.y);

export const getMidpoint = (a: Point, b: Point): Point => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});
