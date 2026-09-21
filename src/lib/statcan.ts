import type { TradeExplorerResponse, TradeFlow, TradeOption } from "@/types/official-data";

const PRODUCT_ID = 1210017401 as const;
const TABLE_ID = "12-10-0174-01" as const;
const TABLE_URL = "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1210017401";
const LICENCE_URL = "https://www.statcan.gc.ca/en/terms-conditions/open-licence";
const WDS = "https://www150.statcan.gc.ca/t1/wds/rest";

type WdsMember = {
  memberId: number;
  parentMemberId?: number | null;
  memberNameEn: string;
  terminated?: number;
};

type WdsDimension = {
  dimensionPositionId: number;
  dimensionNameEn: string;
  member: WdsMember[];
};

type CubeMetadata = {
  productId: string | number;
  cubeTitleEn: string;
  releaseTime?: string;
  dimension?: WdsDimension[];
  dimensions?: WdsDimension[];
};

type VectorPoint = {
  refPer: string;
  refPerRaw?: string;
  value: number | string | null;
  scalarFactorCode: number;
  statusCode: number;
  releaseTime: string;
};

type SeriesObject = {
  responseStatusCode: number;
  coordinate: string;
  SeriesTitleEn?: string;
  vectorDataPoint?: VectorPoint[];
};

type WdsEnvelope<T> = { status: string; object: T };

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
  const members = activeMembers(dimension);
  return members.find((member) => tests.some((test) => test.test(member.memberNameEn))) ?? null;
}

function fallbackTotalMember(dimension: WdsDimension) {
  return (
    findMember(dimension, [/^total\b/i, /\ball countries\b/i, /\ball commodities\b/i, /\ball products\b/i]) ??
    activeMembers(dimension)[0] ??
    null
  );
}

export function buildCoordinate(
  dimensions: WdsDimension[],
  selected: Map<number, WdsMember>,
) {
  const slots = Array.from({ length: 10 }, () => "0");
  for (const dimension of dimensions) {
    const member = selected.get(dimension.dimensionPositionId) ?? fallbackTotalMember(dimension);
    if (!member) throw new Error(`No selectable member for ${dimension.dimensionNameEn}`);
    slots[dimension.dimensionPositionId - 1] = String(member.memberId);
  }
  return slots.join(".");
}

export function commodityOptions(dimension: WdsDimension): TradeOption[] {
  const members = activeMembers(dimension);
  const total = fallbackTotalMember(dimension);
  if (!total) return [];

  let candidates = members.filter(
    (member) => member.memberId !== total.memberId && member.parentMemberId === total.memberId,
  );

  if (candidates.length < 4) {
    const rootParents = new Set(
      members
        .filter((member) => member.parentMemberId == null || member.parentMemberId === 0)
        .map((member) => member.memberId),
    );
    candidates = members.filter(
      (member) =>
        member.memberId !== total.memberId &&
        (member.parentMemberId === total.memberId ||
          member.parentMemberId == null ||
          member.parentMemberId === 0 ||
          (member.parentMemberId != null && rootParents.has(member.parentMemberId))),
    );
  }

  const deduped = new Map<number, WdsMember>();
  for (const member of candidates) deduped.set(member.memberId, member);

  return [
    { id: String(total.memberId), label: total.memberNameEn },
    ...[...deduped.values()]
      .sort((a, b) => a.memberNameEn.localeCompare(b.memberNameEn))
      .slice(0, 24)
      .map((member) => ({ id: String(member.memberId), label: member.memberNameEn })),
  ];
}

