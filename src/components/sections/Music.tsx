"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * The playlist.
 *
 * Each track is a row with a spinning vinyl disc, the note explaining why it
 * is on the list, and — if an embed URL was supplied — a player that is only
 * mounted once the row is opened. Mounting every iframe up front would pull in
 * a provider bundle per track on first paint; this way an unopened row costs
 * nothing.
 *
 * A track without an embed is still a complete card. That matters because
 * embeds are blocked in some preview sandboxes, and because you may just want
 * to name a song without wiring up a player.
 */

/** Deterministic cover art, so a track without artwork still looks intentional. */
const DISC_GRADIENTS = [
  "from-azure via-cyan to-violet",
  "from-violet via-azure to-sky",
  "from-cyan via-sky to-azure",
  "from-sky via-violet to-cyan",
];

function Disc({ index, spinning }: { index: number; spinning: boolean }) {
  return (
    <span
      aria-hidden
      className="relative grid h-14 w-14 shrink-0 place-items-center sm:h-16 sm:w-16"
    >
      <span
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${
          DISC_GRADIENTS[index % DISC_GRADIENTS.length]
        } opacity-80 shadow-[0_0_28px_-8px_rgba(70,224,255,0.9)] ${
          spinning ? "animate-[spin_5s_linear_infinite]" : ""
        }`}
      />
      {/* Grooves and label, so it reads as a record rather than a circle. */}
      <span className="absolute inset-[18%] rounded-full border border-white/25" />
      <span className="absolute inset-[38%] rounded-full bg-abyss/80" />
      <span className="absolute inset-[47%] rounded-full bg-cyan/70" />
    </span>
  );
}

/**
 * Three bars, shown only while a track is open. Rendering them idle put a row
 * of tiny static dots next to the button that read as an ellipsis rather than
 * as a meter, so the closed state simply has no meter at all.
 */
function Equalizer({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <span aria-hidden className="flex h-4 items-end gap-[3px]">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="w-[3px] rounded-full bg-cyan animate-[bounceBar_0.9s_ease-in-out_infinite]"
          style={{ height: "100%", animationDelay: `${bar * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export default function Music() {
  const root = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      ScrollTrigger.batch("[data-track]", {
        start: "top 92%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, x: -28 },
            {
              opacity: 1,
              x: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: "glass",
              overwrite: true,
            },
          ),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Opening a row changes the page height, so triggers below it must move.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [openIndex]);

  if (site.music.length === 0) return null;

  return (
    <section
      id="music"
      ref={root}
      className="relative mx-auto w-full max-w-4xl scroll-mt-28 px-5 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow={`${site.music.length} songs`}
        title="Songs that are basically about you now"
      />

      <ul className="mt-14 flex flex-col gap-4 sm:mt-16">
        {site.music.map((track, i) => {
          const isOpen = openIndex === i;
          const hasEmbed = Boolean(track.embedUrl);

          return (
            <li key={`${track.title}-${i}`} data-track data-anim>
              <div className="glass glass-interactive group rounded-[1.5rem] p-5 sm:p-6">
                <div className="relative z-[3] flex items-center gap-4 sm:gap-5">
                  <Disc index={i} spinning={isOpen} />

                  <div className="min-w-0 flex-1">
                    <p className="display truncate text-xl text-frost sm:text-2xl">
                      {track.title}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ice/50">
                      {track.artist}
                    </p>
                  </div>

                  <Equalizer active={isOpen} />

                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen
                        ? `Close ${track.title}`
                        : `Open ${track.title} by ${track.artist}`
                    }
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-white/[0.08] text-ice transition-all duration-300 hover:border-cyan/60 hover:bg-white/[0.14]"
                  >
                    <span
                      aria-hidden
                      className={`transition-transform duration-500 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      {isOpen ? "×" : "+"}
                    </span>
                  </button>
                </div>

                {/* Note + player. Kept mounted-on-demand, not hidden. */}
                {isOpen && (
                  <div className="relative z-[3] mt-5 flex flex-col gap-4 border-t border-white/10 pt-5">
                    <p className="text-sm leading-relaxed text-ice/70">
                      {track.note}
                    </p>

                    {hasEmbed && (
                      <div className="overflow-hidden rounded-[1rem] border border-white/12 bg-abyss/40">
                        <iframe
                          src={track.embedUrl as string}
                          title={`${track.title} by ${track.artist}`}
                          loading="lazy"
                          allow="encrypted-media; clipboard-write; picture-in-picture"
                          className="h-[152px] w-full border-0"
                        />
                      </div>
                    )}

                    {track.link && (
                      <a
                        href={track.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start font-mono text-[0.6rem] uppercase tracking-[0.25em] text-cyan/80 underline-offset-4 hover:underline"
                      >
                        Open the song ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
