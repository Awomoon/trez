"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import SectionHeading from "@/components/ui/SectionHeading";
import MoonDisc from "@/components/background/MoonDisc";

export type OrbitCard = {
  title: string;
  paragraphs: readonly string[];
  photo?: string | null;
};

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  cards: readonly OrbitCard[];
  /** Small caps note under each card: "remembered", "of many", and so on. */
  cardLabel: string;
  /**
   * The quieter, closer version: bigger moon, slower turn, cards held a
   * little nearer. Used for the second orbit so the two are not identical.
   */
  intimate?: boolean;
};

/* ---------------------------------------------------------------------- */
/*  THE ORBIT                                                              */
/*                                                                         */
/*  Every card sits on one ellipse. Its angle is where it is on that       */
/*  ellipse, and everything else follows from the angle:                   */
/*                                                                         */
/*    x      sin(angle)    across the screen                               */
/*    y      cos(angle)    down the screen: front is low, back is high,    */
/*                         which is what an orbit seen from slightly above  */
/*                         actually does                                    */
/*    depth  cos(angle)    +1 nearest the viewer, -1 behind the moon        */
/*                                                                         */
/*  Depth then drives scale, opacity, blur and which side of the moon the  */
/*  card is stacked on. One number, and the whole illusion falls out of it. */
/* ---------------------------------------------------------------------- */

const TAU = Math.PI * 2;

/** Depth at which a card is considered to have gone behind the moon. */
const BEHIND = 0;

/**
 * How many orbits currently want the page's own travelling moon out of the
 * way. It has to be a count rather than a flag: the second orbit's trigger
 * activates before the first one's deactivates, so a plain on/off leaves the
 * page moon switched back on for the whole of the second orbit, two moons
 * and all. Shared across instances on purpose.
 */
let orbitsHoldingTheMoon = 0;

function pageMoonShouldHide(hide: boolean) {
  orbitsHoldingTheMoon = Math.max(0, orbitsHoldingTheMoon + (hide ? 1 : -1));
  const field = document.querySelector(".moon-field");
  if (!field) return;
  gsap.to(field, {
    opacity: orbitsHoldingTheMoon > 0 ? 0 : 1,
    duration: 0.8,
    ease: "sine.inOut",
    overwrite: true,
  });
}

