import type { ReactNode } from "react";

type Experience = { title: string; text: string; icon: ReactNode };

// Simple line icons, drawn with currentColor (set to accent on the card)
const svg = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="h-9 w-9"
  >
    {children}
  </svg>
);

const EXPERIENCES: Experience[] = [
  {
    title: "Shikara ride on Dal Lake",
    text: "Glide across the lake in a cushioned, canopied boat at first light, past floating gardens, vegetable markets and the houseboats of Srinagar.",
    icon: svg(
      <>
        <path d="M2 15c4 2.5 16 2.5 20 0" />
        <path d="M7 14.5V9h10v5.5" />
        <path d="M5.5 9h13L17 6.5H7z" />
        <path d="M3 20c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
      </>
    ),
  },
  {
    title: "Wazwan feast",
    text: "Kashmir's celebratory multi-course meal, slow-cooked by master chefs called wazas and traditionally shared from one copper platter.",
    icon: svg(
      <>
        <path d="M5 15a7 7 0 0 1 14 0" />
        <path d="M12 6V4.5" />
        <path d="M10.5 4.5h3" />
        <path d="M2.5 15h19" />
        <path d="M4.5 15l1.5 3h12l1.5-3" />
      </>
    ),
  },
  {
    title: "Kahwa and Noon Chai",
    text: "Fragrant kahwa brewed with saffron, cardamom and almonds, and noon chai, the rosy, salted tea Kashmiris drink with fresh bread.",
    icon: svg(
      <>
        <path d="M5 10h11v3.5a5.5 5.5 0 0 1-5.5 5.5A5.5 5.5 0 0 1 5 13.5z" />
        <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
        <path d="M8.5 3c-.8 1.3.8 2.2 0 3.5" />
        <path d="M12 3c-.8 1.3.8 2.2 0 3.5" />
        <path d="M4 21h13" />
      </>
    ),
  },
  {
    title: "Papier-mâché craft",
    text: "Paper pulp shaped into boxes and vases, then hand-painted with chinar leaves and flowers in the workshops of old Srinagar.",
    icon: svg(
      <>
        <path d="M9.5 3h5" />
        <path d="M10.5 3v2.5C7.5 7 6 9.5 6 13c0 4.2 2.7 8 6 8s6-3.8 6-8c0-3.5-1.5-6-4.5-7.5V3" />
        <path d="M12 10c-1.5 1.5-1.5 3.5 0 5 1.5-1.5 1.5-3.5 0-5z" />
        <path d="M8.5 15.5c1 .8 2.2 1 3.5.5" />
        <path d="M15.5 15.5c-1 .8-2.2 1-3.5.5" />
      </>
    ),
  },
  {
    title: "Pashmina weaving",
    text: "Feather-light shawls hand-spun and woven from fine Himalayan goat wool, a craft passed down through generations of Kashmiri families.",
    icon: svg(
      <>
        <path d="M6 4h12" />
        <path d="M6 20h12" />
        <path d="M8 4v16" />
        <path d="M16 4v16" />
        <path d="M8 8l8 3" />
        <path d="M8 11l8 3" />
        <path d="M8 14l8 3" />
      </>
    ),
  },
  {
    title: "Staying on a houseboat",
    text: "Sleep aboard a carved cedar houseboat moored on the lake, with tea on the deck and a shikara at the steps. A Srinagar tradition for over a century.",
    icon: svg(
      <>
        <path d="M2 15.5h20l-2 3.5H4z" />
        <path d="M4.5 15.5V10l7.5-4.5 7.5 4.5v5.5" />
        <path d="M10 15.5V12h4v3.5" />
        <path d="M7 12h1M16 12h1" />
      </>
    ),
  },
];

function Card({ e }: { e: Experience }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7">
      <span className="text-accent">{e.icon}</span>
      <h3 className="mt-6 font-display text-2xl leading-tight">{e.title}</h3>
      <p className="mt-3 text-base leading-relaxed text-muted">{e.text}</p>
    </article>
  );
}

/**
 * Layout is chosen with CSS only, so there's nothing to hydrate:
 * - mobile: swipeable row with snap points
 * - desktop: continuous marquee, paused on hover
 * - desktop + reduced motion: static grid
 */
export default function CultureMarquee() {
  return (
    <>
      {/* Mobile: swipe with snap */}
      <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:hidden">
        {EXPERIENCES.map((e) => (
          <li key={e.title} className="w-[80%] max-w-80 shrink-0 snap-start">
            <Card e={e} />
          </li>
        ))}
      </ul>

      {/* Desktop: marquee (two identical tracks for a seamless loop) */}
      <div className="hidden overflow-hidden mask-x-from-90% mask-x-to-100% md:motion-safe:block">
        <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex"
              aria-hidden={copy === 1 || undefined}
              inert={copy === 1 || undefined}
            >
              {EXPERIENCES.map((e) => (
                <li key={e.title} className="w-80 shrink-0 pr-6">
                  <Card e={e} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Desktop + reduced motion: static grid */}
      <ul className="hidden gap-6 md:motion-reduce:grid md:grid-cols-2 lg:grid-cols-3">
        {EXPERIENCES.map((e) => (
          <li key={e.title}>
            <Card e={e} />
          </li>
        ))}
      </ul>
    </>
  );
}
