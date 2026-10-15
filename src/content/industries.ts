import { gated, type Gated } from "./gated";
import type { IndustrySlug } from "./clients";

/** Industry pages (Document 4 §5). Client lists below the body are permission-filtered (FR-021). */
export type Industry = {
  slug: IndustrySlug;
  name: string;
  seoTitle: string;
  meta: Gated;
  h1: string;
  body: Gated;
  whatWeDo: string[];
  cta: string;
  services: string[]; // related service slugs
};

export const INDUSTRY_PAGES: Industry[] = [
  {
    slug: "pharma-and-healthcare",
    name: "Pharma & Healthcare",
    seoTitle: "Pharma & Healthcare Marketing Production | GLI Philippines",
    meta: gated(
      "Detail aids, convention booths, symposia and sales conferences for pharma teams. Clients include Pfizer, GSK, Janssen and Mead Johnson.",
      "Detail aids, convention booths, symposia and sales conferences for pharma teams, from a Manila partner with 20 pharmaceutical clients.",
      ["pfizer", "gsk", "janssen", "mead-johnson"],
    ),
    h1: "Built for the convention floor",
    body: gated(
      "Pharma marketing runs on a calendar of launches, cycle meetings and society conventions, and every piece passes medical, legal and regulatory review. GLI's client list includes 20 pharmaceutical companies, among them Pfizer, GSK, Janssen, Boehringer Ingelheim, Mead Johnson, Otsuka, Sandoz, Servier and Zuellig Pharma, and our work for the industry spans detail aids, patient programmes, symposia, sales conferences and convention booths. We know review cycles take time, so we plan for them, and we keep confidential work confidential.",
      "Pharma marketing runs on a calendar of launches, cycle meetings and society conventions, and every piece passes medical, legal and regulatory review. GLI's client list includes 20 pharmaceutical companies, and our work for the industry spans detail aids, patient programmes, symposia, sales conferences and convention booths. We know review cycles take time, so we plan for them, and we keep confidential work confidential.",
      ["pfizer", "gsk", "janssen", "boehringer-ingelheim", "mead-johnson", "otsuka", "sandoz", "servier", "zuellig-pharma"],
    ),
    whatWeDo: ["Detail aids and MDPs", "Clinical posters and journal ads", "Patient programmes", "Convention booths", "Symposia and launches", "AVPs and booth games"],
    cta: "Start a convention job ticket",
    services: ["pharma-and-medical-materials", "booth-design-and-fabrication", "events-conventions-and-launches", "avp-interactive-games-and-apps"],
  },
  {
    slug: "consumer-and-retail",
    name: "Consumer & Retail",
    seoTitle: "Retail & Consumer Brand Production Philippines | GLI",
    meta: gated(
      "Retail displays, packaging, activations and dealer events for consumer brands including 3M, Philips, Colgate-Palmolive and Hershey's.",
      "Retail displays, packaging, activations and dealer events for global and local consumer brands, from one Manila team.",
      ["3m", "philips", "colgate-palmolive", "hersheys"],
    ),
    h1: "On the shelf, on time",
    body: gated(
      "Trade marketing lives or dies on the promo window. Our consumer clients include 3M, Philips, Colgate-Palmolive, Hershey's and Century Canning, and retailers such as Bvlgari of Rustan's, Sweet Bella and The Wedding Store. For 3M and Philips we have produced in-store displays, packaging, an app and dealer events.",
      "Trade marketing lives or dies on the promo window. Our consumer clients include global household, electronics and food brands as well as specialty retailers, and for them we have produced in-store displays, packaging, a mobile app and dealer events.",
      ["3m", "philips", "colgate-palmolive", "hersheys", "century-canning", "bvlgari-rustans", "sweet-bella", "the-wedding-store"],
    ),
    whatWeDo: ["Display modules and gondolas", "Packaging", "Promo collateral", "Dealer conventions", "Mobile games"],
    cta: "Request a display quote",
    services: ["retail-display-and-posm", "packaging-design", "print-and-collateral", "avp-interactive-games-and-apps"],
  },
  {
    slug: "real-estate-and-construction",
    name: "Real Estate & Construction",
    seoTitle: "Real Estate Marketing Collateral & Events | GLI Manila",
    meta: gated(
      "Brochures, ads, launch events and product literature for developers and building-products brands, including Megaworld, Landco and LIXIL.",
      "Brochures, ads, launch events and product literature for property developers and building-products brands in the Philippines.",
      ["megaworld", "landco-pacific", "lixil"],
    ),
    h1: "Print that sells the property",
    body: gated(
      "Buyers judge a development by its brochure before they see the site. GLI has produced brochures, ads, promo posters and launch materials for developers and builders including Megaworld, Landco Pacific, Fairground Developers and Hoshin Construction, and product literature for GROHE and American Standard (LIXIL).",
      "Buyers judge a development by its brochure before they see the site. GLI has produced brochures, ads, promo posters and launch materials for property developers and builders, and product literature for a global kitchen and bath brand.",
      ["megaworld", "landco-pacific", "fairground-developers", "hoshin-construction", "lixil"],
    ),
    whatWeDo: ["Project brochures", "Ads", "Launch events", "Site signage", "Product literature"],
    cta: "Get a print quote",
    services: ["print-and-collateral", "brand-and-graphic-design", "large-format-signage-and-wraps", "events-conventions-and-launches"],
  },
  {
    slug: "banking-finance-and-insurance",
    name: "Banking, Finance & Insurance",
    seoTitle: "Financial Services Collateral & Events | GLI Manila",
    meta: gated(
      "Collateral, cards, signage and events for banks, savings associations and insurers, including Asia United Bank and Philamlife.",
      "Collateral, cards, signage and events for banks, savings associations and insurers, produced by one Manila team.",
      ["asia-united-bank", "philamlife"],
    ),
    h1: "Clear, compliant collateral for financial brands",
    body: gated(
      "Financial brands need materials that are clear, accurate and on-brand across every branch. Our financial-services clients include Asia United Bank, International Exchange Bank, Philamlife and AMWSLAI Savings and Loans.",
      "Financial brands need materials that are clear, accurate and on-brand across every branch. Our financial-services clients include banks, an insurer and a savings and loan association.",
      ["asia-united-bank", "international-exchange-bank", "philamlife", "amwslai"],
    ),
    whatWeDo: ["Branch collateral", "Cards and forms", "Signage", "Client events"],
    cta: "Request a quote",
    services: ["print-and-collateral", "large-format-signage-and-wraps", "events-conventions-and-launches", "brand-and-graphic-design"],
  },
  {
    slug: "associations-societies-and-schools",
    name: "Associations, Societies & Schools",
    seoTitle: "Convention & Alumni Event Production | GLI Philippines",
    meta: gated(
      "Event identities, programmes, tickets, backdrops and booth layouts for medical societies, alumni associations and schools, such as the FEU-NRMF 50th Homecoming.",
      "Event identities, programmes, tickets, backdrops and booth layouts for medical societies, alumni associations and schools.",
      ["feu-nrmf-medical-alumni"],
    ),
    h1: "Your convention, handled",
    body: gated(
      "Society conventions, alumni homecomings and school events are often run by volunteer committees with day jobs. GLI gives them a production partner: one identity across tickets, programmes, backdrops and booth layouts, delivered on time. In January 2025 we produced the visual system for the FEU-NRMF Medical Alumni's 50th Annual Homecoming and Scientific Convention, from the Green & Gold Cup golf tournament to the S.I.L.V.E.R. symposium and the Grand Alumni Gala.",
      "Society conventions, alumni homecomings and school events are often run by volunteer committees with day jobs. GLI gives them a production partner: one identity across tickets, programmes, backdrops and booth layouts, delivered on time. In January 2025 we produced the visual system for a medical alumni society's 50th homecoming and scientific convention, from a charity golf tournament to a two-day symposium and the grand gala.",
      ["feu-nrmf-medical-alumni"],
    ),
    whatWeDo: ["Event identity", "Programmes and tickets", "Backdrops and signage", "Booth layouts for sponsors", "Shirts"],
    cta: "Plan your event with us",
    services: ["events-conventions-and-launches", "brand-and-graphic-design", "print-and-collateral", "merchandise-and-apparel"],
  },
];

export const industryBySlug = (slug: string) => INDUSTRY_PAGES.find((i) => i.slug === slug);

export const INDUSTRIES_HUB = {
  seoTitle: "Industries We Serve | GLI Manila",
  meta: "Pharma and healthcare, consumer and retail, real estate, financial services, and associations: see the work GLI has delivered for each since 1996.",
  h1: "Built for your industry's calendar",
  intro: "Every industry has its own rhythm: convention season, promo windows, project launches. We've worked inside all of them since 1996.",
};
