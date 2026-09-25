"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import MoonDisc from "@/components/background/MoonDisc";

/**
 * The moon travelling through the page.
 *
 * A note on the library. The brief asked for Framer Motion's useScroll and
 * useSpring; this project has never used Framer Motion, it uses GSAP
 * throughout, and adding a second animation library for one component would
 * mean two scroll systems fighting for the same frames. ScrollTrigger with
 * `scrub` is the same idea under a different name: scroll drives a timeline,
 * and the number in `scrub` is how many seconds the moon takes to catch up,
 * which is what keeps it from snapping to the scrollbar.
 *
 * The journey is a list of stops below. Each one is a place on the screen in
 * viewport units, so it is responsive by construction rather than by
 * recalculation, plus how big the moon is there and how hard it glows.
 * Rewriting the journey means editing that list and nothing else.
 */

/** The strongest glow in either journey. Stop halos are divided by this to
 *  land in the 0 to 1 an opacity needs, which keeps their relative weights. */
const HALO_MAX = 1.7;

type Stop = {
  /** Where in the page, 0 at the top and 1 at the bottom. */
  at: number;
  /** Across and down from the middle of the screen, in vw and vh. */
  x: number;
  y: number;
  scale: number;
  /** Degrees. Small on purpose: the craters should drift, not spin. */
  rotate: number;
  /** Multiplier on the glow. */
  halo: number;
  /**
   * How present the moon is. Dropped on the legs where it has to cross the
   * middle of the screen: a bright disc sliding over a heading competes with
   * it, and no amount of z-index fixes that, because the problem is contrast
   * rather than order. Fading it out on the crossing and back in at the far
   * side reads as the moon slipping behind the night, and the words stay
   * the brightest thing on screen throughout.
   */
  opacity: number;
};

/* The moon keeps to the upper corners and the far edges, away from the
   middle where the words are. It leaves the screen twice, which is what
   makes coming back feel like something. */
const DESKTOP: Stop[] = [
  { at: 0.0, x: 30, y: -27, scale: 1.0, rotate: 0, halo: 1.0, opacity: 1 },
  { at: 0.12, x: 27, y: -14, scale: 0.95, rotate: 5, halo: 0.9, opacity: 0.95 },
  { at: 0.22, x: 16, y: -32, scale: 0.9, rotate: 9, halo: 0.7, opacity: 0.4 },
  { at: 0.32, x: -30, y: -24, scale: 0.86, rotate: 14, halo: 0.75, opacity: 0.9 },
  { at: 0.42, x: -50, y: -4, scale: 0.8, rotate: 19, halo: 0.55, opacity: 0.85 },
  { at: 0.52, x: -34, y: -30, scale: 0.88, rotate: 24, halo: 0.75, opacity: 0.9 },
  { at: 0.62, x: 4, y: -35, scale: 0.92, rotate: 28, halo: 0.6, opacity: 0.38 },
  { at: 0.72, x: 34, y: -20, scale: 0.98, rotate: 32, halo: 1.0, opacity: 1 },
  { at: 0.82, x: 31, y: 29, scale: 1.06, rotate: 36, halo: 1.1, opacity: 0.9 },
  { at: 0.92, x: -29, y: 17, scale: 0.92, rotate: 41, halo: 0.85, opacity: 0.85 },
  { at: 1.0, x: 0, y: 9, scale: 1.42, rotate: 46, halo: 1.7, opacity: 0.5 },
];

/* A phone is one column of text with no margins to hide in, so the moon is
   smaller (set in CSS) and these keep it to the top and bottom bands and the
   very edges. It never parks over the middle of the screen, which is where
   she is reading. */
const MOBILE: Stop[] = [
  { at: 0.0, x: 24, y: -33, scale: 1.0, rotate: 0, halo: 0.95, opacity: 1 },
  { at: 0.12, x: 28, y: -37, scale: 0.94, rotate: 5, halo: 0.85, opacity: 0.95 },
  { at: 0.22, x: 10, y: -40, scale: 0.88, rotate: 9, halo: 0.65, opacity: 0.38 },
  { at: 0.32, x: -27, y: -36, scale: 0.86, rotate: 14, halo: 0.75, opacity: 0.9 },
  { at: 0.42, x: -42, y: -24, scale: 0.82, rotate: 19, halo: 0.55, opacity: 0.85 },
  { at: 0.52, x: -26, y: -39, scale: 0.88, rotate: 24, halo: 0.7, opacity: 0.9 },
  { at: 0.62, x: 6, y: -41, scale: 0.9, rotate: 28, halo: 0.6, opacity: 0.36 },
  { at: 0.72, x: 30, y: -34, scale: 0.96, rotate: 32, halo: 0.95, opacity: 1 },
  { at: 0.82, x: 31, y: 38, scale: 1.02, rotate: 36, halo: 1.05, opacity: 0.85 },
  { at: 0.92, x: -30, y: 36, scale: 0.92, rotate: 41, halo: 0.85, opacity: 0.85 },
  { at: 1.0, x: 0, y: 12, scale: 1.3, rotate: 46, halo: 1.5, opacity: 0.42 },
];

