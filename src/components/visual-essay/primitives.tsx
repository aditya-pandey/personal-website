"use client";

import { useId } from "react";
import { clamp01, easeOut, easeInOut } from "./motion";

/** Dashed concentric rings that spread from a point: the essay's "something new" emphasis. */
export function Ripple({
  x,
  y,
  p,
  color,
  r0 = 14,
  r1 = 90,
  rings = 3,
  width = 3,
}: {
  x: number;
  y: number;
  p: number;
  color: string;
  r0?: number;
  r1?: number;
  rings?: number;
  width?: number;
}) {
  if (p <= 0 || p >= 1) return null;
  return (
    <g aria-hidden="true">
      {Array.from({ length: rings }).map((_, i) => {
        const local = clamp01(p * 1.5 - i * 0.25);
        if (local <= 0 || local >= 1) return null;
        const r = r0 + (r1 - r0) * easeOut(local);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeDasharray={`${Math.max(4, r * 0.18)} ${Math.max(5, r * 0.22)}`}
            strokeLinecap="round"
            opacity={1 - local}
          />
        );
      })}
    </g>
  );
}

/**
 * A label that changes by sliding: the old value rises out of a window,
 * the new one rises into it.
 */
export function SlideLabel({
  x,
  y,
  from,
  to,
  p,
  size,
  color,
  weight = 900,
  spacing = 0,
  anchor = "start",
}: {
  x: number;
  y: number;
  from: string;
  to: string;
  p: number;
  size: number;
  color: string;
  weight?: number;
  spacing?: number;
  anchor?: "start" | "middle" | "end";
}) {
  const id = useId().replace(/:/g, "");
  const e = easeInOut(clamp01(p));
  const shift = size * 1.1;
  const style = { fontFamily: "var(--font-essay), ui-rounded, system-ui, sans-serif", fontWeight: weight, letterSpacing: spacing };
  return (
    <g aria-hidden="true">
      <clipPath id={`clip-${id}`}>
        <rect x={anchor === "start" ? x - 4 : x - size * 6} y={y - size * 1.0} width={size * 12} height={size * 1.25} />
      </clipPath>
      <g clipPath={`url(#clip-${id})`}>
        {e < 1 && (
          <text x={x} y={y - e * shift} fontSize={size} fill={color} style={style} textAnchor={anchor} opacity={1 - e}>
            {from}
          </text>
        )}
        {e > 0 && (
          <text x={x} y={y + (1 - e) * shift} fontSize={size} fill={color} style={style} textAnchor={anchor} opacity={e}>
            {to}
          </text>
        )}
      </g>
    </g>
  );
}

/** Corner furniture shared by every construction scene: "2." up top, "SQUARE" below. */
export function DimensionCorner({
  W,
  H,
  n0,
  n1,
  word0,
  word1,
  p,
  numColor,
  wordColor,
  narrow,
}: {
  W: number;
  H: number;
  n0: number;
  n1: number;
  word0: string;
  word1: string;
  p: number;
  numColor: string;
  wordColor: string;
  narrow: boolean;
}) {
  const pad = narrow ? 28 : 40;
  const numSize = narrow ? 64 : 76;
  const wordSize = narrow ? 24 : 26;
  void W;
  return (
    <g>
      <SlideLabel x={pad} y={pad + numSize * 0.78} from={`${n0}.`} to={`${n1}.`} p={p} size={numSize} color={numColor} />
      <text
        x={pad}
        y={pad + numSize * 0.78 + 30}
        fontSize={narrow ? 18 : 14}
        fill={wordColor}
        opacity={0.75}
        style={{ fontFamily: "var(--font-essay), ui-rounded, system-ui, sans-serif", fontWeight: 800, letterSpacing: 1.5 }}
        aria-hidden="true"
      >
        {(p >= 0.5 ? n1 : n0) === 1 ? "DIMENSION" : "DIMENSIONS"}
      </text>
      <SlideLabel x={pad} y={H - pad} from={word0} to={word1} p={p} size={wordSize} color={wordColor} weight={900} spacing={1.5} />
    </g>
  );
}

export function Hatch({ id, color, gap = 12, width = 3, angle = 45 }: { id: string; color: string; gap?: number; width?: number; angle?: number }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={gap} height={gap} patternTransform={`rotate(${angle})`}>
      <line x1={0} y1={0} x2={0} y2={gap} stroke={color} strokeWidth={width} />
    </pattern>
  );
}

/** A straight arrow with a rounded head. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 4,
  head = 14,
  both,
  opacity = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
  head?: number;
  both?: boolean;
  opacity?: number;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const tip = (x: number, y: number, ang: number) => {
    const l = [x - head * Math.cos(ang - 0.5), y - head * Math.sin(ang - 0.5)];
    const r = [x - head * Math.cos(ang + 0.5), y - head * Math.sin(ang + 0.5)];
    return `M${l[0]},${l[1]} L${x},${y} L${r[0]},${r[1]}`;
  };
  return (
    <g stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={opacity} aria-hidden="true">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <path d={tip(x2, y2, a)} />
      {both && <path d={tip(x1, y1, a + Math.PI)} />}
    </g>
  );
}

export const labelStyle = {
  fontFamily: "var(--font-essay), ui-rounded, system-ui, sans-serif",
  fontWeight: 800,
  letterSpacing: 1,
} as const;
