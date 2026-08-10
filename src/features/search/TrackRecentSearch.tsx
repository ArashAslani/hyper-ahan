"use client";

import { useEffect } from "react";
import { catalogRecent } from "@/lib/catalogRecent";

/** Records a committed SRP query into Recent Searches. */
export function TrackRecentSearch({ q }: { q: string }) {
  useEffect(() => {
    catalogRecent.pushSearch(q);
  }, [q]);
  return null;
}
