import { requireAdmin } from "@/lib/server/admin/guard";
import { Card, PageTitle } from "@/components/admin/ui";
import { PasswordForm } from "@/components/admin/password-form";
import { TwoFactor } from "@/components/admin/two-factor";

export const metadata = { title: "My account" };

export default async function Account() {
  const me = await requireAdmin();
  return (
    <>
      <PageTitle title="My account" sub={`${me.name} · ${me.role.toLowerCase()}`} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Change password">
          <PasswordForm mode="account" />
        </Card>
        <Card title="Two-step verification">
          <p className="mb-4 text-[0.9375rem] text-gli-slate">Recommended for everyone who can see leads: a code from your phone is needed at each sign-in.</p>
          <TwoFactor enabled={!!me.twoFactorEnabled} />
        </Card>
      </div>
    </>
  );
}
