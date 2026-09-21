/** Whether a result contains synthetic sample values or data retrieved from a publisher. */
export type DataStatus = "demo" | "live";

export type SourceMetadata = {
  id: string;
  publisher: string;
  dataset: string;
  url: string;
  period: string;
  /** ISO 8601 date the publisher last updated the dataset; null when not applicable (e.g. samples). */
  lastUpdated: string | null;
  /** ISO 8601 date Tharros retrieved the data; null when nothing was retrieved. */
  retrievedAt: string | null;
  licence: string;
  notes: string;
};

/** Every evidence block names the sources it came from and may carry its own caveats. */
type Evidence = {
  sourceIds: string[];
  limitations?: string[];
};

export type TrendPoint = {
  year: string;
  value: number;
};

export type ProvinceShare = {
  province: string;
  value: number;
};

export type MarketRoute = {
  name: string;
  /** Neutral prompt describing what would need to be examined; never a recommendation. */
  question: string;
};

export type OfficialResource = { label: string; url: string; publisher: string };

export type MarketResult = {
  status: DataStatus;
  slug: string;
  query: string;
  hsCode: string;
  hsDescription: string;
  trend: Evidence & { unit: string; points: TrendPoint[] };
  provinces: Evidence & { unit: string; shares: ProvinceShare[] };
  routes: Evidence & { items: MarketRoute[] };
  resources: Evidence & { items: OfficialResource[] };
  sources: SourceMetadata[];
  interpretation: string;
  limitations: string[];
};

export type MarketSearchOutcome =
  | { kind: "found"; result: MarketResult }
  | { kind: "not-found"; query: string }
  | { kind: "error"; message: string };

/**
 * Boundary between the UI and whatever supplies market evidence.
 * The demo provider is synchronous in practice; the contract is async so a live adapter can fetch.
 */
export type MarketDataProvider = {
  status: DataStatus;
  listSamples(): MarketResult[];
  search(query: string): Promise<MarketSearchOutcome>;
};