export default function MoonOrbit({
  id,
  eyebrow,
  title,
  cards,
  cardLabel,
  intimate = false,
}: Props) {
  const section = useRef<HTMLElement>(null);
  /**
   * Static until the browser says otherwise. The orbit needs a tall section
   * and a sticky stage; rendering that on the server and then finding out
   * the visitor asked for reduced motion would mean a page that scrolls for
   * screens and shows nothing. So the plain list is the default and the
   * orbit is opted into on the client.
   */
  const [orbiting, setOrbiting] = useState(false);

  useEffect(() => {
    if (!prefersReducedMotion()) setOrbiting(true);
  }, []);

  useEffect(() => {
    const root = section.current;
    if (!root || !orbiting) return;

    const ctx = gsap.context(() => {
      const stage = root.querySelector<HTMLElement>("[data-stage]");
      const nodes = gsap.utils.toArray<HTMLElement>("[data-orbit-card]", root);
      if (!stage || nodes.length === 0) return;

      /* quickSetter for the plain CSS properties, and the transform written
         straight to style.
         
         Not a shortcut: quickSetter(node, "scale") resolves to "scaleX,scaleY"
         and then tries to set that as an attribute, which throws and takes
         the page down with it. One composed translate3d/scale/rotate string
         is also the cheapest thing to write, and being one property it can
         never half-apply. */
      const set = nodes.map((node) => ({
        node,
        opacity: gsap.quickSetter(node, "opacity") as (v: number) => void,
        filter: gsap.quickSetter(node, "filter") as (v: string) => void,
      }));

      const moon = root.querySelector<HTMLElement>("[data-orbit-moon]");
      const glow = root.querySelector<HTMLElement>("[data-orbit-glow]");
      const setGlow = glow
        ? (gsap.quickSetter(glow, "opacity") as (v: number) => void)
        : null;

      /* Recomputed on resize rather than every frame. */
      let rx = 0;
      let ry = 0;
      let dy = 0;
      let phone = false;

      const measure = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        phone = w < 640;
        /* On a desktop the ellipse is wide and the neighbours sit clear of
           the front card. On a phone the cards are nearly as wide as the
           screen, so no radius can keep them apart: the ring leans vertical
           instead and the cards that are not at the front are dimmed hard
           (see `near` below) until they read as ghosts of themselves. That
           is the deliberate phone design, not the desktop one squeezed. */
        rx = phone ? w * 0.46 : Math.min(w * 0.33, 430);
        ry = phone ? h * 0.25 : h * 0.16;
        /* Pushed down on a phone so the top of the ring clears the heading. */
        dy = phone ? h * 0.07 : 0;
      };

      measure();

      const steps = cards.length - 1;

      /**
       * Scroll to rotation, with a pause built in.
       *
       * A straight mapping turns the ring at a constant rate, which means
       * that half the time two cards share the front. Side by side on a
       * desktop that is fine; on a phone they sit on top of each other and
       * neither can be read.
       *
       * So each card holds at the front for the first and last fifth of its
       * stretch of scroll and the ring turns through the middle. The motion
       * never stops being continuous, it just spends its time where the
       * reading happens.
       */
      const turnAt = (p: number) => {
        const raw = Math.min(p, 1) * steps;
        const i = Math.min(Math.floor(raw), steps - 1);
        const t = raw - i;
        const hold = phone ? 0.24 : 0.18;
        const k = Math.min(1, Math.max(0, (t - hold) / (1 - hold * 2)));
        const eased = k * k * (3 - 2 * k);
        /* All but one step, so the first card is at the front when she
           arrives and the last one is at the front when she leaves. */
        return ((i + eased) / steps) * TAU * (steps / cards.length);
      };

      const render = (p: number) => {
        const turn = turnAt(p);

        set.forEach((card, i) => {
          const angle = (i / cards.length) * TAU - turn;
          const depth = Math.cos(angle);
          /* 0 at the very back, 1 at the very front. */
          const near = (depth + 1) / 2;

          const x = Math.sin(angle) * rx;
          const y = depth * ry + dy;
          const scale = (phone ? 0.5 : 0.74) + (phone ? 0.5 : 0.26) * near;
          /* Leaning into the turn, a few degrees at the sides and flat at
             the front and back. */
          const tilt = -Math.sin(angle) * (phone ? 3 : 5);

          card.node.style.transform =
            `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
            `scale(${scale.toFixed(3)}) rotate(${tilt.toFixed(2)}deg)`;
          /* The steeper curve on a phone is what keeps six cards on a narrow
             screen from becoming a pile of unreadable text. */
          card.opacity(
            phone
              ? 0.04 + 0.96 * Math.pow(near, 7)
              : 0.22 + 0.78 * Math.pow(near, 1.5),
          );
          /* Blur is the expensive one, so it is small, and switched off
             entirely once a card is anywhere near the front. */
          const blur = near > 0.72 ? 0 : (0.72 - near) * (phone ? 2.4 : 4.5);
          card.filter(blur < 0.05 ? "none" : `blur(${blur.toFixed(2)}px)`);
          /* The actual occlusion: behind the moon, or in front of it. */
          card.node.style.zIndex = depth > BEHIND ? "30" : "10";
        });

        /* The moon breathes very slightly across the section and brightens
           toward the end, which is what makes the last card feel like an
           arrival rather than a stop. */
        if (moon) {
          const grow = 1 + p * (intimate ? 0.09 : 0.05);
          moon.style.transform =
            `translate3d(0, ${dy.toFixed(1)}px, 0) scale(${grow.toFixed(3)})`;
        }
        setGlow?.(0.72 + p * 0.28);
      };

      render(0);

      const proxy = { p: 0 };
      const drive = gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          /* The lag that makes the ring feel weighted rather than wired
             directly to the scrollbar. The intimate orbit is slower. */
          scrub: intimate ? 1.2 : 0.8,
          invalidateOnRefresh: true,
          onRefresh: measure,
        },
        onUpdate: () => render(proxy.p),
      });

      /* The page's own travelling moon would be a second moon on screen
         here, so it steps aside while an orbit is on. */
      let holding = false;
      const hold = (want: boolean) => {
        if (want === holding) return;
        holding = want;
        pageMoonShouldHide(want);
      };

      const handover = ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        end: "bottom 30%",
        onToggle: ({ isActive }) => hold(isActive),
      });

      /* onToggle does not fire for the state a trigger is already in, so
         arriving with the section on screen (a reload part way down, or a
         nav link straight into it) would otherwise leave two moons up. */
      if (handover.isActive) hold(true);

      return () => {
        /* Release the page moon on unmount, or the count never returns to
           zero and it stays hidden for the rest of the visit. */
        hold(false);
        drive.scrollTrigger?.kill();
        drive.kill();
        handover.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [orbiting, cards.length, intimate]);

  const heading = <SectionHeading eyebrow={eyebrow} title={title} />;

  /* ---- Reduced motion, or before the client has had its say ---- */
  if (!orbiting) {
    return (
      <section
        id={id}
        ref={section}
        className="relative mx-auto w-full max-w-5xl scroll-mt-28 px-5 py-24 sm:py-32"
      >
        {heading}
        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {cards.map((card, i) => (
            <li key={card.title} className="orbit-card rounded-[1.5rem] p-6 sm:p-7">
              <Card card={card} index={i} label={cardLabel} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /* ---- The orbit ---- */
  return (
    <section
      id={id}
      ref={section}
      className="relative scroll-mt-0"
      /* One screen to arrive, then roughly half a screen of scroll per card
         for the ring to turn through. */
      style={{ height: `${100 + cards.length * 52}vh` }}
    >
      <div
        data-stage
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-x-0 top-[max(5.5rem,10vh)] z-[40] px-5">
          <div className="mx-auto w-full max-w-5xl">{heading}</div>
        </div>

        {/* The ring lives in its own 3D context so the cards read as going
            around something rather than sliding across it. */}
        <div className="orbit-ring relative h-full w-full">
          <div
            data-orbit-moon
            className="orbit-moon absolute left-1/2 top-1/2 z-[20]"
          >
            <div data-orbit-glow className="orbit-glow" />
            <MoonDisc />
          </div>

          {cards.map((card, i) => (
            <article
              key={card.title}
              data-orbit-card
              className="orbit-card absolute left-1/2 top-1/2 rounded-[1.4rem] p-5 sm:p-6"
            >
              <Card card={card} index={i} label={cardLabel} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  card,
  index,
  label,
}: {
  card: OrbitCard;
  index: number;
  label: string;
}) {
  return (
    <>
      {card.photo && (
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[0.9rem]">
          <Image
            src={asset(card.photo)}
            alt=""
            fill
            sizes="(max-width: 640px) 78vw, 22rem"
            className="object-cover"
          />
        </div>
      )}

      <span aria-hidden className="mb-3 block h-px w-8 bg-cyan/50" />

      <h3 className="display text-[1.3rem] leading-tight text-frost sm:text-[1.5rem]">
        {card.title}
      </h3>

      <div className="mt-3 flex flex-col gap-2.5">
        {card.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-[0.82rem] leading-relaxed text-ice/70 sm:text-sm">
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-4 font-mono text-[0.5rem] uppercase tracking-[0.25em] text-ice/30">
        {String(index + 1).padStart(2, "0")} · {label}
      </p>
    </>
  );
}
