export type SampleTrip = {
  id: string;
  title: string;
  tagline: string;
  /** One entry per day, each listing that day's stop ids */
  days: string[][];
  /** 1 to 12 */
  suggestedMonth: number;
  cover: string;
};

export const sampleTrips: SampleTrip[] = [
  {
    id: "classic-srinagar-gulmarg",
    title: "Classic Srinagar & Gulmarg",
    tagline: "Lake mornings, Mughal terraces and a gondola into the clouds.",
    days: [["dal-lake"], ["mughal-gardens"], ["gulmarg"]],
    suggestedMonth: 6, // all three are in season in June
    cover: "/images/gulmarg.jpg",
  },
  {
    id: "meadows-of-kashmir",
    title: "Meadows of Kashmir",
    tagline: "Five days of open valleys, pine forest and glacier streams.",
    days: [
      ["dal-lake"],
      ["pahalgam"],
      ["sonamarg"],
      ["doodhpathri"],
      ["yusmarg"],
    ],
    suggestedMonth: 7, // all five are in season in July
    cover: "/images/pahalgam.jpg",
  },
  {
    id: "winter-snow-escape",
    title: "Winter Snow Escape",
    tagline: "Fresh powder in Gulmarg and quiet, frosted valleys.",
    days: [["dal-lake"], ["gulmarg"], ["pahalgam"]],
    suggestedMonth: 1,
    cover: "/images/sonamarg.jpg",
  },
  {
    id: "offbeat-kashmir",
    title: "Offbeat Kashmir",
    tagline: "Wooden villages and meadows far from the crowds.",
    days: [["dal-lake"], ["gurez"], ["yusmarg"], ["doodhpathri"]],
    suggestedMonth: 6,
    cover: "/images/gurez.jpg",
  },
];
