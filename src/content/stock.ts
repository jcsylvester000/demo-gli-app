/**
 * Illustrative stock photography (Unsplash licence: free commercial use; hot-linked from images.unsplash.com as
 * Unsplash asks, optimised by next/image). Used ONLY where no GLI-cleared image exists yet, never instead of one,
 * and always labelled "Illustrative" with a photographer credit so it is not mistaken for GLI's own work.
 * Replace an entry (or delete it) the moment GLI supplies a real photo for that slot.
 */
export type StockPhoto = { id: string; slug: string; alt: string; by: string };

const p = (id: string, slug: string, alt: string, by: string): StockPhoto => ({ id, slug, alt, by });

export const STOCK = {
  boothFloor: p("photo-1761195689615-9469b65dac01", "BKpOVik79lA", "Visitors talking with staff at an exhibition booth", "Trans Russia"),
  tradeShow: p("photo-1711390811937-1b061eaf28ea", "jSniVrdhDtc", "Visitors gathered around a stand at a trade show", "Jonny Gios"),
  expoHall: p("photo-1752155222944-675c2c3bfafd", "dy65r8fjeyI", "Indoor exhibition hall full of vendor booths", "Jin-Woo Lee"),
  tees: p("photo-1523381294911-8d3cead13475", "xPJYL0l5Ii8", "Green t-shirts on wooden hangers", "Keagan Henman"),
  jerseys: p("photo-1655089131279-8029e8a21ac6", "LmEuUMbd5Rw", "Blue and red team sports jerseys", "Abhay siby Mathew"),
  stethoscope: p("photo-1532938911079-1b06ac7ceec7", "hIgeoQjS_iE", "Doctor holding a stethoscope", "Online Marketing"),
  doctorTablet: p("photo-1666886573531-48d2e3c2b684", "J5UTvRgse7Q", "Doctor showing information on a tablet", "Nappy"),
  pharmacistShelf: p("photo-1580281657527-47f249e8f4df", "byGTytEGjBo", "Pharmacist reaching for a medicine box on a shelf", "National Cancer Institute"),
  pharmacistAdvice: p("photo-1576091358783-a212ec293ff3", "NNpo-liY5aU", "Pharmacist explaining a medicine to a patient", "National Cancer Institute"),
  posterBoard: p("photo-1771344488060-f6b32a503b34", "3fx-mGg8Dzg", "Two people discussing a board of scientific posters", "Navy Medicine"),
  conferenceHall: p("photo-1540575467063-178a50c2df87", "F2KRf_QfCqw", "Audience seated at a conference", "Headway"),
  speakerStage: p("photo-1587825140708-dfaf72ae4b04", "6vAjp0pscX0", "Speaker on stage addressing a large audience", "Alexandre Pellaes"),
  boracaySunset: p("photo-1495031451303-d8ab59c8df37", "_mEuPiaz8pU", "Paraw sailboats at sunset off Boracay", "Bambi Corro"),
  lobbyCrowd: p("photo-1560439514-4e9645039924", "nOvIa_x_tfo", "Guests arriving in a busy event lobby", "Product School"),
  bookMockup: p("photo-1632062549850-44a0a6eede16", "qomIC8mCr0Y", "Hand holding an open printed booklet", "pmv chamara"),
  stickyNotes: p("photo-1586936893354-362ad6ae47ba", "w00FkE6e8zE", "Team planning a project with sticky notes", "UX Indonesia"),
  gondola: p("photo-1515706886582-54c73c5eaf41", "KfvknMhkmw0", "Supermarket display gondola from above", "Peter Bond"),
  skyline: p("photo-1580465446156-0a5b3eee11ae", "pxrn4Z671BI", "Metro Manila business-district towers", "JC Gellidon"),
  lobbyMarble: p("photo-1768270181430-3e3672a32283", "08MQb0SSUDQ", "Modern marble lobby of a financial building", "Andy Wang"),
  ballroom: p("photo-1780542900375-0cf459e38fbb", "T5v5i67QYGk", "Ballroom set for a gala dinner", "Lucas T Photography"),
  press: p("photo-1503694978374-8a2fa686963a", "Tzm3Oyu_6sk", "Printing press in operation", "Bank Phrom"),
  designTeam: p("photo-1787647561274-d48d803795a7", "CQzRpVkUorM", "Design team reviewing a project together", "Vitaly Gariev"),
} as const;

type Key = keyof typeof STOCK;
const pick = (m: Record<string, Key>) => (slug: string): StockPhoto | undefined => (m[slug] ? STOCK[m[slug]] : undefined);

/** Services whose tile/hero has no GLI image (SERVICE_MEDIA = null). */
export const serviceStock = pick({
  "pharma-and-medical-materials": "stethoscope",
  "booth-design-and-fabrication": "boothFloor",
  "merchandise-and-apparel": "tees",
});

/** Case studies with no permitted image (pharma/Rx work is kept off the site). */
export const caseStock = pick({
  "national-sales-conference-boracay": "boracaySunset",
  "philippine-pediatric-society-convention": "conferenceHall",
  "pharmacist-leads-programme": "pharmacistShelf",
  "retail-display-booth-and-dealers-convention": "expoHall",
});

/** Catalogue items with no GLI photo. */
export const productStock = pick({
  "event-backdrop": "speakerStage",
  "standee-and-cut-out": "lobbyCrowd",
  "detail-aid": "doctorTablet",
  "master-detailer-piece": "bookMockup",
  "patient-discount-card-kit": "pharmacistAdvice",
  "clinical-poster-journal-ad": "posterBoard",
  "convention-booth-package": "tradeShow",
  "event-shirts-and-jerseys": "jerseys",
});

export const articleStock = pick({
  "planning-a-medical-convention-booth-12-week-timeline": "tradeShow",
  "choosing-a-detail-aid-format": "bookMockup",
  "one-partner-or-five-vendors": "stickyNotes",
});

export const industryStock = pick({
  "pharma-and-healthcare": "speakerStage",
  "consumer-and-retail": "gondola",
  "real-estate-and-construction": "skyline",
  "banking-finance-and-insurance": "lobbyMarble",
  "associations-societies-and-schools": "ballroom",
});

export const pageStock = { about: STOCK.press, howWeWork: STOCK.designTeam };

export const stockUrl = (s: StockPhoto) => `https://images.unsplash.com/${s.id}?auto=format&fit=crop&w=1600&q=80`;
export const stockCredit = (s: StockPhoto) =>
  `https://unsplash.com/photos/${s.slug}?utm_source=gli_website&utm_medium=referral`;
