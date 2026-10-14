# Visual essay components

Used by `content/thoughts/trying-to-make-a-point.mdx`. The essay text lives in the MDX file; the scenes live here.

```mdx
<ExploreToggle />

<PointToLine>Caption text, written as part of the essay.</PointToLine>
<LineToSquare hint="Optional instruction shown in Explore mode">Caption…</LineToSquare>
```

The scenes are `PointToLine`, `LineToSquare`, `SquareToCube`, `SphereThroughPlane`, `Tesseract` and `WaysOfKnowing`. Each one takes its caption as children, plus an optional `hint` string. Only string props work, because next-mdx-remote blocks JS expressions.

## How it works

- **Mode.** `mode.ts` is a tiny external store with two modes, `read` and `explore`. Switching modes keeps the reader's place: the block nearest the top third of the screen, or the figure whose "Explore this figure" link was clicked, stays exactly where it was. `?mode=explore` deep-links into Explore mode, and Esc returns to reading.
- **Time.** Every scene is a pure function of `t`, driven by `useTimeline` in `hooks.ts`. In reading mode a scene loops like a GIF, resting on its last frame between passes, with a Pause button. In Explore mode it plays once and waits. Off-screen it always pauses. Readers who prefer reduced motion get the final frame and no autoplay. The server render also uses the final frame, so the page makes sense before any JavaScript runs.
- **Palette and easing.** Both are in `motion.ts`: flat colour fields, a single red protagonist dot, overshoot "pops", dashed ripples for emphasis, and labels that slide to change.
- **Exports.** `scripts/export-essay-loops.py` renders scenes 1–5 frame by frame to MP4 and GIF, using `window.__essayTimelines`.
