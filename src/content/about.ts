import { gated, type Gated } from "./gated";

/** About, How We Work and Clients (Document 4 §3). */
export const ABOUT = {
  seoTitle: "About GLI: Manila Creative Production Since 1996",
  meta: "Graphics Library, Inc. has been a partner to marketing teams since 1996: quality, cost-efficiency and time, with one accountable team.",
  h1: "A partner since 1996",
  intro:
    "Graphics Library, Inc. began in 1996 as a graphic design and printing company. As our clients' needs grew, so did we: today we design and produce everything from detail aids and packaging to retail displays, convention booths and full events. What hasn't changed is how we work. We build long-term relationships through personal service and quality work, as an alliance in our clients' objectives.",
  story: [
    { when: "1996", text: "Graphics Library, Inc. is incorporated, focused on graphic design and printing." as Gated },
    {
      when: "2000s",
      text: "Pharma becomes our specialism: detail aids, patient programmes, symposia, a sales conference in Boracay and convention booths, including the PCP Annual Conventions of 2007 and 2008." as Gated,
    },
    {
      when: "2010s",
      text: gated(
        "Retail displays and packaging for 3M and Philips; launches and conferences in Manila's top hotels; Philips Dealers Convention 2014.",
        "Retail displays and packaging for global consumer brands; launches and conferences in Manila's top hotels; a national dealers convention in 2014.",
        ["3m", "philips"],
      ),
    },
    {
      when: "2020s",
      text: gated(
        "Product literature for GROHE and American Standard (2022) and the FEU-NRMF 50th Alumni Homecoming (2025).",
        "Product literature for a global kitchen and bath brand (2022) and a medical alumni society's 50th homecoming (2025).",
        ["lixil", "feu-nrmf-medical-alumni"],
      ),
    },
    { when: "Today", text: "30 years on, one team from first sketch to show floor." as Gated },
  ],
  values: [
    { title: "Quality", body: "We are immersed in every stage of a project. Anything that leaves our office represents our clients, so it has to surpass their standards." },
    { title: "Cost-efficiency", body: "We respect your budget and work within it, through supplier pricing, smart material choices and alternative ways of executing an idea." },
    { title: "Time", body: "Marketing materials are urgent. We know we are one link in your chain of schedules, and that a delay on our side disrupts everyone's." },
    { title: "Partnership", body: "We aim to be an alliance, a partner in reaching your objectives, not just a supplier." },
  ],
  glance: [
    { label: "Legal name", value: "Graphics Library, Inc." },
    { label: "Founded", value: "1996" },
    { label: "Based in", value: "Metro Manila, Philippines" },
    { label: "Services", value: "Design, print, large-format, retail display, packaging, booths, events, AV and interactive, merchandise" },
    { label: "Industries", value: "Pharma and healthcare, consumer and retail, real estate and construction, banking and finance, associations and education" },
  ],
};

export const HOW_WE_WORK = {
  seoTitle: "How We Work: From Brief to Show Floor | GLI",
  meta: "Our six-step process from brief, concept and approval to production, install and wrap-up, with one point of contact throughout.",
  h1: "How we work",
  intro: "Every job, from a single pull-up banner to a three-day convention, runs through the same six steps, with one producer as your point of contact.",
  needFromYou: [
    "Your objective, audience and key date",
    "Approved content (for pharma: MLR-approved copy and references)",
    "Brand guidelines and logo files",
    "Venue details or store list",
    "Budget band, so we can recommend the right execution",
  ],
};

export const CLIENTS_PAGE = {
  seoTitle: "Clients: 50+ Brands Since 1996 | GLI",
  meta: "Pharma, consumer, real estate, banking and education brands GLI has worked with since 1996, grouped by industry.",
  h1: "Clients since 1996",
  intro: "We are proud of the brands that have trusted us. Some appear here as names only, out of respect for their confidentiality.",
};
