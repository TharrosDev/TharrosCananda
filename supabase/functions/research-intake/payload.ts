// Pure payload checks for the research-intake function (no Deno APIs, so vitest can import it).

export type IntakeRequest = {
  reference: string; submittedAt: string; companyName: string; country: string; website: string; email: string;
  product: string; industry: string; description: string; hsCode: string; objectives: string[]; researchNeed: string; context: string;
};

const textFields = ["submittedAt", "companyName", "country", "website", "email", "product", "industry", "description", "hsCode", "researchNeed", "context"] as const;

/** The signed body as the site sends it, or null; checked before anything is stored or emailed. */
export function parseIntake(body: string): IntakeRequest | null {
  let r: Record<string, unknown>;
  try {
    r = JSON.parse(body);
  } catch {
    return null;
  }
  if (!r || typeof r !== "object" || Array.isArray(r)) return null;
  if (typeof r.reference !== "string" || !/^[0-9a-f-]{36}$/i.test(r.reference)) return null;
  if (textFields.some((key) => typeof r[key] !== "string")) return null;
  if (!r.companyName || !r.email || Number.isNaN(Date.parse(r.submittedAt as string))) return null;
  if (!Array.isArray(r.objectives) || !r.objectives.every((item) => typeof item === "string")) return null;
  return r as IntakeRequest;
}

/** Collapses CR/LF and other control characters so a value cannot break an email header. */
export const oneLine = (value: string) => value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
