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
 *
 * The reveal is deliberately small: fade, a short rise, and a scale that
 * starts at 0.98 rather than anything you would notice as a scale. It happens
 * once, on the way in, and then the card is simply a card.
 */
export default function Reasons() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      /* Shorter travel on a phone, where a card is most of the screen and a
         long rise reads as the page lurching. */
      const rise = window.matchMedia("(max-width: 640px)").matches ? 16 : 26;

      gsap.set("[data-reason]", { opacity: 0, y: rise, scale: 0.98 });

      ScrollTrigger.batch("[data-reason]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.08,
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
              {/* The emoji live inside the titles now, so the old badge in
                  this row would only repeat them. */}
              <div className="flex justify-end">
                <span className="font-mono text-[0.6rem] tracking-[0.25em] text-ice/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="display text-2xl text-frost sm:text-[1.75rem]">
                {reason.title}
              </h3>

              <div className="flex flex-col gap-3">
                {reason.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-ice/65"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </GlassPanel>
          </li>
        ))}
      </ul>
    </section>
  );
}
