"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { subscribeNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { buttonClass } from "@/components/ui/button";

/** Show Floor Notes sign-up (Document 4 §8). Separate, explicit consent; stored with timestamp and version. */
export function NewsletterBox({ title, body, note, page }: { title: string; body: string; note: string; page: string }) {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribeNewsletter, { status: "idle" });
  return (
    <section aria-labelledby="nl-title" className="relative rounded-[var(--radius)] border-2 border-dashed border-gli-signal/60 bg-gli-tint p-6 md:p-8">
      <h2 id="nl-title" className="text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-gli-ink">{body}</p>
      {state.status === "ok" ? (
        <p role="status" className="mt-5 font-heading text-lg font-semibold text-gli-navy">
          {state.message}
        </p>
      ) : (
        <form
          className="mt-5 space-y-3"
          noValidate
          onSubmit={(e) => {
            e.preventDefault(); // keep the typed email if the server returns an error
            const fd = new FormData(e.currentTarget);
            startTransition(() => action(fd));
          }}
        >
          <input type="hidden" name="page" value={page} />
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>
              Leave this empty <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="nl-email">
              Work email
            </label>
            <input
              id="nl-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@company.com"
              aria-invalid={state.status === "error" || undefined}
              aria-describedby={state.status === "error" ? "nl-error" : undefined}
              className="min-h-12 flex-1 rounded-[var(--radius)] border border-gli-line bg-white px-4 text-base"
            />
            <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
              {pending ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          <label className="flex items-start gap-3 text-[0.9375rem]">
            <input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0 accent-gli-blue" />
            <span>
              Send me Show Floor Notes (4 emails a year). I can unsubscribe at any time. See the{" "}
              <Link href="/privacy" className="font-semibold text-gli-blue underline underline-offset-4">
                Privacy Notice
              </Link>
              .
            </span>
          </label>
          {state.status === "error" ? (
            <p id="nl-error" role="alert" className="text-[0.9375rem] font-semibold text-danger">
              {state.message}
            </p>
          ) : null}
          <p className="text-[0.875rem] text-gli-slate">{note}</p>
        </form>
      )}
    </section>
  );
}
