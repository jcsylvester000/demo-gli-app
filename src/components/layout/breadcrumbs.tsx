import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";

export type Crumb = { name: string; href: string };

/** Breadcrumbs for every page below level 1 (BRD FR-006), with BreadcrumbList structured data. Home is prepended automatically. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${siteUrl()}${c.href === "/" ? "" : c.href}` })),
  };
  return (
    <>
      <nav aria-label="Breadcrumb" className="container-site pt-5 text-[0.875rem]">
        <ol className="flex flex-wrap items-center gap-1 text-gli-slate">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="inline-flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="font-semibold text-gli-ink">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className="hover:text-gli-blue hover:underline underline-offset-4">
                      {c.name}
                    </Link>
                    <ChevronRight aria-hidden="true" className="size-3.5" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={data} />
    </>
  );
}
