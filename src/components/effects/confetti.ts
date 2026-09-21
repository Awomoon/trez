/**
 * A tiny self-contained confetti burst. Deliberately not a dependency: we only
 * need a few hundred pieces of coloured paper with some drag and gravity, and
 * this way the palette can match the rest of the site exactly.
 */
type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  life: number;
  shape: "rect" | "circle" | "ribbon";
};

/* Read off the stylesheet so the confetti belongs to whichever theme is on.
   Resolved on first use rather than at module load, because the theme is set
   on <html> before React mounts but after this file is parsed. */
const FALLBACK = ["#2f7dff", "#46e0ff", "#6db4ff", "#7a6bff", "#cfe9ff", "#ffffff"];

let cached: string[] | null = null;

function colors(): string[] {
  if (cached) return cached;
  const css = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    css.getPropertyValue(name).trim() || fallback;
  cached = [
    read("--color-azure", FALLBACK[0]),
    read("--color-cyan", FALLBACK[1]),
    read("--color-sky", FALLBACK[2]),
    read("--color-violet", FALLBACK[3]),
    read("--color-ice", FALLBACK[4]),
    "#ffffff",
  ];
  return cached;
}

export function burstConfetti(
  origin: { x: number; y: number },
  count = 140,
): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:65";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const palette = colors();
  const shapes: Piece["shape"][] = ["rect", "circle", "ribbon"];
  const pieces: Piece[] = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 11;
    return {
      x: origin.x,
      y: origin.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: 4 + Math.random() * 7,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      color: palette[Math.floor(Math.random() * palette.length)],
      life: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
  });

  let frame = 0;

  const tick = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = false;

    for (const p of pieces) {
      p.vy += 0.26; // gravity
      p.vx *= 0.985; // air drag
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.life -= 0.0085;

      if (p.life <= 0 || p.y > window.innerHeight + 60) continue;
      alive = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "ribbon") {
        // Squashing the height as it spins fakes a piece of paper turning over.
        ctx.fillRect(
          -p.size / 2,
          -p.size,
          p.size * 0.4,
          p.size * 2 * Math.abs(Math.cos(p.rotation)),
        );
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      ctx.restore();
    }

    if (alive) {
      frame = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frame);
      canvas.remove();
    }
  };

  frame = requestAnimationFrame(tick);
}
