import { gated, type Faq, type Gated } from "./gated";

/**
 * Service pages (Document 4 §4). One template renders all ten (BRD FR-020).
 * Editorial rules applied to the source copy:
 * - Client and product-brand names are gated (named only with permission); prescription brand names are never used here.
 * - "[confirm]" markers are removed from the text and listed in content/confirmations.ts for GLI sign-off.
 * - FAQ answers GLI has not supplied yet are `null` and hidden.
 * - The 1-business-day promise comes from site.ts (shown only once GLI confirms it).
 */
export type Service = {
  slug: string;
  seoTitle: string;
  meta: Gated;
  eyebrow: string;
  h1: string;
  intro: Gated;
  make: string[];
  how: string;
  where: Gated;
  faq: Faq[];
  products: string[]; // product slugs
};

export const SERVICES: Service[] = [
  {
    slug: "pharma-and-medical-materials",
    seoTitle: "Pharma Detail Aids & Medical Materials Philippines | GLI",
    meta: "Detail aids from 2- to 14-pagers, clinical posters, patient discount cards and e-detail aids, designed and produced for pharma teams in the Philippines.",
    eyebrow: "Pharma & Medical Materials",
    h1: "Detail aids, posters and patient materials for pharma teams",
    intro: gated(
      "Your reps have a few minutes with each doctor, and your materials have to carry the brand in that time. GLI designs and produces the pieces that go into those calls and onto convention walls: master detailer pieces, detail aids from 2- to 14-pagers, e-detail aids, clinical posters, journal ads and patient programmes. Our pharma clients include Pfizer, GSK, Janssen, Boehringer Ingelheim and Mead Johnson.",
      "Your reps have a few minutes with each doctor, and your materials have to carry the brand in that time. GLI designs and produces the pieces that go into those calls and onto convention walls: master detailer pieces, detail aids from 2- to 14-pagers, e-detail aids, clinical posters, journal ads and patient programmes, for multinational and local pharma companies.",
      ["pfizer", "gsk", "janssen", "boehringer-ingelheim", "mead-johnson"],
    ),
    make: [
      "Master Detailer Pieces (MDP) and detail aids: 2-, 4-, 6-, 12- and 14-pager formats and flip charts; die-cut and dimensional formats on request",
      "E-detail aids for tablet-based calls",
      "Clinical posters and journal ads, for example MIMS ad formats",
      "Patient programmes: discount cards, enrolment forms, monitoring booklets, information brochures and comics",
      "Dispensers and leave-behinds that sit on the clinic desk",
    ],
    how: "We work from your approved claims and references. You supply the medical-legal-regulatory (MLR) approved content; we design, lay out, proof and produce. Every round is versioned so your reviewers always see exactly what changed.",
    where: gated(
      "Selected work: a statin launch Master Detailer Piece and detail-aid series; an e-detail aid; clinical posters and journal ads; Pfizer patient discount cards; Sulit Card G.O.L.D. enrolment and BP-monitoring booklet; PhilHealth information comics; PMA discount cards.",
      "Selected work: a launch Master Detailer Piece and detail-aid series; an e-detail aid; clinical posters and journal ads; patient discount cards, enrolment kits and monitoring booklets; public-health information comics.",
      ["pfizer", "pma"],
    ),
    faq: [
      { q: "Can you work from our MLR-approved PDF?", a: "Yes. Send the approved copy and references; we lay out exactly what was approved and flag anything that needs re-approval because of a layout change." },
      { q: "Do you print as well as design?", a: "Yes, we deliver finished, packed pieces to your office or warehouse." },
      { q: "How long does a 6-pager take?", a: null },
      { q: "Will you show our materials on your website?", a: "Only with your written permission. Prescription-product work is anonymised or kept off the public site." },
    ],
    products: ["detail-aid", "master-detailer-piece", "patient-discount-card-kit", "clinical-poster-journal-ad"],
  },
  {
    slug: "booth-design-and-fabrication",
    seoTitle: "Booth Design & Fabrication Philippines | PICC | GLI",
    meta: "Convention and trade-show booths from 3D render to build and install at PICC, convention centres and hotel venues. Medical-convention specialists.",
    eyebrow: "Booth Design & Fabrication",
    h1: "Convention booths, from 3D render to show floor",
    intro:
      "A medical convention gives you three days and a few square metres to stand out from every other brand in the hall. GLI designs your booth in 3D, builds it, installs it before the doors open, and fills it with everything that makes it work: graphics, lightboxes, AVPs and touchscreen games. The team that renders it is the team that builds it.",
    make: [
      "Inline, corner, peninsula and island booths for PICC, other convention centres and hotel ballroom conventions",
      "3D design and walk-through renders for approval",
      "Fabrication and installation, including lightboxes, counters, storage and branded walls",
      "Booth content: AVP loops, touchscreen quiz games, leave-behinds and giveaways",
      "Dismantling and storage of reusable elements",
    ],
    how: "Brief and floor plan, then a 3D concept, revisions, approval and build drawings. We fabricate, install, hand over before opening day, and stay on call during show days.",
    where: gated(
      "Selected work: Philippine College of Physicians 37th Annual Convention (PICC, 2007) and PCP Convention 2008; convention booths for Pfizer, GSK, Janssen, Boehringer Ingelheim and Fresenius Kabi; a Philips ZOOM booth design.",
      "Selected work: booths at the Philippine College of Physicians 37th Annual Convention (PICC, 2007) and PCP Convention 2008; convention booths for multinational pharma brands; a booth design for a global electronics brand.",
      ["pfizer", "gsk", "janssen", "boehringer-ingelheim", "fresenius-kabi", "philips"],
    ),
    faq: [
      { q: "How early should we brief you?", a: "For a custom island booth, we recommend 10–12 weeks before the convention. Inline booths can be faster." },
      { q: "Do you handle venue requirements?", a: "We prepare the drawings and documents venues usually ask exhibitors for and coordinate load-in with the organiser." },
      { q: "Can we reuse the booth?", a: "Yes, if it is designed for it. Modular elements can be stored and refreshed with new graphics for the next convention." },
      { q: "Do you build outside Metro Manila?", a: null },
    ],
    products: ["convention-booth-package", "touchscreen-quiz-game", "event-backdrop"],
  },
  {
    slug: "events-conventions-and-launches",
    seoTitle: "Event & Product Launch Organizer Manila | GLI",
    meta: "Sales conferences, product launches, medical conventions and symposia, staged by a Manila team that also designs and builds every element.",
    eyebrow: "Events, Conventions & Launches",
    h1: "Launches, conferences and conventions, handled end to end",
    intro:
      "Product launches, national sales conferences, medical symposia, society conventions and dealer conventions: GLI has staged them in ballrooms, convention halls and resort venues. Because we also design the invitations, build the stage, print the backdrops and produce the AVPs, every element looks like it belongs to the same event.",
    make: [
      "Product launches and brand presentations",
      "National sales conferences and kick-offs, including out-of-town venues",
      "Medical conventions, symposia and scientific programmes",
      "Dealer and partner conventions",
      "Community and charity events, such as runs, tours and tournaments",
      "Event identity: invitations, tickets, programmes, signage, backdrops, shirts",
    ],
    how: "One producer owns your event from brief to wrap-up: concept and run-of-show, venue coordination, staging and technical, materials, on-site management and a wrap-up report.",
    where: gated(
      "Selected work: Janssen sales conference (Boracay); a Pfizer oncology product launch (Garden Ballroom, EDSA Shangri-La); Philippine Pediatric Society Convention for Mead Johnson/Bristol (Plenary Hall, PICC); Pfizer Pharmacist LEADS (Crowne Plaza); Pfizer Power to Learn (Canyon Cove, Nasugbu, Batangas); Lucky Me launch; Philips Dealers Con 2014; FEU-NRMF 50th Alumni Homecoming and Scientific Convention (January 2025).",
      "Selected work: a national sales conference in Boracay; an oncology product launch at EDSA Shangri-La; the Philippine Pediatric Society Convention (Plenary Hall, PICC); a pharmacist learning programme at Crowne Plaza; a learning retreat in Nasugbu, Batangas; a food-brand launch; a 2014 dealers convention; a medical alumni society's 50th homecoming and scientific convention (January 2025).",
      ["janssen", "pfizer", "mead-johnson", "lucky-me", "philips", "feu-nrmf-medical-alumni"],
    ),
    faq: [
      { q: "Do you follow pharma event rules?", a: "We plan within your company's compliance requirements and the codes that apply to HCP events in the Philippines. Your compliance team has the final say on venue, meals and materials." },
      { q: "Can you run events outside Manila?", a: "Yes. Our work includes Boracay and Batangas." },
      { q: "Do you provide hosts, talent or catering?", a: null },
      { q: "How far ahead should we book?", a: "For conferences of 200+ guests, 8–12 weeks is comfortable." },
    ],
    products: ["event-backdrop", "brochure-and-invitation-suite", "event-shirts-and-jerseys"],
  },
  {
    slug: "retail-display-and-posm",
    seoTitle: "POSM & In-Store Display Fabrication Philippines | GLI",
    meta: gated(
      "Display modules, gondolas, counter units and dispensers for retail rollouts, designed with your packaging. Trusted by 3M and Philips.",
      "Display modules, gondolas, counter units and dispensers for retail rollouts, designed with your packaging by one Manila team.",
      ["3m", "philips"],
    ),
    eyebrow: "Retail Display & POSM",
    h1: "In-store displays that arrive on time and stay standing",
    intro: gated(
      "A display has to fit the shelf, survive the promo period and sell the product, often across dozens of stores. GLI designs and produces display modules, gondola dress-ups, counter units and dispensers, together with the packaging and promo materials they carry. 3M and Philips have trusted us with exactly this.",
      "A display has to fit the shelf, survive the promo period and sell the product, often across dozens of stores. GLI designs and produces display modules, gondola dress-ups, counter units and dispensers, together with the packaging and promo materials they carry, for global consumer and electronics brands.",
      ["3m", "philips"],
    ),
    make: [
      "Display modules and demo units (floor-standing and counter)",
      "Gondola end-caps and dress-ups",
      "Dispensers and counter units for clinics and pharmacies",
      "Shelf talkers, wobblers, danglers and header cards",
      "Store-ready kits packed per branch",
    ],
    how: "Store survey or planogram, then concept, prototype, approval, production run, kitting and delivery. We design for the retailer's rules and for the store crew who assemble it.",
    where: gated(
      "Selected work: Philips display; 3M Twister display; 3M A la Carte & Command Bath module; Filtrete demo module; Magic Tape donut dispenser and Command 4-way display; Scotchgard gondola.",
      "Selected work: an electronics retail display; trolley, bath and demo display modules; a tape dispenser and 4-way counter display; a fabric-care gondola.",
      ["philips", "3m"],
    ),
    faq: [
      { q: "What materials do you use?", a: "Corrugated board, acrylic, wood and metal, depending on lifespan and budget." },
      { q: "Can you deliver to multiple stores?", a: null },
      { q: "Do you make a prototype?", a: "For new structures we recommend a prototype before the run." },
      { q: "Minimum quantity?", a: null },
    ],
    products: ["display-module-gondola-end-cap", "counter-display-dispenser"],
  },
  {
    slug: "print-and-collateral",
    seoTitle: "Brochure, Flyer & Invitation Printing Manila | GLI",
    meta: "Brochures, flyers, invitations, posters, booklets and programmes, designed and printed by one Manila team. Ask for a print quote.",
    eyebrow: "Print & Collateral",
    h1: "Print and collateral, designed and produced together",
    intro:
      "GLI started in graphic design and printing in 1996, and print is still at the heart of what we do. Brochures, flyers, invitations, posters, cards, booklets, magazines and event programmes, designed by the people who know how they will print.",
    make: [
      "Brochures and catalogues, including real estate and product literature",
      "Flyers, posters and invitations",
      "Booklets, magazines and programmes",
      "Cards and forms: discount cards, enrolment forms, tickets",
      "Spec sheets adapted for the Philippine market",
    ],
    how: "Brief, design, proof, then a pre-press check before anything is printed. Delivered packed and labelled.",
    where: gated(
      "Selected work: Heritage Place brochure; Sitio Waling-waling flyer; Aiyanar ad; Asian Spirit magazine; Buzzar movers and Nuvali promo posters; GROHE Eurosmart and American Standard EasySET spec sheets (2022); FEU-NRMF 50th Homecoming programme and tickets (2025).",
      "Selected work: real-estate brochures, flyers and ads; an in-flight magazine; promo posters; kitchen and bath spec sheets (2022); a medical alumni society's 50th homecoming programme and tickets (2025).",
      ["heritage-place", "nuvali", "lixil", "feu-nrmf-medical-alumni"],
    ),
    faq: [
      { q: "Can you match our brand colours?", a: "Yes. We proof against your brand standards and can run a press proof for critical colours." },
      { q: "Offset or digital?", a: "Both, depending on quantity." },
      { q: "Do you do rush jobs?", a: null },
      { q: "Do you deliver?", a: "Yes, within Metro Manila." },
    ],
    products: ["brochure-and-invitation-suite", "detail-aid", "patient-discount-card-kit"],
  },
  {
    slug: "large-format-signage-and-wraps",
    seoTitle: "Backdrop, Pull-Up Banner & Bus Wrap Printing | GLI Manila",
    meta: "Event backdrops, pull-up banners, standees and bus wraps for brands and conventions in Metro Manila, designed, printed and installed by GLI.",
    eyebrow: "Large-Format, Signage & Wraps",
    h1: "Backdrops, banners and wraps that hold their colour",
    intro:
      "From a single pull-up banner to a ballroom backdrop or a fleet of bus wraps, large-format work has to look right at a distance and up close. GLI designs, prints and installs it to match the rest of your campaign.",
    make: ["Event backdrops and stage graphics", "Pull-up banners and display systems", "Standees and cut-outs", "Bus and vehicle wraps", "Venue and wayfinding signage"],
    how: "Artwork set up at the right resolution and bleed, colour proofed, printed, then installed by our team on site.",
    where: gated(
      "Selected work: Pfizer pull-up banners and backdrop; LEADS pull-ups; Hewlett Packard service-centre pull-ups and bus wraps; No Excuses standee.",
      "Selected work: pull-up banner series and event backdrops for pharma programmes; service-centre pull-ups and bus wraps for a global technology brand; a life-size campaign standee.",
      ["pfizer", "hp"],
    ),
    faq: [
      { q: "What is the standard pull-up size?", a: "Our standard is 850 × 2000 mm; other sizes on request." },
      { q: "Tarpaulin or fabric?", a: "Fabric looks premium and folds for travel; tarpaulin is economical and weather-resistant." },
      { q: "Do you install backdrops?", a: "Yes, for events we produce." },
      { q: "How fast can you print a pull-up?", a: null },
    ],
    products: ["pull-up-banner", "event-backdrop", "standee-and-cut-out"],
  },
  {
    slug: "packaging-design",
    seoTitle: "Packaging Design Agency Philippines | GLI",
    meta: gated(
      "Boxes, blister cards, labels and dielines for consumer and healthcare brands, made press-ready by the team behind Scotch-Brite and Nexcare packs.",
      "Boxes, blister cards, labels and dielines for consumer and healthcare brands, made press-ready by a Manila team that designs and produces.",
      ["3m"],
    ),
    eyebrow: "Packaging Design",
    h1: "Packaging design, press-ready from day one",
    intro:
      "Packaging is the one ad every buyer holds in their hand. GLI designs boxes, blister and header cards, labels and gift packs for consumer and healthcare brands, built on accurate dielines and ready for the printer.",
    make: ["Folding cartons and gift boxes", "Blister cards and header cards", "Labels and sleeves", "Dielines and mechanicals", "Promo and seasonal packs with matching POSM"],
    how: "Brief and structural spec, concept, then artwork on the converter's dieline, mock-up, approval and press-ready files with colour notes.",
    where: gated(
      "Selected work: Scotch-Brite packaging and Bath Time Pals box; Walis Tibay label; Nexcare Anti-Fever Gel packaging and dispenser; Myra-E packaging; Sweet Bella boxes; Susie campaign panel.",
      "Selected work: cleaning-product packaging and a children's gift box; a household-brand label; anti-fever gel packaging and a counter dispenser; vitamin packaging; confectionery boxes; a campaign panel.",
      ["3m", "sweet-bella"],
    ),
    faq: [
      { q: "Do you produce the packaging too?", a: null },
      { q: "Can you work on our printer's dieline?", a: "Yes, that is our preferred way to work." },
      { q: "Do you make mock-ups?", a: "Yes, physical mock-ups for approval." },
      { q: "Healthcare packaging?", a: "Yes. Regulatory text is supplied and approved by your regulatory team." },
    ],
    products: ["counter-display-dispenser", "display-module-gondola-end-cap"],
  },
  {
    slug: "avp-interactive-games-and-apps",
    seoTitle: "AVP Production & Interactive Booth Games | GLI Manila",
    meta: "Audio-visual presentations, touchscreen quiz games and branded apps that draw visitors into your booth and launch. Built by GLI in Manila.",
    eyebrow: "AVP, Interactive Games & Apps",
    h1: "AVPs and touchscreen games that pull people in",
    intro:
      "A booth with something to do gets visitors. GLI produces audio-visual presentations for launches and conferences, and touchscreen quiz and trivia games and branded mobile apps that turn passers-by into conversations.",
    make: ["AVPs for launches, conferences and booths", "Touchscreen quiz and trivia games with your brand and questions", "Branded mobile apps and games", "Interactive kiosks for booths and lobbies"],
    how: "Script or question bank from you (approved by your medical team where relevant), then storyboard, build, test on the actual screen, and on-site support.",
    where: gated(
      "Selected work: P.U.S.O. AVP; an oncology launch AVP; Scotch-Brite mobile app and Cleaning Challenge game; booth trivia and quiz games for anti-infective, cardiovascular and vaccine brands; a Vascular quiz show.",
      "Selected work: a programme AVP; an oncology launch AVP; a cleaning-challenge mobile game; booth trivia and quiz games for anti-infective, cardiovascular and vaccine brands; a vascular quiz show.",
      ["3m"],
    ),
    faq: [
      { q: "Can the game capture leads?", a: "Yes, with consent and a privacy notice under the Data Privacy Act." },
      { q: "Do you supply the screens?", a: null },
      { q: "How long does a quiz game take?", a: null },
      { q: "Can we reuse it?", a: "Yes. Questions and branding can be swapped for the next event." },
    ],
    products: ["touchscreen-quiz-game", "convention-booth-package"],
  },
  {
    slug: "brand-and-graphic-design",
    seoTitle: "Brand & Graphic Design Agency Manila | GLI",
    meta: "Logos, brand identities, event identities and product literature, designed by a Manila studio that also prints and builds them. 50+ brands since 1996.",
    eyebrow: "Brand & Graphic Design",
    h1: "Brand and graphic design that survives production",
    intro:
      "Good design has to work on a business card, a 6-metre backdrop and a booth wall. GLI designs logos, identities, campaign key visuals and event identities with production in mind.",
    make: ["Logos and brand identities", "Campaign key visuals and adaptations", "Event identities: one look from invitation to backdrop", "Product literature and spec sheets", "Brand guidelines"],
    how: "Discovery, concepts, refinement, then a full set of production-ready files and a short guide on how to use them.",
    where: gated(
      "Selected work: logo designs including the Scotch/Post-it \"Bundles of Fun\" back-to-school mark; FEU-NRMF 50th Homecoming identity (Green & Gold Cup, S.I.L.V.E.R. symposium, Grand Alumni Gala); The Pink Argonauts 2nd Golf and Dive 2025 ticket; GROHE and American Standard literature.",
      "Selected work: logo designs including a back-to-school promotional mark; a medical alumni society's 50th homecoming identity (golf tournament, symposium and gala); a 2025 charity golf-and-dive event ticket; kitchen and bath product literature.",
      ["3m", "feu-nrmf-medical-alumni", "pink-argonauts", "lixil"],
    ),
    faq: [
      { q: "How many logo concepts do we see?", a: null },
      { q: "Do we own the files?", a: "Yes, final artwork files are yours on full payment." },
      { q: "Can you adapt global campaigns?", a: "Yes, we localise global key visuals for the Philippine market." },
      { q: "Do you write copy?", a: null },
    ],
    products: ["brochure-and-invitation-suite"],
  },
  {
    slug: "merchandise-and-apparel",
    seoTitle: "Event Shirts, Jerseys & Merchandise Philippines | GLI",
    meta: "Event shirts, team jerseys and campaign merchandise designed to match your launch or convention identity. Produced by GLI, Manila.",
    eyebrow: "Merchandise & Apparel",
    h1: "Event shirts, jerseys and merch that match the campaign",
    intro:
      "Shirts and merch are part of the event identity. GLI designs and produces event shirts, team jerseys and campaign merchandise so they match the rest of the look.",
    make: ["Event shirts and polos", "Sublimated team jerseys", "Campaign merchandise and giveaways", "Packaging for kits and giveaways"],
    how: "Design on the event identity, sample, approval, production, sorted by size and packed per team.",
    where: gated(
      "Selected work: Nexcare Anti-Fever Gel shirt; The Tour of Hope 2011 shirt; South Tri team jersey.",
      "Selected work: a campaign shirt for a health-care brand; a 2011 charity tour shirt; a triathlon team jersey.",
      ["3m"],
    ),
    faq: [
      { q: "Minimum order?", a: null },
      { q: "Can we see a sample?", a: "Yes, before the full run." },
      { q: "Pharma giveaways?", a: "Promotional items for HCPs must follow your company's and industry rules (for example, modest value). We help you choose appropriate items." },
      { q: "Lead time?", a: null },
    ],
    products: ["event-shirts-and-jerseys"],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const SERVICES_HUB = {
  seoTitle: "Services: Design, Print, Displays, Booths, Events | GLI",
  meta: "Ten production services under one accountable team: pharma materials, print, large-format, retail displays, packaging, booths, events, AV and merch.",
  h1: "Designed. Printed. Built. Delivered.",
  intro: "GLI covers the whole chain from idea to installed, so you brief one team instead of five. Choose a service to see what we make, how it works and where we've done it.",
};
