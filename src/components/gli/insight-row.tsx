import Link from "next/link";
import { categoryName, type ArticleMeta } from "@/content/articles";
import { CropMarks } from "@/components/brand/print-marks";
import { TypeThumb } from "./proof-image";

/**
 * S13 Insight Article Row (Blog 8, shadcnblocks, MIT; rebuilt). Category eyebrow in tracked caps; thumbnail trimmed
 * with crop marks (typographic thumbnail until article images exist).
 */
export function InsightRow({ items }: { items: ArticleMeta[] }) {
  return (
    <ul className="divide-y divide-gli-line border-y border-gli-line">
      {items.map((a) => (
        <li key={a.slug}>
          <article className="group relative grid gap-5 py-6 sm:grid-cols-[1fr_12rem] sm:items-center md:gap-10">
            <div>
              <p className="eyebrow text-[0.75rem] text-gli-blue">{categoryName(a.category)}</p>
              <h3 className="mt-1.5 text-xl md:text-2xl">
                <Link href={`/insights/${a.slug}`} className="after:absolute after:inset-0 group-hover:text-gli-blue">
                  {a.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-2xl text-gli-slate">{a.excerpt}</p>
              <p className="mt-2 text-[0.875rem] text-gli-slate">{a.readMins} min read</p>
            </div>
            <div className="relative max-sm:hidden">
              <CropMarks />
              <TypeThumb label={categoryName(a.category)} sub="Insights" aspect="aspect-[4/3]" />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
