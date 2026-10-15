"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ResolvedCase } from "@/lib/gate";
import { INDUSTRIES } from "@/content/site";
import { CaseCard } from "./case-card";
import { cn } from "@/lib/utils";

const SERVICE_FILTERS = [
  { key: "events", label: "Events", services: ["events-conventions-and-launches"] },
  { key: "booths", label: "Booths", services: ["booth-design-and-fabrication"] },
  { key: "print", label: "Print", services: ["print-and-collateral", "brand-and-graphic-design", "large-format-signage-and-wraps"] },
  { key: "retail", label: "Retail Display", services: ["retail-display-and-posm"] },
  { key: "packaging", label: "Packaging", services: ["packaging-design"] },
  { key: "av", label: "AV & Interactive", services: ["avp-interactive-games-and-apps"] },
];
const INDUSTRY_SHORT: Record<string, string> = {
  "pharma-and-healthcare": "Pharma & Healthcare",
  "consumer-and-retail": "Consumer & Retail",
  "real-estate-and-construction": "Real Estate",
  "banking-finance-and-insurance": "Finance",
  "associations-societies-and-schools": "Associations",
};

type Filters = { industry?: string; service?: string; year?: string; archive?: boolean };

/**
 * Work hub browser (BRD FR-030). The page HTML lists the current page of cases with crawlable pagination.
 * Filter chips work in the browser over all visible cases; filter URLs (?industry=…) keep the /work canonical.
 */
export function WorkBrowser({
  all,
  pageItems,
  pagination,
  emptyText,
}: {
  all: ResolvedCase[];
  pageItems: ResolvedCase[];
  pagination: React.ReactNode;
  emptyText: string;
}) {
  const [f, setF] = useState<Filters>({});

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const init: Filters = {
      industry: q.get("industry") || undefined,
      service: q.get("service") || undefined,
      year: q.get("year") || undefined,
      archive: q.get("archive") === "1",
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read filters from the URL once after mount
    if (init.industry || init.service || init.year || init.archive) setF(init);
  }, []);

  const update = (next: Filters) => {
    setF(next);
    const q = new URLSearchParams();
    if (next.industry) q.set("industry", next.industry);
    if (next.service) q.set("service", next.service);
    if (next.year) q.set("year", next.year);
    if (next.archive) q.set("archive", "1");
    window.history.replaceState(null, "", q.size ? `/work?${q}` : "/work");
  };

  const years = useMemo(() => [...new Set(all.map((c) => c.year).filter((y): y is number => !!y))].sort((a, b) => b - a), [all]);
  const active = !!(f.industry || f.service || f.year || f.archive);
  const items = active
    ? all.filter(
        (c) =>
          (!f.industry || c.industry === f.industry) &&
          (!f.service || SERVICE_FILTERS.find((s) => s.key === f.service)?.services.some((x) => c.services.includes(x))) &&
          (!f.year || String(c.year) === f.year) &&
          (!f.archive || c.archive),
      )
    : pageItems;

  const chip = (on: boolean) =>
    cn(
      "inline-flex min-h-10 items-center rounded-full border px-3.5 text-[0.9375rem] font-semibold transition-colors",
      on ? "border-gli-blue bg-gli-blue text-white" : "border-gli-line bg-white text-gli-navy hover:border-gli-blue hover:text-gli-blue",
    );

  return (
    <div>
      <div className="space-y-3" role="group" aria-label="Filter work">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={chip(!active)} aria-pressed={!active} onClick={() => update({})}>
            All work
          </button>
          {INDUSTRIES.map((i) => (
            <button
              key={i.slug}
              type="button"
              className={chip(f.industry === i.slug)}
              aria-pressed={f.industry === i.slug}
              onClick={() => update({ ...f, industry: f.industry === i.slug ? undefined : i.slug })}
            >
              {INDUSTRY_SHORT[i.slug]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SERVICE_FILTERS.map((s) => (
            <button
              key={s.key}
              type="button"
              className={chip(f.service === s.key)}
              aria-pressed={f.service === s.key}
              onClick={() => update({ ...f, service: f.service === s.key ? undefined : s.key })}
            >
              {s.label}
            </button>
          ))}
          <span aria-hidden="true" className="mx-1 h-6 w-px bg-gli-line" />
          {years.map((y) => (
            <button
              key={y}
              type="button"
              className={chip(f.year === String(y))}
              aria-pressed={f.year === String(y)}
              onClick={() => update({ ...f, year: f.year === String(y) ? undefined : String(y) })}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {items.length} project{items.length === 1 ? "" : "s"} shown
      </p>

      {items.length ? (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <CaseCard key={c.slug} item={c} headingLevel={2} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[var(--radius)] border border-dashed border-gli-line bg-gli-mist p-8 text-center">
          <p className="text-lg text-gli-ink">{emptyText}</p>
          <Link href="/quote" className="mt-4 inline-flex min-h-11 items-center font-heading font-semibold text-gli-blue underline underline-offset-4">
            Start a job ticket
          </Link>
        </div>
      )}

      {!active ? pagination : null}

      <div className="mt-14 flex flex-col gap-3 rounded-[var(--radius)] border border-gli-line bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-xl font-semibold text-gli-navy">From the archive, 1996–2014</p>
          <p className="text-gli-slate">Thirty years of work, from our first brochures to our first booths.</p>
        </div>
        <button type="button" className={chip(!!f.archive)} aria-pressed={!!f.archive} onClick={() => update({ archive: !f.archive })}>
          {f.archive ? "Show all work" : "Browse the archive →"}
        </button>
      </div>
    </div>
  );
}
