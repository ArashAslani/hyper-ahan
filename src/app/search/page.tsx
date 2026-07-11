"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/shared/ui/SearchBar";
import { routes } from "@/lib/routes";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <div className="px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-text">جستجو</h1>
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={() => {
          const q = query.trim();
          router.push(
            q
              ? `${routes.products.list}?q=${encodeURIComponent(q)}`
              : routes.products.list,
          );
        }}
      />
      <p className="mt-4 text-sm text-text-muted">
        نام محصول، سایز یا کارخانه را جستجو کنید.
      </p>
    </div>
  );
}
