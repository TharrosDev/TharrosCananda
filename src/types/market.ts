export type SourceMetadata = {
  publisher: string;
  dataset: string;
  url: string;
  period: string;
  lastUpdated: string;
  retrievedAt: string;
  licence: string;
  notes: string;
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
  fit: "Strong signal" | "Worth testing" | "Context dependent";
  rationale: string;
};

export type DemoMarketResult = {
  slug: string;
  query: string;
  hsCode: string;
  hsDescription: string;
  country: string;
  unit: string;
  trend: TrendPoint[];
  provinces: ProvinceShare[];
  routes: MarketRoute[];
  resources: { label: string; url: string; publisher: string }[];
  source: SourceMetadata;
  interpretation: string;
  limitations: string[];
};
