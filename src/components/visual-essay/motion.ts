// Shared palette and easing for the visual essay.
// Palette: flat, saturated colour fields with a single red "protagonist" dot.

export const C = {
  chartreuse: "#DEE426",
  violet: "#5C00B3",
  forest: "#2A874C",
  pink: "#FFA8A5",
  red: "#E62B24",
  sky: "#44C7FE",
  blue: "#3B5CFF",
  yellow: "#FED618",
  lavender: "#A796FF",
  navy: "#16283F",
  white: "#FFFFFF",
} as const;

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const clamp01 = (v: number) => clamp(v, 0, 1);
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Progress of t through the window [a, b], clamped to 0..1. */
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/** Overshoot: lands at 1 after briefly passing it. Used for every "pop". */
export const back = (x: number) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const c1 = 1.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/** A shape popping into existence at time a over `dur` seconds. */
export const pop = (t: number, a: number, dur = 0.5) => back(seg(t, a, a + dur));

/** Squash & stretch from a normalised speed (0..1). Returns [sx, sy]. */
export const squash = (speed: number): [number, number] => {
  const s = clamp01(speed);
  return [1 + 0.35 * s, 1 - 0.2 * s];
};

/** Speed (0..1 normalised) of an easeInOut motion at progress p. */
export const easeInOutSpeed = (p: number) => {
  // derivative of easeInOut, normalised by its peak (1.5 at p = 0.5)
  const d = p < 0.5 ? 12 * p * p : 3 * Math.pow(-2 * p + 2, 2) / 2;
  return clamp01(d / 3);
};
