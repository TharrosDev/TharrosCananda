import { emailPattern } from "@/lib/contact";
import { researchNeeds, serviceBySlug, type ResearchNeed } from "@/lib/services";
export { researchNeeds, type ResearchNeed };

export const objectives = [
  "Enter the Canadian market",
  "Enter the European market",
  "Find buyers",
  "Find a distributor or partner",
  "Understand competitors",
  "Validate demand",
  "Map a sector or supply chain",
  "Understand a policy or industrial development",
] as const;
export type Objective = (typeof objectives)[number];

export type ResearchRequestPayload = {
  companyName: string;
  country: string;
  website: string;
  email: string;
  product: string;
  industry: string;
  description: string;
  hsCode: string;
  objectives: Objective[];
  researchNeed: ResearchNeed | "";
  context: string;
  consent: boolean;
};
export type ResearchRequestErrors = Partial<Record<keyof ResearchRequestPayload, string>>;
type TextField = Exclude<keyof ResearchRequestPayload, "objectives" | "researchNeed" | "consent">;
export const maxLengths: Record<TextField, number> = {
  companyName: 160,
  country: 80,
  website: 300,
  email: 254,
  product: 200,
  industry: 120,
  description: 2000,
  hsCode: 20,
  context: 3000,
};
const textFields = Object.keys(maxLengths) as TextField[];
export const honeypotField = "fax";
// Field limits total ~6.1k chars; curly quotes and accents are up to 3 UTF-8 bytes each.
export const maxBodyBytes = 32_000;
export const emptyRequest: ResearchRequestPayload = {
  companyName: "",
  country: "",
  website: "",
  email: "",
  product: "",
  industry: "",
  description: "",
  hsCode: "",
  objectives: [],
  researchNeed: "",
  context: "",
  consent: false,
};
const hsPattern = /^[0-9][0-9.\s]*$/;

export function normalizeWebsite(value: string): string | null {
  if (!value) return "";
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`);
    if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validateResearchRequest(
  payload: Partial<ResearchRequestPayload>,
): ResearchRequestErrors {
  const errors: ResearchRequestErrors = {};
  const value = (key: TextField) => (payload[key] ?? "").trim();
  if (!value("companyName")) errors.companyName = "Enter the company name.";
  if (!value("country")) errors.country = "Enter the company’s country.";
  if (!emailPattern.test(value("email"))) errors.email = "Enter a valid business email address.";
  if (value("website") && normalizeWebsite(value("website")) === null)
    errors.website = "Enter a website address such as example.com, or leave this empty.";
  if (!value("product")) errors.product = "Describe the subject, product or sector.";
  if (value("hsCode") && !hsPattern.test(value("hsCode")))
    errors.hsCode = "Use digits and dots only, e.g. 9405.11.";
  for (const key of textFields)
    if (!errors[key] && value(key).length > maxLengths[key])
      errors[key] = `Keep this under ${maxLengths[key]} characters.`;
  if (!payload.objectives?.length) errors.objectives = "Choose at least one purpose.";
  else if (payload.objectives.some((item) => !objectives.includes(item)))
    errors.objectives = "Choose from the listed objectives.";
  if (payload.researchNeed && !researchNeeds.includes(payload.researchNeed))
    errors.researchNeed = "Choose from the listed research options or leave this blank.";
  if (payload.consent !== true)
    errors.consent = "Confirm that Tharros Canada may review this request.";
  return errors;
}

/** A saved form draft is untrusted: keep known, well-typed fields only, and never restore consent. */
export function parseRequestDraft(raw: string | null): Partial<ResearchRequestPayload> {
  let data: unknown;
  try {
    data = JSON.parse(raw ?? "");
  } catch {
    return {};
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) return {};
  const input = data as Record<string, unknown>;
  const draft: Partial<ResearchRequestPayload> = {};
  for (const key of textFields) {
    const field = input[key];
    if (typeof field === "string" && field) draft[key] = field.slice(0, maxLengths[key]);
  }
  if (Array.isArray(input.objectives)) {
    const kept = input.objectives.filter((item): item is Objective =>
      objectives.includes(item as Objective),
    );
    if (kept.length) draft.objectives = kept;
  }
  if (researchNeeds.includes(input.researchNeed as ResearchNeed))
    draft.researchNeed = input.researchNeed as ResearchNeed;
  return draft;
}

export type ParseResult =
  { ok: true; value: ResearchRequestPayload } | { ok: false; errors: ResearchRequestErrors };
export function parseResearchRequest(input: unknown): ParseResult {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return { ok: false, errors: { companyName: "The request could not be read." } };
  const raw = input as Record<string, unknown>;
  const typeErrors: ResearchRequestErrors = {};
  const value: ResearchRequestPayload = { ...emptyRequest, objectives: [] };
  for (const key of textFields) {
    const field = raw[key];
    if (field === undefined || field === null) continue;
    if (typeof field !== "string") typeErrors[key] = "Invalid value.";
    else value[key] = field.trim();
  }
  if (Array.isArray(raw.objectives) && raw.objectives.every((item) => typeof item === "string"))
    value.objectives = [...new Set(raw.objectives as Objective[])];
  else if (raw.objectives !== undefined) typeErrors.objectives = "Invalid value.";
  if (typeof raw.researchNeed === "string") value.researchNeed = raw.researchNeed as ResearchNeed;
  else if (raw.researchNeed !== undefined) typeErrors.researchNeed = "Invalid value.";
  if (typeof raw.consent === "boolean") value.consent = raw.consent;
  else if (raw.consent !== undefined) typeErrors.consent = "Invalid value.";
  const errors = { ...validateResearchRequest(value), ...typeErrors };
  if (Object.keys(errors).length) return { ok: false, errors };
  value.website = normalizeWebsite(value.website) ?? "";
  return { ok: true, value };
}

type SearchParams = Record<string, string | string[] | undefined>;
const prefillLimits = { product: maxLengths.product, hsCode: maxLengths.hsCode } as const;
function cleanParam(value: string | string[] | undefined, max: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
export function prefillFromSearchParams(params: SearchParams): Partial<ResearchRequestPayload> {
  const prefill: Partial<ResearchRequestPayload> = {};
  const service = serviceBySlug(params.service);
  if (service) prefill.researchNeed = service.name;
  const product = cleanParam(params.product, prefillLimits.product);
  if (product) prefill.product = product;
  const hs = cleanParam(params.hs, prefillLimits.hsCode);
  if (hs && hsPattern.test(hs)) prefill.hsCode = hs;
  return prefill;
}
export function requestAsEmailBody(values: ResearchRequestPayload) {
  return [
    `Company: ${values.companyName} (${values.country})`,
    values.website && `Website: ${values.website}`,
    `Email: ${values.email}`,
    `Subject: ${values.product}`,
    values.industry && `Industry: ${values.industry}`,
    values.hsCode && `HS code: ${values.hsCode}`,
    values.description && `Question: ${values.description}`,
    `Objectives: ${values.objectives.join(", ")}`,
    values.researchNeed && `Research format: ${values.researchNeed}`,
    values.context && `Context: ${values.context}`,
  ]
    .filter(Boolean)
    .join("\n");
}
export function requestResearchHref(prefill: { service?: string; product?: string; hs?: string }) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(prefill)) if (value) params.set(key, value);
  const query = params.toString();
  return query ? `/request-research?${query}` : "/request-research";
}
