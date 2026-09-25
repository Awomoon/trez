"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import MoonDisc from "@/components/background/MoonDisc";

/**
 * The moon, quietly.
 *
 * It fades in, drifts a short way down and in across the whole page, and
 * grows very slightly. That is the entire scroll behaviour: no rotation, no
 * route around the screen, no leaving and returning. It is meant to be felt
 * rather than watched, so the numbers below are small on purpose.
 *
 * Two things still move on their own, both slow enough to read as stillness:
 * a gentle float on its own element, and the glow's pulse, which is CSS.
 *
 * Under prefers-reduced-motion nothing is bound to scroll at all; the moon
 * simply sits where it starts.
 */

/** How far the moon travels over the whole page, in viewport units. */
const DRIFT = {
  /* Kept out near the edge: the content column is centred, so a moon that
     drifts inward ends up behind the words, and bright enough through the
     glass to make them hard to read. */
  wide: { fromX: 33, toX: 28, fromY: -25, toY: 2, fromScale: 1, toScale: 1.08 },
  /* A phone is all content column, so there is no edge to hide at. There
     the moon sits further back instead (see .moon-body in moon.css) and
     drifts mostly downward. */
  phone: { fromX: 26, toX: 20, fromY: -34, toY: -10, fromScale: 1, toScale: 1.06 },
};

export default function MoonSky() {
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = field.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const park = (d: typeof DRIFT.wide) =>
        gsap.set(".moon-travel", {
          x: (d.fromX / 100) * window.innerWidth,
          y: (d.fromY / 100) * window.innerHeight,
          scale: d.fromScale,
          opacity: 1,
        });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        park(DRIFT.wide);
      });

      mm.add(
        {
          phone: "(max-width: 640px) and (prefers-reduced-motion: no-preference)",
          wide: "(min-width: 641px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { phone } = context.conditions as { phone: boolean };
          const d = phone ? DRIFT.phone : DRIFT.wide;

          park(d);

          /* The float, on its own element so it adds to the drift rather
             than overwriting it. */
          const float = gsap.to(".moon-float", {
            y: phone ? "3%" : "5%",
            duration: 9,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          /* Arriving. Once, near the top of the page. */
          const arrive = gsap.from(".moon-travel", {
            opacity: 0,
            duration: 2.2,
            ease: "sine.out",
          });

          /* The drift. Pixels from functions so it is exact and still
             responsive: invalidateOnRefresh re-runs them on resize. */
          const drift = gsap.fromTo(
            ".moon-travel",
            {
              x: () => (d.fromX / 100) * window.innerWidth,
              y: () => (d.fromY / 100) * window.innerHeight,
              scale: d.fromScale,
            },
            {
              x: () => (d.toX / 100) * window.innerWidth,
              y: () => (d.toY / 100) * window.innerHeight,
              scale: d.toScale,
              ease: "none",
              scrollTrigger: {
                trigger: document.documentElement,
                start: "top top",
                end: "bottom bottom",
                /* Generous, so the moon always lags well behind the
                   scrollbar and never reads as attached to it. */
                scrub: 2,
                invalidateOnRefresh: true,
              },
            },
          );

          /* A hint of parallax on the far stars, and nothing on the near
             ones. Any more than this and the sky starts sliding. */
          const stars = gsap.to(".moon-stars-bright", {
            y: phone ? "-1.5%" : "-2.5%",
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 2,
            },
          });

          return () => {
            float.kill();
            arrive.kill();
            drift.scrollTrigger?.kill();
            drift.kill();
            stars.scrollTrigger?.kill();
            stars.kill();
          };
        },
      );

      return () => mm.revert();
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={field}
      aria-hidden
      className="moon-field pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="moon-stars-fine" />
      <div className="moon-stars-bright" />
      <div className="moon-wash" />

      <div className="moon-travel">
        <div className="moon-float">
          <div className="moon-body">
            <div className="moon-glow">
              <div className="moon-halo" />
            </div>
            <div className="moon-disc">
              <MoonDisc />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
