"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MonthPicker from "./MonthPicker";
import SafeImage from "./SafeImage";
import SeasonBadge from "./SeasonBadge";
import { useTrip } from "@/context/TripContext";
import { computeBudget } from "@/lib/budget";
import { MONTHS, TAGS } from "@/lib/destinations";
import { formatINR } from "@/lib/format";
import { generatePlan } from "@/lib/planner";

const DAY_OPTIONS = [2, 3, 4, 5, 6, 7];
const STEPS = ["Days", "Month", "Vibe"];

export default function QuickPlanner({
  initialMonth = null,
}: {
  initialMonth?: number | null;
}) {
  const router = useRouter();
  const { loadTrip } = useTrip();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(0); // 0-2 questions, 3 result
  const [dir, setDir] = useState(1);
  const [days, setDays] = useState(4);
  const [month, setMonth] = useState<number | null>(initialMonth);
  const [vibes, setVibes] = useState<string[]>([]);

  const plan = useMemo(
    () => (step === 3 && month ? generatePlan({ days, month, vibes }) : []),
    [step, days, month, vibes]
  );
  const perPerson = useMemo(
    () =>
      computeBudget({
        travelers: 1,
        month,
        days: plan.map((s, i) => ({ day: i + 1, stops: [s.destination.id] })),
      }).perPersonTotal,
    [plan, month]
  );
  const offCount = plan.filter((s) => s.status === "off").length;

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };
  const toggleVibe = (t: string) =>
    setVibes((v) => (v.includes(t) ? v.filter((x) => x !== t) : [...v, t]));

  const applyPlan = () => {
    if (!month) return;
    const ok = loadTrip({
      days: plan.map((s) => [s.destination.id]),
      suggestedMonth: month,
    });
    if (ok) router.push("/itinerary");
  };

  const startOver = () => {
    setDir(-1);
    setStep(0);
    setDays(4);
    setMonth(initialMonth);
    setVibes([]);
  };

  const canNext = step !== 1 || month !== null;
  const offset = reduceMotion ? 0 : 40;

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
      {/* Step indicator */}
      <ol className="mb-10 grid grid-cols-3 gap-3" aria-label="Progress">
        {STEPS.map((label, i) => {
          const done = step > i;
          const current = step === i;
          return (
            <li key={label} aria-current={current ? "step" : undefined}>
              <span
                className={`block h-1 rounded-full transition-colors duration-500 ${
                  done || current ? "bg-accent" : "bg-line"
                }`}
              />
              <span
                className={`mt-2 block text-xs uppercase tracking-[0.2em] ${
                  current ? "text-accent" : done ? "text-fg" : "text-muted"
                }`}
              >
                {i + 1}. {label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="relative min-h-72 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * offset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -dir * offset }}
            transition={{
              duration: reduceMotion ? 0 : 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {step === 0 && (
              <fieldset>
                <legend className="font-serif text-3xl sm:text-4xl">
                  How many days?
                </legend>
                <p className="mt-2 text-muted">One stop per day.</p>
                <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {DAY_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={days === n}
                      onClick={() => setDays(n)}
                      className={`rounded-2xl border py-5 font-serif text-3xl transition-colors ${
                        days === n
                          ? "border-accent bg-accent text-bg"
                          : "border-line text-fg hover:border-accent hover:text-accent"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl">
                  Which month?
                </h2>
                <p className="mt-2 text-muted">
                  We&apos;ll favour places at their best then.
                </p>
                <div className="mt-8">
                  <MonthPicker
                    value={month}
                    onChange={setMonth}
                    label="I'm travelling in"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <fieldset>
                <legend className="font-serif text-3xl sm:text-4xl">
                  What&apos;s your vibe?
                </legend>
                <p className="mt-2 text-muted">
                  Pick any that appeal, or skip to go by season alone.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {TAGS.map((t) => {
                    const on = vibes.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleVibe(t)}
                        className={`rounded-full border px-5 py-2.5 transition-colors ${
                          on
                            ? "border-accent bg-accent text-bg"
                            : "border-line text-fg hover:border-accent hover:text-accent"
                        }`}
                      >
                        {on && "✓ "}
                        {t}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {step === 3 && month && (
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl">
                  Your {days} days in {MONTHS[month - 1]}
                </h2>
                <p className="mt-2 text-muted">
                  Est. per person{" "}
                  <span className="text-accent">≈ {formatINR(perPerson)}</span>{" "}
                  · sample costs for stay, food and transport
                </p>

                {offCount > 0 && (
                  <p className="mt-4 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn">
                    Only a few places are in season in {MONTHS[month - 1]}, so{" "}
                    {offCount === 1 ? "one stop is" : `${offCount} stops are`}{" "}
                    off-season. Check roads and weather, or try fewer days.
                  </p>
                )}

                <ol className="mt-8 space-y-3">
                  {plan.map((s, i) => (
                    <li
                      key={`${s.destination.id}-${i}`}
                      className="flex items-center gap-4 rounded-xl border border-line bg-bg/40 p-3"
                    >
                      <span className="w-14 shrink-0 text-xs uppercase tracking-[0.2em] text-muted">
                        Day {i + 1}
                      </span>
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                        <SafeImage
                          src={s.destination.image}
                          alt=""
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/destination/${s.destination.id}`}
                          className="font-serif text-xl transition-colors hover:text-accent"
                        >
                          {s.destination.name}
                        </Link>
                        <div className="mt-1">
                          <SeasonBadge id={s.destination.id} month={month} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        {step === 3 ? (
          <>
            <button
              type="button"
              onClick={startOver}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              ← Start over
            </button>
            <button
              type="button"
              onClick={applyPlan}
              className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
            >
              Use this plan
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="text-sm text-muted transition-colors hover:text-accent disabled:invisible"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => go(step + 1)}
              disabled={!canNext}
              className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === 2 ? "Show my plan" : "Next"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
