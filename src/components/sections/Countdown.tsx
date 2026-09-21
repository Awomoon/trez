"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import { getCountdown, pad, type CountdownState } from "@/lib/countdown";
import GlassPanel from "@/components/ui/GlassPanel";
import SectionHeading from "@/components/ui/SectionHeading";

const UNITS = ["days", "hours", "minutes", "seconds"] as const;

/** One glass tile. Re-animates itself whenever its value changes. */
function Tile({ label, value }: { label: string; value: number }) {
  const digits = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;

    gsap.fromTo(
      digits.current,
      { yPercent: -55, opacity: 0, filter: "blur(6px)" },
      {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "glass",
      },
    );
  }, [value]);

  return (
    <GlassPanel
      interactive
      className="group flex aspect-square flex-col items-center justify-center rounded-[1.5rem] p-2 sm:rounded-[2rem]"
    >
      <span className="flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <span
          ref={digits}
          className="display text-[clamp(2rem,8vw,4.25rem)] tabular-nums text-frost drop-shadow-[0_0_24px_rgb(var(--c-glow)/0.35)]"
        >
          {pad(value)}
        </span>
        <span className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-ice/50 sm:text-[0.65rem]">
          {label}
        </span>
      </span>
    </GlassPanel>
  );
}

export default function Countdown() {
  // Rendered empty on the server so the markup cannot disagree with the client.
  const [state, setState] = useState<CountdownState | null>(null);
  const root = useRef<HTMLElement>(null);

  // Reveals this section's [data-anim] elements and floats the tiles in.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      ScrollTrigger.batch("[data-tile]", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 56, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.09,
              ease: "glass",
            },
          ),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const update = () => setState(getCountdown(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  const phase = state?.phase ?? "before";
  const copy = site.countdown;

  const title = phase === "today" ? copy.dayOfTitle : copy.beforeTitle;
  const subtitle =
    phase === "today" ? copy.dayOfSubtitle : copy.beforeSubtitle;

  return (
    <section
      id="countdown"
      ref={root}
      className="relative mx-auto w-full max-w-5xl scroll-mt-28 px-5 py-24 sm:py-32"
    >
      <SectionHeading eyebrow="The clock" title={title} align="center" />

      <p className="mx-auto mt-5 max-w-xl text-balance text-center text-sm leading-relaxed text-ice/65 sm:text-base">
        {subtitle}
      </p>

      {phase === "today" ? (
        <div data-anim className="mt-14">
          <GlassPanel
            interactive
            className="group mx-auto max-w-2xl rounded-[2rem] px-8 py-14 text-center sm:px-14"
          >
            <p className="display shimmer-text text-[clamp(2.5rem,9vw,5rem)]">
              It&apos;s your day
            </p>
            <p className="mt-6 text-sm leading-relaxed text-ice/70 sm:text-base">
              No numbers left to count. Just go and have the best one.
            </p>
          </GlassPanel>
        </div>
      ) : (
        <div
          data-anim
          className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        >
          {UNITS.map((unit) => (
            <div key={unit} data-tile>
              <Tile label={unit} value={state ? state.timeLeft[unit] : 0} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
