"use client";

import { gsap } from "@/lib/gsap";

const GRADIENT =
  "linear-gradient(100deg,#eef7ff 0%,#cfe9ff 20%,#ffffff 36%,#46e0ff 52%,#6db4ff 68%,#eef7ff 100%)";

/**
 * `background-clip: text` only paints against the element that owns the
 * background. The moment SplitText moves each glyph into its own span, a
 * gradient set on the parent heading stops rendering and the text disappears.
 *
 * So instead every character gets the *same* gradient, shifted left by its own
 * offset. The seams line up exactly, the word still reads as one continuous
 * sweep, and animating a single shared value slides that sweep across all of
 * them together.
 *
 * Returns the shimmer tween so the caller can kill it.
 */
export function applySharedGradient(
  chars: Element[],
  container: HTMLElement,
): gsap.core.Tween | null {
  if (!chars.length) return null;

  const width = container.offsetWidth || 1;
  const spread = width * 2.4;
  const offsets = chars.map((char) => (char as HTMLElement).offsetLeft);

  chars.forEach((char) => {
    const el = char as HTMLElement;
    el.style.backgroundImage = GRADIENT;
    el.style.backgroundSize = `${spread}px 100%`;
    el.style.backgroundRepeat = "repeat-x";
    el.style.webkitBackgroundClip = "text";
    el.style.backgroundClip = "text";
    el.style.color = "transparent";
    // Safari needs this one specifically or it repaints the glyphs solid.
    el.style.webkitTextFillColor = "transparent";
  });

  const paint = (shift: number) => {
    chars.forEach((char, i) => {
      (char as HTMLElement).style.backgroundPositionX =
        `${shift - offsets[i]}px`;
    });
  };

  paint(0);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  const state = { shift: 0 };
  return gsap.to(state, {
    shift: spread,
    duration: 9,
    ease: "none",
    repeat: -1,
    onUpdate: () => paint(state.shift),
  });
}
