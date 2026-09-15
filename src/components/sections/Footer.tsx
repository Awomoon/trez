"use client";

import { useRef } from "react";
import { site } from "@/config/site";
import { burstConfetti } from "@/components/effects/confetti";

export default function Footer() {
  const button = useRef<HTMLButtonElement>(null);

  const celebrate = () => {
    const rect = button.current?.getBoundingClientRect();
    burstConfetti(
      {
        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        y: rect ? rect.top : window.innerHeight / 2,
      },
      180,
    );
  };

  return (
    <footer className="relative mx-auto w-full max-w-4xl px-5 pb-[max(4rem,env(safe-area-inset-bottom))] pt-16 text-center">
      <div className="hairline mb-14 w-full" />

      <p className="display text-[clamp(2rem,7vw,4.5rem)] text-frost">
        Happy birthday,{" "}
        <span className="shimmer-text">{site.name}</span>
      </p>

      <p className="mx-auto mt-6 max-w-md text-balance text-sm leading-relaxed text-ice/60">
        One more, because you deserve more than one.
      </p>

      <button
        ref={button}
        onClick={celebrate}
        className="glass glass-interactive group mt-10 rounded-full px-7 py-3.5 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ice/85"
      >
        <span className="relative z-[3]">Throw confetti 🎉</span>
      </button>

      <p className="mt-16 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-ice/25">
        Made with far too much care · October 8
      </p>
    </footer>
  );
}
