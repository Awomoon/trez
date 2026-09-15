"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/config/site";

/**
 * Holds the page for a beat while the first paint settles, then dissolves.
 * The counter is intentionally slightly irregular — a perfectly linear
 * progress bar reads as fake.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const counter = { value: 0 };
    const tl = gsap.timeline();

    tl.to(counter, {
      value: 100,
      duration: 1.9,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(counter.value)),
    })
      .to(
        root.current!.querySelectorAll("[data-fade]"),
        { opacity: 0, y: -14, duration: 0.5, stagger: 0.06 },
        "+=0.15",
      )
      .to(
        root.current,
        {
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: onDone,
        },
        "-=0.2",
      )
      .set(root.current, { display: "none" });

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-abyss px-6"
    >
      <p data-fade className="eyebrow">
        Loading something made for you
      </p>

      <p
        data-fade
        className="display shimmer-text text-center text-5xl sm:text-7xl"
      >
        {site.name}
      </p>

      <div
        data-fade
        className="relative h-px w-56 overflow-hidden bg-white/10 sm:w-72"
      >
        <span
          className="absolute inset-y-0 left-0 bg-cyan transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p data-fade className="font-mono text-xs tracking-[0.3em] text-ice/50">
        {String(progress).padStart(3, "0")}
      </p>
    </div>
  );
}
