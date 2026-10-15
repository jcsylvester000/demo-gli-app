"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/server/auth";
import { getPool } from "@/lib/server/pool";
import { audit, getAdminSession, requireAdminAction } from "@/lib/server/admin/guard";
import { createUser, setPassword, USERNAME_RE, type Role } from "@/lib/server/users";
import { GOVERNANCE_TAG } from "@/lib/server/governance";
import { uploadStore } from "@/lib/server/blob-store";
import { processOutbox } from "@/lib/server/outbox";
import { createsLoop, redirectMap } from "@/lib/server/redirects";
import { CLIENTS } from "@/content/clients";
import { CASES } from "@/content/cases";
import { PRODUCTS } from "@/content/products";
import { EDITABLE_CONTACT_FIELDS } from "@/content/site";

export type ActionState = { ok?: boolean; error?: string; message?: string; data?: Record<string, unknown> };

/** Public pages read governance data through the "governance" cache tag: refresh it right after any change. */
function refreshPublicSite() {
  updateTag(GOVERNANCE_TAG);
  revalidatePath("/", "layout");
}

const fail = (e: unknown): ActionState => ({ error: (e as Error).message === "Not authorised" ? "You don't have permission to do that." : (e as Error).message || "Something went wrong." });

// ---------------------------------------------------------------- passwords

const WEAK = ["admin1234", "password", "12345678", "graphics", "library", "gli12345"];
const pwSchema = z
  .object({ current: z.string().min(1, "Enter your current password."), password: z.string().min(10, "Use at least 10 characters.").max(128), confirm: z.string() })
  .refine((d) => d.password === d.confirm, { message: "New passwords don't match.", path: ["confirm"] })
  .refine((d) => d.password !== d.current, { message: "Choose a different password from the current one.", path: ["password"] })
  .refine((d) => !WEAK.some((w) => d.password.toLowerCase().includes(w)), { message: "That password is too easy to guess.", path: ["password"] });

/** First sign-in (and after a reset): replace the temporary password. Also used on My account. */
export async function changePassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const parsed = pwSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  try {
    await auth.api.changePassword({ body: { currentPassword: parsed.data.current, newPassword: parsed.data.password, revokeOtherSessions: true }, headers: await headers() });
  } catch {
    return { error: "Current password is incorrect." };
  }
  await getPool().query(`UPDATE "user" SET "mustChangePassword" = false WHERE id = $1`, [session.user.id]);
  await audit(session.user.id, "password.changed", `user:${session.user.id}`);
  if (fd.get("next") === "account") return { ok: true, message: "Password changed. Other sessions were signed out." };
  redirect("/admin");
}

// ---------------------------------------------------------------- leads (SALES, ADMIN)

const STATUSES = ["new", "contacted", "proposal_sent", "won", "lost", "spam"] as const;
const leadUpdate = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(STATUSES),
  lostReason: z.string().trim().max(300).optional(),
  priority: z.enum(["", "hot", "warm", "cold"]).optional(),
  followUpAt: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/).optional(),
  ownerId: z.string().max(64).optional(),
});

export async function updateLead(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("leads");
    const d = leadUpdate.parse(Object.fromEntries(fd));
    if (d.status === "lost" && !d.lostReason) return { error: "Add a short reason when marking a lead as lost." };
    const pool = getPool();
    const before = await pool.query<{ status: string; owner_id: string | null }>(`SELECT status, owner_id FROM lead WHERE id = $1`, [d.id]);
    if (!before.rowCount) return { error: "Lead not found." };
    await pool.query(
      `UPDATE lead SET status = $2, lost_reason = $3, priority = NULLIF($4, ''), follow_up_at = NULLIF($5, '')::date, owner_id = NULLIF($6, ''), updated_at = now() WHERE id = $1`,
      [d.id, d.status, d.status === "lost" ? d.lostReason : null, d.priority ?? "", d.followUpAt ?? "", d.ownerId ?? ""],
    );
    const changes: string[] = [];
    if (before.rows[0].status !== d.status) changes.push(`Status: ${before.rows[0].status} → ${d.status}${d.status === "lost" ? ` (${d.lostReason})` : ""}`);
    if ((before.rows[0].owner_id ?? "") !== (d.ownerId ?? "")) changes.push("Owner changed");
    await pool.query(`INSERT INTO lead_activity (lead_id, type, body, actor_id) VALUES ($1, 'update', $2, $3)`, [d.id, changes.join(" · ") || "Details updated", me.id]);
    await audit(me.id, "lead.updated", `lead:${d.id}`);
    revalidatePath(`/admin/leads/${d.id}`);
    return { ok: true, message: "Saved." };
  } catch (e) {
    return fail(e);
  }
}

