/**
 * Statistics Canada Web Data Service adapter for table 12-10-0174-01 (customs-basis merchandise trade by
 * free trade agreement and NAPCS commodity), limited to the Canada–EU CETA country group.
 *
 * Every response is validated at runtime rather than cast. Missing dimensions, unidentifiable members,
 * a changed envelope, invalid datapoints or an unexpected scale throw `StatcanDriftError`: callers show no
 * figures rather than wrong ones. There is no synthetic or fallback data.
 */
import type { DataFlag, TradeExplorerResponse, TradeFlow, TradeOption, TradePoint } from "@/types/official-data";

const PRODUCT_ID = 12100174 as const;
const CATALOGUE_ID = 1210017401 as const;
const TABLE_ID = "12-10-0174-01" as const;
const TABLE_URL = "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1210017401";
const LICENCE_URL = "https://www.statcan.gc.ca/en/terms-conditions/open-licence";
export const officialWdsBaseUrl = "https://www150.statcan.gc.ca/t1/wds/rest";
/** Three years plus one month, so the oldest month shown on the longest range still has a year-earlier value. */
export const periodsRequested = 37;
const timeoutMs = 8000;

export class StatcanDriftError extends Error {
  name = "StatcanDriftError";
}

function fail(reason: string): never {
  throw new StatcanDriftError(reason);
}

// ---------------------------------------------------------------------------
// Runtime guards
// ---------------------------------------------------------------------------

function record(value: unknown, where: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(`${where}: expected an object`);
  return value as Record<string, unknown>;
}
function list(value: unknown, where: string): unknown[] {
  if (!Array.isArray(value)) fail(`${where}: expected an array`);
  return value;
}
function int(value: unknown, where: string): number {
  if (typeof value !== "number" || !Number.isInteger(value)) fail(`${where}: expected an integer`);
  return value;
}
function text(value: unknown, where: string): string {
  if (typeof value !== "string" || !value.trim()) fail(`${where}: expected a non-empty string`);
  return value;
}
/** WDS wraps every item as { status: "SUCCESS", object }. Anything else is a failure. */
function envelope(value: unknown, where: string): Record<string, unknown> {
  const item = record(value, where);
  if (item.status !== "SUCCESS") fail(`${where}: status ${String(item.status)}`);
  return record(item.object, `${where}.object`);
}
function single(json: unknown, where: string) {
  const items = list(json, where);
  if (items.length !== 1) fail(`${where}: expected exactly one item, got ${items.length}`);
  return envelope(items[0], `${where}[0]`);
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export type WdsMember = { memberId: number; parentMemberId?: number | null; memberNameEn: string; terminated?: number };
export type WdsDimension = { dimensionPositionId: number; dimensionNameEn: string; member: WdsMember[] };
export type CubeMetadata = {
  title: string;
  releaseTime: string | null;
  dimensions: WdsDimension[];
  footnotes: { text: string; dimension: number; member: number }[];
};

export function parseMetadata(json: unknown): CubeMetadata {
  const cube = single(json, "metadata");
  if (Number(cube.productId) !== PRODUCT_ID) fail(`metadata: unexpected productId ${String(cube.productId)}`);
  const releaseTime = typeof cube.releaseTime === "string" && !Number.isNaN(Date.parse(cube.releaseTime)) ? cube.releaseTime : null;
  const dimensions = list(cube.dimension ?? cube.dimensions, "metadata.dimension").map((raw, index) => {
    const where = `dimension[${index}]`;
    const dimension = record(raw, where);
    const position = int(dimension.dimensionPositionId, `${where}.dimensionPositionId`);
    if (position < 1 || position > 10) fail(`${where}: position ${position} is outside the 10-slot coordinate`);
    const members = list(dimension.member, `${where}.member`).map((rawMember, memberIndex) => {
      const member = record(rawMember, `${where}.member[${memberIndex}]`);
      const parent = member.parentMemberId;
      if (parent != null && typeof parent !== "number") fail(`${where}.member[${memberIndex}].parentMemberId: expected a number or null`);
      return {
        memberId: int(member.memberId, `${where}.member[${memberIndex}].memberId`),
        parentMemberId: (parent as number | null | undefined) ?? null,
        memberNameEn: text(member.memberNameEn, `${where}.member[${memberIndex}].memberNameEn`),
        terminated: member.terminated === 1 ? 1 : 0,
      };
    });
    if (!members.length) fail(`${where}: no members`);
    return { dimensionPositionId: position, dimensionNameEn: text(dimension.dimensionNameEn, `${where}.dimensionNameEn`), member: members };
  });
  if (!dimensions.length) fail("metadata: no dimensions");
  if (new Set(dimensions.map((item) => item.dimensionPositionId)).size !== dimensions.length) fail("metadata: duplicate dimension positions");

  // Footnotes are optional context; a malformed note is dropped rather than failing the table.
  const footnotes = (Array.isArray(cube.footnote) ? cube.footnote : []).flatMap((raw) => {
    if (typeof raw !== "object" || raw === null) return [];
    const note = raw as Record<string, unknown>;
    const link = (typeof note.link === "object" && note.link !== null ? note.link : {}) as Record<string, unknown>;
    if (typeof note.footnotesEn !== "string" || !note.footnotesEn.trim()) return [];
    return [{ text: stripTags(note.footnotesEn), dimension: Number(link.dimensionPositionId ?? 0), member: Number(link.memberId ?? 0) }];
  });

  const title = typeof cube.cubeTitleEn === "string" && cube.cubeTitleEn.trim() ? cube.cubeTitleEn : "Merchandise imports and exports, customs-based, by free trade agreement and by commodity";
  return { title, releaseTime, dimensions, footnotes };
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/\s*\(opens new window\)/gi, "").replace(/\s+/g, " ").trim();
}

