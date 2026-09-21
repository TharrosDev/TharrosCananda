import { useId } from "react";
import type { TrendPoint } from "@/types/market";

type Props = {
  data: TrendPoint[];
  title?: string;
  description?: string;
  caption?: string;
  valueFormat?: "number" | "currency";
};

const compactNumber = new Intl.NumberFormat("en-CA", { notation: "compact", maximumFractionDigits: 1 });
const compactCurrency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function TrendChart({
  data,
  title = "Time series",
  description,
  caption = "Values by period",
  valueFormat = "number",
}: Props) {
  const id = useId();
  if (!data.length) return null;

  const width = 620;
  const height = 250;
  const padding = { top: 16, right: 12, bottom: 34, left: 64 };
  const values = data.map((point) => point.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const spread = rawMax - rawMin || Math.max(Math.abs(rawMax) * 0.08, 1);
  const min = Math.max(0, rawMin - spread * 0.12);
  const max = rawMax + spread * 0.12;
  const ticks = Array.from({ length: 5 }, (_, index) => min + ((max - min) * index) / 4);
  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;
  const y = (value: number) => padding.top + (1 - (value - min) / (max - min || 1)) * usableHeight;
  const points = data.map((point, index) => ({
    ...point,
    x: padding.left + (index / Math.max(1, data.length - 1)) * usableWidth,
    y: y(point.value),
  }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const baseline = height - padding.bottom;
  const format = valueFormat === "currency" ? (value: number) => compactCurrency.format(value) : (value: number) => compactNumber.format(value);
  const labelEvery = Math.max(1, Math.ceil(points.length / 6));
  const desc =
    description ??
    `The series moves from ${format(data[0].value)} in ${data[0].year} to ${format(data.at(-1)?.value ?? data[0].value)} in ${data.at(-1)?.year ?? data[0].year}.`;

  return (
    <div className="chart-wrap">
      <svg className="trend-chart" role="img" aria-labelledby={`${id}-title ${id}-desc`} viewBox={`0 0 ${width} ${height}`}>
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-desc`}>{desc}</desc>
        <g className="chart-graticule">
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={padding.left} y1={y(tick)} x2={width - padding.right} y2={y(tick)} className="chart-grid" />
              <text x={padding.left - 10} y={y(tick) + 4} textAnchor="end" className="chart-label">{format(tick)}</text>
            </g>
          ))}
          {points.map((point, index) => (
            <g key={`${point.year}-${index}`}>
              <line x1={point.x} y1={baseline} x2={point.x} y2={baseline + 5} className="chart-tick" />
              {(index % labelEvery === 0 || index === points.length - 1) && (
                <text x={point.x} y={height - 8} textAnchor="middle" className="chart-label">{point.year}</text>
              )}
            </g>
          ))}
          <line x1={padding.left} y1={baseline} x2={width - padding.right} y2={baseline} className="chart-axis" />
        </g>
        <path d={`${path} L${points.at(-1)?.x},${baseline} L${points[0].x},${baseline} Z`} className="chart-area" />
        <path d={path} className="chart-line" pathLength={1} />
        {points.map((point, index) => <circle key={`${point.year}-dot-${index}`} cx={point.x} cy={point.y} r="3.5" className="chart-dot" />)}
      </svg>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead><tr><th>Period</th><th>Value</th></tr></thead>
        <tbody>{data.map((point, index) => <tr key={`${point.year}-row-${index}`}><td>{point.year}</td><td>{point.value}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
