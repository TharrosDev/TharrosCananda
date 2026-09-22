export type TradeFlow = "Imports" | "Exports";

/** A publisher quality, revision or suppression marker attached to an observation. */
export type DataFlag = { code: string; label: string };

export type TradePoint = {
  /** Reference month as published (YYYY-MM-DD, always the first of the month). */
  period: string;
  valueCad: number;
  rawValue: number;
  scalarFactorCode: number;
  releaseTime: string;
  statusCode: number;
  flags: DataFlag[];
};

export type TradeOption = { id: string; label: string };

export type TradeExplorerResponse = {
  status: "live";
  source: {
    publisher: "Statistics Canada";
    tableId: "12-10-0174-01";
    productId: 12100174;
    catalogueId: 1210017401;
    title: string;
    url: string;
    licenceUrl: string;
    /** When Tharros retrieved this copy from Statistics Canada (preserved through caching). */
    retrievedAt: string;
    latestRelease: string | null;
    frequency: "Monthly";
    basis: "Customs basis, not seasonally adjusted";
  };
  query: { flow: TradeFlow; agreement: string; commodity: TradeOption };
  coordinate: string;
  vectorId: number;
  seriesTitle: string;
  points: TradePoint[];
  /** Months the publisher withheld (suppressed, not available or too unreliable), never shown as values. */
  withheld: { period: string; flags: DataFlag[] }[];
  /** Statistics Canada table notes that apply to this series. */
  notes: string[];
  options: { flows: TradeFlow[]; commodities: TradeOption[] };
  limitations: string[];
};

export type OfficialDatasetResult = {
  id: string;
  title: string;
  publisher: string;
  modified: string | null;
  url: string;
  formats: string[];
};

export type OfficialDatasetSearchResponse = {
  query: string;
  results: OfficialDatasetResult[];
  error?: string;
};
