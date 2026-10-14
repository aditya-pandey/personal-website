"use client";

import { CSSProperties, ReactNode, useMemo, useRef, useState } from "react";
import { Scene } from "../Scene";
import { Btn, Range, Row } from "../Controls";
import { useNarrow, useTimeline } from "../hooks";
import { useEssayMode } from "../mode";
import { C, back, clamp01, seg } from "../motion";
import { faceCount, hypercube } from "../geometry";
import { projectCube } from "../tesseract";

const DURATION = 9;
const NAMES = ["point", "line", "square", "cube", "tesseract"];
const AXES = ["x", "y", "z", "w"];

/**
 * One structure, held four ways: described in symbols, counted in a table,
 * drawn as a projection, and the question a drawing cannot answer.
 */
export function WaysOfKnowing({ children, hint }: { children?: ReactNode; hint?: string }) {
  const ref = useRef<HTMLElement>(null);
  const narrow = useNarrow();
  const explore = useEssayMode() === "explore";
  const tl = useTimeline("ways-of-knowing", DURATION, ref);
  const t = tl.t;

  const [nPick, setNPick] = useState<number | null>(null);
  const [vertex, setVertex] = useState<number | null>(null);
  const [turn, setTurn] = useState<number | null>(null);

  const autoN = Math.min(4, Math.floor(seg(t, 3.0, 7.8) * 4.999));
  const n = explore && nPick !== null ? nPick : autoN;
  const cube = useMemo(() => hypercube(n), [n]);
  const sel = vertex !== null && vertex < cube.bits.length ? vertex : null;

  const reveal = (a: number) => {
    const p = clamp01(seg(t, a, a + 0.6));
    return { opacity: p, transform: `translateY(${(1 - back(p)) * 14}px)` } as CSSProperties;
  };

  // --- drawing ---
  const size = 260;
  const yaw = turn ?? -0.55 + 0.05 * t;
  const pts = projectCube(cube, {
    rot4: { xw: 0.25 },
    yaw,
    pitch: 0.42,
    cam: { cx: size / 2, cy: size / 2, scale: n === 4 ? 46 : 62, dist: 9 },
    wDist: 3,
  });
  const neighbours = sel === null ? [] : cube.bits[0].map((_, k) => sel ^ (1 << k));
  const fmt = (bits: number[], diff?: number) =>
    bits.length === 0 ? "( )" : (
      <>
        (
        {bits.map((b, k) => (
          <span key={k}>
            {k ? ", " : ""}
            <span className={k === diff ? "ve-diff" : undefined}>{b}</span>
          </span>
        ))}
        )
      </>
    );

  const vars = AXES.slice(0, n).join(", ");

  return (
    <Scene
      figRef={ref}
      id="ways-of-knowing"
      fig={6}
      band="var(--theme-surface)"
      ink="var(--theme-ink)"
      wide={[960, 420]}
      narrow={[600, 900]}
      isNarrow={narrow}
      html
      quiet
      title="One structure held four ways: as a description in symbols, as a table of counts, as a drawn projection, and as an open question about physical existence that none of the first three can answer."
      caption={children}
      hint={hint ?? "Choose a dimension, then pick a corner and follow it through each representation"}
      timeline={tl}
      controls={
        <>
          <Row>
            <div className="ve-steps" role="group" aria-label="Dimension">
              {NAMES.map((name, k) => (
                <Btn
                  key={name}
                  pressed={n === k}
                  onClick={() => {
                    tl.pause();
                    tl.seek(DURATION);
                    setNPick(k);
                    setVertex(null);
                  }}
                >
                  <span className="ve-step-num">{k}</span> {name}
                </Btn>
              ))}
            </div>
          </Row>
          <Row>
            <Btn onClick={() => setVertex((v) => (v === null ? 0 : (v + 1) % cube.bits.length))} disabled={n === 0}>
              {sel === null ? "Pick a corner" : "Next corner"}
            </Btn>
            <Btn onClick={() => setVertex(null)} disabled={sel === null}>
              Clear corner
            </Btn>
          </Row>
          <Range
            label="Turn the drawing"
            min={-Math.PI}
            max={Math.PI}
            value={((yaw + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI}
            onChange={setTurn}
            valueText={`${Math.round((yaw * 180) / Math.PI)} degrees`}
          />
        </>
      }
    >
      <div className="vk-grid">
        <section className="vk-tile" style={reveal(0.2)} aria-label="Describe it">
          <p className="vk-tag vk-tag--reason">Reasoning</p>
          <h3 className="vk-head">Describe it</h3>
          <p className="vk-symbol">
            {n === 0 ? (
              <>A single position. No coordinates at all.</>
            ) : (
              <>
                Every point ({vars}) where each coordinate is between 0&nbsp;and&nbsp;1. Its corners are where each is exactly 0&nbsp;or&nbsp;1.
              </>
            )}
          </p>
          <p className="vk-formula">
            corners = 2<sup>{n}</sup> = <b>{1 << n}</b>
            <br />
            edges = {n}·2<sup>{Math.max(0, n - 1)}</sup> = <b>{faceCount(n, 1)}</b>
          </p>
          {explore && sel !== null && n > 0 && (
            <div className="vk-pick" aria-live="polite">
              <p>
                Corner <b>{fmt(cube.bits[sel])}</b>. Its {n} neighbour{n > 1 ? "s" : ""} each differ in exactly one place:
              </p>
              <p className="vk-neigh">
                {neighbours.map((j, k) => (
                  <span key={j}>{fmt(cube.bits[j], k)}</span>
                ))}
              </p>
            </div>
          )}
        </section>

        <section className="vk-tile" style={reveal(0.9)} aria-label="Count it">
          <p className="vk-tag vk-tag--reason">Reasoning</p>
          <h3 className="vk-head">Count it</h3>
          <table className="vk-table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">corners</th>
                <th scope="col">edges</th>
                <th scope="col">squares</th>
                <th scope="col">cubes</th>
              </tr>
            </thead>
            <tbody>
              {NAMES.map((name, k) => (
                <tr key={name} className={k === n ? "is-current" : k > n ? "is-future" : undefined}>
                  <th scope="row">{name}</th>
                  {[0, 1, 2, 3].map((d) => (
                    <td key={d}>{d <= k ? faceCount(k, d) : "·"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="vk-tile" style={reveal(1.6)} aria-label="Draw it">
          <p className="vk-tag vk-tag--picture">Picturing</p>
          <h3 className="vk-head">Draw it</h3>
          <svg viewBox={`0 0 ${size} ${size}`} className="vk-draw" aria-hidden="true">
            {cube.edges.map(([a, b], i) => {
              const hot = sel !== null && (a === sel || b === sel);
              return (
                <line
                  key={i}
                  x1={pts[a][0]}
                  y1={pts[a][1]}
                  x2={pts[b][0]}
                  y2={pts[b][1]}
                  stroke={hot ? C.red : "currentColor"}
                  strokeWidth={hot ? 4.5 : 2.5}
                  strokeOpacity={sel !== null && !hot ? 0.3 : 0.85}
                  strokeLinecap="round"
                />
              );
            })}
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={p[0]}
                cy={p[1]}
                r={i === sel ? 8 : neighbours.includes(i) ? 6 : n === 0 ? 9 : 4}
                fill={i === sel || n === 0 ? C.red : neighbours.includes(i) ? C.blue : "currentColor"}
                onClick={explore ? () => setVertex(i) : undefined}
                style={explore ? { cursor: "pointer" } : undefined}
              />
            ))}
          </svg>
          <p className="vk-note">A {NAMES[n]}, drawn flat and at an angle. {n === 0 ? "Even the dot has a size a point doesn't." : n >= 3 ? "Some edges overlap; lengths and angles are distorted." : "Even here, angles and lengths are distorted."}</p>
        </section>

        <section className="vk-tile vk-tile--open" style={reveal(2.6)} aria-label="Find it">
          <p className="vk-tag vk-tag--evidence">Evidence</p>
          <h3 className="vk-head">Find it?</h3>
          <div className="vk-empty" aria-hidden="true">
            <span>?</span>
          </div>
          <p className="vk-note">
            Whether a space like this exists physically is not something the symbols, the table or the drawing can settle. That takes evidence.
          </p>
        </section>
      </div>
    </Scene>
  );
}
