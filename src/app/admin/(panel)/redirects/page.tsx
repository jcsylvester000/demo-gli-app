import { requireAdmin } from "@/lib/server/admin/guard";
import { getPool } from "@/lib/server/pool";
import { Card, PageTitle, td, th } from "@/components/admin/ui";
import { DeleteRedirect, RedirectForm } from "@/components/admin/governance-forms";

export const metadata = { title: "Redirects" };

/** BRD FR-092: send old URLs to new ones. Applies to paths that don't exist on the site; loops are refused. */
export default async function Redirects() {
  await requireAdmin("admin");
  const { rows } = await getPool().query<{ from_path: string; to_path: string; code: number }>(`SELECT from_path, to_path, code FROM redirect ORDER BY from_path`);
  return (
    <>
      <PageTitle title="Redirects" sub="Use when a page moves or an old link is still out there. Works for addresses that no longer exist on the site." />
      <Card title="Add a redirect" className="mb-6">
        <RedirectForm />
      </Card>
      <div className="overflow-x-auto rounded-lg border border-gli-line bg-white">
        <table className="w-full">
          <thead className="border-b border-gli-line bg-gli-mist">
            <tr>
              <th className={th}>From</th>
              <th className={th}>To</th>
              <th className={th}>Type</th>
              <th className={th}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gli-line">
            {rows.map((r) => (
              <tr key={r.from_path}>
                <td className={td}>{r.from_path}</td>
                <td className={td}>{r.to_path}</td>
                <td className={td}>{r.code === 301 ? "Permanent" : "Temporary"}</td>
                <td className={td}>
                  <DeleteRedirect from={r.from_path} />
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-gli-slate">
                  No redirects yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
