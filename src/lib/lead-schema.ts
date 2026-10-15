import { z } from "zod";
import { ALL_SERVICES, INDUSTRIES } from "@/content/site";
import { PRODUCTS } from "@/content/products";

/** Shared validation for the job ticket and contact form (browser + server). Messages: Document 4 §10. */
export const MSG = {
  service: "Please tell us which service you need.",
  email: "Enter a full email, e.g. name@company.com.",
  mobile: "Enter a mobile number, e.g. 0917 123 4567.",
  consent: "Please tick the consent box so we can contact you.",
  name: "Please enter your full name.",
  company: "Please enter your company or organisation.",
  message: "Please tell us how we can help.",
};

export const SERVICE_SLUGS = [...ALL_SERVICES.map((s) => s.slug), "not-sure"] as const;
export const INDUSTRY_SLUGS = [...INDUSTRIES.map((i) => i.slug), "other"] as const;
export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);
/** Budget bands from Document 4 (GLI to confirm bands, Q-11). */
export const BUDGET_BANDS = ["Under PHP 50k", "PHP 50k–200k", "PHP 200k–500k", "PHP 500k–1M", "Over PHP 1M", "Not sure"] as const;
export const CHANNELS = ["Call", "Viber", "WhatsApp", "Email"] as const;

/** Philippine mobile (09XX… or +639XX…) or another international number with country code. */
export const mobileOk = (v: string) => {
  const d = v.replace(/[\s\-().]/g, "");
  return /^(09\d{9}|\+?639\d{9})$/.test(d) || /^\+\d{8,15}$/.test(d);
};

const email = z.string().trim().toLowerCase().max(200).email(MSG.email);
const mobile = z.string().trim().max(30).refine(mobileOk, MSG.mobile);
const utm = z.string().trim().max(120).optional().nullable();

export const quoteSchema = z.object({
  services: z.array(z.enum(SERVICE_SLUGS)).min(1, MSG.service).max(11),
  industry: z.enum(INDUSTRY_SLUGS).optional().nullable(),
  products: z.array(z.string().refine((s) => PRODUCT_SLUGS.includes(s))).max(13).default([]),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable().or(z.literal("")),
  venue: z.string().trim().max(200).optional().nullable(),
  qtySizes: z.string().trim().max(300).optional().nullable(),
  budgetBand: z.enum(BUDGET_BANDS).optional().nullable(),
  notes: z.string().trim().max(4000).optional().nullable(),
  uploadIds: z.array(z.string().regex(/^[a-f0-9]{32}$/)).max(5).default([]),
  name: z.string().trim().min(2, MSG.name).max(120),
  company: z.string().trim().min(1, MSG.company).max(160),
  email,
  mobile,
  channel: z.enum(CHANNELS).default("Call"),
  consent: z.literal(true, { message: MSG.consent }),
  newsletter: z.boolean().default(false),
  turnstileToken: z.string().max(4096).optional().nullable(),
  website: z.string().max(0).optional().nullable(), // honeypot
  utmSource: utm,
  utmMedium: utm,
  utmCampaign: utm,
  landingPage: z.string().trim().max(300).optional().nullable(),
});
export type QuoteInput = z.input<typeof quoteSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, MSG.name).max(120),
  email,
  mobile: z.string().trim().max(30).refine((v) => !v || mobileOk(v), MSG.mobile).optional().nullable(),
  message: z.string().trim().min(5, MSG.message).max(4000),
  consent: z.literal(true, { message: MSG.consent }),
  turnstileToken: z.string().max(4096).optional().nullable(),
  website: z.string().max(0).optional().nullable(),
  utmSource: utm,
  utmMedium: utm,
  utmCampaign: utm,
  landingPage: z.string().trim().max(300).optional().nullable(),
});
export type ContactInput = z.input<typeof contactSchema>;
