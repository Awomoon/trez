"use client";

import { useEffect, useRef } from "react";

type Blob = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  alpha: number;
};

/**
 * The "liquid" the glass sits on top of.
 *
 * Blobs are painted onto a deliberately tiny canvas (a quarter of the screen,
 * at most 420px wide) and then stretched over the viewport with a CSS blur.
 * Upscaling a small buffer is what gives the soft, organic edges — and it keeps
 * the whole thing cheap enough to run at 60fps on a phone.
 */
export default function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.35, tx: 0.5, ty: 0.35 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* The colours come from the stylesheet rather than from here, so the
       canvas changes with the theme along with everything else. Read once:
       the theme is set on <html> before React mounts and only changes on a
       reload. */
    const css = getComputedStyle(document.documentElement);
    const triplet = (name: string, fallback: number[]) => {
      const raw = css.getPropertyValue(name).trim();
      if (!raw) return fallback;
      const parts = raw.split(/[\s,]+/).map(Number);
      return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
        ? parts
        : fallback;
    };

    const palette = [
      triplet("--c-blob-1", [47, 125, 255]),
      triplet("--c-blob-2", [70, 224, 255]),
      triplet("--c-blob-3", [122, 107, 255]),
      triplet("--c-blob-4", [10, 31, 71]),
      triplet("--c-blob-5", [109, 180, 255]),
    ];

    const blobAlpha = Number(css.getPropertyValue("--blob-alpha")) || 1;
    const pageColour = css.getPropertyValue("--color-abyss").trim() || "#01050e";

    let width = 0;
    let height = 0;

    const blobs: Blob[] = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00022,
      r: 0.26 + Math.random() * 0.3,
      hue: i % palette.length,
      alpha: 0.5 + Math.random() * 0.4,
    }));

    const resize = () => {
      const ratio = window.innerHeight / window.innerWidth;
      width = Math.min(420, Math.round(window.innerWidth / 4));
      height = Math.round(width * ratio);
      canvas.width = width;
      canvas.height = height;
    };

    const draw = (time: number) => {
      // Ease the pointer-tracking blob toward the cursor.
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.04;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.04;

      ctx.fillStyle = pageColour;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      blobs.forEach((blob, i) => {
        if (!reduced.matches) {
          blob.x += blob.vx;
          blob.y += blob.vy;
          if (blob.x < -0.2 || blob.x > 1.2) blob.vx *= -1;
          if (blob.y < -0.2 || blob.y > 1.2) blob.vy *= -1;
        }

        // A slow breathing wobble so nothing ever looks frozen.
        const wobble = reduced.matches
          ? 0
          : Math.sin(time * 0.00018 + i * 1.7) * 0.06;

        // The last blob is the one that follows the cursor.
        const isPointerBlob = i === blobs.length - 1;
        const cx = (isPointerBlob ? pointer.current.x : blob.x) * width;
        const cy = (isPointerBlob ? pointer.current.y : blob.y) * height;
        const radius = (blob.r + wobble) * width;

        const [r, g, b] = palette[blob.hue];
        const a = blob.alpha * blobAlpha;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        gradient.addColorStop(0.55, `rgba(${r},${g},${b},${a * 0.28})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
    };

    let frame = 0;
    const loop = (time: number) => {
      draw(time);
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.current.tx = event.clientX / window.innerWidth;
      pointer.current.ty = event.clientY / window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-abyss"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full scale-110 blur-[60px] saturate-[1.35]"
      />
      {/* Vignette so the edges of the viewport stay deep and the glass pops. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_20%,rgb(var(--c-ink)/0.55)_70%,rgb(var(--c-ink)/0.92)_100%)]" />
    </div>
  );
}
