"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DestinationRow from "./DestinationRow";
import MonthPicker from "./MonthPicker";
import { useTrip } from "@/context/TripContext";
import { TAGS, seasonStatus, type Destination } from "@/lib/destinations";

export default function DestinationsExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const { trip, ready, setMonth } = useTrip();
  const month = trip.month;

  // ?month=1..12 preselects the travel month (e.g. from the FAQ's winter link).
  // Applied once, after the saved trip has loaded, so it isn't overwritten.
  const appliedUrlMonth = useRef(false);
  useEffect(() => {
    if (!ready || appliedUrlMonth.current) return;
    appliedUrlMonth.current = true;
    const m = Number(new URLSearchParams(window.location.search).get("month"));
    if (Number.isInteger(m) && m >= 1 && m <= 12) setMonth(m);
  }, [ready, setMonth]);

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [inSeasonOnly, setInSeasonOnly] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      if (tag !== "All" && !d.tags.includes(tag)) return false;
      if (inSeasonOnly && month && seasonStatus(d, month) === "off")
        return false;
      if (!q) return true;
      return [d.name, d.tagline, d.description, ...d.highlights]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [destinations, query, tag, inSeasonOnly, month]);

  const reset = () => {
    setQuery("");
    setTag("All");
    setInSeasonOnly(false);
  };

  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors ${
      active
        ? "border-accent bg-accent text-bg"
        : "border-line text-muted hover:bg-surface hover:text-fg"
    }`;

  return (
    <>
      {/* Controls */}
      <div className="mt-10 space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, e.g. lake, snow, meadow"
            aria-label="Search destinations"
            className="min-h-11 w-full min-w-0 flex-1 rounded-full border border-line bg-bg px-5 py-2.5 text-base text-fg sm:min-w-60 sm:text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <MonthPicker />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", ...TAGS].map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={chip(tag === t)}
            >
              {t}
            </button>
          ))}

          <label
            className={`ml-auto flex min-h-11 items-center gap-2 text-sm ${
              month ? "text-fg" : "text-muted opacity-60"
            }`}
          >
            <input
              type="checkbox"
              checked={inSeasonOnly}
              disabled={!month}
              onChange={(e) => setInSeasonOnly(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            In season only
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {results.length} of {destinations.length} destinations
      </p>

      {/* Results */}
      {results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-12 text-center">
          <h2 className="font-serif text-3xl">Nothing matches</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Try a different search, another category, or turn off the in-season
            filter.
          </p>
          <button
            onClick={reset}
            className="mt-8 rounded-full bg-accent px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-2 divide-y divide-line">
          {results.map((d, i) => (
            <DestinationRow
              key={d.id}
              destination={d}
              index={i}
              total={results.length}
            />
          ))}
        </div>
      )}
    </>
  );
}