"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { privacySignal, track, type AnalyticsEvent } from "@/lib/analytics";

export function AnalyticsBeacon({ event }: { event: AnalyticsEvent }) {
  useEffect(() => track(event), [event]);
  return null;
}

/** Vercel Web Analytics, suppressed under Global Privacy Control. */
export function SiteAnalytics() {
  return <Analytics beforeSend={(event) => (privacySignal() ? null : event)} />;
}
