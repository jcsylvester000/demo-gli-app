import localFont from "next/font/local";

// Self-hosted (Brand Kit §4): Barlow 400/500/600 for headings, nav, buttons, numbers; Source Sans 3 400/600 + italic for body and forms.
export const barlow = localFont({
  src: [
    { path: "../fonts/barlow-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/barlow-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/barlow-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const sourceSans = localFont({
  src: [
    { path: "../fonts/source-sans-3-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/source-sans-3-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/source-sans-3-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-source-sans",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});
