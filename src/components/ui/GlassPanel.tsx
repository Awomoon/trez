"use client";

import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Adds a pointer-following highlight and a subtle 3D tilt. */
  interactive?: boolean;
  /** Maximum tilt in degrees. */
  tilt?: number;
  as?: "div" | "article" | "li" | "section";
};

/**
 * The building block of the whole site: a pane of liquid glass.
 *
 * When `interactive` is on, the pane tracks the pointer with two CSS custom
 * properties (`--mx` / `--my`) that drive a specular hotspot, and leans a few
 * degrees toward the cursor. Everything is written straight to style to avoid
 * re-rendering React on every mousemove.
 */
export default function GlassPanel({
  children,
  className = "",
  interactive = false,
  tilt = 6,
  as = "div",
}: Props) {
  const Tag = as as React.ElementType;
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.transform = `perspective(1200px) rotateX(${
      (0.5 - py) * tilt
    }deg) rotateY(${(px - 0.5) * tilt}deg) translateZ(0)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`glass ${interactive ? "glass-interactive" : ""} ${className}`}
    >
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [background:radial-gradient(28rem_28rem_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.14),transparent_60%)] group-hover:opacity-100"
        />
      )}
      <div className="relative z-[3] h-full">{children}</div>
    </Tag>
  );
}
