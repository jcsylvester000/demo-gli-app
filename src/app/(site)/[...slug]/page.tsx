import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { RegMark } from "@/components/brand/print-marks";
import { buttonClass } from "@/components/ui/button";
import { LAUNCH_ROUTES, routeByPath } from "@/content/routes";

/** Temporary placeholder for launch URLs that later batches will build. Unknown URLs still return a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LAUNCH_ROUTES.map((r) => ({ slug: r.path.slice(1).split("/") }));
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = routeByPath("/" + (await params).slug.join("/"));
  return { title: route?.title ?? "Not found", robots: { index: false, follow: true } };
}

export default async function PlaceholderPage({ params }: Props) {
  const route = routeByPath("/" + (await params).slug.join("/"));
  if (!route) notFound();
  const parent = route.parent ? routeByPath(route.parent) : undefined;
  const crumbs = [...(parent ? [{ name: parent.title, href: parent.path }] : []), { name: route.title, href: route.path }];
  return (
    <>
      <Breadcrumbs items={crumbs} />
      <section className="container-site py-16 md:py-24">
        <p className="eyebrow inline-flex items-center gap-2 text-gli-blue">
          <RegMark /> On press
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl">{route.title}</h1>
        <div className="hairline mt-4 max-w-24 text-gli-line" />
        <p className="mt-6 max-w-xl text-lg text-gli-slate">
          This page is being built (Batch {route.batch}). In the meantime, start a job ticket and tell us what you need.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/quote" className={buttonClass("primary", "lg")}>
            Request a Quote
          </Link>
          <Link href="/" className={buttonClass("secondary", "lg")}>
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
