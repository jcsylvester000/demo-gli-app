"use client";

import { useEffect } from "react";
import { track, type GliEvent } from "@/lib/analytics/track";

/** Fires one GA4 event when the page is viewed (e.g. case_view). */
export function TrackView({ event, params }: { event: GliEvent; params: Record<string, string> }) {
  const key = JSON.stringify(params);
  useEffect(() => {
    track(event, JSON.parse(key));
  }, [event, key]);
  return null;
}
