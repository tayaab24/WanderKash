import type { Metadata } from "next";
import ItineraryView from "@/components/ItineraryView";

export const metadata: Metadata = {
  title: "My Itinerary | WanderKash",
  description: "Plan your Kashmir trip day by day and see your budget.",
};

export default function ItineraryPage() {
  return <ItineraryView />;
}