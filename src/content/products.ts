import { gated, type Gated } from "./gated";
import { WORK_IMAGES, type WorkImage } from "./work-images";

/**
 * Production catalogue (Document 4 §7, workbook "Products"). Prices and lead times are NOT set here: they come
 * from the admin (product_setting table). Until GLI sets a price the card says "Price on request" (FR-040) and
 * no Product/Offer schema is output (FR-041).
 */
export const PRODUCT_CATEGORIES = [
  { slug: "large-format", name: "Large-Format" },
  { slug: "pharma-materials", name: "Pharma Materials" },
  { slug: "print", name: "Print" },
  { slug: "retail-display", name: "Retail Display" },
  { slug: "booths", name: "Booths" },
  { slug: "interactive", name: "Interactive" },
  { slug: "merchandise", name: "Merchandise" },
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["slug"];

export type Product = {
  slug: string;
  id: string;
  name: string;
  category: ProductCategory;
  oneLiner: string;
  specs: { label: string; value: string }[];
  includes?: string;
  seenIn: Gated;
  services: string[];
  cases: string[]; // where-used case slugs (shown only if visible)
  image?: WorkImage;
};

export const PRODUCTS: Product[] = [
  {
    slug: "pull-up-banner",
    id: "PR-01",
    name: "Pull-up banner",
    category: "large-format",
    oneLiner: "The workhorse of every launch and lobby.",
    specs: [
      { label: "Size", value: "850 × 2000 mm standard; other sizes on request" },
      { label: "Includes", value: "Printed panel, stand and carry bag" },
    ],
    seenIn: gated("Pfizer, LEADS and Hewlett Packard pull-up series", "Pull-up series for pharma programmes and a global technology brand", ["pfizer", "hp"]),
    services: ["large-format-signage-and-wraps"],
    cases: ["bus-wraps-and-service-centre-banners", "pharmacist-leads-programme"],
    image: WORK_IMAGES.hpBus,
  },
  {
    slug: "event-backdrop",
    id: "PR-02",
    name: "Event backdrop / step-and-repeat",
    category: "large-format",
    oneLiner: "The photo wall everyone stands in front of.",
    specs: [
      { label: "Size", value: "Sized to venue" },
      { label: "Material", value: "Fabric or tarpaulin" },
      { label: "Service", value: "Installed by our team" },
    ],
    seenIn: gated("Pfizer event backdrop", "Pharma event backdrops", ["pfizer"]),
    services: ["large-format-signage-and-wraps", "events-conventions-and-launches"],
    cases: [],
  },
  {
    slug: "standee-and-cut-out",
    id: "PR-03",
    name: "Standee and cut-out",
    category: "large-format",
    oneLiner: "A life-size welcome at the door.",
    specs: [
      { label: "Size", value: "Life-size or counter" },
      { label: "Finish", value: "Die-cut" },
    ],
    seenIn: "A life-size campaign standee",
    services: ["large-format-signage-and-wraps"],
    cases: [],
  },
  {
    slug: "detail-aid",
    id: "PR-04",
    name: "Detail aid, 2- to 14-pager",
    category: "pharma-materials",
    oneLiner: "The rep's best ten minutes, in print.",
    specs: [
      { label: "Size", value: "A4 or custom" },
      { label: "Format", value: "Folded, gate-fold or bound" },
      { label: "Stock", value: "Coated stock" },
    ],
    seenIn: "Master Detailer Piece and detail-aid series",
    services: ["pharma-and-medical-materials", "print-and-collateral"],
    cases: [],
  },
  {
    slug: "master-detailer-piece",
    id: "PR-05",
    name: "Master Detailer Piece",
    category: "pharma-materials",
    oneLiner: "The launch piece that tells the whole story.",
    specs: [
      { label: "Format", value: "Large-format launch piece" },
      { label: "Finish", value: "Custom finishes" },
    ],
    seenIn: "A launch Master Detailer Piece series",
    services: ["pharma-and-medical-materials"],
    cases: [],
  },
  {
    slug: "patient-discount-card-kit",
    id: "PR-06",
    name: "Patient discount-card kit",
    category: "pharma-materials",
    oneLiner: "Card, form and booklet that work together.",
    specs: [{ label: "Includes", value: "Card, enrolment form and booklet" }],
    seenIn: gated("Pfizer, PMA and Sulit Card G.O.L.D. programmes", "Patient programmes for pharma companies and associations", ["pfizer", "pma"]),
    services: ["pharma-and-medical-materials", "print-and-collateral"],
    cases: [],
  },
  {
    slug: "clinical-poster-journal-ad",
    id: "PR-07",
    name: "Clinical poster / journal ad",
    category: "pharma-materials",
    oneLiner: "Data that reads from across the room.",
    specs: [
      { label: "Size", value: "Poster sizes" },
      { label: "Files", value: "MIMS-ready files" },
    ],
    seenIn: "Pharma clinical posters and journal ads",
    services: ["pharma-and-medical-materials"],
    cases: [],
  },
  {
    slug: "brochure-and-invitation-suite",
    id: "PR-08",
    name: "Brochure and invitation suite",
    category: "print",
    oneLiner: "One look from invite to programme.",
    specs: [
      { label: "Size", value: "A4, A5 or DL" },
      { label: "Print", value: "Offset or digital" },
    ],
    seenIn: gated("Heritage Place and the FEU-NRMF 50th Homecoming", "Real-estate brochures and a medical alumni homecoming", ["heritage-place", "feu-nrmf-medical-alumni"]),
    services: ["print-and-collateral", "brand-and-graphic-design"],
    cases: ["50th-alumni-homecoming-and-scientific-convention"],
    image: WORK_IMAGES.heritage,
  },
  {
    slug: "counter-display-dispenser",
    id: "PR-09",
    name: "Counter display / dispenser",
    category: "retail-display",
    oneLiner: "Your brand at the point of decision.",
    specs: [{ label: "Material", value: "Corrugated or acrylic" }],
    seenIn: gated("Nexcare dispenser; clinic flyer dispensers", "Health-care counter dispensers; clinic flyer dispensers", ["3m"]),
    services: ["retail-display-and-posm", "packaging-design"],
    cases: ["in-store-displays-packaging-and-mobile-game"],
    image: WORK_IMAGES.nexcare,
  },
  {
    slug: "display-module-gondola-end-cap",
    id: "PR-10",
    name: "Display module / gondola end-cap",
    category: "retail-display",
    oneLiner: "Built for the store and the store crew.",
    specs: [
      { label: "Build", value: "Custom, store-fit" },
      { label: "Includes", value: "Prototype and kitting" },
    ],
    seenIn: gated("3M display modules and a Scotchgard gondola", "Display modules and a gondola for a global consumer-goods brand", ["3m"]),
    services: ["retail-display-and-posm"],
    cases: ["in-store-displays-packaging-and-mobile-game"],
    image: WORK_IMAGES.threeMDisplay,
  },
  {
    slug: "convention-booth-package",
    id: "PR-11",
    name: "Convention booth package",
    category: "booths",
    oneLiner: "Your three days on the floor, handled.",
    specs: [
      { label: "Size", value: "From inline to island" },
      { label: "Includes", value: "Design, build, install, dismantle" },
    ],
    seenIn: "PCP convention booths",
    services: ["booth-design-and-fabrication"],
    cases: ["medical-convention-booth-programme"],
  },
  {
    slug: "touchscreen-quiz-game",
    id: "PR-12",
    name: "Touchscreen quiz game",
    category: "interactive",
    oneLiner: "A reason to stop at your booth.",
    specs: [{ label: "Includes", value: "Custom questions, branding and leaderboard" }],
    seenIn: "Booth quiz games and a vascular quiz show",
    services: ["avp-interactive-games-and-apps", "booth-design-and-fabrication"],
    cases: ["in-store-displays-packaging-and-mobile-game"],
    image: WORK_IMAGES.scotchBrite,
  },
  {
    slug: "event-shirts-and-jerseys",
    id: "PR-13",
    name: "Event shirts and jerseys",
    category: "merchandise",
    oneLiner: "The team, in the campaign colours.",
    specs: [{ label: "Styles", value: "Polo, tee or sublimated jersey" }],
    seenIn: "A charity tour shirt and a triathlon team jersey",
    services: ["merchandise-and-apparel"],
    cases: [],
  },
];

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const categoryLabel = (slug: string) => PRODUCT_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

export const PRODUCTS_HUB = {
  seoTitle: "Production Catalogue: Banners, Detail Aids, Booths | GLI",
  meta: "Common production items with specs, options and lead times: pull-up banners, backdrops, detail aids, display modules, booth packages and more.",
  h1: "Production catalogue",
  intro: "Need something we make all the time? Pick it here, check the specs, and add it to a job ticket. For anything custom, just start a ticket and describe it.",
};
