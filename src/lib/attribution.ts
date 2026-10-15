/** First-touch attribution kept for the browser session: UTM source/medium/campaign + landing page path (no query PII). */
const KEY = "gli_attr_v1";
export type Attribution = { utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; landingPage: string };

export function captureAttribution() {
  try {
    if (window.sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const clip = (v: string | null) => (v ? v.slice(0, 120) : null);
    const a: Attribution = { utmSource: clip(q.get("utm_source")), utmMedium: clip(q.get("utm_medium")), utmCampaign: clip(q.get("utm_campaign")), landingPage: window.location.pathname.slice(0, 300) };
    window.sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* storage blocked */
  }
}

export function readAttribution(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}
