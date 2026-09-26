"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/config/site";
import { asset } from "@/lib/asset";
import VideoPlayer from "@/components/ui/VideoPlayer";

/**
 * The video, sitting between the capsule and the letter.
 *
 * Deliberately without a heading: everything else on the page announces
 * itself, and this one should just be there when she reaches it.
 *
 * The caption is in the DOM from the start, at zero opacity, so a screen
 * reader has it the whole time. It becomes visible when the video finishes,
 * which is the moment it is written for. It also becomes visible if she
 * scrolls past without watching, or after long enough with the section on
 * screen, because a line like that should never be something she can miss
 * by not pressing play.
 */
export default function Moment() {
  const root = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  const { moment } = site;

  /* Reveal once, from whichever of the three happens first. `revealSoon`
     waits a beat so the last frame and the controls can settle before the
     line arrives, rather than it landing on the same tick as the ending. */
  const revealSoon = useCallback(() => {
    if (revealed) return;
    window.setTimeout(() => setRevealed(true), 700);
  }, [revealed]);

  useEffect(() => {
    if (revealed) return;
    const scope = root.current;
    if (!scope) return;

    const reveal = () => setRevealed(true);

    /* The fallback timer only starts once the section is actually on
       screen, so it cannot fire while she is still somewhere up the page. */
    let timer = 0;
    const onScreen = ScrollTrigger.create({
      trigger: scope,
      start: "top 70%",
      end: "bottom 30%",
      onEnter: () => {
        timer = window.setTimeout(reveal, 15000);
      },
      /* Scrolled past it: she has had her chance to press play. */
      onLeave: reveal,
      onLeaveBack: reveal,
    });

    return () => {
      window.clearTimeout(timer);
      onScreen.kill();
    };
  }, [revealed]);

  /* The entrance: the same fade and short rise as everything else. */
  useEffect(() => {
    const scope = root.current;
    if (!scope || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });
      gsap.from("[data-moment-card]", {
        opacity: 0,
        y: window.matchMedia("(max-width: 640px)").matches ? 16 : 26,
        scale: 0.98,
        duration: 1,
        ease: "glass",
        scrollTrigger: { trigger: scope, start: "top 80%" },
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  if (!moment.src) return null;

  return (
    <section
      id="moment"
      ref={root}
      className="relative mx-auto w-full max-w-3xl scroll-mt-28 px-5 py-24 sm:py-32"
    >
      <div data-moment-card data-anim className="relative">
        {/* A soft light behind the card, not on it: no filter, nothing
            animating, just a gradient sitting there.
            
            It only reaches past the card sideways from `sm` up. On a phone
            the card already runs to the gutters, so bleeding wider pushed
            the page 20px past the viewport and gave the whole site a
            horizontal scrollbar. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -inset-y-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgb(var(--c-glow)/0.1),rgb(var(--c-accent)/0.05)_55%,transparent_78%)] sm:-inset-x-10 sm:-inset-y-12"
        />

        <div className="glass rounded-[1.75rem] p-2.5 sm:p-3">
          <div className="relative z-[3]">
            <VideoPlayer
              src={asset(moment.src)}
              width={moment.width}
              height={moment.height}
              label={moment.alt}
              onEnded={revealSoon}
            />
          </div>
        </div>

        <p
          className={`display mt-8 text-center text-[1.35rem] leading-snug text-frost transition-opacity duration-[1600ms] ease-out sm:text-[1.6rem] ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        >
          {moment.caption}
        </p>

        {moment.note && (
          <p
            className={`mt-3 text-center text-[0.8rem] leading-relaxed text-ice/45 transition-opacity duration-[1600ms] delay-300 ease-out ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            {moment.note}
          </p>
        )}
      </div>
    </section>
  );
}
