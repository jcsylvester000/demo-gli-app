import { requireAdmin } from "@/lib/server/admin/guard";
import { getPool } from "@/lib/server/pool";
import { Badge, Card, PageTitle, manila } from "@/components/admin/ui";
import { AddUserForm, UserRow } from "@/components/admin/governance-forms";

export const metadata = { title: "Team" };

export default async function Team() {
  const me = await requireAdmin("admin");
  const { rows } = await getPool().query<{ id: string; name: string; username: string; role: string; twoFactorEnabled: boolean | null; mustChangePassword: boolean; createdAt: string }>(
    `SELECT id, name, username, role, "twoFactorEnabled", "mustChangePassword", "createdAt" FROM "user" ORDER BY "createdAt"`,
  );
  return (
    <>
      <PageTitle title="Team" sub="Sales see leads. Editors manage publishing (no lead data). Admins do everything, including this page." />
      <Card title="Add a team member" className="mb-6">
        <AddUserForm />
      </Card>
      <div className="space-y-3">
        {rows.map((u) => (
          <Card key={u.id}>
            <p className="mb-3 flex flex-wrap items-center gap-2">
              <span className="font-semibold">{u.name}</span>
              <span className="text-gli-slate">@{u.username}</span>
              <Badge value={u.role === "ADMIN" ? "quote" : u.role === "EDITOR" ? "contact" : "contacted"} label={u.role.toLowerCase()} />
              {u.twoFactorEnabled ? <Badge value="published" label="2-step on" /> : <Badge value="draft" label="2-step off" />}
              {u.mustChangePassword ? <Badge value="pending" label="temporary password" /> : null}
              <span className="text-[0.8125rem] text-gli-slate">since {manila(u.createdAt, false)}</span>
            </p>
            <UserRow id={u.id} role={u.role} isSelf={u.id === me.id} />
          </Card>
        ))}
      </div>
    </>
  );
}
