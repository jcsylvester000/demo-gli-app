"use client";

import type { AnchorHTMLAttributes } from "react";
import { track, type GliEvent } from "@/lib/analytics/track";

/** External/deep link (tel:, viber://, mailto:, wa.me, m.me) that fires a GA4 event on click. */
export function TrackedLink({
  event,
  channel,
  location,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { event: GliEvent; channel: string; location: string }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, { channel, location });
        props.onClick?.(e);
      }}
    />
  );
}
