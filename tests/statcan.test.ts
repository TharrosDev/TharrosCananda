import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildCoordinate,
  commodityOptions,
  fetchCetaGroupSummary,
  fetchCetaTradeSeries,
  isStale,
  marketHref,
  parseDatapoint,
  parseMarketSelection,
  parseMetadata,
  parseSeries,
  parseSeriesInfo,
  scalarMultiplier,
  shiftMonth,
} from "../src/lib/statcan";

// Recorded, unmodified responses from the live WDS for table 12-10-0174-01 (scripts/record-statcan-fixtures.mjs).
const load = (name: string) => JSON.parse(readFileSync(new URL(`./fixtures/statcan/${name}.json`, import.meta.url), "utf8"));
const metadata = () => load("getCubeMetadata");
const series = () => load("getDataFromCubePidCoordAndLatestNPeriods");
const seriesInfo = () => load("getSeriesInfoFromCubePidCoord");
const totalImports = "1.1.29.1.0.0.0.0.0.0";
const now = () => new Date("2026-09-21T12:00:00Z");
type Item = { object: { coordinate: string; [key: string]: unknown } };
const byCoordinate = (json: Item[], coordinate: string) => json.find((item) => item.object.coordinate === coordinate)!;

/** Fake WDS answering from (possibly mutated) fixtures, per requested coordinate, like the mock server. */
function fakeWds(overrides: { meta?: unknown; data?: unknown; info?: unknown; status?: number; throws?: Error; body?: string } = {}) {
  return async (url: string, init: RequestInit) => {
    const method = url.split("/").pop()!;
    if (overrides.throws) throw overrides.throws;
    if (overrides.status) return new Response("upstream error", { status: overrides.status });
    if (overrides.body) return new Response(overrides.body, { status: 200 });
    if (method === "getCubeMetadata") return Response.json(overrides.meta ?? metadata());
    const pool = (method === "getSeriesInfoFromCubePidCoord" ? overrides.info ?? seriesInfo() : overrides.data ?? series()) as Item[];
    if (!Array.isArray(pool)) return Response.json(pool);
    const requested = (JSON.parse(String(init.body)) as { coordinate: string }[]).map((item) => item.coordinate);
    return Response.json(requested.map((coordinate) => pool.find((item) => item?.object?.coordinate === coordinate) ?? { status: "FAILED", object: { responseStatusCode: 2, coordinate, vectorId: 0 } }));
  };
}
const run = (input: { flow?: string; commodity?: string | null }, overrides?: Parameters<typeof fakeWds>[0]) =>
  fetchCetaTradeSeries(input, { fetcher: fakeWds(overrides), baseUrl: "https://wds.test", now });
type MetaJson = { object: { dimension: { dimensionNameEn: string; member: { memberNameEn: string; terminated?: number }[] }[] } }[];
const ceta = (json: MetaJson) => json[0].object.dimension.find((item) => /Free Trade/.test(item.dimensionNameEn))!.member.find((item) => /\(CETA\)/.test(item.memberNameEn))!;

describe("helpers", () => {
  const dimensions = [
    { dimensionPositionId: 1, dimensionNameEn: "Trade", member: [{ memberId: 1, memberNameEn: "Imports" }, { memberId: 2, memberNameEn: "Exports" }] },
    { dimensionPositionId: 2, dimensionNameEn: "Free trade agreement", member: [{ memberId: 1, memberNameEn: "Total" }, { memberId: 7, parentMemberId: 1, memberNameEn: "CETA" }] },
    { dimensionPositionId: 3, dimensionNameEn: "Commodity", member: [{ memberId: 1, memberNameEn: "Total commodities" }, { memberId: 10, parentMemberId: 1, memberNameEn: "Food products" }, { memberId: 20, parentMemberId: 1, memberNameEn: "Industrial products" }] },
  ];
  it("applies scalar-factor codes", () => {
    expect(scalarMultiplier(0)).toBe(1);
    expect(scalarMultiplier(3)).toBe(1000);
    expect(scalarMultiplier(6)).toBe(1_000_000);
  });
  it("builds coordinates and fills unselected dimensions only with verified defaults", () => {
    expect(buildCoordinate(dimensions, new Map([[1, dimensions[0].member[1]], [2, dimensions[1].member[1]]]))).toBe("2.7.1.0.0.0.0.0.0.0");
    expect(() => buildCoordinate([{ dimensionPositionId: 1, dimensionNameEn: "Ambiguous", member: [{ memberId: 4, memberNameEn: "A" }, { memberId: 5, memberNameEn: "B" }] }], new Map())).toThrow(/verified default/i);
  });
  it("derives commodity options from publisher metadata", () => {
    expect(commodityOptions(dimensions[2])).toEqual([{ id: "1", label: "Total commodities" }, { id: "10", label: "Food products" }, { id: "20", label: "Industrial products" }]);
  });
});

