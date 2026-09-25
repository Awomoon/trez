"use client";

import { site } from "@/config/site";
import MoonOrbit from "@/components/sections/MoonOrbit";

/**
 * The little things, orbiting the same moon. `intimate` slows the ring and
 * lets the moon grow a touch, so the second orbit is the quieter of the two
 * rather than a repeat of the first.
 */
export default function Memories() {
  return (
    <MoonOrbit
      id="memories"
      eyebrow="Little things I remember"
      title="The small stuff, which is really the big stuff"
      cards={site.memories}
      cardLabel="remembered"
      intimate
    />
  );
}
