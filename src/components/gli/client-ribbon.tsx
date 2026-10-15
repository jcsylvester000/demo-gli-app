import Link from "next/link";
import { INDUSTRIES } from "@/content/site";
import type { IndustrySlug } from "@/content/clients";

type RibbonClient = { slug: string; name: string; industry: IndustrySlug; logo: boolean };

const chip = (slug: IndustrySlug) => {
  const map: Record<IndustrySlug, string> = {
    "pharma-and-healthcare": "Pharma",
    "consumer-and-retail": "Consumer",
    "real-estate-and-construction": "Real estate",
    "banking-finance-and-insurance": "Finance",
    "associations-societies-and-schools": "Associations",
  };
  return map[slug];
};

/**
 * S3 Industry Client Ribbon (Marquee, Magic UI, MIT; rebuilt in CSS). Client names grouped by industry chip.
 * Only clients with permission Yes / Name only are passed in (FR-011). Logos are not used until GLI supplies
 * approved files: names render as wordmarks. With fewer than 3 permitted clients the ribbon shows the
 * industries GLI serves instead of names.
 */
export function ClientRibbon({ label, clients }: { label: string; clients: RibbonClient[] }) {
  if (clients.length < 3) {
    return (
      <section aria-label="Industries we serve" className="border-b border-gli-line bg-gli-mist">
        <div className="container-site flex flex-col gap-3 py-5 md:flex-row md:items-center md:gap-6">
          <p className="eyebrow shrink-0 text-gli-slate">Built for teams in</p>
          <ul className="flex flex-wrap gap-2">
            {INDUSTRIES.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries/${i.slug}`} className="inline-flex min-h-9 items-center rounded-full border border-gli-line bg-white px-3.5 text-[0.9375rem] font-semibold text-gli-navy hover:border-gli-blue hover:text-gli-blue">
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  const groups = Object.entries(
    clients.reduce<Record<string, RibbonClient[]>>((acc, c) => ((acc[c.industry] ||= []).push(c), acc), {}),
  ) as [IndustrySlug, RibbonClient[]][];
  const row = (dup: boolean) => (
    <ul className={dup ? "gli-marquee-dup flex shrink-0 items-center gap-10 pr-10" : "flex shrink-0 items-center gap-10 pr-10"} aria-hidden={dup || undefined}>
      {groups.map(([ind, list]) => (
        <li key={ind} className="flex items-center gap-6">
          <span className="eyebrow rounded-full bg-gli-blue px-2.5 py-1 text-[0.6875rem] text-white">{chip(ind)}</span>
          {list.map((c) => (
            <span key={c.slug} className="whitespace-nowrap font-heading text-lg font-semibold text-gli-slate">
              {c.name}
            </span>
          ))}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className="border-b border-gli-line bg-gli-mist">
      <div className="container-site flex items-center gap-6 py-5">
        <p className="eyebrow shrink-0 text-gli-slate">{label}</p>
        <div className="gli-marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]" tabIndex={0}>
          <div className="gli-marquee-track flex w-max">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
