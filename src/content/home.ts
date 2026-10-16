import { WORK_IMAGES } from "./work-images";

/** Home copy, verbatim from Document 4 §2. */
export const HOME = {
  seoTitle: "GLI | Print, Displays, Booths & Events Manila, Since 1996",
  metaDescription:
    "Graphics Library, Inc. takes pharma materials, print, retail displays, convention booths and events from first sketch to show floor. One team since 1996.",
  hero: {
    eyebrow: "Graphics Library, Inc. · Since 1996",
    h1Lead: "From first sketch to",
    h1Underline: "show floor.",
    sub: "Pharma materials, print, retail displays, booths and events: one accountable team, on your deadline.",
    primary: { label: "Request a Quote", href: "/quote" },
    secondary: { label: "See the work", href: "/work" },
    /** Proof collage (4). Only non-Rx images; the gate re-checks client permission at render time. */
    collage: [WORK_IMAGES.feuGolf, WORK_IMAGES.threeMDisplay, WORK_IMAGES.grohe, WORK_IMAGES.pinkArgonauts],
  },
  ribbonLabel: "Trusted by teams at",
  problem: {
    h2: "Five vendors. One deadline. Too many hand-offs.",
    body: "A launch can need a detail aid, a backdrop, a booth, an AVP and a quiz game, usually from five different suppliers. Every hand-off is a chance for the date to slip or the colours to drift. GLI closes the gap: the team that designs it is the team that prints, builds and runs it.",
    link: { label: "Read: One partner or five vendors?", href: "/insights/one-partner-or-five-vendors" },
  },
  services: { h2: "Designed. Printed. Built. Delivered.", intro: "Ten services, one team. Start with what you need; we'll handle the rest." },
  slider: {
    h2: "See it go from render to reality.",
    body: "Every display starts as a 3D render you approve. This supermarket tower was signed off as the render on the left and installed in store as the photo on the right.",
    labels: ["3D render for approval", "Installed in store"] as const,
  },
  featured: { h2: "Recent and remarkable", link: { label: "See all work", href: "/work" } },
  counters: [
    { value: 1996, label: "Incorporated in the Philippines", animate: false },
    { value: 30, label: "Years in 2026", animate: true },
    { value: 50, suffix: "+", label: "Brands served", animate: true },
    { value: 20, label: "Pharmaceutical clients", animate: true },
  ],
  process: {
    h2: "How we work",
    steps: [
      { n: "01", title: "Brief", body: "You tell us the goal, date, budget and must-haves. We ask the questions that save time later." },
      { n: "02", title: "Concept", body: "Designs, 3D renders or a run-of-show, with options where they help." },
      { n: "03", title: "Approval", body: "One round-up of comments, clearly versioned for your reviewers." },
      { n: "04", title: "Production", body: "Print, fabrication, AV and kitting, managed by one producer." },
      { n: "05", title: "Install / Run", body: "We set up, hand over, and stay on site when it matters." },
      { n: "06", title: "Wrap-up", body: "Photos, a short report, and anything stored for next time." },
    ],
  },
  industries: { h2: "Built for your industry's calendar" },
  insights: { h2: "From the production floor" },
};
