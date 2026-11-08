"use client";

import { useRef } from "react";
import Link from "next/link";
import { EASE } from "@/lib/motion";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import SafeImage from "./SafeImage";
import { useIsSmallScreen, usePrefersReducedMotion } from "@/lib/useMediaQuery";
import AddToTripButton from "./AddToTripButton";
import { dayCost, type Destination } from "@/lib/destinations";
import { formatINR } from "@/lib/format";
import SeasonBadge from "./SeasonBadge";

const ease = EASE;

export default function DestinationRow({
  destination,
  index,
  total,
}: {
  destination: Destination;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const flip = index % 2 === 1; // odd rows: image on the right

  // Parallax: the photo moves slightly slower than the page
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const reduceMotion = usePrefersReducedMotion();
  const small = useIsSmallScreen(); // no image parallax on phones

  // Image enters from its own side, text from the opposite side
  const imageFrom = flip ? 140 : -140;
  const textFrom = flip ? -80 : 80;

  return (
    <div
      ref={ref}
      className="grid items-center gap-8 py-14 md:grid-cols-2 md:gap-16 md:py-24"
    >
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: imageFrom }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease }}
        className={flip ? "md:order-2" : ""}
      >
        <Link
          href={`/destination/${destination.id}`}
          className="group relative block aspect-4/3 overflow-hidden rounded-2xl border border-line"
        >
          <motion.div
            style={reduceMotion || small ? undefined : { y: imageY }}
            className="absolute -inset-[10%]"
          >
            <SafeImage
              src={destination.image}
              alt={destination.name}
              label={destination.name}
              sizes="(min-width: 768px) 60vw, 120vw"
              className="transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-t from-bg/50 via-transparent to-transparent" />
        </Link>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: textFrom }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, delay: 0.15, ease }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        <h2 className="mt-4 font-display text-[clamp(2.25rem,4vw_+_1rem,3.5rem)] font-bold leading-[1.05]">
          {destination.name}
        </h2>
        <p className="mt-3 text-muted">{destination.tagline}</p>
        <div className="mt-4">
          <SeasonBadge id={destination.id} />
        </div>

        <p className="mt-6 max-w-md leading-relaxed text-fg/90">
          {destination.description}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {destination.highlights.map((h) => (
            <li
              key={h}
              className="rounded-full border border-line px-3 py-1 text-sm text-muted"
            >
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-8 text-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Best season
            </p>
            <p className="mt-1">{destination.bestSeason}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Per day
            </p>
            <p className="mt-1">{formatINR(dayCost(destination))}</p>
          </div>
        </div>

        <div className="mt-8 flex max-w-sm flex-col gap-4">
          <AddToTripButton id={destination.id} />
          <Link
            href={`/destination/${destination.id}`}
            className="inline-flex min-h-11 items-center text-sm text-accent transition-colors hover:text-accent-hover"
          >
            Explore {destination.name} →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}