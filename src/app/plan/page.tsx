import type { Metadata } from "next";
import { Suspense } from "react";
import QuickPlanner from "@/components/QuickPlanner";

export const metadata: Metadata = {
  title: "Plan in 30 seconds | WanderKash",
  description:
    "Answer three quick questions (days, month, vibe) and get a day-by-day Kashmir plan with season checks and a cost estimate.",
  openGraph: {
    title: "Plan in 30 seconds | WanderKash",
    description: "Three questions, one Kashmir itinerary.",
  },
};

type Props = { searchParams: Promise<{ month?: string }> };

// Reads ?month= (e.g. from "Plan a trip for November") to preselect the month
async function PlannerWithParams({ searchParams }: Props) {
  const { month } = await searchParams;
  const m = Number(month);
  const initialMonth = Number.isInteger(m) && m >= 1 && m <= 12 ? m : null;
  return <QuickPlanner initialMonth={initialMonth} />;
}

export default function PlanPage({ searchParams }: Props) {
  return (
    <section className="min-h-screen-safe mx-auto max-w-3xl px-6 pb-28 pt-28 md:pt-36">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
        Quick planner
      </p>
      <h1 className="font-display text-[clamp(2.5rem,5vw_+_1rem,3.75rem)] leading-[1.1]">
        Plan in 30 seconds
      </h1>
      <p className="mb-12 mt-5 max-w-xl text-lg text-muted">
        Three questions. We&apos;ll match places to your month and mood, then you
        can fine-tune every day.
      </p>
      <Suspense
        fallback={
          <div className="h-120 animate-pulse rounded-3xl border border-line bg-surface motion-reduce:animate-none" />
        }
      >
        <PlannerWithParams searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
