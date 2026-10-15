import { INSIGHTS_HUB } from "@/content/work-hub";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { InsightsListing } from "@/components/pages/insights-listing";

export const metadata = pageMetadata({ title: INSIGHTS_HUB.seoTitle, description: INSIGHTS_HUB.meta, path: "/insights" });

export default function InsightsHub() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Insights", href: "/insights" }]} />
      <PageHero
        eyebrow="Insights"
        title={INSIGHTS_HUB.h1}
        intro={INSIGHTS_HUB.intro}
        primary={{ label: "Start a job ticket", href: "/quote" }}
        proof="Written by people who print, build and stage, since 1996"
      />
      <InsightsListing path="/insights" />
    </>
  );
}
