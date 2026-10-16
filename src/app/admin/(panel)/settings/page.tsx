import { requireAdmin } from "@/lib/server/admin/guard";
import { getPool } from "@/lib/server/pool";
import { Card, PageTitle } from "@/components/admin/ui";
import { ContactSettingsForm } from "@/components/admin/governance-forms";

export const metadata = { title: "Contact details" };

export default async function Settings() {
  await requireAdmin("content");
  const { rows } = await getPool().query<{ value: Record<string, string> }>(`SELECT value FROM site_setting WHERE key = 'contact'`);
  return (
    <>
      <PageTitle title="Contact details" sub="Shown in the header bar, footer, chat button and Contact page. Match your Google Business Profile exactly." />
      <Card>
        <ContactSettingsForm values={rows[0]?.value ?? {}} />
      </Card>
    </>
  );
}
