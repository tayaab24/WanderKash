"use client";

import Link from "next/link";
import { useState } from "react";
import { useTrip } from "@/context/TripContext";
import {
  MONTHS,
  dayCost,
  getAll,
  getById,
  seasonStatus,
  type Destination,
} from "@/lib/destinations";
import { formatINR } from "@/lib/format";
import SafeImage from "./SafeImage";
import BudgetSummary from "./BudgetSummary";
import MonthPicker from "./MonthPicker";
import SeasonBadge from "./SeasonBadge";

const selectClass =
  "rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-fg outline-none transition-colors hover:bg-surface-hover";

export default function ItineraryView() {
  const {
    trip,
    ready,
    totalStops,
    isInTrip,
    addStop,
    removeStop,
    moveStop,
    addDay,
    removeDay,
    setTravelers,
    clearTrip,
  } = useTrip();
  const [confirmClear, setConfirmClear] = useState(false);

  // wait for the saved trip to load from the browser
  if (!ready) return <div className="min-h-screen" />;

  const available = getAll().filter((d) => !isInTrip(d.id));
    const month = trip.month;
  const offSeason = month
    ? trip.days
        .flatMap((d) => d.stops)
        .map((id) => getById(id))
        .filter(
          (d): d is Destination => !!d && seasonStatus(d, month) === "off"
        )
    : [];

  return (
    <section className="mx-auto min-h-screen max-w-6xl px-6 pb-28 pt-36">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
        My trip
      </p>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
        Your Kashmir Itinerary
      </h1>

      {totalStops === 0 ? (
        <div className="mt-16 rounded-2xl border border-line bg-surface p-12 text-center">
          <h2 className="font-serif text-3xl">Your trip is empty</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Browse the destinations and add the ones you want to visit. They
            will appear here, ready to be planned day by day.
          </p>
          <Link
            href="/destinations"
            className="mt-8 inline-block rounded-full bg-accent px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
          >
            Browse destinations
          </Link>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted">Travelers</span>
              <div className="flex items-center rounded-full border border-line bg-surface">
                <button
                  onClick={() => setTravelers(trip.travelers - 1)}
                  disabled={trip.travelers <= 1}
                  aria-label="Fewer travelers"
                  className="h-9 w-9 text-lg text-muted transition-colors hover:text-fg disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">
                  {trip.travelers}
                </span>
                <button
                  onClick={() => setTravelers(trip.travelers + 1)}
                  disabled={trip.travelers >= 10}
                  aria-label="More travelers"
                  className="h-9 w-9 text-lg text-muted transition-colors hover:text-fg disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
            <MonthPicker />
            <div className="ml-auto">
              {confirmClear ? (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted">Clear the whole trip?</span>
                  <button
                    onClick={() => {
                      clearTrip();
                      setConfirmClear(false);
                    }}
                    className="rounded-full bg-accent px-4 py-1.5 text-bg"
                  >
                    Yes, clear
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="text-muted hover:text-fg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  Clear trip
                </button>
              )}
            </div>
          </div>
            {month && offSeason.length > 0 && (
            <div className="mt-8 rounded-2xl border border-warn/40 bg-warn/10 p-5 text-sm">
              <p className="font-medium text-warn">
                Heads up for {MONTHS[month - 1]}
              </p>
              <ul className="mt-2 space-y-1 text-muted">
                {offSeason.map((d) => (
                  <li key={d.id}>
                    {d.name} is outside its best season ({d.bestSeason}). Check
                    road and weather conditions before you go.
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 grid gap-10 lg:grid-cols-3">
            {/* Days */}
            <div className="space-y-6 lg:col-span-2">
              {trip.days.map((day) => (
                <div
                  key={day.day}
                  className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-serif text-3xl">Day {day.day}</h2>
                    <div className="flex items-center gap-3">
                      {available.length > 0 && (
                        <select
                          aria-label={`Add a stop to day ${day.day}`}
                          value=""
                          onChange={(e) => {
                            if (e.target.value) addStop(e.target.value, day.day);
                          }}
                          className={selectClass}
                        >
                          <option value="">+ Add a stop</option>
                          {available.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      )}
                      {trip.days.length > 1 && (
                        <button
                          onClick={() => removeDay(day.day)}
                          title="Stops on this day move to Day 1"
                          className="text-xs text-muted transition-colors hover:text-fg"
                        >
                          Remove day
                        </button>
                      )}
                    </div>
                  </div>

                  {day.stops.length === 0 ? (
                    <p className="mt-5 rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
                      Nothing planned yet. Add a stop, or move one here from
                      another day.
                    </p>
                  ) : (
                    <ul className="mt-5 space-y-3">
                      {day.stops.map((id) => {
                        const d = getById(id);
                        if (!d) return null;
                        return (
                          <li
                            key={id}
                            className="flex items-center gap-4 rounded-xl border border-line bg-bg/40 p-3"
                          >
                            <Link
                              href={`/destination/${d.id}`}
                              className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg"
                            >
                              <SafeImage
                                src={d.image}
                                alt={d.name}
                                label={d.name}
                                sizes="96px"
                              />
                            </Link>

                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/destination/${d.id}`}
                                className="font-serif text-xl transition-colors hover:text-accent"
                              >
                                {d.name}
                              </Link>
                              <p className="mt-0.5 text-xs text-muted">
                                {formatINR(dayCost(d))} per person
                              </p>                              
                            <div className="mt-2">
                                <SeasonBadge id={d.id} />
                            </div>

                            </div>

                            <div className="flex flex-col items-end gap-2">
                              {trip.days.length > 1 && (
                                <select
                                  aria-label={`Move ${d.name} to another day`}
                                  value={day.day}
                                  onChange={(e) =>
                                    moveStop(id, Number(e.target.value))
                                  }
                                  className={selectClass}
                                >
                                  {trip.days.map((opt) => (
                                    <option key={opt.day} value={opt.day}>
                                      Day {opt.day}
                                    </option>
                                  ))}
                                </select>
                              )}
                              <button
                                onClick={() => removeStop(id)}
                                className="text-xs text-muted transition-colors hover:text-fg"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}

              <button
                onClick={addDay}
                disabled={trip.days.length >= 10}
                className="w-full rounded-2xl border border-dashed border-line py-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
              >
                + Add a day
              </button>
            </div>

            {/* Budget */}
            <BudgetSummary />
          </div>
        </>
      )}
    </section>
  );
}