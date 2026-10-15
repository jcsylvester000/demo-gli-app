"use client";

import { useState } from "react";

/** Google Maps embed that loads only on request (BRD FR-070: map lazy-loads; no Google requests before the click). */
export function MapEmbed({ query }: { query: string }) {
  const [show, setShow] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return show ? (
    <iframe title="Map: GLI office" src={src} loading="lazy" className="aspect-[4/3] w-full rounded-[var(--radius)] border border-gli-line" referrerPolicy="no-referrer-when-downgrade" />
  ) : (
    <button type="button" onClick={() => setShow(true)} className="grid aspect-[4/3] w-full place-items-center rounded-[var(--radius)] border border-dashed border-gli-signal/60 bg-gli-mist font-heading font-semibold text-gli-blue">
      Find us on Google Maps (loads the map)
    </button>
  );
}