const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function scalarMultiplier(code: number) {
  return 10 ** Math.max(0, Math.min(9, code));
}
export function findDimension(dimensions: WdsDimension[], terms: string[]) {
  const normalized = terms.map(clean);
  return dimensions.find((dimension) => {
    const name = clean(dimension.dimensionNameEn);
    return normalized.some((term) => name.includes(term));
  });
}
function activeMembers(dimension: WdsDimension) {
  return (dimension.member ?? []).filter((member) => member.terminated !== 1);
}
function findMember(dimension: WdsDimension, tests: RegExp[]) {
  // Tests are tried in priority order, so a precise pattern wins over a looser fallback.
  for (const test of tests) {
    const found = activeMembers(dimension).find((member) => test.test(member.memberNameEn));
    if (found) return found;
  }
  return null;
}
export function totalMember(dimension: WdsDimension) {
  return findMember(dimension, [/^total\b/i, /\ball countries\b/i, /\ball commodities\b/i, /\ball products\b/i]);
}
function verifiedDefaultMember(dimension: WdsDimension) {
  const total = totalMember(dimension);
  if (total) return total;
  const active = activeMembers(dimension);
  return active.length === 1 ? active[0] : null;
}
export function buildCoordinate(dimensions: WdsDimension[], selected: Map<number, WdsMember>) {
  const slots = Array.from({ length: 10 }, () => "0");
  for (const dimension of dimensions) {
    const member = selected.get(dimension.dimensionPositionId) ?? verifiedDefaultMember(dimension);
    if (!member) fail(`No verified default member for ${dimension.dimensionNameEn}`);
    slots[dimension.dimensionPositionId - 1] = String(member.memberId);
  }
  return slots.join(".");
}
export function commodityOptions(dimension: WdsDimension): TradeOption[] {
  const members = activeMembers(dimension);
  const total = totalMember(dimension);
  if (!total) return [];
  let candidates = members.filter((member) => member.memberId !== total.memberId && member.parentMemberId === total.memberId);
  if (candidates.length < 4) {
    const rootParents = new Set(members.filter((member) => member.parentMemberId == null || member.parentMemberId === 0).map((member) => member.memberId));
    candidates = members.filter((member) => member.memberId !== total.memberId && (member.parentMemberId === total.memberId || member.parentMemberId == null || member.parentMemberId === 0 || (member.parentMemberId != null && rootParents.has(member.parentMemberId))));
  }
  const deduped = new Map<number, WdsMember>();
  for (const member of candidates) deduped.set(member.memberId, member);
  return [
    { id: String(total.memberId), label: total.memberNameEn },
    ...[...deduped.values()].sort((a, b) => a.memberNameEn.localeCompare(b.memberNameEn)).map((member) => ({ id: String(member.memberId), label: member.memberNameEn })),
  ];
}

