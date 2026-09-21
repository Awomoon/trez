"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import { burstConfetti } from "@/components/effects/confetti";
import { playlistId } from "@/lib/spotify";

/**
 * The last thing on the page, and the one thing she has to find.
 *
 * The playlist lives here and nowhere else: showing it in the music section
 * as well would mean she had already seen it by the time she got here, and it
 * would stop being a surprise. The button glows green so it reads as worth
 * pressing rather than as a footer link, and it keeps throwing confetti on
 * every press afterwards.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState(false);

  const { surprise, footer } = site;

  const celebrate = () => {
    const rect = button.current?.getBoundingClientRect();
    burstConfetti(
      {
        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        y: rect ? rect.top : window.innerHeight / 2,
      },
      opened ? 180 : 260,
    );
    setOpened(true);
  };

  // Reveal the gift the first time, and only the first time.
  useEffect(() => {
    if (!opened) return;

    const scope = root.current;
    const gift = scope?.querySelector("[data-gift]");
    if (!gift) return;

    gsap
      .timeline({ defaults: { ease: "glass" } })
      .fromTo(
        gift,
        { opacity: 0, y: 40, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1 },
      )
      .from(
        scope!.querySelectorAll("[data-gift-line]"),
        { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 },
        "-=0.7",
      );

    // The gift adds a screen of height below everything else.
    ScrollTrigger.refresh();
  }, [opened]);

  return (
    <footer
      ref={root}
      className="relative mx-auto w-full max-w-4xl px-5 pb-[max(4rem,env(safe-area-inset-bottom))] pt-16 text-center"
    >
      <div className="hairline mb-14 w-full" />

      <p className="display text-[clamp(2rem,7vw,4.5rem)] text-frost">
        Happy birthday, <span className="shimmer-text">{site.name}</span>
      </p>

      <p className="mx-auto mt-6 max-w-md text-balance text-sm leading-relaxed text-ice/60">
        {footer.subtitle}
      </p>

      <button
        ref={button}
        onClick={celebrate}
        className={`group relative mt-10 rounded-full border px-7 py-3.5 font-mono text-[0.65rem] uppercase tracking-[0.25em] transition-colors duration-500 ${
          opened
            ? "border-white/25 bg-white/[0.07] text-ice/80"
            : "animate-[giftGlow_2.4s_ease-in-out_infinite] border-spotify/60 bg-spotify/15 text-spotify-bright"
        }`}
      >
        <span className="relative z-[3]">
          {opened ? surprise.buttonAgain : surprise.button} 🎉
        </span>
      </button>

      {/* ---------------- The gift ---------------- */}
      {opened && surprise.playlistUrl && (
        <div data-gift className="mx-auto mt-14 max-w-xl text-left">
          <div
            className="glass rounded-[1.5rem] p-3 sm:p-4"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgb(255 255 255 / 0.3), inset 0 0 0 1px rgb(29 185 84 / 0.24), 0 22px 50px -22px rgb(1 5 14 / 0.92), 0 0 80px -24px rgb(29 185 84 / 0.7)",
            }}
          >
            <div className="relative z-[3]">
              <div className="flex items-baseline justify-between gap-4 px-2 pb-1 pt-1">
                <p data-gift-line className="eyebrow !text-spotify-bright">
                  {surprise.label}
                </p>
                <span
                  aria-hidden
                  className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-ice/30"
                >
                  Spotify
                </span>
              </div>

              <p
                data-gift-line
                className="display px-2 pb-4 pt-1 text-[1.5rem] text-frost sm:text-[1.75rem]"
              >
                {surprise.title}
              </p>

              <div
                data-gift-line
                className="overflow-hidden rounded-[1rem] bg-[#121212]"
              >
                {/* The tall embed: anything near the 152px a single track uses
                    collapses the playlist to one bar and hides its listing. */}
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${playlistId(
                    surprise.playlistUrl,
                  )}?utm_source=generator&theme=0`}
                  title="A playlist for you"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  style={{ background: "#121212", colorScheme: "dark" }}
                  className="block h-[26rem] w-full border-0"
                />
              </div>

              <p
                data-gift-line
                className="mt-4 flex gap-3 px-2 pb-1 text-sm leading-relaxed text-ice/70"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-4 w-[2px] shrink-0 rounded-full bg-spotify-bright"
                />
                {surprise.note}
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="mt-16 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-ice/25">
        {footer.signoff}
      </p>
    </footer>
  );
}
