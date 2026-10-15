import "server-only";
import { ALL_SERVICES, CONTACT, INDUSTRIES, responsePromise } from "@/content/site";
import { productBySlug } from "@/content/products";
import { siteUrl } from "@/lib/utils";

/** Transactional email via Resend's HTTP API (BRD Integrations). Not configured = queued in the outbox, never lost. */
export type Mail = { to: string[]; subject: string; html: string; text: string; replyTo?: string };

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.LEAD_FROM_EMAIL);
export const salesInbox = () => (process.env.SALES_INBOX || "").split(",").map((s) => s.trim()).filter(Boolean);

export async function sendMail(m: Mail): Promise<void> {
  if (!emailConfigured()) throw new Error("email not configured (RESEND_API_KEY / LEAD_FROM_EMAIL)");
  if (!m.to.length) throw new Error("no recipient (SALES_INBOX not set)");
  const r = await fetch(`${process.env.RESEND_API_BASE || "https://api.resend.com"}/emails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.LEAD_FROM_EMAIL, to: m.to, subject: m.subject, html: m.html, text: m.text, ...(m.replyTo ? { reply_to: m.replyTo } : {}) }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const serviceName = (s: string) => (s === "not-sure" ? "Not sure yet" : (ALL_SERVICES.find((x) => x.slug === s)?.name ?? s));
const industryName = (s?: string | null) => (s ? (s === "other" ? "Other" : (INDUSTRIES.find((x) => x.slug === s)?.name ?? s)) : "");

export type LeadForMail = {
  id: number;
  kind: "quote" | "contact";
  ticketNo: string | null;
  name: string;
  company?: string | null;
  email: string;
  mobile?: string | null;
  channel?: string | null;
  services?: string[];
  industry?: string | null;
  products?: string[];
  eventDate?: string | null;
  venue?: string | null;
  qtySizes?: string | null;
  budgetBand?: string | null;
  notes?: string | null;
  files?: { filename: string; size: number }[];
  utm?: string | null;
  landingPage?: string | null;
};

function rows(l: LeadForMail): [string, string][] {
  const r: [string, string][] = [];
  const add = (k: string, v?: string | null) => v && r.push([k, v]);
  add("Ticket", l.ticketNo);
  add("Services", l.services?.map(serviceName).join(", "));
  add("Industry", industryName(l.industry));
  add("Products", l.products?.map((p) => productBySlug(p)?.name ?? p).join(", "));
  add("Date", l.eventDate);
  add("Venue / location", l.venue);
  add("Quantity / sizes", l.qtySizes);
  add("Budget band", l.budgetBand);
  add(l.kind === "contact" ? "Message" : "Notes", l.notes);
  add("Files", l.files?.length ? l.files.map((f) => `${f.filename} (${(f.size / 1048576).toFixed(1)} MB)`).join(", ") : null);
  return r;
}

function layout(title: string, inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#F4F7FB;font-family:Arial,Helvetica,sans-serif;color:#0B1B33">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7FB;padding:24px 0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #D5DEE9">
<tr><td style="background:#005AA9;color:#ffffff;padding:20px 24px;font-size:20px;font-weight:bold">${esc(title)}</td></tr>
<tr><td style="height:6px;line-height:6px;font-size:0;background:linear-gradient(90deg,#00A3E0 25%,#E6007E 25% 50%,#FFC20E 50% 75%,#0B1B33 75%)">&nbsp;</td></tr>
<tr><td style="padding:24px;font-size:15px;line-height:1.6">${inner}</td></tr>
<tr><td style="background:#00306B;color:#8DBCE7;padding:14px 24px;font-size:12px;letter-spacing:2px">GRAPHICS LIBRARY INCORPORATED · SINCE 1996</td></tr>
</table></td></tr></table></body></html>`;
}

const table = (r: [string, string][]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:12px 0">${r
    .map(([k, v]) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #D5DEE9;color:#56606E;width:150px;vertical-align:top">${esc(k)}</td><td style="padding:6px 8px;border-bottom:1px solid #D5DEE9;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("")}</table>`;

/** Auto-reply to the client (Document 4 §10). No unconfirmed promises or placeholder numbers. */
export function autoReply(l: LeadForMail): Mail {
  const first = l.name.split(/\s+/)[0];
  const r = rows(l);
  const when = responsePromise();
  if (l.kind === "quote") {
    const subject = `Your GLI job ticket ${l.ticketNo}`;
    const lead = `Hi ${first}, thanks for your job ticket. Here's a copy of what you sent us.`;
    const next = `A producer will be in touch${when}. Reply to this email if anything changes.`;
    return {
      to: [l.email],
      subject,
      html: layout(subject, `<p>${esc(lead)}</p>${table(r)}<p>${esc(next)}</p><p>The GLI team<br>Graphics Library, Inc. · Since 1996</p>`),
      text: `${lead}\n\n${r.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${next}\n\nThe GLI team\nGraphics Library, Inc. · Since 1996`,
      replyTo: salesInbox()[0],
    };
  }
  const subject = "Thanks for contacting GLI";
  const body = `Hi ${first}, thanks for your message. A member of our team will get back to you${when}.`;
  return {
    to: [l.email],
    subject,
    html: layout(subject, `<p>${esc(body)}</p>${table(r)}<p>The GLI team<br>Graphics Library, Inc. · Since 1996</p>`),
    text: `${body}\n\n${r.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nThe GLI team\nGraphics Library, Inc. · Since 1996`,
    replyTo: salesInbox()[0],
  };
}

/** Internal notification to the sales inbox with every field and a link to the lead in the admin. */
export function salesNotify(l: LeadForMail): Mail {
  const what = l.kind === "quote" ? `New job ticket ${l.ticketNo}` : "New enquiry";
  const subject = `${what}: ${l.company || l.name}${l.services?.length ? ` · ${l.services.map(serviceName).join(", ")}` : ""}`.slice(0, 150);
  const contact: [string, string][] = [
    ["Name", l.name],
    ...(l.company ? [["Company", l.company] as [string, string]] : []),
    ["Email", l.email],
    ...(l.mobile ? [["Mobile", l.mobile] as [string, string]] : []),
    ...(l.channel ? [["Preferred channel", l.channel] as [string, string]] : []),
    ...(l.utm ? [["Source", l.utm] as [string, string]] : []),
    ...(l.landingPage ? [["Landing page", l.landingPage] as [string, string]] : []),
  ];
  const link = `${siteUrl()}/admin/leads/${l.id}`;
  return {
    to: salesInbox(),
    subject,
    html: layout(what, `${table(contact)}${table(rows(l))}<p><a href="${esc(link)}" style="color:#005AA9;font-weight:bold">Open in the GLI admin</a></p>`),
    text: `${[...contact, ...rows(l)].map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nAdmin: ${link}`,
    replyTo: l.email,
  };
}

/** Team alert (Slack-compatible webhook; Viber bot later). No email/phone in the alert. */
export function teamAlert(l: LeadForMail) {
  const text = `${l.kind === "quote" ? `New job ticket ${l.ticketNo}` : "New enquiry"} from ${l.company || l.name}${
    l.services?.length ? ` (${l.services.map(serviceName).join(", ")})` : ""
  }. Open: ${siteUrl()}/admin/leads/${l.id}`;
  return { text };
}

export const contactFallback = () => CONTACT.email.value;
