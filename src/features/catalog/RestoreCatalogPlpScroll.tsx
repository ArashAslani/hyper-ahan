"use client";

import { useEffect } from "react";
import {
  consumeCatalogPlpScroll,
  discardMismatchedCatalogNavigationOwnership,
  discardMismatchedCatalogPlpScroll,
  suspendCatalogNavigationOwnershipIfCurrentPlp,
} from "@/lib/catalogNavigationContext";

type RestoreCatalogPlpScrollProps = {
  href: string;
};

/** Restore an exact owned PLP snapshot after its server-rendered layout is available. */
export function RestoreCatalogPlpScroll({ href }: RestoreCatalogPlpScrollProps) {
  useEffect(() => {
    discardMismatchedCatalogNavigationOwnership(href);

    const onPop = () => {
      queueMicrotask(() => {
        if (suspendCatalogNavigationOwnershipIfCurrentPlp()) {
          discardMismatchedCatalogPlpScroll(href);
        }
      });
    };
    window.addEventListener("popstate", onPop);

    suspendCatalogNavigationOwnershipIfCurrentPlp();
    const y = consumeCatalogPlpScroll(href);
    if (y == null) {
      discardMismatchedCatalogPlpScroll(href);
      return () => window.removeEventListener("popstate", onPop);
    }
    let frame = 0;
    let restored = false;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => scheduleRestore());

    const restore = () => {
      frame = 0;
      const maxY = Math.max(0, root.scrollHeight - window.innerHeight);
      window.scrollTo(0, Math.min(y, maxY));
      if (maxY < y) return;
      restored = true;
      observer.disconnect();
      const heading = document.querySelector("h1");
      if (heading instanceof HTMLElement) {
        heading.focus({ preventScroll: true });
      }
    };

    function scheduleRestore() {
      if (restored || frame !== 0) return;
      frame = window.requestAnimationFrame(restore);
    }

    observer.observe(root);
    scheduleRestore();

    return () => {
      window.removeEventListener("popstate", onPop);
      observer.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [href]);

  return null;
}
