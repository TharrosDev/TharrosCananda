export const researchNeeds = [
  "Canada Market Scan",
  "Buyer & Distributor Intelligence",
  "Competitor Intelligence",
  "Not sure yet",
] as const;

export type ResearchNeed = (typeof researchNeeds)[number];

export type ResearchRequestPayload = {
  companyName: string;
  country: string;
  website: string;
  email: string;
  product: string;
  industry: string;
  description: string;
  hsCode: string;
  objectives: string[];
  researchNeed: ResearchNeed | "";
  context: string;
  consent: boolean;
};

export function validateResearchRequest(payload: Partial<ResearchRequestPayload>) {
  const errors: Partial<Record<keyof ResearchRequestPayload, string>> = {};
  if (!payload.companyName?.trim()) errors.companyName = "Enter the company name.";
  if (!payload.country?.trim()) errors.country = "Enter the company’s country.";
  if (!payload.email?.trim() || !/^\S+@\S+\.\S+$/.test(payload.email)) {
    errors.email = "Enter a valid business email address.";
  }
  if (!payload.product?.trim()) errors.product = "Describe the product or service.";
  if (!payload.objectives?.length) errors.objectives = "Choose at least one Canadian objective.";
  if (!payload.researchNeed) errors.researchNeed = "Choose a research option or select “Not sure yet”.";
  if (!payload.consent) errors.consent = "Confirm that Tharros Canada may review this request.";
  return errors;
}
