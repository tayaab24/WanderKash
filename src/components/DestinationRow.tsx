"use client";

import Link from "next/link";
import { reveal, revealTransition } from "@/lib/motion";
import { motion } from "framer-motion";
import SafeImage from "./SafeImage";
import AddToTripButton from "./AddToTripButton";
import { dayCost, type Destination } from "@/lib/destinations";
import { formatINR } from "@/lib/format";
import SeasonBadge from "./SeasonBadge";

export default function DestinationRow({
  destination,
  index,
  total,
}: {
  destination: Destination;
  index: number;
  total: number;
}) {
  const flip = index % 2 === 1; // odd rows: image on the right


  return (
    <div
      className="grid items-center gap-8 py-14 md:grid-cols-2 md:gap-16 md:py-24"
    >
      {/* Image */}
      <motion.div
        {...reveal}
        transition={revealTransition(0)}
        className={flip ? "md:order-2" : ""}
      >
        <Link
          href={`/destination/${destination.id}`}
          className="group relative block aspect-4/3 overflow-hidden rounded-2xl border border-line"
        >
          <div className="absolute inset-0">
            <SafeImage
              src={destination.image}
              alt={destination.name}
              label={destination.name}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-deep/35 via-transparent to-transparent" />
        </Link>
      </motion.div>

      {/* Text */}
      <div>
        <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-accent-text">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        <h2 className="mt-4 text-[clamp(1.85rem,3.3vw_+_0.85rem,2.9rem)] font-display font-semibold leading-[1.15] tracking-[0.03em]">
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
              className="rounded-full border border-line px-3 py-1 text-[13px] font-medium text-muted"
            >
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-8 text-sm">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-widest text-muted">
              Best season
            </p>
            <p className="mt-1">{destination.bestSeason}</p>
          </div>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-widest text-muted">
              Per day
            </p>
            <p className="mt-1 tabular-nums">{formatINR(dayCost(destination))}</p>
          </div>
        </div>

        <div className="mt-8 flex max-w-sm flex-col gap-4">
          <AddToTripButton id={destination.id} />
          <Link
            href={`/destination/${destination.id}`}
            className="inline-flex min-h-11 items-center text-sm text-accent-text transition-colors hover:text-accent-text"
          >
            Explore {destination.name} →
          </Link>
        </div>
      </div>
    </div>
  );
}