/**
 * Client register defaults (BRD FR-086). Every client starts as "pending": names and logos stay hidden and
 * case studies use the anonymous label instead. The admin (Batch 5) stores the real status in Neon
 * (client_permission), which overrides these defaults.
 */
export type PermissionStatus = "yes" | "name_only" | "no" | "pending";
export type IndustrySlug =
  | "pharma-and-healthcare"
  | "consumer-and-retail"
  | "real-estate-and-construction"
  | "banking-finance-and-insurance"
  | "associations-societies-and-schools";

export type Client = { slug: string; name: string; industry: IndustrySlug };

export const CLIENTS: Client[] = [
  { slug: "pfizer", name: "Pfizer", industry: "pharma-and-healthcare" },
  { slug: "gsk", name: "GSK", industry: "pharma-and-healthcare" },
  { slug: "janssen", name: "Janssen", industry: "pharma-and-healthcare" },
  { slug: "novartis", name: "Novartis", industry: "pharma-and-healthcare" },
  { slug: "boehringer-ingelheim", name: "Boehringer Ingelheim", industry: "pharma-and-healthcare" },
  { slug: "fresenius-kabi", name: "Fresenius Kabi", industry: "pharma-and-healthcare" },
  { slug: "mead-johnson", name: "Mead Johnson", industry: "pharma-and-healthcare" },
  { slug: "3m", name: "3M", industry: "consumer-and-retail" },
  { slug: "philips", name: "Philips", industry: "consumer-and-retail" },
  { slug: "hp", name: "Hewlett Packard", industry: "consumer-and-retail" },
  { slug: "colgate-palmolive", name: "Colgate-Palmolive", industry: "consumer-and-retail" },
  { slug: "lixil", name: "LIXIL (GROHE, American Standard)", industry: "real-estate-and-construction" },
  { slug: "megaworld", name: "Megaworld", industry: "real-estate-and-construction" },
  { slug: "asia-united-bank", name: "Asia United Bank", industry: "banking-finance-and-insurance" },
  { slug: "otsuka", name: "Otsuka", industry: "pharma-and-healthcare" },
  { slug: "sandoz", name: "Sandoz", industry: "pharma-and-healthcare" },
  { slug: "servier", name: "Servier", industry: "pharma-and-healthcare" },
  { slug: "zuellig-pharma", name: "Zuellig Pharma", industry: "pharma-and-healthcare" },
  { slug: "pma", name: "PMA", industry: "pharma-and-healthcare" },
  { slug: "hersheys", name: "Hershey's", industry: "consumer-and-retail" },
  { slug: "century-canning", name: "Century Canning", industry: "consumer-and-retail" },
  { slug: "bvlgari-rustans", name: "Bvlgari of Rustan's", industry: "consumer-and-retail" },
  { slug: "sweet-bella", name: "Sweet Bella", industry: "consumer-and-retail" },
  { slug: "the-wedding-store", name: "The Wedding Store", industry: "consumer-and-retail" },
  { slug: "lucky-me", name: "Lucky Me", industry: "consumer-and-retail" },
  { slug: "landco-pacific", name: "Landco Pacific", industry: "real-estate-and-construction" },
  { slug: "fairground-developers", name: "Fairground Developers", industry: "real-estate-and-construction" },
  { slug: "hoshin-construction", name: "Hoshin Construction", industry: "real-estate-and-construction" },
  { slug: "heritage-place", name: "Heritage Place", industry: "real-estate-and-construction" },
  { slug: "nuvali", name: "Nuvali", industry: "real-estate-and-construction" },
  { slug: "international-exchange-bank", name: "International Exchange Bank", industry: "banking-finance-and-insurance" },
  { slug: "philamlife", name: "Philamlife", industry: "banking-finance-and-insurance" },
  { slug: "amwslai", name: "AMWSLAI Savings and Loans", industry: "banking-finance-and-insurance" },
  { slug: "feu-nrmf-medical-alumni", name: "FEU-NRMF Medical Alumni Society", industry: "associations-societies-and-schools" },
  { slug: "pink-argonauts", name: "The Pink Argonauts", industry: "associations-societies-and-schools" },
];

export const clientBySlug = (slug: string) => CLIENTS.find((c) => c.slug === slug);
