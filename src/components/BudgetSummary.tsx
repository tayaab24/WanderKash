"use client";

import { useTrip } from "@/context/TripContext";
import { computeBudget } from "@/lib/budget";
import { formatINR } from "@/lib/format";
import AnimatedNumber from "./AnimatedNumber";

export default function BudgetSummary() {
  const { trip } = useTrip();
  const b = computeBudget(trip);
  const n = b.travelers;

  const categories = [
    { label: "Stay", value: b.perPerson.stay * n },
    { label: "Food", value: b.perPerson.food * n },
    { label: "Transport", value: b.perPerson.transport * n },
  ];

  return (
    <aside
      id="budget"
      className="h-fit min-w-0 scroll-mt-24 rounded-2xl border border-line bg-surface p-6 sm:p-7 lg:sticky lg:top-28"
    >
      <h2 className="font-serif text-3xl">Budget</h2>
      <p className="mt-1 text-base text-muted">
        For {n} {n === 1 ? "traveler" : "travelers"}, sample estimates
      </p>

      {/* Per day */}
      <div className="mt-7">
        <h3 className="text-xs uppercase tracking-[0.25em] text-accent">
          By day
        </h3>
        <dl className="mt-4 space-y-2.5">
          {b.perDay.map((d) => (
            <div key={d.day} className="flex justify-between text-sm">
              <dt className="text-muted">
                Day {d.day}
                {d.stops > 0 && (
                  <span className="ml-2 text-xs">
                    ({d.stops} {d.stops === 1 ? "stop" : "stops"})
                  </span>
                )}
              </dt>
              <dd>{formatINR(d.total * n)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* By category */}
      <div className="mt-7 border-t border-line pt-7">
        <h3 className="text-xs uppercase tracking-[0.25em] text-accent">
          By category
        </h3>
        <dl className="mt-4 space-y-2.5">
          {categories.map((c) => (
            <div key={c.label} className="flex justify-between text-sm">
              <dt className="text-muted">{c.label}</dt>
              <dd>{formatINR(c.value)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Totals */}
      <div className="mt-7 border-t border-line pt-7">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted">Per person</span>
          <span className="text-lg">
            <AnimatedNumber value={b.perPersonTotal} format={formatINR} />
          </span>
        </div>
        <div className="mt-4">
          <span className="text-xs uppercase tracking-[0.25em] text-accent">
            Total
          </span>
          <p className="mt-1 font-serif text-[clamp(2.5rem,8vw,3rem)] text-fg">
            <AnimatedNumber value={b.grandTotal} format={formatINR} />
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted">
        Each stop counts as one day of costs, so one destination per day gives
        the most realistic estimate.
      </p>
    </aside>
  );
}