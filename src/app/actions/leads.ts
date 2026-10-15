"use server";

import { contactSchema, quoteSchema, type ContactInput, type QuoteInput } from "@/lib/lead-schema";
import { getPool, hasDatabase } from "@/lib/server/pool";
import { ipHash } from "@/lib/server/request";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { nextTicketNo } from "@/lib/server/ticket";
import { enqueueFanout, processOutbox } from "@/lib/server/outbox";
import type { LeadForMail } from "@/lib/server/email";
import { headers } from "next/headers";
import { getContact } from "@/lib/server/site-settings";

export type SubmitResult = { ok: true; ticket: string | null } | { ok: false; error: string; fieldErrors?: Record<string, string> };

const SERVER_ERROR = "Something went wrong on our side. Your details are still in the form; please try again in a moment.";

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? "form");
    out[k] ??= i.message;
  }
  return out;
}

async function guard(token: string | null | undefined, honeypot: string | null | undefined) {
  if (honeypot) return "Please try again.";
  const h = await headers();
  const ip = h.get("x-nf-client-connection-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  if (!(await verifyTurnstile(token, ip))) return "Please complete the security check and try again.";
  if (!hasDatabase()) return "Our form is not connected yet. Please contact us another way for now.";
  const hash = await ipHash();
  if (hash) {
    const { rows } = await getPool().query<{ n: number }>(
      `SELECT count(*)::int AS n FROM lead WHERE ip_hash = $1 AND kind IN ('quote','contact') AND created_at > now() - interval '1 hour'`,
      [hash],
    );
    if (rows[0].n >= 5) return "We've received several requests from this connection. Please try again later or contact us directly.";
  }
  return null;
}

/** Fan-out right away; anything that fails stays queued for retry. Never blocks the visitor for long. */
async function sendNow(leadId: number) {
  try {
    await Promise.race([processOutbox({ leadId, limit: 5 }), new Promise((r) => setTimeout(r, 12_000))]);
  } catch (e) {
    console.error("[fanout] deferred:", (e as Error).message);
  }
  // Opportunistically retry older queued messages too.
  processOutbox({ limit: 5 }).catch(() => {});
}

/** Job ticket (BRD FR-060–065, Workflow 9.2). */
export async function submitQuote(input: QuoteInput): Promise<SubmitResult> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error.issues) };
  const d = parsed.data;
  const blocked = await guard(d.turnstileToken, d.website);
  if (blocked) return { ok: false, error: blocked };

  const ip = await ipHash();
  const contact = await getContact(); // before the transaction: never hold two connections at once
  const client = await getPool().connect();
  let lead: LeadForMail;
  try {
    await client.query("BEGIN");
    const ticket = await nextTicketNo(client);
    const { rows } = await client.query<{ id: string }>(
      `INSERT INTO lead (ticket_no, kind, services, industry, products, event_date, venue, qty_sizes, budget_band, notes, name, company, email, mobile,
                         preferred_channel, consent_version, consent_at, newsletter_opt_in, utm_source, utm_medium, utm_campaign, landing_page, ip_hash)
       VALUES ($1,'quote',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'v1',now(),$15,$16,$17,$18,$19,$20) RETURNING id`,
      [
        ticket,
        d.services,
        d.industry || null,
        d.products,
        d.eventDate || null,
        d.venue || null,
        d.qtySizes || null,
        d.budgetBand || null,
        d.notes || null,
        d.name,
        d.company,
        d.email,
        d.mobile,
        d.channel,
        d.newsletter,
        d.utmSource || null,
        d.utmMedium || null,
        d.utmCampaign || null,
        d.landingPage || null,
        ip,
      ],
    );
    const id = Number(rows[0].id);
    // Link uploads: only completed ones from the last day that are not already attached to a ticket.
    const files = d.uploadIds.length
      ? (
          await client.query<{ id: string; filename: string; mime: string; size_bytes: number; part_count: number }>(
            `UPDATE upload_session SET status = 'linked', lead_id = $1
              WHERE id = ANY($2::text[]) AND status = 'ready' AND lead_id IS NULL AND created_at > now() - interval '1 day'
              RETURNING id, filename, mime, size_bytes, part_count`,
            [id, d.uploadIds],
          )
        ).rows
      : [];
    for (const f of files) {
      await client.query(`INSERT INTO lead_file (lead_id, blob_key, filename, mime, size_bytes, part_count) VALUES ($1,$2,$3,$4,$5,$6)`, [
        id,
        f.id,
        f.filename,
        f.mime,
        f.size_bytes,
        f.part_count,
      ]);
    }
    await client.query(`INSERT INTO lead_activity (lead_id, type, body) VALUES ($1, 'created', $2)`, [id, `Job ticket ${ticket} submitted (${files.length} file${files.length === 1 ? "" : "s"})`]);
    lead = {
      id,
      kind: "quote",
      ticketNo: ticket,
      name: d.name,
      company: d.company,
      email: d.email,
      mobile: d.mobile,
      channel: d.channel,
      services: d.services,
      industry: d.industry,
      products: d.products,
      eventDate: d.eventDate || null,
      venue: d.venue,
      qtySizes: d.qtySizes,
      budgetBand: d.budgetBand,
      notes: d.notes,
      files: files.map((f) => ({ filename: f.filename, size: f.size_bytes })),
      utm: [d.utmSource, d.utmMedium, d.utmCampaign].filter(Boolean).join(" / ") || null,
      landingPage: d.landingPage,
    };
    await enqueueFanout(client, lead, contact);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[quote] save failed:", (e as Error).message);
    return { ok: false, error: SERVER_ERROR };
  } finally {
    client.release();
  }
  await sendNow(lead.id);
  return { ok: true, ticket: lead.ticketNo };
}

/** Contact form (BRD FR-071): same pipeline, tagged "contact", no ticket number. */
export async function submitContact(input: ContactInput): Promise<SubmitResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error.issues) };
  const d = parsed.data;
  const blocked = await guard(d.turnstileToken, d.website);
  if (blocked) return { ok: false, error: blocked };
  const ip = await ipHash();
  const contact = await getContact(); // before the transaction: never hold two connections at once
  const client = await getPool().connect();
  let lead: LeadForMail;
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ id: string }>(
      `INSERT INTO lead (kind, name, email, mobile, notes, consent_version, consent_at, utm_source, utm_medium, utm_campaign, landing_page, ip_hash)
       VALUES ('contact',$1,$2,$3,$4,'contact-v1',now(),$5,$6,$7,$8,$9) RETURNING id`,
      [d.name, d.email, d.mobile || null, d.message, d.utmSource || null, d.utmMedium || null, d.utmCampaign || null, d.landingPage || null, ip],
    );
    const id = Number(rows[0].id);
    await client.query(`INSERT INTO lead_activity (lead_id, type, body) VALUES ($1, 'created', 'Contact form submitted')`, [id]);
    lead = { id, kind: "contact", ticketNo: null, name: d.name, email: d.email, mobile: d.mobile, notes: d.message, utm: [d.utmSource, d.utmMedium, d.utmCampaign].filter(Boolean).join(" / ") || null, landingPage: d.landingPage };
    await enqueueFanout(client, lead, contact);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[contact] save failed:", (e as Error).message);
    return { ok: false, error: SERVER_ERROR };
  } finally {
    client.release();
  }
  await sendNow(lead.id);
  return { ok: true, ticket: null };
}
