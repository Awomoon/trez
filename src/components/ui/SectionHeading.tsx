"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

type Props = {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
};

/**
 * Shared section title. The heading is split into lines and each line is
 * revealed from behind its own mask on scroll.
 */
export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      const split = new SplitText("[data-heading]", {
        type: "lines",
        linesClass: "overflow-hidden pb-[0.12em]",
      });
      const inner = new SplitText(split.lines, { type: "lines" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });

      tl.from("[data-heading-eyebrow]", {
        opacity: 0,
        y: 14,
        duration: 0.6,
      }).from(
        inner.lines,
        { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12 },
        "-=0.35",
      );

      return () => {
        inner.revert();
        split.revert();
      };
    }, root);

    return () => ctx.revert();
  }, [title]);

  return (
    <div
      ref={root}
      className={align === "center" ? "text-center" : "text-left"}
    >
      <p data-anim data-heading-eyebrow className="eyebrow mb-5">
        {eyebrow}
      </p>
      <h2
        data-anim
        data-heading
        className="display text-balance text-[clamp(2rem,6vw,4rem)] text-frost"
      >
        {title}
      </h2>
    </div>
  );
}