export async function addNote(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("leads");
    const id = z.coerce.number().int().positive().parse(fd.get("id"));
    const body = z.string().trim().min(1, "Write a note first.").max(4000).parse(fd.get("body"));
    await getPool().query(`INSERT INTO lead_activity (lead_id, type, body, actor_id) VALUES ($1, 'note', $2, $3)`, [id, body, me.id]);
    revalidatePath(`/admin/leads/${id}`);
    return { ok: true, message: "Note added." };
  } catch (e) {
    return e instanceof z.ZodError ? { error: e.issues[0]?.message } : fail(e);
  }
}

export async function retryEmails(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("leads");
    const id = z.coerce.number().int().positive().parse(fd.get("id"));
    await getPool().query(`UPDATE outbox SET next_attempt_at = now(), attempts = LEAST(attempts, 5) WHERE lead_id = $1 AND sent_at IS NULL`, [id]);
    const r = await processOutbox({ leadId: id, limit: 5 });
    await audit(me.id, "lead.retry_emails", `lead:${id}`);
    revalidatePath(`/admin/leads/${id}`);
    return r.claimed === 0 ? { ok: true, message: "Nothing waiting to send." } : r.sent === r.claimed ? { ok: true, message: `Sent ${r.sent}.` } : { error: `Sent ${r.sent} of ${r.claimed}; see the error on each message.` };
  } catch (e) {
    return fail(e);
  }
}

/** Data-subject erasure (RA 10173): deletes the lead, its files, notes and queued messages. ADMIN only. */
export async function eraseLead(_prev: ActionState, fd: FormData): Promise<ActionState> {
  let id = 0;
  try {
    const me = await requireAdminAction("admin");
    id = z.coerce.number().int().positive().parse(fd.get("id"));
    if (String(fd.get("confirm") ?? "").trim().toUpperCase() !== "ERASE") return { error: 'Type ERASE to confirm.' };
    const pool = getPool();
    const files = await pool.query<{ blob_key: string }>(`SELECT blob_key FROM lead_file WHERE lead_id = $1`, [id]);
    const store = await uploadStore();
    for (const f of files.rows) await store.deletePrefix(`${f.blob_key}/`);
    await pool.query(`DELETE FROM lead WHERE id = $1`, [id]);
    await audit(me.id, "lead.erased", `lead:${id}`);
  } catch (e) {
    return fail(e);
  }
  redirect("/admin/leads?erased=1");
}

// ---------------------------------------------------------------- governance

const PERMISSIONS = ["yes", "name_only", "no", "pending"] as const;

/** Client register (BRD FR-086). ADMIN only. Changes show on the public site within seconds. */
export async function setClientPermission(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("admin");
    const d = z
      .object({
        slug: z.string().refine((s) => CLIENTS.some((c) => c.slug === s), "Unknown client."),
        status: z.enum(PERMISSIONS),
        date: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/),
        note: z.string().trim().max(500),
      })
      .parse(Object.fromEntries(fd));
    if ((d.status === "yes" || d.status === "name_only") && !d.note) return { error: "Record where the permission is (e.g. 'Email from J. Cruz, 12 Nov 2026')." };
    const c = CLIENTS.find((x) => x.slug === d.slug)!;
    await getPool().query(
      `INSERT INTO client_permission (client_slug, name, industry, status, permission_date, evidence_note, updated_by, updated_at)
       VALUES ($1,$2,$3,$4,NULLIF($5,'')::date,$6,$7,now())
       ON CONFLICT (client_slug) DO UPDATE SET status = EXCLUDED.status, permission_date = EXCLUDED.permission_date, evidence_note = EXCLUDED.evidence_note, updated_by = EXCLUDED.updated_by, updated_at = now()`,
      [c.slug, c.name, c.industry, d.status, d.date, d.note || null, me.id],
    );
    await audit(me.id, `client.permission.${d.status}`, `client:${c.slug}`);
    refreshPublicSite();
    return { ok: true, message: `${c.name}: saved.` };
  } catch (e) {
    return e instanceof z.ZodError ? { error: e.issues[0]?.message } : fail(e);
  }
}

