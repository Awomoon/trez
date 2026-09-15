"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import GlassPanel from "@/components/ui/GlassPanel";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * A grid of glass cards. `ScrollTrigger.batch` groups whatever enters the
 * viewport in the same frame, so cards animate in natural clusters instead of
 * one long mechanical stagger.
 */
export default function Reasons() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });
      gsap.set("[data-reason]", { opacity: 0, y: 64, scale: 0.94 });

      ScrollTrigger.batch("[data-reason]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.1,
            ease: "glass",
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="reasons"
      ref={root}
      className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow={`${site.reasons.length} of many`}
        title="Things about you I would defend in court"
      />

      <ul className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {site.reasons.map((reason, i) => (
          <li key={reason.title} data-reason data-anim className="h-full">
            <GlassPanel
              as="article"
              interactive
              className="group flex h-full flex-col gap-4 rounded-[1.75rem] p-7 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl" aria-hidden>
                  {reason.emoji}
                </span>
                <span className="font-mono text-[0.6rem] tracking-[0.25em] text-ice/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="display text-2xl text-frost sm:text-[1.75rem]">
                {reason.title}
              </h3>

              <p className="text-sm leading-relaxed text-ice/65">
                {reason.body}
              </p>
            </GlassPanel>
          </li>
        ))}
      </ul>
    </section>
  );
}
