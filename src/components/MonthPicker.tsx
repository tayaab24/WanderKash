"use client";

import { useTrip } from "@/context/TripContext";
import { MONTHS } from "@/lib/destinations";

export default function MonthPicker() {
  const { trip, setMonth } = useTrip();

  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="text-muted">Travel month</span>
      <select
        value={trip.month ?? ""}
        onChange={(e) =>
          setMonth(e.target.value ? Number(e.target.value) : null)
        }
        className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-fg outline-none transition-colors hover:bg-surface-hover"
      >
        <option value="">Not sure yet</option>
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </select>
    </label>
  );
}