"use client";

import { GlobalSearch } from "@/features/search/GlobalSearch";
import { catalogRecent } from "@/lib/catalogRecent";

type SearchPageSearchProps = {
  initialQuery: string;
  autoFocus: boolean;
};

export function SearchPageSearch({
  initialQuery,
  autoFocus,
}: SearchPageSearchProps) {
  return (
    <GlobalSearch
      initialQuery={initialQuery}
      autoFocus={autoFocus}
      enableSuggest
      onNavigate={(q) => {
        if (q) catalogRecent.pushSearch(q);
      }}
    />
  );
}
