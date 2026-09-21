"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/config/site";

/**
 * The last thing on the page: one more song to see her out.
 *
 * Two facts shape this section.
 *
 * 1. A Spotify embed only plays a 30-second preview unless the listener is
 *    signed in to Spotify in that same browser. A YouTube embed plays the
 *    song in full, for free, with no account — so `youtubeId` wins whenever
 *    it is set, and Spotify is the fallback.
 * 2. Browsers refuse to start audio without a user gesture. With YouTube we
 *    can at least *try*: if she has already tapped something on the page
 *    (candles, the capsule, a track), the browser may honour a play command.
 *    That attempt is best-effort and silent when it fails — the visible play
 *    prompt is always there, so the song is never more than one tap away.
 */
export default function Outro() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [armed, setArmed] = useState(false);
  const tried = useRef(false);

  const { eyebrow, title, body, hint, youtubeId, spotifyId } = site.outro;
  const usingYouTube = Boolean(youtubeId);

  /** Ask the YouTube frame to start. Silently does nothing if refused. */
  const nudgePlay = () => {
    if (!usingYouTube || tried.current) return;
    const win = frame.current?.contentWindow;
    if (!win) return;

    // Only worth trying once she has interacted with the page at all;
    // otherwise the browser is certain to refuse and we would just be
    // shouting into the void.
    const activated =
      typeof navigator !== "undefined" && "userActivation" in navigator
        ? (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } })
            .userActivation?.hasBeenActive
        : true;

    if (!activated) return;
    tried.current = true;

    const play = () =>
      win.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "https://www.youtube.com",
      );

    // The frame may still be booting its API listener.
    play();
    window.setTimeout(play, 700);
    window.setTimeout(play, 1800);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 72%" },
        defaults: { ease: "glass" },
        onComplete: () => {
          setArmed(true);
          nudgePlay();
        },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const src = usingYouTube
    ? `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&playsinline=1&modestbranding=1`
    : `https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`;

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
              "inset 0 1px 0 0 rgb(255 255 255 / 0.32), inset 0 0 0 1px rgb(29 185 84 / 0.22), 0 24px 60px -26px rgb(var(--c-ink) / 0.95), 0 0 90px -30px rgb(29 185 84 / 0.7)",
          }}
        >
          <div className="relative z-[3]">
            <p data-outro-line className="eyebrow mb-5 !text-spotify-bright">
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
              className={`mt-8 overflow-hidden rounded-[1rem] bg-[#121212] ${
                usingYouTube ? "aspect-video" : ""
              }`}
            >
              <iframe
                ref={frame}
                src={src}
                title="One last song"
                loading="lazy"
                onLoad={nudgePlay}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{ background: "#121212", colorScheme: "dark" }}
                className={`block w-full border-0 ${
                  usingYouTube ? "h-full" : "h-[152px]"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
