# Third-party licences and component sources

Signature components are adapted from MIT-licensed bases (BRD §5, Brand Kit §9). Each entry records the source, author and licence.
Items marked "layout reference only" had no licence on 21st.dev and are rebuilt from shadcn/ui primitives; no code was copied.

| Component | Used in | Source | Author | Licence | Status |
|---|---|---|---|---|---|
| Fonts: Barlow | All pages | @fontsource/barlow (Google Fonts) | Jeremy Tribby | SIL OFL 1.1 | Self-hosted in src/fonts |
| Fonts: Source Sans 3 | All pages | @fontsource/source-sans-3 (Google Fonts) | Adobe (Paul D. Hunt) | SIL OFL 1.1 | Self-hosted in src/fonts |
| Icons | UI | lucide-react | Lucide contributors | ISC | npm |
| NAV header + mega-menu | All pages | Navbar Menu (Aceternity) as reference | Aceternity | MIT | Built from scratch (Batch 1) |
| S10 Press Footer | All pages | Footer Two (Tailark) as reference | Tailark | MIT | Built from scratch (Batch 1) |
| S1 Show-Floor Hero | Home (+ About, Service heroes) | Editorial Collage Hero (felipemenezes098) layout reference only (no licence); Ripple + Shimmer Button (Magic UI) | felipemenezes098; Dillion Verma (Magic UI) | Hero: none (rebuilt from scratch); Magic UI: MIT | Built (Batch 2); ripple re-implemented in CSS |
| S2 Sketch-to-Show-Floor Slider | Service + case pages | Image Comparison (Motion Primitives) | ibelick | MIT | Rebuilt (Batch 2); not on Home until a cleared render/build pair exists |
| S3 Industry Client Ribbon | Home, About, Industry | Marquee (Magic UI) | Dillion Verma | MIT | Rebuilt in CSS (Batch 2) |
| S4 Since-1996 Counters | Home, Work hub, Quote | Number Ticker (Magic UI) | Dillion Verma | MIT | Rebuilt (Batch 2) |
| S5 Press-Sheet Services Grid | Home, Services hub | Bento Grid (Magic UI) | Dillion Verma | MIT | Rebuilt (Batch 2) |
| S6 Job-Folder Case Card | Home, Work, Service, Industry, Case | gallery4 (shadcnblocks) layout reference only (no licence); shadcn Card | shadcnblocks; shadcn | none (rebuilt); shadcn: MIT | Built (Batch 2) |
| S7 On-Press Process Timeline | Home, How We Work, About, Service | How It Works Timeline; Timeline (Aceternity) | olewandowski1; Aceternity | MIT / MIT | Rebuilt (Batch 2) |
| S8 Job-Ticket Quote Form | /quote | Segmented Progress Pill Stepper (ShadcnSpace); File Upload (Aceternity) | ShadcnSpace; Aceternity | MIT / MIT | Batch 4 |
| S9 Spec-Sheet Product Card | Products, Service | Pricing 1 / veil-pricing-1 (Tailark) | Tailark | MIT | Rebuilt (Batch 2) |
| S11 Client Sign-Off Testimonial | Home, Case, Industry | Testimonials Five / mist-testimonials-5 (Tailark) | Tailark | MIT | Rebuilt (Batch 2); renders only approved quotes |
| S12 Proof FAQ | Service, Product, FAQ | Accordion (shadcn) | shadcn | MIT | Rebuilt on native details/summary (Batch 2) |
| S13 Insight Article Row | Home, Insights, Service | Blog 8 (shadcnblocks) | shadcnblocks | MIT | Rebuilt (Batch 2) |
| Portfolio preview images | Home, cards | Cropped from GLI Brand Kit portfolio board (GLI's own work) | GLI | Client work; publish per permission register | Replace with GLI originals before launch |
| Cutting-mat hero, page heroes, CTA panel | All landing pages | 21st.dev hero/CTA patterns reviewed for direction only (Responsive Hero Banner, Centered Hero with Image Fan) | various 21st.dev authors | n/a (no code copied) | Original CSS (mat-grid, rulers, dealt proofs), 2026-10-16 |
| Vendor-merge diagram | Home problem band | 21st.dev "Grid Feature Cards" reviewed for direction only | Efferd | n/a (no code copied) | Original component, 2026-10-16 |
| Illustrative photos | Image-less slots | Unsplash (hot-linked, credited) | see src/content/stock.ts | Unsplash Licence | Replace with GLI originals when supplied |
