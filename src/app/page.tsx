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
import AmbientGlow, { type Glow } from "@/components/atmosphere/AmbientGlow";
import ChinarLeaf from "@/components/atmosphere/ChinarLeaf";
import MountainDivider from "@/components/atmosphere/MountainDivider";
import ScrollWarmth from "@/components/atmosphere/ScrollWarmth";
import { answerToText, faq } from "@/data/faq";
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
    acceptedAnswer: { "@type": "Answer", text: answerToText(f.answer) },
  })),
};

/** Standard home section: same rhythm (py-28) and content width everywhere.
 *  tone="surface" gives a soft band that fades in and out (no hard edges). */
function Section({
  id,
  className = "",
  tone = "bg",
  bordered = true,
  glows,
  leaf,
  children,
}: {
  id?: string;
  className?: string;
  tone?: "bg" | "surface";
  bordered?: boolean;
  glows?: Glow[];
  /** Position classes for a decorative chinar leaf in a corner */
  leaf?: string;
  children: ReactNode;
}) {
  const surface = tone === "surface";
  return (
    <section
      id={id}
      className={`relative isolate overflow-x-clip px-6 py-28 ${
        bordered && !surface ? "border-t border-line" : ""
      } ${
        surface
          ? "bg-linear-to-b from-transparent via-surface/60 to-transparent"
          : ""
      } ${className}`}
    >
      {glows && <AmbientGlow glows={glows} />}
      {leaf && (
        <ChinarLeaf
          className={`absolute -z-10 w-56 text-accent/8 md:w-80 ${leaf}`}
        />
      )}
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

      {/* Page-level glow: warm near the top, cooler further down */}
      <ScrollWarmth />

      {/* 1. Hero */}
      <Hero />
      <MountainDivider />

      {/* 2. Intro */}
      <section className="relative isolate overflow-x-clip px-6 pb-28 pt-16">
        <AmbientGlow
          glows={[
            { tone: "warm", className: "-left-[15%] -top-[30%] w-[75vw] max-w-[900px]", duration: 50 },
            { tone: "cool", className: "-right-[20%] top-[10%] w-[60vw] max-w-[760px]", duration: 38 },
          ]}
        />
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
      <Section tone="surface">
        <SectionHeading
          eyebrow="Destinations"
          title="Eight places to begin"
          action={
            <Link
              href="/destinations"
              className="inline-flex min-h-11 items-center text-sm text-accent transition-colors hover:text-accent-hover"
            >
              Search and filter →
            </Link>
          }
        />
        <StackedDestinations destinations={destinations} />
      </Section>

      {/* 5. Ready-made trips */}
      <Section
        glows={[{ tone: "warm", className: "-right-[20%] -top-[10%] w-[70vw] max-w-[860px]", duration: 42 }]}
        leaf="-right-10 top-8 rotate-[18deg] md:right-4"
      >
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
      <Section
        tone="surface"
        glows={[{ tone: "cool", className: "-right-[15%] bottom-0 w-[65vw] max-w-[820px]", duration: 55 }]}
      >
        <RightNow />
      </Section>

      <MountainDivider />

      {/* 8. Beyond the views */}
      <Section
        bordered={false}
        className="pt-12"
        glows={[{ tone: "warm", className: "-left-[20%] top-[5%] w-[70vw] max-w-[880px]", duration: 46 }]}
      >
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
      <Section
        tone="surface"
        glows={[{ tone: "warm", className: "-right-[25%] bottom-[-10%] w-[70vw] max-w-[860px]", duration: 52 }]}
        leaf="-left-14 bottom-6 -rotate-[24deg] md:left-0"
      >
        <SectionHeading eyebrow="FAQ" title="Good to know" />
        <div className="max-w-4xl">
          <FaqAccordion items={faq} />
        </div>
      </Section>

      {/* 11. Closing call to action; ridges rise out of it into the footer */}
      <ClosingCta />
      <MountainDivider className="z-10 -mt-16 md:-mt-28" />
    </>
  );
}
