"use client";

import { ReactNode, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Scene } from "../Scene";
import { Btn, Range, Row } from "../Controls";
import { useNarrow, useTimeline } from "../hooks";
import { C, easeInOut, lerp, pop, seg } from "../motion";
import { Arrow, DimensionCorner, Hatch, Ripple, labelStyle } from "../primitives";

const DURATION = 6.2;
const SWEEP_START = 1.8;
const SWEEP_LEN = 2.5;
const WIDE: [number, number] = [960, 540];
const NARROW: [number, number] = [600, 620];

export function LineToSquare({ children, hint }: { children?: ReactNode; hint?: string }) {
  const ref = useRef<HTMLElement>(null);
  const narrow = useNarrow();
  const tl = useTimeline("line-square", DURATION, ref);
  const [labels, setLabels] = useState(false);
  const [W, H] = narrow ? NARROW : WIDE;
  const t = tl.t;

  const s = narrow ? 290 : 300;
  const cx = narrow ? W / 2 : W * 0.53;
  const cy = H * (narrow ? 0.5 : 0.5);
  const xL = cx - s / 2;
  const xR = cx + s / 2;
  const y0 = cy + s / 2;
  const y1 = cy - s / 2;

  const lineIn = pop(t, 0.15, 0.6);
  const endsIn = [pop(t, 0.6, 0.45), pop(t, 0.75, 0.45)];
  const nudge = seg(t, 0.95, 1.35) * (1 - seg(t, 1.7, 2.0));
  const m = seg(t, SWEEP_START, SWEEP_START + SWEEP_LEN);
  const e = easeInOut(m);
  const y = lerp(y0, y1, e);
  const corner = seg(t, 3.0, 3.5);
  const arrows = pop(t, 4.55, 0.55);
  const arrowLabels = seg(t, 4.8, 5.3);

  const seekSweep = (v: number) => {
    tl.pause();
    tl.seek(v >= 0.999 ? DURATION : SWEEP_START + v * SWEEP_LEN);
  };

  return (
    <Scene
      figRef={ref}
      id="line-square"
      fig={2}
      band={C.violet}
      ink={C.white}
      wide={WIDE}
      narrow={NARROW}
      isNarrow={narrow}
      title="A horizontal line slides upward, and its two ends trace the sides of a square."
      caption={children}
      hint={hint ?? "Drag the slider to push the line sideways into a new direction"}
      timeline={tl}
      controls={
        <>
          <Row>
            <Btn solid onClick={tl.toggle} label={tl.playing ? "Pause" : "Play"}>
              {tl.playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
              <span>{tl.playing ? "Pause" : "Play"}</span>
            </Btn>
            <Btn onClick={tl.replay}>
              <RotateCcw size={16} aria-hidden />
              <span>Replay</span>
            </Btn>
            <Btn pressed={labels} onClick={() => setLabels((v) => !v)}>
              Label the parts
            </Btn>
          </Row>
          <Range
            wide
            label="Move the line"
            min={0}
            max={1}
            step={0.01}
            value={m}
            onChange={seekSweep}
            minLabel="start"
            maxLabel="square"
            valueText={`Line moved ${Math.round(m * 100)}% of the way`}
          />
        </>
      }
    >
      <defs>
        <Hatch id="ls-hatch" color={C.lavender} gap={14} width={3} />
      </defs>

      <DimensionCorner W={W} H={H} n0={1} n1={2} word0="LINE" word1="SQUARE" p={corner} numColor={C.sky} wordColor={C.white} narrow={narrow} />

      {/* The area it sweeps */}
      {m > 0 && <rect x={xL} y={y} width={s} height={y0 - y} fill="url(#ls-hatch)" opacity={0.9} />}

      {/* Traced edges */}
      {m > 0 && (
        <g stroke={C.sky} strokeWidth={6} strokeLinecap="round">
          <line x1={xL} y1={y0} x2={xL} y2={y} />
          <line x1={xR} y1={y0} x2={xR} y2={y} />
        </g>
      )}

      {/* The original segment stays where it was */}
      {m > 0 && <line x1={xL} y1={y0} x2={xR} y2={y0} stroke={C.white} strokeWidth={6} strokeLinecap="round" opacity={0.95} />}

      {/* Direction hint before it moves */}
      {nudge > 0 && <Arrow x1={cx} y1={y0 - 26} x2={cx} y2={y0 - 26 - 70 * nudge} color={C.yellow} width={4} opacity={nudge} />}

      {/* The moving segment */}
      <g transform={`translate(${cx} ${y}) scale(${lineIn} 1)`}>
        <line x1={-s / 2} y1={0} x2={s / 2} y2={0} stroke={C.white} strokeWidth={7} strokeLinecap="round" />
      </g>
      <circle cx={xL} cy={y} r={11 * endsIn[0]} fill={C.red} />
      <circle cx={xR} cy={y} r={11 * endsIn[1]} fill={C.red} />

      <Ripple x={cx} y={cy} p={seg(t, SWEEP_START + SWEEP_LEN, SWEEP_START + SWEEP_LEN + 1.1)} color={C.lavender} r0={40} r1={s * 0.9} />

      {/* Two independent directions */}
      {arrows > 0 && (
        <>
          <g transform={`translate(${cx} ${y0 + 54}) scale(${arrows} 1)`}>
            <Arrow x1={-s / 2} y1={0} x2={s / 2} y2={0} color={C.yellow} width={4} both />
          </g>
          <g transform={`translate(${xR + 48} ${cy}) scale(1 ${arrows})`}>
            <Arrow x1={0} y1={s / 2} x2={0} y2={-s / 2} color={C.yellow} width={4} both />
          </g>
        </>
      )}
      <g opacity={arrowLabels} style={labelStyle} fontSize={narrow ? 19 : 18} fill={C.yellow}>
        <text x={cx} y={y0 + 88} textAnchor="middle">LENGTH</text>
        <text x={xR + 84} y={cy} textAnchor="middle" transform={`rotate(90 ${xR + 84} ${cy})`}>BREADTH</text>
      </g>

      {labels && (
        <g style={labelStyle} fontSize={15} aria-hidden="true">
          <text x={cx} y={y0 + 28} textAnchor="middle" fill={C.white}>ORIGINAL LINE</text>
          {m > 0.12 && (
            <text x={cx} y={y - 20} textAnchor="middle" fill={C.white}>THE SAME LINE, MOVED</text>
          )}
          {m > 0.25 && (
            <text x={xL - 22} y={(y + y0) / 2} textAnchor="middle" fill={C.sky} transform={`rotate(-90 ${xL - 22} ${(y + y0) / 2})`}>
              EDGES TRACED BY THE ENDS
            </text>
          )}
        </g>
      )}
    </Scene>
  );
}
