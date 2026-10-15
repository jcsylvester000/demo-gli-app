import Link from "next/link";
import { CLIENTS_PAGE } from "@/content/about";
import { HOME } from "@/content/home";
import { INDUSTRIES } from "@/content/site";
import { nameableClients } from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { Counters } from "@/components/gli/counters";

export const revalidate = 300;
export const metadata = pageMetadata({ title: CLIENTS_PAGE.seoTitle, description: CLIENTS_PAGE.meta, path: "/about/clients" });

/** Clients by industry: names only where permission is Yes / Name only; logos only for Yes (none supplied yet). */
export default async function Clients() {
  const g = await getGovernance();
  const clients = nameableClients(g);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "About", href: "/about" },
          { name: "Clients", href: "/about/clients" },
        ]}
      />
      <PageHero eyebrow="Clients" title={CLIENTS_PAGE.h1} intro={CLIENTS_PAGE.intro} primary={{ label: "See the work", href: "/work" }} proof={null} />
      <section aria-label="GLI in numbers" className="border-b border-gli-line bg-gli-tint">
        <div className="container-site py-10">
          <Counters items={HOME.counters} />
        </div>
      </section>
      <section aria-label="Clients by industry" className="bg-white">
        <div className="container-site py-14 md:py-20">
          {clients.length ? (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {INDUSTRIES.map((i) => {
                const list = clients.filter((c) => c.industry === i.slug);
                return list.length ? (
                  <div key={i.slug}>
                    <h2 className="eyebrow text-gli-blue">
                      <Link href={`/industries/${i.slug}`} className="hover:underline">
                        {i.name}
                      </Link>
                    </h2>
                    <ul className="mt-4 space-y-2">
                      {list.map((c) => (
                        <li key={c.slug} className="font-heading text-xl font-semibold text-gli-navy">
                          {c.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="max-w-2xl">
              <p className="text-lg text-gli-ink">
                We are confirming with each client how they would like to appear. Names will be listed here as permissions come in. Meanwhile, browse the work
                by industry:
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {INDUSTRIES.map((i) => (
                  <li key={i.slug}>
                    <Link
                      href={`/industries/${i.slug}`}
                      className="inline-flex min-h-10 items-center rounded-full border border-gli-line px-3.5 font-semibold text-gli-navy hover:border-gli-blue hover:text-gli-blue"
                    >
                      {i.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
