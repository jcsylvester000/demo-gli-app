// Netlify Scheduled Function: retries queued lead emails/alerts every 15 minutes (BRD FR-064 "queued retry").
// Needs CRON_SECRET (16+ random characters) in Netlify environment variables.
export default async () => {
  const base = process.env.URL;
  if (!base || !process.env.CRON_SECRET) return new Response("not configured", { status: 200 });
  const r = await fetch(`${base}/api/outbox/run`, { method: "POST", headers: { "x-cron-secret": process.env.CRON_SECRET } });
  return new Response(await r.text(), { status: r.status });
};

export const config = { schedule: "*/15 * * * *" };
