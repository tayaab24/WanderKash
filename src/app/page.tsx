import type { ReactNode } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import StackedDestinations from "@/components/StackedDestinations";
import Seasons from "@/components/Seasons";
import ReadyTrips from "@/components/ReadyTrips";
import RightNow from "@/components/RightNow";
import CultureMarquee from "@/components/CultureMarquee";
import FaqAccordion from "@/components/FaqAccordion";
import ClosingCta from "@/components/ClosingCta";
import SectionHeading from "@/components/SectionHeading";
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

/** Standard home section: same rhythm (py-28), divider and content width everywhere. */
function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`border-t border-line px-6 py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

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

      {/* 1. Hero */}
      <Hero />

      {/* 2. Intro */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-3xl leading-snug text-fg md:text-4xl">
            From the still water of Dal Lake to the high meadows of Gulmarg,
            build a trip that fits your days and your budget.
          </p>
        </div>
      </section>

      {/* 3. Seasons (pinned on desktop) */}
      <Seasons />

      {/* 4. Stacked destinations */}
      <Section>
        <SectionHeading
          eyebrow="Destinations"
          title="Eight places to begin"
          action={
            <Link
              href="/destinations"
              className="text-sm text-accent transition-colors hover:text-accent-hover"
            >
              Search and filter →
            </Link>
          }
        />
        <StackedDestinations destinations={destinations} />
      </Section>

      {/* 5. Ready-made trips */}
      <Section>
        <SectionHeading
          eyebrow="Itineraries"
          title="Ready-made trips"
          subline="Start from a plan and make it yours."
        />
        <ReadyTrips />
      </Section>

      {/* 6. Quick planner pitch */}
      <Section>
        <div className="flex flex-col gap-10 rounded-3xl border border-line bg-surface p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <SectionHeading
            className=""
            eyebrow="Quick planner"
            title="Plan in 30 seconds"
            subline="Tell us how many days, which month and what you love. We'll match places that are in season and build your days for you."
          />
          <Link
            href="/plan"
            className="inline-block shrink-0 self-start rounded-full bg-accent px-8 py-4 text-sm font-medium text-bg transition-colors hover:bg-accent-hover md:self-center"
          >
            Plan my trip →
          </Link>
        </div>
      </Section>

      {/* 7. Right now in Kashmir */}
      <Section>
        <RightNow />
      </Section>

      {/* 8. Beyond the views */}
      <Section className="overflow-x-clip">
        <SectionHeading
          eyebrow="Culture"
          title="Beyond the views"
          subline="The Kashmir you taste, touch and remember."
        />
        <CultureMarquee />
      </Section>

      {/* 9. How it works */}
      <Section id="how-it-works">
        <SectionHeading eyebrow="How it works" title="Three steps to a plan" />
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
      </Section>

      {/* 10. FAQ */}
      <Section>
        <SectionHeading eyebrow="FAQ" title="Good to know" />
        <div className="max-w-4xl">
          <FaqAccordion items={faq} />
        </div>
      </Section>

      {/* 11. Closing call to action (footer follows from the layout) */}
      <ClosingCta />
    </>
  );
}
