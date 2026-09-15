"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import GlassPanel from "@/components/ui/GlassPanel";

/**
 * Pinned horizontal scroll. The section sticks to the viewport and vertical
 * scroll distance is translated into sideways movement of the card track.
 *
 * On narrow screens horizontal pinning fights with touch scrolling, so below
 * the `lg` breakpoint the same cards are laid out as an ordinary vertical
 * stack and the pin never gets created.
 */
export default function Story() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      const matchMedia = gsap.matchMedia();

      matchMedia.add("(min-width: 1024px)", () => {
        const el = track.current;
        if (!el) return;

        const distance = () => el.scrollWidth - window.innerWidth;

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Each card lifts slightly as it crosses the middle of the screen.
        const cards = gsap.utils.toArray<HTMLElement>("[data-chapter]");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 56, opacity: 0.35 },
            {
              y: 0,
              opacity: 1,
              ease: "glass",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 88%",
                end: "left 52%",
                scrub: true,
              },
            },
          );
        });
      });

      matchMedia.add("(max-width: 1023px)", () => {
        ScrollTrigger.batch("[data-chapter]", {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: 56 },
              { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "glass" },
            ),
        });
      });

      return () => matchMedia.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={root} className="relative overflow-hidden py-28 lg:py-0">
      <div className="lg:flex lg:h-[100svh] lg:flex-col lg:justify-center">
        <header className="mx-auto w-full max-w-6xl px-5 lg:px-12">
          <p data-anim className="eyebrow mb-4">
            The short version
          </p>
          <h2
            data-anim
            className="display max-w-2xl text-balance text-[clamp(2rem,6vw,4rem)] text-frost"
          >
            How we got here, in four scenes
          </h2>
        </header>

        <div
          ref={track}
          className="mt-12 flex flex-col gap-5 px-5 lg:mt-14 lg:w-max lg:flex-row lg:gap-8 lg:px-12"
        >
          {site.timeline.map((chapter) => (
            <div
              key={chapter.chapter}
              data-chapter
              className="lg:w-[clamp(22rem,34vw,30rem)] lg:shrink-0"
            >
              <GlassPanel
                interactive
                className="group flex h-full flex-col justify-between gap-10 rounded-[2rem] p-8 sm:p-10 lg:min-h-[22rem]"
              >
                <span className="display text-[4rem] leading-none text-white/12 lg:text-[5.5rem]">
                  {chapter.chapter}
                </span>

                <div className="flex flex-col gap-4">
                  <h3 className="display text-[1.75rem] text-frost sm:text-3xl">
                    {chapter.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ice/65 sm:text-base">
                    {chapter.body}
                  </p>
                </div>
              </GlassPanel>
            </div>
          ))}
        </div>

        <p
          aria-hidden
          className="mt-10 hidden px-12 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ice/35 lg:block"
        >
          Keep scrolling — the story moves sideways
        </p>
      </div>
    </section>
  );
}
