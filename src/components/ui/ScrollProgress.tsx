"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Hairline at the very top of the viewport that fills as you read. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(bar.current, { scaleX: self.progress });
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-px bg-white/5"
    >
      <div
        ref={bar}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-azure via-cyan to-violet shadow-[0_0_12px_rgba(70,224,255,0.9)]"
      />
    </div>
  );
}
