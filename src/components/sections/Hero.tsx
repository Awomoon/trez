"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import { applySharedGradient } from "@/lib/gradientText";
import { site } from "@/config/site";
import { birthdayLabel } from "@/lib/countdown";

/**
 * Opening screen. The name is split to characters and thrown in from below with
 * a rotation on the X axis, so it reads as physical cards flipping into place
 * rather than text fading in.
 */
export default function Hero({ start }: { start: boolean }) {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!start) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      const split = new SplitText(nameRef.current, {
        type: "chars",
        charsClass: "inline-block will-change-transform",
      });

      const shimmer = applySharedGradient(split.chars, nameRef.current!);

      const tl = gsap.timeline({ defaults: { ease: "glass" } });

      tl.from("[data-hero-eyebrow]", { y: 20, opacity: 0, duration: 0.8 })
        .from(
          split.chars,
          {
            yPercent: 120,
            rotateX: -75,
            opacity: 0,
            duration: 1.2,
            stagger: 0.045,
          },
          "-=0.45",
        )
        .from(
          "[data-hero-line]",
          { scaleX: 0, opacity: 0, duration: 0.9 },
          "-=0.75",
        )
        .from("[data-hero-sub]", { y: 24, opacity: 0, duration: 0.9 }, "-=0.65")
        .from(
          "[data-hero-word]",
          { y: 20, opacity: 0, duration: 0.8 },
          "-=0.55",
        )
        .from(
          "[data-hero-badge]",
          { y: 20, opacity: 0, scale: 0.94, duration: 0.8 },
          "-=0.6",
        )
        .from("[data-hero-cue]", { y: 14, opacity: 0, duration: 0.7 }, "-=0.5");

      const fine = window.matchMedia("(pointer: fine)").matches;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Parallax the whole block away as the page scrolls on. Scroll-linked
      // motion is exactly what the reduced-motion preference is about, so it
      // is the first thing to go.
      if (!reduced) {
        gsap.to("[data-hero-stack]", {
          yPercent: 20,
          opacity: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      let onMove: ((event: PointerEvent) => void) | null = null;

      if (fine && !reduced) {
        const xTo = gsap.quickTo("[data-hero-stack]", "rotateY", {
          duration: 0.9,
          ease: "power3",
        });
        const yTo = gsap.quickTo("[data-hero-stack]", "rotateX", {
          duration: 0.9,
          ease: "power3",
        });
        onMove = (event: PointerEvent) => {
          xTo((event.clientX / window.innerWidth - 0.5) * 8);
          yTo((0.5 - event.clientY / window.innerHeight) * 6);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
      }

      return () => {
        if (onMove) window.removeEventListener("pointermove", onMove);
        shimmer?.kill();
        split.revert();
      };
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [start]);

  // Rotating adjective under the name.
  useEffect(() => {
    if (!start) return;
    const id = window.setInterval(
      () => setWordIndex((i) => (i + 1) % site.heroWords.length),
      2400,
    );
    return () => window.clearInterval(id);
  }, [start]);

  return (
    <section
      id="hero"
      ref={root}
      className="relative flex min-h-[100svh] items-center justify-center px-5 pb-20 pt-32"
    >
      <div
        data-hero-stack
        className="flex w-full max-w-4xl flex-col items-center text-center [transform-style:preserve-3d]"
      >
        <p data-anim data-hero-eyebrow className="eyebrow mb-6">
          {birthdayLabel()} · A page with exactly one purpose
        </p>

        <h1
          ref={nameRef}
          data-anim
          className="display text-frost text-[clamp(4.25rem,19vw,11rem)] [perspective:900px]"
        >
          {site.name}
        </h1>

        <div
          data-anim
          data-hero-line
          className="hairline my-7 w-full max-w-md origin-center"
        />

        <p
          data-anim
          data-hero-sub
          className="max-w-lg text-balance text-base leading-relaxed text-ice/70 sm:text-lg"
        >
          {site.tagline}. Today you are officially, measurably and
          scientifically
        </p>

        {/* The rotating word gets its own line so the stacked words never
            reserve empty space inside a sentence. */}
        <div
          data-anim
          data-hero-word
          className="mt-3 grid h-[1.4em] place-items-center"
          aria-live="polite"
        >
          {site.heroWords.map((word, i) => (
            <span
              key={word}
              aria-hidden={i !== wordIndex}
              className={`display col-start-1 row-start-1 bg-gradient-to-r from-sky via-cyan to-violet bg-clip-text text-[clamp(2rem,7vw,3.5rem)] text-transparent transition-all duration-500 ${
                i === wordIndex
                  ? "translate-y-0 opacity-100 blur-0"
                  : "pointer-events-none -translate-y-2 opacity-0 blur-[4px]"
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        <div
          data-anim
          data-hero-badge
          className="glass glass-interactive group mt-10 rounded-full px-6 py-3"
        >
          <span className="relative z-[3] flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ice/85">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
            </span>
            Built for you, by hand
          </span>
        </div>

        <div
          data-anim
          data-hero-cue
          className="mt-14 flex flex-col items-center gap-3"
        >
          <span className="eyebrow text-[0.6rem]">Scroll</span>
          <span className="relative h-12 w-px overflow-hidden bg-white/12">
            <span className="absolute inset-x-0 top-0 h-4 animate-[drip_2.2s_ease-in-out_infinite] bg-gradient-to-b from-transparent to-cyan" />
          </span>
        </div>
      </div>
    </section>
  );
}
