"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { site } from "@/config/site";
import GlassPanel from "@/components/ui/GlassPanel";
import { burstConfetti } from "@/components/effects/confetti";

const CANDLE_COUNT = site.closing.candles;

/** One layer of the cake: a glass pane wearing a lip of icing. */
function Tier({
  label,
  height,
  radius,
}: {
  label: string;
  height: string;
  radius: string;
}) {
  return (
    <GlassPanel className={`${height} ${radius} w-full`}>
      <span className="sr-only">{label}</span>

      {/* Icing lip along the top edge. */}
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-4 ${radius} rounded-b-none bg-gradient-to-b from-white/35 via-white/18 to-transparent`}
      />

      {/* Drips running off the lip at irregular intervals. */}
      {[12, 31, 49, 68, 86].map((left, i) => (
        <span
          key={left}
          aria-hidden
          className="absolute top-3 w-2.5 rounded-b-full bg-white/20 sm:w-3"
          style={{ left: `${left}%`, height: `${[14, 22, 11, 26, 16][i]}px` }}
        />
      ))}
    </GlassPanel>
  );
}

/**
 * The interactive bit. Five candles, each one tappable. Blowing out the last
 * candle fires confetti from the centre of the cake and swaps the prompt for
 * the closing message.
 *
 * The cake itself is built from stacked glass panes rather than an image, so it
 * belongs to the same material language as the rest of the page.
 */
export default function Cake() {
  const root = useRef<HTMLElement>(null);
  const cake = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<boolean[]>(() =>
    Array.from({ length: CANDLE_COUNT }, () => true),
  );

  const allOut = lit.every((flame) => !flame);
  const remaining = lit.filter(Boolean).length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      gsap.from("[data-cake-layer]", {
        y: 70,
        opacity: 0,
        scale: 0.9,
        duration: 1.1,
        stagger: 0.12,
        ease: "glass",
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });

      gsap.from("[data-candle]", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "back.out(2)",
        scrollTrigger: { trigger: root.current, start: "top 62%" },
      });

      // The cake sways gently forever — unless that would be unwelcome.
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to("[data-cake-stack]", {
          rotate: 0.9,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "50% 100%",
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  /** Puff of smoke, then the flame is gone. */
  const extinguish = useCallback(
    (index: number) => {
      if (!lit[index]) return;

      const flame = root.current?.querySelector(
        `[data-flame="${index}"]`,
      ) as HTMLElement | null;
      const smoke = root.current?.querySelector(
        `[data-smoke="${index}"]`,
      ) as HTMLElement | null;

      if (flame) {
        gsap.to(flame, {
          scaleY: 0.2,
          scaleX: 1.5,
          opacity: 0,
          duration: 0.28,
          ease: "power2.in",
          transformOrigin: "50% 100%",
        });
      }

      if (smoke) {
        gsap.fromTo(
          smoke,
          { opacity: 0.85, y: 0, scale: 0.4 },
          {
            opacity: 0,
            y: -46,
            scale: 2.1,
            duration: 1.5,
            ease: "power2.out",
          },
        );
      }

      setLit((current) =>
        current.map((value, i) => (i === index ? false : value)),
      );
    },
    [lit],
  );

  const relight = () => {
    setLit(Array.from({ length: CANDLE_COUNT }, () => true));
    gsap.fromTo(
      root.current?.querySelectorAll("[data-flame]") ?? [],
      { scaleY: 0.2, scaleX: 1.5, opacity: 0 },
      {
        scaleY: 1,
        scaleX: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.07,
        ease: "back.out(2.4)",
      },
    );
  };

  // When the last flame goes out: confetti from the cake, and a little jump.
  useEffect(() => {
    if (!allOut) return;

    const rect = cake.current?.getBoundingClientRect();
    if (rect) {
      burstConfetti(
        {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height * 0.25,
        },
        200,
      );
    }

    gsap.fromTo(
      cake.current,
      { y: 0 },
      { y: -18, duration: 0.35, yoyo: true, repeat: 1, ease: "power2.out" },
    );

    const reveal = root.current?.querySelector("[data-wish-reveal]");

    gsap.fromTo(
      reveal ?? null,
      { opacity: 0, y: 24, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        delay: 0.2,
        ease: "glass",
      },
    );

    // The wish itself lands one word at a time, with a halo blooming behind
    // it — this is the payoff of the whole section, so it gets its own beat
    // rather than fading in with everything else.
    const wishEl = root.current?.querySelector("[data-wish-line]");

    if (wishEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const split = new SplitText(wishEl, {
        type: "words",
        wordsClass: "inline-block will-change-transform",
      });

      gsap.timeline({ delay: 0.45 })
        .from(split.words, {
          yPercent: 130,
          rotateX: -70,
          opacity: 0,
          duration: 1,
          stagger: 0.09,
          ease: "glass",
        })
        .fromTo(
          root.current?.querySelector("[data-wish-halo]") ?? null,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" },
          "-=0.9",
        )
        .to(
          root.current?.querySelector("[data-wish-halo]") ?? null,
          {
            opacity: 0.55,
            scale: 1.12,
            duration: 2.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          },
        );
    }

    ScrollTrigger.refresh();
  }, [allOut]);

  return (
    <section
      id="cake"
      ref={root}
      className="relative mx-auto w-full max-w-4xl scroll-mt-28 px-5 py-20 text-center sm:py-24"
    >
      <p data-anim className="eyebrow mb-5">
        {site.closing.title}
      </p>

      <h2
        data-anim
        className="display mx-auto max-w-2xl text-balance text-[clamp(2rem,6vw,3.75rem)] text-frost"
      >
        {allOut ? "Wish made. It counts." : "Blow out the candles"}
      </h2>

      <p
        data-anim
        className="mx-auto mt-5 max-w-lg text-balance text-sm leading-relaxed text-ice/65 sm:text-base"
      >
        {allOut
          ? site.closing.bodyDone
          : `Tap each flame. ${remaining} still burning.`}
      </p>

      {/* ---------------------------------------------------------------- */}
      {/*  The cake                                                         */}
      {/* ---------------------------------------------------------------- */}
      <div
        ref={cake}
        data-cake-stack
        className="relative mx-auto mt-16 flex w-full max-w-xs flex-col items-center sm:max-w-sm"
      >
        {/* Candles */}
        <div className="relative z-[4] flex items-end justify-center gap-3 sm:gap-4">
          {lit.map((isLit, i) => (
            <button
              key={i}
              data-candle
              onClick={() => extinguish(i)}
              disabled={!isLit}
              aria-label={
                isLit ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`
              }
              // Negative margin keeps the visual spacing while the padding
              // gives thumbs a target that is actually worth aiming at.
              className="group relative -m-2 flex cursor-pointer flex-col items-center p-2 disabled:cursor-default"
            >
              {/* Smoke */}
              <span
                data-smoke={i}
                aria-hidden
                className="pointer-events-none absolute -top-8 h-6 w-6 rounded-full bg-ice/40 opacity-0 blur-[6px]"
              />

              {/* Glow cast by a live flame, behind everything else. */}
              <span
                aria-hidden
                className={`pointer-events-none absolute -top-6 h-20 w-20 rounded-full bg-cyan/35 blur-2xl transition-opacity duration-500 ${
                  isLit ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Flame: a tall teardrop with a white-hot core. */}
              <span
                data-flame={i}
                aria-hidden
                className="relative mb-1 h-7 w-3.5 origin-bottom"
              >
                <span
                  className={`absolute inset-0 rounded-[50%_50%_50%_50%/72%_72%_30%_30%] bg-gradient-to-t from-azure via-cyan to-white shadow-[0_0_18px_rgba(70,224,255,0.9)] ${
                    isLit ? "animate-[flicker_1.1s_ease-in-out_infinite]" : ""
                  }`}
                />
                <span className="absolute inset-x-[28%] bottom-[14%] top-[30%] rounded-[50%] bg-white/90 blur-[1.5px]" />
              </span>

              {/* Wick */}
              <span
                aria-hidden
                className="h-1.5 w-[2px] rounded-full bg-ice/50"
              />

              {/* Candle body, with a barber-pole stripe. */}
              <span
                aria-hidden
                className="h-16 w-3 rounded-t-[3px] border border-white/30 bg-gradient-to-b from-white/40 via-white/14 to-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_0_20px_-6px_rgba(70,224,255,0.6)] backdrop-blur-sm transition-transform duration-300 group-hover:enabled:-translate-y-0.5 sm:w-3.5"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-58deg,rgba(255,255,255,0.22) 0 3px,transparent 3px 9px)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Tiers. Each one is wider and sits slightly inside the one above, so
            the stack reads as a cake rather than three separate panes. */}
        <div data-cake-layer className="relative z-[3] -mt-1.5 w-[62%]">
          <Tier label="Top tier" height="h-16 sm:h-20" radius="rounded-[0.9rem]" />
        </div>

        <div data-cake-layer className="relative z-[2] -mt-2 w-[82%]">
          <Tier
            label="Middle tier"
            height="h-20 sm:h-24"
            radius="rounded-[1.1rem]"
          />
        </div>

        <div data-cake-layer className="relative z-[1] -mt-2 w-full">
          <Tier
            label="Bottom tier"
            height="h-24 sm:h-28"
            radius="rounded-[1.3rem]"
          />
        </div>

        {/* Plate, then the light it bounces onto the table. */}
        <div
          aria-hidden
          className="-mt-1 h-3 w-[112%] rounded-[50%] border border-white/15 bg-white/8 backdrop-blur-sm"
        />
        <div
          aria-hidden
          className="mt-2 h-10 w-[125%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(70,224,255,0.3),transparent_72%)] blur-lg"
        />
      </div>

      <div className="mt-10 flex flex-col items-center gap-6">
        {allOut ? (
          <div data-wish-reveal className="relative flex flex-col items-center gap-6">
            <span
              data-wish-halo
              aria-hidden
              className="pointer-events-none absolute -top-14 h-56 w-56 rounded-full bg-cyan/40 opacity-0 blur-3xl sm:h-72 sm:w-72"
            />

            <p
              data-wish-line
              className="display relative text-balance text-[clamp(1.9rem,6vw,3.25rem)] text-frost [perspective:800px]"
            >
              {site.closing.wish}
            </p>

            <p className="display shimmer-text text-[clamp(1.35rem,4vw,2rem)]">
              Happy birthday, {site.name}
            </p>
            <button
              onClick={relight}
              className="glass glass-interactive group rounded-full px-6 py-3 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ice/80"
            >
              <span className="relative z-[3]">Light them again</span>
            </button>
          </div>
        ) : (
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ice/35">
            {remaining} / {CANDLE_COUNT} lit
          </p>
        )}
      </div>
    </section>
  );
}
