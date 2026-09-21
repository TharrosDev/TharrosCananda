import type { ProvinceShare } from "@/types/market";

export function ProvinceBars({ data, compact = false }: { data: ProvinceShare[]; compact?: boolean }) {
  return (
    <div className={compact ? "province-bars province-bars-compact" : "province-bars"}>
      {data.map((item) => (
        <div className="province-row" key={item.province}>
          <span>{item.province}</span>
          <div className="province-track" aria-hidden="true">
            <span style={{ width: `${item.value}%` }} />
          </div>
          <strong>{item.value}%</strong>
        </div>
      ))}
      <p className="sr-only">
        Illustrative provincial shares: {data.map((item) => `${item.province} ${item.value} percent`).join(", ")}.
      </p>
    </div>
  );
}
