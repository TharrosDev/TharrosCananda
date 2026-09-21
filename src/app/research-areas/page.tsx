import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { researchAreas } from "@/lib/research-areas";
import { requestResearchHref } from "@/lib/research-request";

export const metadata: Metadata = {
  title: "Expertise",
  description: "Trade and economic integration, defence and security, energy and industry, and technology: the four areas Tharros Canada researches between Canada and Europe.",
  alternates: { canonical: "/research-areas" },
};

export default function ResearchAreasPage() {
  return (
    <>
      <PageHero
        variant="document"
        title="Four areas of expertise, one relationship."
        description="The areas organize commissioned work and future public research. Questions often cross more than one."
        index={researchAreas.map((area) => ({ label: area.name, href: `#${area.slug}` }))}
      />
      <div className="page-shell area-sections">
        {researchAreas.map((area, index) => (
          <section key={area.slug} id={area.slug} className="area-section" aria-labelledby={`${area.slug}-title`}>
            <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2 id={`${area.slug}-title`}>{area.name}</h2>
              <p>{area.scope}</p>
              <div className="evidence-register">
                <h3>Evidence commonly examined</h3>
                <ul>{area.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
            <div>
              <h3>Example questions</h3>
              <ul>{area.questions.map((question) => <li key={question}>{question}</li>)}</ul>
              <Link
                className="text-link"
                href={requestResearchHref({ service: "commissioned-research", context: `Research area: ${area.name}.` })}
              >
                Commission research in this area <ArrowIcon />
              </Link>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
