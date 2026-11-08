"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import SafeImage from "./SafeImage";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import type { Destination } from "@/lib/destinations";

function StackCard({
  destination,
  index,
  total,
  progress,
}: {
  destination: Destination;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Earlier cards shrink a little as later cards slide over them
  const targetScale = 1 - (total - 1 - index) * 0.02;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const reduceMotion = usePrefersReducedMotion();
  const isLast = index === total - 1;

  return (
    <div
      className={`sticky top-[calc(5rem_+_var(--i)_*_0.4rem)] md:top-[calc(6rem_+_var(--i)_*_0.6rem)] ${isLast ? "" : "mb-[14vh]"}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <motion.article
        style={reduceMotion ? undefined : { scale, transformOrigin: "top center" }}
        className="overflow-hidden rounded-3xl border border-line shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--color-fg)_12%,transparent)]"
      >
        <Link
          href={`/destination/${destination.id}`}
          aria-label={`Open ${destination.name}`}
          className="on-dark group relative block focus-visible:outline-offset-[-4px] h-[60vh] min-h-80 overflow-hidden supports-[height:1svh]:h-[60svh] md:min-h-105"
        >
          <SafeImage
            src={destination.image}
            alt={destination.name}
            label={destination.name}
            sizes="(min-width: 1152px) 1100px, 100vw"
            className="transition-transform duration-700 group-hover:scale-105"
          />

          {/* Soft grey fade so the text is readable */}
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

            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-on-accent transition-transform duration-300 group-hover:scale-110 md:h-14 md:w-14">
              ↗
            </span>
          </div>
        </Link>
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative">
      {destinations.map((d, i) => (
        <StackCard
          key={d.id}
          destination={d}
          index={i}
          total={destinations.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}