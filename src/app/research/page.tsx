import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { Suspense } from "react";
import { ResearchArchive, ResearchArchiveWithUrl } from "@/components/research-archive";
import { allPublications, publicationTypes } from "@/data/publications";
import { buildArchiveDocs } from "@/lib/archive";
import { researchAreas } from "@/lib/research-areas";
import { publicationCounts } from "@/lib/metrics";
import { reportAsset, reportText } from "@/lib/reports";

export const metadata: Metadata = pageMetadata({
  title: "Research Archive",
  description:
    "Published Tharros Canada research and data notes on trade, defence, energy, industry, technology and public data across Canada and Europe, searchable in full text.",
  path: "/research",
});

export default async function ResearchPage() {
  // Built at build time: metadata plus each PDF's extracted text, so search reaches inside reports.
  const docs = buildArchiveDocs(allPublications, reportAsset, reportText);
  const counts = await publicationCounts();
  const archive = { docs, areas: researchAreas, types: publicationTypes, counts };

  return (
    <>
      <header className="research-banner">
        <h1>Published Research</h1>
      </header>
      <section className="archive-principle">
        <p>Every report records its sources, retrieval dates and limitations.</p>
        <Link href="/methodology">
          Methodology <ArrowIcon />
        </Link>
      </section>
      <section className="section section--compact archive-page">
        {/* Without JavaScript (or before hydration) the default view renders; the URL-aware tool takes over after. */}
        <Suspense fallback={<ResearchArchive {...archive} />}>
          <ResearchArchiveWithUrl {...archive} />
        </Suspense>
      </section>
      <section className="closing-cta">
        <h2>Need research on a specific question?</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
