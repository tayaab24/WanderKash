"use client";

import { useTrip } from "@/context/TripContext";
import { MONTHS } from "@/lib/destinations";

type Props = {
  /** Controlled mode: pass both to use the picker without touching the saved trip */
  value?: number | null;
  onChange?: (m: number | null) => void;
  label?: string;
};

export default function MonthPicker({
  value,
  onChange,
  label = "Travel month",
}: Props = {}) {
  const { trip, setMonth } = useTrip();
  const current = onChange ? (value ?? null) : trip.month;
  const set = onChange ?? setMonth;

  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="text-muted">{label}</span>
      <select
        value={current ?? ""}
        onChange={(e) =>
          set(e.target.value ? Number(e.target.value) : null)
        }
        className="min-h-11 rounded-full border border-line bg-surface px-4 py-2 text-base text-fg outline-none sm:text-sm transition-colors hover:bg-surface-hover"
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