/** Table-wide notes plus notes linked to the members this series uses. */
export function relevantNotes(meta: CubeMetadata, used: Map<number, WdsMember>) {
  const keys = new Set([...used].map(([position, member]) => `${position}:${member.memberId}`));
  return [...new Set(meta.footnotes.filter((note) => note.member === 0 || keys.has(`${note.dimension}:${note.member}`)).map((note) => note.text))];
}

// ---------------------------------------------------------------------------
// Datapoints and series
// ---------------------------------------------------------------------------

// WDS getCodeSets. Unknown non-zero codes are surfaced rather than silently ignored.
const symbolFlags: Record<number, DataFlag> = { 1: { code: "p", label: "Preliminary" }, 3: { code: "r", label: "Revised" } };
const statusFlags: Record<number, DataFlag> = {
  1: { code: "..", label: "Not available for this reference period" },
  2: { code: "0s", label: "Value rounded to zero" },
  3: { code: "A", label: "Data quality: excellent" },
  4: { code: "B", label: "Data quality: very good" },
  5: { code: "C", label: "Data quality: good" },
  6: { code: "D", label: "Data quality: acceptable" },
  7: { code: "E", label: "Use with caution" },
  8: { code: "F", label: "Too unreliable to be published" },
  9: { code: "...", label: "Not applicable" },
  10: { code: "<LOD", label: "Less than the limit of detection" },
};
const suppressedFlag: DataFlag = { code: "x", label: "Suppressed to meet the confidentiality requirements of the Statistics Act" };
/** Status codes where the publisher shows no usable number. */
const withheldStatus = new Set([1, 8, 9, 10]);

export type ParsedPoint = { point: TradePoint } | { withheld: { period: string; flags: DataFlag[] } };

export function parseDatapoint(value: unknown, where: string): ParsedPoint {
  const raw = record(value, where);
  const refPer = text(raw.refPerRaw || raw.refPer, `${where}.refPer`);
  if (!/^\d{4}-\d{2}-01$/.test(refPer) || Number.isNaN(Date.parse(refPer))) fail(`${where}.refPer: not a monthly reference period (${refPer})`);
  const scalarFactorCode = int(raw.scalarFactorCode, `${where}.scalarFactorCode`);
  if (scalarFactorCode < 0 || scalarFactorCode > 9) fail(`${where}.scalarFactorCode: out of range (${scalarFactorCode})`);
  const statusCode = int(raw.statusCode ?? 0, `${where}.statusCode`);
  const symbolCode = int(raw.symbolCode ?? 0, `${where}.symbolCode`);
  const securityLevelCode = int(raw.securityLevelCode ?? 0, `${where}.securityLevelCode`);

  const flags: DataFlag[] = [];
  if (symbolCode) flags.push(symbolFlags[symbolCode] ?? { code: `symbol ${symbolCode}`, label: "Publisher symbol; see the Statistics Canada legend" });
  if (statusCode) flags.push(statusFlags[statusCode] ?? { code: `status ${statusCode}`, label: "Publisher status; see the Statistics Canada legend" });
  if (securityLevelCode) flags.push(suppressedFlag);

  if (securityLevelCode !== 0 || withheldStatus.has(statusCode) || raw.value === null) return { withheld: { period: refPer, flags } };
  // WDS sends numbers; a numeric string is tolerated, anything else is drift.
  const rawValue = typeof raw.value === "number" ? raw.value : typeof raw.value === "string" && raw.value.trim() !== "" ? Number(raw.value) : Number.NaN;
  if (!Number.isFinite(rawValue)) fail(`${where}.value: expected a finite number`);
  const releaseTime = typeof raw.releaseTime === "string" ? raw.releaseTime : "";
  return { point: { period: refPer, rawValue, scalarFactorCode, valueCad: rawValue * scalarMultiplier(scalarFactorCode), releaseTime, statusCode, flags } };
}

