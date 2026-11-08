import {
  getAll,
  seasonStatus,
  type Destination,
  type SeasonStatus,
} from "@/lib/destinations";

export type PlanInput = {
  days: number; // how many days (one stop per day)
  month: number; // 1 to 12
  vibes: string[]; // tags the traveller picked
};

export type PlanStop = {
  destination: Destination;
  status: SeasonStatus;
  score: number;
};

const SEASON_SCORE: Record<SeasonStatus, number> = {
  good: 3,
  shoulder: 1,
  off: -5,
};
const TAG_SCORE = 2;
const ARRIVAL_ID = "dal-lake"; // everyone arrives in Srinagar

/** Season score plus 2 for each tag that matches the traveller's vibes. */
export function scoreDestination(
  d: Destination,
  month: number,
  vibes: string[]
) {
  const status = seasonStatus(d, month);
  const tagMatches = d.tags.filter((t) => vibes.includes(t)).length;
  return { status, score: SEASON_SCORE[status] + tagMatches * TAG_SCORE };
}

/**
 * Builds a one-stop-per-day plan.
 *
 * 1. Score and rank every destination (best first; name breaks ties).
 * 2. Take in-season matches first (not off-season, at least one vibe tag),
 *    then the best remaining in-season places, then anything left.
 * 3. Day 1 is Dal Lake whenever it isn't off-season.
 * 4. Destinations only repeat when there are more days than places.
 */
export function generatePlan(
  { days, month, vibes }: PlanInput,
  destinations: Destination[] = getAll()
): PlanStop[] {
  const ranked: PlanStop[] = destinations
    .map((d) => ({ destination: d, ...scoreDestination(d, month, vibes) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.destination.name.localeCompare(b.destination.name)
    );

  const matchesVibe = (s: PlanStop) =>
    s.destination.tags.some((t) => vibes.includes(t));
  const inSeason = (s: PlanStop) => s.status !== "off";

  // Preference order: in-season vibe matches, other in-season, off-season
  const ordered = [
    ...ranked.filter((s) => inSeason(s) && matchesVibe(s)),
    ...ranked.filter((s) => inSeason(s) && !matchesVibe(s)),
    ...ranked.filter((s) => !inSeason(s)),
  ];

  // Arrival day in Srinagar, unless Dal Lake is off-season
  const arrival = ordered.find((s) => s.destination.id === ARRIVAL_ID);
  const pool =
    arrival && arrival.status !== "off"
      ? [arrival, ...ordered.filter((s) => s !== arrival)]
      : ordered;

  // Only repeats (cycling through the pool) if days exceed the number of places
  return Array.from({ length: days }, (_, i) => pool[i % pool.length]);
}
