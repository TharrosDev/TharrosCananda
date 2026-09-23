import { CitationPanel } from "@/components/citation-panel";
import type { CitationInput } from "@/lib/citation";

export function CiteButton({ input, slug }: { input: CitationInput; slug?: string }) {
  return (
    <details className="cite-popover">
      <summary>Cite</summary>
      <div className="cite-popover-body">
        <CitationPanel input={input} slug={slug} />
      </div>
    </details>
  );
}
