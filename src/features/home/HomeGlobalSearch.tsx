"use client";

import { GlobalSearch } from "@/features/search/GlobalSearch";
import { catalogRecent } from "@/lib/catalogRecent";

/** Prominent storefront search entry near the top of Home. */
export function HomeGlobalSearch() {
  return (
    <div className="px-4 pt-4">
      <GlobalSearch
        entryFrom="home"
        onNavigate={(q) => {
          if (q) catalogRecent.pushSearch(q);
        }}
      />
    </div>
  );
}