describe("real response shapes", () => {
  it("parses the recorded cube metadata", () => {
    const meta = parseMetadata(metadata());
    expect(meta.dimensions.map((item) => item.dimensionNameEn)).toEqual(["Geography", "Trade", "Free Trade Agreement", "North American Product Classification System (NAPCS)"]);
    expect(meta.releaseTime).toBe("2026-09-03T08:30");
    expect(meta.footnotes.every((note) => !/<[^>]+>/.test(note.text))).toBe(true);
  });

  it("assembles the CETA series with provenance", async () => {
    const data = await run({ flow: "imports" });
    expect(data.coordinate).toBe(totalImports);
    expect(data.vectorId).toBe(1566933744);
    expect(data.query.agreement).toMatch(/\(CETA\)/);
    expect(data.points).toHaveLength(37);
    expect(data.points[0].scalarFactorCode).toBe(3);
    expect(data.points[0].valueCad).toBe(data.points[0].rawValue * 1000);
    expect(data.source.retrievedAt).toBe("2026-09-21T12:00:00.000Z");
    expect(data.options.commodities[0].label).toBe("Total of all merchandise");
    expect(data.notes.some((note) => /United Kingdom through December 2020/.test(note))).toBe(true);
  });

  it("selects exports and an offered commodity group", async () => {
    const data = await run({ flow: "exports", commodity: "14" });
    expect(data.coordinate).toBe("1.2.29.14.0.0.0.0.0.0");
    expect(data.query.commodity.label).toBe("Energy products");
  });

  it("refuses a commodity id that is not an offered group", async () => {
    await expect(run({ commodity: "4" })).rejects.toThrow(/not an offered group/);
    await expect(run({ commodity: "99999" })).rejects.toThrow(/not an offered group/);
  });
});

