"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import { burstConfetti } from "@/components/effects/confetti";

/**
 * A sealed envelope that opens on click.
 *
 * The flap is a CSS triangle rotated on the X axis with a 3D perspective on the
 * envelope, so opening it reads as a physical hinge rather than a fade. The
 * letter then rises out from behind the envelope's front panel — which is why
 * the panel sits at a higher z-index than the card that slides past it.
 */
export default function TimeCapsule() {
  const root = useRef<HTMLElement>(null);
  const envelope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const capsule = site.timeCapsule;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      gsap.from("[data-capsule-stage]", {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 1.1,
        ease: "glass",
        scrollTrigger: { trigger: root.current, start: "top 76%" },
      });

      // A slow breathing glow while it is still sealed, to say "click me".
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to("[data-capsule-glow]", {
          opacity: 0.85,
          scale: 1.08,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);

    const scope = root.current;
    if (!scope) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tl = gsap.timeline({ defaults: { ease: "glass" } });

    // Seal breaks, flap swings open, letter rises.
    tl.to(scope.querySelector("[data-seal]"), {
      scale: 1.35,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    })
      .to(
        scope.querySelector("[data-flap]"),
        { rotateX: 180, duration: 0.9 },
        "-=0.15",
      )
      // A flap hinged at the top sweeps a full envelope-height above the
      // envelope when it opens, straight across the heading — and z-index
      // cannot help, because up there it is over the page, not the envelope.
      // So it dissolves as it finishes opening: the envelope still reads as
      // open, and nothing is ever covered.
      .set(scope.querySelector("[data-flap]"), { zIndex: 0 }, "-=0.6")
      .to(
        scope.querySelector("[data-flap]"),
        { opacity: 0, duration: 0.45, ease: "power2.in" },
        "-=0.5",
      )
      .to(
        scope.querySelector("[data-letter]"),
        { y: -56, opacity: 1, duration: 1.1 },
        "-=0.4",
      )
      .from(
        scope.querySelectorAll("[data-capsule-line]"),
        { y: 18, opacity: 0, duration: 0.7, stagger: 0.09 },
        "-=0.6",
      )
      .add(() => {
        const rect = envelope.current?.getBoundingClientRect();
        if (rect) {
          burstConfetti(
            { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
            reduced ? 0 : 120,
          );
        }
        // The letter changes the page height considerably.
        ScrollTrigger.refresh();
      });
  };

  return (
    <section
      id="capsule"
      ref={root}
      className="relative mx-auto w-full max-w-3xl scroll-mt-28 px-5 py-24 text-center sm:py-32"
    >
      <p data-anim className="eyebrow relative z-10 mb-5">
        {capsule.eyebrow}
      </p>

      <h2
        data-anim
        className="display relative z-10 text-balance text-[clamp(2rem,6vw,3.75rem)] text-frost"
      >
        {capsule.title}
      </h2>

      {/* The prompt invites her to open it; once open there is nothing left
          for it to say, so an empty signoff removes the line entirely rather
          than leaving a gap above his message. */}
      {(open ? capsule.signoff : capsule.prompt) && (
        <p
          data-anim
          className="relative z-10 mx-auto mt-5 max-w-md text-balance text-sm leading-relaxed text-ice/65 sm:text-base"
        >
          {open ? capsule.signoff : capsule.prompt}
        </p>
      )}

      <div data-capsule-stage data-anim className="mt-20 sm:mt-24">
        {/* ---------------- Envelope ---------------- */}
        <div
          ref={envelope}
          className="relative mx-auto aspect-[3/2] w-full max-w-sm [perspective:1400px]"
        >
          <span
            data-capsule-glow
            aria-hidden
            className={`pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-cyan/25 blur-3xl transition-opacity duration-700 ${
              open ? "opacity-0" : "opacity-40"
            }`}
          />

          {/* Back wall of the envelope. */}
          <div className="glass absolute inset-0 z-[1] rounded-[1.25rem]" />

          {/* The letter. Starts tucked inside, slides up and out. */}
          <div
            data-letter
            className="absolute inset-x-4 bottom-8 z-[2] translate-y-6 opacity-0"
            aria-hidden={!open}
          >
            <div className="glass rounded-[1rem] px-5 py-6 text-left sm:px-7 sm:py-8">
              <p className="relative z-[3] font-mono text-[0.55rem] uppercase tracking-[0.3em] text-ice/45">
                Sealed for you
              </p>
              <p className="relative z-[3] mt-2 display text-lg text-frost sm:text-xl">
                {site.name}
              </p>
            </div>
          </div>

          {/* Front panel — sits above the letter so it can slide out past it. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-[3] h-[58%] rounded-b-[1.25rem] border-t border-white/15 bg-white/[0.07] backdrop-blur-md"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          />

          {/* Flap, hinged along its top edge. */}
          <div
            data-flap
            aria-hidden
            className="absolute inset-x-0 top-0 z-[4] h-[52%] origin-top [transform-style:preserve-3d]"
          >
            <div
              className="h-full w-full border-b border-white/20 bg-white/[0.1] backdrop-blur-md"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            />
          </div>

          {/* Wax seal. */}
          <button
            data-seal
            onClick={handleOpen}
            disabled={open}
            aria-label={open ? "Capsule opened" : capsule.buttonSealed}
            className="absolute left-1/2 top-[44%] z-[5] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-cyan/70 via-azure/70 to-violet/70 shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_0_40px_-6px_rgba(70,224,255,0.9)] transition-transform duration-300 hover:scale-105 disabled:cursor-default"
          >
            <span className="display text-2xl text-white drop-shadow">
              {capsule.sealInitial}
            </span>
          </button>
        </div>

        {/* ---------------- Contents ---------------- */}
        {open && (
          <div className="mx-auto mt-12 max-w-xl text-left">
            <div className="glass rounded-[1.75rem] px-7 py-9 sm:px-10 sm:py-11">
              <div className="relative z-[3] flex flex-col gap-5">
                {capsule.message.map((paragraph) => (
                  <p
                    key={paragraph}
                    data-capsule-line
                    className="text-[0.95rem] leading-[1.8] text-ice/80 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}

                <div data-capsule-line className="hairline my-3 w-full" />

                <p
                  data-capsule-line
                  className="eyebrow"
                >
                  {capsule.wishesTitle}
                </p>

                <ul className="flex flex-col gap-3.5">
                  {capsule.wishes.map((wish) => (
                    <li
                      key={wish}
                      data-capsule-line
                      className="flex gap-3 text-[0.95rem] leading-relaxed text-ice/75"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_10px_rgba(70,224,255,0.9)]"
                      />
                      {wish}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {!open && (
          <button
            onClick={handleOpen}
            className="glass glass-interactive group mt-10 rounded-full px-7 py-3.5 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ice/85"
          >
            <span className="relative z-[3]">{capsule.buttonSealed}</span>
          </button>
        )}
      </div>
    </section>
  );
}
