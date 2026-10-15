import { siteUrl } from "./utils";

/** Small JSON-LD builders matching the SEO Map "Schema" column (BRD FR-091). */
export const orgRef = () => ({ "@id": `${siteUrl()}/#organization` });
const abs = (path: string) => `${siteUrl()}${path === "/" ? "" : path}`;

export const itemList = (name: string, items: { name: string; path: string }[]) => ({
  "@type": "ItemList",
  name,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
});

export const collectionPage = (name: string, path: string, items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  url: abs(path),
  inLanguage: "en-PH",
  isPartOf: { "@id": `${siteUrl()}/#website` },
  mainEntity: itemList(name, items),
});

export const listPage = (name: string, path: string, items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  ...itemList(name, items),
  url: abs(path),
});

export const localBusiness = (extra: Record<string, unknown> = {}) => ({
  "@type": "LocalBusiness",
  "@id": `${siteUrl()}/#localbusiness`,
  name: "Graphics Library, Inc.",
  alternateName: "GLI",
  url: siteUrl(),
  logo: `${siteUrl()}/brand/gli-mark.svg`,
  image: `${siteUrl()}/og.jpg`,
  foundingDate: "1996",
  areaServed: { "@type": "Country", name: "Philippines" },
  parentOrganization: orgRef(),
  ...extra,
});