describe("schema drift and malformed payloads", () => {
  it("fails when a dimension is missing", async () => {
    const json = metadata();
    json[0].object.dimension = json[0].object.dimension.filter((item: { dimensionNameEn: string }) => !/Free Trade/.test(item.dimensionNameEn));
    await expect(run({}, { meta: json })).rejects.toThrow(/table structure/);
  });

  it("fails when the CETA member is renamed or terminated", async () => {
    const renamed = metadata();
    ceta(renamed).memberNameEn = "Canada-EU agreement";
    await expect(run({}, { meta: renamed })).rejects.toThrow(/no active CETA member/);
    const terminated = metadata();
    ceta(terminated).terminated = 1;
    await expect(run({}, { meta: terminated })).rejects.toThrow(/no active CETA member/);
  });

  it("rejects envelope and identifier drift", () => {
    expect(() => parseMetadata([{ status: "FAILED", object: {} }])).toThrow(/status FAILED/);
    expect(() => parseMetadata({ object: {} })).toThrow(/expected an array/);
    expect(() => parseMetadata([])).toThrow(/exactly one/);
    const wrongProduct = metadata();
    wrongProduct[0].object.productId = "12100011";
    expect(() => parseMetadata(wrongProduct)).toThrow(/productId/);
    const badMember = metadata();
    badMember[0].object.dimension[1].member[0].memberId = "1";
    expect(() => parseMetadata(badMember)).toThrow(/memberId: expected an integer/);
    const badPosition = metadata();
    badPosition[0].object.dimension[0].dimensionPositionId = 11;
    expect(() => parseMetadata(badPosition)).toThrow(/outside the 10-slot/);
  });

  it("fails when WDS answers FAILED for the series", async () => {
    await expect(run({}, { data: [] })).rejects.toThrow(/status FAILED/);
  });

  it("rejects a series for the wrong coordinate or without a vector", () => {
    const json = [byCoordinate(series(), totalImports)];
    expect(() => parseSeries(json, "1.2.29.1.0.0.0.0.0.0")).toThrow(/coordinate does not match/);
    json[0].object.vectorId = 0;
    expect(() => parseSeries(json, totalImports)).toThrow(/vectorId/);
  });

  it("rejects duplicate periods and mixed scales", () => {
    const dup = byCoordinate(series(), totalImports) as unknown as { object: { vectorDataPoint: Record<string, unknown>[] } };
    Object.assign(dup.object.vectorDataPoint[1], { refPer: dup.object.vectorDataPoint[0].refPer, refPerRaw: dup.object.vectorDataPoint[0].refPerRaw });
    expect(() => parseSeries([dup], totalImports)).toThrow(/duplicate/);
    const mixed = byCoordinate(series(), totalImports) as unknown as { object: { vectorDataPoint: Record<string, unknown>[] } };
    mixed.object.vectorDataPoint[0].scalarFactorCode = 6;
    expect(() => parseSeries([mixed], totalImports)).toThrow(/mixed scalar/);
  });

  it("rejects a unit or scale that disagrees with the series information", async () => {
    const info = seriesInfo();
    byCoordinate(info, totalImports).object.memberUomCode = 223;
    await expect(run({}, { info })).rejects.toThrow(/unit of measure/);
    const scale = seriesInfo();
    byCoordinate(scale, totalImports).object.scalarFactorCode = 6;
    await expect(run({}, { info: scale })).rejects.toThrow(/scalar factor disagrees/);
    expect(() => parseSeriesInfo([{ status: "SUCCESS", object: { responseStatusCode: 0, coordinate: totalImports, terminated: 1 } }], totalImports)).toThrow(/terminated/);
  });
});

describe("datapoints and publisher flags", () => {
  const base = { refPer: "2026-07-01", refPerRaw: "2026-07-01", value: 4326.4, decimals: 1, scalarFactorCode: 3, symbolCode: 0, statusCode: 0, securityLevelCode: 0, releaseTime: "2026-09-03T08:30" };
  const point = (patch: object) => parseDatapoint({ ...base, ...patch }, "p");

  it("parses a normal point", () => {
    expect(point({})).toEqual({ point: expect.objectContaining({ period: "2026-07-01", valueCad: 4_326_400, flags: [] }) });
  });

  it("keeps quality and revision flags on published values", () => {
    expect(point({ symbolCode: 3 })).toMatchObject({ point: { flags: [{ code: "r", label: "Revised" }] } });
    expect(point({ statusCode: 7 })).toMatchObject({ point: { flags: [{ code: "E", label: "Use with caution" }] } });
    expect(point({ statusCode: 42 })).toMatchObject({ point: { flags: [{ code: "status 42" }] } });
  });

  it("withholds values the publisher withholds", () => {
    expect(point({ value: null, securityLevelCode: 1 })).toEqual({ withheld: { period: "2026-07-01", flags: [expect.objectContaining({ code: "x" })] } });
    expect(point({ value: 12, statusCode: 8 })).toEqual({ withheld: { period: "2026-07-01", flags: [expect.objectContaining({ code: "F" })] } });
    expect(point({ value: null, statusCode: 1 })).toMatchObject({ withheld: { flags: [{ code: ".." }] } });
  });

  it("rejects invalid datapoints", () => {
    expect(() => point({ value: "abc" })).toThrow(/finite number/);
    expect(() => point({ value: Number.NaN })).toThrow(/finite number/);
    expect(() => point({ value: {} })).toThrow(/finite number/);
    expect(() => point({ refPer: "2026-07-15", refPerRaw: "" })).toThrow(/monthly reference period/);
    expect(() => point({ refPer: "July 2026", refPerRaw: "" })).toThrow(/monthly reference period/);
    expect(() => point({ scalarFactorCode: 12 })).toThrow(/out of range/);
    expect(() => point({ statusCode: "E" })).toThrow(/integer/);
  });

  it("carries withheld months separately so they are never charted as values", async () => {
    const data = series();
    const target = byCoordinate(data, totalImports) as unknown as { object: { vectorDataPoint: Record<string, unknown>[] } };
    Object.assign(target.object.vectorDataPoint[5], { value: null, securityLevelCode: 1 });
    const result = await run({}, { data });
    expect(result.points).toHaveLength(36);
    expect(result.withheld).toEqual([{ period: target.object.vectorDataPoint[5].refPerRaw, flags: [expect.objectContaining({ code: "x" })] }]);
  });
});

