"use client";

import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";

import LiquidBackground from "@/components/background/LiquidBackground";
import GrainOverlay from "@/components/background/GrainOverlay";
import GlassFilters from "@/components/background/GlassFilters";

import Preloader from "@/components/ui/Preloader";
import Navigation from "@/components/ui/Navigation";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CustomCursor from "@/components/ui/CustomCursor";

import Hero from "@/components/sections/Hero";
import Countdown from "@/components/sections/Countdown";
import Reasons from "@/components/sections/Reasons";
import Memories from "@/components/sections/Memories";
import Story from "@/components/sections/Story";
import Gallery from "@/components/sections/Gallery";
import Music from "@/components/sections/Music";
import Cake from "@/components/sections/Cake";
import TimeCapsule from "@/components/sections/TimeCapsule";
import Letter from "@/components/sections/Letter";
import Outro from "@/components/sections/Outro";
import Footer from "@/components/sections/Footer";

export default function Page() {
  const [ready, setReady] = useState(false);

  // The `js` class is what allows the scroll-reveal elements to start hidden.
  // Without JS it is never added, so everything stays readable.
  useEffect(() => {
    document.documentElement.classList.add("js");
    return () => document.documentElement.classList.remove("js");
  }, []);

  // Keep the page locked while the preloader runs so nothing scrolls past the
  // hero reveal.
  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  const handleLoaded = useCallback(() => {
    setReady(true);
    // Fonts and the preloader both change layout — recalculate every trigger.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <GlassFilters />
      <LiquidBackground />
      <GrainOverlay />

      {!ready && <Preloader onDone={handleLoaded} />}

      <ScrollProgress />
      <Navigation />
      <CustomCursor />

      <main className="relative">
        <Hero start={ready} />
        <Countdown />
        <Reasons />
        <Memories />
        <Story />
        <Gallery />
        <Music />
        <Cake />
        <TimeCapsule />
        <Letter />
        <Outro />
        <Footer />
      </main>
    </>
  );
}
