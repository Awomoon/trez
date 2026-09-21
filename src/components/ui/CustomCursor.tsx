"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A small lens of glass that trails the pointer, with a hard dot at the exact
 * cursor position so clicking still feels precise. Hidden entirely on touch
 * devices and for anyone who asked for reduced motion.
 */
export default function CustomCursor() {
  const lens = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  // Decided after mount so the server and the first client render agree.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(
      window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const lensEl = lens.current!;
    const dotEl = dot.current!;
    gsap.set([lensEl, dotEl], { opacity: 0, xPercent: -50, yPercent: -50 });

    // Different durations give the lens its liquid lag behind the dot.
    const lensX = gsap.quickTo(lensEl, "x", { duration: 0.55, ease: "power3" });
    const lensY = gsap.quickTo(lensEl, "y", { duration: 0.55, ease: "power3" });
    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power3" });

    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([lensEl, dotEl], { opacity: 1, duration: 0.4 });
      }
      lensX(event.clientX);
      lensY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);

      const target = (event.target as HTMLElement | null)?.closest(
        "a, button, [data-cursor]",
      );
      gsap.to(lensEl, {
        scale: target ? 2.1 : 1,
        borderColor: target
          ? "rgb(var(--c-glow)/0.75)"
          : "rgba(255,255,255,0.35)",
        duration: 0.45,
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      visible = false;
      gsap.to([lensEl, dotEl], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <div
        ref={lens}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white/35 bg-white/[0.06] backdrop-blur-[2px] backdrop-saturate-150"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-cyan"
      />
    </div>
  );
}
