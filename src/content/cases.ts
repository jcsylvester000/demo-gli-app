import type { IndustrySlug } from "./clients";
import { WORK_IMAGES, type WorkImage } from "./work-images";

/**
 * Launch case studies (Document 4 §6, workbook "Case Studies"). Copy is written with `{client}` / `{Client}`
 * tokens: they become the client name when permission is Yes / Name only, or `anonClient` otherwise (D-2).
 * `anon` overrides hold wording without product names for Rx-sensitive cases.
 * Outcomes stay empty until GLI supplies client-approved facts (never estimate).
 */
export type CaseStudy = {
  slug: string;
  id: string;
  title: string;
  anonTitle?: string;
  clients: string[]; // client slugs
  anonClient: string;
  where: string;
  year?: number;
  yearLabel?: string;
  delivered: string;
  services: string[]; // service slugs
  industry: IndustrySlug;
  rx: boolean;
  archive: boolean;
  brief: string;
  whatWeDelivered: string;
  anon?: { brief?: string; whatWeDelivered?: string; where?: string };
  outcome?: string;
  images: WorkImage[];
};

export const CASES: CaseStudy[] = [
  {
    slug: "oncology-product-launch-and-avp",
    id: "CS-01",
    title: "Oncology product launch and AVP",
    clients: ["pfizer"],
    anonClient: "a multinational pharma company",
    where: "Garden Ballroom, EDSA Shangri-La",
    delivered: "Product launch staging, stage design and an AVP",
    services: ["events-conventions-and-launches", "avp-interactive-games-and-apps"],
    industry: "pharma-and-healthcare",
    rx: true,
    archive: false,
    brief: "{Client} needed a launch event for a new oncology medicine that matched the seriousness of an oncology medicine and the expectations of a specialist audience.",
    whatWeDelivered: "GLI designed and staged the launch in the Garden Ballroom of EDSA Shangri-La, with stage graphics, lighting design and a launch AVP built around the product story.",
    images: [],
  },
  {
    slug: "national-sales-conference-boracay",
    id: "CS-02",
    title: "National sales conference in Boracay",
    clients: ["janssen"],
    anonClient: "a multinational pharma company",
    where: "Boracay",
    yearLabel: "Mid-2000s",
    delivered: "Out-of-town sales conference, beachfront staging, collateral",
    services: ["events-conventions-and-launches"],
    industry: "pharma-and-healthcare",
    rx: false,
    archive: true,
    brief: "{Client} brought its sales team to Boracay for its national sales conference and needed a production partner who could deliver away from Manila.",
    whatWeDelivered: "GLI produced the conference, including a ship-themed beachfront stage under the theme \"Brave New Voyage\".",
    images: [],
  },
  {
    slug: "philippine-pediatric-society-convention",
    id: "CS-03",
    title: "Philippine Pediatric Society Convention",
    clients: ["mead-johnson"],
    anonClient: "a nutrition brand",
    where: "Plenary Hall, PICC",
    delivered: "Convention staging and production",
    services: ["events-conventions-and-launches"],
    industry: "pharma-and-healthcare",
    rx: false,
    archive: false,
    brief: "{Client} supported the Philippine Pediatric Society Convention and needed staging for the Plenary Hall at PICC, one of the country's largest convention venues.",
    whatWeDelivered: "GLI produced the staging and event materials for the plenary sessions.",
    images: [],
  },
  {
    slug: "medical-convention-booth-programme",
    id: "CS-04",
    title: "Medical-convention booth programme",
    clients: ["pfizer", "gsk", "janssen", "boehringer-ingelheim", "fresenius-kabi"],
    anonClient: "multinational pharma brands",
    where: "PCP Annual Conventions, PICC, and other society conventions",
    year: 2008,
    yearLabel: "2007 onwards",
    delivered: "Booth design, fabrication, installation; booth games",
    services: ["booth-design-and-fabrication", "avp-interactive-games-and-apps"],
    industry: "pharma-and-healthcare",
    rx: true,
    archive: false,
    brief: "Pharma brands need booths that draw physicians at the Philippine College of Physicians' Annual Convention and other society meetings.",
    whatWeDelivered: "GLI has designed and built booths including Spiriva, Doribax, Pfizer, Anti-infectives, Pristiq, Prevnar and Fresenius Kabi, with registration areas, lightbox walls and touchscreen trivia and quiz games.",
    anon: {
      whatWeDelivered: "GLI has designed and built convention booths for multiple pharma brands, with registration areas, lightbox walls and touchscreen trivia and quiz games.",
    },
    images: [],
  },
  {
    slug: "pharmacist-leads-programme",
    id: "CS-05",
    title: "Pharmacist LEADS programme",
    anonTitle: "Pharmacist learning programme",
    clients: ["pfizer"],
    anonClient: "a multinational pharma company",
    where: "Crowne Plaza",
    delivered: "Event production, pull-up banners",
    services: ["events-conventions-and-launches", "large-format-signage-and-wraps"],
    industry: "pharma-and-healthcare",
    rx: false,
    archive: false,
    brief: "{Client}'s Pharmacist LEADS programme brought pharmacists together for a learning event.",
    whatWeDelivered: "GLI produced the event at Crowne Plaza, including the LEADS pull-up banner series and registration area.",
    anon: {
      brief: "{Client}'s pharmacist programme brought pharmacists together for a learning event.",
      whatWeDelivered: "GLI produced the event at Crowne Plaza, including a pull-up banner series and the registration area.",
    },
    images: [],
  },
  {
    slug: "in-store-displays-packaging-and-mobile-game",
    id: "CS-06",
    title: "In-store displays, packaging and a mobile game",
    clients: ["3m"],
    anonClient: "a global consumer-goods brand",
    where: "Retail and supermarket chains",
    delivered: "Display modules, packaging, logo, mobile app/game",
    services: ["retail-display-and-posm", "packaging-design", "avp-interactive-games-and-apps"],
    industry: "consumer-and-retail",
    rx: false,
    archive: false,
    brief: "{Client} needed retail presence across several brands, from Scotch-Brite and Command to Filtrete and Nexcare.",
    whatWeDelivered:
      "GLI designed display modules (Twister, A la Carte & Command Bath, Filtrete demo, Magic Tape donut dispenser, Command 4-way display, Scotchgard gondola), packaging for Scotch-Brite and Nexcare, the \"Bundles of Fun\" back-to-school mark, and the Scotch-Brite Cleaning Challenge mobile game.",
    anon: {
      brief: "{Client} needed retail presence across several of its household and health-care brands.",
      whatWeDelivered: "GLI designed a family of in-store display modules, trolley and gondola displays, counter dispensers and packaging, a back-to-school promotional mark and a cleaning-challenge mobile game.",
    },
    images: [WORK_IMAGES.threeMDisplay, WORK_IMAGES.nexcare, WORK_IMAGES.scotchBrite],
  },
  {
    slug: "retail-display-booth-and-dealers-convention",
    id: "CS-07",
    title: "Retail display, ZOOM booth and Dealers Convention 2014",
    anonTitle: "Retail display, booth and dealers convention",
    clients: ["philips"],
    anonClient: "a global electronics brand",
    where: "Retail; Dealers Convention 2014",
    year: 2014,
    delivered: "Display, booth, event production",
    services: ["retail-display-and-posm", "booth-design-and-fabrication", "events-conventions-and-launches"],
    industry: "consumer-and-retail",
    rx: false,
    archive: true,
    brief: "{Client} needed a consistent presence from the store floor to its dealer convention.",
    whatWeDelivered: "GLI produced a {client} retail display, the ZOOM booth design and the Dealers Convention 2014 set, plus a product standee.",
    anon: { whatWeDelivered: "GLI produced a retail display, a booth design and the 2014 dealers convention set, plus a product standee." },
    images: [],
  },
  {
    slug: "bus-wraps-and-service-centre-banners",
    id: "CS-08",
    title: "Bus wraps and service-centre banners",
    clients: ["hp"],
    anonClient: "a global technology brand",
    where: "Metro Manila",
    delivered: "Bus wraps, pull-up banners",
    services: ["large-format-signage-and-wraps"],
    industry: "consumer-and-retail",
    rx: false,
    archive: false,
    brief: "{Client} wanted to take its \"All-in-One\" message onto the street and point customers to its service centre.",
    whatWeDelivered: "GLI designed and produced {client} bus wraps and service-centre pull-up banners.",
    images: [WORK_IMAGES.hpBus],
  },
  {
    slug: "50th-alumni-homecoming-and-scientific-convention",
    id: "CS-09",
    title: "50th Annual Alumni Homecoming & Scientific Convention",
    clients: ["feu-nrmf-medical-alumni"],
    anonClient: "a medical alumni society",
    where: "San Pedro, Laguna · Quezon City · Makati Shangri-La",
    anon: { where: "Laguna and Metro Manila" },
    year: 2025,
    yearLabel: "Jan 2025",
    delivered: "Event identity system, tickets, programme, posters, invitations",
    services: ["brand-and-graphic-design", "print-and-collateral", "events-conventions-and-launches"],
    industry: "associations-societies-and-schools",
    rx: false,
    archive: false,
    brief: "A three-event week for a 50th homecoming: a charity golf tournament, a two-day scientific symposium and a gala, each needing its own look while clearly belonging together.",
    whatWeDelivered:
      "GLI created a gold-and-green identity used across the Green & Gold Cup \"Golf Tournament for a Cause\" (8 Jan 2025), the S.I.L.V.E.R. scientific symposium (16–17 Jan 2025) and the Grand Alumni Gala (18 Jan 2025), including a two-day programme guide with QR registration.",
    images: [WORK_IMAGES.feuGolf, WORK_IMAGES.pinkArgonauts],
  },
  {
    slug: "product-literature-and-spec-sheets",
    id: "CS-10",
    title: "Product literature and spec sheets",
    clients: ["lixil"],
    anonClient: "a global kitchen and bath brand",
    where: "Philippine market",
    year: 2022,
    delivered: "Spec-sheet design, product literature",
    services: ["brand-and-graphic-design", "print-and-collateral"],
    industry: "real-estate-and-construction",
    rx: false,
    archive: false,
    brief: "{Client} needed product literature adapted for the local market, with clear specifications and space for local QR codes.",
    whatWeDelivered:
      "GLI designed spec sheets for the GROHE Eurosmart range (basin, bath and shower mixers) and American Standard EasySET, DuoSTiX and auto-temperature systems, with key specifications, features and best-match products.",
    anon: { whatWeDelivered: "GLI designed spec sheets for kitchen and bath mixer ranges and toilet systems, with key specifications, features and best-match products." },
    images: [WORK_IMAGES.grohe],
  },
];

/** Home "Recent and remarkable" candidates in priority order (Document 4 §2); the first 3 visible are shown. */
export const FEATURED_CASE_ORDER = [
  "50th-alumni-homecoming-and-scientific-convention",
  "medical-convention-booth-programme",
  "in-store-displays-packaging-and-mobile-game",
  "product-literature-and-spec-sheets",
  "bus-wraps-and-service-centre-banners",
];

export const caseBySlug = (slug: string) => CASES.find((c) => c.slug === slug);
