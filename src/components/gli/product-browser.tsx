"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Category filter for the Products hub (FR-040). Cards are server-rendered; this only shows/hides them. */
export function ProductBrowser({
  categories,
  items,
}: {
  categories: { slug: string; name: string }[];
  items: { slug: string; category: string; card: React.ReactNode }[];
}) {
  const [cat, setCat] = useState<string | null>(null);
  const shown = cat ? items.filter((i) => i.category === cat) : items;
  const chip = (on: boolean) =>
    cn(
      "inline-flex min-h-10 items-center rounded-full border px-3.5 text-[0.9375rem] font-semibold transition-colors",
      on ? "border-gli-blue bg-gli-blue text-white" : "border-gli-line bg-white text-gli-navy hover:border-gli-blue hover:text-gli-blue",
    );
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button type="button" className={chip(!cat)} aria-pressed={!cat} onClick={() => setCat(null)}>
          All items
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={chip(cat === c.slug)}
            aria-pressed={cat === c.slug}
            onClick={() => setCat(cat === c.slug ? null : c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} items shown
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((i) => (
          <li key={i.slug}>{i.card}</li>
        ))}
      </ul>
    </div>
  );
}
