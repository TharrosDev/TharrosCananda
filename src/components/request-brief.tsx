"use client";

import { useEffect, useRef, useState } from "react";
import { publicSources } from "@/data/sources";
import { indicativeSources, type ResearchRequestPayload } from "@/lib/research-request";
import { services } from "@/lib/services";

type Props = {
  values: ResearchRequestPayload;
  step: number;
  /** The accepted request's reference; set once the intake receiver confirms it. */
  reference?: string;
  onEdit: (step: number) => void;
};

const noAdvice = "Tharros does not provide legal, tax, regulatory, lobbying or investment advice.";

/** The request as Tharros will read it, written beside the form as the visitor fills it in. */
export function RequestBrief({ values, step, reference, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false);
  const stamp = useRef<HTMLParagraphElement>(null);
  const received = Boolean(reference);
  // Phones keep the brief folded while typing; review and the receipt always show it.
  const forced = step === 2 || received;
  const open = expanded || forced;
  const service = services.find((item) => item.name === values.researchNeed);
  const sources = indicativeSources(values).flatMap(
    (publisher) => publicSources.find((source) => source.publisher === publisher) ?? [],
  );
  const keyFields = [
    values.companyName,
    values.country,
    values.email,
    values.product,
    values.description,
    values.objectives.length,
  ];
  const filled = keyFields.filter(Boolean).length;

  useEffect(() => {
    if (!received || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stamp.current?.animate([{ transform: "scale(1.1)" }, { transform: "scale(1)" }], {
      duration: 520,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    });
  }, [received]);

  // Edit only steps already completed; jumping forward would skip that step's checks.
  const edit = (target: number, what: string) =>
    !received &&
    target < step && (
      <button className="brief-edit" type="button" onClick={() => onEdit(target)}>
        Edit<span className="sr-only"> {what}</span>
      </button>
    );

  return (
    <aside className="request-brief" aria-labelledby="request-brief-heading">
      <h2 className="sr-only" id="request-brief-heading">
        Your research brief
      </h2>
      <button
        className="brief-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="request-brief-sheet"
        disabled={forced}
        onClick={() => setExpanded((value) => !value)}
      >
        <span>{open ? "Your brief" : "Preview your brief"}</span>
        <span className="brief-count">{filled} of 6 filled</span>
      </button>
      <div className="brief-sheet" id="request-brief-sheet" data-open={open || undefined}>
        <div className="brief-top">
          <span className="brief-mark">
            Tharros<span>/</span>Canada
          </span>
          {received ? (
            <p className="brief-received" ref={stamp}>
              Received · <strong>{reference!.slice(0, 8).toUpperCase()}</strong>
            </p>
          ) : (
            <p className="brief-state">Draft · not sent</p>
          )}
        </div>
        <p className={values.product ? "brief-title" : "brief-title is-blank"}>
          {values.product || "Subject, product or sector"}
        </p>
        <p className={values.description ? "brief-question" : "brief-question is-blank"}>
          {values.description || "The question, in a sentence or two."}
        </p>

        <div className="brief-block">
          <div className="brief-block-head">
            <h3>Organization</h3>
            {edit(0, "organization")}
          </div>
          <dl>
            <Row label="Prepared for" value={[values.companyName, values.country]} />
            <Row label="Contact" value={[values.email, values.website]} />
          </dl>
        </div>

        <div className="brief-block">
          <div className="brief-block-head">
            <h3>Question</h3>
            {edit(1, "question")}
          </div>
          <dl>
            <Row label="Supports" value={values.objectives} />
            <Row
              label="Service"
              value={[values.researchNeed || "Service to be suggested by Tharros"]}
            />
            <Row
              label="Industry"
              value={[values.industry, values.hsCode && `HS ${values.hsCode}`]}
            />
            {(step === 2 || values.context) && <Row label="Context" value={[values.context]} />}
          </dl>
        </div>

        <div className="brief-block">
          <h3>You would receive</h3>
          {service ? (
            <ul className="brief-list">
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="brief-note">Proposed in the written scope, sized to the question.</p>
          )}
        </div>

        <div className="brief-block">
          <h3>Indicative public sources</h3>
          {sources.length ? (
            <ul className="brief-list brief-sources">
              {sources.map((source) => (
                <li key={source.publisher}>
                  {source.publisher} <span>{source.access}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="brief-note">Listed once you choose what the research supports.</p>
          )}
          <p className="brief-note">
            Indicative. Company evidence is added where the question needs it; the written scope
            confirms the route.
          </p>
        </div>

        <footer className="brief-terms">
          <p>{noAdvice}</p>
        </footer>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: readonly (string | undefined)[] }) {
  const text = value.filter(Boolean).join(" · ");
  return (
    <div className={text ? undefined : "is-blank"}>
      <dt>{label}</dt>
      <dd>{text || <span className="sr-only">Not given yet</span>}</dd>
    </div>
  );
}
