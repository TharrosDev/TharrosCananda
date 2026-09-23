"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildCitation,
  citationStyles,
  type CitationInput,
  type CitationStyle,
} from "@/lib/citation";
import { researchLicence } from "@/lib/licence";
import { sendMetric } from "@/lib/metrics-client";

/** `slug` is set only for counted publications: a successful copy then records one citation. */
export function CitationPanel({ input, slug }: { input: CitationInput; slug?: string }) {
  const [style, setStyle] = useState<CitationStyle>("apa");
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => buildCitation(style, input), [style, input]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (slug) sendMetric(slug, "cite");
    } catch {
      // Clipboard access can be denied by the browser; the citation text remains selectable.
    }
  }

  return (
    <div className="citation-panel">
      <div className="citation-tabs" role="group" aria-label="Citation style">
        {citationStyles.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={style === item.id}
            className="citation-tab"
            onClick={() => setStyle(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="citation-text">{text}</p>
      <button type="button" className="citation-copy" onClick={handleCopy}>
        {copied ? "Copied" : "Copy citation"}
      </button>
      <p className="citation-licence">
        Published under {researchLicence.short}: reuse and adapt with attribution.{" "}
        <Link href="/copyright">Licence terms</Link>
      </p>
      <span className="sr-only" role="status">
        {copied ? "Citation copied" : ""}
      </span>
    </div>
  );
}
