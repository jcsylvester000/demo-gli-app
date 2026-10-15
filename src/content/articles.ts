/** Launch articles (Document 4 §8). Bodies, author box and TOC arrive with the article template in Batch 3. */
export const INSIGHT_CATEGORIES = [
  { slug: "conventions-and-booths", name: "Conventions & Booths" },
  { slug: "pharma-materials", name: "Pharma Materials" },
  { slug: "events-and-launches", name: "Events & Launches" },
  { slug: "retail-display-and-packaging", name: "Retail Display & Packaging" },
  { slug: "print-and-large-format", name: "Print & Large-Format" },
  { slug: "working-with-a-production-partner", name: "Working with a Production Partner" },
] as const;

export type ArticleMeta = { slug: string; title: string; category: (typeof INSIGHT_CATEGORIES)[number]["slug"]; excerpt: string; readMins: number; published: string; /** Only when "{title} | GLI Insights" would pass 60 characters (SEO Map rule). */ seoTitle?: string };

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "planning-a-medical-convention-booth-12-week-timeline",
    title: "Planning a medical-convention booth: a 12-week timeline",
    seoTitle: "Medical-Convention Booth Planning: 12-Week Timeline | GLI",
    category: "conventions-and-booths",
    excerpt: "A week-by-week plan for a pharma booth at a Philippine medical convention, from brief and 3D render to install, show days and wrap-up.",
    readMins: 5,
    published: "2026-10-15",
  },
  {
    slug: "choosing-a-detail-aid-format",
    title: "2-pager, 6-pager or 14-pager: choosing a detail-aid format",
    seoTitle: "2-, 6- or 14-Pager? Choosing a Detail-Aid Format | GLI",
    category: "pharma-materials",
    excerpt: "How to choose a detail-aid format for pharma reps: what 2-, 4-, 6-, 12- and 14-pagers and Master Detailer Pieces are best for.",
    readMins: 3,
    published: "2026-10-15",
  },
  {
    slug: "one-partner-or-five-vendors",
    title: "One partner or five vendors? What vendor sprawl really costs a launch",
    seoTitle: "One Partner or Five Vendors? The Cost of Sprawl | GLI",
    category: "working-with-a-production-partner",
    excerpt: "Why splitting a launch across designers, printers, fabricators and event suppliers costs time and money, and how to judge a one-team partner.",
    readMins: 3,
    published: "2026-10-15",
  },
];

export const categoryName = (slug: string) => INSIGHT_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

/**
 * Article bodies (Document 4 §8). Sections become the "On this page" table of contents.
 * Author: GLI has not named authors yet (FR-051 needs a named Person): `author` stays null and the page credits
 * "The GLI production team" until GLI supplies a name, role and years in production.
 */
export type ArticleBody = {
  intro: string;
  sections: { h: string; p: string[] }[];
  checklist?: string[];
  close: string;
  sources?: { label: string; url: string; note?: string }[];
  author: { name: string; role: string; years: number } | null;
  updated?: string;
};

