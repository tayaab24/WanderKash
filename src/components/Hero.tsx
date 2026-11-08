"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { btn } from "@/lib/ui";
import { getImageProps } from "next/image";
import { DURATION, STAGGER } from "@/lib/motion";

const words = "Plan Your Kashmir, Day by Day.".split(" ");

// The hero's one motion: the headline is revealed word by word through a mask (CSS, so it
// starts on first paint). Everything else in the hero appears without animation.
const START = 0.2;

// Art direction: landscape crop for landscape screens, the full portrait photo otherwise.
// Several viewports have different LCP images, so no preload; fetchPriority/eager instead.
const ALT =
  "A shikara crossing Dal Lake at sunset, with Hari Parbat on the horizon and the sun low on the right";
const common = { alt: ALT, sizes: "100vw" };
const {
  props: { srcSet: landscapeSrcSet },
} = getImageProps({
  ...common,
  src: "/images/hero.jpg",
  width: 3200,
  height: 1800,
});
const { props: portraitImg } = getImageProps({
  ...common,
  src: "/images/hero-mobile.jpg",
  width: 1200,
  height: 1800,
  loading: "eager",
  fetchPriority: "high",
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Ken Burns runs (and holds will-change) only while the hero is on screen
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-onscreen={onScreen}
      className="hero-height on-dark relative flex items-end overflow-hidden"
    >
      {/* The photo, with a very slow Ken Burns (CSS, paused off screen) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <div className="animate-kenburns absolute inset-0 motion-reduce:animate-none">
            {/* Sun ~88% across, shikara ~64-88% across: bias right so both stay in frame */}
            <picture>
              <source
                media="(orientation: landscape)"
                srcSet={landscapeSrcSet}
                sizes="100vw"
              />
              <img
                {...portraitImg}
                alt={ALT}
                className="absolute inset-0 h-full w-full object-cover object-[80%_70%] landscape:object-[70%_50%]"
              />
            </picture>
          </div>
        </div>
      </div>

      {/* Overlays (bg token, never black): bottom fade + a soft pool behind the headline.
          The top fade for the navbar comes from the navbar's own scrim. */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-deep/60 via-deep/25 via-25% to-transparent to-50% portrait:from-deep/80 portrait:via-deep/50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_0%_100%,color-mix(in_srgb,var(--color-deep)_50%,transparent),transparent_75%)] landscape:bg-[radial-gradient(ellipse_85%_90%_at_0%_100%,color-mix(in_srgb,var(--color-deep)_60%,transparent),color-mix(in_srgb,var(--color-deep)_30%,transparent)_45%,transparent_75%)]" />
      {/* Pool behind the headline itself (measured: fg text >= 3.7:1 at the worst 5% of word area).
          Portrait: over the clouds, top-left. Landscape: centred on the headline, clear of the sun. */}
      <div className="pointer-events-none absolute inset-0 portrait:bg-[radial-gradient(ellipse_140%_45%_at_10%_20%,color-mix(in_srgb,var(--color-deep)_72%,transparent),color-mix(in_srgb,var(--color-deep)_45%,transparent)_50%,transparent_85%)] landscape:bg-[radial-gradient(ellipse_60%_60%_at_28%_62%,color-mix(in_srgb,var(--color-deep)_55%,transparent),color-mix(in_srgb,var(--color-deep)_30%,transparent)_55%,transparent_82%)]" />

      {/* Landscape: everything sits bottom-left. Portrait: headline at the top over the
          dark clouds, subline + buttons at the bottom over the water, so the horizon,
          sun and shikara stay clear in the middle. */}
      <div
        className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-28 md:landscape:pb-40 [@media(max-height:500px)]:pb-12 portrait:flex portrait:flex-col portrait:justify-between portrait:self-stretch portrait:pb-10 portrait:pt-28"
      >
        <div>
          <p
            className="mb-5 text-[13px] font-medium uppercase tracking-[0.3em] text-accent-text text-shadow-sm text-shadow-deep/70"
          >
            Kashmir travel planner
          </p>

          {/* Headline: each word is revealed through a mask, one by one */}
          <h1 className="max-w-4xl text-[clamp(2rem,min(6.6vw,10svh)_+_0.4rem,4.1rem)] font-display font-bold leading-[1.15] tracking-[0.03em] text-shadow-lg text-shadow-deep/50">
            {words.map((word, i) => (
              <Fragment key={i}>
              <span className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
                <span
                  style={{ "--d": `${START + i * STAGGER}s`, "--dur": `${DURATION.slow}s`, "--from-y": "-110%" } as CSSProperties}
                  className="hero-in inline-block"
                >
                  {word}
                </span>
              </span>
              {/* Deliberate break: "Plan Your Kashmir," / "Day by Day." */}
              {word === "Kashmir," && <br />}
              </Fragment>
            ))}
          </h1>
        </div>

        <div>
          <p
            className="mt-6 max-w-xl text-lg text-fg/85 text-shadow-sm text-shadow-deep/60"
          >
            Pick your destinations, shape your itinerary, know your budget.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/plan"
              className={btn.primary}
            >
              Start planning
            </Link>
            <Link
              href="/itinerary"
              className={btn.secondary}
            >
              View My Trip
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator (static) */}
      <div
        className="absolute bottom-8 md:bottom-32 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[13px] font-medium uppercase tracking-[0.3em] text-muted portrait:hidden [@media(max-height:500px)]:hidden"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-4 bg-accent" />
        </span>
      </div>
    </section>
  );
}
