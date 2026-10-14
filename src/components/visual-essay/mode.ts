"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

/**
 * Reading / Explore mode for the visual essay.
 * A tiny external store so every scene inside the MDX tree can read the mode
 * without wrapping the article in a provider.
 */
export type EssayMode = "read" | "explore";

let mode: EssayMode = "read";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useEssayMode(): EssayMode {
  return useSyncExternalStore(subscribe, () => mode, () => "read");
}

/** The block (paragraph, heading, figure) nearest the top third of the viewport. */
function findAnchor(): Element | null {
  const root = document.querySelector("[data-visual-essay]")?.closest("article") ?? document.querySelector("article");
  if (!root) return null;
  const line = window.innerHeight * 0.3;
  const blocks = root.querySelectorAll(":scope > p, :scope > h2, :scope > h3, :scope > hr, :scope > figure, :scope > blockquote, :scope > ul, :scope > ol, :scope > .ve-toggle-wrap");
  for (const el of Array.from(blocks)) {
    if (el.getBoundingClientRect().bottom > line) return el;
  }
  return null;
}

/**
 * Switch modes while keeping the reader's place: the anchor block stays at the
 * same distance from the top of the viewport even though figures change height.
 */
export function setEssayMode(next: EssayMode, anchor?: Element | null) {
  if (next === mode) return;
  const target = anchor ?? findAnchor();
  const before = target?.getBoundingClientRect().top;

  // Turn off the browser's own scroll anchoring for this change so it doesn't
  // compensate a second time (and so Safari, which lacks it, behaves the same).
  const roots = [document.documentElement, document.body];
  const prev = roots.map((r) => r.style.overflowAnchor);
  roots.forEach((r) => (r.style.overflowAnchor = "none"));
  requestAnimationFrame(() => requestAnimationFrame(() => roots.forEach((r, i) => (r.style.overflowAnchor = prev[i]))));

  flushSync(() => {
    mode = next;
    listeners.forEach((l) => l());
  });

  if (target && before !== undefined) {
    // Absolute, so it is correct whatever the browser has already adjusted.
    const restore = () => {
      const docTop = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: docTop - before, left: 0, behavior: "instant" as ScrollBehavior });
    };
    restore();
    requestAnimationFrame(restore);
  }

  try {
    const url = new URL(window.location.href);
    if (next === "explore") url.searchParams.set("mode", "explore");
    else url.searchParams.delete("mode");
    window.history.replaceState(window.history.state, "", url);
  } catch {
    /* URL sync is a convenience only */
  }
}

/** Reset without touching scroll or URL (used when the essay unmounts). */
export function resetEssayMode() {
  if (mode === "read") return;
  mode = "read";
  listeners.forEach((l) => l());
}

export function getEssayMode() {
  return mode;
}
