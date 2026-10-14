"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Scene } from "../Scene";
import { Btn, Range, Row, Transport } from "../Controls";
import { useDragRotate, useNarrow, usePrefersReducedMotion, useTimeline } from "../hooks";
import { useEssayMode } from "../mode";
import { C, clamp, easeInOut, lerp, pop, seg } from "../motion";
import type { Camera, V4 } from "../geometry";
import { AXIS_NAME, CELLS, TESSERACT, cellHas, projectCube } from "../tesseract";
import { DimensionCorner, Ripple, labelStyle } from "../primitives";

const DURATION = 12;
const WIDE: [number, number] = [960, 600];
const NARROW: [number, number] = [600, 700];

type Highlight = "none" | "vertices" | "edges" | "cell";
const AXIS_COLOR = [C.sky, C.chartreuse, C.pink, C.red];
const wrap = (a: number) => ((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

export function Tesseract({ children, hint }: { children?: ReactNode; hint?: string }) {
  const ref = useRef<HTMLElement>(null);
  const narrow = useNarrow();
  const explore = useEssayMode() === "explore";
  const reduced = usePrefersReducedMotion();
  const tl = useTimeline("tesseract", DURATION, ref);
  const [W, H] = narrow ? NARROW : WIDE;
  const t = tl.t;

  const [view3, setView3] = useState<{ yaw: number; pitch: number } | null>(null);
  const [rot, setRot] = useState<{ xw: number; yw: number; zw: number } | null>(null);
  const [spin, setSpin] = useState(false);
  const [highlight, setHighlight] = useState<Highlight>("none");
  const [cell, setCell] = useState(7);
  const [construction, setConstruction] = useState(true);
  const [labels, setLabels] = useState(false);

  // --- timeline ---
  const appear = pop(t, 0.15, 0.6);
  const ghost = seg(t, 1.4, 2.0);
  const c = easeInOut(seg(t, 2.0, 5.0));
  const zoom = lerp(1.75, 1, easeInOut(seg(t, 1.6, 4.8)));
  const corner = seg(t, 3.6, 4.1);
  const wNote = seg(t, 2.2, 2.8) * (1 - seg(t, 5.2, 5.8));
  const badge = pop(t, 5.6, 0.55);
  const turn4 = easeInOut(seg(t, 6.4, 11.0));
  const counts = seg(t, 11.0, 11.8);

  const autoRot = { xw: Math.PI * turn4, yw: 0, zw: 0 };
  const r4 = rot ?? autoRot;
  const autoView = { yaw: -0.55 + 0.035 * t, pitch: 0.42 };
  const v3 = view3 ?? autoView;

  // Continuous 4D spin (explore only, stops when off-screen or toggled off)
  const spinning = spin && explore && !reduced;
  useEffect(() => {
    if (!spinning) return;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (el) io.observe(el);
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) setRot((r) => ({ ...(r ?? { xw: 0, yw: 0, zw: 0 }), xw: wrap((r?.xw ?? 0) + dt * 0.6) }));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [spinning]);

  const drag = useDragRotate(explore, (dx, dy) =>
    setView3((v) => {
      const b = v ?? autoView;
      return { yaw: b.yaw + dx * 0.01, pitch: clamp(b.pitch + dy * 0.01, -1.4, 1.4) };
    }),
  );

  // --- projection ---
  const cam: Camera = {
    cx: narrow ? W / 2 : W * 0.53,
    cy: H * (narrow ? 0.5 : 0.5),
    scale: (narrow ? 78 : 84) * zoom * appear,
    dist: 9,
  };
  const built = c > 0.001 || ghost > 0;
  const coord = (b: number[]): V4 => [b[0] * 2 - 1, b[1] * 2 - 1, b[2] * 2 - 1, b[3] === 0 ? -1 : -1 + 2 * c];
  const pts = projectCube(TESSERACT, { rot4: r4, yaw: v3.yaw, pitch: v3.pitch, cam, wDist: 3, coord });

  const depths = pts.map((p) => p[2]);
  const dMin = Math.min(...depths);
  const dMax = Math.max(...depths);
  const depthOf = (z: number) => (dMax - dMin < 1e-6 ? 1 : (z - dMin) / (dMax - dMin));

  const selCell = CELLS[cell];
  const edges = TESSERACT.edges
    .map(([a, b], i) => {
      const axis = TESSERACT.edgeAxis[i];
      const inA = TESSERACT.bits[a][3] === 0 && TESSERACT.bits[b][3] === 0;
      const kind = axis === 3 ? "connector" : inA ? "first" : "copy";
      return { a, b, axis, kind, z: (pts[a][2] + pts[b][2]) / 2, i };
    })
    .filter((e) => (e.kind === "first" ? true : built))
    .sort((p, q) => p.z - q.z);

  const edgeStyle = (e: (typeof edges)[number]) => {
    const near = lerp(0.45, 1, depthOf(e.z));
    let stroke: string = C.white;
    let width = 3.5;
    let opacity = near;
    let dash: string | undefined;
    if (construction) stroke = e.kind === "first" ? C.sky : e.kind === "copy" ? C.chartreuse : C.red;
    if (e.kind !== "first" && c < 0.001) {
      dash = "6 8";
      opacity = ghost * 0.8;
    }
    if (highlight === "edges") {
      stroke = AXIS_COLOR[e.axis];
      width = 4.5;
      opacity = Math.max(0.7, near);
    }
    if (highlight === "cell") {
      const inCell = cellHas(TESSERACT.bits[e.a], selCell) && cellHas(TESSERACT.bits[e.b], selCell);
      if (inCell) {
        stroke = C.yellow;
        width = 6;
        opacity = 1;
      } else {
        opacity = 0.18;
      }
    }
    return { stroke, width, opacity, dash };
  };

  const firstTop = pts[7]; // bits 1,1,1,0
  const copyTop = pts[15];
  const center = [cam.cx, cam.cy];
  const countText = "16 VERTICES · 32 EDGES · 24 SQUARES · 8 CUBES";
  const showCounts = (explore ? labels : counts > 0) && wNote === 0;
  const cellLabel = `${AXIS_NAME[selCell.axis]} = ${selCell.side ? "+1" : "−1"}`;

  // Exploring the finished object: skip ahead if the construction isn't complete yet.
  const ensureBuilt = () => {
    if (tl.t < 6.2) {
      tl.pause();
      tl.seek(6.2);
    }
  };

  const resetAll = () => {
    setView3(null);
    setRot(null);
    setSpin(false);
    setHighlight("none");
    setConstruction(true);
    setLabels(false);
  };

  return (
    <Scene
      figRef={ref}
      id="tesseract"
      fig={5}
      band={C.navy}
      ink={C.white}
      wide={WIDE}
      narrow={NARROW}
      isNarrow={narrow}
      title="A wireframe cube is copied and moved along a fourth direction, which this drawing can only show as the copy growing outward. Corresponding corners are joined, giving the familiar cube-within-a-cube projection of a tesseract, which then turns in four dimensions."
      caption={children}
      hint={hint ?? "Drag to turn the drawing in 3D. The sliders turn it through the fourth direction"}
      timeline={tl}
      draggable
      svgProps={{ ...drag, style: explore ? { touchAction: "none" } : undefined }}
      controls={
        <>
          <Transport
            tl={tl}
            scrubLabel="Scrub through the construction"
            steps={[
              { label: "A cube", t: 1.3 },
              { label: "Moving along w", t: 3.5 },
              { label: "Tesseract", t: 6.2 },
              { label: "Turning in 4D", t: DURATION },
            ]}
          />
          <Range label="Turn through x–w" min={-Math.PI} max={Math.PI} value={wrap(r4.xw)} onChange={(v) => { ensureBuilt(); setRot({ ...r4, xw: v }); }} valueText={`${Math.round((r4.xw * 180) / Math.PI)} degrees`} />
          <Range label="Turn through y–w" min={-Math.PI} max={Math.PI} value={wrap(r4.yw)} onChange={(v) => { ensureBuilt(); setRot({ ...r4, yw: v }); }} valueText={`${Math.round((r4.yw * 180) / Math.PI)} degrees`} />
          <Range label="Turn through z–w" min={-Math.PI} max={Math.PI} value={wrap(r4.zw)} onChange={(v) => { ensureBuilt(); setRot({ ...r4, zw: v }); }} valueText={`${Math.round((r4.zw * 180) / Math.PI)} degrees`} />
          <Row>
            <Btn pressed={spinning} onClick={() => { ensureBuilt(); setSpin((s) => !s); }} disabled={reduced}>
              {spinning ? "Stop spinning" : "Spin in 4D"}
            </Btn>
            <Btn pressed={construction} onClick={() => setConstruction((v) => !v)}>
              Colour the two cubes
            </Btn>
            <Btn pressed={labels} onClick={() => { ensureBuilt(); setLabels((v) => !v); }}>
              Labels
            </Btn>
          </Row>
          <Row>
            <div className="ve-steps" role="group" aria-label="Highlight">
              {(["none", "vertices", "edges", "cell"] as Highlight[]).map((k) => (
                <Btn key={k} pressed={highlight === k} onClick={() => { if (k !== "none") ensureBuilt(); setHighlight(k); }}>
                  {k === "none" ? "No highlight" : k === "vertices" ? "Vertices" : k === "edges" ? "Edges by direction" : "One cube"}
                </Btn>
              ))}
            </div>
            {highlight === "cell" && (
              <Btn onClick={() => setCell((k) => (k + 1) % 8)} label={`Next cube; showing cube ${cell + 1} of 8, ${cellLabel}`}>
                Next cube ({cell + 1}/8)
              </Btn>
            )}
            <Btn onClick={resetAll}>Return to the original view</Btn>
          </Row>
        </>
      }
    >
      <DimensionCorner W={W} H={H} n0={3} n1={4} word0="CUBE" word1="TESSERACT" p={corner} numColor={C.chartreuse} wordColor={C.white} narrow={narrow} />

      {/* Honesty badge */}
      {badge > 0 && (
        <g transform={`translate(${W - (narrow ? 24 : 40)} ${narrow ? 44 : 48}) scale(${badge})`}>
          <rect x={narrow ? -340 : -320} y={-24} width={narrow ? 340 : 320} height={narrow ? 64 : 52} rx={14} fill={C.chartreuse} />
          <text x={narrow ? -170 : -160} y={0} textAnchor="middle" fontSize={narrow ? 18 : 14.5} fill={C.navy} style={{ ...labelStyle, fontWeight: 900 }}>
            A PROJECTION, NOT THE OBJECT
          </text>
          <text x={narrow ? -170 : -160} y={narrow ? 25 : 19} textAnchor="middle" fontSize={narrow ? 15.5 : 13} fill={C.navy} style={labelStyle} opacity={0.8}>
            a 3D shadow of a 4D shape, drawn in 2D
          </text>
        </g>
      )}

      {/* Faces of the selected cell */}
      {highlight === "cell" && (
        <g aria-hidden="true">
          {[0, 1, 2, 3]
            .filter((a) => a !== selCell.axis)
            .flatMap((a) => [0, 1].map((s) => ({ a, s })))
            .map(({ a, s }, k) => {
              const others = [0, 1, 2, 3].filter((x) => x !== selCell.axis && x !== a);
              const quad = [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
              ].map(([u, v]) => {
                const bits = [0, 0, 0, 0];
                bits[selCell.axis] = selCell.side;
                bits[a] = s;
                bits[others[0]] = u;
                bits[others[1]] = v;
                return pts[bits[0] + bits[1] * 2 + bits[2] * 4 + bits[3] * 8];
              });
              return <polygon key={k} points={quad.map((p) => `${p[0]},${p[1]}`).join(" ")} fill={C.yellow} opacity={0.07} />;
            })}
        </g>
      )}

      {edges.map((e) => {
        const s = edgeStyle(e);
        return (
          <line
            key={e.i}
            x1={pts[e.a][0]}
            y1={pts[e.a][1]}
            x2={pts[e.b][0]}
            y2={pts[e.b][1]}
            stroke={s.stroke}
            strokeWidth={s.width}
            strokeOpacity={s.opacity}
            strokeDasharray={s.dash}
            strokeLinecap="round"
          />
        );
      })}

      {/* Corners */}
      {pts.map((p, i) => {
        if (TESSERACT.bits[i][3] === 1 && !built) return null;
        const hv = highlight === "vertices";
        const inCell = highlight === "cell" && cellHas(TESSERACT.bits[i], selCell);
        const r = hv ? 8 : inCell ? 6.5 : 4.5;
        const fill = hv ? C.yellow : inCell ? C.yellow : C.white;
        const op = highlight === "cell" && !inCell ? 0.25 : lerp(0.55, 1, depthOf(p[2]));
        return <circle key={i} cx={p[0]} cy={p[1]} r={r} fill={fill} opacity={op} />;
      })}

      <Ripple x={center[0]} y={center[1]} p={seg(t, 5.0, 6.2)} color={C.red} r0={40} r1={narrow ? 250 : 280} />

      {/* Build note */}
      {wNote > 0 && (
        <text x={W / 2} y={H - (narrow ? 72 : 84)} textAnchor="middle" fontSize={narrow ? 13 : 15} fill={C.red} opacity={wNote} style={labelStyle}>
          MOVING ALONG w: THE DRAWING CAN ONLY FAKE IT AS “OUTWARD”
        </text>
      )}

      {(explore ? labels : false) && built && c > 0.5 && (
        <g style={labelStyle} fontSize={14} aria-hidden="true">
          <text x={firstTop[0] + 10} y={firstTop[1] - 10} fill={construction ? C.sky : C.white}>w = −1</text>
          <text x={copyTop[0] + 10} y={copyTop[1] - 10} fill={construction ? C.chartreuse : C.white}>w = +1</text>
        </g>
      )}

      {highlight === "cell" && (
        <text x={W / 2} y={H - (narrow ? 104 : 64)} textAnchor="middle" fontSize={15} fill={C.yellow} style={labelStyle}>
          CUBE {cell + 1} OF 8 · EVERY CORNER WITH {cellLabel.toUpperCase()}
        </text>
      )}
      {highlight === "edges" && (
        <text x={W / 2} y={H - (narrow ? 104 : 64)} textAnchor="middle" fontSize={15} style={labelStyle}>
          {["x", "y", "z", "w"].map((a, i) => (
            <tspan key={a} fill={AXIS_COLOR[i]}>
              {i ? "   " : ""}8 ALONG {a.toUpperCase()}
            </tspan>
          ))}
        </text>
      )}

      {showCounts && (
        <text
          x={narrow ? W / 2 : W - 40}
          y={H - (narrow ? 72 : 34)}
          textAnchor={narrow ? "middle" : "end"}
          fontSize={narrow ? 17 : 14}
          fill={C.white}
          opacity={explore ? 0.9 : counts * 0.9}
          style={labelStyle}
        >
          {countText}
        </text>
      )}
    </Scene>
  );
}
