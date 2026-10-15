import { requireAdmin } from "@/lib/server/admin/guard";
import { getPool } from "@/lib/server/pool";
import { PRODUCTS, categoryLabel } from "@/content/products";
import { Card, PageTitle } from "@/components/admin/ui";
import { ProductSettingForm } from "@/components/admin/governance-forms";

export const metadata = { title: "Prices & lead times" };

/** BRD FR-040/041: "Starting from PHP" appears (with Product schema) only when a real price is set here. */
export default async function Products() {
  await requireAdmin("content");
  const { rows } = await getPool().query<{ product_slug: string; starting_price_centavos: string | null; lead_time: string | null }>(
    `SELECT product_slug, starting_price_centavos, lead_time FROM product_setting`,
  );
  const s = Object.fromEntries(rows.map((r) => [r.product_slug, r]));
  return (
    <>
      <PageTitle title="Prices & lead times" sub="Leave the price empty to show “Price on request”. Lead time appears on the product page and its card." />
      <Card>
        <ul className="divide-y divide-gli-line">
          {PRODUCTS.map((p) => {
            const r = s[p.slug];
            const price = r?.starting_price_centavos ? String(Number(r.starting_price_centavos) / 100) : "";
            return (
              <li key={p.slug} className="py-3">
                <p className="mb-2 font-semibold">
                  {p.name} <span className="font-normal text-gli-slate">· {categoryLabel(p.category)}</span>
                </p>
                <ProductSettingForm slug={p.slug} price={price} leadTime={r?.lead_time ?? ""} />
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
