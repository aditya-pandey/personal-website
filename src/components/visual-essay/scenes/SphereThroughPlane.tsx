"use client";

import { ReactNode, useRef } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Scene } from "../Scene";
import { Btn, Range, Row } from "../Controls";
import { useNarrow, useTimeline } from "../hooks";
import { useEssayMode } from "../mode";
import { C, clamp, lerp, pop, seg } from "../motion";
import { Ripple, labelStyle } from "../primitives";

const DURATION = 9.6;
const PASS_START = 1.2;
const PASS_LEN = 7.2;
const H_MAX = 1.45; // sphere centre height, in sphere radii
const WIDE: [number, number] = [960, 600];
const NARROW: [number, number] = [600, 900];

/** The moments a Flatlander would remember. h is the sphere's centre above the plane, in radii. */
const STAMPS = [
  { h: 0.995, label: "POINT" },
  { h: 0.8, label: "SMALL" },
  { h: 0.45, label: "LARGER" },
  { h: 0, label: "LARGEST" },
  { h: -0.8, label: "SMALLER" },
  { h: -0.995, label: "POINT" },
  { h: -1.3, label: "NOTHING" },
];

const radiusAt = (h: number) => (Math.abs(h) < 1 ? Math.sqrt(1 - h * h) : 0);

export function SphereThroughPlane({ children, hint }: { children?: ReactNode; hint?: string }) {
  const ref = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<{ y: number; unit: number } | null>(null);
  const narrow = useNarrow();
  const explore = useEssayMode() === "explore";
  const tl = useTimeline("sphere-plane", DURATION, ref);
  const [W, H] = narrow ? NARROW : WIDE;
  const t = tl.t;

  const pass = seg(t, PASS_START, PASS_START + PASS_LEN);
  const h = lerp(H_MAX, -H_MAX, pass);
  const r = radiusAt(h);
  const touching = Math.abs(Math.abs(h) - 1) < 0.02;

  const tForH = (hv: number) => PASS_START + ((H_MAX - hv) / (2 * H_MAX)) * PASS_LEN;
  const setH = (hv: number) => {
    tl.pause();
    tl.seek(tForH(clamp(hv, -H_MAX, H_MAX)));
  };

  // --- layout ---
  const L = narrow
    ? { sx: W / 2, py: 205, R: 66, fx: 30, fy: 420, fw: W - 60, fh: 290, R2: 108, stripY: 790, stripX0: 44, stripX1: W - 44, sTitle: [30, 30], fTitle: [50, 452] }
    : { sx: 250, py: 240, R: 78, fx: 490, fy: 66, fw: 430, fh: 360, R2: 122, stripY: 500, stripX0: 110, stripX1: W - 110, sTitle: [40, 38], fTitle: [512, 100] };
  const fcx = L.fx + L.fw / 2;
  const fcy = L.fy + L.fh / 2 + (narrow ? 8 : 12);

  const planeIn = pop(t, 0.1, 0.6);
  const sphereIn = pop(t, 0.6, 0.5);
  const sphereY = L.py - h * L.R;
  const chord = r * L.R;

  const stampX = (i: number) => lerp(L.stripX0, L.stripX1, i / (STAMPS.length - 1));
  const nearest = STAMPS.reduce((best, s, i) => (Math.abs(s.h - h) < Math.abs(STAMPS[best].h - h) ? i : best), 0);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!explore || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const unit = Math.max(W / rect.width, H / rect.height);
    drag.current = { y: e.clientY, unit };
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dy = (e.clientY - drag.current.y) * drag.current.unit;
    drag.current.y = e.clientY;
    setH(h - dy / L.R);
  };
  const endDrag = () => {
    drag.current = null;
  };

  const hText = Math.abs(h) < 0.005 ? "level with the plane" : `${Math.abs(h).toFixed(2)} radii ${h > 0 ? "above" : "below"} the plane`;
  const rText = r > 0 ? `the circle's radius is ${r.toFixed(2)} of the sphere's` : "nothing appears in Flatland";

  return (
    <Scene
      figRef={ref}
      id="sphere-plane"
      fig={4}
      band={C.forest}
      ink={C.white}
      wide={WIDE}
      narrow={NARROW}
      isNarrow={narrow}
      title="A sphere passes down through a flat plane. Seen from the side, it cuts the plane along a line; inside the plane, that cut appears as a point, then a circle that grows, shrinks back to a point, and vanishes."
      caption={children}
      hint={hint ?? "Drag the sphere up and down, or use the slider. Watch what appears inside Flatland"}
      timeline={tl}
      draggable
      svgProps={{
        ref: svgRef,
        onPointerDown,
        onPointerMove,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
        style: explore ? { touchAction: "none" } : undefined,
      }}
      controls={
        <>
          <Row>
            <Btn solid onClick={tl.toggle} label={tl.playing ? "Pause" : "Play the pass"}>
              {tl.playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
              <span>{tl.playing ? "Pause" : "Play the pass"}</span>
            </Btn>
            <Btn onClick={tl.replay}>
              <RotateCcw size={16} aria-hidden />
              <span>Replay</span>
            </Btn>
          </Row>
          <Range
            wide
            label="Move the sphere"
            min={-H_MAX}
            max={H_MAX}
            step={0.005}
            value={-h}
            onChange={(v) => setH(-v)}
            minLabel="above"
            maxLabel="below"
            valueText={`Sphere centre ${hText}; ${rText}.`}
          />
          <p className="ve-readout">
            <span>Centre: {hText}</span>
            <span aria-hidden="true">·</span>
            <span>
              Circle radius r = √(1 − h²) = <b>{r.toFixed(2)}</b>
            </span>
          </p>
        </>
      }
    >
      {/* ---------- Side view ---------- */}
      <text x={L.sTitle[0]} y={L.sTitle[1]} fontSize={narrow ? 19 : 14} fill={C.white} opacity={0.75} style={labelStyle}>
        OUR VIEW, FROM THE SIDE
      </text>

      {sphereIn > 0 && (
        <g transform={`translate(${L.sx} ${sphereY}) scale(${sphereIn})`}>
          <circle r={L.R} fill={C.sky} />
          <ellipse cx={-L.R * 0.36} cy={-L.R * 0.42} rx={L.R * 0.22} ry={L.R * 0.13} fill={C.white} opacity={0.75} transform={`rotate(-30 ${-L.R * 0.36} ${-L.R * 0.42})`} />
        </g>
      )}

      {/* The plane, edge-on */}
      <g transform={`translate(${L.sx} ${L.py}) scale(${planeIn} 1)`}>
        <line x1={narrow ? -270 : -210} y1={0} x2={narrow ? 270 : 210} y2={0} stroke={C.white} strokeWidth={4} strokeLinecap="round" />
      </g>
      <text x={L.sx - (narrow ? 270 : 210)} y={L.py - 12} fontSize={narrow ? 16 : 13} fill={C.white} opacity={0.8 * planeIn} style={labelStyle}>
        FLATLAND
      </text>

      {/* Where they meet */}
      {sphereIn > 0.9 && r > 0 && (
        <line x1={L.sx - chord} y1={L.py} x2={L.sx + chord} y2={L.py} stroke={C.red} strokeWidth={7} strokeLinecap="round" />
      )}
      {sphereIn > 0.9 && touching && <circle cx={L.sx} cy={L.py} r={6} fill={C.red} />}

      {/* ---------- Inside Flatland ---------- */}
      <g opacity={planeIn}>
        <rect x={L.fx} y={L.fy} width={L.fw} height={L.fh} rx={26} fill="#3A9A5C" />
        {Array.from({ length: 7 }).map((_, i) =>
          Array.from({ length: 6 }).map((__, j) => (
            <circle
              key={`${i}-${j}`}
              cx={L.fx + ((i + 0.5) * L.fw) / 7}
              cy={L.fy + ((j + 0.5) * L.fh) / 6}
              r={3.2}
              fill={C.chartreuse}
              opacity={0.35}
            />
          )),
        )}
        <text x={L.fTitle[0]} y={L.fTitle[1]} fontSize={narrow ? 19 : 14} fill={C.white} opacity={0.85} style={labelStyle}>
          FLATLAND, SEEN FROM ABOVE
        </text>

        {/* A Square, watching */}
        <g transform={`translate(${L.fx + 52} ${L.fy + L.fh - 52})`}>
          <rect x={-18} y={-18} width={36} height={36} rx={4} fill={C.chartreuse} />
          <circle cx={7} cy={-4} r={4.5} fill={C.navy} />
        </g>
      </g>

      {/* What appears there */}
      {r > 0 && <circle cx={fcx} cy={fcy} r={Math.max(6, r * L.R2)} fill={C.red} />}
      {r === 0 && h < -1 && pass > 0 && (
        <circle cx={fcx} cy={fcy} r={L.R2} fill="none" stroke={C.white} strokeWidth={2} strokeDasharray="6 10" opacity={0.25} />
      )}
      <Ripple x={fcx} y={fcy} p={h <= 1 ? 1 - seg(h, 0.55, 1.0) : 0} color={C.red} r0={10} r1={90} rings={2} />

      {/* ---------- The record ---------- */}
      <line x1={L.stripX0 - 24} y1={L.stripY} x2={L.stripX1 + 24} y2={L.stripY} stroke={C.white} strokeWidth={2} opacity={0.25} />
      {STAMPS.map((s, i) => {
        const seen = explore || (pass > 0 && h <= s.h + 1e-6);
        if (!seen) return null;
        const sr = radiusAt(s.h);
        const x = stampX(i);
        const grow = explore ? 1 : pop(t, tForH(s.h), 0.4);
        const active = explore && i === nearest && Math.abs(STAMPS[i].h - h) < 0.12;
        return (
          <g key={i} transform={`translate(${x} ${L.stripY})`}>
            {active && <circle r={narrow ? 30 : 32} fill="none" stroke={C.yellow} strokeWidth={3} />}
            {sr > 0.05 ? (
              <circle r={Math.max(5, sr * (narrow ? 22 : 24)) * grow} fill={C.red} />
            ) : s.h > -1.1 ? (
              <circle r={5 * grow} fill={C.red} />
            ) : (
              <circle r={18 * grow} fill="none" stroke={C.white} strokeWidth={2} strokeDasharray="4 6" opacity={0.6} />
            )}
            <text y={narrow ? 46 : 50} textAnchor="middle" fontSize={narrow ? 14 : 12.5} fill={C.white} opacity={0.85 * Math.min(1, grow)} style={labelStyle}>
              {s.label}
            </text>
          </g>
        );
      })}
    </Scene>
  );
}
