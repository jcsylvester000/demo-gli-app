import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | GLI Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Admin sign-in needs these server settings; without them Better Auth fails closed, so say exactly what is missing. */
function missingSettings(): string[] {
  const missing: string[] = [];
  if ((process.env.BETTER_AUTH_SECRET || "").length < 32) missing.push("BETTER_AUTH_SECRET (32+ random characters)");
  if (!process.env.BETTER_AUTH_URL) missing.push("BETTER_AUTH_URL (this site's address, e.g. https://gli-website.netlify.app)");
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL (Neon pooled connection string)");
  return missing;
}

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  const missing = missingSettings();
  if (missing.length) {
    return (
      <div className="grid min-h-dvh place-items-center bg-gli-mist px-4">
        <div className="w-full max-w-lg rounded-[var(--radius)] border border-gli-line bg-white p-6 shadow-sm">
          <h1 className="text-2xl">Admin sign-in isn&apos;t set up yet</h1>
          <p className="mt-3 text-gli-slate">The site is missing these settings. Add them in Netlify → Site configuration → Environment variables, then redeploy:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 font-mono text-[0.875rem] text-gli-ink">
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className="mt-4 text-[0.875rem] text-gli-slate">The public website is not affected. See README → Deploy for details.</p>
        </div>
      </div>
    );
  }
  return <div className="min-h-dvh bg-gli-mist">{children}</div>;
}