const WORKFLOW = ["draft", "in_review", "permission_check", "approved", "published"] as const;

/** Case publishing workflow + Rx clearance (BRD FR-032, FR-082). Rx clearance is ADMIN only. */
export async function setCaseStatus(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("content");
    const d = z
      .object({
        slug: z.string().refine((s) => CASES.some((c) => c.slug === s), "Unknown case."),
        workflow: z.enum(WORKFLOW),
        rxCleared: z.enum(["on", ""]).optional(),
      })
      .parse(Object.fromEntries(fd));
    const c = CASES.find((x) => x.slug === d.slug)!;
    const pool = getPool();
    const cur = await pool.query<{ rx_cleared: boolean }>(`SELECT rx_cleared FROM case_status WHERE case_slug = $1`, [c.slug]);
    let rxCleared = cur.rows[0]?.rx_cleared ?? false;
    if (me.role === "ADMIN") rxCleared = d.rxCleared === "on";
    if (c.rx && d.workflow === "published" && !rxCleared)
      return { error: "This case shows prescription-product material. An Admin must record Rx clearance before it can be published." };
    await pool.query(
      `INSERT INTO case_status (case_slug, workflow, rx_sensitive, rx_cleared, updated_by, updated_at) VALUES ($1,$2,$3,$4,$5,now())
       ON CONFLICT (case_slug) DO UPDATE SET workflow = EXCLUDED.workflow, rx_sensitive = EXCLUDED.rx_sensitive, rx_cleared = EXCLUDED.rx_cleared, updated_by = EXCLUDED.updated_by, updated_at = now()`,
      [c.slug, d.workflow, c.rx, rxCleared, me.id],
    );
    await audit(me.id, `case.${d.workflow}${rxCleared ? ".rx_cleared" : ""}`, `case:${c.slug}`);
    refreshPublicSite();
    return { ok: true, message: `${c.title}: ${d.workflow.replace("_", " ")}.` };
  } catch (e) {
    return e instanceof z.ZodError ? { error: e.issues[0]?.message } : fail(e);
  }
}

/** Testimonials (S11): only approved, attributed quotes with recorded evidence appear. ADMIN only. */
export async function saveTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("admin");
    const d = z
      .object({
        id: z.coerce.number().int().optional(),
        quote: z.string().trim().min(10, "Paste the client's exact words (at least 10 characters).").max(600),
        person: z.string().trim().min(2, "Who said it?").max(120),
        title: z.string().trim().max(120),
        client: z.string().refine((s) => !s || CLIENTS.some((c) => c.slug === s)),
        approved: z.enum(["on", ""]).optional(),
        evidence: z.string().trim().max(500),
      })
      .parse({ ...Object.fromEntries(fd), id: fd.get("id") || undefined });
    if (d.approved === "on" && !d.evidence) return { error: "Record the written approval (who and when) before approving." };
    const pool = getPool();
    if (d.id)
      await pool.query(`UPDATE testimonial SET quote=$2, person=$3, title=NULLIF($4,''), client_slug=NULLIF($5,''), approved=$6, evidence_note=NULLIF($7,'') WHERE id=$1`, [
        d.id,
        d.quote,
        d.person,
        d.title,
        d.client,
        d.approved === "on",
        d.evidence,
      ]);
    else
      await pool.query(`INSERT INTO testimonial (quote, person, title, client_slug, approved, evidence_note) VALUES ($1,$2,NULLIF($3,''),NULLIF($4,''),$5,NULLIF($6,''))`, [
        d.quote,
        d.person,
        d.title,
        d.client,
        d.approved === "on",
        d.evidence,
      ]);
    if (d.client) {
      const c = CLIENTS.find((x) => x.slug === d.client)!;
      await pool.query(`INSERT INTO client_permission (client_slug, name, industry) VALUES ($1,$2,$3) ON CONFLICT (client_slug) DO NOTHING`, [c.slug, c.name, c.industry]);
    }
    await audit(me.id, d.id ? "testimonial.updated" : "testimonial.created", d.id ? `testimonial:${d.id}` : undefined);
    refreshPublicSite();
    return { ok: true, message: "Testimonial saved." };
  } catch (e) {
    return e instanceof z.ZodError ? { error: e.issues[0]?.message } : fail(e);
  }
}

