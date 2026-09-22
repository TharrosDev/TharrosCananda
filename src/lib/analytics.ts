import { track as vercelTrack } from "@vercel/analytics";

export type AnalyticsEvent = "research_service_viewed" | "research_request_started" | "research_request_submitted";

/** Honours Global Privacy Control: nothing is sent when the browser signals it. */
export const privacySignal = () =>
  typeof navigator !== "undefined" && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

export function track(event: AnalyticsEvent, properties?: Record<string, string>) {
  if (!privacySignal()) vercelTrack(event, properties);
}
