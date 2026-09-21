"use client";

import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import {
  hasStoredUnlock,
  isUnlockable,
  readLockFlags,
  storeUnlock,
} from "@/lib/lock";

import LiquidBackground from "@/components/background/LiquidBackground";
import MoonSky from "@/components/background/MoonSky";
import GrainOverlay from "@/components/background/GrainOverlay";
import GlassFilters from "@/components/background/GlassFilters";

import LockScreen from "@/components/lock/LockScreen";

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

/**
 * "pending" is the one frame before the browser has told us the date and
 * whether she has been let in before. The site is never rendered during it,
 * so the words cannot flash up behind the lock.
 */
type Gate = "pending" | "locked" | "open";

const lockEnabled: boolean = site.lock.enabled;

export default function Page() {
  const [gate, setGate] = useState<Gate>(lockEnabled ? "pending" : "open");
  const [unlockable, setUnlockable] = useState(false);
  const [ready, setReady] = useState(false);

  // The `js` class is what allows the scroll-reveal elements to start hidden.
  // Without JS it is never added, so everything stays readable.
  useEffect(() => {
    document.documentElement.classList.add("js");
    return () => document.documentElement.classList.remove("js");
  }, []);

  // Decide on the client only. The export is one static file for everybody,
  // so the date it was built on must never be the date it is judged by.
  useEffect(() => {
    if (!lockEnabled) return;

    const { override } = readLockFlags();

    // An explicit ?lock= always wins, including over a previous unlock, so a
    // state can be looked at twice without clearing anything in between.
    if (override !== null) {
      setUnlockable(override === "open");
      setGate("locked");
      return;
    }

    const open = isUnlockable();
    setUnlockable(open);
    setGate(open && hasStoredUnlock() ? "open" : "locked");
  }, []);

  // Keep the page still while the lock or the preloader is up.
  useEffect(() => {
    const still = gate !== "open" || !ready;
    document.body.style.overflow = still ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gate, ready]);

  const handleLoaded = useCallback(() => {
    setReady(true);
    // Fonts and the preloader both change layout — recalculate every trigger.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  // The passcode is its own opening, so the preloader is skipped and the hero
  // starts the moment the lock finishes fading.
  const handleUnlock = useCallback(() => {
    storeUnlock();
    setGate("open");
    setReady(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <GlassFilters />
      <LiquidBackground />
      <MoonSky />
      <GrainOverlay />

      {gate === "locked" && (
        <LockScreen unlockable={unlockable} onUnlock={handleUnlock} />
      )}

      {gate === "open" && (
        <>
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
      )}
    </>
  );
}
