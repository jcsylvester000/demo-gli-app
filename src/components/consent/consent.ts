export const CONSENT_KEY = "gli_consent_v1";
export const CONSENT_EVENT = "gli:open-consent";

export type Consent = { analytics: boolean; at: string };

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    return typeof c.analytics === "boolean" ? c : null;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): Consent {
  const c: Consent = { analytics, at: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* storage blocked: choice applies to this page view only */
  }
  return c;
}
