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
] as const;

export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Notice" },
  { href: "/terms", label: "Terms of Use" },
] as const;

type Field = { value: string; pending: boolean };
const pending = (value: string): Field => ({ value, pending: true });

/** Contact details: GLI to confirm (Open Question Q-02). */
export const CONTACT = {
  legalName: "Graphics Library, Inc.",
  shortName: "GLI",
  tagline: "Your total graphics solution. Since 1996.",
  founded: 1996,
  address: pending("Metro Manila, Philippines"),
  landline: pending(""),
  mobile: pending(""),
  viberIntl: pending(""), // e.g. 639171234567
  whatsappIntl: pending(""),
  messengerPage: pending(""), // m.me/<page>
  email: pending(""),
  hours: pending("Monday to Friday, 9 am to 6 pm"),
  /** Response-time promise (Q-04). Shown only once GLI confirms it. */
  responseTime: pending("within one business day"),
};

/** " within one business day" once confirmed, otherwise "" (never print an unconfirmed promise). */
export const responsePromise = () => (CONTACT.responseTime.pending ? "" : ` ${CONTACT.responseTime.value}`);

export const hasValue = (f: Field) => f.value.trim().length > 0;
/** True when any contact detail is still a placeholder (shows a preview-only notice in the footer). */
export const CONTACT_PENDING = Object.values(CONTACT).some((v) => typeof v === "object" && v.pending);

export const links = {
  tel: () => (hasValue(CONTACT.landline) ? `tel:${CONTACT.landline.value.replace(/[^\d+]/g, "")}` : null),
  viber: () => (hasValue(CONTACT.viberIntl) ? `viber://chat?number=%2B${CONTACT.viberIntl.value}` : null),
  whatsapp: () => (hasValue(CONTACT.whatsappIntl) ? `https://wa.me/${CONTACT.whatsappIntl.value}` : null),
  messenger: () => (hasValue(CONTACT.messengerPage) ? `https://m.me/${CONTACT.messengerPage.value}` : null),
  email: () => (hasValue(CONTACT.email) ? `mailto:${CONTACT.email.value}` : null),
};
