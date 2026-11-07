import { getById } from "@/lib/destinations";
import type { Trip } from "@/context/TripContext";

type Key = "stay" | "food" | "transport" | "total";

export function computeBudget(trip: Trip) {
  const perDay = trip.days.map((d) => {
    let stay = 0;
    let food = 0;
    let transport = 0;
    for (const id of d.stops) {
      const dest = getById(id);
      if (!dest) continue;
      stay += dest.costPerDay.stay;
      food += dest.costPerDay.food;
      transport += dest.costPerDay.transport;
    }
    return {
      day: d.day,
      stops: d.stops.length,
      stay,
      food,
      transport,
      total: stay + food + transport,
    };
  });

  const sum = (key: Key) => perDay.reduce((acc, d) => acc + d[key], 0);

  const perPerson = {
    stay: sum("stay"),
    food: sum("food"),
    transport: sum("transport"),
  };
  const perPersonTotal = sum("total");
  const travelers = trip.travelers;

  return {
    perDay, // per person, per day
    perPerson, // per person, whole trip, by category
    perPersonTotal,
    travelers,
    grandTotal: perPersonTotal * travelers,
  };
}