export async function deleteTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("admin");
    const id = z.coerce.number().int().positive().parse(fd.get("id"));
    await getPool().query(`DELETE FROM testimonial WHERE id = $1`, [id]);
    await audit(me.id, "testimonial.deleted", `testimonial:${id}`);
    refreshPublicSite();
    return { ok: true, message: "Deleted." };
  } catch (e) {
    return fail(e);
  }
}

/** Product "Starting from" price (PHP, stored as centavos) and lead time (BRD FR-040, FR-041). */
export async function setProductSetting(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("content");
    const d = z
      .object({
        slug: z.string().refine((s) => PRODUCTS.some((p) => p.slug === s), "Unknown product."),
        price: z.string().trim().regex(/^(\d{1,9}(\.\d{1,2})?)?$/, "Enter a price in pesos, e.g. 2500 or 2500.50, or leave it empty."),
        leadTime: z.string().trim().max(80),
      })
      .parse({ slug: fd.get("slug"), price: String(fd.get("price") ?? "").replace(/[,\s₱]|PHP/gi, ""), leadTime: fd.get("leadTime") ?? "" });
    const centavos = d.price ? Math.round(Number(d.price) * 100) : null;
    await getPool().query(
      `INSERT INTO product_setting (product_slug, starting_price_centavos, lead_time, updated_at) VALUES ($1,$2,NULLIF($3,''),now())
       ON CONFLICT (product_slug) DO UPDATE SET starting_price_centavos = EXCLUDED.starting_price_centavos, lead_time = EXCLUDED.lead_time, updated_at = now()`,
      [d.slug, centavos, d.leadTime],
    );
    await audit(me.id, "product.updated", `product:${d.slug}`);
    refreshPublicSite();
    return { ok: true, message: "Saved." };
  } catch (e) {
    return e instanceof z.ZodError ? { error: e.issues[0]?.message } : fail(e);
  }
}

/** Contact details shown across the site (BRD Site Settings). Empty = hidden on the site. */
export async function saveContactSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("content");
    const value: Record<string, string> = {};
    for (const k of EDITABLE_CONTACT_FIELDS) value[k] = String(fd.get(k) ?? "").trim().slice(0, 200);
    if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.email)) return { error: "Email doesn't look right." };
    for (const k of ["viberIntl", "whatsappIntl"] as const)
      if (value[k] && !/^\+?\d{10,15}$/.test(value[k].replace(/[\s-]/g, ""))) return { error: `${k === "viberIntl" ? "Viber" : "WhatsApp"} number: use the international format, e.g. +63 917 123 4567.` };
    await getPool().query(`INSERT INTO site_setting (key, value, updated_at) VALUES ('contact', $1, now()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`, [
      JSON.stringify(value),
    ]);
    await audit(me.id, "settings.contact.updated");
    refreshPublicSite();
    return { ok: true, message: "Contact details saved. The site updates within a minute." };
  } catch (e) {
    return fail(e);
  }
}

