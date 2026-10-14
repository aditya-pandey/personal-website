"use client";

import { ReactNode, useRef, useState } from "react";
import { Scene } from "../Scene";
import { Btn, Range, Row, Transport } from "../Controls";
import { useDragRotate, useNarrow, useTimeline } from "../hooks";
import { useEssayMode } from "../mode";
import { C, clamp, easeInOut, pop, seg } from "../motion";
import { Camera, V3, project3, rotate3 } from "../geometry";
import { DimensionCorner, Ripple, labelStyle } from "../primitives";

const DURATION = 7.2;
const WIDE: [number, number] = [960, 560];
const NARROW: [number, number] = [600, 640];

const CORNERS: [number, number][] = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

type View = { yaw: number; pitch: number };

export function SquareToCube({ children, hint }: { children?: ReactNode; hint?: string }) {
  const ref = useRef<HTMLElement>(null);
  const narrow = useNarrow();
  const explore = useEssayMode() === "explore";
  const tl = useTimeline("square-cube", DURATION, ref);
  const [userView, setUserView] = useState<View | null>(null);
  const [W, H] = narrow ? NARROW : WIDE;
  const t = tl.t;

  // --- timeline ---
  const appear = pop(t, 0.15, 0.6);
  const turn = easeInOut(seg(t, 0.9, 2.1));
  const settle = easeInOut(seg(t, 5.0, 7.0));
  const planeIn = seg(t, 1.2, 1.8) * (1 - 0.55 * seg(t, 5.0, 6.0));
  const arrowIn = pop(t, 2.1, 0.5) * (1 - seg(t, 4.6, 5.2));
  const m = seg(t, 2.6, 4.9);
  const d = 2 * easeInOut(m);
  const corner = seg(t, 3.6, 4.1);

  const autoView: View = { yaw: -0.62 * turn - 0.2 * settle, pitch: 0.36 * turn + 0.05 * settle };
  const view = userView ?? autoView;

  const drag = useDragRotate(explore, (dx, dy) => {
    setUserView((v) => {
      const base = v ?? autoView;
      return { yaw: base.yaw + dx * 0.012, pitch: clamp(base.pitch + dy * 0.012, -1.3, 1.3) };
    });
  });

  // --- projection ---
  const cam: Camera = { cx: narrow ? W / 2 : W * 0.56, cy: H * (narrow ? 0.53 : 0.5), scale: narrow ? 92 : 104, dist: 7 };
  const center: V3 = [0, 0, -1];
  const P = (p: V3) => {
    const r = rotate3([p[0] - center[0], p[1] - center[1], p[2] - center[2]], view.yaw, view.pitch);
    return project3(r, cam);
  };
  const eye: V3 = [0, 0, cam.dist];
  const backFacing = (n: V3, c: V3) => {
    const nr = rotate3(n, view.yaw, view.pitch);
    const cr = rotate3([c[0] - center[0], c[1] - center[1], c[2] - center[2]], view.yaw, view.pitch);
    return nr[0] * (cr[0] - eye[0]) + nr[1] * (cr[1] - eye[1]) + nr[2] * (cr[2] - eye[2]) > 0;
  };

  const sc = appear;
  const F: V3[] = CORNERS.map(([x, y]) => [x * sc, y * sc, 0]);
  const M: V3[] = CORNERS.map(([x, y]) => [x * sc, y * sc, -d]);
  const f2 = F.map(P);
  const m2 = M.map(P);

  const solid = d > 0.04;
  const faceBack = {
    front: backFacing([0, 0, 1], [0, 0, 0]),
    back: backFacing([0, 0, -1], [0, 0, -d]),
    xp: backFacing([1, 0, 0], [1, 0, -d / 2]),
    xn: backFacing([-1, 0, 0], [-1, 0, -d / 2]),
    yp: backFacing([0, 1, 0], [0, 1, -d / 2]),
    yn: backFacing([0, -1, 0], [0, -1, -d / 2]),
  };
  const sideOf = (a: number, b: number): (keyof typeof faceBack)[] => {
    const [ax, ay] = CORNERS[a];
    const by = CORNERS[b][1];
    if (ay === by) return [ay > 0 ? "yp" : "yn"];
    return [ax > 0 ? "xp" : "xn"];
  };
  const hidden = (faces: (keyof typeof faceBack)[]) => solid && faces.every((f) => faceBack[f]);

  type E = { a: [number, number]; b: [number, number]; kind: "orig" | "moved" | "trace"; hidden: boolean; key: string };
  const edges: E[] = [];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    const side = sideOf(i, j);
    edges.push({ a: [f2[i][0], f2[i][1]], b: [f2[j][0], f2[j][1]], kind: "orig", hidden: hidden(["front", ...side]), key: `o${i}` });
    if (solid) {
      edges.push({ a: [m2[i][0], m2[i][1]], b: [m2[j][0], m2[j][1]], kind: "moved", hidden: hidden(["back", ...side]), key: `m${i}` });
      const [cx_, cy_] = CORNERS[i];
      edges.push({
        a: [f2[i][0], f2[i][1]],
        b: [m2[i][0], m2[i][1]],
        kind: "trace",
        hidden: hidden([cx_ > 0 ? "xp" : "xn", cy_ > 0 ? "yp" : "yn"]),
        key: `t${i}`,
      });
    }
  }
  const color = { orig: C.navy, moved: C.red, trace: C.violet };

  const plane = [
    [-1.6, -1.6],
    [1.6, -1.6],
    [1.6, 1.6],
    [-1.6, 1.6],
  ].map(([x, y]) => P([x, y, 0]));
  const arrowTip = P([0, 0, -1.5]);
  const arrowBase = P([0, 0, 0]);
  const mid = P([0, 0, -d / 2]);

  const poly = (pts: number[][]) => pts.map((p) => `${p[0]},${p[1]}`).join(" ");

  return (
    <Scene
      figRef={ref}
      id="square-cube"
      fig={3}
      band={C.pink}
      ink={C.navy}
      wide={WIDE}
      narrow={NARROW}
      isNarrow={narrow}
      title="A square turns to show the plane it lies in, then moves out of that plane; its corners trace the edges of a cube."
      caption={children}
      hint={hint ?? "Scrub to build the cube. Drag the drawing, or use the sliders, to turn it"}
      timeline={tl}
      draggable
      svgProps={{ ...drag, style: explore ? { touchAction: "none" } : undefined }}
      controls={
        <>
          <Transport
            tl={tl}
            steps={[
              { label: "A square", t: 0.85 },
              { label: "Its plane", t: 2.5 },
              { label: "Moving out", t: 3.75 },
              { label: "A cube", t: DURATION },
            ]}
          />
          <Range
            label="Turn"
            min={-Math.PI}
            max={Math.PI}
            value={((view.yaw + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI}
            onChange={(v) => setUserView({ yaw: v, pitch: view.pitch })}
            valueText={`${Math.round((view.yaw * 180) / Math.PI)} degrees`}
          />
          <Range
            label="Tilt"
            min={-1.3}
            max={1.3}
            value={view.pitch}
            onChange={(v) => setUserView({ yaw: view.yaw, pitch: v })}
            valueText={`${Math.round((view.pitch * 180) / Math.PI)} degrees`}
          />
          <Row>
            <Btn onClick={() => setUserView(null)} disabled={!userView}>
              Reset view
            </Btn>
          </Row>
        </>
      }
    >
      <DimensionCorner W={W} H={H} n0={2} n1={3} word0="SQUARE" word1="CUBE" p={corner} numColor={C.violet} wordColor={C.navy} narrow={narrow} />

      {/* The square's own plane */}
      {planeIn > 0 && (
        <polygon points={poly(plane)} fill="none" stroke={C.navy} strokeWidth={2.5} strokeDasharray="10 10" opacity={0.45 * planeIn} />
      )}
      {planeIn > 0.6 && (
        <text
          x={plane[1][0] + 10}
          y={plane[1][1] + 6}
          fontSize={15}
          fill={C.navy}
          opacity={0.6 * planeIn}
          style={labelStyle}
          aria-hidden="true"
        >
          ITS PLANE
        </text>
      )}

      {/* Moving face */}
      {solid && <polygon points={poly(m2)} fill={C.red} opacity={0.22 + 0.5 * (1 - seg(t, 5.0, 6.2))} />}

      {/* Hidden edges first, dashed */}
      {edges
        .filter((e) => e.hidden)
        .map((e) => (
          <line key={e.key} x1={e.a[0]} y1={e.a[1]} x2={e.b[0]} y2={e.b[1]} stroke={color[e.kind]} strokeWidth={3} strokeDasharray="7 9" strokeLinecap="round" opacity={0.55} />
        ))}
      {edges
        .filter((e) => !e.hidden)
        .map((e) => (
          <line key={e.key} x1={e.a[0]} y1={e.a[1]} x2={e.b[0]} y2={e.b[1]} stroke={color[e.kind]} strokeWidth={e.kind === "trace" ? 5 : 6} strokeLinecap="round" />
        ))}

      {/* Original square fill (front) */}
      <polygon points={poly(f2)} fill={C.white} opacity={solid ? 0.18 : 0.35 * appear} />

      {/* New direction */}
      {arrowIn > 0 && (
        <g opacity={Math.min(1, arrowIn)}>
          <line x1={arrowBase[0]} y1={arrowBase[1]} x2={arrowTip[0]} y2={arrowTip[1]} stroke={C.violet} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 10" />
          <circle cx={arrowTip[0]} cy={arrowTip[1]} r={8} fill={C.violet} />
          <text x={arrowTip[0] + 16} y={arrowTip[1] - 12} fontSize={16} fill={C.violet} style={labelStyle} aria-hidden="true">
            A NEW DIRECTION
          </text>
        </g>
      )}

      {/* Corners: the original points, now moving */}
      {solid && m2.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={7} fill={C.red} />)}

      <Ripple x={mid[0]} y={mid[1]} p={seg(t, 4.9, 6.0)} color={C.violet} r0={60} r1={260} />
    </Scene>
  );
}
