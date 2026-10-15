"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, FileUp, Loader2, X } from "lucide-react";
import { submitQuote } from "@/app/actions/leads";
import { ALL_SERVICES, INDUSTRIES } from "@/content/site";
import { PRODUCTS } from "@/content/products";
import { BUDGET_BANDS, CHANNELS, MSG, mobileOk } from "@/lib/lead-schema";
import { ACCEPT_ATTR, MAX_FILES, checkFile } from "@/lib/uploads";
import { readAttribution } from "@/lib/attribution";
import { readCart, removeFromCart, QUOTE_CART_KEY } from "@/lib/quote-cart";
import { track } from "@/lib/analytics/track";
import { buttonClass } from "@/components/ui/button";
import { RegMark } from "@/components/brand/print-marks";
import { Turnstile } from "./turnstile";
import { FieldError } from "./field-error";
import { cn } from "@/lib/utils";

/**
 * S8 Job-Ticket Quote Form (Segmented Progress Pill Stepper + File Upload, MIT; rebuilt).
 * BRD FR-060 to FR-065 and Workflow 9.2: 4 steps (Need, Specs, Files, Contact); step 2 adapts to the services
 * picked; files upload privately in 4 MB parts while the visitor continues; Back/Next keeps every entry.
 */

const STEPS = ["What you need", "Job specs", "Files", "Contact"] as const;
const EVENTISH = ["events-conventions-and-launches", "booth-design-and-fabrication", "avp-interactive-games-and-apps"];
const DRAFT_KEY = "gli_quote_draft_v1";

type Upload = { key: string; name: string; size: number; status: "uploading" | "ready" | "error"; progress: number; id?: string; error?: string };
type Data = {
  services: string[];
  industry: string;
  products: string[];
  eventDate: string;
  venue: string;
  qtySizes: string;
  budgetBand: string;
  notes: string;
  name: string;
  company: string;
  email: string;
  mobile: string;
  channel: (typeof CHANNELS)[number];
  consent: boolean;
  newsletter: boolean;
};
const EMPTY: Data = {
  services: [],
  industry: "",
  products: [],
  eventDate: "",
  venue: "",
  qtySizes: "",
  budgetBand: "",
  notes: "",
  name: "",
  company: "",
  email: "",
  mobile: "",
  channel: "Call",
  consent: false,
  newsletter: false,
};

const fmtMb = (b: number) => `${(b / 1048576).toFixed(b < 1048576 ? 2 : 1)} MB`;
const field = "mt-1.5 block w-full min-h-12 rounded-[var(--radius)] border border-gli-line bg-white px-3.5 text-base text-gli-ink aria-[invalid=true]:border-danger";
const label = "font-heading font-semibold text-gli-navy";

