"use client";

import { useTrip } from "@/context/TripContext";
import { MONTHS, getById, seasonStatus } from "@/lib/destinations";

export default function SeasonBadge({
  id,
  withMessage = false,
  month: monthOverride,
}: {
  id: string;
  withMessage?: boolean;
  /** Use this month instead of the saved trip's month */
  month?: number;
}) {
  const { trip, ready } = useTrip();
  const d = getById(id);
  const m = monthOverride ?? (ready ? trip.month : null);
  if (!d || !m) return null;

  const month = MONTHS[m - 1];
  const status = seasonStatus(d, m);

  const styles = {
    good: "border-accent/40 bg-accent/10 text-accent",
    shoulder: "border-line text-muted",
    off: "border-warn/40 bg-warn/10 text-warn",
  }[status];

  const label = {
    good: `✓ In season in ${month}`,
    shoulder: `Edge of season in ${month}`,
    off: `⚠ Off-season in ${month}`,
  }[status];

  const message =
    status === "off"
      ? `${d.name} is outside its best season (${d.bestSeason}). Check road and weather conditions before you go.`
      : `${d.name} is close to the edge of its best season (${d.bestSeason}). Conditions can change, so check before you go.`;

  return (
    <div>
      <span
        className={`inline-block rounded-full border px-3 py-1 text-xs ${styles}`}
      >
        {label}
      </span>
      {withMessage && status !== "good" && (
        <p className="mt-3 max-w-md text-sm text-muted">{message}</p>
      )}
    </div>
  );
}