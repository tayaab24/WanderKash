"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const getYear = () => new Date().getFullYear();
// Static fallback for the server render and hydration; the real year swaps in on the client
const getServerYear = () => 2026;

export default function CurrentYear() {
  return <>{useSyncExternalStore(noop, getYear, getServerYear)}</>;
}
