import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INSIGHT_CATEGORIES } from "@/content/articles";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { InsightsListing } from "@/components/pages/insights-listing";

export const dynamicParams = false;
export const generateStaticParams = () => INSIGHT_CATEGORIES.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };
const find = (slug: string) => INSIGHT_CATEGORIES.find((c) => c.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = find((await params).slug);
  if (!c) return {};
  return pageMetadata({
    title: `${c.name}: Insights | GLI`,
    description: `Practical guides on ${c.name.toLowerCase()} from 30 years of printing, building and staging in Manila.`,
    path: `/insights/category/${c.slug}`,
  });
}

/** Category pages are indexable (FR-050). */
export default async function InsightCategory({ params }: Props) {
  const c = find((await params).slug);
  if (!c) notFound();
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Insights", href: "/insights" },
          { name: c.name, href: `/insights/category/${c.slug}` },
        ]}
      />
      <PageHero
        eyebrow="Insights"
        title={c.name}
        intro={`Guides on ${c.name.toLowerCase()} from the GLI production floor.`}
        primary={{ label: "Start a job ticket", href: "/quote" }}
        proof={null}
      />
      <InsightsListing category={c.slug} path={`/insights/category/${c.slug}`} />
    </>
  );
}
