"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { site } from "@/config/site";
import GlassPanel from "@/components/ui/GlassPanel";

/**
 * The letter. Body text resolves word by word as it scrolls through the
 * viewport — dim words sharpen into focus, so reading it feels like it is
 * being written rather than simply appearing.
 */
export default function Letter() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      gsap.from("[data-letter-panel]", {
        y: 80,
        opacity: 0,
        scale: 0.96,
        duration: 1.2,
        ease: "glass",
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });

      gsap.from("[data-letter-greeting]", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const paragraphs = reduced
        ? []
        : gsap.utils.toArray<HTMLElement>("[data-letter-paragraph]");

      paragraphs.forEach((paragraph) => {
        const split = new SplitText(paragraph, {
          type: "words",
          wordsClass: "inline-block",
        });

        gsap.fromTo(
          split.words,
          { opacity: 0.16, filter: "blur(2px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.035,
            ease: "none",
            scrollTrigger: {
              trigger: paragraph,
              start: "top 84%",
              end: "bottom 62%",
              scrub: true,
            },
          },
        );
      });

      // Signature draws itself.
      gsap.fromTo(
        "[data-signature-path]",
        { strokeDashoffset: 1200 },
        {
          strokeDashoffset: 0,
          duration: 2.4,
          ease: "power2.inOut",
          scrollTrigger: { trigger: "[data-signature]", start: "top 85%" },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="letter"
      ref={root}
      className="relative mx-auto w-full max-w-3xl px-5 py-24 sm:py-32"
    >
      <div data-letter-panel data-anim>
        <GlassPanel
          interactive
          tilt={3}
          className="group rounded-[2rem] px-7 py-12 sm:px-14 sm:py-16"
        >
          <p className="eyebrow mb-8">A letter, not a caption</p>

          <p
            data-letter-greeting
            data-anim
            className="display mb-10 text-[clamp(1.75rem,5vw,2.75rem)] text-frost"
          >
            {site.letter.greeting}
          </p>

          <div className="flex flex-col gap-6">
            {site.letter.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                data-letter-paragraph
                className="text-[0.95rem] leading-[1.85] text-ice/80 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div data-signature className="mt-14 flex flex-col items-start gap-3">
            <div className="hairline w-24" />
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ice/45">
              {site.letter.signature}
            </p>

            {/* A hand-drawn flourish standing in for a signature. */}
            <svg
              viewBox="0 0 320 90"
              className="h-16 w-52 text-cyan"
              fill="none"
              aria-hidden
            >
              <path
                data-signature-path
                d="M8 62c22-38 40-46 48-30 7 14-12 44-22 40-9-4 6-38 30-44 18-5 24 16 36 16 10 0 16-14 26-14 8 0 10 12 20 12 12 0 18-18 30-18 9 0 12 10 22 10 12 0 22-14 34-20 10-5 22-6 30 0"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1200"
                strokeDashoffset="1200"
                style={{ filter: "drop-shadow(0 0 10px rgba(70,224,255,0.55))" }}
              />
            </svg>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
