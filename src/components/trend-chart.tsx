import { useId } from "react";
import type { TrendPoint } from "@/types/market";

export function TrendChart({ data, compact = false }: { data: TrendPoint[]; compact?: boolean }) {
  const id = useId();
  const width = 620;
  const height = compact ? 180 : 240;
  const padding = { top: 18, right: 16, bottom: 34, left: 42 };
  const values = data.map((point) => point.value);
  const min = Math.min(...values) - 10;
  const max = Math.max(...values) + 10;
  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;
  const points = data.map((point, index) => ({
    ...point,
    x: padding.left + (index / (data.length - 1)) * usableWidth,
    y: padding.top + (1 - (point.value - min) / (max - min)) * usableHeight,
  }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");

  return (
    <div className="chart-wrap">
      <svg
        className="trend-chart"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <title id={`${id}-title`}>Illustrative five-year market trend</title>
        <desc id={`${id}-desc`}>
          The illustrative index moves from {data[0].value} in {data[0].year} to {data.at(-1)?.value} in {data.at(-1)?.year}.
        </desc>
        {[0, 0.5, 1].map((fraction) => {
          const y = padding.top + fraction * usableHeight;
          return <line key={fraction} x1={padding.left} y1={y} x2={width - padding.right} y2={y} className="chart-grid" />;
        })}
        <path d={`${path} L${points.at(-1)?.x},${height - padding.bottom} L${points[0].x},${height - padding.bottom} Z`} className="chart-area" />
        <path d={path} className="chart-line" />
        {points.map((point) => (
          <g key={point.year}>
            <circle cx={point.x} cy={point.y} r="4" className="chart-dot" />
            <text x={point.x} y={height - 10} textAnchor="middle" className="chart-label">
              {point.year}
            </text>
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
