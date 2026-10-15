import localFont from "next/font/local";

/**
 * Self-hosted fonts (Brand Kit §4), trimmed for speed (Batch 6):
 * - Barlow 500/600 for headings, nav, buttons, numbers: preloaded (the H1 uses it).
 * - Source Sans 3 400/600 for body and forms: not preloaded. Text paints at once in the size-matched Arial fallback
 *   and swaps when the font arrives, so first paint isn't held up on slow mobile networks.
 * Barlow 400 and Source Sans italic are not loaded (unused outside the style guide).
 */
export const barlow = localFont({
  src: [
    { path: "../fonts/barlow-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/barlow-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const sourceSans = localFont({
  src: [
    { path: "../fonts/source-sans-3-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/source-sans-3-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-source-sans",
  display: "swap",
  preload: false,
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});
