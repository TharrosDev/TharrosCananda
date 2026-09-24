"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";

export type TraceField = "publisher" | "dataset" | "period" | "retrieved" | "licence" | "notes";
export type TraceLink = { label: string; url: string };
export type TraceRecordRow = {
  field: TraceField;
  label: string;
  definition: string;
  value: string;
  url?: string;
  more?: TraceLink[];
  items?: string[];
};
export type TracePhrase = { text: string; fields: TraceField[] };

type Props = {
  /** Passages quoted from the report; each phrase must appear verbatim in one of them. */
  passages: readonly { text: string; source: string }[];
  phrases: TracePhrase[];
  record: TraceRecordRow[];
};

type Segment = { text: string; phrase?: number };

/** Splits text around the phrases it contains, in order. A phrase that is not found is left as plain text. */
function segments(text: string, list: TracePhrase[], all: TracePhrase[]): Segment[] {
  const out: Segment[] = [];
  let rest = text;
  for (const phrase of list) {
    const at = rest.indexOf(phrase.text);
    if (at < 0) continue;
    if (at > 0) out.push({ text: rest.slice(0, at) });
    out.push({ text: phrase.text, phrase: all.indexOf(phrase) });
    rest = rest.slice(at + phrase.text.length);
  }
  if (rest) out.push({ text: rest });
  return out;
}

/**
 * A worked provenance trace: select a phrase from a published sentence and a steel leader draws from its line to
 * the record fields it rests on. Without JavaScript (or on narrow screens) the record reads on its own and the
 * active fields are named under the claim instead.
 */
export function ProvenanceTrace({ passages, phrases, record }: Props) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const animate = useRef(false);
  const activeFields = new Set(phrases[active]?.fields ?? []);
  const labelFor = (field: TraceField) => record.find((row) => row.field === field)?.label;

  const measure = useCallback(() => {
    const box = root.current;
    const button = box?.querySelector<HTMLElement>(`[data-phrase="${active}"]`);
    const text = box?.querySelector<HTMLElement>(".trace-claim");
    if (!box || !button || !text) return setPaths([]);
    const origin = box.getBoundingClientRect();
    const claimRight = text.getBoundingClientRect().right - origin.left;
    const lines = button.getClientRects();
    const line = lines[lines.length - 1];
    const targets = [...box.querySelectorAll<HTMLElement>(".trace-record > div[data-active]")];
    const next = targets.flatMap((row) => {
      const rect = row.getBoundingClientRect();
      const x1 = rect.left - origin.left - 10;
      // Stacked layout (record under the claim): no leaders, the inline "Traced to" line carries it.
      if (x1 <= claimRight + 16) return [];
      const x0 = claimRight + 12;
      const y0 = line.top + line.height / 2 - origin.top;
      const y1 = rect.top - origin.top + 21;
      const xm = Math.round(x0 + (x1 - x0) / 2);
      return [`M${x0} ${y0}H${xm}V${y1}H${x1}`];
    });
    setPaths(next);
  }, [active]);

  useEffect(() => {
    measure();
    const box = root.current;
    if (!box) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(box);
    document.fonts?.ready.then(() => measure());
    return () => observer.disconnect();
  }, [measure]);

  // Draw the leaders in after an interaction; the first render and resizes place them without motion.
  useEffect(() => {
    if (!animate.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.current?.querySelectorAll<SVGPathElement>(".trace-leaders path").forEach((path) =>
      path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 560,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      }),
    );
    animate.current = false;
  }, [paths]);

  const choose = (phrase: number) => {
    // Re-selecting the active phrase changes nothing, so it must not arm the draw for the next resize.
    if (phrase === active) return;
    animate.current = true;
    setActive(phrase);
  };

  const render = (text: string, list: TracePhrase[]) =>
    segments(text, list, phrases).map((segment, index) =>
      segment.phrase === undefined ? (
        <Fragment key={index}>{segment.text}</Fragment>
      ) : (
        // A <button> cannot wrap across lines (browsers draw it as one inline block), so the phrase is an
        // inline span that behaves as a toggle button.
        <span
          key={index}
          role="button"
          tabIndex={0}
          className="trace-phrase"
          data-phrase={segment.phrase}
          aria-pressed={segment.phrase === active}
          onClick={() => choose(segment.phrase!)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            choose(segment.phrase!);
          }}
        >
          {segment.text}
        </span>
      ),
    );

  return (
    <div className="trace" ref={root}>
      <div className="trace-claim">
        {passages.map((passage, index) => (
          <blockquote key={passage.source} className={index ? "trace-quote is-minor" : "trace-quote"}>
            <p>
              {render(
                passage.text,
                phrases.filter((phrase) => passage.text.includes(phrase.text)),
              )}
            </p>
            <cite>{passage.source}</cite>
          </blockquote>
        ))}
        <p className="trace-routed" aria-live="polite" aria-atomic="true">
          Traced to <strong>{[...activeFields].map(labelFor).filter(Boolean).join(" and ")}</strong>
        </p>
      </div>
      <dl className="trace-record">
        {record.map((row) => (
          <div key={row.field} data-active={activeFields.has(row.field) || undefined}>
            <dt>
              {row.label} <span>{row.definition}</span>
            </dt>
            <dd>
              {row.url ? (
                <a href={row.url} target="_blank" rel="noreferrer">
                  {row.value}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                row.value
              )}
              {row.items && (
                <ul>
                  {row.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {row.more && (
                <span className="trace-more">
                  {row.more.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <svg className="trace-leaders" aria-hidden="true" focusable="false">
        {paths.map((d) => (
          <path key={d} d={d} pathLength={1} />
        ))}
      </svg>
    </div>
  );
}
