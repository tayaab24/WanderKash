"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import SafeImage from "./SafeImage";
import { useIsSmallScreen, usePrefersReducedMotion } from "@/lib/useMediaQuery";
import type { Destination } from "@/lib/destinations";

// Earlier cards ease down to this scale as later ones slide over them
const SCALE_DESKTOP = 0.94;
const SCALE_MOBILE = 0.96;
const MAX_DIM = 0.35; // slate overlay opacity on covered cards

function StackCard({
  destination,
  index,
  total,
  progress,
  minScale,
  animated,
  active,
}: {
  destination: Destination;
  index: number;
  total: number;
  progress: MotionValue<number>;
  minScale: number;
  animated: boolean;
  active: boolean;
}) {
  const isLast = index === total - 1;
  // All values derive from the stack's single scroll progress (no per-card listeners).
  // A card starts settling once the next card begins to cover it.
  const start = (index + 1) / total;
  const scale = useTransform(progress, [start - 1 / total, 1], [1, isLast ? 1 : minScale]);
  const dim = useTransform(progress, [start - 1 / total, start], [0, isLast ? 0 : MAX_DIM]);

  return (
    <div
      className={
        animated
          ? `sticky top-[calc(5rem_+_var(--i)_*_0.4rem)] md:top-[calc(6rem_+_var(--i)_*_0.6rem)] ${isLast ? "" : "mb-[14vh]"}`
          : "mb-6 last:mb-0"
      }
      style={{ "--i": index } as CSSProperties}
    >
      <motion.article
        style={
          animated
            ? { scale, transformOrigin: "top center", willChange: active ? "transform" : "auto" }
            : undefined
        }
        // overflow-hidden lives on the card (rounded corners), never on a sticky ancestor
        className="relative overflow-hidden rounded-3xl border border-line shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--color-fg)_12%,transparent)] backface-hidden [contain:layout_paint]"
      >
        <Link
          href={`/destination/${destination.id}`}
          aria-label={`Open ${destination.name}`}
          className="on-dark group relative block h-[60vh] min-h-80 overflow-hidden focus-visible:outline-offset-[-4px] supports-[height:1svh]:h-[60svh] md:min-h-105 md:supports-[height:1svh]:h-[68svh]"
        >
          <SafeImage
            src={destination.image}
            alt={destination.name}
            label={destination.name}
            sizes="(min-width: 768px) 90vw, 100vw"
            loading={index < 2 ? "eager" : "lazy"}
            className="transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:scale-[1.03]"
          />

          {/* Soft fade so the text is readable */}
          <div className="absolute inset-0 bg-linear-to-t from-deep/60 via-deep/10 to-transparent" />

          {/* Number */}
          <span className="absolute left-6 top-6 text-[13px] font-medium uppercase tracking-[0.3em] text-fg/80 md:left-10 md:top-10">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>

          {/* Name and tagline */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-10">
            <div>
              <h3 className="text-[clamp(1.7rem,4.2vw_+_0.85rem,3.3rem)] font-display font-semibold leading-[1.15] tracking-[0.03em]">
                {destination.name}
              </h3>
              <p className="mt-3 text-muted md:text-lg">
                {destination.tagline}
              </p>
            </div>

            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-on-accent transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:h-14 md:w-14 md:group-hover:-translate-y-1 md:group-hover:translate-x-1">
              ↗
            </span>
          </div>
        </Link>

        {/* Covered cards dim slightly: an overlay whose opacity changes (no filters) */}
        {animated && !isLast && (
          <motion.div
            aria-hidden
            style={{ opacity: dim }}
            className="pointer-events-none absolute inset-0 bg-deep"
          />
        )}
      </motion.article>
    </div>
  );
}

export default function StackedDestinations({
  destinations,
}: {
  destinations: Destination[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const small = useIsSmallScreen();
  const animated = !reduceMotion;

  // ONE scroll source for the whole stack
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // will-change only while the stack is actually on screen
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !animated) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [animated]);

  return (
    // Bottom space lets the last card settle before the next section
    <div ref={ref} className={`relative ${animated ? "pb-[12vh]" : ""}`}>
      {destinations.map((d, i) => (
        <StackCard
          key={d.id}
          destination={d}
          index={i}
          total={destinations.length}
          progress={scrollYProgress}
          minScale={small ? SCALE_MOBILE : SCALE_DESKTOP}
          animated={animated}
          active={active}
        />
      ))}
    </div>
  );
}