export const ARTICLE_BODIES: Record<string, ArticleBody> = {
  "planning-a-medical-convention-booth-12-week-timeline": {
    intro:
      "Twelve weeks is a comfortable runway for a custom booth at a medical convention. Here is how to use it, so the booth is handed over before opening day, not in a last-minute rush.",
    sections: [
      {
        h: "Weeks 12–10: Brief and booth space",
        p: [
          "Confirm your booth location and size with the organiser, and get the exhibitor manual, which sets height limits, rigging rules and load-in times.",
          "Write a one-page brief: the objective (awareness, a new indication, sign-ups), the products featured, the activities planned, and the budget band.",
        ],
      },
      {
        h: "Weeks 10–8: Concept and 3D render",
        p: ["Your production partner turns the brief into a floor plan and 3D views. Check traffic flow (where do physicians enter and stop?), storage, and where the screen or game will go."],
      },
      {
        h: "Weeks 8–6: Approvals",
        p: [
          "Booth graphics and any product claims go through your medical, legal and regulatory review. Build that time into the plan.",
          "The 2016 version of the PHAP Code of Practice says exhibit booths should be directed only to healthcare professionals and restricts raffles; confirm the current rules with your compliance team before planning activities.",
        ],
      },
      {
        h: "Weeks 6–3: Production",
        p: ["Fabrication of walls, counters and lightboxes; printing of graphics; building of AVPs and touchscreen games. Ask for a progress photo set at the half-way point."],
      },
      {
        h: "Weeks 3–1: Logistics",
        p: ["Confirm load-in slots, electrical requirements, crew passes and the bump-out schedule. Prepare the booth kit: leave-behinds, giveaways of modest value, and registration materials."],
      },
      {
        h: "Show days",
        p: ["Your partner hands over the finished booth before the doors open and keeps a technician on call. Brief your reps on the game or AVP so they can use it to start conversations."],
      },
      {
        h: "Wrap-up",
        p: ["Dismantle, store reusable elements, and collect photos and a short report while memories are fresh. The best time to plan next year's booth is the week after this one."],
      },
    ],
    checklist: ["Exhibitor manual", "Signed-off floor plan", "Approved graphics", "Electrical plan", "Crew list", "Booth kit", "On-site contact"],
    close: "Planning a booth for the next convention season? Start a job ticket and we'll send back a timeline built around your date.",
    sources: [
      {
        label: "PHAP Code of Practice (2016 version), section 8.4 on exhibits",
        url: "https://mcprinciples.apec.org/wp-content/uploads/2020/01/phap_code_of_practice_2016_v.pdf",
        note: "Accessed 15 Oct 2026. A 2020 revision exists; check the current version with PHAP or your compliance team.",
      },
    ],
    author: null,
  },
  "choosing-a-detail-aid-format": {
    intro: "The right detail-aid format depends on how much story your rep needs to tell, and how long the doctor will give them.",
    sections: [
      { h: "2-pager", p: ["One key message and one proof point. Best for reminder calls and busy clinics."] },
      { h: "4- and 6-pagers", p: ["The workhorses. Room for the problem, the evidence, the dosing and a clear close. Gate-folds create a reveal that reps can use in conversation."] },
      {
        h: "12- and 14-pagers",
        p: ["Launch-level storytelling, covering disease background, mechanism, multiple studies and patient types. Use tabs or colour-coding so reps can jump to the page the doctor asks about."],
      },
      { h: "Master Detailer Pieces and dimensional formats", p: ["Large, tactile launch pieces that carry the whole brand story. Budget more time for prototyping."] },
      { h: "E-detail aids", p: ["Ideal when reps use tablets and you want to update content between cycles. Many teams run print and digital side by side."] },
      { h: "Rule of thumb", p: ["Write the call first, then choose the format. If a page doesn't earn its place in the conversation, cut it."] },
    ],
    close: "Need help choosing? Start a job ticket with your key messages, and we'll recommend a format and send a sample layout.",
    author: null,
  },
  "one-partner-or-five-vendors": {
    intro: "Splitting a launch across five suppliers can look cheaper line by line, but the costs hide in the hand-offs.",
    sections: [
      { h: "Coordination time", p: ["Every supplier needs a briefing, files, approvals and follow-ups. That is your team's time, multiplied by five."] },
      {
        h: "Re-work",
        p: ["Artwork built for a brochure rarely drops straight onto a 6-metre backdrop or a booth wall. Someone resizes, re-proofs and re-approves, and in pharma that means another review cycle."],
      },
      { h: "Colour drift", p: ["Different printers, substrates and screens shift colours. One studio managing all output catches it before it ships."] },
      { h: "Accountability", p: ["When the backdrop is late because the artwork was late because the copy was late, the chain of blame helps no one on event day."] },
      {
        h: "What to look for in a one-team partner",
        p: [
          "Proof they've delivered all the formats you need, one named producer, a written timeline with approval points, and a clear line between what they make in-house and what they manage through trusted suppliers.",
        ],
      },
    ],
    close: "That is how GLI has worked since 1996. Start a job ticket and see the difference on your next launch.",
    author: null,
  },
};

export const ARTICLE_SERVICE: Record<string, string> = {
  "planning-a-medical-convention-booth-12-week-timeline": "booth-design-and-fabrication",
  "choosing-a-detail-aid-format": "pharma-and-medical-materials",
  "one-partner-or-five-vendors": "events-conventions-and-launches",
};
