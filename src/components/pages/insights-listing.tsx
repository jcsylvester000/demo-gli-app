import Link from "next/link";
import { ARTICLES, INSIGHT_CATEGORIES } from "@/content/articles";
import { INSIGHTS_HUB } from "@/content/work-hub";
import { InsightRow } from "@/components/gli/insight-row";
import { NewsletterBox } from "@/components/gli/newsletter-box";
import { cn } from "@/lib/utils";

/** Shared by /insights and /insights/category/[slug]: category chips (real links), article list, newsletter. */
export function InsightsListing({ category, path }: { category?: string; path: string }) {
  const items = [...ARTICLES].filter((a) => !category || a.category === category).sort((a, b) => b.published.localeCompare(a.published));
  const chip = (on: boolean) =>
    cn(
      "inline-flex min-h-10 items-center rounded-full border px-3.5 text-[0.9375rem] font-semibold transition-colors",
      on ? "border-gli-blue bg-gli-blue text-white" : "border-gli-line bg-white text-gli-navy hover:border-gli-blue hover:text-gli-blue",
    );
  return (
    <section aria-labelledby="articles-title" className="bg-white">
      <h2 id="articles-title" className="sr-only">Articles</h2>
      <div className="container-site grid gap-12 py-12 md:py-16 lg:grid-cols-[1fr_22rem]">
        <div>
          <nav aria-label="Insight categories">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link href="/insights" className={chip(!category)} aria-current={!category ? "page" : undefined}>
                  All insights
                </Link>
              </li>
              {INSIGHT_CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/insights/category/${c.slug}`} className={chip(category === c.slug)} aria-current={category === c.slug ? "page" : undefined}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-10">
            {items.length ? (
              <InsightRow items={items} />
            ) : (
              <p className="rounded-[var(--radius)] border border-dashed border-gli-line bg-gli-mist p-8 text-lg">
                New articles for this topic are on press. Meanwhile, browse{" "}
                <Link href="/insights" className="font-semibold text-gli-blue underline underline-offset-4">
                  all insights
                </Link>
                .
              </p>
            )}
          </div>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <NewsletterBox {...INSIGHTS_HUB.newsletter} page={path} />
        </div>
      </div>
    </section>
  );
}
