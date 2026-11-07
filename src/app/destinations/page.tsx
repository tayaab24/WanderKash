import type { Metadata } from "next";
import DestinationCard from "@/components/DestinationCard";
import { getAll } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Destinations | WanderKash",
  description: "Eight Kashmir destinations to build your trip around.",
};

export default function DestinationsPage() {
  const destinations = getAll();

  return (
    <section className="mx-auto min-h-screen max-w-6xl px-6 pb-28 pt-36">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
        Destinations
      </p>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
        Where will you wander?
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Open any destination to see what it offers, then add it to your trip.
      </p>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d, i) => (
          <DestinationCard key={d.id} destination={d} index={i} />
        ))}
      </div>
    </section>
  );
}