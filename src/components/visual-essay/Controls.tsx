"use client";

import { ReactNode, useId } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Timeline } from "./hooks";

export function Btn({
  children,
  onClick,
  pressed,
  solid,
  label,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  pressed?: boolean;
  solid?: boolean;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`ve-btn${solid ? " ve-btn--solid" : ""}`}
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Range({
  label,
  min,
  max,
  step = 0.01,
  value,
  onChange,
  valueText,
  minLabel,
  maxLabel,
  wide,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  valueText?: string;
  minLabel?: string;
  maxLabel?: string;
  wide?: boolean;
}) {
  const id = useId();
  return (
    <div className={`ve-range${wide ? " ve-range--wide" : ""}`}>
      <label htmlFor={id} className="ve-range__label">
        {label}
      </label>
      <div className="ve-range__row">
        {minLabel && <span className="ve-range__end" aria-hidden="true">{minLabel}</span>}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={valueText}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        {maxLabel && <span className="ve-range__end" aria-hidden="true">{maxLabel}</span>}
      </div>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="ve-row">{children}</div>;
}

/** Play / pause, replay, a scrubber, and optional named steps. */
export function Transport({
  tl,
  steps,
  scrubLabel = "Scrub through the animation",
}: {
  tl: Timeline;
  steps?: { label: string; t: number }[];
  scrubLabel?: string;
}) {
  const activeStep = steps
    ? steps.reduce((best, s, i) => (Math.abs(s.t - tl.t) < Math.abs(steps[best].t - tl.t) ? i : best), 0)
    : -1;
  return (
    <>
      <Row>
        <Btn onClick={tl.toggle} solid label={tl.playing ? "Pause" : "Play"}>
          {tl.playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
          <span>{tl.playing ? "Pause" : "Play"}</span>
        </Btn>
        <Btn onClick={tl.replay} label="Replay from the start">
          <RotateCcw size={16} aria-hidden />
          <span>Replay</span>
        </Btn>
        {steps && (
          <div className="ve-steps" role="group" aria-label="Step through">
            {steps.map((s, i) => (
              <Btn
                key={s.label}
                pressed={!tl.playing && i === activeStep && Math.abs(s.t - tl.t) < 0.05}
                onClick={() => {
                  tl.pause();
                  tl.seek(s.t);
                }}
              >
                <span className="ve-step-num">{i + 1}</span> {s.label}
              </Btn>
            ))}
          </div>
        )}
      </Row>
      <Range
        wide
        label={scrubLabel}
        min={0}
        max={tl.duration}
        step={0.01}
        value={tl.t}
        valueText={`${Math.round((tl.t / tl.duration) * 100)}% through`}
        onChange={(v) => {
          tl.pause();
          tl.seek(v);
        }}
      />
    </>
  );
}
