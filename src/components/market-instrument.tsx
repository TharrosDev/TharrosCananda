import Link from "next/link";
import { DatasetDiscovery } from "@/components/dataset-discovery";
import { ArrowIcon } from "@/components/icons";
import { MarketControls } from "@/components/market-controls";
import { TrendChart } from "@/components/trend-chart";
import { requestResearchHref } from "@/lib/research-request";
import { isStale, marketHref, type MarketSelection } from "@/lib/statcan";
import { getCetaGroups, getCetaTrade } from "@/lib/statcan-data";
import { yearAgoChange } from "@/lib/trade-analysis";
import type { DataFlag } from "@/types/official-data";

const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", notation: "compact", maximumFractionDigits: 1 });
const exact = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
export function monthLabel(value: string, month: "short" | "long" = "short") {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-CA", { year: "numeric", month, timeZone: "UTC" });
}
function dateLabel(value: string | null) {
  if (!value) return "Not supplied";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Toronto" });
}
function percent(value: number | null, signed = true) {
  if (value === null) return "Not available";
  const sign = signed && value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

export async function MarketInstrument({ selection }: { selection: MarketSelection }) {
  const [trade, groups] = await Promise.all([getCetaTrade(selection.flow, selection.commodity), getCetaGroups(selection.flow)]);

  if (trade.kind === "error") {
    return (
      <section className="official-explorer" aria-labelledby="official-explorer-title">
        <p className="sr-only" aria-live="polite">Statistics Canada data is unavailable. No figures are shown.</p>
        <div className="official-data-error">
          <h2 id="official-explorer-title">Statistics Canada did not return a valid series.</h2>
          <p>No figures are shown rather than estimates. The Web Data Service may be slow, unavailable or changing its format. Try again shortly, or open the table on the Statistics Canada site.</p>
          <p><a className="text-link" href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1210017401" target="_blank" rel="noreferrer">Open table 12-10-0174-01 <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span></a></p>
          {selection.commodity && <p><Link className="text-link" href={marketHref({ flow: selection.flow, range: selection.range })}>Show all merchandise instead <ArrowIcon /></Link></p>}
        </div>
      </section>
    );
  }

  const data = trade.data;
  const shown = data.points.slice(-selection.range);
  const latest = data.points.at(-1)!;
  const yearAgo = yearAgoChange(data.points);
  const group = groups.kind === "ok" ? groups.data.groups.find((item) => item.id === data.query.commodity.id) ?? null : null;
  const isTotal = data.query.commodity.id === data.options.commodities[0]?.id;
  const stale = isStale(data.source.retrievedAt);
  const flow = data.query.flow;
  const title = `${flow} under CETA: ${data.query.commodity.label}`;
  const firstShown = shown[0].period;
  const flagged = new Map<string, DataFlag & { periods: string[] }>();
  for (const point of shown) for (const flag of point.flags) {
    const entry = flagged.get(flag.code) ?? { ...flag, periods: [] };
    entry.periods.push(monthLabel(point.period));
    flagged.set(flag.code, entry);
  }
  const withheld = data.withheld.filter((item) => item.period >= firstShown);
  const chartPoints = shown.map((point) => ({ year: monthLabel(point.period), value: point.valueCad }));

  return (
    <section className="official-explorer" aria-labelledby="official-explorer-title">
      <p className="sr-only" aria-live="polite">
        Showing {flow.toLowerCase()} under CETA, {data.query.commodity.label}, last {selection.range} months. Latest, {monthLabel(latest.period, "long")}: {money.format(latest.valueCad)}.
      </p>
      <div className="official-explorer-head">
        <div>
          <span className={`data-status ${stale ? "data-status-stale" : "data-status-ready"}`}>{stale ? "Last successful retrieval" : "Statistics Canada · current release"}</span>
          <h2 id="official-explorer-title">{title}</h2>
          <p>Monthly, customs basis, not seasonally adjusted, Canadian dollars. Latest month: {monthLabel(latest.period, "long")}.</p>
        </div>
        <a href={data.source.url} target="_blank" rel="noreferrer">Open source table <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span></a>
      </div>

      <MarketControls flow={selection.flow} commodity={data.query.commodity.id} range={selection.range} commodities={data.options.commodities} />

      {stale && (
        <p className="official-data-stale" role="note">
          <strong>Showing the last successful retrieval.</strong> Statistics Canada could not be reached for a refresh. These figures were retrieved on <span data-volatile>{dateLabel(data.source.retrievedAt)}</span> and may not include the latest release.
        </p>
      )}

      <dl className="official-explorer-kpis">
        <div>
          <dt>{monthLabel(latest.period, "long")}</dt>
          <dd><strong>{money.format(latest.valueCad)}</strong><small>{exact.format(latest.valueCad)}</small></dd>
        </div>
        <div>
          <dt>Same month a year earlier</dt>
          <dd><strong>{percent(yearAgo)}</strong><small>Compared like for like, since the series is not seasonally adjusted</small></dd>
        </div>
        <div>
          <dt>Last 12 months</dt>
          <dd>
            <strong>{group?.last12 != null ? money.format(group.last12) : "Not available"}</strong>
            <small>{group?.changePercent != null ? `${percent(group.changePercent)} on the previous 12 months` : "Twelve published months are needed"}</small>
          </dd>
        </div>
        <div>
          <dt>Share of CETA {flow.toLowerCase()}</dt>
          <dd><strong>{isTotal ? "100%" : percent(group?.sharePercent ?? null, false)}</strong><small>Last 12 months, of all merchandise</small></dd>
        </div>
      </dl>

      <div className="official-chart-panel">
        <div><h3>{flow}, last {selection.range} months</h3><p>{data.seriesTitle.split(";").join(" · ")}</p></div>
        <TrendChart data={chartPoints} title={`${title}, ${monthLabel(firstShown)} to ${monthLabel(latest.period)}`} caption={`${title}, monthly value in Canadian dollars`} valueFormat="currency" />
      </div>

      {groups.kind === "ok" ? (
        <div className="market-groups">
          <div>
            <h3>All commodity groups, last 12 months</h3>
            <p>{flow} under CETA to {monthLabel(groups.data.periodEnd, "long")}, ranked by value. Select a group to chart it.</p>
          </div>
          <div className="table-scroll">
            <table>
              <caption className="sr-only">CETA {flow.toLowerCase()} by commodity group, 12 months to {monthLabel(groups.data.periodEnd, "long")}</caption>
              <thead><tr><th scope="col">Commodity group</th><th scope="col">12 months</th><th scope="col">Change</th><th scope="col">Share</th></tr></thead>
              <tbody>
                {groups.data.groups.slice(1).sort((a, b) => (b.last12 ?? -1) - (a.last12 ?? -1)).map((item) => (
                  <tr key={item.id} aria-current={item.id === data.query.commodity.id ? "true" : undefined}>
                    <th scope="row"><Link href={marketHref({ flow: selection.flow, commodity: item.id, range: selection.range })} scroll={false} replace>{item.label}</Link></th>
                    <td>{item.last12 === null ? "Not published" : money.format(item.last12)}</td>
                    <td>{percent(item.changePercent)}</td>
                    <td>{percent(item.sharePercent, false)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="market-groups-unavailable">The commodity-group comparison could not be loaded from Statistics Canada. The selected series above is unaffected.</p>
      )}

      <div className="market-notes">
        <div>
          <h3>Flags in this period</h3>
          {flagged.size || withheld.length ? (
            <ul>
              {[...flagged.values()].map((flag) => <li key={flag.code}><strong>{flag.code}</strong> {flag.label}: {flag.periods.join(", ")}</li>)}
              {withheld.map((item) => <li key={item.period}><strong>{item.flags.map((flag) => flag.code).join(" ") || "–"}</strong> {monthLabel(item.period)}: not published ({item.flags.map((flag) => flag.label).join("; ") || "no value released"})</li>)}
            </ul>
          ) : (
            <p>Statistics Canada attaches no quality, revision or suppression flags to the months shown.</p>
          )}
        </div>
        <div>
          <h3>Publisher notes</h3>
          {data.notes.length ? (
            <details>
              <summary>{data.notes.length} table notes that affect interpretation</summary>
              <ul>{data.notes.map((note) => <li key={note}>{note}</li>)}</ul>
            </details>
          ) : (
            <p>No table notes were returned.</p>
          )}
        </div>
      </div>

      <div className="official-provenance">
        <div>
          <h3>Source and provenance</h3>
          <dl>
            <div><dt>Publisher</dt><dd>{data.source.publisher}</dd></div>
            <div><dt>Table</dt><dd>{data.source.tableId}</dd></div>
            <div><dt>Series</dt><dd>Vector v{data.vectorId}</dd></div>
            <div><dt>Basis</dt><dd>{data.source.basis}</dd></div>
            <div><dt>Latest source release</dt><dd>{dateLabel(data.source.latestRelease)}</dd></div>
            <div><dt>Retrieved by Tharros</dt><dd data-volatile>{dateLabel(data.source.retrievedAt)}</dd></div>
          </dl>
          <p className="source-acknowledgement">Adapted from Statistics Canada, {data.source.title}, {monthLabel(latest.period)}. This does not constitute an endorsement by Statistics Canada of this product.</p>
          <a href={data.source.licenceUrl} target="_blank" rel="noreferrer">Statistics Canada Open Licence <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
        <div>
          <h3>What this does not establish</h3>
          <ul>{data.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
          <Link className="text-link" href={requestResearchHref({ service: "market-scan", product: isTotal ? "" : data.query.commodity.label, context: `Started from CETA ${flow.toLowerCase()} on the Market Data page.` })}>Research a specific product <ArrowIcon /></Link>
        </div>
      </div>

      <DatasetDiscovery query={`${isTotal ? "merchandise" : data.query.commodity.label} international trade`} />
    </section>
  );
}

export function MarketInstrumentSkeleton() {
  return (
    <section className="official-explorer market-loading" data-loading aria-busy="true" aria-labelledby="market-loading-title">
      <div className="official-explorer-head"><div><span className="data-status">Statistics Canada</span><h2 id="market-loading-title">Loading the current CETA series…</h2><p>Retrieving table metadata and the selected series from the Web Data Service.</p></div></div>
      <div className="official-explorer-controls market-skeleton-controls" aria-hidden="true" />
      <div className="official-explorer-kpis market-skeleton-kpis" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="market-skeleton-chart" aria-hidden="true" />
    </section>
  );
}
