import Link from "next/link";
import Hero from "@/components/Hero";
import StackedDestinations from "@/components/StackedDestinations";
import Seasons from "@/components/Seasons";
import ReadyTrips from "@/components/ReadyTrips";
import RightNow from "@/components/RightNow";
import CultureMarquee from "@/components/CultureMarquee";
import FaqAccordion from "@/components/FaqAccordion";
import { faq } from "@/data/faq";
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

// FAQPage structured data, built from the same content as the accordion
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function Home() {
  const destinations = getAll();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />

      <section className="px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-3xl leading-snug text-fg md:text-4xl">
            From the still water of Dal Lake to the high meadows of Gulmarg,
            build a trip that fits your days and your budget.
          </p>
        </div>
      </section>

      <Seasons />

      <section className="border-t border-line px-6 pb-28 pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
                Destinations
              </p>
              <h2 className="max-w-2xl font-serif text-4xl md:text-5xl">
                Eight places to begin
              </h2>
            </div>
            <Link
              href="/destinations"
              className="text-sm text-accent transition-colors hover:text-accent-hover"
            >
              Search and filter →
            </Link>
          </div>

          <StackedDestinations destinations={destinations} />
        </div>
      </section>

      <section className="border-t border-line px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl">Ready-made trips</h2>
          <p className="mb-14 mt-4 max-w-xl text-lg text-muted">
            Start from a plan and make it yours.
          </p>
          <ReadyTrips />
        </div>
      </section>

      <section className="border-t border-line px-6 py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 rounded-3xl border border-line bg-surface p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
              Quick planner
            </p>
            <h2 className="font-serif text-4xl md:text-5xl">
              Plan in 30 seconds
            </h2>
            <p className="mt-4 text-lg text-muted">
              Tell us how many days, which month and what you love. We&apos;ll
              match places that are in season and build your days for you.
            </p>
          </div>
          <Link
            href="/plan"
            className="inline-block shrink-0 self-start rounded-full bg-accent px-8 py-4 text-sm font-medium text-bg transition-colors hover:bg-accent-hover md:self-center"
          >
            Plan my trip →
          </Link>
        </div>
      </section>

      <section className="border-t border-line px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <RightNow />
        </div>
      </section>

      <section className="overflow-x-clip border-t border-line px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl">Beyond the views</h2>
          <p className="mb-14 mt-4 max-w-xl text-lg text-muted">
            The Kashmir you taste, touch and remember.
          </p>
          <CultureMarquee />
        </div>
      </section>

      <section id="how-it-works" className="border-t border-line px-6 py-28">
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

      <section className="border-t border-line px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
            FAQ
          </p>
          <h2 className="mb-12 font-serif text-4xl md:text-5xl">Good to know</h2>
          <FaqAccordion items={faq} />
        </div>
      </section>
    </>
  );
}