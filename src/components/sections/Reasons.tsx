"use client";

import { site } from "@/config/site";
import MoonOrbit from "@/components/sections/MoonOrbit";

/**
 * The reasons, orbiting the moon. The words, the order and the heading are
 * unchanged; only the way they are presented is. MoonOrbit holds all of the
 * motion, and falls back to a plain grid under prefers-reduced-motion.
 */
export default function Reasons() {
  return (
    <MoonOrbit
      id="reasons"
      eyebrow={`${site.reasons.length} of many`}
      title="Things about you I would defend in court"
      cards={site.reasons}
      cardLabel="of many"
    />
  );
}
