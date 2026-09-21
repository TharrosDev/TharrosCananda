import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { publications, publicationTypes } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";

export const metadata: Metadata = {
  title: "Research",
  description: "Independent research by Tharros Canada on trade, defence, energy, industry and technology connecting Canada and Europe.",
  alternates: { canonical: "/research" },
};

const areaName = (slug: string) => researchAreas.find((area) => area.slug === slug)?.name ?? "";

export default function ResearchPage() {
  return (
    <>
      <PageHero
        title="Independent research by Tharros Canada."
        description="Research Tharros chooses to produce across the four areas, prepared to the same sourcing standard as commissioned work."
        index={publicationTypes.map((type) => ({ label: type.name, note: type.description }))}
        indexLabel="Publication types"
      />
      <section className="section research-index">
        {publications.length ? (
          <ol className="publication-list">
            {publications.map((item) => (
              <li key={item.slug}>
                <h2><Link href={item.url}>{item.title}</Link></h2>
                <span>{item.type} · {areaName(item.area)} · <time dateTime={item.publishedAt}>{new Date(item.publishedAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", timeZone: "UTC" })}</time> · Prepared by Tharros Canada</span>
                <p>{item.summary}</p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            <h2>First publications are in preparation.</h2>
            <p>They will appear here as they are released. Each will name its sources, period and limitations.</p>
          </div>
        )}
        <dl className="type-register">
          {publicationTypes.map((type) => (
            <div key={type.name}><dt>{type.name}</dt><dd>{type.description}</dd></div>
          ))}
        </dl>
      </section>
      <section className="closing-cta">
        <h2>Need research on a specific question?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
