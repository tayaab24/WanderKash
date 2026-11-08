"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import SafeImage from "./SafeImage";
import { useTrip } from "@/context/TripContext";
import { sampleTrips, type SampleTrip } from "@/data/sampleTrips";
import { computeBudget } from "@/lib/budget";
import { MONTHS, getById, seasonStatus } from "@/lib/destinations";
import { formatINR } from "@/lib/format";

function TripCard({
  trip,
  index,
  reduceMotion,
}: {
  trip: SampleTrip;
  index: number;
  reduceMotion: boolean;
}) {
  const router = useRouter();
  const { loadTrip } = useTrip();

  const stops = trip.days.reduce((n, d) => n + d.length, 0);
  const offSeason = trip.days
    .flat()
    .map((id) => getById(id))
    .filter((d) => d && seasonStatus(d, trip.suggestedMonth) === "off")
    .map((d) => d!.name);
  const { perPersonTotal } = computeBudget({
    travelers: 1,
    month: trip.suggestedMonth,
    days: trip.days.map((s, i) => ({ day: i + 1, stops: s })),
  });

  const use = async () => {
    if (await loadTrip(trip)) router.push("/itinerary");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }
      }
      className="h-full"
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:bg-surface-hover hover:shadow-[0_24px_48px_-28px_rgba(20,24,28,0.7)] motion-reduce:transition-colors motion-reduce:hover:translate-y-0">
        <div className="relative aspect-4/3 overflow-hidden">
          <SafeImage
            src={trip.cover}
            alt=""
            label={trip.title}
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg/60 to-transparent" />
          <span className="absolute bottom-3 left-4 text-xs uppercase tracking-[0.2em] text-fg">
            {trip.days.length} days · {stops} stops
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-serif text-2xl leading-tight">{trip.title}</h3>
          <p className="mt-2 text-base text-muted">{trip.tagline}</p>

          <dl className="mb-6 mt-5 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Suggested month</dt>
              <dd>{MONTHS[trip.suggestedMonth - 1]}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Est. per person</dt>
              <dd>
                <span className="text-accent">≈ {formatINR(perPersonTotal)}</span>
              </dd>
            </div>
          </dl>

          {offSeason.length > 0 && (
            <p className="-mt-3 mb-5 text-base leading-relaxed text-warn">
              {offSeason.join(" and ")} {offSeason.length === 1 ? "is" : "are"}{" "}
              off-season in {MONTHS[trip.suggestedMonth - 1]}: expect snow and
              possible road closures.
            </p>
          )}

          <button
            type="button"
            onClick={use}
            className="mt-auto min-h-11 w-full rounded-full border border-line py-2.5 text-sm transition-colors hover:border-accent hover:bg-accent hover:text-bg"
          >
            Use this trip
          </button>
        </div>
      </article>
    </motion.div>
  );
}

export default function ReadyTrips() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {sampleTrips.map((t, i) => (
        <TripCard key={t.id} trip={t} index={i} reduceMotion={reduceMotion} />
      ))}
    </div>
  );
}
