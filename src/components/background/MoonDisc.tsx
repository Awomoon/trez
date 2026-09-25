/**
 * The moon, as SVG rather than a CSS circle.
 *
 * A plain disc reads as a dot. What makes it read as the moon is three
 * things layered: the maria (the big dark seas, soft edged and irregular),
 * craters (each a shadow with a lit rim on the opposite side from the sun),
 * and a terminator that keeps the lower right from being as bright as the
 * upper left. The light source is upper left throughout, which is what
 * makes it look round rather than flat.
 *
 * Everything is in one 100x100 viewBox so it scales to whatever size the
 * sky gives it.
 */
export default function MoonDisc() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <defs>
        {/* The lit surface, brightest where the light falls. */}
        <radialGradient id="moonSurface" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#f7f8fc" />
          <stop offset="38%" stopColor="#e7eaf3" />
          <stop offset="70%" stopColor="#c9cfe0" />
          <stop offset="100%" stopColor="#a3a9c0" />
        </radialGradient>

        {/* The shading that rolls the disc away from the light. */}
        <radialGradient id="moonShade" cx="32%" cy="26%" r="82%">
          <stop offset="55%" stopColor="#0b0d18" stopOpacity="0" />
          <stop offset="100%" stopColor="#0b0d18" stopOpacity="0.42" />
        </radialGradient>

        {/* Seas: grey, not black, and never hard edged. */}
        <radialGradient id="mare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#767d9b" stopOpacity="0.62" />
          <stop offset="65%" stopColor="#767d9b" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#767d9b" stopOpacity="0" />
        </radialGradient>

        <clipPath id="moonEdge">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>

      <g clipPath="url(#moonEdge)">
        <circle cx="50" cy="50" r="50" fill="url(#moonSurface)" />

        {/* Maria. Ellipses at angles, overlapping, so no one of them reads
            as a shape on its own. */}
        <g>
          <ellipse cx="36" cy="33" rx="19" ry="15" fill="url(#mare)" transform="rotate(-18 36 33)" />
          <ellipse cx="58" cy="26" rx="13" ry="10" fill="url(#mare)" transform="rotate(12 58 26)" />
          <ellipse cx="65" cy="58" rx="21" ry="17" fill="url(#mare)" transform="rotate(24 65 58)" />
          <ellipse cx="33" cy="66" rx="14" ry="11" fill="url(#mare)" transform="rotate(-34 33 66)" />
          <ellipse cx="49" cy="46" rx="9" ry="7" fill="url(#mare)" transform="rotate(8 49 46)" />
        </g>

        {/* Craters. The shadow sits up and left, the lit rim down and right,
            which is the opposite of the light and is what gives them depth. */}
        <g>
          {(
            [
              [29, 25, 6.4],
              [62, 37, 4.2],
              [45, 62, 5.1],
              [72, 22, 3],
              [22, 48, 3.4],
              [55, 76, 3.8],
              [80, 52, 2.6],
              [38, 44, 2.2],
              [68, 68, 2],
              [15, 33, 1.8],
              [50, 16, 1.6],
              [84, 72, 1.5],
            ] as const
          ).map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="#6f7591" opacity="0.18" />
              <circle
                cx={cx - r * 0.16}
                cy={cy - r * 0.16}
                r={r * 0.84}
                fill="#5e6480"
                opacity="0.14"
              />
              <circle
                cx={cx + r * 0.2}
                cy={cy + r * 0.22}
                r={r * 0.78}
                fill="#ffffff"
                opacity="0.17"
              />
            </g>
          ))}
        </g>

        <circle cx="50" cy="50" r="50" fill="url(#moonShade)" />
      </g>
    </svg>
  );
}
