import "server-only";
import { unstable_cache } from "next/cache";
import { CONTACT, EDITABLE_CONTACT_FIELDS, type Contact } from "@/content/site";
import { getPool, hasDatabase } from "./pool";
import { GOVERNANCE_TAG } from "./governance";

async function load(): Promise<Partial<Record<string, string>>> {
  const { rows } = await getPool().query<{ value: Record<string, string> }>(`SELECT value FROM site_setting WHERE key = 'contact'`);
  return rows[0]?.value ?? {};
}
const cached = unstable_cache(load, ["site-contact-v1"], { tags: [GOVERNANCE_TAG], revalidate: 300 });

/** Contact details: values saved in the admin (confirmed) over the pending defaults. Safe defaults if the DB is down. */
export async function getContact(): Promise<Contact> {
  let saved: Partial<Record<string, string>> = {};
  if (hasDatabase()) {
    try {
      saved = await cached();
    } catch (e) {
      console.warn("[settings] using defaults:", (e as Error).message);
    }
  }
  const c: Contact = { ...CONTACT };
  for (const k of EDITABLE_CONTACT_FIELDS) {
    const v = (saved[k] ?? "").trim();
    c[k] = v ? { value: v, pending: false } : CONTACT[k];
  }
  return c;
}
