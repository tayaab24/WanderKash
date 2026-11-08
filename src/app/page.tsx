import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { btn } from "@/lib/ui";
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
 *  tone: "bg" / "surface" (light, alternate between neighbours) or "deep" (dark band). */
function Section({
  id,
  className = "",
  tone = "bg",
  glows,
  leaf,
  skip = false,
  children,
}: {
  id?: string;
  className?: string;
  tone?: "bg" | "surface" | "deep";
  /** Soft amber glows: light sections only */
  glows?: Glow[];
  /** Position classes for a decorative chinar leaf in a corner */
  leaf?: string;
  /** content-visibility: auto, for heavy sections below the fold */
  skip?: boolean;
  children: ReactNode;
}) {
  const toneClass = { bg: "bg-bg", surface: "bg-surface", deep: "on-dark bg-deep" }[tone];
  return (
    <section
      id={id}
      className={`relative isolate overflow-x-clip px-6 py-28 ${toneClass} ${skip ? "offscreen-skip" : ""} ${className}`}
    >
      {glows && tone !== "deep" && <AmbientGlow glows={glows} />}
      {leaf && (
        <ChinarLeaf
          className={`absolute -z-10 w-56 text-accent-text/10 md:w-80 ${leaf}`}
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

      {/* 1. Hero (photo); on larger screens cream ridges rise out of it into the page */}
      <Hero />
      <MountainDivider to="bg" className="z-10 hidden md:block md:-mt-28" />

      {/* 2. Intro (light: bg) */}
      <section className="relative isolate overflow-x-clip bg-bg px-6 pb-28 pt-16">
        <AmbientGlow
          glows={[
            { tone: "warm", className: "-left-[15%] -top-[30%] w-[75vw] max-w-[900px]", duration: 50 },
            { tone: "cool", className: "-right-[20%] top-[10%] w-[60vw] max-w-[760px]", duration: 38 },
          ]}
        />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-2xl font-medium leading-snug tracking-[-0.01em] text-fg md:text-4xl">
            From the still water of Dal Lake to the high meadows of Gulmarg,
            build a trip that fits your days and your budget.
          </p>
        </div>
      </section>

      {/* 3. Seasons (light: surface; pinned on desktop) */}
      {/* Suspense boundaries let React hydrate each section separately (shorter main-thread tasks) */}
      <Suspense fallback={null}>
        <Seasons />
      </Suspense>

      {/* 4. Stacked destinations (light: bg) */}
      <Section tone="bg">
        <SectionHeading
          eyebrow="Destinations"
          title="Eight places to begin"
          action={
            <Link
              href="/destinations"
              className="inline-flex min-h-11 items-center text-sm font-medium text-accent-text transition-colors hover:underline"
            >
              Search and filter →
            </Link>
          }
        />
        <Suspense fallback={null}>
          <StackedDestinations destinations={destinations} />
        </Suspense>
      </Section>

      {/* 5. Ready-made trips (dark band) */}
      <MountainDivider from="bg" to="deep" />
      <Section tone="deep" skip className="pt-12" leaf="-right-10 top-8 rotate-[18deg] md:right-4">
        <SectionHeading
          eyebrow="Itineraries"
          title="Ready-made trips"
          subline="Start from a plan and make it yours."
        />
        <Suspense fallback={null}>
          <ReadyTrips />
        </Suspense>
      </Section>
      <MountainDivider from="deep" to="surface" />

      {/* 6. Quick planner pitch (light: surface) */}
      <Section tone="surface" skip className="pt-12">
        <div className="flex flex-col gap-10 rounded-3xl border border-line bg-bg p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <SectionHeading
            className=""
            eyebrow="Quick planner"
            title={
              <>
                {/* Numbers stay in Archivo (Cinzel is for words only) */}
                Plan in <span className="font-sans font-semibold tabular-nums">30</span>{" "}
                seconds
              </>
            }
            subline="Tell us how many days, which month and what you love. We'll match places that are in season and build your days for you."
          />
          <Link
            href="/plan"
            className={`shrink-0 self-start md:self-center ${btn.primary}`}
          >
            Plan my trip →
          </Link>
        </div>
      </Section>

      {/* 7. Right now in Kashmir (light: bg) */}
      <Section
        tone="bg"
        skip
        glows={[{ tone: "warm", className: "-right-[15%] bottom-0 w-[65vw] max-w-[820px]", duration: 55 }]}
      >
        <Suspense fallback={null}>
          <RightNow />
        </Suspense>
      </Section>

      {/* 8. Beyond the views (dark band) */}
      <MountainDivider from="bg" to="deep" />
      <Section tone="deep" skip className="pt-12">
        <SectionHeading
          eyebrow="Culture"
          title="Beyond the views"
          subline="The Kashmir you taste, touch and remember."
        />
        <CultureMarquee />
      </Section>
      <MountainDivider from="deep" to="bg" />

      {/* 9. How it works (light: bg) */}
      <Section id="how-it-works" tone="bg" skip className="pt-12">
        <SectionHeading eyebrow="How it works" title="Three steps to a plan" />
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-line bg-surface p-8"
            >
              <span className="text-4xl font-bold leading-[1.1] tabular-nums text-accent-text">{s.n}</span>
              <h3 className="mt-6 text-2xl font-semibold leading-[1.2] tracking-[-0.01em]">{s.title}</h3>
              <p className="mt-3 text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 10. FAQ (light: surface) */}
      <Section
        tone="surface"
        skip
        glows={[{ tone: "warm", className: "-right-[25%] bottom-[-10%] w-[70vw] max-w-[860px]", duration: 52 }]}
        leaf="-left-14 bottom-6 -rotate-[24deg] md:left-0"
      >
        <SectionHeading eyebrow="FAQ" title="Good to know" />
        <div className="max-w-4xl">
          <Suspense fallback={null}>
            <FaqAccordion items={faq} />
          </Suspense>
        </div>
      </Section>

      {/* 11. Closing call to action (photo); the footer's own ridge rises out of it */}
      <Suspense fallback={null}>
        <ClosingCta />
      </Suspense>
    </>
  );
}
