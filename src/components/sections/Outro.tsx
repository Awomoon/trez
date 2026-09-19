"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/config/site";

/**
 * The last thing on the page: one more song to see her out.
 *
 * A browser will not start audio on its own — autoplay without a user gesture
 * is blocked, and Spotify's embed needs a click regardless. So rather than
 * pretending it plays by itself, reaching the end *stages* it: the panel rises,
 * a ring pulses around the play hint, and the instruction is impossible to
 * miss. She presses play once and the song carries her out.
 */
export default function Outro() {
  const root = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const { eyebrow, title, body, hint, spotifyId } = site.outro;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 72%" },
        defaults: { ease: "glass" },
        onComplete: () => setArmed(true),
      });

      tl.from("[data-outro-panel]", {
        y: 70,
        opacity: 0,
        scale: 0.94,
        duration: 1.1,
      })
        .from(
          "[data-outro-line]",
          { y: 22, opacity: 0, duration: 0.8, stagger: 0.12 },
          "-=0.6",
        )
        .from(
          "[data-outro-player]",
          { y: 24, opacity: 0, duration: 0.9 },
          "-=0.4",
        );

      if (!reduced) {
        // A slow pulse on the hint so the invitation keeps asking.
        gsap.to("[data-outro-pulse]", {
          scale: 1.35,
          opacity: 0,
          duration: 2.2,
          ease: "power2.out",
          repeat: -1,
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="outro"
      ref={root}
      className="relative mx-auto w-full max-w-2xl scroll-mt-28 px-5 pb-8 pt-16 sm:pt-24"
    >
      <div data-outro-panel data-anim>
        <div
          className="glass rounded-[2rem] px-6 py-10 text-center sm:px-12 sm:py-14"
          style={{
            boxShadow:
              "inset 0 1px 0 0 rgb(255 255 255 / 0.32), inset 0 0 0 1px rgb(29 185 84 / 0.22), 0 24px 60px -26px rgb(1 5 14 / 0.95), 0 0 90px -30px rgb(29 185 84 / 0.7)",
          }}
        >
          <div className="relative z-[3]">
            <p
              data-outro-line
              className="eyebrow mb-5 !text-spotify-bright"
            >
              {eyebrow}
            </p>

            <h2
              data-outro-line
              className="display text-balance text-[clamp(1.9rem,6vw,3.25rem)] text-frost"
            >
              {title}
            </h2>

            <p
              data-outro-line
              className="mx-auto mt-5 max-w-md text-balance text-sm leading-relaxed text-ice/70 sm:text-base"
            >
              {body}
            </p>

            {/* The hint. Pulses until she reaches it. */}
            <p
              data-outro-line
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-spotify/40 bg-spotify/10 px-5 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-spotify-bright"
            >
              <span className="relative grid h-4 w-4 place-items-center">
                <span
                  data-outro-pulse
                  aria-hidden
                  className={`absolute inset-0 rounded-full bg-spotify-bright/60 ${
                    armed ? "" : "opacity-0"
                  }`}
                />
                <span
                  aria-hidden
                  className="relative h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-spotify-bright"
                />
              </span>
              {hint}
            </p>

            <div
              data-outro-player
              className="mt-8 overflow-hidden rounded-[1rem] bg-[#121212]"
            >
              <iframe
                src={`https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`}
                title="One last song"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{ background: "#121212", colorScheme: "dark" }}
                className="block h-[152px] w-full border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
