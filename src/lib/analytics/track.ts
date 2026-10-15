/**
 * GA4 events via the GTM dataLayer (BRD FR-100). Pushing is harmless before consent: GTM itself only
 * loads after the visitor accepts analytics, and Consent Mode v2 defaults to denied.
 */
export type GliEvent =
  | "quote_start"
  | "quote_step"
  | "file_upload"
  | "quote_submit"
  | "chat_click"
  | "phone_click"
  | "email_click"
  | "add_to_quote"
  | "case_view";

export function track(event: GliEvent, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
