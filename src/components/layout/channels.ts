import { CONTACT, links } from "@/content/site";
import type { GliEvent } from "@/lib/analytics/track";

export type Channel = { key: string; label: string; href: string; event: GliEvent; external: boolean };

/** Chat/contact channels that have confirmed values. Placeholders are never rendered as links. */
export function chatChannels(): Channel[] {
  const out: Channel[] = [];
  const v = links.viber();
  if (v) out.push({ key: "viber", label: "Viber", href: v, event: "chat_click", external: true });
  const m = links.messenger();
  if (m) out.push({ key: "messenger", label: "Messenger", href: m, event: "chat_click", external: true });
  const w = links.whatsapp();
  if (w) out.push({ key: "whatsapp", label: "WhatsApp", href: w, event: "chat_click", external: true });
  const e = links.email();
  if (e) out.push({ key: "email", label: "Email", href: e, event: "email_click", external: false });
  return out;
}

export const hoursText = () => (CONTACT.hours.pending ? "" : CONTACT.hours.value);
