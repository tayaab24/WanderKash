import { getAll, getById, seasonStatus, type SeasonStatus } from "@/lib/destinations";

/** Inline text: plain string or a link. */
export type Inline = string | { text: string; href: string };

/** A block of an answer: a paragraph, or a titled list of items. */
export type Block =
  | { type: "p"; parts: Inline[] }
  | { type: "list"; title: string; items: Inline[][] };

export type FaqItem = {
  id: string;
  question: string;
  answer: Block[];
  /** Contains facts that can change (transport, drive times, roads): verify before publishing */
  needsReview: boolean;
};

const CHECK = "Check current rules before travelling.";

const p = (...parts: Inline[]): Block => ({ type: "p", parts });

/** Link to a destination page, using its display name. */
const dest = (id: string): Inline => ({
  text: getById(id)?.name ?? id,
  href: `/destination/${id}`,
});

/** Plain-text version of an answer (used for the FAQPage JSON-LD). */
export function answerToText(blocks: Block[]): string {
  const inline = (parts: Inline[]) =>
    parts.map((x) => (typeof x === "string" ? x : x.text)).join("");
  return blocks
    .map((b) =>
      b.type === "p"
        ? inline(b.parts)
        : `${b.title}: ${b.items.map(inline).join("; ")}.`
    )
    .join(" ");
}

// ---------------------------------------------------------------------------
// Day trips from Srinagar. Approximate one-way drive times: verify before publishing.
// ---------------------------------------------------------------------------
const dayTrips: Block[] = [
  p(
    "Yes, mostly. Most travellers base themselves in Srinagar, on a houseboat or in a hotel, and head out on day trips, coming back each evening. A couple of places are far enough that an overnight stay makes the day far more enjoyable. Drive times below are approximate and one way; roads, traffic and weather can stretch them."
  ),
  {
    type: "list",
    title: "Easy day trips from Srinagar",
    items: [
      [dest("dal-lake"), " and ", dest("mughal-gardens"), ": in Srinagar itself, a short drive across the city"],
      [dest("doodhpathri"), ": about 1.5 to 2 hours"],
      [dest("yusmarg"), ": about 1.5 to 2 hours"],
      [dest("gulmarg"), ": about 2 hours"],
    ],
  },
  {
    type: "list",
    title: "Long day trip, start early",
    items: [
      [dest("sonamarg"), ": about 2.5 to 3 hours"],
      [dest("pahalgam"), ": about 2.5 to 3 hours, and lovely for a night if you have time"],
    ],
  },
  {
    type: "list",
    title: "Better with an overnight stay",
    items: [[dest("gurez"), ": about 5 to 6 hours over a high mountain pass"]],
  },
  p(
    "Tip: ",
    { text: "Let the planner build your days", href: "/plan" },
    ", then fine-tune the order in ",
    { text: "your itinerary", href: "/itinerary" },
    "."
  ),
];

// ---------------------------------------------------------------------------
// Winter: computed from each destination's best months (never hardcoded).
// A place counts as its best status across December, January and February.
// ---------------------------------------------------------------------------
const WINTER_MONTHS = [12, 1, 2];
const RANK: Record<SeasonStatus, number> = { good: 2, shoulder: 1, off: 0 };

function winterStatus(id: string): SeasonStatus {
  const d = getById(id)!;
  return WINTER_MONTHS.map((m) => seasonStatus(d, m)).reduce((best, s) =>
    RANK[s] > RANK[best] ? s : best
  );
}

function winterAnswer(): Block[] {
  const groups: { title: string; status: SeasonStatus }[] = [
    { title: "Great in winter", status: "good" },
    { title: "Possible, but check conditions", status: "shoulder" },
    { title: "Best avoided in winter", status: "off" },
  ];
  const all = getAll();
  const lists: Block[] = groups
    .map(({ title, status }) => ({
      type: "list" as const,
      title,
      items: all.filter((d) => winterStatus(d.id) === status).map((d) => [dest(d.id)]),
    }))
    .filter((g) => g.items.length > 0); // skip empty groups

  return [
    p("Here is how our destinations line up for December to February, based on each one's best months:"),
    ...lists,
    p(
      "Heavy snow can close high mountain roads in winter, so check the road status before you set off."
    ),
    p({ text: "Browse destinations for January", href: "/destinations?month=1" }, " to see season badges for a winter trip."),
  ];
}

export const faq: FaqItem[] = [
  {
    id: "best-time",
    question: "What's the best time to visit Kashmir?",
    answer: [
      p(
        "It depends on what you want. April to October suits lakes, gardens and meadows, with spring blossoms early on and green valleys through summer. December to February is the season for snow and skiing in Gulmarg, though some higher roads close. Each destination page shows its best months, and the planner checks your travel month for you."
      ),
    ],
    needsReview: true,
  },
  {
    id: "getting-there",
    question: "How do I get to Srinagar?",
    answer: [
      p(
        `Most visitors fly into Srinagar's airport, which has direct flights from several major Indian cities. You can also travel overland from Jammu by road, and rail links into the valley have been expanding, so check the latest routes. The mountain highway can close for a while after heavy snow or landslides, so leave some slack in your plans. ${CHECK}`
      ),
    ],
    needsReview: true,
  },
  {
    id: "how-many-days",
    question: "How many days do I need?",
    answer: [
      p(
        "Five to seven days covers Srinagar and two or three of the classic valleys at a relaxed pace. With three or four days, pick Srinagar plus one valley such as Gulmarg or Pahalgam. Remote places like Gurez need extra travel time on top."
      ),
    ],
    needsReview: false,
  },
  {
    id: "day-trips",
    question: "Can I visit these places as day trips from Srinagar?",
    answer: dayTrips,
    needsReview: true,
  },
  {
    id: "winter",
    question: "Which places can I visit in winter?",
    answer: winterAnswer(),
    needsReview: false,
  },
  {
    id: "packing",
    question: "What should I pack?",
    answer: [
      p(
        "Layers, even in summer, because mornings and evenings get cool, especially at altitude. In winter bring proper thermals, a warm jacket and waterproof boots. Add sunscreen and sunglasses for the high meadows, modest clothing for shrines and mosques, and some cash, since card payments and ATMs can be scarce in remote valleys."
      ),
    ],
    needsReview: true,
  },
  {
    id: "costs",
    question: "Are the costs on this site real?",
    answer: [
      p(
        "No. They are sample estimates to help you compare destinations and size a budget, not live prices or quotes. Real costs vary with the season, the type of stay and how you travel, so confirm prices with hotels and operators when you book."
      ),
    ],
    needsReview: false,
  },
];
