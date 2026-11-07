import data from "@/data/destinations.json";

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const TAGS = ["Lakes", "Meadows", "Adventure", "Culture", "Offbeat"];

export type Destination = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  description: string;
  bestSeason: string;
  highlights: string[];
  costPerDay: { stay: number; food: number; transport: number };
  months: number[]; // 1 to 12, the months it is at its best
  tags: string[];
};

// Matches the "bestSeason" text in destinations.json
const meta: Record<string, { months: number[]; tags: string[] }> = {
  "dal-lake": { months: [4, 5, 6, 7, 8, 9, 10], tags: ["Lakes", "Culture"] },
  gulmarg: { months: [12, 1, 2, 3, 6, 7, 8], tags: ["Adventure", "Meadows"] },
  pahalgam: { months: [4, 5, 6, 7, 8, 9, 10], tags: ["Meadows", "Adventure"] },
  sonamarg: { months: [5, 6, 7, 8, 9, 10], tags: ["Adventure", "Meadows"] },
  gurez: { months: [6, 7, 8, 9], tags: ["Offbeat", "Culture"] },
  yusmarg: { months: [4, 5, 6, 7, 8, 9, 10], tags: ["Meadows", "Offbeat"] },
  doodhpathri: { months: [4, 5, 6, 7, 8, 9, 10], tags: ["Meadows", "Offbeat"] },
  "mughal-gardens": { months: [4, 5, 6, 7, 8, 9, 10], tags: ["Culture"] },
};

const destinations: Destination[] = (
  data as Omit<Destination, "months" | "tags">[]
).map((d) => ({ ...d, ...(meta[d.id] ?? { months: [], tags: [] }) }));

export const getAll = () => destinations;

export const getById = (id: string) => destinations.find((d) => d.id === id);

export const dayCost = (d: Destination) =>
  d.costPerDay.stay + d.costPerDay.food + d.costPerDay.transport;

export type SeasonStatus = "good" | "shoulder" | "off";

export function seasonStatus(d: Destination, month: number): SeasonStatus {
  if (d.months.length === 0 || d.months.includes(month)) return "good";
  const prev = month === 1 ? 12 : month - 1;
  const next = month === 12 ? 1 : month + 1;
  if (d.months.includes(prev) || d.months.includes(next)) return "shoulder";
  return "off";
}