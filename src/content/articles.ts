/** Launch articles (Document 4 §8). Bodies, author box and TOC arrive with the article template in Batch 3. */
export const INSIGHT_CATEGORIES = [
  { slug: "conventions-and-booths", name: "Conventions & Booths" },
  { slug: "pharma-materials", name: "Pharma Materials" },
  { slug: "events-and-launches", name: "Events & Launches" },
  { slug: "retail-display-and-packaging", name: "Retail Display & Packaging" },
  { slug: "print-and-large-format", name: "Print & Large-Format" },
  { slug: "working-with-a-production-partner", name: "Working with a Production Partner" },
] as const;

export type ArticleMeta = { slug: string; title: string; category: (typeof INSIGHT_CATEGORIES)[number]["slug"]; excerpt: string; readMins: number; published: string };

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "planning-a-medical-convention-booth-12-week-timeline",
    title: "Planning a medical-convention booth: a 12-week timeline",
    category: "conventions-and-booths",
    excerpt: "A week-by-week plan for a pharma booth at a Philippine medical convention, from brief and 3D render to install, show days and wrap-up.",
    readMins: 5,
    published: "2026-10-15",
  },
  {
    slug: "choosing-a-detail-aid-format",
    title: "2-pager, 6-pager or 14-pager: choosing a detail-aid format",
    category: "pharma-materials",
    excerpt: "How to choose a detail-aid format for pharma reps: what 2-, 4-, 6-, 12- and 14-pagers and Master Detailer Pieces are best for.",
    readMins: 3,
    published: "2026-10-15",
  },
  {
    slug: "one-partner-or-five-vendors",
    title: "One partner or five vendors? What vendor sprawl really costs a launch",
    category: "working-with-a-production-partner",
    excerpt: "Why splitting a launch across designers, printers, fabricators and event suppliers costs time and money, and how to judge a one-team partner.",
    readMins: 3,
    published: "2026-10-15",
  },
];

export const categoryName = (slug: string) => INSIGHT_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
