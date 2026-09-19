"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";

/**
 * The playlist.
 *
 * Styled green rather than blue — this is the one place the site borrows
 * another product's colour, so that a pane holding a real Spotify player reads
 * as a player and not as another glass card of text. The glass material is
 * unchanged; only the accent and the play affordance shift.
 *
 * The embedded player renders its own artwork, title and artist, so nothing
 * duplicates that here: each row is the official player plus the one line
 * explaining why the song is on the list. Iframes are lazy so they cost
 * nothing until scrolled near.
 */

const embedUrl = (id: string) =>
  `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;

export default function Music() {
  const root = useRef<HTMLElement>(null);
  const { eyebrow, title, subtitle, tracks } = site.music;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      gsap.from("[data-music-head] > *", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "glass",
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });

      ScrollTrigger.batch("[data-track]", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "glass",
              overwrite: true,
            },
          ),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  if (tracks.length === 0) return null;

  return (
    <section
      id="music"
      ref={root}
      className="relative mx-auto w-full max-w-3xl scroll-mt-28 px-5 py-24 sm:py-32"
    >
      <div data-music-head data-anim>
        <p className="eyebrow mb-5 flex items-center gap-2.5 !text-spotify-bright">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-spotify-bright shadow-[0_0_10px_var(--color-spotify-bright)]"
          />
          {eyebrow}
        </p>

        <h2 className="display text-balance text-[clamp(2rem,6vw,3.75rem)] text-frost">
          {title}
        </h2>

        <p className="mt-5 max-w-lg text-balance text-sm leading-relaxed text-ice/65 sm:text-base">
          {subtitle}
        </p>
      </div>

      <ul className="mt-12 flex flex-col gap-5 sm:mt-14">
        {tracks.map((track, i) => (
          <li key={track.spotifyId} data-track data-anim>
            <div
              className="glass group rounded-[1.5rem] p-3 sm:p-4"
              style={{
                // A green rim and bloom instead of the site's cyan one.
                boxShadow:
                  "inset 0 1px 0 0 rgb(255 255 255 / 0.3), inset 0 0 0 1px rgb(29 185 84 / 0.18), 0 18px 40px -22px rgb(1 5 14 / 0.9), 0 0 60px -28px rgb(29 185 84 / 0.55)",
              }}
            >
              <div className="relative z-[3]">
                {/* The official player. It carries the artwork and metadata. */}
                <div className="overflow-hidden rounded-[1rem] bg-[#121212]">
                  <iframe
                    src={embedUrl(track.spotifyId)}
                    title={`Spotify player, track ${i + 1}`}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    // Spotify's own dark, so the frame is never a white slab
                    // while it loads on a slow connection.
                    style={{ background: "#121212", colorScheme: "dark" }}
                    className="block h-[152px] w-full border-0"
                  />
                </div>

                <p className="mt-4 flex gap-3 px-2 pb-1 text-sm leading-relaxed text-ice/70">
                  <span
                    aria-hidden
                    className="mt-1.5 h-4 w-[2px] shrink-0 rounded-full bg-spotify-bright"
                  />
                  {track.note}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
