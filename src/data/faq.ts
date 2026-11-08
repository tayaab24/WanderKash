export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Contains facts that can change (transport, SIM rules, permits, roads): verify before publishing */
  needsReview: boolean;
};

const CHECK = "Check current rules before travelling.";

export const faq: FaqItem[] = [
  {
    id: "best-time",
    question: "What's the best time to visit Kashmir?",
    answer:
      "It depends on what you want. April to October suits lakes, gardens and meadows, with spring blossoms early on and green valleys through summer. December to February is the season for snow and skiing in Gulmarg, though some higher roads close. Each destination page shows its best months, and the planner checks your travel month for you.",
    needsReview: true,
  },
  {
    id: "getting-there",
    question: "How do I get to Srinagar?",
    answer: `Most visitors fly into Srinagar's airport, which has direct flights from several major Indian cities. You can also travel overland from Jammu by road, and rail links into the valley have been expanding, so check the latest routes. The mountain highway can close for a while after heavy snow or landslides, so leave some slack in your plans. ${CHECK}`,
    needsReview: true,
  },
  {
    id: "how-many-days",
    question: "How many days do I need?",
    answer:
      "Five to seven days covers Srinagar and two or three of the classic valleys at a relaxed pace. With three or four days, pick Srinagar plus one valley such as Gulmarg or Pahalgam. Remote places like Gurez need extra travel time on top.",
    needsReview: false,
  },
  {
    id: "sim",
    question: "Will my mobile SIM work in Kashmir?",
    answer: `Not always. Postpaid connections from elsewhere in India usually work, but prepaid SIMs issued outside Jammu and Kashmir often do not. International roaming can also be limited. If you need a local prepaid SIM, expect to show ID and complete verification, which can take a little time. ${CHECK}`,
    needsReview: true,
  },
  {
    id: "permits",
    question: "Do I need any permits for places like Gurez?",
    answer: `Gurez lies close to the Line of Control, so access rules can be stricter than in the main valleys. Carry original photo ID and expect to register at checkpoints. Foreign nationals may need special permission or may be restricted. Rules change with the security situation and the season, so ask your hotel or the local tourism office before you set off. ${CHECK}`,
    needsReview: true,
  },
  {
    id: "packing",
    question: "What should I pack?",
    answer:
      "Layers, even in summer, because mornings and evenings get cool, especially at altitude. In winter bring proper thermals, a warm jacket and waterproof boots. Add sunscreen and sunglasses for the high meadows, modest clothing for shrines and mosques, and some cash, since card payments and ATMs can be scarce in remote valleys.",
    needsReview: true,
  },
  {
    id: "costs",
    question: "Are the costs on this site real?",
    answer:
      "No. They are sample estimates to help you compare destinations and size a budget, not live prices or quotes. Real costs vary with the season, the type of stay and how you travel, so confirm prices with hotels and operators when you book.",
    needsReview: false,
  },
];
