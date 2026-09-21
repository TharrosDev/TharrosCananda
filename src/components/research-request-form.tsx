"use client";

import { cloneElement, FormEvent, type ReactElement, useMemo, useState } from "react";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { track } from "@/lib/analytics";
import {
  researchNeeds,
  type ResearchRequestPayload,
  validateResearchRequest,
} from "@/lib/research-request";

const initialState: ResearchRequestPayload = {
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

const objectives = [
  "Sell direct online",
  "Find buyers",
  "Find a distributor",
  "Sell wholesale",
  "Understand competitors",
  "Validate demand",
  "Investigate the market",
  "Plan a physical expansion",
] as const;

const stepFields: (keyof ResearchRequestPayload)[][] = [
  ["companyName", "country", "email"],
  ["product"],
  ["objectives"],
  ["researchNeed"],
];

export function ResearchRequestForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof ResearchRequestPayload, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const progress = useMemo(() => (step + 1) / 5, [step]);

  function update<K extends keyof ResearchRequestPayload>(key: K, value: ResearchRequestPayload[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function toggleObjective(value: string) {
    update(
      "objectives",
      values.objectives.includes(value)
        ? values.objectives.filter((item) => item !== value)
        : [...values.objectives, value],
    );
  }

  function next() {
    const validation = validateResearchRequest(values);
    const currentErrors = Object.fromEntries(
      Object.entries(validation).filter(([key]) => stepFields[step]?.includes(key as keyof ResearchRequestPayload)),
    );
    if (Object.keys(currentErrors).length) {
      setErrors(currentErrors);
      return;
    }
    if (step === 0) track("research_request_started");
    setStep((current) => Math.min(current + 1, 4));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateResearchRequest(values);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    setStatus("submitting");
    setServerMessage("");
    try {
      const response = await fetch("/api/research-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message ?? "The request could not be sent.");
      setStatus("success");
      track("research_request_submitted", { need: values.researchNeed });
    } catch (error) {
      setStatus("error");
      setServerMessage(error instanceof Error ? error.message : "The request could not be sent.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <span className="success-mark"><CheckIcon /></span>
        <h2>Your research request has been received.</h2>
        <p>
          Tharros Canada will review the scope and reply by email with clarifying questions, a proposed deliverable,
          an estimated price, and a suggested timeline. No call is required.
        </p>
      </div>
    );
  }

  return (
    <form className="request-form" onSubmit={submit} noValidate>
      <div className="form-progress" aria-label={`Step ${step + 1} of 5`}>
        <div><span style={{ transform: `scaleX(${progress})` }} /></div>
        <p>Step {step + 1} of 5</p>
      </div>

      {step === 0 && (
        <fieldset>
          <legend>Tell us about the company.</legend>
          <p className="field-intro">Enough context to understand who is exploring Canada. No account is created.</p>
          <FormField id="company-name" label="Company name" error={errors.companyName} required>
            <input value={values.companyName} onChange={(e) => update("companyName", e.target.value)} autoComplete="organization" />
          </FormField>
          <FormField id="company-country" label="Country" error={errors.country} required>
            <input value={values.country} onChange={(e) => update("country", e.target.value)} autoComplete="country-name" placeholder="e.g. Germany" />
          </FormField>
          <FormField id="company-website" label="Company website" hint="Optional">
            <input type="url" value={values.website} onChange={(e) => update("website", e.target.value)} autoComplete="url" placeholder="https://" />
          </FormField>
          <FormField id="business-email" label="Business email" error={errors.email} required>
            <input type="email" value={values.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
          </FormField>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset>
          <legend>What do you sell?</legend>
          <p className="field-intro">Plain language is useful. Add an HS code only if you already know it.</p>
          <FormField id="product-service" label="Product or service" error={errors.product} required>
            <input value={values.product} onChange={(e) => update("product", e.target.value)} placeholder="e.g. Industrial LED lighting" />
          </FormField>
          <FormField id="industry" label="Industry" hint="Optional">
            <input value={values.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. Commercial construction" />
          </FormField>
          <FormField id="product-description" label="Brief description" hint="Optional">
            <textarea rows={4} value={values.description} onChange={(e) => update("description", e.target.value)} placeholder="What makes the offer distinct, and who buys it today?" />
          </FormField>
          <FormField id="hs-code" label="HS code" hint="Optional — it will be verified before use">
            <input value={values.hsCode} onChange={(e) => update("hsCode", e.target.value)} inputMode="numeric" placeholder="e.g. 9405.11" />
          </FormField>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend>What are you trying to do in Canada?</legend>
          <p className="field-intro">Choose every objective that is relevant.</p>
          <div className="choice-grid" aria-describedby={errors.objectives ? "objectives-error" : undefined}>
            {objectives.map((objective) => (
              <label key={objective} className={values.objectives.includes(objective) ? "choice is-selected" : "choice"}>
                <input
                  type="checkbox"
                  checked={values.objectives.includes(objective)}
                  onChange={() => toggleObjective(objective)}
                  aria-invalid={Boolean(errors.objectives)}
                  aria-describedby={errors.objectives ? "objectives-error" : undefined}
                />
                <span className="choice-check"><CheckIcon /></span>
                <span>{objective}</span>
              </label>
            ))}
          </div>
          {errors.objectives && <p className="field-message is-error" id="objectives-error">{errors.objectives}</p>}
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend>What kind of research would help?</legend>
          <p className="field-intro">A selection helps with scoping; it does not commit you to a purchase.</p>
          <div
            className="radio-stack"
            role="radiogroup"
            aria-invalid={Boolean(errors.researchNeed)}
            aria-describedby={errors.researchNeed ? "research-error" : undefined}
          >
            {researchNeeds.map((need) => (
              <label key={need} className={values.researchNeed === need ? "radio-choice is-selected" : "radio-choice"}>
                <input
                  type="radio"
                  name="researchNeed"
                  checked={values.researchNeed === need}
                  onChange={() => update("researchNeed", need)}
                  aria-describedby={errors.researchNeed ? "research-error" : undefined}
                />
                <span><strong>{need}</strong><small>{needDescription(need)}</small></span>
              </label>
            ))}
          </div>
          {errors.researchNeed && <p className="field-message is-error" id="research-error">{errors.researchNeed}</p>}
        </fieldset>
      )}

      {step === 4 && (
        <fieldset>
          <legend>Review and add context.</legend>
          <p className="field-intro">What happens next is predictable: scope review, written clarification if needed, then a proposal.</p>
          <div className="request-summary">
            <div><span>Company</span><strong>{values.companyName}</strong><small>{values.country}</small></div>
            <div><span>Offer</span><strong>{values.product}</strong><small>{values.hsCode || "HS code not supplied"}</small></div>
            <div><span>Research</span><strong>{values.researchNeed}</strong><small>{values.objectives.join(" · ")}</small></div>
          </div>
          <FormField id="additional-context" label="Additional context" hint="Optional">
            <textarea rows={5} value={values.context} onChange={(e) => update("context", e.target.value)} placeholder="Timing, target province, existing sales, constraints, or the decision this research needs to support." />
          </FormField>
          <label className="consent-row">
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(e) => update("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "consent-error" : undefined}
            />
            <span>I consent to Tharros Canada reviewing this information to respond to my request. No marketing consent is implied.</span>
          </label>
          {errors.consent && <p className="field-message is-error" id="consent-error">{errors.consent}</p>}
        </fieldset>
      )}

      {status === "error" && (
        <div className="form-error" role="alert">
          <strong>The request was not sent.</strong>
          <p>{serverMessage}</p>
        </div>
      )}

      <div className="form-actions">
        {step > 0 && <button className="button-secondary" type="button" onClick={() => setStep((current) => current - 1)}>Back</button>}
        {step < 4 ? (
          <button className="button-primary" type="button" onClick={next}>Continue <ArrowIcon /></button>
        ) : (
          <button className="button-primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending request…" : "Submit research request"}<ArrowIcon />
          </button>
        )}
      </div>
    </form>
  );
}

function FormField({ id, label, hint, error, required, children }: { id: string; label: string; hint?: string; error?: string; required?: boolean; children: ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }> }) {
  const errorId = `${id}-error`;
  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}{required && <em>Required</em>}{hint && <small>{hint}</small>}</span>
      {cloneElement(children, {
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && <span className="field-message is-error" id={errorId}>{error}</span>}
    </label>
  );
}

function needDescription(need: string) {
  if (need === "Canada Market Scan") return "Structure, demand signals, geography, channels and commercial context.";
  if (need === "Buyer & Distributor Intelligence") return "A manually verified set of relevant Canadian organizations.";
  if (need === "Competitor Intelligence") return "Offerings, positioning, geography, channels and evidence.";
  return "Tharros will suggest the smallest useful starting point.";
}
