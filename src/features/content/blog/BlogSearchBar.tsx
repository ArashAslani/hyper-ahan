"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/shared/ui/SearchBar";

type BlogSearchBarProps = {
  initialQuery?: string;
  sticky?: boolean;
  placeholder?: string;
};

const DEBOUNCE_MS = 400;

export function BlogSearchBar({
  initialQuery = "",
  sticky,
  placeholder = "جستجو در مقالات...",
}: BlogSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keeps the input in sync when the URL changes from elsewhere (category
  // chips, browser back/forward) without us having typed anything ourselves.
  // No SSR-safe alternative: this is a one-way sync from a prop that only
  // changes on external navigation, not on every render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const pushQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    params.delete("page");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushQuery(value), DEBOUNCE_MS);
  };

  const handleSubmit = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushQuery(query);
  };

  return (
    <SearchBar
      value={query}
      onChange={handleChange}
      onSubmit={handleSubmit}
      placeholder={placeholder}
      sticky={sticky}
    />
  );
}
