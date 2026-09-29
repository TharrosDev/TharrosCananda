"use client";

import { Analytics } from "@vercel/analytics/next";
import { privacySignal } from "@/lib/analytics";

/** Vercel Web Analytics, suppressed under Global Privacy Control. */
export function SiteAnalytics() {
  return <Analytics beforeSend={(event) => (privacySignal() ? null : event)} />;
}
