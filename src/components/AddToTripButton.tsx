"use client";

import Link from "next/link";
import { useTrip } from "@/context/TripContext";

export default function AddToTripButton({ id }: { id: string }) {
  const { ready, isInTrip, addStop, removeStop } = useTrip();

  // wait for the saved trip to load, to avoid a flash of the wrong button
  if (!ready) return <div className="h-12" />;

  if (isInTrip(id)) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex-1 rounded-full border border-accent px-6 py-3 text-center text-sm text-accent">
            ✓ Added to your trip
          </span>
          <button
            onClick={() => removeStop(id)}
            className="rounded-full border border-line px-5 py-3 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-fg"
          >
            Remove
          </button>
        </div>
        <Link
          href="/itinerary"
          className="flex min-h-11 items-center justify-center text-sm text-accent transition-colors hover:text-accent-hover"
        >
          View my trip →
        </Link>
      </div>
    );
  }

  return (
    <button
      onClick={() => addStop(id)}
      className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
    >
      Add to my trip
    </button>
  );
}