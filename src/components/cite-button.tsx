import { CitationPanel } from "@/components/citation-panel";
import type { CitationInput } from "@/lib/citation";

export function CiteButton({ input }: { input: CitationInput }) {
  return (
    <details className="cite-popover">
      <summary>Cite</summary>
      <div className="cite-popover-body">
        <CitationPanel input={input} />
      </div>
    </details>
  );
}
