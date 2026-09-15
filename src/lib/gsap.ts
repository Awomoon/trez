"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

/**
 * Single place where GSAP is configured. Importing this module anywhere on the
 * client guarantees the plugins are registered exactly once.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, CustomEase);

  // The easing used by the glass surfaces, so CSS and GSAP agree.
  CustomEase.create("glass", "0.22, 1, 0.36, 1");
  CustomEase.create("liquid", "0.65, 0, 0.35, 1");

  gsap.defaults({ ease: "glass", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, ScrollToPlugin, SplitText, CustomEase };