/** 301/302 redirects (BRD FR-092). Loops and redirects onto themselves are refused. ADMIN only. */
export async function addRedirect(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("admin");
    const d = z
      .object({
        from: z.string().trim().regex(/^\/[^\s?#]*$/, "From must be a path starting with /, e.g. /old-page."),
        to: z.string().trim().regex(/^(\/[^\s]*|https:\/\/[^\s]+)$/, "To must be a path (/new-page) or a full https:// address."),
        code: z.enum(["301", "302"]),
      })
      .parse(Object.fromEntries(fd));
    const from = d.from.replace(/\/$/, "") || "/";
    if (from === "/" || from.startsWith("/admin") || from.startsWith("/api") || from.startsWith("/_next")) return { error: "That path can't be redirected." };
    if (createsLoop(await redirectMap(), from, d.to)) return { error: "That would create a redirect loop." };
    await getPool().query(`INSERT INTO redirect (from_path, to_path, code) VALUES ($1,$2,$3) ON CONFLICT (from_path) DO UPDATE SET to_path = EXCLUDED.to_path, code = EXCLUDED.code`, [
      from,
      d.to,
      Number(d.code),
    ]);
    await audit(me.id, "redirect.saved", from);
    refreshPublicSite();
    return { ok: true, message: `Redirect saved: ${from} → ${d.to}` };
  } catch (e) {
    return e instanceof z.ZodError ? { error: e.issues[0]?.message } : fail(e);
  }
}

export async function deleteRedirect(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("admin");
    const from = String(fd.get("from") ?? "");
    await getPool().query(`DELETE FROM redirect WHERE from_path = $1`, [from]);
    await audit(me.id, "redirect.deleted", from);
    refreshPublicSite();
    return { ok: true, message: "Removed." };
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------- team (ADMIN)

const ROLES = ["ADMIN", "EDITOR", "SALES"] as const;
const tempPw = z.string().min(10, "Temporary password: at least 10 characters.").max(128);

export async function addUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("admin");
    const d = z
      .object({
        username: z.string().trim().regex(USERNAME_RE, "Username: 3–30 letters, numbers, dots or underscores."),
        name: z.string().trim().min(2, "Enter the person's name.").max(80),
        email: z.string().trim().max(200).optional(),
        role: z.enum(ROLES),
        password: tempPw,
      })
      .parse(Object.fromEntries(fd));
    const id = await createUser(auth as never, getPool(), { ...d, role: d.role as Role, mustChangePassword: true });
    await audit(me.id, "user.created", `user:${id}`);
    revalidatePath("/admin/team");
    return { ok: true, message: `${d.name} can now sign in as "${d.username}" with the temporary password (they must change it).` };
  } catch (e) {
    return e instanceof z.ZodError ? { error: e.issues[0]?.message } : fail(e);
  }
}

export async function resetUserPassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("admin");
    const id = z.string().min(1).parse(fd.get("id"));
    const password = tempPw.parse(fd.get("password"));
    await setPassword(auth as never, getPool(), id, password, true);
    await audit(me.id, "user.password_reset", `user:${id}`);
    revalidatePath("/admin/team");
    return { ok: true, message: "Temporary password set. They must change it at next sign-in." };
  } catch (e) {
    return e instanceof z.ZodError ? { error: e.issues[0]?.message } : fail(e);
  }
}

export async function setUserRole(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("admin");
    const id = z.string().min(1).parse(fd.get("id"));
    const role = z.enum(ROLES).parse(fd.get("role"));
    if (id === me.id && role !== "ADMIN") return { error: "You can't remove your own Admin role." };
    await getPool().query(`UPDATE "user" SET role = $2 WHERE id = $1`, [id, role]);
    await audit(me.id, `user.role.${role}`, `user:${id}`);
    revalidatePath("/admin/team");
    return { ok: true, message: "Role updated." };
  } catch (e) {
    return fail(e);
  }
}

export async function removeUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const me = await requireAdminAction("admin");
    const id = z.string().min(1).parse(fd.get("id"));
    if (id === me.id) return { error: "You can't remove your own account." };
    const pool = getPool();
    const admins = await pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM "user" WHERE role = 'ADMIN' AND id <> $1`, [id]);
    if (!admins.rows[0].n) return { error: "Keep at least one Admin." };
    await pool.query(`UPDATE lead SET owner_id = NULL WHERE owner_id = $1`, [id]);
    await pool.query(`DELETE FROM "user" WHERE id = $1`, [id]);
    await audit(me.id, "user.removed", `user:${id}`);
    revalidatePath("/admin/team");
    return { ok: true, message: "Removed." };
  } catch (e) {
    return fail(e);
  }
}
