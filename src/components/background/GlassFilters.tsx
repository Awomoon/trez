/**
 * SVG filters referenced by the CSS. `liquid-refraction` warps whatever sits
 * behind a pane, which is what makes real glass read as glass rather than as
 * a blurred rectangle. Browsers that cannot filter a backdrop simply ignore it
 * (see the @supports guard in globals.css) and still get the blur.
 */
export default function GlassFilters() {
  return (
    <svg
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute h-0 w-0"
    >
      <defs>
        <filter id="liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0015 0.004"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="26"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Used by the cake flames to fuse the glow into a single blob. */}
        <filter id="flame-goo" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
          />
        </filter>
      </defs>
    </svg>
  );
}
