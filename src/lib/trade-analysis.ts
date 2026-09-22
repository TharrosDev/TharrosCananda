import type { TradePoint } from "@/types/official-data";

function monthKey(period: string) {
  const match = period.match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : null;
}

export function yearAgoChange(points: TradePoint[]) {
  if (!points.length) return null;
  const latest = points.at(-1);
  if (!latest) return null;
  const key = monthKey(latest.period);
  if (!key) return null;

  const [year, month] = key.split("-").map(Number);
  const target = `${String(year - 1).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
  const previous = points.find((point) => monthKey(point.period) === target);
  if (!previous || previous.valueCad === 0) return null;
  return ((latest.valueCad - previous.valueCad) / previous.valueCad) * 100;
}
