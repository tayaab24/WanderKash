"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { MONTHS, seasonStatus, type Destination } from "@/lib/destinations";

const noop = () => () => {};
const getMonth = () => new Date().getMonth() + 1;
// null on the server and during hydration, so the server HTML always matches
const getServerMonth = () => null;

export default function BestRightNow({
  destinations,
}: {
  destinations: Destination[];
}) {
  const month = useSyncExternalStore(noop, getMonth, getServerMonth);

  let lead = "";
  let picks: Destination[] = [];
  if (month !== null) {
    const name = MONTHS[month - 1];
    picks = destinations.filter((d) => seasonStatus(d, month) === "good");
    if (picks.length > 0) {
      lead = `In ${name}:`;
    } else {
      // Some months (e.g. November) have nothing in peak season
      picks = destinations.filter(
        (d) => seasonStatus(d, month) === "shoulder"
      );
      lead = `Nothing is in peak season in ${name}. Close to it:`;
    }
  }

  return (
    <p className="min-h-6 text-base text-muted" aria-live="polite">
      <span className="mr-3 text-[13px] font-bold uppercase tracking-[0.3em] text-accent-text">
        Best right now
      </span>
      {month !== null && (
        <>
          {lead}{" "}
          {picks.map((d, i) => (
            <span key={d.id}>
              <Link
                href={`/destination/${d.id}`}
                className="text-fg transition-colors hover:text-accent-text"
              >
                {d.name}
              </Link>
              {i < picks.length - 1 && ", "}
            </span>
          ))}
        </>
      )}
    </p>
  );
}
