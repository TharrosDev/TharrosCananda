"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

export function AnalyticsBeacon({ event, properties }: { event: AnalyticsEvent; properties?: Record<string, string> }) {
  useEffect(() => {
    track(event, properties);
  }, [event, properties]);
  return null;
}
