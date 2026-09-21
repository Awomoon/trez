"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/config/site";
import { asset } from "@/lib/asset";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Only renders when photos have been added to the config. Each frame is a glass
 * pane holding the image, with a slow parallax drift on the picture inside it.
 */
export default function Gallery() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-anim]", { visibility: "visible" });

      ScrollTrigger.batch("[data-photo]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 70, rotate: -1.5 },
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration: 1.1,
              stagger: 0.12,
              ease: "glass",
            },
          ),
      });

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) return;

      gsap.utils.toArray<HTMLElement>("[data-photo-inner]").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  if (site.photos.length === 0) return null;

  return (
    <section
      id="gallery"
      ref={root}
      className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:py-32"
    >
      <SectionHeading eyebrow="Receipts" title="Evidence, collected" />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {site.photos.map((photo) => (
          <figure
            key={photo.src}
            data-photo
            data-anim
            className="glass glass-interactive group overflow-hidden rounded-[1.75rem] p-2.5"
          >
            <div className="relative z-[3] aspect-[4/5] overflow-hidden rounded-[1.35rem]">
              <div data-photo-inner className="absolute -inset-y-[10%] inset-x-0">
                <Image
                  src={asset(photo.src)}
                  alt={photo.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
            <figcaption className="relative z-[3] px-4 py-4 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ice/55">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
