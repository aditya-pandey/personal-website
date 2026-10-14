"use client";

import { RefObject, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useEssayMode } from "./mode";

/* ---------- Reduced motion ---------- */

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/* ---------- Narrow layout (phones) ---------- */

export const NARROW_QUERY = "(max-width: 639px)";

function subscribeNarrow(cb: () => void) {
  const mq = window.matchMedia(NARROW_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useNarrow() {
  return useSyncExternalStore(subscribeNarrow, () => window.matchMedia(NARROW_QUERY).matches, () => false);
}

/* ---------- Timeline ---------- */

export interface Timeline {
  t: number;
  duration: number;
  playing: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  replay: () => void;
  seek: (t: number) => void;
}

declare global {
  interface Window {
    __essayTimelines?: Record<string, { seek: (t: number) => void; pause: () => void; duration: number }>;
  }
}

/** Seconds a looping scene rests on its final frame before starting again. */
export const LOOP_HOLD = 2.2;

/**
 * A scene clock. Scenes are pure functions of `t`, so any moment can be paused,
 * scrubbed or stepped to.
 *
 * Reading mode: plays when the figure scrolls into view and loops like a GIF,
 * resting on the final frame between passes. Explore mode: plays once, then
 * waits for the reader. Off-screen it always pauses. Reduced-motion readers
 * (and the server render) get the final frame, which is meaningful on its own.
 */
export function useTimeline(
  id: string,
  duration: number,
  ref: RefObject<Element | null>,
  opts: { autoplay?: boolean } = {},
): Timeline {
  const { autoplay = true } = opts;
  const reduced = usePrefersReducedMotion();
  const looping = useEssayMode() === "read" && !reduced;
  const [t, setT] = useState(duration);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(duration);
  const holdRef = useRef(0);
  const seenRef = useRef(false);
  const resumeRef = useRef(false);
  const visibleRef = useRef(false);
  const userPausedRef = useRef(false);
  const loopingRef = useRef(looping);

  const seek = useCallback(
    (v: number) => {
      const nv = Math.max(0, Math.min(duration, v));
      tRef.current = nv;
      holdRef.current = 0;
      setT(nv);
    },
    [duration],
  );

  const play = useCallback(() => {
    userPausedRef.current = false;
    if (tRef.current >= duration - 1e-3) seek(0);
    setPlaying(true);
  }, [duration, seek]);
  const pause = useCallback(() => {
    userPausedRef.current = true;
    setPlaying(false);
  }, []);
  const replay = useCallback(() => {
    userPausedRef.current = false;
    seek(0);
    setPlaying(true);
  }, [seek]);
  const toggle = useCallback(() => {
    setPlaying((p) => {
      userPausedRef.current = p;
      if (!p && tRef.current >= duration - 1e-3) {
        tRef.current = 0;
        holdRef.current = 0;
        setT(0);
      }
      return !p;
    });
  }, [duration]);

  // Mode changes: entering reading mode restarts the loop if the figure is on screen.
  useEffect(() => {
    loopingRef.current = looping;
    if (!looping) return;
    userPausedRef.current = false;
    const raf = requestAnimationFrame(() => {
      if (visibleRef.current && seenRef.current) setPlaying(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [looping]);

  // Visibility: entering autoplays; leaving the viewport pauses.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio >= 0.35;
        visibleRef.current = visible;
        // Rewind to the first frame as the figure starts to enter, so it plays from the start.
        if (entry.isIntersecting && !seenRef.current && autoplay && !reduced && tRef.current !== 0) {
          tRef.current = 0;
          setT(0);
        }
        if (visible) {
          if (!seenRef.current) {
            seenRef.current = true;
            if (autoplay && !reduced) {
              tRef.current = 0;
              setT(0);
              setPlaying(true);
            }
          } else if (resumeRef.current || (loopingRef.current && !userPausedRef.current)) {
            resumeRef.current = false;
            setPlaying(true);
          }
        } else {
          setPlaying((p) => {
            if (p) resumeRef.current = true;
            return false;
          });
        }
      },
      { threshold: [0, 0.01, 0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, autoplay, reduced]);

  // The clock itself.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (tRef.current >= duration) {
        // Resting on the last frame.
        if (!loopingRef.current) {
          setPlaying(false);
          return;
        }
        holdRef.current += dt;
        if (holdRef.current >= LOOP_HOLD) {
          holdRef.current = 0;
          tRef.current = 0;
          setT(0);
        }
        raf = requestAnimationFrame(step);
        return;
      }
      const nt = Math.min(duration, tRef.current + dt);
      tRef.current = nt;
      setT(nt);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration]);

  // Expose for frame-accurate exports (used by the GIF/MP4 render script).
  useEffect(() => {
    window.__essayTimelines = window.__essayTimelines || {};
    window.__essayTimelines[id] = {
      seek: (v: number) => {
        userPausedRef.current = true;
        setPlaying(false);
        seenRef.current = true;
        seek(v);
      },
      pause,
      duration,
    };
    return () => {
      if (window.__essayTimelines) delete window.__essayTimelines[id];
    };
  }, [id, seek, pause, duration]);

  return { t, duration, playing, play, pause, toggle, replay, seek };
}

/* ---------- Drag to rotate ---------- */

export function useDragRotate(
  enabled: boolean,
  onDelta: (dx: number, dy: number) => void,
) {
  const last = useRef<[number, number] | null>(null);
  const handlers = {
    onPointerDown: (e: React.PointerEvent<Element>) => {
      if (!enabled) return;
      e.preventDefault();
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      last.current = [e.clientX, e.clientY];
    },
    onPointerMove: (e: React.PointerEvent<Element>) => {
      if (!enabled || !last.current) return;
      const dx = e.clientX - last.current[0];
      const dy = e.clientY - last.current[1];
      last.current = [e.clientX, e.clientY];
      onDelta(dx, dy);
    },
    onPointerUp: () => {
      last.current = null;
    },
    onPointerCancel: () => {
      last.current = null;
    },
  };
  return handlers;
}
