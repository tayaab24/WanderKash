import type { Metadata } from "next";
import DestinationsExplorer from "@/components/DestinationsExplorer";
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
        Search, filter by what you love or by travel month, then add the ones
        you like to your trip.
      </p>

      <DestinationsExplorer destinations={destinations} />
    </section>
  );
}