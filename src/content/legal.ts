import type { Faq } from "./gated";

/** FAQ, Privacy and Terms (Document 4 §11). Legal text is a draft for GLI's counsel. */
export const FAQ_PAGE = {
  seoTitle: "FAQ: Timelines, Printing, Booths & Payment | GLI",
  meta: "Answers to common questions about lead times, in-house versus partner production, coverage outside Metro Manila, payment terms and file formats.",
  h1: "Frequently asked questions",
  items: [
    { q: "What does GLI do?", a: "We design and produce marketing materials, packaging, retail displays, convention booths, events and interactive content, from first sketch to show floor." },
    { q: "Do you print and build in-house?", a: null },
    { q: "How fast can you turn a job around?", a: "It depends on the job. Tell us your date and we'll tell you honestly what's possible." },
    { q: "Do you work outside Metro Manila?", a: "Our work has included events in Boracay and Batangas. Tell us your location and we'll confirm what we can deliver there." },
    { q: "What are your payment terms?", a: null },
    { q: "Do you sign NDAs?", a: "Yes." },
    { q: "Can I see work similar to my project?", a: "Yes, see our Work page, or ask us and we'll share relevant examples privately." },
    { q: "What files should I send?", a: "Whatever you have: a brief, logos, brand guidelines, approved copy. We'll tell you if anything is missing." },
  ] satisfies Faq[],
};

export const PRIVACY = {
  seoTitle: "Privacy Notice | GLI",
  meta: "How Graphics Library, Inc. collects and uses personal data under the Data Privacy Act of 2012 (RA 10173).",
  h1: "Privacy notice",
  sections: [
    {
      h: "What we collect and why",
      p: "Graphics Library, Inc. collects the personal data you give us (name, company, contact details, files and messages) to respond to your enquiry, prepare quotes and deliver projects.",
    },
    {
      h: "How we handle it",
      p: "We process it under the Data Privacy Act of 2012 (RA 10173), keep it only as long as needed, store files privately, and share it only with service providers who help us run this website and our business, such as email and hosting providers.",
    },
    {
      h: "Cookies and analytics",
      p: "Analytics cookies are off unless you accept them in the cookie banner. You can change your choice at any time from \"Cookie settings\" in the footer.",
    },
    {
      h: "Your rights",
      p: "You can ask to access, correct or delete your data. Contact us through the Contact page and we will respond as the law requires.",
    },
  ],
  draftNote: "Summary notice. The full text, the privacy contact and the Data Protection Officer's details are being finalised with GLI's counsel.",
};

export const TERMS = {
  seoTitle: "Terms of Use | GLI",
  meta: "Terms for using the Graphics Library, Inc. website.",
  h1: "Terms of use",
  sections: [
    { h: "Using this website", p: "This website is provided by Graphics Library, Inc. to describe our services and to let you contact us. By using it you agree to these terms." },
    { h: "Our work and other brands", p: "Portfolio items are shown with our clients' permission. Client names, logos and product marks belong to their respective owners and may not be reused." },
    { h: "Content", p: "Text, designs and images on this site belong to Graphics Library, Inc. or its clients. You may share links to our pages but may not copy content for commercial use without permission." },
    { h: "Quotes and information", p: "Information on this site is general. Prices, lead times and specifications are confirmed only in a written quotation from GLI." },
    { h: "Governing law", p: "These terms are governed by the laws of the Republic of the Philippines." },
  ],
  draftNote: "Draft for review by GLI's counsel before launch.",
};
