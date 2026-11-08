"use client";

import Link from "next/link";
import { btn } from "@/lib/ui";
import { useTrip } from "@/context/TripContext";

export default function AddToTripButton({ id }: { id: string }) {
  const { ready, isInTrip, addStop, removeStop } = useTrip();

  // wait for the saved trip to load, to avoid a flash of the wrong button
  if (!ready) return <div className="h-11" aria-hidden />;

  if (isInTrip(id)) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex-1 rounded-full border border-accent px-6 py-3 text-center text-sm text-accent">
            ✓ Added to your trip
          </span>
          <button
            onClick={() => removeStop(id)}
            className={btn.secondary}
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
      className={`w-full ${btn.primary}`}
    >
      Add to my trip
    </button>
  );
}