"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { submitContact } from "@/app/actions/leads";
import { MSG, mobileOk } from "@/lib/lead-schema";
import { readAttribution } from "@/lib/attribution";
import { buttonClass } from "@/components/ui/button";
import { Turnstile } from "./turnstile";
import { FieldError } from "./field-error";

const field = "mt-1.5 block w-full min-h-12 rounded-[var(--radius)] border border-gli-line bg-white px-3.5 text-base aria-[invalid=true]:border-danger";

/** Short contact form for non-project enquiries (BRD FR-071): same pipeline as the job ticket, tagged "contact". */
export function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", mobile: "", message: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof typeof v, val: string | boolean) => {
    setV((p) => ({ ...p, [k]: val }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };
  const err = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `c-${k}-error` } : {});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (v.name.trim().length < 2) x.name = MSG.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) x.email = MSG.email;
    if (v.mobile.trim() && !mobileOk(v.mobile)) x.mobile = MSG.mobile;
    if (v.message.trim().length < 5) x.message = MSG.message;
    if (!v.consent) x.consent = MSG.consent;
    if (Object.keys(x).length) return setErrors(x);
    setState("sending");
    setServerError(null);
    const a = readAttribution();
    const r = await submitContact({
      ...v,
      consent: v.consent as true,
      turnstileToken: token,
      website,
      utmSource: a?.utmSource ?? null,
      utmMedium: a?.utmMedium ?? null,
      utmCampaign: a?.utmCampaign ?? null,
      landingPage: a?.landingPage ?? null,
    }).catch(() => ({ ok: false as const, error: "Something went wrong on our side. Please try again in a moment." }));
    if (r.ok) return setState("sent");
    setState("idle");
    setServerError(r.error);
    if ("fieldErrors" in r && r.fieldErrors) setErrors(r.fieldErrors);
  };

  if (state === "sent")
    return (
      <div role="status" className="rounded-[var(--radius)] border border-gli-blue bg-gli-tint p-6">
        <p className="font-heading text-xl font-semibold text-gli-navy">Thanks, {v.name.trim().split(/\s+/)[0]}. Your message is in.</p>
        <p className="mt-2">A copy is on its way to {v.email.trim()}. Have a project in mind? A job ticket gets you a faster, more complete reply.</p>
        <Link href="/quote" className={buttonClass("primary", "md", "mt-4")}>
          Start a job ticket
        </Link>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-heading font-semibold text-gli-navy">Name</span>
          <input name="name" className={field} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} maxLength={120} {...err("name")} />
          <FieldError id="c-name-error" msg={errors.name} />
        </label>
        <label className="block">
          <span className="font-heading font-semibold text-gli-navy">Email</span>
          <input name="email" type="email" inputMode="email" autoComplete="email" className={field} value={v.email} onChange={(e) => set("email", e.target.value)} maxLength={200} {...err("email")} />
          <FieldError id="c-email-error" msg={errors.email} />
        </label>
      </div>
      <label className="block">
        <span className="font-heading font-semibold text-gli-navy">
          Mobile <span className="font-normal text-gli-slate">(optional)</span>
        </span>
        <input name="mobile" type="tel" inputMode="tel" autoComplete="tel" className={field} value={v.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="0917 123 4567" maxLength={30} {...err("mobile")} />
        <FieldError id="c-mobile-error" msg={errors.mobile} />
      </label>
      <label className="block">
        <span className="font-heading font-semibold text-gli-navy">Message</span>
        <textarea name="message" className={`${field} min-h-36 py-3`} value={v.message} onChange={(e) => set("message", e.target.value)} maxLength={4000} {...err("message")} />
        <FieldError id="c-message-error" msg={errors.message} />
      </label>
      <div>
        <label className="flex items-start gap-3">
          <input name="consent" type="checkbox" className="mt-1 size-5 shrink-0 accent-gli-blue" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} {...err("consent")} />
          <span>
            I agree that Graphics Library, Inc. may use my details to respond to this enquiry, as described in the{" "}
            <Link href="/privacy" className="font-semibold text-gli-blue underline underline-offset-4">
              Privacy Notice
            </Link>
            .
          </span>
        </label>
        <FieldError id="c-consent-error" msg={errors.consent} />
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Leave this empty <input name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <Turnstile onToken={setToken} />
      {serverError ? (
        <p role="alert" className="font-semibold text-danger">
          {serverError}
        </p>
      ) : null}
      <button type="submit" disabled={state === "sending"} className={buttonClass("primary", "lg")}>
        {state === "sending" ? (
          <>
            <Loader2 aria-hidden="true" className="size-5 animate-spin" /> Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
