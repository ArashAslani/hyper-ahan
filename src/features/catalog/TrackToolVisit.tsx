"use client";

import { useEffect } from "react";
import { catalogRecent } from "@/lib/catalogRecent";

type TrackToolVisitProps = {
  slug: string;
  title: string;
};

export function TrackToolVisit({ slug, title }: TrackToolVisitProps) {
  useEffect(() => {
    catalogRecent.pushTool({ slug, title });
  }, [slug, title]);

  return null;
}
