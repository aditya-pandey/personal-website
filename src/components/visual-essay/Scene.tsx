"use client";

import { CSSProperties, ReactNode, RefObject, SVGProps } from "react";
import { Hand, Pause, Play } from "lucide-react";
import { essayFont } from "./fonts";
import { setEssayMode, useEssayMode } from "./mode";
import type { Timeline } from "./hooks";
import "./essay.css";

export interface SceneProps {
  figRef: RefObject<HTMLElement | null>;
  id: string;
  fig: number;
  band: string;
  ink: string;
  /** viewBox sizes for wide and narrow layouts. */
  wide: [number, number];
  narrow: [number, number];
  isNarrow: boolean;
  title: string;
  caption: ReactNode;
  hint?: string;
  timeline?: Timeline;
  controls?: ReactNode;
  svgProps?: SVGProps<SVGSVGElement>;
  draggable?: boolean;
  children: ReactNode;
  quiet?: boolean;
  /** Render children as HTML instead of inside an SVG stage. */
  html?: boolean;
}

/**
 * A full-bleed colour band that holds one figure: the stage (an SVG), its
 * caption (always present, the text alternative), and, in Explore mode, the
 * hands-on controls.
 */
export function Scene({
  figRef,
  id,
  fig,
  band,
  ink,
  wide,
  narrow,
  isNarrow,
  title,
  caption,
  hint,
  timeline,
  controls,
  svgProps,
  draggable,
  children,
  quiet,
  html,
}: SceneProps) {
  const mode = useEssayMode();
  const explore = mode === "explore";
  const [W, H] = isNarrow ? narrow : wide;
  const style = {
    "--band": band,
    "--ink": ink,
    "--ar-wide": `${wide[0]} / ${wide[1]}`,
    "--ar-narrow": `${narrow[0]} / ${narrow[1]}`,
  } as CSSProperties;

  return (
    <figure
      ref={figRef as RefObject<HTMLElement>}
      id={`figure-${id}`}
      className={`ve-band ${essayFont.variable}${explore ? " is-explore" : ""}${quiet ? " ve-band--quiet" : ""}`}
      style={style}
      aria-labelledby={`${id}-title`}
      data-scene={id}
    >
      <div className="ve-band__inner">
        {html ? (
          <div className="ve-stage ve-stage--html" role="group" aria-labelledby={`${id}-title`} data-stage={id}>
            <span id={`${id}-title`} className="ve-sr-only">{title}</span>
            {children}
          </div>
        ) : (
          <div className={`ve-stage${explore && draggable ? " is-draggable" : ""}`}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-labelledby={`${id}-title`}
              data-stage={id}
              {...svgProps}
            >
              <title id={`${id}-title`}>{title}</title>
              {children}
            </svg>
          </div>
        )}

        {explore && controls && (
          <div className="ve-explore" role="group" aria-label={`Controls for figure ${fig}`}>
            {hint && <p className="ve-hint">{hint}</p>}
            <div className="ve-controls">{controls}</div>
          </div>
        )}

        <figcaption className="ve-caption">
          <span className="ve-figno">Fig. {fig}</span>
          {caption}
        </figcaption>

        {!explore && (
          <div className="ve-read-actions">
            {timeline && (
              <button type="button" className="ve-link" onClick={timeline.toggle}>
                {timeline.playing ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
                {timeline.playing ? "Pause" : "Play"}
              </button>
            )}
            <button
              type="button"
              className="ve-link"
              onClick={() => setEssayMode("explore", figRef.current)}
            >
              <Hand size={14} aria-hidden /> Explore this figure
            </button>
          </div>
        )}
      </div>
    </figure>
  );
}
