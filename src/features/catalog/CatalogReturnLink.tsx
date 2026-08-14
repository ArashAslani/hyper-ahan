"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type MouseEvent, type ReactNode } from "react";
import {
  CATALOG_FALLBACK_HREF,
  bindCatalogNavigationOwnership,
  consumeCatalogNavigationOwnership,
  decideCatalogReturnNavigation,
  readCatalogHistoryCursor,
  readCatalogNavigationEntryId,
  readCatalogNavigationOwnership,
  readCatalogNavigationType,
} from "@/lib/catalogNavigationContext";

type CatalogReturnLinkProps = {
  children: ReactNode;
  className?: string;
};

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

/** Visible PDP return: real href; back() only when this tab owns the PLP predecessor. */
export function CatalogReturnLink({
  children,
  className,
}: CatalogReturnLinkProps) {
  const router = useRouter();

  useEffect(() => {
    bindCatalogNavigationOwnership(
      `${window.location.pathname}${window.location.search}`,
    );
  }, []);

  return (
    <Link
      href={CATALOG_FALLBACK_HREF}
      className={className}
      onClick={(event) => {
        if (isModifiedClick(event) || event.currentTarget.target === "_blank") {
          return;
        }
        event.preventDefault();
        const currentHref = `${window.location.pathname}${window.location.search}`;
        bindCatalogNavigationOwnership(currentHref);
        const cursor = readCatalogHistoryCursor();
        const mode = decideCatalogReturnNavigation({
          currentHref,
          ownership: readCatalogNavigationOwnership(),
          historyIdx: cursor.idx,
          historyLength: cursor.length,
          entryId: readCatalogNavigationEntryId(),
          navType: readCatalogNavigationType(),
        });
        consumeCatalogNavigationOwnership();
        if (mode === "back") {
          router.back();
          return;
        }
        if (typeof mode === "object" && mode.mode === "go") {
          window.history.go(mode.delta);
          return;
        }
        router.replace(CATALOG_FALLBACK_HREF);
      }}
    >
      {children}
    </Link>
  );
}
