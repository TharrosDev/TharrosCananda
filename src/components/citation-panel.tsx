"use client";

import { useMemo, useState } from "react";
import { buildCitation, citationStyles, type CitationInput, type CitationStyle } from "@/lib/citation";

export function CitationPanel({ input }: { input: CitationInput }) {
  const [style, setStyle] = useState<CitationStyle>("apa");
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => buildCitation(style, input), [style, input]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied by the browser; the citation text remains selectable.
    }
  }

  return (
    <div className="citation-panel">
      <div className="citation-tabs" role="tablist" aria-label="Citation style">
        {citationStyles.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={style === item.id}
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
    </div>
  );
}
