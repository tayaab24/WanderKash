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
    <section className="min-h-screen-safe mx-auto max-w-6xl overflow-x-clip px-6 pb-20 pt-28 md:pt-36">
      <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.3em] text-accent-text">
        Destinations
      </p>
      <h1 className="max-w-3xl text-[clamp(2.1rem,5vw_+_0.85rem,3.75rem)] font-display font-semibold leading-[1.15] tracking-[0.03em]">
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