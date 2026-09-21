"use client";

import { cloneElement, FormEvent, type ReactElement, useEffect, useRef, useState } from "react";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { track } from "@/lib/analytics";
import {
  emptyRequest,
  honeypotField,
  maxLengths,
  objectives,
  type Objective,
  researchNeeds,
  type ResearchRequestErrors,
  type ResearchRequestPayload,
  requestAsEmailBody,
  validateResearchRequest,
} from "@/lib/research-request";
import { needSummary } from "@/lib/services";

const totalSteps = 5;

const stepFields: (keyof ResearchRequestPayload)[][] = [
  ["companyName", "country", "website", "email"],
  ["product", "industry", "description", "hsCode"],
  ["objectives"],
  ["researchNeed"],
  ["context", "consent"],
];

const stepOf = (key: string) => Math.max(0, stepFields.findIndex((fields) => fields.includes(key as keyof ResearchRequestPayload)));

type Props = {
  initial?: Partial<ResearchRequestPayload>;
  contactEmail: string | null;
};

export function ResearchRequestForm({ initial = {}, contactEmail }: Props) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ResearchRequestPayload>({ ...emptyRequest, ...initial });
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<ResearchRequestErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const moved = useRef(false);
  const preselectedNeed = initial.researchNeed;

  // Move focus to the new step's legend so keyboard and screen-reader users land on the question.
  useEffect(() => {
    if (!moved.current) return;
    formRef.current?.querySelector<HTMLElement>("legend")?.focus();
  }, [step]);

  // After validation fails, focus the first invalid control.
  useEffect(() => {
    if (Object.values(errors).some(Boolean)) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], input[aria-describedby$="-error"]')?.focus();
    }
  }, [errors]);

  function goTo(nextStep: number) {
    moved.current = true;
    setStep(nextStep);
  }

  function update<K extends keyof ResearchRequestPayload>(key: K, value: ResearchRequestPayload[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function toggleObjective(value: Objective) {
    update(
      "objectives",
      values.objectives.includes(value) ? values.objectives.filter((item) => item !== value) : [...values.objectives, value],
    );
  }

  function next() {
    const validation = validateResearchRequest(values);
    const currentErrors = Object.fromEntries(
      Object.entries(validation).filter(([key]) => stepFields[step].includes(key as keyof ResearchRequestPayload)),
    );
    if (Object.keys(currentErrors).length) {
      setErrors(currentErrors);
      return;
    }
    if (step === 0) track("research_request_started");
    goTo(Math.min(step + 1, totalSteps - 1));
  }

  function showErrors(validation: ResearchRequestErrors) {
    setErrors(validation);
    const first = Object.keys(validation)[0];
    if (first && stepOf(first) !== step) goTo(stepOf(first));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateResearchRequest(values);
    if (Object.keys(validation).length) {
      showErrors(validation);
      return;
    }
    setStatus("submitting");
    setServerMessage("");
    try {
      const response = await fetch("/api/research-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [honeypotField]: trap }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; errors?: ResearchRequestErrors };
      if (response.status === 422 && data.errors) {
        setStatus("idle");
        showErrors(data.errors);
        return;
      }
      if (!response.ok) throw new Error(data.message);
      setStatus("success");
      track("research_request_submitted", { need: values.researchNeed });
    } catch (error) {
      setStatus("error");
      setServerMessage(
        error instanceof Error && error.message ? error.message : "We couldn’t send your request right now. Your answers are still in the form.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <span className="success-mark"><CheckIcon /></span>
        <h2>Your research request has been received.</h2>
        <p>Nothing has been purchased. Here is what happens next:</p>
        <ol className="success-steps">
          <li>Tharros Canada reviews your request.</li>
          <li>You receive a reply by email at <strong>{values.email}</strong> with any clarifying questions, the proposed deliverable, a price and an estimated timeline.</li>
          <li>Research begins only after you approve that written scope. No call is required.</li>
        </ol>
        {contactEmail && <p>To add information in the meantime, write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>}
      </div>
    );
  }

  const mailto = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(`Research request: ${values.companyName}`)}&body=${encodeURIComponent(requestAsEmailBody(values))}`
    : null;

  return (
    <form className="request-form" onSubmit={submit} noValidate ref={formRef}>
      <div className="form-progress">
        <div
          role="progressbar"
          aria-label="Request progress"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={step + 1}
          aria-valuetext={`Step ${step + 1} of ${totalSteps}`}
        >
          <span style={{ transform: `scaleX(${(step + 1) / totalSteps})` }} />
        </div>
        <p aria-hidden="true">Step {step + 1} of {totalSteps}</p>
      </div>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div className="form-trap" aria-hidden="true">
        <label htmlFor="request-fax">Fax</label>
        <input id="request-fax" name={honeypotField} tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      {step === 0 && (
        <fieldset>
          <legend tabIndex={-1}>Who is the research for?</legend>
          <p className="field-intro">No account is created.</p>
          <FormField id="company-name" label="Organization" error={errors.companyName} required>
            <input value={values.companyName} onChange={(e) => update("companyName", e.target.value)} autoComplete="organization" maxLength={maxLengths.companyName} />
          </FormField>
          <FormField id="company-country" label="Country" error={errors.country} required>
            <input value={values.country} onChange={(e) => update("country", e.target.value)} autoComplete="country-name" placeholder="e.g. Germany" maxLength={maxLengths.country} />
          </FormField>
          <FormField id="company-website" label="Company website" hint="Optional" error={errors.website}>
            <input type="url" value={values.website} onChange={(e) => update("website", e.target.value)} autoComplete="url" placeholder="example.com" maxLength={maxLengths.website} />
          </FormField>
          <FormField id="business-email" label="Business email" error={errors.email} required>
            <input type="email" value={values.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" maxLength={maxLengths.email} />
          </FormField>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset>
          <legend tabIndex={-1}>What should we research?</legend>
          <p className="field-intro">Plain language is fine.</p>
          <FormField id="product-service" label="Subject, product or sector" error={errors.product} required>
            <input value={values.product} onChange={(e) => update("product", e.target.value)} placeholder="e.g. Critical-mineral offtake in Quebec" maxLength={maxLengths.product} />
          </FormField>
          <FormField id="industry" label="Industry" hint="Optional" error={errors.industry}>
            <input value={values.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. Commercial construction" maxLength={maxLengths.industry} />
          </FormField>
          <FormField id="product-description" label="The question in a sentence or two" hint="Optional" error={errors.description}>
            <textarea rows={4} value={values.description} onChange={(e) => update("description", e.target.value)} placeholder="What do you need to know, and what decision does it support?" maxLength={maxLengths.description} />
          </FormField>
          <FormField id="hs-code" label="HS code" hint="Optional, for product research" error={errors.hsCode}>
            <input value={values.hsCode} onChange={(e) => update("hsCode", e.target.value)} inputMode="decimal" placeholder="e.g. 9405.11" maxLength={maxLengths.hsCode} />
          </FormField>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset aria-describedby={errors.objectives ? "objectives-error" : undefined}>
          <legend tabIndex={-1}>What is the research for?</legend>
          <p className="field-intro">Choose all that apply.</p>
          <div className="choice-grid">
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
        <fieldset aria-describedby={errors.researchNeed ? "research-error" : undefined}>
          <legend tabIndex={-1}>Which kind of research fits?</legend>
          <p className="field-intro">
            {preselectedNeed
              ? `${preselectedNeed} is preselected from the page you came from. You can change it.`
              : "A selection helps with scoping; it does not commit you to a purchase."}
          </p>
          <div className="radio-stack">
            {researchNeeds.map((need) => (
              <label key={need} className={values.researchNeed === need ? "radio-choice is-selected" : "radio-choice"}>
                <input
                  type="radio"
                  name="researchNeed"
                  checked={values.researchNeed === need}
                  onChange={() => update("researchNeed", need)}
                  aria-describedby={errors.researchNeed ? "research-error" : undefined}
                />
                <span><strong>{need}</strong><small>{needSummary(need)}</small></span>
              </label>
            ))}
          </div>
          {errors.researchNeed && <p className="field-message is-error" id="research-error">{errors.researchNeed}</p>}
        </fieldset>
      )}

      {step === 4 && (
        <fieldset>
          <legend tabIndex={-1}>Review and send.</legend>
          <p className="field-intro">Tharros replies in writing with a proposed scope, price and timeline.</p>
          <div className="request-summary">
            <div><span>Organization</span><strong>{values.companyName}</strong><small>{values.country}</small></div>
            <div><span>Subject</span><strong>{values.product}</strong><small>{values.hsCode || "HS code not supplied"}</small></div>
            <div><span>Research</span><strong>{values.researchNeed}</strong><small>{values.objectives.join(" · ")}</small></div>
          </div>
          <FormField id="additional-context" label="Additional context" hint="Optional" error={errors.context}>
            <textarea rows={5} value={values.context} onChange={(e) => update("context", e.target.value)} placeholder="Timing, geography, constraints, or anything already known." maxLength={maxLengths.context} />
          </FormField>
          <label className="consent-row">
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(e) => update("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "consent-error" : undefined}
            />
            <span>I consent to Tharros Canada reviewing this information to respond to my request. This is not consent to marketing.</span>
          </label>
          {errors.consent && <p className="field-message is-error" id="consent-error">{errors.consent}</p>}
        </fieldset>
      )}

      {status === "error" && (
        <div className="form-error" role="alert">
          <strong>The request was not sent.</strong>
          <p>{serverMessage}</p>
          {mailto ? (
            <p>
              You can try again, or <a href={mailto}>send the same details by email</a> to {contactEmail}. Your email app opens with the request filled in.
            </p>
          ) : (
            <p>Nothing you entered has been lost. Please try again in a few minutes.</p>
          )}
        </div>
      )}

      <div className="form-actions">
        {step > 0 && <button className="button-secondary" type="button" onClick={() => goTo(step - 1)}>Back</button>}
        {step < totalSteps - 1 ? (
          <button className="button-primary" type="button" onClick={next}>Continue <ArrowIcon /></button>
        ) : (
          <button className="button-primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending request…" : status === "error" ? "Try again" : "Submit research request"}<ArrowIcon />
          </button>
        )}
      </div>
    </form>
  );
}

function FormField({ id, label, hint, error, required, children }: { id: string; label: string; hint?: string; error?: string; required?: boolean; children: ReactElement<{ id?: string; required?: boolean; "aria-invalid"?: boolean; "aria-describedby"?: string }> }) {
  const errorId = `${id}-error`;
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}{required && <em>Required</em>}{hint && <small>{hint}</small>}</label>
      {cloneElement(children, {
        id,
        required,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && <span className="field-message is-error" id={errorId}>{error}</span>}
    </div>
  );
}
