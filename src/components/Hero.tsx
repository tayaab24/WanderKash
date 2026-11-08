"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { btn } from "@/lib/ui";
import { getImageProps } from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useIsSmallScreen, usePrefersReducedMotion } from "@/lib/useMediaQuery";

const words = "Plan Your Kashmir, Day by Day.".split(" ");

// Timing (seconds)
const START = 0.4; // wait before the first word drops
const STAGGER = 0.14; // gap between words
const AFTER = START + words.length * STAGGER + 0.5; // when the rest appears

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

const MOUSE_SHIFT = 4; // max px of mouse parallax each way

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const reduceMotion = usePrefersReducedMotion();
  const small = useIsSmallScreen();
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageYSmall = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]); // lighter on phones
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Very subtle mouse parallax: desktop with a fine pointer only, never for reduced motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    if (reduceMotion || !desktop.matches) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }
    const onMove = (e: MouseEvent) => {
      mouseX.set((0.5 - e.clientX / window.innerWidth) * 2 * MOUSE_SHIFT);
      mouseY.set((0.5 - e.clientY / window.innerHeight) * 2 * MOUSE_SHIFT);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion, mouseX, mouseY]);

  return (
    <section
      ref={ref}
      className="hero-height relative flex items-end overflow-hidden"
    >
      {/* Layers: scroll parallax > mouse parallax > slow Ken Burns > photo */}
      <motion.div
        style={reduceMotion ? undefined : { y: small ? imageYSmall : imageY }}
        className="absolute inset-0"
      >
        <motion.div
          style={reduceMotion ? undefined : { x: springX, y: springY }}
          className="absolute -inset-2"
        >
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
        </motion.div>
      </motion.div>

      {/* Overlays (bg token, never black): bottom fade + a soft pool behind the headline.
          The top fade for the navbar comes from the navbar's own scrim. */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/90 via-bg/35 via-25% to-transparent to-50%" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_0%_100%,rgb(43_48_54/0.75),transparent_75%)] landscape:bg-[radial-gradient(ellipse_85%_90%_at_0%_100%,rgb(43_48_54/0.88),rgb(43_48_54/0.45)_45%,transparent_75%)]" />
      {/* Pool behind the headline itself (measured: fg text >= 3.7:1 at the worst 5% of word area).
          Portrait: over the clouds, top-left. Landscape: centred on the headline, clear of the sun. */}
      <div className="pointer-events-none absolute inset-0 portrait:bg-[radial-gradient(ellipse_140%_45%_at_10%_20%,rgb(43_48_54/0.9),rgb(43_48_54/0.55)_50%,transparent_85%)] landscape:bg-[radial-gradient(ellipse_60%_60%_at_28%_62%,rgb(43_48_54/0.8),rgb(43_48_54/0.45)_55%,transparent_82%)]" />

      {/* Landscape: everything sits bottom-left. Portrait: headline at the top over the
          dark clouds, subline + buttons at the bottom over the water, so the horizon,
          sun and shikara stay clear in the middle. */}
      <motion.div
        style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
        className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-28 [@media(max-height:500px)]:pb-12 portrait:flex portrait:flex-col portrait:justify-between portrait:self-stretch portrait:pb-10 portrait:pt-28"
      >
        <div>
          <p
            style={{ "--d": "0.1s", "--dur": "0.7s", "--from-y": "-12px" } as CSSProperties}
            className="hero-in mb-5 text-xs font-medium uppercase tracking-[0.3em] text-accent-hover text-shadow-sm text-shadow-bg/70"
          >
            Kashmir travel planner
          </p>

          {/* Headline: each word drops down from above, one by one */}
          <h1 className="max-w-4xl font-display text-[clamp(2.4rem,min(8vw,12svh)_+_0.5rem,5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-shadow-lg text-shadow-bg/50">
            {words.map((word, i) => (
              <Fragment key={i}>
              <span className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
                <span
                  style={{ "--d": `${START + i * STAGGER}s`, "--dur": "0.9s", "--from-y": "-110%" } as CSSProperties}
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
            style={{ "--d": `${AFTER}s`, "--dur": "0.8s", "--from-y": "-16px" } as CSSProperties}
            className="hero-in mt-6 max-w-xl text-lg text-fg/85 text-shadow-sm text-shadow-bg/60"
          >
            Pick your destinations, shape your itinerary, know your budget.
          </p>

          <div
            style={{ "--d": `${AFTER + 0.25}s`, "--dur": "0.8s", "--from-y": "-16px" } as CSSProperties}
            className="hero-in mt-10 flex flex-wrap gap-4"
          >
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
      </motion.div>

      {/* Scroll indicator */}
      <div
        style={{ "--d": `${AFTER + 0.6}s`, "--dur": "0.6s", "--from-y": "0px" } as CSSProperties}
        className="hero-in-fade absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted portrait:hidden [@media(max-height:500px)]:hidden"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="scroll-cue absolute inset-x-0 top-0 h-4 bg-accent" />
        </span>
      </div>
    </section>
  );
}
