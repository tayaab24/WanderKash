import type { Metadata } from "next";
import DestinationRow from "@/components/DestinationRow";
import { getAll } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Destinations | WanderKash",
  description: "Eight Kashmir destinations to build your trip around.",
};

export default function DestinationsPage() {
  const destinations = getAll();

  return (
    <section className="mx-auto min-h-screen max-w-6xl overflow-x-clip px-6 pb-20 pt-36">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
        Destinations
      </p>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
        Where will you wander?
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Scroll to meet each destination, then add the ones you love to your
        trip.
      </p>

      <div className="mt-10 divide-y divide-line">
        {destinations.map((d, i) => (
          <DestinationRow
            key={d.id}
            destination={d}
            index={i}
            total={destinations.length}
          />
        ))}
      </div>
    </section>
  );
}