import data from "@/data/destinations.json";

export type Destination = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  description: string;
  bestSeason: string;
  highlights: string[];
  costPerDay: { stay: number; food: number; transport: number };
};

const destinations = data as Destination[];

export const getAll = () => destinations;

export const getById = (id: string) => destinations.find((d) => d.id === id);

export const dayCost = (d: Destination) =>
  d.costPerDay.stay + d.costPerDay.food + d.costPerDay.transport;