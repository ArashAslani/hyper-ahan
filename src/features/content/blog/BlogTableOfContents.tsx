"use client";

import { useEffect, useState } from "react";
import type { BlogHeading } from "@/types";

type BlogTableOfContentsProps = {
  headings: BlogHeading[];
};

export function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );

    headingElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="فهرست مطالب"
      className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]"
    >
      <h2 className="mb-3 text-sm font-bold text-text">فهرست مطالب</h2>
      <ul className="max-h-[60vh] space-y-2 overflow-y-auto border-r-2 border-border pr-3">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pr-3" : ""}>
            <a
              href={`#${heading.id}`}
              className={`block text-sm transition ${
                activeId === heading.id ? "font-semibold text-accent" : "text-text-muted hover:text-accent"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
