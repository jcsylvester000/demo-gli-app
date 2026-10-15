import Image from "next/image";
import Link from "next/link";
import type { ResolvedCase } from "@/lib/gate";
import { INDUSTRIES } from "@/content/site";
import { CropMarks } from "@/components/brand/print-marks";
import { TypeThumb } from "./proof-image";

const industryShort: Record<string, string> = {
  "pharma-and-healthcare": "Pharma",
  "consumer-and-retail": "Consumer",
  "real-estate-and-construction": "Real estate",
  "banking-finance-and-insurance": "Finance",
  "associations-societies-and-schools": "Association",
};

/**
 * S6 Job-Folder Case Card (gallery4 layout reference, rebuilt on shadcn Card). Folder tab names the industry;
 * spec strip (Client / Where / Delivered) mirrors a production docket; "Delivered" proof stamp.
 * Receives an already-gated case (names or anonymous label decided by lib/gate.ts).
 */
export function CaseCard({ item, headingLevel = 3 }: { item: ResolvedCase; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const img = item.images[0];
  const industry = INDUSTRIES.find((i) => i.slug === item.industry)?.name ?? "";
  return (
    <article className="group relative pt-7">
      {/* Folder tab */}
      <span className="eyebrow absolute left-0 top-0 rounded-t-[var(--radius)] bg-gli-blue px-3 pb-1.5 pt-1.5 text-[0.6875rem] text-white" title={industry}>
        {industryShort[item.industry] ?? industry}
      </span>
      <div className="relative flex h-full flex-col rounded-tr-[var(--radius)] border border-gli-line bg-white transition-shadow group-hover:shadow-[0_14px_30px_-16px_rgb(0_48_107/0.5)]">
        <div className="relative m-3 mb-0">
          <CropMarks />
          {img ? (
            <div className={img.fit === "contain" ? "relative aspect-[4/3] bg-gli-mist" : "relative aspect-[4/3]"}>
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw" className={img.fit === "contain" ? "object-contain p-2" : "object-cover"} />
            </div>
          ) : (
            <TypeThumb label={item.title} sub={industry} />
          )}
          <span
            aria-hidden="true"
            className="eyebrow pointer-events-none absolute -bottom-3 right-3 -rotate-6 rounded-sm border-2 border-gli-blue bg-white px-2 py-0.5 text-[0.75rem] text-gli-blue"
          >
            Delivered
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 pt-4">
          <H className="text-xl leading-snug">
            <Link href={`/work/${item.slug}`} className="after:absolute after:inset-0 hover:text-gli-blue">
              {item.title}
            </Link>
          </H>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-dashed border-gli-line pt-3 text-[0.875rem]">
            <dt className="eyebrow text-[0.6875rem] leading-5 text-gli-slate">Client</dt>
            <dd className="text-gli-ink">{item.clientLabel}</dd>
            <dt className="eyebrow text-[0.6875rem] leading-5 text-gli-slate">Where</dt>
            <dd className="text-gli-ink">
              {item.where}
              {item.yearLabel ? ` · ${item.yearLabel}` : ""}
            </dd>
            <dt className="eyebrow text-[0.6875rem] leading-5 text-gli-slate">Delivered</dt>
            <dd className="text-gli-ink">{item.delivered}</dd>
          </dl>
        </div>
      </div>
    </article>
  );
}
