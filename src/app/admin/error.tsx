"use client";

/** Admin error boundary: e.g. the database is unreachable. Keeps the page titled, landmarked and recoverable. */
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-gli-mist px-4">
      <title>Admin unavailable | GLI</title>
      <div className="w-full max-w-md rounded-[var(--radius)] border border-gli-line bg-white p-6 shadow-sm">
        <h1 className="text-2xl">Admin is temporarily unavailable</h1>
        <p className="mt-3 text-gli-slate">We couldn&apos;t reach the database. No data was changed. Please try again in a minute; if it keeps happening, check the site&apos;s health page or contact your developer.</p>
        <button type="button" onClick={reset} className="mt-5 inline-flex min-h-11 items-center rounded-[var(--radius)] bg-gli-blue px-5 font-heading font-semibold text-white hover:bg-gli-navy">
          Try again
        </button>
      </div>
    </main>
  );
}
