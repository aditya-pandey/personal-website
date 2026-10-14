"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Hand } from "lucide-react";
import { essayFont } from "./fonts";
import { resetEssayMode, setEssayMode, useEssayMode } from "./mode";
import "./essay.css";

/**
 * "Interact with this article": switches every figure between a reading layer
 * (captioned, plays once) and an explore layer (hands-on controls).
 */
export function ExploreToggle() {
  const mode = useEssayMode();
  const explore = mode === "explore";
  const ref = useRef<HTMLDivElement>(null);
  const [toggleVisible, setToggleVisible] = useState(true);

  // Deep link: ?mode=explore opens the article in Explore mode.
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get("mode") === "explore") {
        setTimeout(() => setEssayMode("explore", ref.current), 0);
      }
    } catch {
      /* ignore */
    }
    return () => {
      // Leaving the page resets the mode for the next essay.
      resetEssayMode();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setToggleVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!explore) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !(e.target instanceof HTMLInputElement && e.target.type !== "range")) setEssayMode("read");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [explore]);

  return (
    <>
      <div ref={ref} className={`ve-toggle-wrap ${essayFont.variable}`} data-visual-essay>
        <button
          type="button"
          className={`ve-toggle${explore ? " is-on" : ""}`}
          aria-pressed={explore}
          onClick={() => setEssayMode(explore ? "read" : "explore", ref.current)}
        >
          <span className="ve-toggle__dot" aria-hidden="true" />
          <span>{explore ? "Back to reading" : "Interact with this article"}</span>
        </button>
        <p className="ve-toggle-note" aria-live="polite">
          {explore
            ? "Explore mode is on. Each figure now has controls: scrub, slide, drag and rotate. Your place is kept when you switch back."
            : "Every figure can be played with. Switch on to scrub, slide and rotate them, without leaving the essay."}
        </p>
      </div>

      {explore && !toggleVisible && (
        <div className={`ve-float ${essayFont.variable}`} role="region" aria-label="Explore mode">
          <span className="ve-float__label">
            <Hand size={14} aria-hidden /> <span>Exploring</span>
          </span>
          <button type="button" className="ve-float__btn" onClick={() => setEssayMode("read")}>
            <BookOpen size={14} aria-hidden /> Back to reading
          </button>
        </div>
      )}
    </>
  );
}
