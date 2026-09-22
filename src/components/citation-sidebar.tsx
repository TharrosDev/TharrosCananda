import { CitationPanel } from "@/components/citation-panel";
import type { CitationInput } from "@/lib/citation";

export function CitationSidebar({ input }: { input: CitationInput }) {
  return (
    <aside className="citation-sidebar" aria-label="Cite this report">
      <div className="citation-sidebar-sticky">
        <p className="citation-sidebar-label">Cite this report</p>
        <CitationPanel input={input} />
      </div>
    </aside>
  );
}
