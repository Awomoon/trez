"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Small remembered moments, laid out as a wall of pinned notes.
 *
 * This is deliberately *not* the Reasons grid again: those are uniform,
 * titled cards in neat columns. These are loose, differently sized, slightly
 * rotated notes flowing down CSS columns, so the two sections never read as
 * the same component with different words in it.
 */

// Fixed per-index tilts rather than Math.random(), so a note does not jump to
// a new angle on re-render and the server and client agree.
const TILTS = [-1.6, 1.1, -0.7, 1.8, -1.2, 0.8, -1.9, 1.4];

export default function Memories() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      const rise = window.matchMedia("(max-width: 640px)").matches ? 16 : 24;

      /* The tilt is set once and left alone. It is how these notes look
         rather than something that happens to them, so a note no longer
         rotates into place: it fades and rises, already at its angle. */
      gsap.set("[data-memory]", {
        opacity: 0,
        y: rise,
        scale: 0.98,
        rotate: (i, target) => Number((target as HTMLElement).dataset.tilt ?? 0),
      });

      ScrollTrigger.batch("[data-memory]", {
        start: "top 92%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.07,
            ease: "glass",
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  if (site.memories.length === 0) return null;

  return (
    <section
      id="memories"
      ref={root}
      className="relative mx-auto w-full max-w-5xl scroll-mt-28 px-5 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow="Little things I remember"
        title="The small stuff, which is really the big stuff"
      />

      <div className="mt-14 sm:mt-16 sm:columns-2 sm:gap-5 lg:gap-6 [&>*]:mb-5 lg:[&>*]:mb-6">
        {site.memories.map((memory, i) => {
          const tilt = TILTS[i % TILTS.length];
          return (
            <figure
              key={memory.title}
              data-memory
              data-anim
              data-tilt={tilt}
              className="glass glass-interactive group break-inside-avoid rounded-[1.5rem] p-6 sm:p-7"
            >
              {memory.photo && (
                <div className="relative z-[3] mb-5 aspect-[4/3] overflow-hidden rounded-[1rem]">
                  <Image
                    src={memory.photo}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              )}

              <span
                aria-hidden
                className="relative z-[3] mb-4 block h-px w-8 bg-cyan/50"
              />

              <h3 className="relative z-[3] display text-[1.35rem] leading-tight text-frost sm:text-[1.5rem]">
                {memory.title}
              </h3>

              <div className="relative z-[3] mt-4 flex flex-col gap-3">
                {memory.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-ice/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <figcaption className="relative z-[3] mt-5 font-mono text-[0.55rem] uppercase tracking-[0.25em] text-ice/30">
                {String(i + 1).padStart(2, "0")} · remembered
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
