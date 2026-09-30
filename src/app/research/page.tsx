import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { Suspense } from "react";
import { ResearchArchive, ResearchArchiveWithUrl } from "@/components/research-archive";
import { publications, publicationTypes } from "@/data/publications";
import { buildArchiveDocs } from "@/lib/archive";
import { researchAreas } from "@/lib/research-areas";
import { publicationCounts } from "@/lib/metrics";
import { reportAsset, reportText } from "@/lib/reports";
import "./research.css";

export const metadata: Metadata = pageMetadata({
  title: "Research database",
  description:
    "Explore the Tharros Canada research database. Search titles and full text, browse authored work, inspect sources and find original PDFs and citations.",
  path: "/research",
});

export default async function ResearchPage() {
  // Built at build time: metadata plus each PDF's extracted text, so search reaches inside reports.
  const docs = buildArchiveDocs(publications, reportAsset, reportText);
  const counts = await publicationCounts();
  const archive = { docs, areas: researchAreas, types: publicationTypes, counts };

  return (
    <>
      <header className="research-banner">
        <h1>Research database.</h1>
        <div className="research-banner-deck">
          <p>
            Find work worth reading and referencing. Search titles and full text, filter by subject
            and explore the sources behind each publication. Use Cite, PDF and Copy link to bring
            the work into your own research or professional portfolio.
          </p>
          <Link href="/authors" className="research-method-link">
            Browse author profiles <ArrowIcon />
          </Link>
        </div>
      </header>
      <section className="archive-page" aria-label="Research">
        {/* Without JavaScript (or before hydration) the default view renders; the URL-aware tool takes over after. */}
        <Suspense fallback={<ResearchArchive {...archive} />}>
          <ResearchArchiveWithUrl {...archive} />
        </Suspense>
      </section>
    </>
  );
}
