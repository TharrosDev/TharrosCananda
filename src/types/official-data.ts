export type TradeFlow = "Imports" | "Exports";

export type TradePoint = {
  period: string;
  valueCad: number;
  rawValue: number;
  scalarFactorCode: number;
  releaseTime: string;
  statusCode: number;
};

export type TradeOption = {
  id: string;
  label: string;
};

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
    retrievedAt: string;
    latestRelease: string | null;
    frequency: "Monthly";
    basis: "Customs basis, not seasonally adjusted";
  };
  query: {
    flow: TradeFlow;
    agreement: string;
    commodity: TradeOption;
  };
  coordinate: string;
  seriesTitle: string;
  points: TradePoint[];
  options: {
    flows: TradeFlow[];
    commodities: TradeOption[];
  };
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
};
