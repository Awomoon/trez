"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LINKS = [
  { id: "hero", label: "Start" },
  { id: "countdown", label: "Countdown" },
  { id: "reasons", label: "Reasons" },
  { id: "story", label: "Story" },
  { id: "cake", label: "Wish" },
  { id: "letter", label: "Letter" },
];

/**
 * A floating glass pill. The active pill is tracked with ScrollTrigger and the
 * highlight slides between items using a shared layout measurement.
 */
export default function Navigation() {
  const [active, setActive] = useState("hero");
  const nav = useRef<HTMLElement>(null);
  const pill = useRef<HTMLSpanElement>(null);

  // Reveal the nav once the hero has been scrolled past its first screen.
  useEffect(() => {
    const el = nav.current;
    if (!el) return;

    gsap.set(el, { y: -80, opacity: 0 });
    const reveal = gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: 0.4,
      ease: "glass",
    });

    // Whichever section is crossing 42% of the viewport wins. Measuring rects
    // directly (rather than one trigger per section) is what keeps this honest
    // while the story section is pinned — a pinned element reports the position
    // it is actually painted at.
    const line = () => window.innerHeight * 0.42;

    const pick = () => {
      const y = line();
      let current = LINKS[0].id;

      for (const link of LINKS) {
        const rect = document.getElementById(link.id)?.getBoundingClientRect();
        if (rect && rect.top <= y && rect.bottom > y) current = link.id;
      }

      setActive(current);
    };

    const watcher = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: pick,
      onRefresh: pick,
    });

    pick();

    return () => {
      reveal.kill();
      watcher.kill();
    };
  }, []);

  // Slide the highlight under whichever link is active.
  useEffect(() => {
    const el = nav.current?.querySelector<HTMLElement>(
      `[data-link="${active}"]`,
    );
    const highlight = pill.current;
    if (!el || !highlight) return;

    gsap.to(highlight, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
      duration: 0.6,
      ease: "glass",
    });
  }, [active]);

  const goTo = (id: string) => {
    gsap.to(window, {
      // Clear the floating nav so headings never land underneath it.
      scrollTo: { y: `#${id}`, offsetY: 96, autoKill: true },
      duration: 1.1,
      ease: "liquid",
    });
  };

  return (
    <nav
      ref={nav}
      aria-label="Sections"
      className="fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-40 flex justify-center px-4"
    >
      <div className="glass relative flex max-w-full items-center overflow-x-auto rounded-full p-1 sm:gap-0.5 sm:p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span
          ref={pill}
          aria-hidden
          className="absolute left-0 top-1 bottom-1 z-0 rounded-full bg-white/12 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] sm:top-1.5 sm:bottom-1.5"
        />
        {LINKS.map((link) => (
          <button
            key={link.id}
            data-link={link.id}
            onClick={() => goTo(link.id)}
            aria-current={active === link.id ? "true" : undefined}
            className={`relative z-[3] shrink-0 rounded-full px-2.5 py-2 font-mono text-[0.55rem] uppercase tracking-[0.12em] transition-colors duration-300 sm:px-4 sm:text-[0.65rem] sm:tracking-[0.2em] ${
              active === link.id
                ? "text-white"
                : "text-ice/55 hover:text-ice"
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
