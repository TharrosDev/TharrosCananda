import { useId } from "react";
import type { TrendPoint } from "@/types/market";

export function TrendChart({ data, compact = false }: { data: TrendPoint[]; compact?: boolean }) {
  const id = useId();
  const width = compact ? 400 : 620;
  const height = compact ? 190 : 250;
  const padding = { top: 16, right: 12, bottom: 32, left: 44 };
  const values = data.map((point) => point.value);
  // Graticule snaps to round divisions so the readouts are measured values, not arbitrary pixels.
  const step = Math.max(...values) - Math.min(...values) > 40 ? 20 : 10;
  const min = Math.floor((Math.min(...values) - 5) / step) * step;
  const max = Math.ceil((Math.max(...values) + 5) / step) * step;
  const ticks = Array.from({ length: (max - min) / step + 1 }, (_, index) => min + index * step);
  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;
  const y = (value: number) => padding.top + (1 - (value - min) / (max - min)) * usableHeight;
  const points = data.map((point, index) => ({
    ...point,
    x: padding.left + (index / (data.length - 1)) * usableWidth,
    y: y(point.value),
  }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const baseline = height - padding.bottom;

  return (
    <div className="chart-wrap">
      <svg className="trend-chart" role="img" aria-labelledby={`${id}-title ${id}-desc`} viewBox={`0 0 ${width} ${height}`}>
        <title id={`${id}-title`}>Illustrative five-year market trend</title>
        <desc id={`${id}-desc`}>
          The illustrative index moves from {data[0].value} in {data[0].year} to {data.at(-1)?.value} in {data.at(-1)?.year}.
        </desc>
        <g className="chart-graticule">
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={padding.left} y1={y(tick)} x2={width - padding.right} y2={y(tick)} className="chart-grid" />
              <text x={padding.left - 10} y={y(tick) + 4} textAnchor="end" className="chart-label">{tick}</text>
            </g>
          ))}
          {points.map((point) => (
            <line key={point.year} x1={point.x} y1={baseline} x2={point.x} y2={baseline + 5} className="chart-tick" />
          ))}
          <line x1={padding.left} y1={baseline} x2={width - padding.right} y2={baseline} className="chart-axis" />
        </g>
        <path d={`${path} L${points.at(-1)?.x},${baseline} L${points[0].x},${baseline} Z`} className="chart-area" />
        <path d={path} className="chart-line" pathLength={1} />
        {points.map((point) => (
          <g key={point.year} className="chart-point">
            <circle cx={point.x} cy={point.y} r="3.5" className="chart-dot" />
            <text x={point.x} y={height - 8} textAnchor="middle" className="chart-label">{point.year}</text>
          </g>
        ))}
      </svg>
      <table className="sr-only">
        <caption>Illustrative trend values</caption>
        <thead><tr><th>Year</th><th>Index</th></tr></thead>
        <tbody>{data.map((point) => <tr key={point.year}><td>{point.year}</td><td>{point.value}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