export function JobTicketForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Data>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const [dragOver, setDragOver] = useState(false);

  // Prefill: ?service= from service-page CTAs, products from "Add to quote", and any saved draft.
  useEffect(() => {
    let next = { ...EMPTY };
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (raw) next = { ...next, ...(JSON.parse(raw) as Partial<Data>), consent: false };
    } catch {
      /* ignore */
    }
    const svc = new URLSearchParams(window.location.search).get("service");
    if (svc && ALL_SERVICES.some((s) => s.slug === svc) && !next.services.includes(svc)) next.services = [...next.services, svc];
    next.products = [...new Set([...next.products, ...readCart()])].filter((p) => PRODUCTS.some((x) => x.slug === p));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from URL + session storage
    setD(next);
  }, []);

  // Save a draft (without consent) so a reload doesn't lose entries; cleared on submit.
  useEffect(() => {
    try {
      const rest: Partial<Data> = { ...d };
      delete rest.consent;
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
  }, [d]);

  // Move focus to the step heading on step change (not on first load).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    if (!started.current) {
      started.current = true;
      track("quote_start");
    }
    setD((p) => ({ ...p, [k]: v }));
    setErrors((e) => {
      if (!e[k]) return e;
      const n = { ...e };
      delete n[k];
      return n;
    });
  };
  const toggle = (k: "services" | "products", v: string) => set(k, d[k].includes(v) ? d[k].filter((x) => x !== v) : [...d[k], v]);

  const eventish = d.services.some((s) => EVENTISH.includes(s));
  const boothOnly = d.services.includes("booth-design-and-fabrication");
  const uploading = uploads.some((u) => u.status === "uploading");

  const validate = useCallback(
    (s: number) => {
      const e: Record<string, string> = {};
      if (s === 0 && !d.services.length) e.services = MSG.service;
      if (s === 3) {
        if (d.name.trim().length < 2) e.name = MSG.name;
        if (!d.company.trim()) e.company = MSG.company;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = MSG.email;
        if (!mobileOk(d.mobile)) e.mobile = MSG.mobile;
        if (!d.consent) e.consent = MSG.consent;
      }
      return e;
    },
    [d],
  );

  const go = (to: number) => {
    if (to > step) {
      const e = validate(step);
      if (Object.keys(e).length) {
        setErrors(e);
        return;
      }
      if (step === 2 && uploading) {
        setErrors({ files: "Please wait for your files to finish uploading, or remove them." });
        return;
      }
      track("quote_step", { step: to + 1, step_name: STEPS[to] });
    }
    setErrors({});
    setStep(to);
  };

  // ---- Uploads (private, chunked) ----
  const patch = (key: string, p: Partial<Upload>) => setUploads((list) => list.map((u) => (u.key === key ? { ...u, ...p } : u)));

  const uploadOne = async (file: File, key: string) => {
    try {
      const init = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, size: file.size }) });
      const j = await init.json();
      if (!init.ok) throw new Error(j.error || "Upload failed. Please try again.");
      patch(key, { id: j.id });
      for (let i = 0; i < j.parts; i++) {
        const chunk = file.slice(i * j.chunkBytes, Math.min(file.size, (i + 1) * j.chunkBytes));
        let res: Response | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          res = await fetch(`/api/upload/${j.id}/${i}`, { method: "PUT", headers: { "Content-Type": "application/octet-stream" }, body: chunk });
          if (res.ok || res.status === 415 || res.status === 404) break;
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        }
        if (!res?.ok) throw new Error((await res?.json().catch(() => null))?.error || "Upload failed. Please try again.");
        patch(key, { progress: Math.round(((i + 1) / j.parts) * 100) });
      }
      patch(key, { status: "ready", progress: 100 });
      track("file_upload", { file_type: file.name.split(".").pop()?.toLowerCase() ?? "", size_mb: Math.round(file.size / 104857.6) / 10 });
    } catch (err) {
      patch(key, { status: "error", error: (err as Error).message });
    }
  };

  const addFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    setErrors((e) => ({ ...e, files: "" }));
    const room = MAX_FILES - uploads.filter((u) => u.status !== "error").length;
    if (list.length > room) setErrors((e) => ({ ...e, files: `You can attach up to ${MAX_FILES} files. Send a link in the notes for more.` }));
    list.slice(0, Math.max(0, room)).forEach((file) => {
      const key = `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`;
      const problem = checkFile(file.name, file.size);
      if (problem) {
        setUploads((u) => [...u, { key, name: file.name, size: file.size, status: "error", progress: 0, error: problem }]);
        return;
      }
      setUploads((u) => [...u, { key, name: file.name, size: file.size, status: "uploading", progress: 0 }]);
      void uploadOne(file, key);
    });
  };

  const removeUpload = (u: Upload) => {
    setUploads((list) => list.filter((x) => x.key !== u.key));
    if (u.id) void fetch(`/api/upload/${u.id}`, { method: "DELETE" });
  };

  // ---- Submit ----
  const submit = async () => {
    const e = validate(3);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (!token) {
      setServerError("Please complete the security check.");
      return;
    }
    setSubmitting(true);
    setServerError(null);
    const attr = readAttribution();
    const r = await submitQuote({
      ...d,
      industry: (d.industry || null) as never,
      budgetBand: (d.budgetBand || null) as never,
      services: d.services as never,
      eventDate: d.eventDate || null,
      consent: d.consent as true,
      uploadIds: uploads.filter((u) => u.status === "ready" && u.id).map((u) => u.id!),
      turnstileToken: token,
      website,
      utmSource: attr?.utmSource ?? null,
      utmMedium: attr?.utmMedium ?? null,
      utmCampaign: attr?.utmCampaign ?? null,
      landingPage: attr?.landingPage ?? null,
    }).catch(() => ({ ok: false as const, error: "Something went wrong on our side. Your details are still in the form; please try again in a moment." }));
    if (r.ok) {
      try {
        window.sessionStorage.setItem("gli_last_ticket", JSON.stringify({ ticket: r.ticket, first: d.name.trim().split(/\s+/)[0], email: d.email.trim() }));
        window.sessionStorage.removeItem(DRAFT_KEY);
        window.sessionStorage.removeItem(QUOTE_CART_KEY);
        d.products.forEach(removeFromCart);
      } catch {
        /* ignore */
      }
      router.push(`/quote/thank-you?t=${encodeURIComponent(r.ticket ?? "")}`);
      return;
    }
    setSubmitting(false);
    setServerError(r.error);
    if ("fieldErrors" in r && r.fieldErrors) {
      setErrors(r.fieldErrors);
      const first = Object.keys(r.fieldErrors)[0];
      const stepOf: Record<string, number> = { services: 0, industry: 0, products: 0, eventDate: 1, venue: 1, qtySizes: 1, budgetBand: 1, notes: 1, uploadIds: 2 };
      setStep(stepOf[first] ?? 3);
    }
  };

  const errorList = useMemo(() => Object.entries(errors).filter(([, v]) => v), [errors]);
  const err = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  const svcName = (s: string) => (s === "not-sure" ? "Not sure yet" : (ALL_SERVICES.find((x) => x.slug === s)?.name ?? s));

  return (
    <div className="grid gap-0 overflow-hidden rounded-[var(--radius)] border border-gli-line bg-white shadow-[0_24px_50px_-30px_rgb(0_48_107/0.55)] lg:grid-cols-[1fr_19rem]">
      {/* Ticket body */}
      <div className="min-w-0">
        <div className="on-dark flex flex-wrap items-center justify-between gap-2 bg-gli-navy px-5 py-3 text-white md:px-7">
          <p className="eyebrow text-gli-yellow">Job ticket</p>
          <p className="tabular font-heading text-[0.9375rem] text-gli-sky">No. GLI-____-#### · assigned on submit</p>
        </div>

        {/* Stepper pills */}
        <nav aria-label="Job ticket steps" className="border-b border-gli-line px-5 py-4 md:px-7">
          <ol className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {STEPS.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <li key={s}>
                  <button
                    type="button"
                    disabled={i > step}
                    onClick={() => i < step && go(i)}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border px-2 text-[0.8125rem] font-semibold sm:text-[0.875rem]",
                      current && "border-gli-blue bg-gli-blue text-white",
                      done && "border-gli-blue bg-gli-tint text-gli-navy hover:bg-white",
                      !current && !done && "border-gli-line text-gli-slate",
                    )}
                  >
                    {done ? <Check aria-hidden="true" className="size-4" /> : <span className="tabular">{i + 1}</span>}
                    <span className="max-sm:sr-only">{s}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="sr-only" aria-live="polite">
            Step {step + 1} of 4: {STEPS[step]}
          </p>
        </nav>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) go(step + 1);
            else void submit();
          }}
          className="px-5 py-6 md:px-7 md:py-8"
        >
          {errorList.length > 1 ? (
            <div role="alert" className="mb-6 rounded-[var(--radius)] border border-danger/40 bg-white p-4 text-[0.9375rem]">
              <p className="font-semibold text-danger">Please fix {errorList.length} things:</p>
              <ul className="mt-1 list-disc pl-5">
                {errorList.map(([k, v]) => (
                  <li key={k}>
                    <a href={`#f-${k}`} className="underline">
                      {v}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <h2 ref={headingRef} tabIndex={-1} className="text-2xl outline-none md:text-[1.75rem]">
            {["What do you need?", "Job specs", "Files", "Your contact details"][step]}
          </h2>

          {/* STEP 1 */}
          <div hidden={step !== 0} className="mt-6 space-y-8">
            <fieldset id="f-services" {...err("services")}>
              <legend className={label}>
                Which services? <span className="font-normal text-gli-slate">(choose all that apply; required)</span>
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[...ALL_SERVICES.map((s) => ({ slug: s.slug, name: s.name })), { slug: "not-sure", name: "Not sure yet" }].map((s) => (
                  <label
                    key={s.slug}
                    className={cn(
                      "flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--radius)] border px-3.5 py-2",
                      d.services.includes(s.slug) ? "border-gli-blue bg-gli-tint" : "border-gli-line hover:border-gli-signal",
                    )}
                  >
                    <input type="checkbox" className="size-5 shrink-0 accent-gli-blue" checked={d.services.includes(s.slug)} onChange={() => toggle("services", s.slug)} />
                    <span>{s.name}</span>
                  </label>
                ))}
              </div>
              <FieldError id="services-error" msg={errors.services} />
            </fieldset>

            <fieldset>
              <legend className={label}>Your industry</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {[...INDUSTRIES.map((i) => ({ slug: i.slug as string, name: i.name as string })), { slug: "other", name: "Other" }].map((i) => (
                  <label
                    key={i.slug}
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5",
                      d.industry === i.slug ? "border-gli-blue bg-gli-tint" : "border-gli-line hover:border-gli-signal",
                    )}
                  >
                    <input type="radio" name="industry" className="size-4 accent-gli-blue" checked={d.industry === i.slug} onChange={() => set("industry", i.slug)} />
                    {i.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <p className={label}>Items from our catalogue</p>
              {d.products.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {d.products.map((slug) => (
                    <li key={slug} className="inline-flex min-h-10 items-center gap-1 rounded-full border border-gli-blue bg-gli-tint pl-3.5 pr-1 text-[0.9375rem] font-semibold text-gli-navy">
                      {PRODUCTS.find((p) => p.slug === slug)?.name ?? slug}
                      <button
                        type="button"
                        onClick={() => {
                          toggle("products", slug);
                          removeFromCart(slug);
                        }}
                        className="grid size-8 place-items-center rounded-full hover:bg-white"
                        aria-label={`Remove ${PRODUCTS.find((p) => p.slug === slug)?.name ?? slug}`}
                      >
                        <X aria-hidden="true" className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[0.9375rem] text-gli-slate">
                  Picked a product from our{" "}
                  <Link href="/products" className="font-semibold text-gli-blue underline underline-offset-4">
                    catalogue
                  </Link>
                  ? It will appear here.
                </p>
              )}
            </div>
          </div>

          {/* STEP 2 */}
          <div hidden={step !== 1} className="mt-6 space-y-6">
            {eventish ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className={label}>
                    Event or launch date <span className="font-normal text-gli-slate">(optional)</span>
                  </span>
                  <input type="date" className={field} value={d.eventDate} onChange={(e) => set("eventDate", e.target.value)} />
                </label>
                <label className="block">
                  <span className={label}>Venue or delivery location</span>
                  <input type="text" className={field} value={d.venue} onChange={(e) => set("venue", e.target.value)} placeholder="e.g. SMX Convention Center, Pasay" maxLength={200} />
                </label>
              </div>
            ) : (
              <label className="block">
                <span className={label}>Delivery location</span>
                <input type="text" className={field} value={d.venue} onChange={(e) => set("venue", e.target.value)} placeholder="e.g. Makati office" maxLength={200} />
              </label>
            )}
            <label className="block">
              <span className={label}>{boothOnly ? "Booth size" : "Quantity / sizes"}</span>
              <input
                type="text"
                className={field}
                value={d.qtySizes}
                onChange={(e) => set("qtySizes", e.target.value)}
                placeholder={boothOnly ? "e.g. 6 × 3 m island" : "e.g. 500 brochures, A4; 2 pull-ups"}
                maxLength={300}
              />
            </label>
            <fieldset>
              <legend className={label}>Budget band</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {BUDGET_BANDS.map((b) => (
                  <label
                    key={b}
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5",
                      d.budgetBand === b ? "border-gli-blue bg-gli-tint" : "border-gli-line hover:border-gli-signal",
                    )}
                  >
                    <input type="radio" name="budget" className="size-4 accent-gli-blue" checked={d.budgetBand === b} onChange={() => set("budgetBand", b)} />
                    {b}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block">
              <span className={label}>Tell us about the job</span>
              <span className="block text-[0.9375rem] text-gli-slate">What, who it&apos;s for, anything we must know.</span>
              <textarea className={cn(field, "min-h-36 py-3")} value={d.notes} onChange={(e) => set("notes", e.target.value)} maxLength={4000} />
            </label>
          </div>

          {/* STEP 3 */}
          <div hidden={step !== 2} className="mt-6 space-y-4" id="f-files">
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed px-6 py-10 text-center transition-colors",
                dragOver ? "border-gli-blue bg-gli-tint" : "border-gli-signal/60 bg-gli-mist hover:border-gli-blue",
              )}
            >
              <FileUp aria-hidden="true" className="size-8 text-gli-blue" />
              <span className="font-heading text-lg font-semibold text-gli-navy">Drop your brief, artwork or floor plan here, or browse.</span>
              <span className="text-[0.9375rem] text-gli-slate">PDF, AI, PSD, JPG, PNG, ZIP · up to 25 MB each · stored privately</span>
              <input
                type="file"
                multiple
                accept={ACCEPT_ATTR}
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            {errors.files ? (
              <p id="files-error" role="alert" className="text-[0.9375rem] font-semibold text-danger">
                {errors.files}
              </p>
            ) : null}
            {uploads.length ? (
              <ul className="divide-y divide-gli-line rounded-[var(--radius)] border border-gli-line" aria-label="Attached files">
                {uploads.map((u) => (
                  <li key={u.key} className="flex items-center gap-3 px-4 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{u.name}</span>
                      <span className="block text-[0.875rem] text-gli-slate">
                        {fmtMb(u.size)} ·{" "}
                        {u.status === "ready" ? (
                          <span className="font-semibold text-gli-blue">Uploaded</span>
                        ) : u.status === "error" ? (
                          <span className="font-semibold text-danger">{u.error}</span>
                        ) : (
                          `Uploading ${u.progress}%`
                        )}
                      </span>
                      {u.status === "uploading" ? (
                        <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-gli-line" role="progressbar" aria-valuenow={u.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Uploading ${u.name}`}>
                          <span className="block h-full bg-gli-blue transition-[width]" style={{ width: `${Math.max(4, u.progress)}%` }} />
                        </span>
                      ) : null}
                    </span>
                    {u.status === "uploading" ? <Loader2 aria-hidden="true" className="size-5 animate-spin text-gli-blue" /> : null}
                    <button type="button" onClick={() => removeUpload(u)} className="grid size-10 place-items-center rounded-full text-gli-slate hover:bg-gli-mist hover:text-gli-ink" aria-label={`Remove ${u.name}`}>
                      <X aria-hidden="true" className="size-5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="text-[0.9375rem] text-gli-slate">No files yet? That&apos;s fine. Skip this step.</p>
          </div>

          {/* STEP 4 */}
          <div hidden={step !== 3} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block" id="f-name">
                <span className={label}>Full name</span>
                <input type="text" autoComplete="name" className={field} value={d.name} onChange={(e) => set("name", e.target.value)} maxLength={120} {...err("name")} />
                <FieldError id="name-error" msg={errors.name} />
              </label>
              <label className="block" id="f-company">
                <span className={label}>Company</span>
                <input type="text" autoComplete="organization" className={field} value={d.company} onChange={(e) => set("company", e.target.value)} maxLength={160} {...err("company")} />
                <FieldError id="company-error" msg={errors.company} />
              </label>
              <label className="block" id="f-email">
                <span className={label}>Work email</span>
                <input type="email" autoComplete="email" inputMode="email" className={field} value={d.email} onChange={(e) => set("email", e.target.value)} maxLength={200} {...err("email")} />
                <FieldError id="email-error" msg={errors.email} />
              </label>
              <label className="block" id="f-mobile">
                <span className={label}>Mobile</span>
                <input type="tel" autoComplete="tel" inputMode="tel" className={field} value={d.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="0917 123 4567" maxLength={30} {...err("mobile")} />
                <FieldError id="mobile-error" msg={errors.mobile} />
              </label>
            </div>
            <fieldset>
              <legend className={label}>Preferred channel</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {CHANNELS.map((c) => (
                  <label key={c} className={cn("inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5", d.channel === c ? "border-gli-blue bg-gli-tint" : "border-gli-line hover:border-gli-signal")}>
                    <input type="radio" name="channel" className="size-4 accent-gli-blue" checked={d.channel === c} onChange={() => set("channel", c)} />
                    {c}
                  </label>
                ))}
              </div>
            </fieldset>
            <div id="f-consent">
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 size-5 shrink-0 accent-gli-blue" checked={d.consent} onChange={(e) => set("consent", e.target.checked)} {...err("consent")} />
                <span>
                  I agree that Graphics Library, Inc. may use my details to respond to this request, as described in the{" "}
                  <Link href="/privacy" target="_blank" className="font-semibold text-gli-blue underline underline-offset-4">
                    Privacy Notice
                  </Link>
                  . <span className="text-gli-slate">(required)</span>
                </span>
              </label>
              <FieldError id="consent-error" msg={errors.consent} />
            </div>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 size-5 shrink-0 accent-gli-blue" checked={d.newsletter} onChange={(e) => set("newsletter", e.target.checked)} />
              <span>Send me Show Floor Notes (4 emails a year). Optional.</span>
            </label>
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label>
                Leave this empty <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>
            {step === 3 ? <Turnstile onToken={setToken} /> : null}
          </div>

          {serverError ? (
            <p role="alert" className="mt-6 rounded-[var(--radius)] border border-danger/40 bg-white p-4 font-semibold text-danger">
              {serverError}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-gli-line pt-6">
            {step > 0 ? (
              <button type="button" onClick={() => go(step - 1)} className={buttonClass("secondary", "lg")}>
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button type="submit" className={buttonClass("primary", "lg")} disabled={step === 2 && uploading}>
                {step === 2 && uploading ? "Uploading…" : step === 2 && !uploads.length ? "Skip and continue" : "Next"}
              </button>
            ) : (
              <button type="submit" className={buttonClass("accent", "lg")} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 aria-hidden="true" className="size-5 animate-spin" /> Sending…
                  </>
                ) : (
                  "Submit job ticket"
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Perforated client stub */}
      <aside aria-label="Your ticket so far" className="relative border-t-2 border-dashed border-gli-line bg-gli-mist p-5 lg:border-l-2 lg:border-t-0 md:p-6">
        <span aria-hidden="true" className="absolute -left-3 -top-3 hidden size-6 rounded-full border border-gli-line bg-white lg:block" />
        <span aria-hidden="true" className="absolute -bottom-3 -left-3 hidden size-6 rounded-full border border-gli-line bg-white lg:block" />
        <p className="eyebrow text-gli-slate">Client stub</p>
        <dl className="mt-4 space-y-3 text-[0.9375rem]">
          <div>
            <dt className="text-gli-slate">Services</dt>
            <dd className="font-semibold text-gli-navy">{d.services.length ? d.services.map(svcName).join(", ") : "Not chosen yet"}</dd>
          </div>
          {d.products.length ? (
            <div>
              <dt className="text-gli-slate">Catalogue items</dt>
              <dd className="font-semibold text-gli-navy">{d.products.length}</dd>
            </div>
          ) : null}
          {d.eventDate ? (
            <div>
              <dt className="text-gli-slate">Date</dt>
              <dd className="font-semibold text-gli-navy">{d.eventDate}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-gli-slate">Files</dt>
            <dd className="font-semibold text-gli-navy">{uploads.filter((u) => u.status === "ready").length || "None"}</dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-dashed border-gli-line pt-5">
          <p className="font-heading font-semibold text-gli-navy">What happens next</p>
          <ol className="mt-2 space-y-2 text-[0.9375rem]">
            {["You get a ticket number right away.", "A producer reviews your ticket and calls or messages you.", "You get a proposal with options and a timeline."].map((t) => (
              <li key={t} className="flex gap-2">
                <RegMark className="mt-1 shrink-0 text-gli-signal" /> {t}
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}