describe("source errors", () => {
  it.each([
    ["an HTTP error", { status: 503 }, /HTTP 503/],
    ["a timeout", { throws: Object.assign(new Error("timed out"), { name: "TimeoutError" }) }, /no response within/],
    ["a network error", { throws: new TypeError("fetch failed") }, /network error/],
    ["a non-JSON body", { body: "<html>maintenance</html>" }, /not JSON/],
  ])("throws, never returns numbers, on %s", async (_label, overrides, reason) => {
    await expect(run({}, overrides)).rejects.toThrow(reason);
  });
});

describe("caching and URL state", () => {
  it("labels a cached copy stale after 24 hours", () => {
    expect(isStale("2026-09-21T00:00:00Z", new Date("2026-09-21T12:00:00Z"))).toBe(false);
    expect(isStale("2026-09-19T00:00:00Z", new Date("2026-09-21T12:00:00Z"))).toBe(true);
  });

  it("validates URL selections", () => {
    expect(parseMarketSelection({ flow: "exports", commodity: "14", range: "12" })).toEqual({ flow: "exports", commodity: "14", range: 12 });
    expect(parseMarketSelection({ flow: "sideways", commodity: "1;drop", range: "999" })).toEqual({ flow: "imports", commodity: null, range: 24 });
    expect(marketHref({ flow: "exports", commodity: "14", range: 36 })).toBe("/market-explorer?flow=exports&commodity=14&range=36");
  });
});

describe("commodity-group summary", () => {
  const summary = (overrides?: Parameters<typeof fakeWds>[0]) => fetchCetaGroupSummary("imports", { fetcher: fakeWds(overrides), baseUrl: "https://wds.test", now });

  it("totals the latest 12 months per group from one request", async () => {
    const result = await summary();
    expect(result.periodEnd).toBe("2026-07-01");
    expect(result.groups).toHaveLength(13);
    const total = result.groups[0];
    expect(total.sharePercent).toBeCloseTo(100);
    const shares = result.groups.slice(1).reduce((sum, group) => sum + (group.sharePercent ?? 0), 0);
    expect(shares).toBeGreaterThan(95);
    expect(shares).toBeLessThan(105);
    expect(result.groups.every((group) => group.changePercent !== null)).toBe(true);
  });

  it("drops figures for a group with a withheld month instead of summing around it", async () => {
    const data = series();
    const energy = byCoordinate(data, "1.1.29.14.0.0.0.0.0.0") as unknown as { object: { vectorDataPoint: Record<string, unknown>[] } };
    Object.assign(energy.object.vectorDataPoint.at(-1)!, { value: null, statusCode: 8 });
    const result = await summary({ data });
    expect(result.groups.find((group) => group.id === "14")).toMatchObject({ last12: null, changePercent: null, sharePercent: null });
  });

  it("fails when any group is missing from the response", async () => {
    const data = series().filter((item: Item) => item.object.coordinate !== "1.1.29.14.0.0.0.0.0.0");
    await expect(summary({ data })).rejects.toThrow(/status FAILED/);
  });

  it("shifts months across year boundaries", () => {
    expect(shiftMonth("2026-01-01", -1)).toBe("2025-12-01");
    expect(shiftMonth("2025-12-01", 13)).toBe("2027-01-01");
  });
});
