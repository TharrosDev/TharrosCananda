export type AnalyticsEvent =
  | "market_explorer_started"
  | "market_explorer_completed"
  | "research_service_viewed"
  | "research_request_started"
  | "research_request_submitted";

export function track(event: AnalyticsEvent, properties: Record<string, string> = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("tharros:analytics", { detail: { event, properties } }));

  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  const privacyControl = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
  if (!endpoint || privacyControl) return;

  const body = JSON.stringify({ event, properties, path: window.location.pathname });
  navigator.sendBeacon?.(endpoint, body);
}
