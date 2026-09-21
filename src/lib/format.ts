import type { DataStatus, MarketResult } from "@/types/market";

/** Signed change with a real minus sign; zero is shown without a sign. */
export function formatDelta(delta: number, unit: string) {
  if (delta === 0) return `No change (0 ${unit})`;
  return `${delta > 0 ? "+" : "−"}${Math.abs(delta)} ${unit}`;
}

export function trendDelta(result: MarketResult) {
  const points = result.trend.points;
  return points.length < 2 ? 0 : points[points.length - 1].value - points[0].value;
}

export function formatSourceDate(date: string | null, status: DataStatus) {
  if (!date) return status === "demo" ? "Not applicable (sample values)" : "Not recorded";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

/** All caveats that apply to a result: evidence-level first, then result-level, without duplicates. */
export function collectLimitations(result: MarketResult) {
  const blocks = [result.trend, result.provinces, result.routes, result.resources];
  return [...new Set([...blocks.flatMap((block) => block.limitations ?? []), ...result.limitations])];
}
