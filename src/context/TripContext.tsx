"use client";

import type { SampleTrip } from "@/data/sampleTrips";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

export type Day = { day: number; stops: string[] };
export type Trip = { travelers: number; days: Day[]; month: number | null };

const KEY = "wanderkash-trip";
const MAX_DAYS = 10;

const emptyTrip: Trip = {
  travelers: 2,
  days: [{ day: 1, stops: [] }],
  month: null,
};

type State = { trip: Trip; ready: boolean };

type Action =
  | { type: "hydrate"; trip: Trip }
  | { type: "add"; id: string; day?: number }
  | { type: "remove"; id: string }
  | { type: "move"; id: string; to: number }
  | { type: "addDay" }
  | { type: "removeDay"; day: number }
  | { type: "travelers"; n: number }
  | { type: "month"; m: number | null }
  | { type: "load"; days: string[][]; month: number }
  | { type: "clear" };

const renumber = (days: Day[]): Day[] =>
  days.map((d, i) => ({ ...d, day: i + 1 }));

const without = (days: Day[], id: string): Day[] =>
  days.map((d) => ({ ...d, stops: d.stops.filter((s) => s !== id) }));

const put = (days: Day[], id: string, dayNumber?: number): Day[] => {
  const target = dayNumber && dayNumber <= days.length ? dayNumber : 1;
  return days.map((d) =>
    d.day === target ? { ...d, stops: [...d.stops, id] } : d
  );
};

function reducer(state: State, action: Action): State {
  const { trip } = state;

  switch (action.type) {
    case "hydrate":
      return { trip: action.trip, ready: true };

    case "add": {
      if (trip.days.some((d) => d.stops.includes(action.id))) return state;
      return {
        ...state,
        trip: { ...trip, days: put(trip.days, action.id, action.day) },
      };
    }

    case "remove":
      return { ...state, trip: { ...trip, days: without(trip.days, action.id) } };

    case "move":
      return {
        ...state,
        trip: {
          ...trip,
          days: put(without(trip.days, action.id), action.id, action.to),
        },
      };

    case "addDay":
      if (trip.days.length >= MAX_DAYS) return state;
      return {
        ...state,
        trip: {
          ...trip,
          days: [...trip.days, { day: trip.days.length + 1, stops: [] }],
        },
      };

    case "removeDay": {
      if (trip.days.length <= 1) return state;
      const removed = trip.days.find((d) => d.day === action.day);
      let days = trip.days.filter((d) => d.day !== action.day);
      // keep the removed day's stops by moving them to the first day
      if (removed && removed.stops.length > 0) {
        days = days.map((d, i) =>
          i === 0 ? { ...d, stops: [...d.stops, ...removed.stops] } : d
        );
      }
      return { ...state, trip: { ...trip, days: renumber(days) } };
    }

    case "travelers":
      return {
        ...state,
        trip: { ...trip, travelers: Math.min(10, Math.max(1, action.n)) },
      };

    case "month":
      return { ...state, trip: { ...trip, month: action.m } };

    case "load":
      // Replace days and month; keep the traveller count
      return {
        ...state,
        trip: {
          ...trip,
          month: action.month,
          days: action.days
            .slice(0, MAX_DAYS)
            .map((stops, i) => ({ day: i + 1, stops: [...stops] })),
        },
      };

    case "clear":
      return { ...state, trip: emptyTrip };

    default:
      return state;
  }
}

function readSavedTrip(): Trip {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyTrip;
    const parsed = JSON.parse(raw);

    const travelers =
      typeof parsed.travelers === "number"
        ? Math.min(10, Math.max(1, parsed.travelers))
        : 2;

    const month =
      Number.isInteger(parsed.month) && parsed.month >= 1 && parsed.month <= 12
        ? parsed.month
        : null;

    if (!Array.isArray(parsed.days) || parsed.days.length === 0) {
      return { travelers, days: emptyTrip.days, month };
    }

    const days: Day[] = parsed.days
      .slice(0, MAX_DAYS)
      .map((d: { stops?: unknown }, i: number) => ({
        day: i + 1,
        stops: Array.isArray(d.stops)
          ? d.stops.filter((s): s is string => typeof s === "string")
          : [],
      }));

    return { travelers, days, month };
  } catch {
    return emptyTrip;
  }
}

type TripContextValue = {
  trip: Trip;
  ready: boolean;
  totalStops: number;
  isInTrip: (id: string) => boolean;
  addStop: (id: string, day?: number) => void;
  removeStop: (id: string) => void;
  moveStop: (id: string, toDay: number) => void;
  addDay: () => void;
  removeDay: (day: number) => void;
  setTravelers: (n: number) => void;
  setMonth: (m: number | null) => void;
  clearTrip: () => void;
  /** Replaces the current trip; asks first if it has stops. Returns false if cancelled. */
  loadTrip: (trip: Pick<SampleTrip, "days" | "suggestedMonth">) => boolean;
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    trip: emptyTrip,
    ready: false,
  });

  // Load the saved trip after the page mounts
  useEffect(() => {
    dispatch({ type: "hydrate", trip: readSavedTrip() });
  }, []);

  // Save whenever the trip changes (only after the first load)
  useEffect(() => {
    if (!state.ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state.trip));
    } catch {
      // storage full or blocked: ignore
    }
  }, [state.trip, state.ready]);

  const value = useMemo<TripContextValue>(() => {
    const ids = state.trip.days.flatMap((d) => d.stops);
    return {
      trip: state.trip,
      ready: state.ready,
      totalStops: ids.length,
      isInTrip: (id) => ids.includes(id),
      addStop: (id, day) => dispatch({ type: "add", id, day }),
      removeStop: (id) => dispatch({ type: "remove", id }),
      moveStop: (id, to) => dispatch({ type: "move", id, to }),
      addDay: () => dispatch({ type: "addDay" }),
      removeDay: (day) => dispatch({ type: "removeDay", day }),
      setTravelers: (n) => dispatch({ type: "travelers", n }),
      setMonth: (m) => dispatch({ type: "month", m }),
      clearTrip: () => dispatch({ type: "clear" }),
      loadTrip: (t) => {
        if (
          ids.length > 0 &&
          !window.confirm("This will replace your current trip. Continue?")
        ) {
          return false;
        }
        dispatch({ type: "load", days: t.days, month: t.suggestedMonth });
        return true;
      },
    };
  }, [state]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside <TripProvider>");
  return ctx;
}