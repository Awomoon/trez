"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Labels are kept short on purpose: nine anchors have to fit a phone, and the
// bar scrolls sideways when they cannot.
const LINKS = [
  { id: "hero", label: "Start" },
  { id: "countdown", label: "Count" },
  { id: "reasons", label: "Reasons" },
  { id: "memories", label: "Memories" },
  { id: "story", label: "Story" },
  { id: "music", label: "Music" },
  { id: "cake", label: "Wish" },
  { id: "capsule", label: "Capsule" },
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
  const scroller = useRef<HTMLDivElement>(null);

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

    // Nine anchors do not fit a phone, so the bar scrolls. Keep the active one
    // centred in it as the page moves, otherwise the highlight slides to a
    // pill that is off-screen and the bar looks stuck on the wrong section.
    // scrollLeft is set directly rather than via scrollIntoView, which would
    // also scroll the page and fight the very scrolling that triggered this.
    const box = scroller.current;
    if (!box || box.scrollWidth <= box.clientWidth) return;

    const target = Math.max(
      0,
      Math.min(
        el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2,
        box.scrollWidth - box.clientWidth,
      ),
    );

    box.scrollTo({
      left: target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
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
      {/* The glass shell must not be the scrolling element: its rim and sheen
          are absolutely positioned children, so they scroll away with the
          content and the pill's outline detaches from the bar. The shell stays
          put and a plain inner track does the scrolling. */}
      <div className="glass relative max-w-full rounded-full p-1 sm:p-1.5">
        <div
          ref={scroller}
          className="relative z-[3] flex items-center overflow-x-auto rounded-full sm:gap-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span
            ref={pill}
            aria-hidden
            className="absolute left-0 top-0 bottom-0 z-0 rounded-full bg-white/12 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
          />
          {LINKS.map((link) => (
            <button
              key={link.id}
              data-link={link.id}
              onClick={() => goTo(link.id)}
              aria-current={active === link.id ? "true" : undefined}
              className={`relative z-[3] shrink-0 rounded-full px-2.5 py-2 font-mono text-[0.55rem] uppercase tracking-[0.12em] transition-colors duration-300 sm:px-4 sm:text-[0.65rem] sm:tracking-[0.2em] ${
                active === link.id ? "text-white" : "text-ice/55 hover:text-ice"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
