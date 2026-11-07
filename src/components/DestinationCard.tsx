"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SafeImage from "./SafeImage";
import { useTrip } from "@/context/TripContext";
import type { Destination } from "@/lib/destinations";

export default function DestinationCard({
  destination,
  index,
}: {
  destination: Destination;
  index: number;
}) {
  const { isInTrip } = useTrip();
  const inTrip = isInTrip(destination.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/destination/${destination.id}`}
        className="group block overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:bg-surface-hover"
      >
        <div className="relative aspect-4/5 overflow-hidden">
          <SafeImage
            src={destination.image}
            alt={destination.name}
            label={destination.name}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-transparent" />

          {inTrip && (
            <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-bg">
              In your trip
            </span>
          )}

          <span className="absolute right-4 top-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-accent text-bg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            ↗
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-serif text-2xl">{destination.name}</h3>
          <p className="mt-1 text-sm text-muted">{destination.tagline}</p>
          <p className="mt-4 text-xs uppercase tracking-widest text-accent">
            Best: {destination.bestSeason}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}