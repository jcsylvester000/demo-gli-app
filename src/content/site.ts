/**
 * Site-wide facts and navigation (Document 4 §1, BRD §3).
 * Contact values marked `pending: true` are placeholders until GLI answers Q-02; components never print
 * placeholder numbers: they hide the channel or fall back to the Contact page.
 * In Batch 5 these defaults become editable in the admin (site_setting table).
 */

export type ServiceRef = { slug: string; name: string; oneLiner: string };
export type ServiceGroup = { label: string; services: ServiceRef[] };

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    label: "Pharma & Print",
    services: [
      { slug: "pharma-and-medical-materials", name: "Pharma & Medical Materials", oneLiner: "Detail aids 2- to 14-pager, clinical posters, patient programmes" },
      { slug: "print-and-collateral", name: "Print & Collateral", oneLiner: "Brochures, invitations, programmes and magazines" },
      { slug: "brand-and-graphic-design", name: "Brand & Graphic Design", oneLiner: "Logos, identities and event looks" },
    ],
  },
  {
    label: "Retail & Packaging",
    services: [
      { slug: "retail-display-and-posm", name: "Retail Display & POSM", oneLiner: "Modules, gondolas and dispensers that stay standing" },
      { slug: "packaging-design", name: "Packaging Design", oneLiner: "Boxes, blister cards and labels, press-ready" },
      { slug: "large-format-signage-and-wraps", name: "Large-Format, Signage & Wraps", oneLiner: "Backdrops, pull-ups, standees and bus wraps" },
    ],
  },
  {
    label: "Events & Booths",
    services: [
      { slug: "events-conventions-and-launches", name: "Events, Conventions & Launches", oneLiner: "Sales conferences, symposia and product launches" },
      { slug: "booth-design-and-fabrication", name: "Booth Design & Fabrication", oneLiner: "From 3D render to the convention floor" },
    ],
  },
  {
    label: "AV & More",
    services: [
      { slug: "avp-interactive-games-and-apps", name: "AVP, Interactive Games & Apps", oneLiner: "Touchscreen games and AVPs that pull people in" },
      { slug: "merchandise-and-apparel", name: "Merchandise & Apparel", oneLiner: "Shirts, jerseys and merch that match the campaign" },
    ],
  },
];

export const ALL_SERVICES: ServiceRef[] = SERVICE_GROUPS.flatMap((g) => g.services);

export const INDUSTRIES = [
  { slug: "pharma-and-healthcare", name: "Pharma & Healthcare" },
  { slug: "consumer-and-retail", name: "Consumer & Retail" },
  { slug: "real-estate-and-construction", name: "Real Estate & Construction" },
  { slug: "banking-finance-and-insurance", name: "Banking, Finance & Insurance" },
  { slug: "associations-societies-and-schools", name: "Associations, Societies & Schools" },
] as const;

export const PRIMARY_NAV = [
  { href: "/services", label: "Services", mega: true },
  { href: "/industries", label: "Industries" },
  { href: "/work", label: "Work" },
  { href: "/products", label: "Products" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
] as const;

export const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/about/how-we-work", label: "How We Work" },
  { href: "/about/clients", label: "Clients" },
  { href: "/work", label: "Work" },
  { href: "/insights", label: "Insights" },
  { href: "/faq", label: "FAQ" },
] as const;

export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Notice" },
  { href: "/terms", label: "Terms of Use" },
] as const;

export type Field = { value: string; pending: boolean };
const pending = (value: string): Field => ({ value, pending: true });

/**
 * Contact defaults. Every value starts as `pending` (not confirmed by GLI, Q-02) and is never printed or linked.
 * Admins fill these in at /admin/settings (site_setting "contact"); lib/server/site-settings.ts → getContact()
 * merges saved values over these defaults. All components read contact details through getContact().
 */
export const CONTACT = {
  legalName: "Graphics Library, Inc.",
  shortName: "GLI",
  tagline: "Your total graphics solution. Since 1996.",
  founded: 1996,
  address: pending("Metro Manila, Philippines"),
  landline: pending(""),
  mobile: pending(""),
  viberIntl: pending(""), // digits incl. country code, e.g. 639171234567
  whatsappIntl: pending(""),
  messengerPage: pending(""), // m.me/<page>
  email: pending(""),
  hours: pending("Monday to Friday, 8:30 am to 5:30 pm"),
  /** Response-time promise (Q-04), e.g. "within one business day". Shown only once confirmed. */
  responseTime: pending("within one business day"),
};
export type Contact = typeof CONTACT;
export const EDITABLE_CONTACT_FIELDS = ["address", "landline", "mobile", "viberIntl", "whatsappIntl", "messengerPage", "email", "hours", "responseTime"] as const;
export type EditableContactField = (typeof EDITABLE_CONTACT_FIELDS)[number];

export const hasValue = (f: Field) => f.value.trim().length > 0;
const confirmed = (f: Field) => !f.pending && hasValue(f);

/** True while any contact detail is still unconfirmed (shows a preview-only notice in the footer). */
export const contactPending = (c: Contact) => EDITABLE_CONTACT_FIELDS.some((k) => c[k].pending);

/** " within one business day" once confirmed, otherwise "" (never print an unconfirmed promise). */
export const responsePromiseFor = (c: Contact) => (confirmed(c.responseTime) ? ` ${c.responseTime.value}` : "");

const digits = (v: string) => v.replace(/[^\d]/g, "");
export const linksFor = (c: Contact) => ({
  tel: () => (confirmed(c.landline) ? `tel:${c.landline.value.replace(/[^\d+]/g, "")}` : confirmed(c.mobile) ? `tel:${c.mobile.value.replace(/[^\d+]/g, "")}` : null),
  telLabel: () => (confirmed(c.landline) ? c.landline.value : confirmed(c.mobile) ? c.mobile.value : ""),
  viber: () => (confirmed(c.viberIntl) ? `viber://chat?number=%2B${digits(c.viberIntl.value)}` : null),
  whatsapp: () => (confirmed(c.whatsappIntl) ? `https://wa.me/${digits(c.whatsappIntl.value)}` : null),
  messenger: () => (confirmed(c.messengerPage) ? `https://m.me/${c.messengerPage.value.replace(/^.*m\.me\//, "").replace(/[^\w.\-]/g, "")}` : null),
  email: () => (confirmed(c.email) ? `mailto:${c.email.value}` : null),
});
