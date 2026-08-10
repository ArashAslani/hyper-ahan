"use client";

import { useEffect } from "react";
import { catalogRecent } from "@/lib/catalogRecent";

type TrackCategoryVisitProps = {
  id: string;
  name: string;
};

/** Records category visits for the Catalog "Recently used" strip. */
export function TrackCategoryVisit({ id, name }: TrackCategoryVisitProps) {
  useEffect(() => {
    catalogRecent.pushCategory({ id, name });
  }, [id, name]);

  return null;
}
