import Link from "next/link";
import Hero from "@/components/Hero";
import DestinationCard from "@/components/DestinationCard";
import { getAll } from "@/lib/destinations";

const steps = [
  {
    n: "01",
    title: "Pick destinations",
    text: "Browse Kashmir's lakes, meadows and valleys, and add the ones you like.",
  },
  {
    n: "02",
    title: "Shape your days",
    text: "Assign each stop to a day and rearrange until the plan feels right.",
  },
  {
    n: "03",
    title: "Know your budget",
    text: "See stay, food and transport costs update as you build your trip.",
  },
];

export default function Home() {
  const featured = getAll().slice(0, 3);

  return (
    <>
      <Hero />

      <section className="px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-3xl leading-snug text-fg md:text-4xl">
            From the still water of Dal Lake to the high meadows of Gulmarg,
            build a trip that fits your days and your budget.
          </p>
        </div>
      </section>

      <section className="border-t border-line px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
                Featured
              </p>
              <h2 className="max-w-2xl font-serif text-4xl md:text-5xl">
                Start with the classics
              </h2>
            </div>
            <Link
              href="/destinations"
              className="text-sm text-accent transition-colors hover:text-accent-hover"
            >
              View all destinations →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d, i) => (
              <DestinationCard key={d.id} destination={d} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
            How it works
          </p>
          <h2 className="mb-14 max-w-2xl font-serif text-4xl md:text-5xl">
            Three steps to a plan
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-line bg-surface p-8"
              >
                <span className="font-serif text-4xl text-accent">{s.n}</span>
                <h3 className="mt-6 font-serif text-2xl">{s.title}</h3>
                <p className="mt-3 text-muted">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Link
              href="/destinations"
              className="inline-block rounded-full bg-accent px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}