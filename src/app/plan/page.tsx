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
      <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.3em] text-accent-text">
        Quick planner
      </p>
      <h1 className="text-[clamp(2.1rem,4.2vw_+_0.85rem,3.1rem)] font-display font-semibold leading-[1.15] tracking-[0.03em]">
        {/* Fixed phone break: same 2 lines in the fallback font and in Cinzel, so nothing shifts when it loads */}
        Plan in <span className="font-sans font-semibold tabular-nums">30</span>{" "}
        <br className="sm:hidden" />
        seconds
      </h1>
      <p className="mb-12 mt-5 max-w-xl text-lg text-muted">
        Three questions. We&apos;ll match places to your month and mood, then you
        can fine-tune every day.
      </p>
      <Suspense
        fallback={
          <div className="h-[520px] animate-pulse rounded-3xl border border-line bg-surface motion-reduce:animate-none sm:h-[552px]" />
        }
      >
        <PlannerWithParams searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
