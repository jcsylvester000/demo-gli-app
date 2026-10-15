import Image from "next/image";
import Link from "next/link";
import type { WorkImage } from "@/content/work-images";
import { buttonClass } from "@/components/ui/button";
import { TypeThumb } from "./proof-image";

export type SpecRow = { label: string; value: string };

/** Format integer centavos as "PHP 12,500" (Brand Kit: the peso sign is not in the font subset). */
export const formatPhp = (centavos: number) => `PHP ${(centavos / 100).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

/**
 * S9 Spec-Sheet Product Card (Pricing 1, Tailark, MIT; rebuilt). Dieline (dashed) border; spec rows like the
 * spec sheets GLI produced; "Starting from PHP" only when GLI has set a real price, otherwise "Price on request"
 * (FR-040). "Add to quote" is wired to the quote session in Batch 4 (FR-042).
 */
export function SpecCard({
  name,
  href,
  oneLiner,
  specs,
  priceCentavos,
  leadTime,
  image,
  addToQuote,
  fallbackLabel,
}: {
  name: string;
  href: string;
  oneLiner?: string;
  specs: SpecRow[];
  priceCentavos?: number | null;
  leadTime?: string | null;
  image?: WorkImage | null;
  addToQuote?: React.ReactNode;
  /** Shown on a typographic tile when there is no permitted photo yet, so card rows stay aligned. */
  fallbackLabel?: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius)] border-2 border-dashed border-gli-signal/60 bg-white p-4">
      {image ? (
        <div className="relative aspect-[4/3] bg-gli-mist">
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 300px, 90vw" className="object-contain p-2" />
        </div>
      ) : (
        <TypeThumb label={fallbackLabel ?? "GLI production"} sub="Production catalogue" />
      )}
      <h3 className="mt-4 text-xl">
        <Link href={href} className="hover:text-gli-blue">
          {name}
        </Link>
      </h3>
      {oneLiner ? <p className="mt-1 text-[0.9375rem] text-gli-slate">{oneLiner}</p> : null}
      <dl className="mt-3 divide-y divide-gli-line border-y border-gli-line text-[0.875rem]">
        {specs.map((r) => (
          <div key={r.label} className="grid grid-cols-[7rem_1fr] gap-2 py-1.5">
            <dt className="text-gli-slate">{r.label}</dt>
            <dd className="text-gli-ink">{r.value}</dd>
          </div>
        ))}
        {leadTime ? (
          <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5">
            <dt className="text-gli-slate">Lead time</dt>
            <dd className="text-gli-ink">{leadTime}</dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-auto pt-4">
        {priceCentavos ? (
          <p className="text-[0.875rem] text-gli-slate">
            Starting from <span className="tabular block font-heading text-2xl font-semibold text-gli-navy">{formatPhp(priceCentavos)}</span>
          </p>
        ) : (
          <p className="font-heading text-lg font-semibold text-gli-navy">Price on request</p>
        )}
        <div className="mt-3 grid gap-2">
          {addToQuote ?? (
            <Link href={href} className={buttonClass("primary", "md", "w-full")}>
              View specs
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