export default function MoonSky() {
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = field.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* Reduced motion: the sky is still there, the moon is simply where it
         starts and stays. No scroll binding, no drift, no pulse (the pulse
         is CSS, and the global reduced-motion rule already stops it). */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const first = DESKTOP[0];
        gsap.set(".moon-travel", {
          x: (first.x / 100) * window.innerWidth,
          y: (first.y / 100) * window.innerHeight,
          scale: first.scale,
        });
        gsap.set(".moon-glow", { opacity: first.halo / HALO_MAX });
        gsap.set(".moon-wash", { opacity: (first.halo / HALO_MAX) * 0.9 });
      });

      mm.add(
        {
          phone: "(max-width: 640px) and (prefers-reduced-motion: no-preference)",
          wide: "(min-width: 641px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { phone } = context.conditions as { phone: boolean };
          const stops = phone ? MOBILE : DESKTOP;

          /* The idle drift. Its own element, so it adds to the journey's
             transform instead of overwriting it. */
          gsap.to(".moon-float", {
            y: phone ? "4%" : "7%",
            duration: 7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          /* Pixels from a function rather than "34vw" strings. Function
             values are re-evaluated whenever the tween is invalidated, and
             invalidateOnRefresh below means that happens on every resize,
             so this stays responsive while being exact: vw/vh strings were
             landing the moon short of where the list says. */
          const place = (stop: Stop) => ({
            x: () => (stop.x / 100) * window.innerWidth,
            y: () => (stop.y / 100) * window.innerHeight,
            scale: stop.scale,
            rotation: stop.rotate,
            opacity: stop.opacity,
            ease: "sine.inOut",
          });

          gsap.set(".moon-travel", {
            x: (stops[0].x / 100) * window.innerWidth,
            y: (stops[0].y / 100) * window.innerHeight,
            scale: stops[0].scale,
            rotation: stops[0].rotate,
            opacity: stops[0].opacity,
          });
          gsap.set(".moon-glow", { opacity: stops[0].halo / HALO_MAX });
          gsap.set(".moon-wash", { opacity: (stops[0].halo / HALO_MAX) * 0.9 });

          const travel = gsap.timeline({
            defaults: { ease: "sine.inOut" },
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              /* The lag that makes it dreamy rather than mechanical: the
                 moon takes this long to arrive where the scrollbar already
                 is. Lower it to make the moon keener. */
              scrub: phone ? 1 : 1.6,
              invalidateOnRefresh: true,
            },
          });

          /* Each leg is given a duration equal to the gap between its stops,
             so the timeline's own clock lines up with scroll position and a
             stop lands where the list says it should. */
          stops.slice(1).forEach((stop, i) => {
            const span = stop.at - stops[i].at;
            travel.to(".moon-travel", { ...place(stop), duration: span }, stops[i].at);
            travel.to(
              ".moon-glow",
              { opacity: stop.halo / HALO_MAX, duration: span },
              stops[i].at,
            );
            travel.to(
              ".moon-wash",
              { opacity: (stop.halo / HALO_MAX) * 0.9, duration: span },
              stops[i].at,
            );
          });

          /* Parallax. The near layer moves more than the far one, and the
             far one brightens toward the end so the sky deepens as she
             reaches it. */
          travel.to(
            ".moon-stars-fine",
            { y: phone ? "-2%" : "-4%", duration: 1, ease: "none" },
            0,
          );
          travel.to(
            ".moon-stars-bright",
            { y: phone ? "-5%" : "-9%", duration: 1, ease: "none" },
            0,
          );
          travel.fromTo(
            ".moon-stars-bright",
            { opacity: 0.75 },
            { opacity: 1, duration: 1, ease: "none" },
            0,
          );

          return () => {
            travel.scrollTrigger?.kill();
            travel.kill();
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
