"use client";

import { useEffect } from "react";
import { consumeCatalogNavigationOwnership } from "@/lib/catalogNavigationContext";

/** Catalog root is never an owned PLP predecessor; drop leftover same-tab ownership. */
export function DiscardCatalogNavigationOwnership() {
  useEffect(() => {
    consumeCatalogNavigationOwnership();
  }, []);
  return null;
}
