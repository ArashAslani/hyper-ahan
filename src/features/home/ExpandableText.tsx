"use client";

import { useState } from "react";

type ExpandableTextProps = {
  text: string;
  previewLength?: number;
};

export function ExpandableText({
  text,
  previewLength = 300,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">
          درباره هایپر آهن
        </h2>
        <div className="text-justify leading-relaxed text-gray-700">
          <p>
            {isExpanded ? text : `${text.substring(0, previewLength)}...`}
          </p>
        </div>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-semibold text-blue-600 transition hover:text-blue-800"
          >
            {isExpanded ? "بستن ▲" : "بیشتر ▼"}
          </button>
        </div>
      </div>
    </section>
  );
}
