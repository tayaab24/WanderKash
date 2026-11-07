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
import AddToTripButton from "./AddToTripButton";
import SeasonBadge from "./SeasonBadge";
import { dayCost, type Destination } from "@/lib/destinations";
import { formatINR } from "@/lib/format";

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
  // Earlier cards shrink a little as later cards cover them
  const targetScale = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const isLast = index === total - 1;

  return (
    <div
      className={`sticky ${isLast ? "" : "mb-[22vh]"}`}
      style={{ top: `calc(6rem + ${index * 1.25}rem)` }}
    >
      <motion.article
        style={{ scale, transformOrigin: "top center" }}
        className="flex h-[78vh] min-h-115 flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(20,24,28,0.6)] md:h-[64vh] md:flex-row"
      >
        {/* Image */}
        <Link
          href={`/destination/${destination.id}`}
          className="group relative h-2/5 shrink-0 overflow-hidden md:h-auto md:w-1/2"
        >
          <SafeImage
            src={destination.image}
            alt={destination.name}
            label={destination.name}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Text */}
        <div className="flex flex-1 flex-col justify-center p-6 md:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </p>

          <h3 className="mt-3 font-serif text-4xl leading-none md:mt-4 md:text-6xl">
            {destination.name}
          </h3>
          <p className="mt-2 text-muted md:mt-3">{destination.tagline}</p>

          <div className="mt-3 md:mt-4">
            <SeasonBadge id={destination.id} />
          </div>

          <p className="mt-4 line-clamp-3 max-w-md leading-relaxed text-fg/90 md:mt-6 md:line-clamp-none">
            {destination.description}
          </p>

          <div className="mt-4 hidden gap-8 text-sm sm:flex md:mt-6">
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

          <div className="mt-5 flex max-w-sm flex-col gap-3 md:mt-8">
            <AddToTripButton id={destination.id} />
            <Link
              href={`/destination/${destination.id}`}
              className="text-sm text-accent transition-colors hover:text-accent-hover"
            >
              Explore {destination.name} →
            </Link>
          </div>
        </div>
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