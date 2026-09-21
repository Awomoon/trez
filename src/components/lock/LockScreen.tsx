"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/config/site";
import { getCountdown, pad } from "@/lib/countdown";

/** iOS puts letters under the digits. Keeping them makes the pad read right. */
const KEYS: ReadonlyArray<{ digit: string; letters?: string }> = [
  { digit: "1" },
  { digit: "2", letters: "ABC" },
  { digit: "3", letters: "DEF" },
  { digit: "4", letters: "GHI" },
  { digit: "5", letters: "JKL" },
  { digit: "6", letters: "MNO" },
  { digit: "7", letters: "PQRS" },
  { digit: "8", letters: "TUV" },
  { digit: "9", letters: "WXYZ" },
];

const UNITS = [
  { key: "days", label: "days" },
  { key: "hours", label: "hrs" },
  { key: "minutes", label: "mins" },
  { key: "seconds", label: "secs" },
] as const;

type Props = {
  /** True once the date has arrived: show the pad instead of the countdown. */
  unlockable: boolean;
  onUnlock: () => void;
};

export default function LockScreen({ unlockable, onUnlock }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);

  const [entered, setEntered] = useState("");
  const [wrong, setWrong] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const target = site.lock.passcode;

  // The clock and countdown are client only: rendering them during the static
  // build would bake in the build machine's time and mismatch on hydration.
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-lock-item]", {
        y: 26,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "glass",
        delay: 0.15,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const press = useCallback(
    (digit: string) => {
      if (entered.length >= target.length) return;
      const next = entered + digit;
      setWrong(false);
      setEntered(next);

      if (next.length < target.length) return;

      if (next === target) {
        if (prefersReducedMotion()) {
          onUnlock();
          return;
        }
        gsap.to(root.current, {
          opacity: 0,
          scale: 1.04,
          filter: "blur(10px)",
          duration: 0.7,
          ease: "power2.in",
          onComplete: onUnlock,
        });
        return;
      }

      // Wrong: the iOS shake, then clear.
      setWrong(true);
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          dots.current,
          { x: -10 },
          { x: 0, duration: 0.5, ease: "elastic.out(1.6, 0.25)" },
        );
      }
      window.setTimeout(() => setEntered(""), 450);
    },
    [entered, target, onUnlock],
  );

  const backspace = useCallback(() => {
    setWrong(false);
    setEntered((value) => value.slice(0, -1));
  }, []);

  // Let a physical keyboard drive the pad too.
  useEffect(() => {
    if (!unlockable) return;
    const onKey = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) press(event.key);
      else if (event.key === "Backspace") backspace();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlockable, press, backspace]);

  const countdown = now ? getCountdown(now) : null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-y-auto px-6 py-10"
    >
      {/* ---- Padlock ---- */}
      <span data-lock-item aria-hidden className="mb-5 text-ice/70">
        <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
          <path
            d="M5 11V7.5a6 6 0 1 1 12 0V11"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <rect
            x="2"
            y="11"
            width="18"
            height="15"
            rx="4"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      </span>

      {/* ---- Date and clock ---- */}
      <p
        data-lock-item
        className="font-sans text-sm font-medium tracking-wide text-ice/70"
      >
        {now
          ? new Intl.DateTimeFormat("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).format(now)
          : " "}
      </p>

      <p
        data-lock-item
        className="mt-1 font-sans text-[clamp(4rem,18vw,7rem)] font-extralight leading-none tabular-nums tracking-tight text-frost"
      >
        {now
          ? `${pad(now.getHours())}:${pad(now.getMinutes())}`
          : " "}
      </p>

      {/* ---- Either the countdown, or the way in ---- */}
      {!unlockable ? (
        <div data-lock-item className="mt-12 w-full max-w-sm">
          <div className="glass rounded-[1.75rem] px-6 py-7 text-center">
            <div className="relative z-[3]">
              <p className="eyebrow mb-5">{site.lock.lockedLabel}</p>

              <div className="grid grid-cols-4 gap-2">
                {UNITS.map(({ key, label }) => (
                  <div key={key} className="flex flex-col items-center">
                    <span className="display text-[1.75rem] tabular-nums text-frost sm:text-3xl">
                      {pad(countdown ? countdown.timeLeft[key] : 0)}
                    </span>
                    <span className="mt-1 font-mono text-[0.5rem] uppercase tracking-[0.2em] text-ice/40">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-ice/60">
                {site.lock.lockedNote}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div data-lock-item className="mt-10 flex w-full max-w-[17rem] flex-col items-center">
          <p
            className={`font-sans text-sm transition-colors duration-300 ${
              wrong ? "text-red-300" : "text-ice/75"
            }`}
            aria-live="polite"
          >
            {wrong ? site.lock.wrongLabel : site.lock.promptLabel}
          </p>

          {/* Dots */}
          <div ref={dots} className="mt-5 flex gap-4">
            {Array.from({ length: target.length }).map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-full border transition-all duration-200 ${
                  i < entered.length
                    ? "border-frost bg-frost"
                    : "border-ice/50 bg-transparent"
                }`}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="mt-9 grid grid-cols-3 gap-4">
            {KEYS.map((key) => (
              <button
                key={key.digit}
                onClick={() => press(key.digit)}
                aria-label={key.digit}
                className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-white/15 bg-white/[0.09] backdrop-blur-md transition-all duration-150 hover:bg-white/[0.16] active:scale-95"
              >
                <span className="font-sans text-[1.65rem] font-light leading-none text-frost">
                  {key.digit}
                </span>
                {key.letters && (
                  <span className="mt-0.5 font-sans text-[0.5rem] font-medium tracking-[0.18em] text-ice/55">
                    {key.letters}
                  </span>
                )}
              </button>
            ))}

            <span aria-hidden />

            <button
              onClick={() => press("0")}
              aria-label="0"
              className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-white/15 bg-white/[0.09] backdrop-blur-md transition-all duration-150 hover:bg-white/[0.16] active:scale-95"
            >
              <span className="font-sans text-[1.65rem] font-light leading-none text-frost">
                0
              </span>
            </button>

            <button
              onClick={backspace}
              aria-label="Delete"
              disabled={entered.length === 0}
              className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full text-ice/70 transition-opacity duration-150 disabled:opacity-25"
            >
              <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden>
                <path
                  d="M8.5 2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-14L1 10l7.5-8Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="m12 7 6 6m0-6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {site.lock.hint && (
            <p className="mt-8 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-ice/30">
              {site.lock.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
