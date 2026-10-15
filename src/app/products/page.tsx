import { PRODUCT_CATEGORIES, PRODUCTS, PRODUCTS_HUB, categoryLabel } from "@/content/products";
import { productSetting } from "@/lib/gate";
import { getGovernance } from "@/lib/server/governance";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { SpecCard } from "@/components/gli/spec-card";
import { AddToQuote } from "@/components/gli/add-to-quote";
import { ProductBrowser } from "@/components/gli/product-browser";
import { JsonLd } from "@/components/seo/json-ld";
import { collectionPage } from "@/lib/schema";
import { productStock } from "@/content/stock";

export const revalidate = 300;
export const metadata = pageMetadata({ title: PRODUCTS_HUB.seoTitle, description: PRODUCTS_HUB.meta, path: "/products" });

export default async function ProductsHub() {
  const g = await getGovernance();
  return (
    <>
      <Breadcrumbs items={[{ name: "Products", href: "/products" }]} />
      <PageHero eyebrow="Products" title={PRODUCTS_HUB.h1} intro={PRODUCTS_HUB.intro} primary={{ label: "Start a job ticket", href: "/quote" }} />
      <section aria-labelledby="catalogue-title" className="bg-gli-mist">
        <h2 id="catalogue-title" className="sr-only">Catalogue</h2>
        <div className="container-site py-12 md:py-16">
          <ProductBrowser
            categories={[...PRODUCT_CATEGORIES]}
            items={PRODUCTS.map((p) => {
              const ps = productSetting(g, p.slug);
              return {
                slug: p.slug,
                category: p.category,
                card: (
                  <SpecCard
                    name={p.name}
                    href={`/products/${p.slug}`}
                    oneLiner={p.oneLiner}
                    specs={p.specs}
                    priceCentavos={ps.priceCentavos}
                    leadTime={ps.leadTime}
                    image={p.image}
                    fallbackLabel={categoryLabel(p.category)}
                    photo={productStock(p.slug)}
                    addToQuote={<AddToQuote slug={p.slug} name={p.name} />}
                  />
                ),
              };
            })}
          />
        </div>
      </section>
      <JsonLd data={collectionPage("GLI production catalogue", "/products", PRODUCTS.map((p) => ({ name: p.name, path: `/products/${p.slug}` })))} />
    </>
  );
}
