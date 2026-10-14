"use client";

import { ReactNode, useRef, useState } from "react";
import { Scene } from "../Scene";
import { Btn, Row, Transport } from "../Controls";
import { useNarrow, useTimeline } from "../hooks";
import { C, easeInOut, easeInOutSpeed, lerp, pop, seg, squash } from "../motion";
import { Arrow, DimensionCorner, Ripple, labelStyle } from "../primitives";

const DURATION = 5.6;
const WIDE: [number, number] = [960, 500];
const NARROW: [number, number] = [600, 600];

export function PointToLine({ children, hint }: { children?: ReactNode; hint?: string }) {
  const ref = useRef<HTMLElement>(null);
  const narrow = useNarrow();
  const tl = useTimeline("point-line", DURATION, ref);
  const [coords, setCoords] = useState(false);
  const [W, H] = narrow ? NARROW : WIDE;
  const t = tl.t;

  const cy = H * (narrow ? 0.54 : 0.56);
  const x0 = W * (narrow ? 0.14 : 0.2);
  const x1 = W * (narrow ? 0.86 : 0.8);
  const r = narrow ? 19 : 17;

  const appear = pop(t, 0.15, 0.55);
  const m = seg(t, 1.7, 4.0);
  const e = easeInOut(m);
  const x = lerp(x0, x1, e);
  const moving = m > 0 && m < 1;
  const [sx, sy] = moving ? squash(easeInOutSpeed(m)) : [1, 1];
  const settle = seg(t, 4.0, 4.35);
  const wobble = settle > 0 && settle < 1 ? Math.sin(settle * Math.PI) * 0.22 : 0;
  const arrowIn = pop(t, 4.25, 0.55);
  const labelIn = seg(t, 4.5, 5.0);
  const corner = seg(t, 2.75, 3.25);

  return (
    <Scene
      figRef={ref}
      id="point-line"
      fig={1}
      band={C.chartreuse}
      ink={C.navy}
      wide={WIDE}
      narrow={NARROW}
      isNarrow={narrow}
      title="A point moves to the right and leaves a line behind it."
      caption={children}
      hint={hint ?? "Scrub to move the point, or jump between stages"}
      timeline={tl}
      controls={
        <>
          <Transport
            tl={tl}
            steps={[
              { label: "A point", t: 1.4 },
              { label: "Moving", t: 2.85 },
              { label: "A line", t: DURATION },
            ]}
          />
          <Row>
            <Btn pressed={coords} onClick={() => setCoords((v) => !v)}>
              Show the one number you need
            </Btn>
          </Row>
        </>
      }
    >
      <DimensionCorner W={W} H={H} n0={0} n1={1} word0="POINT" word1="LINE" p={corner} numColor={C.blue} wordColor={C.navy} narrow={narrow} />

      {/* The line it leaves behind */}
      {m > 0 && <line x1={x0} y1={cy} x2={x} y2={cy} stroke={C.blue} strokeWidth={8} strokeLinecap="round" />}

      {/* Where it started */}
      {m > 0.04 && <circle cx={x0} cy={cy} r={9} fill={C.chartreuse} stroke={C.red} strokeWidth={3} opacity={seg(m, 0.04, 0.15)} />}

      <Ripple x={x0} y={cy} p={seg(t, 0.55, 1.75)} color={C.red} r0={r + 6} r1={narrow ? 120 : 130} />
      <Ripple x={x1} y={cy} p={seg(t, 4.0, 5.0)} color={C.blue} r0={r + 4} r1={70} rings={2} />

      {/* The point */}
      <g transform={`translate(${x} ${cy}) scale(${appear * sx * (1 + wobble)} ${appear * sy * (1 - wobble)})`}>
        <circle r={r} fill={C.red} />
      </g>

      {/* Its one dimension */}
      {arrowIn > 0 && (
        <g transform={`translate(${(x0 + x1) / 2} ${cy + 64}) scale(${arrowIn} 1)`}>
          <Arrow x1={-(x1 - x0) / 2} y1={0} x2={(x1 - x0) / 2} y2={0} color={C.navy} width={4} both />
        </g>
      )}
      <text
        x={(x0 + x1) / 2}
        y={cy + 104}
        textAnchor="middle"
        fontSize={narrow ? 22 : 20}
        fill={C.navy}
        opacity={labelIn}
        style={labelStyle}
      >
        LENGTH · ONE DIRECTION
      </text>

      {coords && (
        <g aria-hidden="true">
          {[0, 0.25, 0.5, 0.75, 1].map((v) => {
            const tx = lerp(x0, x1, v);
            return (
              <g key={v}>
                <line x1={tx} y1={cy - 16} x2={tx} y2={cy + 16} stroke={C.navy} strokeWidth={2} opacity={0.5} />
                <text x={tx} y={cy - 26} textAnchor="middle" fontSize={16} fill={C.navy} opacity={0.6} style={labelStyle}>
                  {v}
                </text>
              </g>
            );
          })}
          <g transform={`translate(${x} ${cy - 66})`}>
            <rect x={-58} y={-24} width={116} height={36} rx={18} fill={C.navy} />
            <text x={0} y={2} textAnchor="middle" fontSize={18} fill={C.chartreuse} style={labelStyle}>
              x = {e.toFixed(2)}
            </text>
          </g>
        </g>
      )}
    </Scene>
  );
}