function parseSeriesObject(series: Record<string, unknown>, coordinate: string, where: string) {
  if (Number(series.productId) !== PRODUCT_ID) fail(`${where}: unexpected productId`);
  if (series.responseStatusCode !== 0) fail(`${where}: responseStatusCode ${String(series.responseStatusCode)}`);
  if (text(series.coordinate, `${where}.coordinate`) !== coordinate) fail(`${where}: coordinate does not match the request`);
  const vectorId = int(series.vectorId, `${where}.vectorId`);
  if (vectorId <= 0) fail(`${where}: missing vectorId`);
  const points: TradePoint[] = [];
  const withheld: { period: string; flags: DataFlag[] }[] = [];
  list(series.vectorDataPoint, `${where}.vectorDataPoint`).forEach((raw, index) => {
    const parsed = parseDatapoint(raw, `${where}.vectorDataPoint[${index}]`);
    if ("point" in parsed) points.push(parsed.point);
    else withheld.push(parsed.withheld);
  });
  points.sort((a, b) => a.period.localeCompare(b.period));
  if (new Set([...points, ...withheld].map((item) => item.period)).size !== points.length + withheld.length) fail(`${where}: duplicate reference periods`);
  if (new Set(points.map((point) => point.scalarFactorCode)).size > 1) fail(`${where}: mixed scalar factors`);
  if (!points.length) fail(`${where}: no public data points`);
  return { vectorId, points, withheld };
}

export function parseSeries(json: unknown, coordinate: string) {
  return parseSeriesObject(single(json, "series"), coordinate, "series");
}

/** Several series from one request; every requested coordinate must come back valid. */
export function parseSeriesList(json: unknown, coordinates: string[]) {
  const items = list(json, "series");
  const byCoordinate = new Map(items.map((raw, index) => {
    const series = envelope(raw, `series[${index}]`);
    return [String(series.coordinate), { series, index }] as const;
  }));
  return new Map(coordinates.map((coordinate) => {
    const found = byCoordinate.get(coordinate) ?? fail(`series: no data for coordinate ${coordinate}`);
    return [coordinate, parseSeriesObject(found.series, coordinate, `series[${found.index}]`)] as const;
  }));
}

export function parseSeriesInfo(json: unknown, coordinate: string) {
  const info = single(json, "seriesInfo");
  if (info.responseStatusCode !== 0) fail(`seriesInfo: responseStatusCode ${String(info.responseStatusCode)}`);
  if (text(info.coordinate, "seriesInfo.coordinate") !== coordinate) fail("seriesInfo: coordinate does not match the request");
  if (info.terminated === 1) fail("seriesInfo: series is terminated");
  // 81 = Dollars in the WDS unit-of-measure code set; the page presents Canadian dollars.
  if (info.memberUomCode !== undefined && info.memberUomCode !== 81) fail(`seriesInfo: unexpected unit of measure ${String(info.memberUomCode)}`);
  return {
    title: typeof info.SeriesTitleEn === "string" && info.SeriesTitleEn.trim() ? info.SeriesTitleEn : null,
    scalarFactorCode: typeof info.scalarFactorCode === "number" ? info.scalarFactorCode : null,
  };
}

// ---------------------------------------------------------------------------
// Retrieval
// ---------------------------------------------------------------------------

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;
type Options = { fetcher?: FetchLike; baseUrl?: string; now?: () => Date };

export function wdsBaseUrl() {
  // ponytail: the override exists for the Playwright mock server; deployments use the official host.
  return process.env.STATCAN_WDS_BASE_URL?.replace(/\/$/, "") || officialWdsBaseUrl;
}