async function postWds<T>(method: string, body: unknown): Promise<T> {
  const response = await fetch(`${WDS}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(9000),
    next: { revalidate: 21600 },
  });
  if (!response.ok) throw new Error(`Statistics Canada returned HTTP ${response.status}`);
  return (await response.json()) as T;
}

function requireSuccess<T>(envelope: WdsEnvelope<T> | undefined, label: string): T {
  if (!envelope || envelope.status !== "SUCCESS" || envelope.object == null) {
    throw new Error(`Statistics Canada ${label} response was unavailable`);
  }
  return envelope.object;
}

export async function getCetaTradeSeries(input: {
  flow?: string | null;
  commodity?: string | null;
}): Promise<TradeExplorerResponse> {
  const metadataResponse = await postWds<Array<WdsEnvelope<CubeMetadata>>>("getCubeMetadata", [
    { productId: PRODUCT_ID },
  ]);
  const metadata = requireSuccess(metadataResponse[0], "metadata");
  const dimensions = metadata.dimension ?? metadata.dimensions ?? [];

  const tradeDimension = findDimension(dimensions, ["trade", "imports exports"]);
  const agreementDimension = findDimension(dimensions, ["free trade agreement", "trade agreement"]);
  const commodityDimension = findDimension(dimensions, [
    "north american product classification",
    "napcs",
    "commodity",
    "product",
  ]);

  if (!tradeDimension || !agreementDimension || !commodityDimension) {
    throw new Error("Statistics Canada table structure no longer matches the expected trade dimensions");
  }

  const requestedFlow: TradeFlow = input.flow?.toLowerCase() === "exports" ? "Exports" : "Imports";
  const flowMember =
    findMember(
      tradeDimension,
      requestedFlow === "Imports" ? [/^imports?\b/i, /\bimports?\b/i] : [/^exports?\b/i, /\bexports?\b/i],
    ) ?? fallbackTotalMember(tradeDimension);

  const agreementMember =
    findMember(agreementDimension, [/\bCETA\b/i, /European Union/i, /Canada.?European Union/i]) ??
    null;

  const options = commodityOptions(commodityDimension);
  const requestedCommodity = input.commodity
    ? activeMembers(commodityDimension).find((member) => String(member.memberId) === input.commodity)
    : null;
  const commodityMember = requestedCommodity ?? fallbackTotalMember(commodityDimension);

  if (!flowMember || !agreementMember || !commodityMember) {
    throw new Error("The requested Statistics Canada series could not be identified");
  }

  const selected = new Map<number, WdsMember>([
    [tradeDimension.dimensionPositionId, flowMember],
    [agreementDimension.dimensionPositionId, agreementMember],
    [commodityDimension.dimensionPositionId, commodityMember],
  ]);
  const coordinate = buildCoordinate(dimensions, selected);

  const [dataResponse, infoResponse] = await Promise.all([
    postWds<Array<WdsEnvelope<SeriesObject>>>("getDataFromCubePidCoordAndLatestNPeriods", [
      { productId: PRODUCT_ID, coordinate, latestN: 24 },
    ]),
    postWds<Array<WdsEnvelope<SeriesObject>>>("getSeriesInfoFromCubePidCoord", [
      { productId: PRODUCT_ID, coordinate },
    ]),
  ]);

  const series = requireSuccess(dataResponse[0], "series data");
  const info = requireSuccess(infoResponse[0], "series information");
  if (series.responseStatusCode !== 0 || info.responseStatusCode !== 0) {
    throw new Error("Statistics Canada did not return a usable series");
  }

  const points = (series.vectorDataPoint ?? [])
    .filter((point) => point.value !== null && point.statusCode !== 9)
    .map((point) => {
      const rawValue = Number(point.value);
      return {
        period: point.refPerRaw || point.refPer,
        rawValue,
        scalarFactorCode: point.scalarFactorCode,
        valueCad: rawValue * scalarMultiplier(point.scalarFactorCode),
        releaseTime: point.releaseTime,
        statusCode: point.statusCode,
      };
    })
    .filter((point) => Number.isFinite(point.valueCad));

  if (!points.length) throw new Error("Statistics Canada returned no public data points for this series");

  const latestRelease =
    points.map((point) => point.releaseTime).filter(Boolean).sort().at(-1) ?? metadata.releaseTime ?? null;

  return {
    status: "live",
    source: {
      publisher: "Statistics Canada",
      tableId: TABLE_ID,
      productId: PRODUCT_ID,
      title:
        metadata.cubeTitleEn ||
        "Merchandise imports and exports, customs-based, by free trade agreement and by commodity",
      url: TABLE_URL,
      licenceUrl: LICENCE_URL,
      retrievedAt: new Date().toISOString(),
      latestRelease,
      frequency: "Monthly",
      basis: "Customs basis, not seasonally adjusted",
    },
    query: {
      flow: requestedFlow,
      agreement: agreementMember.memberNameEn,
      commodity: { id: String(commodityMember.memberId), label: commodityMember.memberNameEn },
    },
    coordinate,
    seriesTitle: info.SeriesTitleEn || [flowMember.memberNameEn, agreementMember.memberNameEn, commodityMember.memberNameEn].join("; "),
    points,
    options: {
      flows: ["Imports", "Exports"],
      commodities: options,
    },
    limitations: [
      "This series measures customs-basis merchandise trade, not addressable market demand, sales, profitability or regulatory eligibility.",
      "Commodity groups follow Statistics Canada's NAPCS classification and may be broader than a specific product.",
      "The CETA country group and its composition are defined by Statistics Canada for this table; consult the official table notes before using the series for formal analysis.",
      "Statistics Canada may revise previously released observations. This interface requests the publisher's current series when loaded.",
    ],
  };
}