async function postWds(fetcher: FetchLike, baseUrl: string, method: string, body: unknown): Promise<unknown> {
  let response: Response;
  try {
    response = await fetcher(`${baseUrl}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    fail(name === "TimeoutError" || name === "AbortError" ? `${method}: no response within ${timeoutMs}ms` : `${method}: network error`);
  }
  if (!response.ok) fail(`${method}: HTTP ${response.status}`);
  try {
    return await response.json();
  } catch {
    fail(`${method}: response was not JSON`);
  }
}

/** Identifies the trade, CETA and commodity dimensions and members by name; throws if any is missing. */
function resolveCeta(meta: CubeMetadata, flow: string | null | undefined) {
  const dimensions = meta.dimensions;
  const tradeDimension = dimensions.find((dimension) => {
    const name = clean(dimension.dimensionNameEn);
    return (name === "trade" || name.includes("imports") || name.includes("exports")) && !name.includes("agreement");
  });
  const agreementDimension = findDimension(dimensions, ["free trade agreement", "trade agreement"]);
  const commodityDimension = findDimension(dimensions, ["north american product classification", "napcs", "commodity", "product"]);
  if (!tradeDimension || !agreementDimension || !commodityDimension) fail("metadata: table structure no longer matches the expected trade dimensions");
  const requestedFlow: TradeFlow = flow?.toLowerCase() === "exports" ? "Exports" : "Imports";
  const flowMember = findMember(tradeDimension, requestedFlow === "Imports" ? [/^imports?$/i, /\bimports?\b/i] : [/^exports?$/i, /\bexports?\b/i]);
  const agreementMember = findMember(agreementDimension, [/\(CETA\)/, /Comprehensive Economic and Trade Agreement/i]);
  if (!flowMember) fail(`metadata: no active ${requestedFlow} member`);
  if (!agreementMember) fail("metadata: no active CETA member");
  const options = commodityOptions(commodityDimension);
  if (options.length < 2) fail("metadata: no commodity groups");
  return { requestedFlow, tradeDimension, agreementDimension, commodityDimension, flowMember, agreementMember, options };
}

export async function fetchCetaTradeSeries(
  input: { flow?: string | null; commodity?: string | null },
  { fetcher = fetch, baseUrl = wdsBaseUrl(), now = () => new Date() }: Options = {},
): Promise<TradeExplorerResponse> {
  const meta = parseMetadata(await postWds(fetcher, baseUrl, "getCubeMetadata", [{ productId: PRODUCT_ID }]));
  const { requestedFlow, tradeDimension, agreementDimension, commodityDimension, flowMember, agreementMember, options } = resolveCeta(meta, input.flow);
  // Only publisher-listed groups can be selected, so an arbitrary member id from a URL never reaches WDS.
  const offered = !input.commodity || options.some((option) => option.id === input.commodity);
  const commodityMember = !offered
    ? null
    : input.commodity
      ? activeMembers(commodityDimension).find((member) => String(member.memberId) === input.commodity) ?? null
      : totalMember(commodityDimension);
  if (!commodityMember) fail(input.commodity ? `metadata: commodity ${input.commodity} is not an offered group` : "metadata: no commodity total");
  const dimensions = meta.dimensions;

  const selected = new Map<number, WdsMember>([
    [tradeDimension.dimensionPositionId, flowMember],
    [agreementDimension.dimensionPositionId, agreementMember],
    [commodityDimension.dimensionPositionId, commodityMember],
  ]);
  const coordinate = buildCoordinate(dimensions, selected);
  const [data, infoJson] = await Promise.all([
    postWds(fetcher, baseUrl, "getDataFromCubePidCoordAndLatestNPeriods", [{ productId: PRODUCT_ID, coordinate, latestN: periodsRequested }]),
    postWds(fetcher, baseUrl, "getSeriesInfoFromCubePidCoord", [{ productId: PRODUCT_ID, coordinate }]),
  ]);
  const series = parseSeries(data, coordinate);
  const info = parseSeriesInfo(infoJson, coordinate);
  if (info.scalarFactorCode !== null && info.scalarFactorCode !== series.points[0].scalarFactorCode) fail("series: scalar factor disagrees with series information");

  const latestRelease = series.points.map((point) => point.releaseTime).filter(Boolean).sort().at(-1) ?? meta.releaseTime ?? null;
  return {
    status: "live",
    source: {
      publisher: "Statistics Canada",
      tableId: TABLE_ID,
      productId: PRODUCT_ID,
      catalogueId: CATALOGUE_ID,
      title: meta.title,
      url: TABLE_URL,
      licenceUrl: LICENCE_URL,
      retrievedAt: now().toISOString(),
      latestRelease,
      frequency: "Monthly",
      basis: "Customs basis, not seasonally adjusted",
    },
    query: { flow: requestedFlow, agreement: agreementMember.memberNameEn, commodity: { id: String(commodityMember.memberId), label: commodityMember.memberNameEn } },
    coordinate,
    vectorId: series.vectorId,
    seriesTitle: info.title ?? [flowMember.memberNameEn, agreementMember.memberNameEn, commodityMember.memberNameEn].join("; "),
    points: series.points,
    withheld: series.withheld,
    notes: relevantNotes(meta, selected),
    options: { flows: ["Imports", "Exports"], commodities: options },
    limitations: [
      "This series measures customs-basis merchandise trade, not addressable market demand, sales, profitability or regulatory eligibility.",
      "Commodity groups follow Statistics Canada's NAPCS classification and may be broader than a specific product.",
      "The CETA country group and its composition are defined by Statistics Canada for this table.",
      "Values are not seasonally adjusted: compare a month with the same month a year earlier, not with the previous month.",
      "Statistics Canada may revise previously released observations.",
    ],
  };
}

export type GroupSummary = {
  id: string;
  label: string;
  /** Sum of the latest 12 published months, in dollars; null when any of them is withheld. */
  last12: number | null;
  prior12: number | null;
  changePercent: number | null;
  sharePercent: number | null;
};

/**
 * Every offered commodity group for one flow, from a single WDS request: latest 12-month totals, change on
 * the prior 12 months and share of the CETA total. Groups with withheld months are shown without figures.
 */
export async function fetchCetaGroupSummary(
  flow: string | null,
  { fetcher = fetch, baseUrl = wdsBaseUrl(), now = () => new Date() }: Options = {},
): Promise<{ flow: TradeFlow; periodEnd: string; groups: GroupSummary[]; retrievedAt: string }> {
  const meta = parseMetadata(await postWds(fetcher, baseUrl, "getCubeMetadata", [{ productId: PRODUCT_ID }]));
  const { requestedFlow, tradeDimension, agreementDimension, commodityDimension, flowMember, agreementMember, options } = resolveCeta(meta, flow);
  const coordinateFor = (id: string) =>
    buildCoordinate(meta.dimensions, new Map<number, WdsMember>([
      [tradeDimension.dimensionPositionId, flowMember],
      [agreementDimension.dimensionPositionId, agreementMember],
      [commodityDimension.dimensionPositionId, activeMembers(commodityDimension).find((member) => String(member.memberId) === id)!],
    ]));
  const coordinates = options.map((option) => coordinateFor(option.id));
  const all = parseSeriesList(
    await postWds(fetcher, baseUrl, "getDataFromCubePidCoordAndLatestNPeriods", coordinates.map((coordinate) => ({ productId: PRODUCT_ID, coordinate, latestN: 24 }))),
    coordinates,
  );
  const series = options.map((option, index) => ({ option, data: all.get(coordinates[index])! }));
  const periodEnd = series[0].data.points.at(-1)!.period;
  const windowSum = (data: (typeof series)[number]["data"], offset: number) => {
    const periods = Array.from({ length: 12 }, (_, index) => shiftMonth(periodEnd, -(offset + index)));
    const values = periods.map((period) => data.points.find((point) => point.period === period)?.valueCad);
    return values.every((value) => value !== undefined) ? values.reduce((sum: number, value) => sum + value!, 0) : null;
  };
  const totalLast12 = windowSum(series[0].data, 0);
  return {
    flow: requestedFlow,
    periodEnd,
    retrievedAt: now().toISOString(),
    groups: series.map(({ option, data }) => {
      const last12 = windowSum(data, 0);
      const prior12 = windowSum(data, 12);
      return {
        id: option.id,
        label: option.label,
        last12,
        prior12,
        changePercent: last12 !== null && prior12 ? ((last12 - prior12) / prior12) * 100 : null,
        sharePercent: last12 !== null && totalLast12 ? (last12 / totalLast12) * 100 : null,
      };
    }),
  };
}

/** "2026-07-01" shifted by n months, keeping the first-of-month form WDS uses. */
export function shiftMonth(period: string, months: number) {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

// ---------------------------------------------------------------------------
// Presentation helpers (pure)
// ---------------------------------------------------------------------------

export const ranges = [12, 24, 36] as const;
/** Cached data older than this is labelled stale: a refresh has been failing. */
export const staleAfterMs = 24 * 60 * 60 * 1000;

export function isStale(retrievedAt: string, now = new Date()) {
  return now.getTime() - Date.parse(retrievedAt) > staleAfterMs;
}

export type MarketSelection = { flow: "imports" | "exports"; commodity: string | null; range: (typeof ranges)[number] };

/** URL state for the Market Data page, validated against allow-lists; the commodity is checked against metadata later. */
export function parseMarketSelection(params: Record<string, string | string[] | undefined>): MarketSelection {
  const pick = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : undefined);
  const flow = pick("flow") === "exports" ? "exports" : "imports";
  const commodity = pick("commodity");
  const range = ranges.find((item) => String(item) === pick("range")) ?? 24;
  return { flow, commodity: commodity && /^\d{1,6}$/.test(commodity) ? commodity : null, range };
}

export function marketHref({ flow, commodity, range }: { flow: string; commodity?: string | null; range: number }) {
  const params = new URLSearchParams({ flow });
  if (commodity) params.set("commodity", commodity);
  params.set("range", String(range));
  return `/market-explorer?${params}`;
}
